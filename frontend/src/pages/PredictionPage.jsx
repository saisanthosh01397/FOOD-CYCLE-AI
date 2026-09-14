import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Calendar, Users, Cloud, Star, Brain, TrendingUp, History as HistoryIcon,
  Target, Sparkles, Activity
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../utils/api';
import toast from 'react-hot-toast';
import PageHeader from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import AnimatedNumber from '../components/ui/AnimatedNumber';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, staggerItem, fadeUp, scaleIn } from '../utils/animations';

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
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

export default function PredictionPage() {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [fetchingHistory, setFetchingHistory] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setFetchingHistory(true);
      try {
        const response = await api.get('/history?limit=10');
        if (response.data && response.data.items) {
          const pastLogs = response.data.items;
          const withPredictions = pastLogs.filter(l => l.prediction !== null);
          setHistory(withPredictions);
          
          const cData = pastLogs.reverse().map(l => ({
            date: l.date,
            actual: l.quantity_kg,
            predicted: l.prediction || l.quantity_kg 
          }));
          setChartData(cData);
        }
      } catch (error) {
        console.error("Failed to load history", error);
      } finally {
        setFetchingHistory(false);
      }
    };
    fetchHistory();
  }, [result]); 

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await api.post('/prediction', data);
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        setResult(response.data);
        toast.success('Prediction generated successfully!');
      }
    } catch (error) {
      toast.error('Failed to generate prediction');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <PageHeader 
        title="AI Waste Prediction" 
        description="Forecast expected food waste based on daily parameters using our Prophet time-series model."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* ===== LEFT: Controls ===== */}
        <div className="space-y-6 flex flex-col">
          <motion.div {...fadeUp}>
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[var(--border)]">
                <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center">
                  <Target className="w-4 h-4 text-brand-500" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Forecast Parameters</h3>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Target Date
                  </label>
                  <Input 
                    type="date"
                    icon={Calendar}
                    {...register("date", { required: true })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Meal Type
                  </label>
                  <Select icon={Target} {...register("meal_type", { required: true })}>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="all_day">All Day Event</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    People Served (Est.)
                  </label>
                  <Input 
                    type="number" 
                    placeholder="e.g. 150"
                    icon={Users}
                    {...register("people", { required: true, min: 1 })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Weather
                    </label>
                    <Select icon={Cloud} {...register("weather")}>
                      <option value="sunny">Sunny</option>
                      <option value="rainy">Rainy</option>
                      <option value="cloudy">Cloudy</option>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Event Type
                    </label>
                    <Select icon={Star} {...register("event")}>
                      <option value="none">Normal Day</option>
                      <option value="festival">Festival</option>
                      <option value="corporate">Corporate</option>
                    </Select>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  isLoading={loading}
                  icon={Brain}
                  className="w-full mt-4"
                  size="lg"
                >
                  {loading ? 'Forecasting...' : 'Generate AI Forecast'}
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* Recent History Widget */}
          <motion.div {...fadeUp} className="flex-1">
            <Card className="p-6 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-5">
                <HistoryIcon className="w-4 h-4 text-accent-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Previous Predictions</h3>
              </div>
              
              <div className="flex-1 min-h-0">
                {fetchingHistory ? (
                  <div className="space-y-3">
                    {[1,2,3].map(i => <div key={i} className="h-14 skeleton rounded-xl" />)}
                  </div>
                ) : history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 py-6">
                    <HistoryIcon className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                    <p className="text-sm font-medium text-slate-500">No previous predictions</p>
                  </div>
                ) : (
                  <div className="space-y-3 overflow-y-auto max-h-[300px] hide-scrollbar">
                    {history.map((h, i) => (
                      <div key={i} className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--border)] bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            {h.date}
                            <span className="text-[10px] uppercase bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded-md">
                              {h.meal_type}
                            </span>
                          </p>
                          <p className="text-xs font-medium text-slate-500 mt-1">
                            Actual: <span className="text-slate-700 dark:text-slate-300 font-bold">{h.quantity_kg} kg</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-brand-600 dark:text-brand-400">{h.prediction} <span className="text-xs">kg</span></p>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Predicted</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* ===== RIGHT: Results ===== */}
        <div className="space-y-6 flex flex-col">
          {/* Main Prediction Result */}
          <motion.div {...fadeUp}>
            <Card className="relative overflow-hidden min-h-[360px] flex items-center justify-center">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5 dark:from-brand-500/8 dark:to-transparent pointer-events-none" />
              
              <AnimatePresence mode="wait">
                {!result ? (
                  <motion.div 
                    key="empty"
                    variants={scaleIn}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="flex flex-col items-center justify-center text-center p-8 z-10"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center mb-5 shadow-sm border border-[var(--border)]">
                      <Brain className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">Awaiting Parameters</h3>
                    <p className="text-sm text-slate-500 max-w-xs">
                      Fill out the forecast parameters to generate AI predictions powered by our Prophet time-series model.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="result"
                    variants={fadeUp}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="w-full p-8 z-10"
                  >
                    <div className="flex flex-col items-center text-center mb-8">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-brand-200/50 dark:border-brand-800">
                        <Sparkles className="w-3.5 h-3.5" /> Predicted Waste
                      </div>
                      
                      <div className="relative">
                        <h2 className="text-7xl font-black text-slate-900 dark:text-white tracking-tighter">
                          <AnimatedNumber value={result.predicted_quantity} decimals={1} />
                        </h2>
                        <span className="absolute -right-10 bottom-2 text-2xl font-bold text-slate-400">kg</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-500 mt-3">Target Date: {result.prediction_date}</p>
                    </div>

                    <div className="space-y-6 max-w-sm mx-auto">
                      {/* Confidence */}
                      <div>
                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          <span>Model Confidence</span>
                          <span className="text-brand-600 dark:text-brand-400">{(result.confidence_score * 100).toFixed(1)}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full" 
                            initial={{ width: 0 }}
                            animate={{ width: `${result.confidence_score * 100}%` }}
                            transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
                          />
                        </div>
                      </div>

                      {/* AI Rec */}
                      <div className="bg-white/80 dark:bg-slate-900/80 border border-[var(--border)] rounded-xl p-4 shadow-sm relative overflow-hidden">
                        <div className="absolute left-0 top-0 w-1 h-full bg-accent-500" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-2 ml-2">Actionable Insight</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed ml-2">
                          Based on this forecasted volume, we recommend preparing compost bins early and notifying local donation centers if surplus exceeds 10kg.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>

          {/* Chart */}
          <motion.div {...fadeUp} className="flex-1">
            <Card className="p-6 h-full flex flex-col min-h-[300px]">
              <div className="mb-5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-brand-500" />
                  Actual vs Predicted Accuracy
                </h3>
                <p className="text-xs text-slate-500 mt-1">Comparison of historical forecasts against logged waste</p>
              </div>
              
              <div className="flex-1 min-h-0">
                {fetchingHistory ? (
                  <div className="flex items-center justify-center h-full">
                    <Activity className="w-8 h-8 text-slate-300 animate-pulse" />
                  </div>
                ) : chartData.length === 0 ? (
                   <div className="flex flex-col items-center justify-center h-full gap-3">
                     <Activity className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                     <p className="text-sm font-medium text-slate-500">Not enough data to render chart</p>
                   </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="pActual" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="pPredicted" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.12} />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} dy={8} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                      <Tooltip content={<ChartTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                      <Area type="monotone" dataKey="actual" name="Actual (kg)" stroke="#10b981" strokeWidth={2.5} fill="url(#pActual)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                      <Area type="monotone" dataKey="predicted" name="Predicted (kg)" stroke="#06b6d4" strokeWidth={2.5} fill="url(#pPredicted)" dot={false} strokeDasharray="5 5" activeDot={{ r: 4, strokeWidth: 0 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
