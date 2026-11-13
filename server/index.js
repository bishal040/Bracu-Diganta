import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import multer from 'multer';
import Contact from './models/Contact.js';
import Application from './models/Application.js';

const execFileAsync = promisify(execFile);

// Multer config: store file in memory (Buffer), max 2 MB for CVs
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }
});

// Multer config for blog images & .md files: up to 10 MB
const blogUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Get current directory for dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const FIREBASE_PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID || 'bracu-diganta';

// Lightweight Firebase ID token verification using Google's public JWKS
// (Replaces the heavy firebase-admin SDK to save ~100-150MB of RAM)
const GOOGLE_JWKS = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com')
);

const ADMIN_EMAILS = [
  'istiak.ahmmed.bishal@g.bracu.ac.bd',
  'bracudiganta@gmail.com',
  'mountashiourtasnim@gmail.com',
  'hasna.hena.jui@g.bracu.ac.bd',
  'chironjeet.joy@bracu.ac.bd',
  'md.mountashiour.rahman@g.bracu.ac.bd',
  'tanvir.ahmed.tonmoy@g.bracu.ac.bd',
  'atib.mohammad@bracu.ac.bd',
  'istiakbishal040@gmail.com'
];

const requireAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }
  const token = authHeader.split('Bearer ')[1];
  try {
    const { payload } = await jwtVerify(token, GOOGLE_JWKS, {
      issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
      audience: FIREBASE_PROJECT_ID,
    });
    if (!payload.email || !ADMIN_EMAILS.includes(payload.email)) {
      return res.status(403).json({ error: 'Forbidden: Admins only' });
    }
    req.user = payload;
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/blogs', express.static(path.join(__dirname, '../public/blogs')));

// Health check endpoint for Cron-job to prevent Render sleep
app.get('/', (req, res) => res.status(200).send('API is running. Render server is awake!'));

// MongoDB Connection
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn('MONGODB_URI not set; running in static/Markdown-only mode.');
      return;
    }
    // Disable Mongoose internal buffering to reduce memory footprint
    mongoose.set('bufferCommands', false);
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 5,          // Limit connection pool
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }
};

// API Routes
app.post('/api/contact', async (req, res) => {
  try {
    const { organization, email, type, message } = req.body;

    // Validate inputs
    if (!organization || !email || !type || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create new contact submission
    const newContact = new Contact({
      organization,
      email,
      type,
      message
    });

    await newContact.save();
    
    console.log('New Contact Submission Saved!');
    res.status(201).json({ success: true, message: 'Partnership request submitted successfully!' });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

app.post('/api/careers', upload.single('cvFile'), async (req, res) => {
  try {
    const data = { ...req.body };

    // Parse JSON string fields (arrays sent via FormData)
    const jsonFields = ['softwareTools', 'comfortableTasks', 'technicalSkills', 'technicalSkillsOtherMap'];
    for (const field of jsonFields) {
      if (typeof data[field] === 'string') {
        try { data[field] = JSON.parse(data[field]); } catch { /* keep as string */ }
      }
    }

    const requiredFields = [
      'universityEmail', 'fullName', 'studentId', 'personalEmail', 'department', 'currentSemester',
      'teamType', 'firstPreference', 'secondPreference', 'whyDiganta', 'aspectsOfInterest',
      'skillsOrStrengths', 'relevantExperiences', 'hopeToLearn'
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return res.status(400).json({ error: `Field ${field} is required` });
      }
    }

    const applicationData = {
      ...data,
      softwareTools: data.softwareTools || [],
      comfortableTasks: data.comfortableTasks || [],
      completedCredits: data.completedCredits,
      technicalSkills: data.technicalSkills || [],
      cvFileUrl: data.cvFileUrl || '',
      cvFilename: data.cvFilename || (req.file ? req.file.originalname : '')
    };

    // Store CV file directly in MongoDB if uploaded via multer
    if (req.file) {
      applicationData.cvFile = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        filename: req.file.originalname
      };
    }

    const newApplication = new Application(applicationData);
    await newApplication.save();
    
    console.log('New Recruitment Application Saved!');
    res.status(201).json({ success: true, message: 'Application submitted successfully!' });
  } catch (error) {
    console.error('Error saving application:', error);
    res.status(500).json({ error: 'Failed to process application' });
  }
});

// Route to view CV directly from MongoDB (For backward compatibility with old applications)
app.get('/api/careers/cv/:id', requireAdmin, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application || !application.cvFile || !application.cvFile.data) {
      return res.status(404).json({ error: 'CV not found' });
    }
    
    // Set headers so the browser displays the PDF natively instead of downloading it
    res.set('Content-Type', application.cvFile.contentType);
    res.set('Content-Disposition', `inline; filename="${application.cvFile.filename}"`);
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.send(application.cvFile.data);
  } catch (error) {
    console.error('Error fetching CV:', error);
    res.status(500).json({ error: 'Failed to retrieve CV' });
  }
});

