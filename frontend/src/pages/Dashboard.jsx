import React, { useState, useEffect } from 'react';
import {
  Database, Server, Brain, Camera, Leaf, Users,
  PlusCircle, Clock, Settings, ArrowUpRight,
  Activity, BarChart3, TrendingUp, ShieldCheck, Recycle, Wind, ArrowRight,
  Droplets
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import AnimatedNumber from '../components/ui/AnimatedNumber';
import StatusDot from '../components/ui/StatusDot';
import { SkeletonCard, SkeletonChart } from '../components/ui/Skeleton';
import { staggerContainer, staggerItem, fadeUp, cardHover } from '../utils/animations';

// =====================================================
// CHART TOOLTIP
// =====================================================
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 shadow-2xl text-sm backdrop-blur-xl">
      <p className="font-bold text-[var(--text-primary)] mb-2">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-bold text-xs uppercase tracking-wider flex items-center justify-between gap-4">
          <span>{p.name}</span> <span>{typeof p.value === 'number' ? p.value.toFixed(1) : p.value} kg</span>
        </p>
      ))}
    </div>
  );
};

// =====================================================
// CINEMATIC HERO DASHBOARD VISUALIZATION
// =====================================================
function DashboardEcosystem({ data }) {
  const waste = data?.kpis?.total_waste || 0;
  const recovered = data?.kpis?.total_compost + data?.kpis?.total_donation || 0;
  
  return (
    <div className="relative w-40 h-40 md:w-56 md:h-56 mx-auto flex items-center justify-center shrink-0">
      {/* Background Pulse */}
      <motion.div 
        className="absolute inset-0 rounded-full bg-brand-500/10 dark:bg-brand-500/5 blur-2xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* The Cycle Rings */}
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-200 dark:text-slate-800" />
        <motion.circle 
          cx="50" cy="50" r="45" fill="none" 
          stroke="url(#cycleGrad)" strokeWidth="3" 
          strokeLinecap="round"
          strokeDasharray="283"
          initial={{ strokeDashoffset: 283 }}
          animate={{ strokeDashoffset: 283 - (283 * 0.75) }} // Represents 75% flow
          transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
        />
        <defs>
          <linearGradient id="cycleGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Nodes on the cycle */}
      {[
        { i: Droplets, a: 0,   c: 'text-brand-500' },
        { i: Brain,    a: 90,  c: 'text-accent-500' },
        { i: Recycle,  a: 180, c: 'text-violet-500' },
      ].map((node, i) => {
        const rad = (node.a * Math.PI) / 180;
        const cx = 50 + 45 * Math.cos(rad);
        const cy = 50 + 45 * Math.sin(rad);
        const Icon = node.i;
        return (
          <motion.div
            key={i}
            className={`absolute w-8 h-8 -ml-4 -mt-4 bg-[var(--surface)] rounded-full border border-[var(--border)] shadow-lg flex items-center justify-center ${node.c}`}
            style={{ left: `${cx}%`, top: `${cy}%` }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 + i * 0.2, type: 'spring' }}
          >
            <Icon className="w-3.5 h-3.5" />
          </motion.div>
        );
      })}

      {/* Central Metric */}
      <motion.div 
        className="absolute inset-0 flex flex-col items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Processed</span>
        <span className="text-2xl md:text-3xl font-black text-[var(--text-primary)] tracking-tighter">
          <AnimatedNumber value={waste} />
          <span className="text-sm font-bold text-[var(--text-muted)] ml-1">kg</span>
        </span>
      </motion.div>
    </div>
  );
}

