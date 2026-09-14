import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Bell, Palette, Shield, Database, Save, RotateCcw, Monitor, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import PageHeader from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [loading, setLoading] = useState(false);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
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

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader 
        title="Settings" 
        description="Manage your account preferences and system configuration."
      />

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-1 shrink-0">
           <button onClick={() => setActiveTab('account')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${activeTab === 'account' ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 shadow-sm' : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}>
             <User className="w-5 h-5" /> Account Profile
           </button>
           <button onClick={() => setActiveTab('appearance')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${activeTab === 'appearance' ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 shadow-sm' : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}>
             <Palette className="w-5 h-5" /> Appearance
           </button>
           <button onClick={() => setActiveTab('notifications')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${activeTab === 'notifications' ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 shadow-sm' : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}>
             <Bell className="w-5 h-5" /> Notifications
           </button>
           
           {user?.role === 'Administrator' && (
             <div className="pt-6 mt-6 border-t dark:border-slate-800 space-y-1">
               <div className="px-4 text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Admin Controls</div>
               <button onClick={() => setActiveTab('system')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${activeTab === 'system' ? 'bg-accent-50 text-accent-700 dark:bg-accent-900/30 dark:text-accent-400 shadow-sm' : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}>
                 <Database className="w-5 h-5" /> System Data
               </button>
               <button onClick={() => setActiveTab('security')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${activeTab === 'security' ? 'bg-accent-50 text-accent-700 dark:bg-accent-900/30 dark:text-accent-400 shadow-sm' : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}>
                 <Shield className="w-5 h-5" /> Security Logs
               </button>
             </div>
           )}
        </div>

        {/* Content Area */}
        <Card className="flex-1 p-6 md:p-8 min-h-[500px]">
          <AnimatePresence mode="wait">
             {activeTab === 'account' && (
               <motion.div key="account" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                 <div className="border-b dark:border-slate-800 pb-4 mb-6">
                   <h3 className="text-xl font-bold tracking-tight">Account Settings</h3>
                   <p className="text-sm text-slate-500 mt-1">Manage your personal information.</p>
                 </div>
                 <div className="space-y-5 max-w-lg">
                   <div>
                     <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">Full Name</label>
                     <Input type="text" defaultValue={user?.full_name} icon={User} />
                   </div>
                   <div>
                     <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">Email Address</label>
                     <Input type="email" defaultValue={user?.email} disabled className="opacity-60 cursor-not-allowed" />
                     <p className="text-xs font-medium text-slate-500 mt-1.5">Email cannot be changed directly. Contact an administrator.</p>
                   </div>
                   <div className="pt-4">
                     <Button size="lg">Save Changes</Button>
                   </div>
                 </div>
               </motion.div>
             )}

             {activeTab === 'appearance' && (
               <motion.div key="appearance" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                 <div className="border-b dark:border-slate-800 pb-4 mb-6">
                   <h3 className="text-xl font-bold tracking-tight">Appearance</h3>
                   <p className="text-sm text-slate-500 mt-1">Customize the interface.</p>
                 </div>
                 
                 <div className="max-w-xl">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-4">Theme Preference</h4>
                    <div className="grid grid-cols-2 gap-4">
                       <button onClick={() => darkMode && toggleTheme()} className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-4 transition-all duration-300 ${!darkMode ? 'border-brand-500 bg-brand-50/50 shadow-sm' : 'border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-slate-700'}`}>
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${!darkMode ? 'bg-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800'}`}>
                            <Monitor className={`w-8 h-8 ${!darkMode ? 'text-brand-500' : 'text-slate-400'}`}/>
                          </div>
                          <span className={`font-bold ${!darkMode ? 'text-slate-900' : 'text-slate-500 dark:text-slate-400'}`}>Light Mode</span>
                       </button>
                       <button onClick={() => !darkMode && toggleTheme()} className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-4 transition-all duration-300 ${darkMode ? 'border-brand-500 bg-brand-900/10 shadow-sm' : 'border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-slate-700'}`}>
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${darkMode ? 'bg-slate-900 shadow-sm' : 'bg-slate-100 dark:bg-slate-800'}`}>
                            <Monitor className={`w-8 h-8 ${darkMode ? 'text-brand-400' : 'text-slate-400'}`}/>
                          </div>
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>Dark Mode</span>
                       </button>
                    </div>
                 </div>
               </motion.div>
             )}

             {activeTab === 'notifications' && (
               <motion.div key="notifications" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                 <div className="border-b dark:border-slate-800 pb-4 mb-6">
                   <h3 className="text-xl font-bold tracking-tight">Notification Preferences</h3>
                   <p className="text-sm text-slate-500 mt-1">Control how and when we alert you.</p>
                 </div>
                 <div className="space-y-4 max-w-2xl">
                    {[
                      { title: "Weekly Report", desc: "Receive weekly PDF summaries of your food waste.", active: true },
                      { title: "Prediction Alerts", desc: "Get notified when high waste is predicted.", active: true },
                      { title: "System Updates", desc: "Platform maintenance and feature announcements.", active: false }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-5 rounded-2xl border dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 hover:border-brand-200 dark:hover:border-slate-700 transition-colors">
                         <div>
                            <div className="font-bold text-slate-900 dark:text-white">{item.title}</div>
                            <div className="text-sm text-slate-500 font-medium mt-1">{item.desc}</div>
                         </div>
                         <div className="relative inline-block w-14 mr-2 align-middle select-none transition duration-200 ease-in shrink-0">
                            <input type="checkbox" name="toggle" className="toggle-checkbox absolute block w-7 h-7 rounded-full bg-white border-4 appearance-none cursor-pointer shadow-sm z-10 top-0.5 left-0.5 checked:right-0.5 checked:left-auto" defaultChecked={item.active} />
                            <label className={`toggle-label block overflow-hidden h-8 rounded-full cursor-pointer transition-colors duration-300 ${item.active ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-700'}`}></label>
                         </div>
                      </div>
                    ))}
                 </div>
               </motion.div>
             )}

             {activeTab === 'system' && user?.role === 'Administrator' && (
               <motion.div key="system" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                 <div className="border-b dark:border-slate-800 pb-4 mb-6">
                   <h3 className="text-xl font-bold tracking-tight text-accent-600 dark:text-accent-400 flex items-center gap-2"><Database className="w-5 h-5"/> Database & System</h3>
                   <p className="text-sm text-slate-500 mt-1">Manage infrastructure backups and restoration.</p>
                 </div>
                 
                 <div className="grid md:grid-cols-2 gap-6">
                   <Card className="p-6 md:p-8 flex flex-col items-start bg-slate-50/50 dark:bg-slate-900/30 hover:border-blue-300 dark:hover:border-blue-800 transition-colors">
                     <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-6">
                       <Save className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                     </div>
                     <h4 className="font-bold text-lg mb-2 tracking-tight text-slate-900 dark:text-white">Backup Database</h4>
                     <p className="text-sm text-slate-500 mb-8 leading-relaxed flex-1">Create a secure snapshot of all users, logs, and AI predictions to prevent data loss.</p>
                     <Button onClick={handleBackup} isLoading={loading} className="w-full bg-blue-500 hover:bg-blue-600 focus:ring-blue-500" icon={Save}>
                       Trigger Backup
                     </Button>
                   </Card>

                   <Card className="p-6 md:p-8 flex flex-col items-start bg-slate-50/50 dark:bg-slate-900/30 hover:border-amber-300 dark:hover:border-amber-800 transition-colors">
                     <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center mb-6">
                       <RotateCcw className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                     </div>
                     <h4 className="font-bold text-lg mb-2 tracking-tight text-slate-900 dark:text-white">Restore Database</h4>
                     <p className="text-sm text-slate-500 mb-8 leading-relaxed flex-1">Revert the database to the most recent backup snapshot. Warning: Destructive action.</p>
                     <Button onClick={handleRestore} isLoading={loading} className="w-full bg-amber-500 hover:bg-amber-600 focus:ring-amber-500" icon={RotateCcw}>
                       Restore System
                     </Button>
                   </Card>
                 </div>
               </motion.div>
             )}
             
             {activeTab === 'security' && user?.role === 'Administrator' && (
               <motion.div key="security" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                 <div className="border-b dark:border-slate-800 pb-4 mb-6">
                   <h3 className="text-xl font-bold tracking-tight text-accent-600 dark:text-accent-400 flex items-center gap-2"><Shield className="w-5 h-5"/> Security Logs</h3>
                   <p className="text-sm text-slate-500 mt-1">Monitor authentication events and access control.</p>
                 </div>
                 <div className="flex flex-col items-center justify-center p-12 text-slate-400 border border-dashed dark:border-slate-800 rounded-2xl">
                    <Shield className="w-12 h-12 mb-3 opacity-20" />
                    <p className="font-medium">No recent security events flagged.</p>
                 </div>
               </motion.div>
             )}
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
}