// Route to fetch all applications (for Admin panel)
app.get('/api/careers/applications', requireAdmin, async (req, res) => {
  try {
    // Select all fields except cvFile.data to avoid downloading massive binary data
    const applications = await Application.find({}).select('-cvFile.data').sort({ createdAt: -1 });
    res.status(200).json({ success: true, applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to retrieve applications' });
  }
});

// Route to update a single application's recruitment status
app.patch('/api/careers/applications/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['applied', 'shortlisted', 'selected', 'rejected'];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, select: '-cvFile.data' }
    );

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    console.log(`Application ${req.params.id} status updated to: ${status}`);
    res.status(200).json({ success: true, application });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Route to bulk-update multiple applications' recruitment status
app.patch('/api/careers/applications/bulk-status', requireAdmin, async (req, res) => {
  try {
    const { ids, status } = req.body;
    const validStatuses = ['applied', 'shortlisted', 'selected', 'rejected'];

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'ids must be a non-empty array' });
    }
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const result = await Application.updateMany(
      { _id: { $in: ids } },
      { status }
    );

    console.log(`Bulk status update: ${result.modifiedCount} applications updated to ${status}`);
    res.status(200).json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error('Error in bulk status update:', error);
    res.status(500).json({ error: 'Failed to bulk update status' });
  }
});

// ============================================================================
// MARKDOWN (.md) BLOG & GITHUB AUTO-COMMIT ROUTES (Zero-MongoDB Architecture)
// ============================================================================

const PROJECT_ROOT = path.resolve(__dirname, '..');
const SRC_BLOGS_DIR = path.join(PROJECT_ROOT, 'src/content/blogs');
const PUBLIC_BLOGS_DIR = path.join(PROJECT_ROOT, 'public/blogs/posts');
const PUBLIC_IMAGES_DIR = path.join(PROJECT_ROOT, 'public/blogs/images');

