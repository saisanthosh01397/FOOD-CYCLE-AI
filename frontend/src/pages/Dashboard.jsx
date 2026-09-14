import React, { useState, useEffect } from 'react';
import {
  Database, Server, Brain, Camera, CheckCircle2, Leaf, Users,
  AlertCircle, PlusCircle, Clock, Search, Settings, ArrowUpRight,
  Activity, BarChart3, TrendingUp, Zap, ShieldCheck, Recycle, Wind
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import Logo from '../components/ui/Logo';
import AnimatedNumber from '../components/ui/AnimatedNumber';
import StatusDot from '../components/ui/StatusDot';
import { SkeletonCard, SkeletonChart } from '../components/ui/Skeleton';
import { staggerContainer, staggerItem, fadeUp, cardHover } from '../utils/animations';

// Custom Recharts tooltip
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-3 shadow-xl text-sm">
      <p className="font-semibold text-slate-900 dark:text-white mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-bold">
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value} kg
        </p>
      ))}
    </div>
  );
};

// =====================================================
// ADMIN KPI CARD
// =====================================================
function AdminKpiCard({ label, value, sub, icon: Icon, color = 'brand', delay = 0 }) {
  const colorMap = {
    brand:  'text-brand-500  bg-brand-50  dark:bg-brand-900/20',
    accent: 'text-accent-500 bg-accent-50 dark:bg-accent-900/20',
    purple: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20',
    amber:  'text-amber-500  bg-amber-50  dark:bg-amber-900/20',
    rose:   'text-rose-500   bg-rose-50   dark:bg-rose-900/20',
  };
  return (
    <motion.div
      variants={staggerItem}
      whileHover={cardHover}
    >
      <Card className="p-5 hover:border-brand-200 dark:hover:border-brand-800/50 transition-all duration-300">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              {label}
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">
              <AnimatedNumber value={typeof value === 'number' ? value : 0} />
              {typeof value === 'string' && !Number.isNaN(parseFloat(value)) && (
                <span className="text-sm font-semibold text-slate-500 ml-1">{value.replace(/[\d.]/g, '')}</span>
              )}
              {typeof value === 'string' && Number.isNaN(parseFloat(value)) && value}
            </p>
            {sub && <p className="text-xs text-slate-500 dark:text-slate-500 mt-1.5 font-medium">{sub}</p>}
          </div>
          {Icon && (
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${colorMap[color]}`}>
              <Icon className="w-4.5 h-4.5" />
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

// =====================================================
// SYSTEM HEALTH ITEM
// =====================================================
function SystemHealthItem({ label, status, icon: Icon }) {
  const isOk = status === 'ok' || status === 'online';
  return (
    <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--border)] bg-slate-50/50 dark:bg-slate-800/20 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm border border-[var(--border)]">
          <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        </div>
        <span className="font-semibold text-sm text-slate-900 dark:text-white">{label}</span>
      </div>
      <StatusDot status={isOk ? 'ok' : (status ? 'error' : 'offline')} />
    </div>
  );
}

// =====================================================
// EMPTY CHART STATE
// =====================================================
function EmptyChart({ message = 'No activity recorded yet', subtitle = 'Data will appear here once records are added.' }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 py-8">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center">
        <Activity className="w-7 h-7 text-slate-300 dark:text-slate-600" />
      </div>
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{message}</p>
      <p className="text-xs text-slate-400 dark:text-slate-600 text-center max-w-[200px]">{subtitle}</p>
    </div>
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
          user?.role === 'Administrator'
            ? api.get('/dashboard/system-health')
            : Promise.resolve({ data: null })
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

  // =====================================================
  // LOADING STATE
  // =====================================================
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-56 skeleton" />
            <div className="h-4 w-72 skeleton opacity-60" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 h-96">
            <div className="h-5 w-40 skeleton mb-2" />
            <div className="h-4 w-56 skeleton mb-6 opacity-60" />
            <SkeletonChart className="h-60" />
          </div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-16 skeleton rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  const regularUsers = Math.max(0,
    (sysStatus?.total_users || 0)
    - (sysStatus?.total_admins || 0)
    - (sysStatus?.total_managers || 0)
  );

  // =====================================================
  // ADMINISTRATOR DASHBOARD
  // =====================================================
  if (user?.role === 'Administrator') {
    return (
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <motion.div {...fadeUp}>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-5 h-5 text-brand-500" />
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">Administrator</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Admin Control Center
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Platform overview, system health, and user management.
              </p>
            </motion.div>
          </div>
          <motion.div {...fadeUp} className="flex flex-wrap items-center gap-3">
            {/* Admin avatar pill */}
            <div className="flex items-center gap-2.5 bg-white dark:bg-slate-900 border border-[var(--border)] rounded-full px-3 py-1.5 shadow-sm">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center font-bold text-xs">
                {user?.full_name?.charAt(0) || 'A'}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">{user?.full_name}</p>
                <p className="text-[10px] text-brand-500 font-semibold">Administrator</p>
              </div>
            </div>
            <Link to="/users">
              <Button icon={Users} variant="secondary" size="sm">Manage Users</Button>
            </Link>
            <Link to="/settings">
              <Button icon={Settings} variant="outline" size="sm">Settings</Button>
            </Link>
          </motion.div>
        </div>

        {/* KPI Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3"
        >
          <AdminKpiCard
            label="Total Users"
            value={sysStatus?.total_users || 0}
            sub={`${sysStatus?.active_users || 0} active`}
            icon={Users}
            color="brand"
          />
          <AdminKpiCard
            label="Total Waste"
            value={analytics?.kpis?.total_waste?.toFixed(1) || 0}
            sub="kg logged"
            icon={Leaf}
            color="amber"
          />
          <AdminKpiCard
            label="Predictions"
            value={analytics?.kpis?.total_predictions || 0}
            icon={Brain}
            color="purple"
          />
          <AdminKpiCard
            label="Images Analyzed"
            value={analytics?.kpis?.total_images || 0}
            icon={Camera}
            color="accent"
          />
          <AdminKpiCard
            label="Administrators"
            value={sysStatus?.total_admins || 0}
            icon={ShieldCheck}
            color="rose"
          />
          <AdminKpiCard
            label="Mess Managers"
            value={sysStatus?.total_managers || 0}
            icon={Zap}
            color="amber"
          />
          <AdminKpiCard
            label="Regular Users"
            value={regularUsers}
            icon={Users}
            color="brand"
          />
        </motion.div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Weekly Activity Chart */}
          <motion.div {...fadeUp} className="lg:col-span-2">
            <Card className="p-6 flex flex-col h-[400px]">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Weekly Platform Activity</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Food waste logged across all facilities</p>
                </div>
                <BarChart3 className="w-5 h-5 text-slate-300 dark:text-slate-700" />
              </div>
              <div className="flex-1 min-h-0">
                {(!analytics?.weekly_trend || analytics.weekly_trend.length === 0) ? (
                  <EmptyChart message="No waste activity yet" subtitle="Food waste logs will display here as records are added." />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.weekly_trend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="adminWasteGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#10b981" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.12} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={8} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                      <Tooltip content={<ChartTooltip />} />
                      <Area type="monotone" dataKey="waste" name="Waste" stroke="#10b981" strokeWidth={2.5} fill="url(#adminWasteGrad)" dot={false} activeDot={{ r: 5, strokeWidth: 0, fill: '#10b981' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Right column: System Health + Recent Activity */}
          <div className="flex flex-col gap-5">

            {/* System Health */}
            <motion.div {...fadeUp}>
              <Card className="p-5">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">System Health</h3>
                <p className="text-xs text-slate-500 mb-4">Real-time infrastructure status</p>
                <div className="space-y-2.5">
                  <SystemHealthItem label="FastAPI Backend"   status={sysStatus?.server}   icon={Server} />
                  <SystemHealthItem label="MySQL Database"    status={sysStatus?.database}  icon={Database} />
                  <SystemHealthItem label="Prophet Model"     status={sysStatus?.prophet}   icon={Brain} />
                  <SystemHealthItem label="YOLOv8 Engine"     status={sysStatus?.yolo}      icon={Camera} />
                </div>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div {...fadeUp} className="flex-1">
              <Card className="p-5 flex flex-col h-full min-h-0">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Recent Activity</h3>
                <p className="text-xs text-slate-500 mb-4">Latest system events</p>
                <div className="flex-1 overflow-y-auto hide-scrollbar space-y-3">
                  {(!analytics?.recent_logs || analytics.recent_logs.length === 0) ? (
                    <div className="flex flex-col items-center justify-center py-6 text-slate-400 dark:text-slate-600">
                      <Clock className="w-8 h-8 mb-2 opacity-40" />
                      <p className="text-xs font-medium">No recent activity</p>
                    </div>
                  ) : (
                    analytics.recent_logs.map((log, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center shrink-0">
                          <Leaf className="w-3.5 h-3.5 text-brand-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                            Waste logged: {log.food_category}
                          </p>
                          <p className="text-[10px] text-slate-500">{log.quantity_kg} kg</p>
                        </div>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // MESS MANAGER DASHBOARD
  // =====================================================
  if (user?.role === 'Mess Manager') {
    const kpis = [
      { label: 'Total Waste',     value: analytics?.kpis?.total_waste?.toFixed(1) || 0,    suffix: ' kg', color: 'border-l-blue-500',   icon: Leaf,    iconBg: 'bg-blue-50 dark:bg-blue-900/20 text-blue-500'   },
      { label: 'Compost',         value: analytics?.kpis?.total_compost?.toFixed(1) || 0,  suffix: ' kg', color: 'border-l-brand-500',  icon: Recycle, iconBg: 'bg-brand-50 dark:bg-brand-900/20 text-brand-500' },
      { label: 'Donations',       value: analytics?.kpis?.total_donations?.toFixed(1) || 0,suffix: ' kg', color: 'border-l-amber-500',  icon: Users,   iconBg: 'bg-amber-50 dark:bg-amber-900/20 text-amber-500'  },
      { label: 'CO₂ Saved',       value: analytics?.kpis?.carbon_saved?.toFixed(1) || 0,   suffix: ' kg', color: 'border-l-accent-500', icon: Wind,    iconBg: 'bg-accent-50 dark:bg-accent-900/20 text-accent-500'},
    ];

    return (
      <div className="space-y-6">

        {/* Header */}
        <motion.div {...fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Mess Manager</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Operations Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Track daily waste, predictions, and recovery metrics.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/vision">
              <Button icon={Camera} variant="outline" size="sm">Analyze Image</Button>
            </Link>
            <Link to="/prediction">
              <Button icon={PlusCircle} size="sm">Log Waste</Button>
            </Link>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {kpis.map((kpi, i) => {
            const IconEl = kpi.icon;
            return (
              <motion.div key={i} variants={staggerItem} whileHover={cardHover}>
                <Card className={`p-5 border-l-4 ${kpi.color} hover:shadow-md transition-all duration-300`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{kpi.label}</p>
                      <p className="text-2xl font-black text-slate-900 dark:text-white">
                        <AnimatedNumber value={parseFloat(kpi.value) || 0} decimals={1} suffix={kpi.suffix} />
                      </p>
                    </div>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${kpi.iconBg}`}>
                      <IconEl className="w-4.5 h-4.5" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Chart + Recent logs */}
        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div {...fadeUp} className="lg:col-span-2">
            <Card className="p-6 h-[380px] flex flex-col">
              <div className="mb-5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Weekly Recovery Trends</h3>
                <p className="text-sm text-slate-500 mt-0.5">Amount of waste successfully recovered</p>
              </div>
              <div className="flex-1 min-h-0">
                {(!analytics?.weekly_trend || analytics.weekly_trend.length === 0) ? (
                  <EmptyChart message="No recovery data yet" subtitle="Recovery trends will appear once waste records are added." />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.weekly_trend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="recoveryGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#06b6d4" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.12} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={8} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                      <Tooltip content={<ChartTooltip />} />
                      <Area type="monotone" dataKey="recovered" name="Recovered" stroke="#06b6d4" strokeWidth={2.5} fill="url(#recoveryGrad)" dot={false} activeDot={{ r: 5, strokeWidth: 0, fill: '#06b6d4' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>
          </motion.div>

          <motion.div {...fadeUp}>
            <Card className="p-5 h-[380px] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Recent Logs</h3>
                <Link to="/history" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                  View all →
                </Link>
              </div>
              <div className="flex-1 overflow-y-auto hide-scrollbar space-y-2.5">
                {(!analytics?.recent_logs || analytics.recent_logs.length === 0) ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-600">
                    <Clock className="w-8 h-8 mb-2 opacity-40" />
                    <p className="text-xs font-medium">No recent activity</p>
                  </div>
                ) : (
                  analytics.recent_logs.map((log, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-[var(--border)] bg-slate-50/50 dark:bg-slate-800/20 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{log.food_category}</p>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(log.date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-[var(--border)] shadow-sm">
                        {log.quantity_kg} kg
                      </span>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // =====================================================
  // REGULAR USER DASHBOARD
  // =====================================================
  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      {/* Welcome hero card */}
      <motion.div {...fadeUp}>
        <Card className="relative overflow-hidden p-10 text-center">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5 dark:from-brand-500/8 dark:to-accent-500/8 pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-accent-500/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div
              className="w-20 h-20 mx-auto mb-6"
              style={{ animation: 'float-gentle 4s ease-in-out infinite' }}
            >
              <Logo className="w-20 h-20 text-brand-500" animated />
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3 text-slate-900 dark:text-white">
              Welcome back, {user?.full_name?.split(' ')[0]}!
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto mb-8 text-base">
              Upload food waste images or run predictions to get started with AI-driven sustainability recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/vision">
                <Button icon={Camera} size="lg" className="w-full sm:w-auto shadow-lg shadow-brand-500/20">
                  Analyze Image
                </Button>
              </Link>
              <Link to="/prediction">
                <Button icon={Search} size="lg" variant="outline" className="w-full sm:w-auto bg-white dark:bg-slate-900">
                  Predict Waste
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        <motion.div variants={staggerItem} whileHover={cardHover}>
          <Card className="p-6 hover:border-brand-200 dark:hover:border-brand-800/50 transition-all duration-300 group">
            <div className="w-11 h-11 rounded-2xl bg-accent-50 dark:bg-accent-900/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Brain className="w-5.5 h-5.5 text-accent-500" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">My AI Activity</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              You have requested{' '}
              <strong className="text-slate-900 dark:text-white">{analytics?.kpis?.total_images || 0}</strong>{' '}
              image analyses and{' '}
              <strong className="text-slate-900 dark:text-white">{analytics?.kpis?.total_predictions || 0}</strong>{' '}
              waste predictions so far.
            </p>
            <Link to="/profile" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 dark:text-brand-400 hover:gap-2.5 transition-all group">
              View My Profile <ArrowUpRight className="w-4 h-4" />
            </Link>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem} whileHover={cardHover}>
          <Card className="p-6 hover:border-brand-200 dark:hover:border-brand-800/50 transition-all duration-300 group">
            <div className="w-11 h-11 rounded-2xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Leaf className="w-5.5 h-5.5 text-brand-500" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Sustainability Impact</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              You've helped save{' '}
              <strong className="text-slate-900 dark:text-white">
                {analytics?.kpis?.carbon_saved?.toFixed(1) || 0} kg
              </strong>{' '}
              of CO₂ emissions through intelligent recovery recommendations.
            </p>
            <Link to="/history" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 dark:text-brand-400 hover:gap-2.5 transition-all group">
              View My History <ArrowUpRight className="w-4 h-4" />
            </Link>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
