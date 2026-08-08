import { useState, useEffect } from 'react';
import { Activity, Database, Server, Brain, Camera, CheckCircle2, XCircle, Leaf } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

// We will compute chart data dynamically from /food-logs

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [adminStats, setAdminStats] = useState(null);
  const [sysStatus, setSysStatus] = useState('loading');
  const [chartData, setChartData] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashRes, healthRes, logsRes] = await Promise.all([
          api.get('/dashboard'),
          api.get('/health'),
          api.get('/food-logs')
        ]);
        setStats(dashRes.data);
        setSysStatus(healthRes.data.status === 'ok' ? 'ok' : 'error');
        
        // Aggregate food logs by day for chart
        const logs = logsRes.data;
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const aggregated = {};
        
        logs.forEach(log => {
          const date = new Date(log.date);
          const dayName = days[date.getDay()];
          if (!aggregated[dayName]) {
            aggregated[dayName] = { name: dayName, recovered: 0 };
          }
          aggregated[dayName].recovered += log.quantity_kg;
        });
        
        // Convert to array and sort (Mon to Sun)
        const sortedData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => 
          aggregated[day] || { name: day, recovered: 0 }
        );
        setChartData(sortedData);
        
        if (user?.role === 'Administrator') {
          try {
            const adminRes = await api.get('/dashboard/admin-stats');
            setAdminStats(adminRes.data);
          } catch (e) {
            console.error('Failed to fetch admin stats', e);
          }
        }
      } catch (error) {
        console.error(error);
        setSysStatus('error');
      }
    };
    if (user) {
      fetchDashboard();
    }
  }, [user]);

  const StatusItem = ({ label, icon: Icon, status }) => (
    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-slate-500" />
        <span className="font-medium text-slate-700 dark:text-slate-300">{label}</span>
      </div>
      {status === 'ok' ? (
        <div className="flex items-center gap-1 text-emerald-500 text-sm font-semibold">
          <CheckCircle2 className="w-4 h-4" /> Operational
        </div>
      ) : status === 'loading' ? (
        <div className="text-amber-500 text-sm font-semibold animate-pulse">Checking...</div>
      ) : (
        <div className="flex items-center gap-1 text-red-500 text-sm font-semibold">
          <XCircle className="w-4 h-4" /> Offline
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back. Here is what's happening with FoodCycle AI.</p>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm ${user?.role === 'Administrator' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
          {user?.role}
        </div>
      </div>

      {/* Admin Stats */}
      {user?.role === 'Administrator' && adminStats && (
        <div className="glass-card p-6 mb-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <h3 className="text-lg font-bold mb-4 text-purple-600 dark:text-purple-400">Administrator Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-slate-500">Total Users</p>
              <p className="text-2xl font-bold">{adminStats.total_users}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Administrators / Managers</p>
              <p className="text-2xl font-bold">{adminStats.administrators} / {adminStats.mess_managers}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Waste Logged</p>
              <p className="text-2xl font-bold">{adminStats.total_waste_logged?.toFixed(1)} kg</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Activity (Pred/Img/Rec)</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {adminStats.total_predictions} / {adminStats.total_image_analyses} / {adminStats.total_recovery_recommendations}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Waste Logged', value: `${stats?.total_waste?.toFixed(1) || 0} kg`, color: 'bg-blue-500' },
          { label: 'Total Compost', value: `${stats?.total_compost?.toFixed(1) || 0} kg`, color: 'bg-emerald-500' },
          { label: 'Total Donations', value: `${stats?.total_donations?.toFixed(1) || 0} meals`, color: 'bg-amber-500' },
          { label: 'CO₂ Emissions Saved', value: `${stats?.carbon_saved?.toFixed(1) || 0} kg`, color: 'bg-purple-500' },
        ].map((kpi, i) => (
          <div key={i} className="glass-card p-6">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{kpi.label}</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold">{kpi.value}</span>
            </div>
            <div className={`h-1 w-full rounded-full mt-4 opacity-20 ${kpi.color}`}>
              <div className={`h-full rounded-full ${kpi.color}`} style={{ width: '70%' }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="text-lg font-bold mb-4">Weekly Recovery Trends</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRecovered" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="recovered" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRecovered)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI System Status */}
        <div className="glass-card p-6 flex flex-col">
          <h3 className="text-lg font-bold mb-4">AI System Status</h3>
          <div className="space-y-3 flex-1">
            <StatusItem label="Prophet Engine" icon={Brain} status={sysStatus} />
            <StatusItem label="Recovery RF Model" icon={Activity} status={sysStatus} />
            <StatusItem label="YOLOv8 Vision" icon={Camera} status={sysStatus} />
            <StatusItem label="MySQL Database" icon={Database} status={sysStatus} />
            <StatusItem label="FastAPI Backend" icon={Server} status={sysStatus} />
          </div>
        </div>
      </div>

      {/* Visual Workflow Component */}
      <div className="glass-card p-8">
        <h3 className="text-lg font-bold mb-6 text-center">FoodCycle Data Workflow</h3>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          <div className="flex-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
            <Camera className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <div className="font-semibold">Image Capture</div>
            <div className="text-xs text-slate-500 mt-1">User uploads photo</div>
          </div>
          <div className="hidden md:block h-1 w-8 bg-emerald-500/20 rounded-full" />
          <div className="flex-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
            <Activity className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <div className="font-semibold">YOLOv8 CV</div>
            <div className="text-xs text-slate-500 mt-1">Classifies food category</div>
          </div>
          <div className="hidden md:block h-1 w-8 bg-emerald-500/20 rounded-full" />
          <div className="flex-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
            <Brain className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <div className="font-semibold">Recovery AI</div>
            <div className="text-xs text-slate-500 mt-1">Predicts optimal route</div>
          </div>
          <div className="hidden md:block h-1 w-8 bg-emerald-500/20 rounded-full" />
          <div className="flex-1 p-4 rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
            <Leaf className="w-8 h-8 mx-auto mb-2" />
            <div className="font-semibold">Sustainability</div>
            <div className="text-xs opacity-90 mt-1">NPK & CO₂ Impact</div>
          </div>
        </div>
      </div>
    </div>
  );
}