// Ensure blog directories exist on startup
for (const dir of [SRC_BLOGS_DIR, PUBLIC_BLOGS_DIR, PUBLIC_IMAGES_DIR]) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function sanitizeSlug(slug) {
  return String(slug || '')
    .toLowerCase()
    .trim()
    .replace(/\.md$/i, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function runGitCommand(args) {
  const enhancedPath = `/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:${process.env.PATH || ''}`;
  const { stdout, stderr } = await execFileAsync('git', args, {
    cwd: PROJECT_ROOT,
    env: { ...process.env, PATH: enhancedPath }
  });
  return { stdout: stdout.trim(), stderr: stderr.trim() };
}

async function rebuildBlogManifest() {
  try {
    const files = await fs.readdir(SRC_BLOGS_DIR);
    const mdFiles = files.filter(f => f.endsWith('.md')).sort();
    const posts = await Promise.all(
      mdFiles.map(async (filename) => {
        const filePath = path.join(SRC_BLOGS_DIR, filename);
        const rawMarkdown = await fs.readFile(filePath, 'utf-8');
        return {
          filename,
          slug: filename.replace(/\.md$/i, ''),
          rawMarkdown
        };
      })
    );
    const manifestPath = path.join(PROJECT_ROOT, 'public/blogs/manifest.json');
    await fs.writeFile(
      manifestPath,
      JSON.stringify({ updatedAt: new Date().toISOString(), posts }, null, 2),
      'utf-8'
    );
  } catch (err) {
    console.warn('Failed to rebuild blog manifest:', err.message);
  }
}

async function commitAndOptionallyPush({ commitMessage, autoPush = false, remote = 'origin', branch }) {
  const gitResult = {
    committed: false,
    pushed: false,
    branch: '',
    commitHash: '',
    message: '',
    error: null
  };

  try {
    const branchRes = await runGitCommand(['rev-parse', '--abbrev-ref', 'HEAD']);
    gitResult.branch = branch || branchRes.stdout || 'main';

    // Stage blog markdown files and blog images
    await runGitCommand(['add', 'src/content/blogs', 'public/blogs']);

    const statusRes = await runGitCommand(['status', '--porcelain', 'src/content/blogs', 'public/blogs']);
    if (!statusRes.stdout) {
      gitResult.message = 'No file changes to commit (working tree clean).';
      return gitResult;
    }

    const msg = commitMessage || `chore(blog): update blog posts via Admin Panel`;
    await runGitCommand(['commit', '-m', msg]);
    gitResult.committed = true;

    const hashRes = await runGitCommand(['rev-parse', '--short', 'HEAD']);
    gitResult.commitHash = hashRes.stdout;
    gitResult.message = `Committed (${gitResult.commitHash}) on branch ${gitResult.branch}`;

    if (autoPush) {
      try {
        await runGitCommand(['push', '-u', remote, gitResult.branch]);
        gitResult.pushed = true;
        gitResult.message = `Committed (${gitResult.commitHash}) & pushed to ${remote}/${gitResult.branch}`;
      } catch (pushErr) {
        gitResult.error = `Committed locally (${gitResult.commitHash}), push note: ${pushErr.message}`;
      }
    }
  } catch (err) {
    gitResult.error = err.message;
  }

  return gitResult;
}

// 1. GET all .md blog files directly from filesystem
app.get('/api/blogs', async (req, res) => {
  try {
    const files = await fs.readdir(SRC_BLOGS_DIR);
    const mdFiles = files.filter(f => f.endsWith('.md'));
    const posts = await Promise.all(
      mdFiles.map(async (filename) => {
        const filePath = path.join(SRC_BLOGS_DIR, filename);
        const rawMarkdown = await fs.readFile(filePath, 'utf-8');
        const stats = await fs.stat(filePath);
        return {
          filename,
          slug: filename.replace(/\.md$/i, ''),
          rawMarkdown,
          updatedAt: stats.mtime.toISOString()
        };
      })
    );
    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error('Error reading .md blogs:', error);
    res.status(500).json({ error: 'Failed to read markdown blog files' });
  }
});

// 2. CREATE / UPLOAD / UPDATE a .md blog file and optionally commit & push to GitHub
app.post('/api/blogs', requireAdmin, async (req, res) => {
  try {
    const {
      slug,
      oldSlug,
      rawMarkdown,
      autoCommit = true,
      autoPush = false,
      commitMessage,
      remote = 'origin'
    } = req.body;

    const cleanSlug = sanitizeSlug(slug);
    if (!cleanSlug || !rawMarkdown) {
      return res.status(400).json({ error: 'Valid slug and rawMarkdown content are required' });
    }

    // If renaming slug during edit, remove old .md file first
    if (oldSlug && sanitizeSlug(oldSlug) && sanitizeSlug(oldSlug) !== cleanSlug) {
      const cleanOld = sanitizeSlug(oldSlug);
      const oldSrcPath = path.join(SRC_BLOGS_DIR, `${cleanOld}.md`);
      const oldPubPath = path.join(PUBLIC_BLOGS_DIR, `${cleanOld}.md`);
      await fs.rm(oldSrcPath, { force: true });
      await fs.rm(oldPubPath, { force: true });
    }

    // Write .md file to both src/content/blogs and public/blogs/posts
    const srcFilePath = path.join(SRC_BLOGS_DIR, `${cleanSlug}.md`);
    const pubFilePath = path.join(PUBLIC_BLOGS_DIR, `${cleanSlug}.md`);
    await fs.writeFile(srcFilePath, rawMarkdown, 'utf-8');
    await fs.writeFile(pubFilePath, rawMarkdown, 'utf-8');
    await rebuildBlogManifest();

    let gitStatus = null;
    if (autoCommit) {
      gitStatus = await commitAndOptionallyPush({
        commitMessage: commitMessage || `feat(blog): save ${cleanSlug}.md via Admin Panel`,
        autoPush,
        remote
      });
    }

    res.status(200).json({
      success: true,
      slug: cleanSlug,
      filename: `${cleanSlug}.md`,
      git: gitStatus
    });
  } catch (error) {
    console.error('Error saving .md blog:', error);
    res.status(500).json({ error: 'Failed to save markdown blog file' });
  }
});

// 3. DELETE a .md blog file and optionally commit & push to GitHub
app.delete('/api/blogs/:slug', requireAdmin, async (req, res) => {
  try {
    const cleanSlug = sanitizeSlug(req.params.slug);
    if (!cleanSlug) {
      return res.status(400).json({ error: 'Invalid blog slug' });
    }

    const { autoCommit = true, autoPush = false, commitMessage, remote = 'origin' } = req.body || {};

    const srcFilePath = path.join(SRC_BLOGS_DIR, `${cleanSlug}.md`);
    const pubFilePath = path.join(PUBLIC_BLOGS_DIR, `${cleanSlug}.md`);
    await fs.rm(srcFilePath, { force: true });
    await fs.rm(pubFilePath, { force: true });
    await rebuildBlogManifest();

    let gitStatus = null;
    if (autoCommit) {
      gitStatus = await commitAndOptionallyPush({
        commitMessage: commitMessage || `chore(blog): delete ${cleanSlug}.md via Admin Panel`,
        autoPush,
        remote
      });
    }

    res.status(200).json({
      success: true,
      slug: cleanSlug,
      git: gitStatus
    });
  } catch (error) {
    console.error('Error deleting .md blog:', error);
    res.status(500).json({ error: 'Failed to delete markdown blog file' });
  }
});

// 4. LIST stored blog images in public/blogs/images/
app.get('/api/blogs/images', async (req, res) => {
  try {
    const files = await fs.readdir(PUBLIC_IMAGES_DIR);
    const imageFiles = files.filter(f => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f));
    const images = imageFiles.map(filename => ({
      filename,
      url: `/blogs/images/${filename}`
    }));
    res.status(200).json({ success: true, images });
  } catch (error) {
    res.status(500).json({ error: 'Failed to list blog images' });
  }
});

// 5. UPLOAD IMAGE for blog post (saved to public/blogs/images/)
app.post('/api/blogs/upload-image', requireAdmin, blogUpload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const ext = path.extname(req.file.originalname || '.jpg').toLowerCase() || '.jpg';
    const baseName = path
      .basename(req.file.originalname || 'image', ext)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'blog-img';

    const filename = `${Date.now()}-${baseName}${ext}`;
    const targetPath = path.join(PUBLIC_IMAGES_DIR, filename);

    await fs.writeFile(targetPath, req.file.buffer);

    const autoCommit = req.body?.autoCommit === 'true' || req.body?.autoCommit === true;
    const autoPush = req.body?.autoPush === 'true' || req.body?.autoPush === true;
    let gitStatus = null;

    if (autoCommit) {
      gitStatus = await commitAndOptionallyPush({
        commitMessage: `feat(blog): upload image ${filename}`,
        autoPush
      });
    }

    res.status(200).json({
      success: true,
      filename,
      url: `/blogs/images/${filename}`,
      git: gitStatus
    });
  } catch (error) {
    console.error('Error uploading blog image:', error);
    res.status(500).json({ error: 'Failed to upload blog image' });
  }
});

