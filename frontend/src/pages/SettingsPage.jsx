import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Bell, Palette, Shield, Database, Save, RotateCcw, Monitor, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [loading, setLoading] = useState(false);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    // Dispatch event so Layout picks it up
    window.dispatchEvent(new Event('storage'));
  };

  const handleBackup = async () => {
    setLoading(true);
    try {
      await api.post('/system/backup');
      toast.success('Database backup created successfully');
    } catch (e) {
      toast.error('Failed to create backup');
    }
    setLoading(false);
  };

  const handleRestore = async () => {
    if (!window.confirm("Are you sure you want to restore from the latest backup? This will overwrite current data.")) return;
    setLoading(true);
    try {
      await api.post('/system/restore');
      toast.success('Database restored successfully');
    } catch (e) {
      toast.error('Failed to restore database');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account preferences and system settings.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-1">
           <button onClick={() => setActiveTab('account')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'account' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}>
             <User className="w-5 h-5" /> Account Profile
           </button>
           <button onClick={() => setActiveTab('appearance')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'appearance' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}>
             <Palette className="w-5 h-5" /> Appearance
           </button>
           <button onClick={() => setActiveTab('notifications')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'notifications' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}>
             <Bell className="w-5 h-5" /> Notifications
           </button>
           
           {user?.role === 'Administrator' && (
             <div className="pt-4 mt-4 border-t dark:border-slate-800 space-y-1">
               <div className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Admin</div>
               <button onClick={() => setActiveTab('system')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'system' ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}>
                 <Database className="w-5 h-5" /> System Data
               </button>
               <button onClick={() => setActiveTab('security')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'security' ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}>
                 <Shield className="w-5 h-5" /> Security Logs
               </button>
             </div>
           )}
        </div>

        {/* Content Area */}
        <div className="flex-1 glass-card p-6 md:p-8">
           {activeTab === 'account' && (
             <div className="space-y-6 animate-in fade-in duration-300">
               <h3 className="text-xl font-bold border-b dark:border-slate-800 pb-4">Account Settings</h3>
               <div className="space-y-4 max-w-lg">
                 <div>
                   <label className="block text-sm font-medium mb-1">Full Name</label>
                   <input type="text" defaultValue={user?.full_name} className="w-full px-4 py-2.5 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium mb-1">Email Address</label>
                   <input type="email" defaultValue={user?.email} className="w-full px-4 py-2.5 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 cursor-not-allowed outline-none" disabled />
                   <p className="text-xs text-slate-500 mt-1">Email cannot be changed directly.</p>
                 </div>
                 <button className="px-6 py-2.5 bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-600 transition-colors">
                   Save Changes
                 </button>
               </div>
             </div>
           )}

           {activeTab === 'appearance' && (
             <div className="space-y-6 animate-in fade-in duration-300">
               <h3 className="text-xl font-bold border-b dark:border-slate-800 pb-4">Appearance</h3>
               
               <div>
                  <h4 className="font-medium mb-3">Theme Preference</h4>
                  <div className="flex gap-4">
                     <button onClick={() => !darkMode && toggleTheme()} className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-colors ${!darkMode ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300'}`}>
                        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center"><Monitor className="w-6 h-6 text-slate-600"/></div>
                        <span className="font-semibold text-slate-800">Light Mode</span>
                     </button>
                     <button onClick={() => darkMode && toggleTheme()} className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-colors ${darkMode ? 'border-emerald-500 bg-emerald-900/20' : 'border-slate-700 hover:border-emerald-700'}`}>
                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center"><Monitor className="w-6 h-6 text-slate-300"/></div>
                        <span className="font-semibold text-white">Dark Mode</span>
                     </button>
                  </div>
               </div>
             </div>
           )}

           {activeTab === 'notifications' && (
             <div className="space-y-6 animate-in fade-in duration-300">
               <h3 className="text-xl font-bold border-b dark:border-slate-800 pb-4">Notification Preferences</h3>
               <div className="space-y-4">
                  {[
                    { title: "Weekly Report", desc: "Receive weekly PDF summaries of your food waste." },
                    { title: "Prediction Alerts", desc: "Get notified when high waste is predicted." },
                    { title: "System Updates", desc: "Platform maintenance and feature announcements." }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                       <div>
                          <div className="font-semibold">{item.title}</div>
                          <div className="text-sm text-slate-500">{item.desc}</div>
                       </div>
                       <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                          <input type="checkbox" name="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" defaultChecked={i < 2} />
                          <label className="toggle-label block overflow-hidden h-6 rounded-full bg-emerald-500 cursor-pointer"></label>
                       </div>
                    </div>
                  ))}
               </div>
             </div>
           )}

           {activeTab === 'system' && user?.role === 'Administrator' && (
             <div className="space-y-6 animate-in fade-in duration-300">
               <h3 className="text-xl font-bold border-b dark:border-slate-800 pb-4 text-purple-600 dark:text-purple-400">Database & System Management</h3>
               
               <div className="grid md:grid-cols-2 gap-6">
                 <div className="p-6 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                   <Save className="w-8 h-8 text-blue-500 mb-4" />
                   <h4 className="font-bold text-lg mb-2">Backup Database</h4>
                   <p className="text-sm text-slate-500 mb-4">Create a secure snapshot of all users, logs, and predictions.</p>
                   <button onClick={handleBackup} disabled={loading} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium flex items-center gap-2">
                     {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>} Trigger Backup
                   </button>
                 </div>

                 <div className="p-6 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                   <RotateCcw className="w-8 h-8 text-amber-500 mb-4" />
                   <h4 className="font-bold text-lg mb-2">Restore Database</h4>
                   <p className="text-sm text-slate-500 mb-4">Revert the database to the most recent backup snapshot.</p>
                   <button onClick={handleRestore} disabled={loading} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium flex items-center gap-2">
                     {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <RotateCcw className="w-4 h-4"/>} Restore System
                   </button>
                 </div>
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
