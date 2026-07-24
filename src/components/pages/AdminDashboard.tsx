import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Download, Users, Briefcase, Cpu, X, FileText, ExternalLink, ChevronDown } from 'lucide-react';

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
  cvFile?: {
    filename: string;
    contentType: string;
  };
}

export const AdminDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isCvVisible, setIsCvVisible] = useState(false);
  
  // Filtering and Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [teamFilter, setTeamFilter] = useState('All');

  const ADMIN_EMAIL = 'istiak.ahmmed.bishal@g.bracu.ac.bd';

  useEffect(() => {
    if (!user || user.email !== ADMIN_EMAIL) {
      if (user) signOut(); // Force sign out if not admin
      navigate('/admin/login');
      return;
    }
    
    // Fetch applications from the backend
    const fetchApplications = async () => {
      try {
        const apiUrl = import.meta.env.VITE_CAREERS_API_URL;
        const response = await fetch(`${apiUrl}/applications`);
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

  if (loading) {
    return <div className="min-h-screen bg-[#eef2f5] flex items-center justify-center font-mono text-gray-500">Loading Dashboard...</div>;
  }



  // Derived Statistics
  const totalApps = applications.length;
  const techApps = applications.filter(a => a.teamType === 'Technical Team').length;
  const nonTechApps = applications.filter(a => a.teamType === 'Non-Technical Team').length;
  
  const deptCount = applications.reduce((acc, app) => {
    acc[app.department] = (acc[app.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topDept = Object.entries(deptCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  // Derived Filtered List
  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      app.studentId.includes(searchQuery) ||
      app.universityEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDept = departmentFilter === 'All' ? true : app.department === departmentFilter;
    const matchesTeam = teamFilter === 'All' ? true : app.teamType === teamFilter;
    
    return matchesSearch && matchesDept && matchesTeam;
  });

  const uniqueDepartments = ['All', ...Array.from(new Set(applications.map(a => a.department)))];

  const exportToCSV = () => {
    const headers = [
      'Date', 'Name', 'Student ID', 'University Email', 'Personal Email', 
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
    a.download = `diganta-applications-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#eef2f5] text-gray-900 p-8 md:p-16">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-orbitron font-black text-gray-900 uppercase">Admin Dashboard</h1>
            <p className="text-gray-500 font-mono text-sm mt-2">Recruitment Applications</p>
          </div>
          <button
            onClick={() => signOut()}
            className="mt-4 md:mt-0 px-6 py-2 bg-gray-900 text-white rounded-full font-mono text-xs font-bold tracking-[0.15em] uppercase hover:bg-red-600 transition-colors shadow-sm"
          >
            Sign Out
          </button>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex items-center gap-4">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{totalApps}</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex items-center gap-4">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Cpu size={24} />
            </div>
            <div>
              <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Tech vs Non-Tech</p>
              <p className="text-2xl font-bold text-gray-900">{techApps} <span className="text-gray-300 text-lg">/</span> {nonTechApps}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex items-center gap-4">
            <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl">
              <Briefcase size={24} />
            </div>
            <div>
              <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Top Department</p>
              <p className="text-xl font-bold text-gray-900 line-clamp-1">{topDept}</p>
            </div>
          </div>
        </div>

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
                  <option value="Technical Team">Technical</option>
                  <option value="Non-Technical Team">Non-Technical</option>
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
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-4 font-mono text-xs text-gray-400 uppercase tracking-wider w-10"></th>
                  <th className="pb-4 font-mono text-xs text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="pb-4 font-mono text-xs text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="pb-4 font-mono text-xs text-gray-400 uppercase tracking-wider">Student ID</th>
                  <th className="pb-4 font-mono text-xs text-gray-400 uppercase tracking-wider">Dept</th>
                  <th className="pb-4 font-mono text-xs text-gray-400 uppercase tracking-wider">Credits</th>
                  <th className="pb-4 font-mono text-xs text-gray-400 uppercase tracking-wider">Tech Skills</th>
                  <th className="pb-4 font-mono text-xs text-gray-400 uppercase tracking-wider">Preference</th>
                  <th className="pb-4 font-mono text-xs text-gray-400 uppercase tracking-wider text-right">Resume</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => (
                  <React.Fragment key={app._id}>
                    <tr 
                      onClick={() => setSelectedApp(app)}
                      className="border-b border-gray-50 hover:bg-blue-50/50 transition-colors cursor-pointer group"
                    >
                      <td className="py-4 text-gray-400 group-hover:text-blue-500 transition-colors pl-4">
                        <FileText size={18} />
                      </td>
                      <td className="py-4 font-mono text-sm text-gray-500">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 font-medium">{app.fullName}</td>
                      <td className="py-4 font-mono text-sm text-gray-600">{app.studentId}</td>
                      <td className="py-4 font-mono text-sm text-gray-600">{app.department}</td>
                      <td className="py-4 font-mono text-sm text-gray-600">{app.completedCredits || '-'}</td>
                      <td className="py-4">
                        {app.technicalSkills && app.technicalSkills.length > 0 ? (
                          <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-semibold border border-blue-100 whitespace-nowrap">
                            {app.technicalSkills.length} skills
                          </span>
                        ) : (
                          <span className="text-gray-300 text-sm">-</span>
                        )}
                      </td>
                      <td className="py-4">
                        <span className="px-3 py-1 bg-[#eef2f5] text-gray-600 rounded-full font-mono text-[10px] tracking-wider uppercase font-bold">
                          {app.firstPreference}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        {app.cvFile ? (
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
                            {/* Mobile Button - Opens in new tab */}
                            <a
                              href={`${import.meta.env.VITE_CAREERS_API_URL}/cv/${app._id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
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
                ))}
              </tbody>
            </table>
          )}
        </div>
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
          {isCvVisible && selectedApp.cvFile && (
            <div className="relative flex-1 bg-slate-800/90 backdrop-blur p-4 lg:p-8 animate-in slide-in-from-left duration-300 flex-col z-10 border-r border-slate-700 hidden lg:flex">
               <div className="flex justify-between items-center text-white mb-4">
                  <h3 className="font-orbitron font-bold tracking-widest uppercase text-sm">Resume Preview</h3>
                  <button onClick={() => setIsCvVisible(false)} className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-300 hover:text-white"><X size={20}/></button>
               </div>
               <iframe 
                 src={`${import.meta.env.VITE_CAREERS_API_URL}/cv/${selectedApp._id}`} 
                 className="w-full h-full rounded-xl shadow-2xl bg-white" 
                 title="CV Preview"
               ></iframe>
            </div>
          )}

          {/* Empty Space Filler (so clicking outside still works when CV is closed) */}
          {(!isCvVisible || !selectedApp.cvFile) && (
            <div className="flex-1 hidden lg:block" onClick={() => { setSelectedApp(null); setIsCvVisible(false); }}></div>
          )}
          
          {/* Panel */}
          <div className="relative w-full lg:w-[48rem] max-w-full bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 z-20">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50/50">
              <div>
                <h2 className="text-xl font-orbitron font-bold text-gray-900">{selectedApp.fullName}</h2>
                <p className="text-sm font-mono text-gray-500 mt-1">{selectedApp.studentId} • {selectedApp.department}</p>
              </div>
              <div className="flex items-center gap-4">
                {selectedApp.cvFile && (
                  <>
                    {/* Desktop Toggle Button */}
                    <button
                      onClick={() => setIsCvVisible(!isCvVisible)}
                      className="hidden lg:flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-full font-mono text-[11px] font-bold tracking-widest uppercase hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
                    >
                      <ExternalLink size={14} />
                      {isCvVisible ? 'Hide CV' : 'View CV'}
                    </button>
                    {/* Mobile New Tab Button */}
                    <a
                      href={`${import.meta.env.VITE_CAREERS_API_URL}/cv/${selectedApp._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex lg:hidden items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-full font-mono text-[11px] font-bold tracking-widest uppercase hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
                    >
                      <ExternalLink size={14} />
                      View CV
                    </a>
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
                      {selectedApp.firstPreferenceSubsection && <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1"><ChevronDown size={12} className="-rotate-90"/> {selectedApp.firstPreferenceSubsection}</p>}
                    </div>
                    {selectedApp.secondPreference && (
                      <div>
                        <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">Second Choice</p>
                        <p className="text-sm font-bold text-gray-900">{selectedApp.secondPreference}</p>
                        {selectedApp.secondPreferenceSubsection && <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1"><ChevronDown size={12} className="-rotate-90"/> {selectedApp.secondPreferenceSubsection}</p>}
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