// 5. GET Git status (branch, latest commit, pending blog changes, remotes)
app.get('/api/blogs/git-status', requireAdmin, async (req, res) => {
  try {
    const branchRes = await runGitCommand(['rev-parse', '--abbrev-ref', 'HEAD']);
    const logRes = await runGitCommand(['log', '-1', '--pretty=format:%h|%s|%cr|%an']);
    const statusRes = await runGitCommand(['status', '--porcelain', 'src/content/blogs', 'public/blogs']);
    const remoteRes = await runGitCommand(['remote', '-v']);

    const [hash, subject, relativeDate, author] = (logRes.stdout || '').split('|');
    const pendingFiles = statusRes.stdout
      ? statusRes.stdout.split('\n').map(l => l.trim()).filter(Boolean)
      : [];

    res.status(200).json({
      success: true,
      branch: branchRes.stdout,
      lastCommit: { hash, subject, relativeDate, author },
      pendingFiles,
      isClean: pendingFiles.length === 0,
      remotes: remoteRes.stdout.split('\n').filter(Boolean)
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      error: error.message
    });
  }
});

// 6. POST Git Commit & Push directly from Admin Panel without terminal
app.post('/api/blogs/git-sync', requireAdmin, async (req, res) => {
  try {
    const { commitMessage, push = true, remote = 'origin', branch } = req.body || {};
    const gitResult = await commitAndOptionallyPush({
      commitMessage: commitMessage || 'chore(blog): sync blog markdown files & assets from Admin Panel',
      autoPush: push,
      remote,
      branch
    });

    // If there were no new changes to commit, but user explicitly requested push, push existing commits
    if (!gitResult.committed && push) {
      try {
        const targetBranch = branch || gitResult.branch || 'main';
        await runGitCommand(['push', '-u', remote, targetBranch]);
        gitResult.pushed = true;
        gitResult.message = `Pushed branch ${targetBranch} to ${remote}/${targetBranch}`;
      } catch (pushErr) {
        gitResult.error = `Push note: ${pushErr.message}`;
      }
    }

    res.status(200).json({ success: true, git: gitResult });
  } catch (error) {
    console.error('Error syncing with Git:', error);
    res.status(500).json({ error: error.message || 'Failed to sync with Git' });
  }
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend Server running on port ${PORT}`);
});
connectDB().catch((err) => {
  console.warn('MongoDB connection warning (Markdown blogs still active):', err.message);
});
