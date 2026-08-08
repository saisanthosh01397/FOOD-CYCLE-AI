import { User, Mail, Shield, LogOut, Settings, Calendar, Activity, Camera, Brain, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (user) {
      api.get('/users/me')
        .then(res => setProfileData(res.data))
        .catch(err => console.error('Failed to load profile details', err));
    }
  }, [user]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">User Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 glass-card p-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 text-4xl font-bold mb-4">
            {user?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <h2 className="text-xl font-bold">{user?.full_name || user?.email?.split('@')[0] || 'User'}</h2>
          <div className={`flex items-center gap-1 mt-2 text-sm font-semibold px-3 py-1 rounded-full ${user?.role === 'Administrator' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
            <Shield className="w-4 h-4" /> {user?.role || 'User'}
          </div>
        </div>

        <div className="md:col-span-2 glass-card p-6 space-y-6">
          <h3 className="text-lg font-bold border-b dark:border-slate-800 pb-2">Account Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Full Name</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border dark:border-slate-700">
                <User className="w-5 h-5 text-slate-400" />
                <span className="font-medium">{user?.full_name || 'Not logged in'}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Email Address</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border dark:border-slate-700">
                <Mail className="w-5 h-5 text-slate-400" />
                <span className="font-medium">{user?.email || 'Not logged in'}</span>
              </div>
            </div>
            
            {profileData && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Joined Date</label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border dark:border-slate-700">
                      <Calendar className="w-5 h-5 text-slate-400" />
                      <span className="font-medium">{new Date(profileData.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Last Login</label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border dark:border-slate-700">
                      <Activity className="w-5 h-5 text-slate-400" />
                      <span className="font-medium">{profileData.last_login ? new Date(profileData.last_login).toLocaleString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Account Status</label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border dark:border-slate-700">
                      {profileData.is_active ? (
                        <><CheckCircle className="w-5 h-5 text-emerald-500" /><span className="font-medium text-emerald-600 dark:text-emerald-400">Active</span></>
                      ) : (
                        <><XCircle className="w-5 h-5 text-rose-500" /><span className="font-medium text-rose-600 dark:text-rose-400">Inactive</span></>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Image Analyses</label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border dark:border-slate-700 text-slate-600 dark:text-slate-400">
                      <Camera className="w-5 h-5" />
                      <span className="font-bold text-lg">{profileData.total_image_analyses}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Predictions</label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border dark:border-slate-700 text-blue-600 dark:text-blue-400">
                      <Brain className="w-5 h-5" />
                      <span className="font-bold text-lg">{profileData.total_predictions}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="pt-4 mt-6 border-t dark:border-slate-800 flex justify-end gap-4">
            <button className="px-5 py-2.5 rounded-xl font-medium border dark:border-slate-700 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Settings className="w-4 h-4" /> Settings
            </button>
            <button 
              onClick={logout}
              className="px-5 py-2.5 rounded-xl font-medium bg-rose-500 hover:bg-rose-600 text-white flex items-center gap-2 transition-colors shadow-lg shadow-rose-500/20"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
