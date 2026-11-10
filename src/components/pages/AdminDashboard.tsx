import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, Download, Users, X, FileText, ExternalLink, ChevronDown, CheckCircle2, Star, XCircle, RotateCcw, CheckSquare, Square, BookOpen } from 'lucide-react';
import { AdminBlogManager } from './AdminBlogManager';

type ApplicationStatus = 'applied' | 'shortlisted' | 'selected' | 'rejected';

interface Application {
  _id: string;
  fullName: string;
  universityEmail: string;
  personalEmail: string;
  studentId: string;
  department: string;
  currentSemester: string;
  completedCredits?: string;
  teamType: string;
  firstPreference: string;
  firstPreferenceSubsection?: string;
  secondPreference?: string;
  secondPreferenceSubsection?: string;
  whyDiganta: string;
  aspectsOfInterest: string;
  clubInvolvement?: string;
  softwareTools?: string[];
  comfortableTasks?: string[];
  technicalSkills?: string[];
  portfolioLinks?: string;
  skillsOrStrengths: string;
  relevantExperiences: string;
  hopeToLearn: string;
  createdAt: string;
  status?: ApplicationStatus;
  cvFileUrl?: string;
  cvFilename?: string;
  cvFile?: {
    filename: string;
    contentType: string;
  };
}

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  applied: { label: 'Applied', color: 'text-gray-600', bg: 'bg-gray-100', border: 'border-gray-200', icon: <FileText size={14} /> },
  shortlisted: { label: 'Shortlisted', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: <Star size={14} /> },
  selected: { label: 'Selected', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: <CheckCircle2 size={14} /> },
  rejected: { label: 'Rejected', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: <XCircle size={14} /> },
};

const TAB_LIST: { key: 'all' | ApplicationStatus; label: string }[] = [
  { key: 'all', label: 'All Applications' },
  { key: 'shortlisted', label: 'Shortlisted' },
  { key: 'selected', label: 'Selected' },
  { key: 'rejected', label: 'Rejected' },
];

