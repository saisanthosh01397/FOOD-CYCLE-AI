import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Activity, BarChart3, PieChart as PieChartIcon, Leaf, AlertCircle, Wind, Brain, Camera } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import PageHeader from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { SkeletonCard, SkeletonChart } from '../components/ui/Skeleton';
import AnimatedNumber from '../components/ui/AnimatedNumber';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, fadeUp } from '../utils/animations';

const CHART_COLORS = ['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#ec4899'];

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-3 shadow-xl text-sm">
      {label && <p className="font-semibold text-slate-900 dark:text-white mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-bold">
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
          {p.unit || ''}
        </p>
      ))}
    </div>
  );
};

function ChartEmptyState({ message = 'No data available' }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <Activity className="w-6 h-6 text-slate-300 dark:text-slate-600" />
      </div>
      <p className="text-sm font-medium text-slate-400 dark:text-slate-600">{message}</p>
    </div>
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
      <div className="space-y-6">
        <div className="h-8 w-56 skeleton mb-2" />
        <div className="h-4 w-80 skeleton opacity-60 mb-6" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 h-[350px]">
              <div className="h-5 w-40 skeleton mb-2" />
              <SkeletonChart className="h-60 mt-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p className="font-bold text-slate-900 dark:text-white">Failed to load analytics</p>
        <p className="text-sm text-slate-500">There was a problem retrieving data from the server.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics & Reports"
        description="Deep dive into food waste generation, predictions, and sustainability impact."
      />

      {/* KPI row — only REAL data from backend */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          {
            label: 'Total Waste',
            value: data.kpis?.total_waste || 0,
            suffix: ' kg',
            icon: Leaf,
            decimals: 1,
            iconBg: 'bg-amber-50 dark:bg-amber-900/20 text-amber-500'
          },
          {
            label: 'CO₂ Emissions Saved',
            value: data.kpis?.carbon_saved || 0,
            suffix: ' kg',
            icon: Wind,
            decimals: 1,
            iconBg: 'bg-brand-50 dark:bg-brand-900/20 text-brand-500'
          },
          {
            label: 'Total Predictions',
            value: data.kpis?.total_predictions || 0,
            icon: Brain,
            decimals: 0,
            iconBg: 'bg-purple-50 dark:bg-purple-900/20 text-purple-500'
          },
          {
            label: 'Images Analyzed',
            value: data.kpis?.total_images || 0,
            icon: Camera,
            decimals: 0,
            iconBg: 'bg-accent-50 dark:bg-accent-900/20 text-accent-500'
          },
        ].map((kpi, idx) => {
          const IconEl = kpi.icon;
          return (
            <motion.div key={idx} variants={staggerItem} whileHover={{ y: -3, transition: { duration: 0.2 } }}>
              <Card className="p-5 hover:border-brand-200 dark:hover:border-brand-800/50 transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{kpi.label}</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">
                      <AnimatedNumber value={kpi.value} decimals={kpi.decimals} suffix={kpi.suffix || ''} />
                    </p>
                  </div>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${kpi.iconBg}`}>
                    <IconEl className="w-4 h-4" />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Row 1: Waste vs Recovery + Monthly Comparison */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div {...fadeUp}>
          <Card className="p-6 h-[360px] flex flex-col">
            <div className="mb-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-brand-500" />
                Waste vs Recovery (Weekly)
              </h3>
              <p className="text-xs text-slate-500 mt-1">Generated waste compared to successfully recovered amount</p>
            </div>
            <div className="flex-1 min-h-0">
              {(!data.weekly_trend || data.weekly_trend.length === 0) ? (
                <ChartEmptyState message="No weekly data available" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.weekly_trend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gWaste" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#f43f5e" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gRec" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#10b981" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.12} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={8} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
                    <Area type="monotone" dataKey="waste" name="Waste" stroke="#f43f5e" strokeWidth={2} fill="url(#gWaste)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                    <Area type="monotone" dataKey="recovered" name="Recovered" stroke="#10b981" strokeWidth={2} fill="url(#gRec)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div {...fadeUp}>
          <Card className="p-6 h-[360px] flex flex-col">
            <div className="mb-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-accent-500" />
                Monthly Waste Comparison
              </h3>
              <p className="text-xs text-slate-500 mt-1">Month-over-month waste generation trends</p>
            </div>
            <div className="flex-1 min-h-0">
              {(!data.monthly_trend || data.monthly_trend.length === 0) ? (
                <ChartEmptyState message="No monthly data available" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.monthly_trend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.12} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={8} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="waste" name="Waste (kg)" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Row 2: Distribution charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {[
          { label: 'Category Distribution', data: data.category_distribution, key: 'category_distribution' },
          { label: 'Meal Type Distribution', data: data.meal_type_distribution, key: 'meal_type_distribution' },
          { label: 'Recovery Methods', data: data.recovery_distribution, key: 'recovery_distribution' },
        ].map((chart) => (
          <motion.div key={chart.key} {...fadeUp}>
            <Card className="p-6 h-[320px] flex flex-col">
              <div className="mb-5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-slate-400" />
                  {chart.label}
                </h3>
              </div>
              <div className="flex-1 min-h-0">
                {(!chart.data || chart.data.length === 0) ? (
                  <ChartEmptyState message={`No ${chart.label.toLowerCase()} data`} />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chart.data}
                        cx="50%"
                        cy="50%"
                        innerRadius="40%"
                        outerRadius="65%"
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {chart.data.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null;
                          const d = payload[0];
                          return (
                            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-3 shadow-xl text-xs">
                              <p className="font-bold" style={{ color: d.payload.fill }}>{d.name}</p>
                              <p className="text-slate-900 dark:text-white font-black">{typeof d.value === 'number' ? d.value.toFixed(1) : d.value}</p>
                            </div>
                          );
                        }}
                      />
                      <Legend
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                        formatter={(value) => (
                          <span className="text-slate-600 dark:text-slate-400">{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
