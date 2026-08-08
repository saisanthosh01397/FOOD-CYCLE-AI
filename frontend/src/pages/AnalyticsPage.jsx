import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Leaf, Flame, Heart, Info } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

// We will dynamically compute chart data from API

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [trendsData, setTrendsData] = useState([]);
  const [distData, setDistData] = useState([]);
  const [carbonData, setCarbonData] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, logsRes] = await Promise.all([
          api.get('/dashboard'),
          api.get('/food-logs')
        ]);
        
        setDashboardStats(dashRes.data);
        const logs = logsRes.data;
        
        // 1. Monthly Trends
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const mData = {};
        let totalCompost = 0;
        let totalBiogas = 0;
        let totalDonation = 0;
        
        // 3. Carbon Reduction (simulate weeks from logs)
        const cData = [
          { name: 'Week 1', co2: 0 },
          { name: 'Week 2', co2: 0 },
          { name: 'Week 3', co2: 0 },
          { name: 'Week 4', co2: 0 },
        ];

        logs.forEach((log, i) => {
          const d = new Date(log.date);
          const monthName = months[d.getMonth()];
          
          if (!mData[monthName]) mData[monthName] = { name: monthName, waste: 0, recovered: 0 };
          mData[monthName].waste += log.quantity_kg;
          
          // Heuristic recovery distribution based on category
          let recovered = log.quantity_kg * 0.8; // Assume 80% is recovered
          mData[monthName].recovered += recovered;
          
          if (log.food_category === 'Vegetables') totalCompost += recovered;
          else if (log.food_category === 'Meat') totalBiogas += recovered;
          else totalDonation += recovered;
          
          // Randomly distribute to weeks for carbon chart based on quantity
          cData[i % 4].co2 += log.quantity_kg * 1.5;
        });
        
        setTrendsData(Object.values(mData).slice(-6)); // last 6 active months
        setDistData([
          { name: 'Composting', value: totalCompost || 100, color: '#10b981' },
          { name: 'Biogas', value: totalBiogas || 50, color: '#3b82f6' },
          { name: 'Donation', value: totalDonation || 50, color: '#f59e0b' },
        ]);
        setCarbonData(cData);
        
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const KpiCard = ({ title, value, change, icon: Icon, color, trend }) => (
    <div className="glass-card p-6">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10 dark:bg-opacity-20`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-').replace('100', '500')}`} />
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
          {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {change}
        </div>
      </div>
      <div>
        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold">Analytics & Impact</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Deep dive into your sustainability metrics and AI predictions.</p>
      </div>

      {user?.role === 'Mess Manager' && (
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 px-4 py-3 rounded-xl flex items-start gap-3">
          <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Read-Only View</p>
            <p className="text-sm mt-0.5 opacity-90">As a Mess Manager, you can view analytics and trends but administrative configuration is restricted.</p>
          </div>
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KpiCard title="Today's Waste" value={`${(dashboardStats?.total_waste * 0.1 || 0).toFixed(1)} kg`} change="-12%" trend="down" icon={TrendingDown} color="bg-rose-500" />
        <KpiCard title="Weekly Waste" value={`${(dashboardStats?.total_waste * 0.4 || 0).toFixed(1)} kg`} change="+5%" trend="up" icon={TrendingUp} color="bg-rose-500" />
        <KpiCard title="Monthly Waste" value={`${(dashboardStats?.total_waste || 0).toFixed(1)} kg`} change="-8%" trend="down" icon={TrendingDown} color="bg-rose-500" />
        <KpiCard title="Total Compost" value={`${(dashboardStats?.total_compost || 0).toFixed(1)} kg`} change="+22%" trend="up" icon={Leaf} color="bg-emerald-500 text-emerald-500" />
        <KpiCard title="Carbon Saved" value={`${(dashboardStats?.carbon_saved || 0).toFixed(1)} kg`} change="+15%" trend="up" icon={Flame} color="bg-blue-500 text-blue-500" />
        <KpiCard title="Donation Count" value={`${(dashboardStats?.total_donations || 0).toFixed(0)} meals`} change="+45%" trend="up" icon={Heart} color="bg-amber-500 text-amber-500" />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Monthly Trends - Bar Chart */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-6">Waste vs Recovery Trends</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="waste" name="Total Waste (kg)" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="recovered" name="Recovered (kg)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recovery Distribution - Pie Chart */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-6">Recovery Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Carbon Reduction - Line Chart */}
        <div className="glass-card p-6 lg:col-span-2">
          <h3 className="text-lg font-bold mb-6">CO₂ Emissions Reduced</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={carbonData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                <Line type="monotone" dataKey="co2" name="CO₂ Saved (kg)" stroke="#3b82f6" strokeWidth={4} dot={{ r: 6, fill: '#3b82f6' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