export const AdminDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [adminSection, setAdminSection] = useState<'recruitment' | 'blogs'>(() =>
    searchParams.get('tab') === 'recruitment' ? 'recruitment' : 'blogs'
  );
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isCvVisible, setIsCvVisible] = useState(false);
  const [cvUrls, setCvUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'blogs') setAdminSection('blogs');
    else if (tab === 'recruitment') setAdminSection('recruitment');
  }, [searchParams]);

  // Filtering and Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [teamFilter, setTeamFilter] = useState('All');

  // Pipeline State
  const [activeTab, setActiveTab] = useState<'all' | ApplicationStatus>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);

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
  const apiUrl = import.meta.env.VITE_CAREERS_API_URL;

  useEffect(() => {
    if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
      if (user) signOut(); // Force sign out if not admin
      navigate('/admin/login');
      return;
    }

    // Fetch applications from the backend
    const fetchApplications = async () => {
      try {
        const token = await user.getIdToken();
        const response = await fetch(`${apiUrl}/applications`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setApplications(data.applications);
        }
      } catch (error) {
        console.error('Failed to fetch applications', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user, navigate, signOut]);

  // --- Status Update Handlers ---
  const updateStatus = async (id: string, status: ApplicationStatus) => {
    setStatusUpdating(id);
    try {
      const token = await user?.getIdToken();
      const response = await fetch(`${apiUrl}/applications/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (data.success) {
        setApplications(prev => prev.map(app => app._id === id ? { ...app, status } : app));
        if (selectedApp && selectedApp._id === id) {
          setSelectedApp({ ...selectedApp, status });
        }
      }
    } catch (error) {
      console.error('Failed to update status', error);
    } finally {
      setStatusUpdating(null);
    }
  };

  const bulkUpdateStatus = async (status: ApplicationStatus) => {
    if (selectedIds.size === 0) return;
    setStatusUpdating('bulk');
    try {
      const ids = Array.from(selectedIds);
      const token = await user?.getIdToken();
      const response = await fetch(`${apiUrl}/applications/bulk-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ids, status }),
      });
      const data = await response.json();
      if (data.success) {
        setApplications(prev => prev.map(app => ids.includes(app._id) ? { ...app, status } : app));
        setSelectedIds(new Set());
      }
    } catch (error) {
      console.error('Failed to bulk update status', error);
    } finally {
      setStatusUpdating(null);
    }
  };

  // --- CV Fetch Handler ---
  const [isCvLoading, setIsCvLoading] = useState(false);
  const fetchCv = async (app: Application) => {
    if (app.cvFileUrl) return app.cvFileUrl;
    if (cvUrls[app._id]) return cvUrls[app._id];

    if (!user) return '';
    setIsCvLoading(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${apiUrl}/cv/${app._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        setCvUrls(prev => ({ ...prev, [app._id]: objectUrl }));
        return objectUrl;
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCvLoading(false);
    }
    return '';
  };

  const getAppStatus = (app: Application): ApplicationStatus => app.status || 'applied';

  // --- Selection Handlers ---
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = (apps: Application[]) => {
    const allIds = apps.map(a => a._id);
    const allSelected = allIds.every(id => selectedIds.has(id));
    if (allSelected) {
      setSelectedIds(prev => {
        const next = new Set(prev);
        allIds.forEach(id => next.delete(id));
        return next;
      });
    } else {
      setSelectedIds(prev => {
        const next = new Set(prev);
        allIds.forEach(id => next.add(id));
        return next;
      });
    }
  };

  if (loading && adminSection === 'recruitment') {
    return <div className="min-h-screen bg-[#eef2f5] flex items-center justify-center font-mono text-gray-500">Loading Dashboard...</div>;
  }

  // Derived Statistics
  const totalApps = applications.length;
  const shortlistedCount = applications.filter(a => getAppStatus(a) === 'shortlisted').length;
  const selectedCount = applications.filter(a => getAppStatus(a) === 'selected').length;
  const rejectedCount = applications.filter(a => getAppStatus(a) === 'rejected').length;

  // Derived Filtered List
  const filteredApplications = applications.filter(app => {
    const matchesSearch =
      (app.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.studentId || '').includes(searchQuery) ||
      (app.universityEmail || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = departmentFilter === 'All' ? true : app.department === departmentFilter;
    const matchesTeam = teamFilter === 'All' ? true : app.teamType === teamFilter;
    const matchesTab = activeTab === 'all' ? true : getAppStatus(app) === activeTab;

    return matchesSearch && matchesDept && matchesTeam && matchesTab;
  });

  const uniqueDepartments = ['All', ...Array.from(new Set(applications.map(a => a.department)))];

  const exportToCSV = () => {
    const headers = [
      'Date', 'Status', 'Name', 'Student ID', 'University Email', 'Personal Email',
      'Department', 'Semester', 'Completed Credits', 'Team Type', 'First Preference', 'First Preference Subsection',
      'Second Preference', 'Second Preference Subsection', 'Technical Skills', 'Software Tools', 'Comfortable Tasks',
      'Club Involvement', 'Portfolio Links', 'Why Diganta', 'Aspects of Interest',
      'Skills/Strengths', 'Relevant Experiences', 'Hope to Learn'
    ];

    // Helper function to safely escape strings for CSV (handles commas, quotes, and newlines)
    const escapeCSV = (str: string | undefined | null) => {
      if (!str) return '""';
      const stringified = String(str);
      // If the string contains a quote, comma, or newline, wrap in quotes and escape inner quotes
      if (stringified.includes('"') || stringified.includes(',') || stringified.includes('\n')) {
        return `"${stringified.replace(/"/g, '""')}"`;
      }
      return `"${stringified}"`;
    };

    const csvData = filteredApplications.map(app => [
      escapeCSV(new Date(app.createdAt).toLocaleDateString()),
      escapeCSV(getAppStatus(app)),
      escapeCSV(app.fullName),
      escapeCSV(app.studentId),
      escapeCSV(app.universityEmail),
      escapeCSV(app.personalEmail),
      escapeCSV(app.department),
      escapeCSV(app.currentSemester),
      escapeCSV(app.completedCredits),
      escapeCSV(app.teamType),
      escapeCSV(app.firstPreference),
      escapeCSV(app.firstPreferenceSubsection),
      escapeCSV(app.secondPreference),
      escapeCSV(app.secondPreferenceSubsection),
      escapeCSV(app.technicalSkills?.join(', ')),
      escapeCSV(app.softwareTools?.join(', ')),
      escapeCSV(app.comfortableTasks?.join(', ')),
      escapeCSV(app.clubInvolvement),
      escapeCSV(app.portfolioLinks),
      escapeCSV(app.whyDiganta),
      escapeCSV(app.aspectsOfInterest),
      escapeCSV(app.skillsOrStrengths),
      escapeCSV(app.relevantExperiences),
      escapeCSV(app.hopeToLearn)
    ]);

    const csvString = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diganta-applications-${activeTab}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#eef2f5] text-gray-900 px-8 py-24 md:px-16 md:pt-32 md:pb-16">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-orbitron font-black text-gray-900 uppercase">Admin Dashboard</h1>
            <p className="text-gray-500 font-mono text-sm mt-2">
              {adminSection === 'blogs' ? 'Markdown (.md) Blog & GitHub CMS' : 'Recruitment Pipeline'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Section Switcher: Blog Manager vs Recruitment */}
            <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-full shadow-sm border border-gray-200">
              <button
                onClick={() => {
                  setAdminSection('blogs');
                  setSearchParams({ tab: 'blogs' }, { replace: true });
                }}
                className={`px-5 py-2 rounded-full font-mono text-xs font-bold tracking-wider uppercase flex items-center gap-2 transition-all ${
                  adminSection === 'blogs'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BookOpen size={14} /> Blog Manager (.MD)
              </button>

              <button
                onClick={() => {
                  setAdminSection('recruitment');
                  setSearchParams({ tab: 'recruitment' }, { replace: true });
                }}
                className={`px-5 py-2 rounded-full font-mono text-xs font-bold tracking-wider uppercase flex items-center gap-2 transition-all ${
                  adminSection === 'recruitment'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users size={14} /> Recruitment ({totalApps})
              </button>
            </div>

            <button
              onClick={() => signOut()}
              className="px-6 py-2.5 bg-gray-900 text-white rounded-full font-mono text-xs font-bold tracking-[0.15em] uppercase hover:bg-red-600 transition-colors shadow-sm"
            >
              Sign Out
            </button>
          </div>
        </div>

        {adminSection === 'blogs' ? (
          <AdminBlogManager />
        ) : (
          <>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex items-center gap-4">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Total</p>
              <p className="text-2xl font-bold text-gray-900">{totalApps}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex items-center gap-4">
            <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
              <Star size={24} />
            </div>
            <div>
              <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Shortlisted</p>
              <p className="text-2xl font-bold text-amber-600">{shortlistedCount}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex items-center gap-4">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Selected</p>
              <p className="text-2xl font-bold text-emerald-600">{selectedCount}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex items-center gap-4">
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl">
              <XCircle size={24} />
            </div>
            <div>
              <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
            </div>
          </div>
        </div>

        {/* Pipeline Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {TAB_LIST.map(tab => {
            const count = tab.key === 'all' ? totalApps : applications.filter(a => getAppStatus(a) === tab.key).length;
            return (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setSelectedIds(new Set()); }}
                className={`px-5 py-2.5 rounded-full font-mono text-xs font-bold tracking-wider uppercase transition-all ${activeTab === tab.key
                  ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20'
                  : 'bg-white text-gray-500 hover:bg-gray-100 shadow-sm'
                  }`}
              >
                {tab.label} <span className={`ml-1.5 ${activeTab === tab.key ? 'text-gray-300' : 'text-gray-400'}`}>({count})</span>
              </button>
            );
          })}
        </div>

        {/* Bulk Action Toolbar */}
        {selectedIds.size > 0 && (
          <div className="bg-gray-900 rounded-2xl p-4 mb-6 flex flex-wrap items-center gap-3 animate-in slide-in-from-top duration-200 shadow-xl">
            <span className="text-white font-mono text-xs font-bold tracking-wider uppercase">
              {selectedIds.size} selected
            </span>
            <div className="h-4 w-px bg-gray-600"></div>
            <button
              onClick={() => bulkUpdateStatus('shortlisted')}
              disabled={statusUpdating === 'bulk'}
              className="px-4 py-2 bg-amber-500 text-white rounded-full font-mono text-[10px] font-bold tracking-wider uppercase hover:bg-amber-600 transition-colors disabled:opacity-50"
            >
              <Star size={12} className="inline mr-1.5 -mt-0.5" /> Shortlist
            </button>
            <button
              onClick={() => bulkUpdateStatus('selected')}
              disabled={statusUpdating === 'bulk'}
              className="px-4 py-2 bg-emerald-500 text-white rounded-full font-mono text-[10px] font-bold tracking-wider uppercase hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              <CheckCircle2 size={12} className="inline mr-1.5 -mt-0.5" /> Select
            </button>
            <button
              onClick={() => bulkUpdateStatus('rejected')}
              disabled={statusUpdating === 'bulk'}
              className="px-4 py-2 bg-red-500 text-white rounded-full font-mono text-[10px] font-bold tracking-wider uppercase hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              <XCircle size={12} className="inline mr-1.5 -mt-0.5" /> Reject
            </button>
            <button
              onClick={() => bulkUpdateStatus('applied')}
              disabled={statusUpdating === 'bulk'}
              className="px-4 py-2 bg-gray-600 text-white rounded-full font-mono text-[10px] font-bold tracking-wider uppercase hover:bg-gray-500 transition-colors disabled:opacity-50"
            >
              <RotateCcw size={12} className="inline mr-1.5 -mt-0.5" /> Reset
            </button>
            <div className="flex-1"></div>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="px-4 py-2 text-gray-400 hover:text-white font-mono text-[10px] font-bold tracking-wider uppercase transition-colors"
            >
              Clear
            </button>
          </div>
        )}

        {/* Search and Filters Toolbar */}
        <div className="bg-white rounded-3xl p-4 md:p-6 mb-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col lg:flex-row gap-4 justify-between items-center z-20 relative">

          {/* Search */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by Name, ID, or Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Filters */}
            <div className="flex gap-4 flex-1 sm:flex-none">
              <div className="relative flex-1 sm:flex-none">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 bg-gray-50 border border-gray-100 rounded-full text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium cursor-pointer"
                >
                  {uniqueDepartments.map(dept => (
                    <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>
                  ))}
                </select>
              </div>

              <div className="relative flex-1 sm:flex-none">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <select
                  value={teamFilter}
                  onChange={(e) => setTeamFilter(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 bg-gray-50 border border-gray-100 rounded-full text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium cursor-pointer"
                >
                  <option value="All">All Teams</option>
                  <option value="Technical">Technical</option>
                  <option value="Non-Technical">Non-Technical</option>
                </select>
              </div>
            </div>

            {/* Export Button */}
            <button
              onClick={exportToCSV}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#eef2f5] text-gray-900 rounded-full text-sm font-bold tracking-wide hover:bg-gray-200 transition-colors shrink-0"
            >
              <Download size={18} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-[0_20px_40px_rgba(0,0,0,0.05)] overflow-x-auto relative z-10">
          {applications.length === 0 ? (
            <div className="text-center text-gray-500 font-mono py-10">No applications received yet.</div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center text-gray-500 font-mono py-10">No applications match your search criteria.</div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-4 w-10 pl-2">
                    <button
                      onClick={() => toggleSelectAll(filteredApplications)}
                      className="text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      {filteredApplications.length > 0 && filteredApplications.every(a => selectedIds.has(a._id)) ? (
                        <CheckSquare size={18} className="text-blue-500" />
                      ) : (
                        <Square size={18} />
                      )}
                    </button>
                  </th>
                  <th className="pb-4 font-mono text-xs text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="pb-4 font-mono text-xs text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="pb-4 font-mono text-xs text-gray-400 uppercase tracking-wider">Student ID</th>
                  <th className="pb-4 font-mono text-xs text-gray-400 uppercase tracking-wider">Dept</th>
                  <th className="pb-4 font-mono text-xs text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="pb-4 font-mono text-xs text-gray-400 uppercase tracking-wider">Preference</th>
                  <th className="pb-4 font-mono text-xs text-gray-400 uppercase tracking-wider text-right">Resume</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => {
                  const status = getAppStatus(app);
                  const config = STATUS_CONFIG[status];
                  const isChecked = selectedIds.has(app._id);
                  return (
                    <React.Fragment key={app._id}>
                      <tr
                        onClick={() => setSelectedApp(app)}
                        className={`border-b border-gray-50 hover:bg-blue-50/50 transition-colors cursor-pointer group ${isChecked ? 'bg-blue-50/30' : ''}`}
                      >
                        <td className="py-4 pl-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => toggleSelect(app._id)}
                            className="text-gray-400 hover:text-blue-500 transition-colors"
                          >
                            {isChecked ? (
                              <CheckSquare size={18} className="text-blue-500" />
                            ) : (
                              <Square size={18} />
                            )}
                          </button>
                        </td>
                        <td className="py-4 font-mono text-sm text-gray-500">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 font-medium">{app.fullName}</td>
                        <td className="py-4 font-mono text-sm text-gray-600">{app.studentId}</td>
                        <td className="py-4 font-mono text-sm text-gray-600">{app.department}</td>
                        <td className="py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${config.bg} ${config.color} ${config.border} border rounded-full text-[10px] font-bold tracking-wider uppercase`}>
                            {config.icon}
                            {config.label}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className="px-3 py-1 bg-[#eef2f5] text-gray-600 rounded-full font-mono text-[10px] tracking-wider uppercase font-bold">
                            {app.firstPreference}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          {(app.cvFileUrl || app.cvFile) ? (
                            <>
                              {/* Desktop Button - Opens Drawer + Split Screen */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedApp(app);
                                  setIsCvVisible(true);
                                }}
                                className="hidden lg:inline-block px-5 py-2 bg-[#10B981] text-white rounded-full font-mono text-[10px] font-bold tracking-[0.1em] uppercase hover:bg-[#059669] transition-colors shadow-sm"
                              >
                                View CV
                              </button>
                              <a
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  const url = await fetchCv(app);
                                  if (url) window.open(url, '_blank');
                                }}
                                rel="noopener noreferrer"
                                className="inline-block lg:hidden px-5 py-2 bg-[#10B981] text-white rounded-full font-mono text-[10px] font-bold tracking-[0.1em] uppercase hover:bg-[#059669] transition-colors shadow-sm"
                              >
                                View CV
                              </a>
                            </>
                          ) : (
                            <span className="inline-block px-4 py-2 bg-gray-100 text-gray-400 rounded-full font-mono text-[10px] font-bold tracking-[0.1em] uppercase shadow-sm border border-gray-200">
                              No CV
                            </span>
                          )}
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        </>
        )}
      </div>

      {/* Slide-over Modal for Application Details */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => { setSelectedApp(null); setIsCvVisible(false); }}
          ></div>

          {/* Left Side: PDF Viewer */}
          {isCvVisible && (selectedApp.cvFileUrl || selectedApp.cvFile) && (
            <div className="relative flex-1 bg-slate-800/90 backdrop-blur p-4 lg:p-8 animate-in slide-in-from-left duration-300 flex-col z-10 border-r border-slate-700 hidden lg:flex">
              <div className="flex justify-between items-center text-white mb-4">
                <h3 className="font-orbitron font-bold tracking-widest uppercase text-sm">Resume Preview</h3>
                <button onClick={() => setIsCvVisible(false)} className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-300 hover:text-white"><X size={20} /></button>
              </div>
              {isCvLoading ? (
                <div className="w-full h-full rounded-xl shadow-2xl bg-white flex items-center justify-center text-slate-400 font-mono">
                  Loading secure PDF...
                </div>
              ) : (
                <iframe
                  src={selectedApp.cvFileUrl || cvUrls[selectedApp._id]}
                  className="w-full h-full rounded-xl shadow-2xl bg-white"
                  title="CV Preview"
                ></iframe>
              )}
            </div>
          )}

          {/* Empty Space Filler (so clicking outside still works when CV is closed) */}
          {(!isCvVisible || (!selectedApp.cvFileUrl && !selectedApp.cvFile)) && (
            <div className="flex-1 hidden lg:block" onClick={() => { setSelectedApp(null); setIsCvVisible(false); }}></div>
          )}

          {/* Panel */}
          <div className="relative w-full lg:w-[48rem] max-w-full bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 z-20">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50/50">
              <div>
                <h2 className="text-xl font-orbitron font-bold text-gray-900">{selectedApp.fullName}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm font-mono text-gray-500">{selectedApp.studentId} • {selectedApp.department}</p>
                  {(() => {
                    const s = getAppStatus(selectedApp);
                    const c = STATUS_CONFIG[s];
                    return (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 ${c.bg} ${c.color} ${c.border} border rounded-full text-[9px] font-bold tracking-wider uppercase`}>
                        {c.icon} {c.label}
                      </span>
                    );
                  })()}
                </div>
              </div>
              <div className="flex items-center gap-4">
                {(selectedApp.cvFileUrl || selectedApp.cvFile) && (
                  <>
                    {/* Desktop Toggle Button */}
                    <button
                      onClick={async () => {
                        if (!isCvVisible) await fetchCv(selectedApp);
                        setIsCvVisible(!isCvVisible);
                      }}
                      className="hidden lg:flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-full font-mono text-[11px] font-bold tracking-widest uppercase hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
                    >
                      <ExternalLink size={14} />
                      {isCvVisible ? 'Hide CV' : 'View CV'}
                    </button>
                    <button
                      onClick={async () => {
                        const url = await fetchCv(selectedApp);
                        if (url) window.open(url, '_blank');
                      }}
                      className="flex lg:hidden items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-full font-mono text-[11px] font-bold tracking-widest uppercase hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
                    >
                      <ExternalLink size={14} />
                      View CV
                    </button>
                  </>
                )}
                <button
                  onClick={() => { setSelectedApp(null); setIsCvVisible(false); }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Status Action Bar */}
            <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/80 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold mr-2">Move to:</span>
              {getAppStatus(selectedApp) !== 'shortlisted' && (
                <button
                  onClick={() => updateStatus(selectedApp._id, 'shortlisted')}
                  disabled={statusUpdating === selectedApp._id}
                  className="px-4 py-1.5 bg-amber-500 text-white rounded-full font-mono text-[10px] font-bold tracking-wider uppercase hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Star size={12} /> Shortlist
                </button>
              )}
              {getAppStatus(selectedApp) !== 'selected' && (
                <button
                  onClick={() => updateStatus(selectedApp._id, 'selected')}
                  disabled={statusUpdating === selectedApp._id}
                  className="px-4 py-1.5 bg-emerald-500 text-white rounded-full font-mono text-[10px] font-bold tracking-wider uppercase hover:bg-emerald-600 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  <CheckCircle2 size={12} /> Select
                </button>
              )}
              {getAppStatus(selectedApp) !== 'rejected' && (
                <button
                  onClick={() => updateStatus(selectedApp._id, 'rejected')}
                  disabled={statusUpdating === selectedApp._id}
                  className="px-4 py-1.5 bg-red-500 text-white rounded-full font-mono text-[10px] font-bold tracking-wider uppercase hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  <XCircle size={12} /> Reject
                </button>
              )}
              {getAppStatus(selectedApp) !== 'applied' && (
                <button
                  onClick={() => updateStatus(selectedApp._id, 'applied')}
                  disabled={statusUpdating === selectedApp._id}
                  className="px-4 py-1.5 bg-gray-400 text-white rounded-full font-mono text-[10px] font-bold tracking-wider uppercase hover:bg-gray-500 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  <RotateCcw size={12} /> Reset
                </button>
              )}
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8" data-lenis-prevent>

              {/* Top Row: Basic Info & Preferences */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Basic Info Card */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
                  <h3 className="font-orbitron font-bold text-xs tracking-wider uppercase text-blue-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span> Basic Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">University Email</p>
                      <p className="text-sm font-medium text-gray-900">{selectedApp.universityEmail}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">Personal Email</p>
                      <p className="text-sm font-medium text-gray-900">{selectedApp.personalEmail}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">Semester</p>
                        <p className="text-sm font-medium text-gray-900">{selectedApp.currentSemester}</p>
                      </div>
                      {selectedApp.completedCredits && (
                        <div>
                          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">Credits</p>
                          <p className="text-sm font-medium text-gray-900">{selectedApp.completedCredits}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Preferences Card */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
                  <h3 className="font-orbitron font-bold text-xs tracking-wider uppercase text-blue-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span> Application Preferences
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">Team Type</p>
                      <span className="inline-block px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-bold">{selectedApp.teamType}</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">First Choice</p>
                      <p className="text-sm font-bold text-gray-900">{selectedApp.firstPreference}</p>
                      {selectedApp.firstPreferenceSubsection && <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1"><ChevronDown size={12} className="-rotate-90" /> {selectedApp.firstPreferenceSubsection}</p>}
                    </div>
                    {selectedApp.secondPreference && (
                      <div>
                        <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">Second Choice</p>
                        <p className="text-sm font-bold text-gray-900">{selectedApp.secondPreference}</p>
                        {selectedApp.secondPreferenceSubsection && <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1"><ChevronDown size={12} className="-rotate-90" /> {selectedApp.secondPreferenceSubsection}</p>}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Skills & Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(selectedApp.technicalSkills?.length || selectedApp.softwareTools?.length || selectedApp.comfortableTasks?.length) ? (
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
                    <h3 className="font-orbitron font-bold text-xs tracking-wider uppercase text-blue-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span> Skills & Tools
                    </h3>
                    <div className="space-y-3">
                      {selectedApp.technicalSkills && selectedApp.technicalSkills.length > 0 && (
                        <div>
                          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1.5">Technical Skills</p>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedApp.technicalSkills.map((skill, i) => (
                              <span key={i} className="px-2 py-1 bg-white border border-gray-200 rounded-md text-[11px] font-medium text-gray-700">{skill}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedApp.softwareTools && selectedApp.softwareTools.length > 0 && (
                        <div>
                          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1.5">Software Tools</p>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedApp.softwareTools.map((tool, i) => (
                              <span key={i} className="px-2 py-1 bg-white border border-gray-200 rounded-md text-[11px] font-medium text-gray-700">{tool}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedApp.comfortableTasks && selectedApp.comfortableTasks.length > 0 && (
                        <div>
                          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1.5">Comfortable Tasks</p>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedApp.comfortableTasks.map((task, i) => (
                              <span key={i} className="px-2 py-1 bg-white border border-gray-200 rounded-md text-[11px] font-medium text-gray-700">{task}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}

                {(selectedApp.clubInvolvement || selectedApp.portfolioLinks) && (
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
                    <h3 className="font-orbitron font-bold text-xs tracking-wider uppercase text-blue-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span> Additional Links
                    </h3>
                    <div className="space-y-3">
                      {selectedApp.clubInvolvement && (
                        <div>
                          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">Club Involvements</p>
                          <p className="text-sm font-medium text-gray-800 whitespace-pre-wrap">{selectedApp.clubInvolvement}</p>
                        </div>
                      )}
                      {selectedApp.portfolioLinks && (
                        <div>
                          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">Portfolio & Links</p>
                          <a href={selectedApp.portfolioLinks} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600 hover:underline break-all whitespace-pre-wrap">
                            {selectedApp.portfolioLinks}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Written Responses */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="font-orbitron font-bold text-sm tracking-wider uppercase text-gray-900">Written Responses</h3>

                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <p className="text-xs font-mono text-blue-600 uppercase tracking-wider font-bold mb-3">Why Diganta?</p>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedApp.whyDiganta}</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <p className="text-xs font-mono text-blue-600 uppercase tracking-wider font-bold mb-3">Aspects of Interest</p>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedApp.aspectsOfInterest}</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <p className="text-xs font-mono text-blue-600 uppercase tracking-wider font-bold mb-3">Skills & Strengths</p>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedApp.skillsOrStrengths}</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <p className="text-xs font-mono text-blue-600 uppercase tracking-wider font-bold mb-3">Relevant Experiences</p>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedApp.relevantExperiences}</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <p className="text-xs font-mono text-blue-600 uppercase tracking-wider font-bold mb-3">Hopes to Learn</p>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedApp.hopeToLearn}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
