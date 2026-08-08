import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { 
  User, Shield, Bell, Palette, Database, HardDrive, 
  Info, LogOut, Trash2, Camera, Download, Activity, Monitor 
} from 'lucide-react';
import { cn } from '../utils/cn';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [profileData, setProfileData] = useState(null);

  // Tabs structure based on role
  const tabs = [
    { id: 'account', label: 'Account & Security', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'ai', label: 'AI Preferences', icon: Monitor },
    { id: 'data', label: 'Data Management', icon: HardDrive },
    ...(user?.role === 'Administrator' ? [
      { id: 'system', label: 'System Info', icon: Database },
      { id: 'audit', label: 'Audit Log', icon: Activity },
    ] : []),
    { id: 'about', label: 'About', icon: Info },
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/me');
      setProfileData(res.data);
    } catch (error) {
      toast.error('Failed to load profile');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto pb-20">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your application preferences and system settings.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-1 shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-left",
                activeTab === tab.id
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 glass-card p-6 md:p-8">
          {activeTab === 'account' && <AccountTab profileData={profileData} refreshProfile={fetchProfile} />}
          {activeTab === 'appearance' && <AppearanceTab />}
          {activeTab === 'notifications' && <NotificationsTab />}
          {activeTab === 'ai' && <AIPreferencesTab />}
          {activeTab === 'data' && <DataManagementTab />}
          {activeTab === 'system' && <SystemInfoTab />}
          {activeTab === 'audit' && <AuditLogTab />}
          {activeTab === 'about' && <AboutTab />}
        </div>
      </div>
    </div>
  );
}

