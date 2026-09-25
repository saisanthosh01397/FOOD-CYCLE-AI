import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Activity, BarChart3, PieChart as PieChartIcon, Leaf, Wind, Brain, Camera, Settings2 } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Card } from '../components/ui/Card';
import { SkeletonCard, SkeletonChart } from '../components/ui/Skeleton';
import AnimatedNumber from '../components/ui/AnimatedNumber';
import { motion } from 'framer-motion';
import { pageDataReveal, staggerContainer, staggerItem } from '../utils/animations';

const CHART_COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--surface)]/95 backdrop-blur-md border border-[var(--border)] rounded-2xl p-4 shadow-2xl text-sm min-w-[150px]">
      {label && <p className="font-black text-[var(--text-primary)] mb-3 uppercase tracking-wider text-[10px]">{label}</p>}
      <div className="space-y-2">
        {payload.map((p, i) => (
          <div key={i} className="flex items-center justify-between gap-4 font-bold text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: p.color }} />
              <span className="text-[var(--text-secondary)] capitalize">{p.name}</span>
            </div>
            <span className="text-[var(--text-primary)]">{typeof p.value === 'number' ? p.value.toFixed(1) : p.value} {p.unit || ''}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

function ChartEmptyState({ message = 'No data available' }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 opacity-50">
      <div className="w-12 h-12 rounded-full border border-[var(--border)] border-dashed flex items-center justify-center mb-2">
        <Activity className="w-5 h-5 text-[var(--text-muted)]" />
      </div>
      <p className="text-[10px] font-bold tracking-widest uppercase text-[var(--text-muted)]">{message}</p>
    </div>
  );
}

function MetricCell({ title, value, unit, icon: Icon, color }) {
  return (
    <motion.div variants={staggerItem} className="h-full">
      <Card className="p-6 h-full flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 group overflow-hidden relative border-[var(--border)] bg-[var(--surface)]">
        <div className={`absolute -right-10 -top-10 w-32 h-32 bg-${color}-500/10 rounded-full blur-2xl group-hover:bg-${color}-500/20 transition-colors`} />
        
        <div className="flex justify-between items-start mb-6">
          <div className={`p-2.5 rounded-2xl bg-${color}-500/10 text-${color}-500 border border-${color}-500/20 shadow-sm`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <div>
          <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1.5">{title}</p>
          <p className="text-3xl font-black text-[var(--text-primary)] tracking-tighter flex items-baseline gap-1">
            <AnimatedNumber value={value} />
            <span className="text-xs font-bold text-[var(--text-muted)]">{unit}</span>
          </p>
        </div>
      </Card>
    </motion.div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/dashboard/analytics');
        setData(response.data);
      } catch (error) { toast.error('Failed to load analytics'); }
      setLoading(false);
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}</div>
        <div className="grid lg:grid-cols-2 gap-6">{[...Array(2)].map((_, i) => <div key={i} className="bg-[var(--surface)] rounded-3xl p-6 h-[400px] skeleton" />)}</div>
      </div>
    );
  }

  const kpis = data?.kpis || {};

  return (
    <motion.div variants={pageDataReveal} initial="initial" animate="animate" exit="exit" className="space-y-6 max-w-[1600px] mx-auto min-h-[calc(100vh-100px)]">
      
      <div className="flex items-center justify-between shrink-0 mb-4">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-brand-500" /> Business Intelligence
          </h1>
          <p className="text-[var(--text-muted)] font-medium mt-1">Deep dive into enterprise food waste generation, AI predictions, and environmental impact.</p>
        </div>
        <div className="hidden sm:flex gap-2">
          <div className="px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
            <Settings2 className="w-4 h-4" /> Filter: Last 30 Days
          </div>
        </div>
      </div>

      <motion.div variants={staggerContainer} className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCell title="Total Volume Logged" value={kpis.total_waste || 0} unit="kg" icon={Leaf} color="emerald" />
        <MetricCell title="Total CO₂ Mitigated" value={kpis.carbon_saved || 0} unit="kg" icon={Wind} color="cyan" />
        <MetricCell title="AI Forecasts Run" value={kpis.total_predictions || 0} unit="ops" icon={Brain} color="violet" />
        <MetricCell title="Vision Scans" value={kpis.total_images || 0} unit="scans" icon={Camera} color="amber" />
      </motion.div>

      <motion.div variants={staggerContainer} className="grid lg:grid-cols-2 gap-6">
        
        {/* Weekly Trend (Area) */}
        <motion.div variants={staggerItem}>
          <Card className="p-6 h-[420px] flex flex-col rounded-3xl shadow-xl">
            <div className="mb-8">
              <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest mb-1">Waste vs Recovery Volume</h3>
              <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">7-Day Historical Trend</p>
            </div>
            <div className="flex-1 min-h-0">
              {data?.weekly_trend?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.weekly_trend} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorW" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/></linearGradient>
                      <linearGradient id="colorR" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} />
                    <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#64748b', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    <Area type="monotone" dataKey="waste" name="Waste" stroke="#ef4444" strokeWidth={3} fill="url(#colorW)" animationDuration={2000} />
                    <Area type="monotone" dataKey="recovered" name="Recovered" stroke="#10b981" strokeWidth={3} fill="url(#colorR)" animationDuration={2000} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : <ChartEmptyState />}
            </div>
          </Card>
        </motion.div>

        {/* Monthly Comparison (Bar) */}
        <motion.div variants={staggerItem}>
          <Card className="p-6 h-[420px] flex flex-col rounded-3xl shadow-xl">
            <div className="mb-8">
              <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest mb-1">Monthly Aggregation</h3>
              <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Macro Volume Comparison</p>
            </div>
            <div className="flex-1 min-h-0">
              {data?.monthly_trend?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.monthly_trend} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: '#334155', opacity: 0.1 }} />
                    <Bar dataKey="waste" name="Waste" fill="#3b82f6" radius={[4,4,0,0]} barSize={30} animationDuration={1500} />
                    <Bar dataKey="recovered" name="Recovered" fill="#0ea5e9" radius={[4,4,0,0]} barSize={30} animationDuration={1500} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <ChartEmptyState />}
            </div>
          </Card>
        </motion.div>

        {/* Category Distribution (Pie) */}
        <motion.div variants={staggerItem}>
          <Card className="p-6 h-[380px] flex flex-col rounded-3xl shadow-xl">
            <div className="mb-2">
              <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest mb-1">Waste Composition</h3>
              <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">By Food Category</p>
            </div>
            <div className="flex-1 min-h-0 relative">
              {data?.category_distribution?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={<ChartTooltip />} />
                    <Pie data={data.category_distribution} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={3} dataKey="value" stroke="none" animationDuration={2000}>
                      {data.category_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : <ChartEmptyState />}
              {/* Legend overlay */}
              <div className="absolute inset-y-0 right-0 flex flex-col justify-center gap-3 pr-4 pointer-events-none">
                {data?.category_distribution?.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{d.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Recovery Strategy (Pie) */}
        <motion.div variants={staggerItem}>
          <Card className="p-6 h-[380px] flex flex-col rounded-3xl shadow-xl">
            <div className="mb-2">
              <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest mb-1">Recovery Strategies</h3>
              <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Distribution of Impact</p>
            </div>
            <div className="flex-1 min-h-0 relative">
              {data?.recovery_distribution?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={<ChartTooltip />} />
                    <Pie data={data.recovery_distribution} cx="50%" cy="50%" innerRadius={0} outerRadius={110} paddingAngle={1} dataKey="value" stroke="none" animationDuration={2000}>
                      {data.recovery_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[(index + 2) % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : <ChartEmptyState />}
              {/* Legend overlay */}
              <div className="absolute inset-y-0 right-0 flex flex-col justify-center gap-3 pr-4 pointer-events-none">
                {data?.recovery_distribution?.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[(i + 2) % CHART_COLORS.length] }} />
                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{d.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

      </motion.div>
    </motion.div>
  );
}
