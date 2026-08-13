import { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Activity, AlertCircle, PieChart as PieChartIcon } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/dashboard/analytics');
        setData(response.data);
      } catch (error) {
        toast.error('Failed to load analytics data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-500">
        <AlertCircle className="w-16 h-16 mb-4 opacity-50" />
        <p className="text-lg font-medium">Failed to load analytics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics & Reports</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Deep dive into food waste generation, predictions, and sustainability impact.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-6 border-l-4 border-l-emerald-500">
          <h3 className="text-sm font-medium text-slate-500">Total Waste (All Time)</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold">{data.kpis?.total_waste?.toFixed(1) || 0} kg</span>
            <span className="text-xs text-emerald-500 flex items-center"><TrendingDown className="w-3 h-3 mr-1"/> -12%</span>
          </div>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-blue-500">
          <h3 className="text-sm font-medium text-slate-500">Prediction Accuracy</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold">92.4%</span>
            <span className="text-xs text-emerald-500 flex items-center"><TrendingUp className="w-3 h-3 mr-1"/> +1.2%</span>
          </div>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-amber-500">
          <h3 className="text-sm font-medium text-slate-500">Recovery Success Rate</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold">78.5%</span>
          </div>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-purple-500">
          <h3 className="text-sm font-medium text-slate-500">Carbon Footprint Saved</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold">{data.kpis?.carbon_saved?.toFixed(1) || 0} kg</span>
          </div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-emerald-500"/> Waste vs Recovery (Weekly)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.weekly_trend || []}>
                <defs>
                  <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Area type="monotone" dataKey="waste" stroke="#f43f5e" fill="url(#colorWaste)" />
                <Area type="monotone" dataKey="recovered" stroke="#10b981" fill="url(#colorRec)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><PieChartIcon className="w-5 h-5 text-blue-500"/> Waste by Food Category</h3>
          <div className="h-[300px]">
             {data.category_distribution?.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400">No data available</div>
             ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.category_distribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                      {data.category_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
             )}
          </div>
        </div>
        
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-amber-500"/> Waste by Meal Type</h3>
          <div className="h-[300px]">
             {data.meal_type_distribution?.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400">No data available</div>
             ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.meal_type_distribution}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }} />
                    <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
             )}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Leaf className="w-5 h-5 text-emerald-500"/> Recovery Method Distribution</h3>
          <div className="h-[300px]">
             {data.recovery_distribution?.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400">No data available</div>
             ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.recovery_distribution} cx="50%" cy="50%" innerRadius={0} outerRadius={100} dataKey="value">
                      {data.recovery_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