// Subcomponents for each tab
function AccountTab({ profileData, refreshProfile }) {
  const { logout } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (profileData) {
      setName(profileData.full_name);
      setEmail(profileData.email);
    }
  }, [profileData]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/me', { full_name: name, email });
      toast.success('Profile updated successfully');
      refreshProfile();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update profile');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/me/password', { current_password: currentPassword, new_password: newPassword });
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update password');
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post('/users/me/avatar', formData);
      toast.success('Avatar updated');
      refreshProfile();
    } catch (err) {
      toast.error('Failed to upload avatar');
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      await api.delete('/users/me/avatar');
      toast.success('Avatar removed');
      refreshProfile();
    } catch (err) {
      toast.error('Failed to remove avatar');
    }
  };
  
  const handleLogoutAll = async () => {
    try {
      await api.post('/auth/logout-all');
      toast.success('Logged out from all devices');
      logout();
    } catch (err) {
      toast.error('Failed to logout everywhere');
    }
  };

  if (!profileData) return <div>Loading...</div>;

  return (
    <div className="space-y-10 animate-in fade-in">
      <section>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 border-b dark:border-slate-800 pb-2">
          Profile Information
        </h3>
        
        <div className="flex items-center gap-6 mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 overflow-hidden flex items-center justify-center border-4 border-white dark:border-slate-700">
              {profileData.avatar ? (
                <img src={`http://127.0.0.1:8000${profileData.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              )}
            </div>
            <label className="absolute inset-0 bg-black/50 text-white flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
              <Camera className="w-5 h-5" />
              <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
            </label>
          </div>
          <div>
            <h4 className="font-bold text-lg">{profileData.full_name}</h4>
            <p className="text-slate-500 text-sm">{profileData.role}</p>
            {profileData.avatar && (
              <button onClick={handleRemoveAvatar} className="text-xs text-rose-500 mt-1 hover:underline">Remove Picture</button>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border dark:border-slate-700">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">User ID</p>
                <p className="font-mono text-sm">{profileData.id}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border dark:border-slate-700">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Account Status</p>
                <p className="font-medium">{profileData.is_active ? 'Active' : 'Inactive'}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border dark:border-slate-700">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Registration Date</p>
                <p className="font-medium">{new Date(profileData.created_at).toLocaleDateString()}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border dark:border-slate-700">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Last Login</p>
                <p className="font-medium">{profileData.last_login ? new Date(profileData.last_login).toLocaleString() : 'Never'}</p>
            </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full input-field" />
          </div>
          <button type="submit" className="btn-primary">Save Profile</button>
        </form>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 border-b dark:border-slate-800 pb-2">
          Security
        </h3>
        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Current Password</label>
            <input type="password" value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)} required className="w-full input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} required minLength={8} className="w-full input-field" />
          </div>
          <button type="submit" className="btn-primary">Update Password</button>
        </form>

        <div className="pt-4 space-y-3 border-t dark:border-slate-800">
            <button type="button" onClick={handleLogoutAll} className="w-full max-w-md flex items-center justify-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 rounded-xl transition-colors font-medium">
                <LogOut className="w-4 h-4" /> Logout from all devices
            </button>
            <button type="button" className="w-full max-w-md flex items-center justify-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 rounded-xl transition-colors font-medium">
                <Trash2 className="w-4 h-4" /> Request Account Deletion
            </button>
        </div>
      </section>
    </div>
  );
}

function AppearanceTab() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [sidebarCollapse, setSidebarCollapse] = useState(localStorage.getItem('sidebarCollapse') === 'true');
  const [fontSize, setFontSize] = useState(localStorage.getItem('fontSize') || 'medium');

  const saveSettings = () => {
    localStorage.setItem('theme', theme);
    localStorage.setItem('sidebarCollapse', sidebarCollapse.toString());
    localStorage.setItem('fontSize', fontSize);
    window.dispatchEvent(new Event('storage'));
    toast.success('Appearance settings saved');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <h3 className="text-xl font-bold border-b dark:border-slate-800 pb-2">Appearance</h3>
      
      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium mb-1">Theme</label>
          <select value={theme} onChange={e=>setTheme(e.target.value)} className="w-full input-field">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={sidebarCollapse} onChange={e=>setSidebarCollapse(e.target.checked)} className="rounded text-emerald-500 focus:ring-emerald-500" />
            <span className="text-sm font-medium">Collapse Sidebar by Default</span>
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Font Size</label>
          <select value={fontSize} onChange={e=>setFontSize(e.target.value)} className="w-full input-field">
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        <button onClick={saveSettings} className="btn-primary mt-4">Save Appearance</button>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [settings, setSettings] = useState({
    email: localStorage.getItem('notifyEmail') !== 'false',
    browser: localStorage.getItem('notifyBrowser') === 'true',
    daily: localStorage.getItem('notifyDaily') === 'true',
    weekly: localStorage.getItem('notifyWeekly') !== 'false'
  });

  const handleChange = (k, v) => setSettings(s => ({ ...s, [k]: v }));

  const saveSettings = () => {
    Object.keys(settings).forEach(k => localStorage.setItem(`notify${k.charAt(0).toUpperCase() + k.slice(1)}`, settings[k].toString()));
    toast.success('Notification preferences saved');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <h3 className="text-xl font-bold border-b dark:border-slate-800 pb-2">Notifications</h3>
      
      <div className="space-y-4 max-w-md">
        {Object.keys(settings).map(key => (
          <label key={key} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl cursor-pointer">
            <input type="checkbox" checked={settings[key]} onChange={e => handleChange(key, e.target.checked)} className="rounded text-emerald-500 w-5 h-5" />
            <span className="font-medium capitalize">{key === 'daily' || key === 'weekly' ? `${key} Summary Report` : `${key} Notifications`}</span>
          </label>
        ))}
        <button onClick={saveSettings} className="btn-primary mt-4">Save Notifications</button>
      </div>
    </div>
  );
}

function AIPreferencesTab() {
  const [settings, setSettings] = useState({
    threshold: localStorage.getItem('aiThreshold') || '75',
    recovery: localStorage.getItem('aiRecovery') || 'composting',
    explainable: localStorage.getItem('aiExplainable') !== 'false',
    autosave: localStorage.getItem('aiAutosave') === 'true',
    autoanalyze: localStorage.getItem('aiAutoanalyze') !== 'false'
  });

  const saveSettings = () => {
    Object.keys(settings).forEach(k => localStorage.setItem(`ai${k.charAt(0).toUpperCase() + k.slice(1)}`, settings[k].toString()));
    toast.success('AI Preferences saved');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <h3 className="text-xl font-bold border-b dark:border-slate-800 pb-2">AI Preferences</h3>
      
      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium mb-1">Prediction Confidence Threshold ({settings.threshold}%)</label>
          <input type="range" min="50" max="99" value={settings.threshold} onChange={e=>setSettings(s=>({...s, threshold: e.target.value}))} className="w-full accent-emerald-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Default Recovery Method</label>
          <select value={settings.recovery} onChange={e=>setSettings(s=>({...s, recovery: e.target.value}))} className="w-full input-field">
            <option value="composting">Composting</option>
            <option value="donation">Donation</option>
            <option value="animal_feed">Animal Feed</option>
          </select>
        </div>
        <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl cursor-pointer">
            <input type="checkbox" checked={settings.explainable} onChange={e=>setSettings(s=>({...s, explainable: e.target.checked}))} className="rounded text-emerald-500 w-5 h-5" />
            <span className="font-medium">Enable Explainable AI (XAI)</span>
        </label>
        <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl cursor-pointer">
            <input type="checkbox" checked={settings.autosave} onChange={e=>setSettings(s=>({...s, autosave: e.target.checked}))} className="rounded text-emerald-500 w-5 h-5" />
            <span className="font-medium">Auto-save Predictions</span>
        </label>
        <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl cursor-pointer">
            <input type="checkbox" checked={settings.autoanalyze} onChange={e=>setSettings(s=>({...s, autoanalyze: e.target.checked}))} className="rounded text-emerald-500 w-5 h-5" />
            <span className="font-medium">Auto-analyze Uploaded Images</span>
        </label>
        <button onClick={saveSettings} className="btn-primary mt-4">Save AI Preferences</button>
      </div>
    </div>
  );
}

function DataManagementTab() {
  const handleExport = (type) => {
    window.open(`http://127.0.0.1:8000/export/${type}`, '_blank');
  };

  const handleClearCache = () => {
    // We only clear certain keys to not log out the user
    const keysToKeep = ['token'];
    for(let i=0; i<localStorage.length; i++){
        const key = localStorage.key(i);
        if(!keysToKeep.includes(key)) {
            localStorage.removeItem(key);
        }
    }
    toast.success('Local cache cleared');
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <h3 className="text-xl font-bold border-b dark:border-slate-800 pb-2">Data Management</h3>
      
      <div className="space-y-4 max-w-md">
        <button onClick={() => handleExport('food-logs/csv')} className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <span className="font-medium">Export Food Logs (CSV)</span>
            <Download className="w-5 h-5 text-emerald-500" />
        </button>
        <button onClick={() => handleExport('food-logs/excel')} className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <span className="font-medium">Export Food Logs (Excel)</span>
            <Download className="w-5 h-5 text-emerald-500" />
        </button>
        <button onClick={() => handleExport('predictions/pdf')} className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <span className="font-medium">Export Prediction History (PDF)</span>
            <Download className="w-5 h-5 text-emerald-500" />
        </button>
        
        <div className="pt-6 mt-6 border-t dark:border-slate-800">
            <p className="text-sm text-slate-500 mb-4">Clearing the local cache will reset your UI and AI preferences to default values. It will not delete your account data.</p>
            <button onClick={handleClearCache} className="w-full py-2 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-xl transition-colors">
                Clear Local Cache
            </button>
        </div>
      </div>
    </div>
  );
}

function SystemInfoTab() {
  const [sysInfo, setSysInfo] = useState(null);

  useEffect(() => {
    api.get('/system/status').then(res => setSysInfo(res.data)).catch(console.error);
  }, []);

  if (!sysInfo) return <div>Loading System Data...</div>;

  return (
    <div className="space-y-6 animate-in fade-in">
      <h3 className="text-xl font-bold border-b dark:border-slate-800 pb-2">System Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
          <h4 className="font-bold text-emerald-800 dark:text-emerald-400 mb-3">Database Metrics</h4>
          <div className="space-y-2 text-sm">
            {Object.entries(sysInfo.metrics).map(([k, v]) => (
                <div key={k} className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">{k}</span>
                    <span className="font-bold">{v}</span>
                </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/30">
          <h4 className="font-bold text-blue-800 dark:text-blue-400 mb-3">Server Status</h4>
          <div className="space-y-2 text-sm">
            {Object.entries(sysInfo.system).map(([k, v]) => (
                <div key={k} className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">{k}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{v}</span>
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AuditLogTab() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get('/system/audit-logs').then(res => setLogs(res.data)).catch(console.error);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in">
      <h3 className="text-xl font-bold border-b dark:border-slate-800 pb-2">Audit Log</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg rounded-bl-lg">Time</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3 rounded-tr-lg rounded-br-lg">Action</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i} className="border-b dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-4 py-3 font-mono text-xs">{log.time}</td>
                <td className="px-4 py-3">{log.date}</td>
                <td className="px-4 py-3 font-medium">{log.user}</td>
                <td className="px-4 py-3">
                    <div className="font-medium text-emerald-600 dark:text-emerald-400">{log.action}</div>
                    <div className="text-xs text-slate-500">{log.description}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && <div className="text-center py-6 text-slate-500">No audit logs found.</div>}
      </div>
    </div>
  );
}

function AboutTab() {
  return (
    <div className="space-y-6 animate-in fade-in max-w-2xl">
      <div className="text-center p-8 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/30">
        <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
            <Leaf className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-400">FoodCycle AI</h2>
        <p className="text-emerald-700 dark:text-emerald-400 font-medium mt-1">Version 1.0.0</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
              <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Developed By</h4>
                  <p className="font-medium text-lg">Sai Santhosh Bontha</p>
              </div>
              <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Department</h4>
                  <p className="font-medium">Computer Science & Engineering</p>
              </div>
              <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">University</h4>
                  <p className="font-medium">Kalasalingam Academy of Research and Education</p>
              </div>
              <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Project Guide</h4>
                  <p className="font-medium">(Professor Name)</p>
              </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border dark:border-slate-700">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Core Technologies</h4>
              <div className="flex flex-wrap gap-2">
                  {['React', 'FastAPI', 'MySQL', 'YOLOv8', 'Prophet', 'Random Forest', 'XGBoost'].map(tech => (
                      <span key={tech} className="px-3 py-1 bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-lg text-sm font-medium shadow-sm">
                          {tech}
                      </span>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
}
