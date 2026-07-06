import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Application {
  _id: string;
  fullName: string;
  universityEmail: string;
  personalEmail: string;
  studentId: string;
  department: string;
  currentSemester: string;
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
  portfolioLinks?: string;
  skillsOrStrengths: string;
  relevantExperiences: string;
  hopeToLearn: string;
  createdAt: string;
}

export const AdminDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);

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
        const apiUrl = import.meta.env.VITE_CAREERS_API_URL || 'http://localhost:5001/api/careers';
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

  const toggleExpand = (id: string) => {
    setExpandedAppId(expandedAppId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#eef2f5] text-gray-900 p-8 md:p-16">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
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

        {/* Applications Table */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-[0_20px_40px_rgba(0,0,0,0.05)] overflow-x-auto">
          {applications.length === 0 ? (
            <div className="text-center text-gray-500 font-mono py-10">No applications received yet.</div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-4 font-mono text-xs text-gray-400 uppercase tracking-wider w-10"></th>
                  <th className="pb-4 font-mono text-xs text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="pb-4 font-mono text-xs text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="pb-4 font-mono text-xs text-gray-400 uppercase tracking-wider">Student ID</th>
                  <th className="pb-4 font-mono text-xs text-gray-400 uppercase tracking-wider">Dept</th>
                  <th className="pb-4 font-mono text-xs text-gray-400 uppercase tracking-wider">Preference</th>
                  <th className="pb-4 font-mono text-xs text-gray-400 uppercase tracking-wider text-right">Resume</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <React.Fragment key={app._id}>
                    <tr 
                      onClick={() => toggleExpand(app._id)}
                      className="border-b border-gray-50 hover:bg-blue-50/50 transition-colors cursor-pointer group"
                    >
                      <td className="py-4 text-gray-400 group-hover:text-blue-500 transition-colors">
                        {expandedAppId === app._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </td>
                      <td className="py-4 font-mono text-sm text-gray-500">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 font-medium">{app.fullName}</td>
                      <td className="py-4 font-mono text-sm text-gray-600">{app.studentId}</td>
                      <td className="py-4 font-mono text-sm text-gray-600">{app.department}</td>
                      <td className="py-4">
                        <span className="px-3 py-1 bg-[#eef2f5] text-gray-600 rounded-full font-mono text-[10px] tracking-wider uppercase font-bold">
                          {app.firstPreference}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <a
                          href={`${import.meta.env.VITE_CAREERS_API_URL || 'http://localhost:5001/api/careers'}/cv/${app._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-block px-5 py-2 bg-[#10B981] text-white rounded-full font-mono text-[10px] font-bold tracking-[0.1em] uppercase hover:bg-[#059669] transition-colors shadow-sm"
                        >
                          View CV
                        </a>
                      </td>
                    </tr>
                    
                    {/* Expanded Details Row */}
                    {expandedAppId === app._id && (
                      <tr className="bg-slate-50/50 border-b border-gray-200">
                        <td colSpan={7} className="px-6 py-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            
                            {/* Basic Info */}
                            <div className="space-y-4">
                              <h3 className="font-orbitron font-bold text-sm uppercase text-gray-900 border-b border-gray-200 pb-2">Basic Info</h3>
                              <div>
                                <p className="text-xs font-mono text-gray-400 uppercase">Emails</p>
                                <p className="text-sm font-medium">{app.universityEmail}</p>
                                <p className="text-sm font-medium">{app.personalEmail}</p>
                              </div>
                              <div>
                                <p className="text-xs font-mono text-gray-400 uppercase">Academic</p>
                                <p className="text-sm">Semester: <span className="font-medium">{app.currentSemester}</span></p>
                              </div>
                              <div>
                                <p className="text-xs font-mono text-gray-400 uppercase">Team Type</p>
                                <p className="text-sm font-bold text-blue-600">{app.teamType}</p>
                              </div>
                            </div>

                            {/* Preferences */}
                            <div className="space-y-4">
                              <h3 className="font-orbitron font-bold text-sm uppercase text-gray-900 border-b border-gray-200 pb-2">Preferences</h3>
                              <div>
                                <p className="text-xs font-mono text-gray-400 uppercase">First Choice</p>
                                <p className="text-sm font-medium">{app.firstPreference}</p>
                                {app.firstPreferenceSubsection && <p className="text-sm text-gray-500">→ {app.firstPreferenceSubsection}</p>}
                              </div>
                              {app.secondPreference && (
                                <div>
                                  <p className="text-xs font-mono text-gray-400 uppercase">Second Choice</p>
                                  <p className="text-sm font-medium">{app.secondPreference}</p>
                                  {app.secondPreferenceSubsection && <p className="text-sm text-gray-500">→ {app.secondPreferenceSubsection}</p>}
                                </div>
                              )}
                              {app.softwareTools && app.softwareTools.length > 0 && (
                                <div>
                                  <p className="text-xs font-mono text-gray-400 uppercase">Software Tools</p>
                                  <p className="text-sm">{app.softwareTools.join(', ')}</p>
                                </div>
                              )}
                              {app.comfortableTasks && app.comfortableTasks.length > 0 && (
                                <div>
                                  <p className="text-xs font-mono text-gray-400 uppercase">Tasks</p>
                                  <p className="text-sm">{app.comfortableTasks.join(', ')}</p>
                                </div>
                              )}
                            </div>

                            {/* Links & Involvements */}
                            <div className="space-y-4">
                              <h3 className="font-orbitron font-bold text-sm uppercase text-gray-900 border-b border-gray-200 pb-2">Additional</h3>
                              {app.clubInvolvement && (
                                <div>
                                  <p className="text-xs font-mono text-gray-400 uppercase">Club Involvements</p>
                                  <p className="text-sm whitespace-pre-wrap">{app.clubInvolvement}</p>
                                </div>
                              )}
                              {app.portfolioLinks && (
                                <div>
                                  <p className="text-xs font-mono text-gray-400 uppercase">Portfolio / Links</p>
                                  <p className="text-sm text-blue-600 whitespace-pre-wrap break-all">{app.portfolioLinks}</p>
                                </div>
                              )}
                            </div>
                            
                            {/* Long Text Answers (Span full width) */}
                            <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-6 mt-4">
                              <h3 className="font-orbitron font-bold text-sm uppercase text-gray-900 border-b border-gray-200 pb-2">Written Responses</h3>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <p className="text-xs font-mono text-gray-400 uppercase mb-1">Why Diganta?</p>
                                  <div className="bg-white p-4 rounded-xl shadow-sm text-sm whitespace-pre-wrap border border-gray-100">{app.whyDiganta}</div>
                                </div>
                                <div>
                                  <p className="text-xs font-mono text-gray-400 uppercase mb-1">Aspects of Interest</p>
                                  <div className="bg-white p-4 rounded-xl shadow-sm text-sm whitespace-pre-wrap border border-gray-100">{app.aspectsOfInterest}</div>
                                </div>
                                <div>
                                  <p className="text-xs font-mono text-gray-400 uppercase mb-1">Skills & Strengths</p>
                                  <div className="bg-white p-4 rounded-xl shadow-sm text-sm whitespace-pre-wrap border border-gray-100">{app.skillsOrStrengths}</div>
                                </div>
                                <div>
                                  <p className="text-xs font-mono text-gray-400 uppercase mb-1">Relevant Experiences</p>
                                  <div className="bg-white p-4 rounded-xl shadow-sm text-sm whitespace-pre-wrap border border-gray-100">{app.relevantExperiences}</div>
                                </div>
                                <div className="md:col-span-2">
                                  <p className="text-xs font-mono text-gray-400 uppercase mb-1">Hopes to Learn</p>
                                  <div className="bg-white p-4 rounded-xl shadow-sm text-sm whitespace-pre-wrap border border-gray-100">{app.hopeToLearn}</div>
                                </div>
                              </div>
                            </div>

                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
