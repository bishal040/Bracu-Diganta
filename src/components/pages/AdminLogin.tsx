import React, { useState, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ADMIN_EMAIL = 'istiak.ahmmed.bishal@g.bracu.ac.bd';

export const AdminLogin: React.FC = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const userCredential = await signInWithPopup(auth, provider);
      
      if (userCredential.user.email !== ADMIN_EMAIL) {
        await firebaseSignOut(auth);
        throw new Error(`Access denied for ${userCredential.user.email}. Admin only.`);
      }
      
      navigate('/admin/dashboard');
    } catch (err: any) {
      // Ignore pop-up closed by user errors
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Failed to login with Google');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef2f5] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 md:p-10 shadow-[0_20px_40px_rgba(0,0,0,0.1)] text-center">
        <div className="mb-8">
          <h1 className="text-3xl font-orbitron font-black text-gray-900 uppercase">Admin Access</h1>
          <p className="text-gray-500 font-mono text-xs mt-2 tracking-widest uppercase">BRACU Diganta</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl font-mono text-xs border border-red-100 text-left">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-800 rounded-full px-6 py-4 text-sm font-mono font-bold tracking-[0.1em] uppercase transition-all duration-300 hover:bg-gray-50 hover:border-gray-300 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          {loading ? 'Authenticating...' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  );
};
