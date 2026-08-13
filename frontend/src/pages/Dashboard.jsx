import { useState, useEffect } from 'react';
import { Activity, Database, Server, Brain, Camera, CheckCircle2, XCircle, Leaf, Users, AlertTriangle, PlusCircle, Clock, Search, Settings } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [sysStatus, setSysStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashRes, healthRes] = await Promise.all([
          api.get('/dashboard/analytics'),
          user?.role === 'Administrator' ? api.get('/dashboard/system-health') : Promise.resolve({ data: null })
        ]);
        setAnalytics(dashRes.data);
        if (healthRes.data) setSysStatus(healthRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchDashboard();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // --- ADMINISTRATOR DASHBOARD ---
  if (user?.role === 'Administrator') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold">Admin Control Center</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">System overview and platform management.</p>
          </div>
          <div className="flex gap-2">
             <Link to="/users" className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 flex gap-2 items-center"><Users className="w-4 h-4"/> Manage Users</Link>
             <Link to="/settings" className="px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-medium hover:bg-slate-700 flex gap-2 items-center"><Settings className="w-4 h-4"/> System Settings</Link>
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-xl flex items-center gap-3 text-amber-700 dark:text-amber-400">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-medium">Notice: System update scheduled for tomorrow 02:00 AM UTC. Expect 5 minutes of downtime.</span>
        </div>

        {/* Admin KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-6">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Users</h3>
            <div className="mt-2 text-3xl font-bold">{sysStatus?.total_users || 0}</div>
            <p className="text-xs text-slate-500 mt-1">{sysStatus?.active_users || 0} Active today</p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Waste Logged</h3>
            <div className="mt-2 text-3xl font-bold">{analytics?.kpis?.total_waste?.toFixed(1) || 0} kg</div>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Predictions</h3>
            <div className="mt-2 text-3xl font-bold">{analytics?.kpis?.total_predictions || 0}</div>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Images Analyzed</h3>
            <div className="mt-2 text-3xl font-bold">{analytics?.kpis?.total_images || 0}</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-6">
            <h3 className="text-lg font-bold mb-4">Weekly Platform Activity (Waste Logged)</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics?.weekly_trend || []}>
                  <defs>
                    <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  <Area type="monotone" dataKey="waste" stroke="#10b981" strokeWidth={3} fill="url(#colorWaste)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="glass-card p-6 flex flex-col">
            <h3 className="text-lg font-bold mb-4">System Health</h3>
            <div className="space-y-4 flex-1">
              {[
                { label: 'Prophet Model', status: sysStatus?.prophet, icon: Brain },
                { label: 'YOLOv8 Engine', status: sysStatus?.yolo, icon: Camera },
                { label: 'Database Server', status: sysStatus?.database, icon: Database },
                { label: 'FastAPI Backend', status: sysStatus?.server, icon: Server },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <s.icon className="w-5 h-5 text-slate-500" />
                    <span className="font-medium">{s.label}</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-500 text-sm font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> {s.status === 'ok' ? 'Operational' : 'Online'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- MESS MANAGER DASHBOARD ---
  if (user?.role === 'Mess Manager') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold">Operations Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Track daily waste, predictions, and recovery metrics.</p>
          </div>
          <div className="flex gap-2">
             <Link to="/prediction" className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 flex gap-2 items-center"><PlusCircle className="w-4 h-4"/> New Log</Link>
             <Link to="/vision" className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 flex gap-2 items-center"><Camera className="w-4 h-4"/> Analyze Image</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-6 border-l-4 border-l-blue-500">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Waste Logged</h3>
            <div className="mt-2 text-3xl font-bold">{analytics?.kpis?.total_waste?.toFixed(1) || 0} kg</div>
          </div>
          <div className="glass-card p-6 border-l-4 border-l-emerald-500">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Compost Generated</h3>
            <div className="mt-2 text-3xl font-bold">{analytics?.kpis?.total_compost?.toFixed(1) || 0} kg</div>
          </div>
          <div className="glass-card p-6 border-l-4 border-l-amber-500">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Donations</h3>
            <div className="mt-2 text-3xl font-bold">{analytics?.kpis?.total_donations?.toFixed(1) || 0} kg</div>
          </div>
          <div className="glass-card p-6 border-l-4 border-l-purple-500">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">CO₂ Emissions Saved</h3>
            <div className="mt-2 text-3xl font-bold">{analytics?.kpis?.carbon_saved?.toFixed(1) || 0} kg</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-6">
            <h3 className="text-lg font-bold mb-4">Weekly Recovery Trends</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics?.weekly_trend || []}>
                  <defs>
                    <linearGradient id="colorRecovered" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  <Area type="monotone" dataKey="recovered" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRecovered)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="glass-card p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-bold">Recent Logs</h3>
               <Link to="/history" className="text-emerald-500 text-sm font-semibold hover:underline">View All</Link>
            </div>
            <div className="space-y-3 flex-1 overflow-y-auto">
              {analytics?.recent_logs?.length === 0 ? (
                <div className="text-slate-400 text-sm text-center py-8">No logs available.</div>
              ) : (
                analytics?.recent_logs?.map((log, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <div>
                       <div className="font-semibold text-sm">{log.food_category}</div>
                       <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3"/> {log.date}</div>
                    </div>
                    <div className="font-bold text-emerald-600 dark:text-emerald-400">{log.quantity_kg}kg</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- USER DASHBOARD ---
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center py-10 glass-card">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
             <Leaf className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome, {user?.full_name}!</h1>
          <p className="text-slate-500 max-w-lg mx-auto">Upload images of food waste or log daily meals to get started with AI-driven sustainability recommendations.</p>
          <div className="flex gap-4 justify-center mt-8">
             <Link to="/vision" className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 flex gap-2 items-center"><Camera className="w-5 h-5"/> Analyze Image</Link>
             <Link to="/prediction" className="px-6 py-3 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-700 shadow-lg flex gap-2 items-center"><Search className="w-5 h-5"/> Predict Waste</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="glass-card p-6">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><History className="w-5 h-5 text-blue-500"/> My Recent Activity</h3>
              <p className="text-sm text-slate-500 mb-4">You have {analytics?.kpis?.total_images || 0} images analyzed and {analytics?.kpis?.total_predictions || 0} predictions made.</p>
              <Link to="/profile" className="text-emerald-500 text-sm font-semibold hover:underline">View My Profile &rarr;</Link>
           </div>
           <div className="glass-card p-6">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Leaf className="w-5 h-5 text-emerald-500"/> Sustainability Impact</h3>
              <p className="text-sm text-slate-500 mb-4">You've helped save {analytics?.kpis?.carbon_saved?.toFixed(1) || 0} kg of CO₂ emissions through intelligent recovery recommendations.</p>
              <Link to="/history" className="text-emerald-500 text-sm font-semibold hover:underline">View My History &rarr;</Link>
           </div>
        </div>
    </div>
  );
}