// =====================================================
// KPI CARD
// =====================================================
function MetricCard({ title, value, unit, icon: Icon, color = 'brand', subtext, trend }) {
  const colorMap = {
    brand:  'text-brand-500  bg-brand-50  dark:bg-brand-900/20 border-brand-200 dark:border-brand-900/30',
    accent: 'text-accent-500 bg-accent-50 dark:bg-accent-900/20 border-accent-200 dark:border-accent-900/30',
    purple: 'text-violet-500 bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-900/30',
    amber:  'text-amber-500  bg-amber-50  dark:bg-amber-900/20 border-amber-200 dark:border-amber-900/30',
  };
  
  return (
    <motion.div variants={staggerItem} whileHover={cardHover}>
      <Card className="p-5 flex flex-col h-full hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[50px] -mr-10 -mt-10 opacity-50 transition-opacity group-hover:opacity-100 ${colorMap[color].split(' ')[1]}`} />
        <div className="flex items-start justify-between mb-4 relative z-10">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${colorMap[color]} shadow-sm group-hover:scale-110 transition-transform`}>
            <Icon className="w-5 h-5" />
          </div>
          {trend && (
            <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${trend > 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </div>
          )}
        </div>
        <div className="relative z-10 flex-1 flex flex-col justify-end">
          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">
            {title}
          </p>
          <p className="text-3xl font-black text-[var(--text-primary)] tracking-tighter flex items-baseline gap-1">
            <AnimatedNumber value={typeof value === 'number' ? value : 0} />
            <span className="text-sm font-bold text-[var(--text-muted)]">{unit}</span>
          </p>
          {subtext && <p className="text-[10px] text-[var(--text-muted)] mt-2 font-medium">{subtext}</p>}
        </div>
      </Card>
    </motion.div>
  );
}

// =====================================================
// MAIN DASHBOARD COMPONENT
// =====================================================
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
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchDashboard();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-48 skeleton rounded-3xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <div className="h-96 skeleton rounded-3xl" />
      </div>
    );
  }

  // =====================================================
  // ADMINISTRATOR COMMAND CENTER
  // =====================================================
  if (user?.role === 'Administrator') {
    return (
      <div className="space-y-6">
        {/* Cinematic Hero */}
        <motion.div {...fadeUp}>
          <Card className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-none shadow-2xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 justify-between">
            {/* Ambient Background Effects */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="relative z-10 flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 mb-6">
                <ShieldCheck className="w-4 h-4 text-brand-400" />
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Admin Command Center</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
                Welcome back, <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">
                  {user.full_name}
                </span>
              </h1>
              <p className="text-slate-300 font-medium max-w-md mx-auto md:mx-0">
                System operations are nominal. AI predictive models and resource routing are functioning optimally.
              </p>
              
              <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
                <Link to="/users"><Button variant="primary" icon={Users} className="rounded-full shadow-lg shadow-brand-500/20 border border-brand-400/50">Manage Access</Button></Link>
                <Link to="/settings"><Button variant="outline" icon={Settings} className="rounded-full border-white/20 text-white hover:bg-white/10">System Config</Button></Link>
              </div>
            </div>

            <div className="relative z-10 shrink-0">
              <DashboardEcosystem data={analytics} />
            </div>
          </Card>
        </motion.div>

        {/* Global Metrics Row */}
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Total Platform Users" value={sysStatus?.total_users || 0} unit="users" icon={Users} color="brand" subtext={`${sysStatus?.active_users || 0} currently active`} />
          <MetricCard title="AI Predictions Run" value={analytics?.kpis?.total_predictions || 0} unit="ops" icon={Brain} color="purple" trend={12} />
          <MetricCard title="Images Analyzed" value={analytics?.kpis?.total_images || 0} unit="scans" icon={Camera} color="accent" />
          <MetricCard title="Carbon Mitigated" value={analytics?.kpis?.carbon_saved || 0} unit="kg CO₂" icon={Wind} color="amber" subtext="Across all facilities" />
        </motion.div>

        {/* Main Analytics Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div {...fadeUp} className="lg:col-span-2">
            <Card className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-base font-bold text-[var(--text-primary)] uppercase tracking-wider">Network Waste Trend</h3>
                  <p className="text-xs font-medium text-[var(--text-muted)] mt-1">Aggregated historical logs across all locations</p>
                </div>
                <div className="p-2 bg-brand-50 dark:bg-brand-900/30 rounded-xl border border-brand-100 dark:border-brand-900/50">
                  <TrendingUp className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                </div>
              </div>
              <div className="flex-1 min-h-[300px]">
                {analytics?.weekly_trend?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.weekly_trend} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} />
                      <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#64748b', strokeWidth: 1, strokeDasharray: '4 4' }}/>
                      <Area type="monotone" dataKey="waste" name="Total Waste" stroke="#10b981" strokeWidth={3} fill="url(#colorWaste)" activeDot={{r: 6, strokeWidth: 0, fill: '#10b981'}} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-[var(--text-muted)] font-medium text-sm">Insufficient data</div>
                )}
              </div>
            </Card>
          </motion.div>

          <motion.div {...fadeUp} className="flex flex-col gap-6">
            {/* System Health */}
            <Card className="p-6 flex-1">
              <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-6">Infrastructure Status</h3>
              <div className="space-y-3">
                {[
                  { l: 'Core Database',  s: sysStatus?.database, i: Database },
                  { l: 'API Services',   s: sysStatus?.server,   i: Server },
                  { l: 'Prophet Engine', s: sysStatus?.prophet,  i: Brain },
                  { l: 'YOLOv8 Vision',  s: sysStatus?.yolo,     i: Camera },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-[var(--surface-elevated)] dark:bg-slate-800/50 border border-[var(--border)] group hover:border-brand-500/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <item.i className="w-5 h-5 text-[var(--text-muted)] group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                      <span className="font-bold text-sm text-[var(--text-secondary)]">{item.l}</span>
                    </div>
                    <StatusDot status={item.s === 'ok' || item.s === 'online' ? 'ok' : 'error'} />
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // =====================================================
  // MESS MANAGER & USER DASHBOARD
  // =====================================================
  return (
    <div className="space-y-6">
      <motion.div {...fadeUp}>
        <Card className="relative overflow-hidden bg-gradient-to-r from-brand-600 to-accent-600 border-none shadow-xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 justify-between text-white">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
          
          <div className="relative z-10 flex-1">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
              Good {new Date().getHours() < 12 ? 'Morning' : 'Afternoon'}, {user.full_name}
            </h1>
            <p className="text-brand-100 font-medium max-w-lg leading-relaxed">
              {user.role === 'Mess Manager' 
                ? "Your facility's daily sustainability overview. Ensure to log today's waste and run predictions for tomorrow's meals."
                : "Welcome to your personal sustainability dashboard. Track your contributions to the circular food economy."}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/recovery"><Button className="rounded-full bg-white text-brand-600 hover:bg-[var(--surface-elevated)] border-transparent shadow-lg" icon={Recycle}>AI Recovery</Button></Link>
              <Link to="/prediction"><Button variant="outline" className="rounded-full border-white/30 text-white hover:bg-white/10" icon={Brain}>Run Forecast</Button></Link>
            </div>
          </div>
          
          <div className="relative z-10 hidden md:block shrink-0">
             <DashboardEcosystem data={analytics} />
          </div>
        </Card>
      </motion.div>

      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Waste Logged" value={analytics?.kpis?.total_waste || 0} unit="kg" icon={Droplets} color="brand" />
        <MetricCard title="Waste Recovered" value={(analytics?.kpis?.total_compost || 0) + (analytics?.kpis?.total_donation || 0)} unit="kg" icon={Recycle} color="purple" trend={8.4} />
        <MetricCard title="AI Operations" value={(analytics?.kpis?.total_predictions || 0) + (analytics?.kpis?.total_images || 0)} unit="ops" icon={Brain} color="accent" />
        <MetricCard title="Carbon Mitigated" value={analytics?.kpis?.carbon_saved || 0} unit="kg CO₂" icon={Wind} color="amber" />
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div {...fadeUp} className="lg:col-span-2">
          <Card className="p-6 h-full flex flex-col">
            <div className="mb-8">
              <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">Recent Activity Timeline</h3>
            </div>
            <div className="flex-1 min-h-[300px]">
              {analytics?.recent_logs?.length > 0 ? (
                <div className="space-y-4">
                  {analytics.recent_logs.map((log, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-2xl bg-[var(--surface-elevated)] dark:bg-slate-800/30 border border-[var(--border)] hover:border-brand-200 dark:hover:border-brand-800/50 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[var(--surface)] flex items-center justify-center shadow-sm border border-[var(--border)] group-hover:scale-110 transition-transform">
                          <Activity className="w-5 h-5 text-brand-500" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[var(--text-primary)]">Logged {log.quantity_kg}kg of {log.food_category}</p>
                          <p className="text-xs text-[var(--text-muted)] font-medium mt-1">{log.date} • {log.meal_type}</p>
                        </div>
                      </div>
                      <div className="text-right hidden sm:block">
                        <Badge variant="primary">{log.status}</Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-3 opacity-50">
                   <Activity className="w-8 h-8 text-[var(--text-muted)]" />
                   <span className="text-sm font-bold">No recent logs found.</span>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
        
        <motion.div {...fadeUp}>
           <Card className="p-6 h-full">
              <div className="mb-6 flex items-center gap-2">
                <Brain className="w-5 h-5 text-accent-500" />
                <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">AI Insight</h3>
              </div>
              <div className="p-5 rounded-2xl bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-900/50">
                 <p className="text-sm font-medium text-[var(--text-secondary)] leading-relaxed mb-4">
                   Based on your recent logging patterns, your facility is maintaining a <span className="font-bold text-emerald-600 dark:text-emerald-400">76% recovery rate</span> this week. Prophet model predicts a slight increase in vegetable waste on Friday.
                 </p>
                 <Link to="/prediction" className="text-xs font-bold text-accent-600 dark:text-accent-400 hover:underline flex items-center gap-1">
                   Run detailed forecast <ArrowRight className="w-3 h-3" />
                 </Link>
              </div>
           </Card>
        </motion.div>
      </div>
    </div>
  );
}

// Inline Badge component for the activity list
function Badge({ children, variant = 'primary' }) {
  const v = {
    primary: 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 border-brand-200/50 dark:border-brand-800',
  };
  return <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md border ${v[variant]}`}>{children}</span>;
}
