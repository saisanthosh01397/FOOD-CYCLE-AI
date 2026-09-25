import React, { useState } from 'react';
import { Leaf, Box, Wind, ArrowRight, Activity, Sparkles, TestTube2, Sprout, Network, Zap, CheckCircle2, Recycle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, staggerItem, pageFloatUp } from '../utils/animations';

const strategies = [
  {
    title: 'Composting',
    icon: Sprout,
    description: 'Convert organic waste into nutrient-rich fertilizer for local agriculture.',
    npk: { N: 'High', P: 'Medium', K: 'High' },
    output: 'Rich Soil Conditioner',
    color: 'from-emerald-400 to-green-600',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
    accent: '#10b981',
    suitability: 'Ideal for vegetable scraps, fruit peels, and coffee grounds.'
  },
  {
    title: 'Biogas Generation',
    icon: Wind,
    description: 'Anaerobic digestion produces renewable methane energy and liquid digestate.',
    npk: { N: 'Medium', P: 'Low', K: 'Medium' },
    output: 'Methane Gas & Digestate',
    color: 'from-cyan-400 to-blue-600',
    iconBg: 'bg-cyan-500/10',
    iconColor: 'text-cyan-500',
    accent: '#06b6d4',
    suitability: 'Best for cooked food waste, dairy, and mixed organics.'
  },
  {
    title: 'Donation Hub',
    icon: Box,
    description: 'Redirect surplus edible food to local charities, NGOs, and food banks.',
    npk: { N: 'N/A', P: 'N/A', K: 'N/A' },
    output: 'Meals for Communities',
    color: 'from-amber-400 to-orange-600',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
    accent: '#f59e0b',
    suitability: 'Requires untouched, safely stored surplus food within expiry.'
  },
];

// =====================================================
// AI PATHWAY ANIMATION (Cinematic)
// =====================================================
function AIPathway({ active, result }) {
  if (!active && !result) {
    return (
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <svg className="w-full h-24" viewBox="0 0 400 100" preserveAspectRatio="none">
           <path d="M 50 50 Q 200 50 350 50" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
        </svg>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* 1. Animated Pathway SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        <motion.path 
          d="M 10 50 C 150 50 200 10 390 50" 
          fill="none" stroke="url(#flowGrad)" strokeWidth="4" strokeDasharray="10 10" strokeLinecap="round"
          initial={{ strokeDashoffset: 100, opacity: 0 }}
          animate={{ strokeDashoffset: 0, opacity: 0.6 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <defs>
          <linearGradient id="flowGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* 2. Floating AI Data Nodes */}
      <motion.div 
        className="absolute top-1/2 left-1/4 w-3 h-3 bg-brand-400 rounded-full shadow-[0_0_15px_#34d399]"
        initial={{ x: -100, y: '-50%', opacity: 0 }}
        animate={{ x: 300, y: '-50%', opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/3 w-2 h-2 bg-accent-400 rounded-full shadow-[0_0_10px_#22d3ee]"
        initial={{ x: -100, y: '-50%', opacity: 0 }}
        animate={{ x: 300, y: '-50%', opacity: [0, 1, 0] }}
        transition={{ duration: 2.5, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export default function RecoveryPage() {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [liveRec, setLiveRec] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const onSubmit = async (data) => {
    setLoading(true);
    setLiveRec(null);
    setErrorMsg(null);
    try {
      // Cast numeric inputs
      const payload = {
        ...data,
        quantity_kg: parseFloat(data.quantity_kg),
        moisture: parseFloat(data.moisture),
        freshness: parseFloat(data.freshness),
        contamination_level: parseFloat(data.contamination_level),
        organic_percentage: parseFloat(data.organic_percentage),
      };
      const res = await api.post('/recovery', payload);
      if (res.data.error) {
        setErrorMsg(res.data.error);
        toast.error('Analysis failed');
      } else {
        setLiveRec(res.data);
        toast.success('Recommendation generated!');
      }
      setLoading(false);
    } catch (e) {
      setErrorMsg(e.response?.data?.message || e.message || 'Failed to communicate with the recovery engine.');
      toast.error('Analysis failed');
      setLoading(false);
    }
  };

  return (
    <motion.div variants={pageFloatUp} initial="initial" animate="animate" exit="exit" className="space-y-8 max-w-6xl mx-auto">
      
      <div className="flex items-center justify-between shrink-0 mb-4">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-3">
            <Recycle className="w-8 h-8 text-brand-500" /> Recovery Strategies
          </h1>
          <p className="text-[var(--text-muted)] font-medium mt-1">AI-powered routing to maximize sustainability impact from food waste.</p>
        </div>
      </div>

      {/* AI Recommendation Engine */}
      <motion.div variants={staggerItem}>
        <Card className="relative overflow-hidden bg-[var(--surface)] border-[var(--border)] shadow-2xl rounded-3xl p-2 flex flex-col group">
          {/* Ambient Glow */}
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] bg-gradient-to-r from-brand-500/10 via-accent-500/5 to-transparent blur-3xl pointer-events-none" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-4 h-full">
            
            {/* Input Form */}
            <div className="bg-[var(--surface-hover)] p-6 md:p-8 rounded-2xl border border-[var(--border)] h-full">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[var(--border)]">
                <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/30">
                  <Network className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--text-primary)] uppercase tracking-wider">Evaluation Engine</h3>
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-0.5">Input Waste Profile</p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-20">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1.5">Food Category</label>
                    <Select {...register('food_category')} className="h-10 bg-[var(--surface)] text-sm">
                      <option value="Vegetables">Vegetables</option>
                      <option value="Meat">Meat</option>
                      <option value="Grains">Grains</option>
                      <option value="Dairy">Dairy</option>
                      <option value="Mixed">Mixed Food Waste</option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1.5">Quantity (kg)</label>
                    <Input type="number" step="0.1" {...register('quantity_kg')} defaultValue={10} className="h-10 bg-[var(--surface)] text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1.5">Moisture (%)</label>
                    <Input type="number" step="1" {...register('moisture')} defaultValue={60} className="h-10 bg-[var(--surface)] text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1.5">Freshness (%)</label>
                    <Input type="number" step="1" {...register('freshness')} defaultValue={50} className="h-10 bg-[var(--surface)] text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1.5">Contamination (%)</label>
                    <Input type="number" step="1" {...register('contamination_level')} defaultValue={10} className="h-10 bg-[var(--surface)] text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1.5">Organic (%)</label>
                    <Input type="number" step="1" {...register('organic_percentage')} defaultValue={90} className="h-10 bg-[var(--surface)] text-sm" />
                  </div>
                </div>
                <Button type="submit" disabled={loading} size="lg" className="w-full h-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl shadow-xl hover:scale-[1.02] text-sm" icon={loading ? Activity : Sparkles}>
                  {loading ? 'Evaluating Pathway...' : 'Generate AI Strategy'}
                </Button>
              </form>
            </div>

            {/* Cinematic Result Area */}
            <div className="p-6 md:p-8 flex items-center justify-center relative min-h-[350px]">
              <AIPathway active={loading} result={liveRec} />
              
              <AnimatePresence mode="wait">
                {!liveRec && !loading && !errorMsg && (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10 text-center opacity-50">
                    <Zap className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4 opacity-50" />
                    <p className="font-bold text-[var(--text-muted)] uppercase tracking-widest text-sm">System Ready</p>
                    <p className="text-xs font-medium text-[var(--text-muted)] mt-1">Awaiting profile input to compute pathway.</p>
                  </motion.div>
                )}

                {errorMsg && !loading && (
                  <motion.div key="error" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="relative z-10 bg-red-500/10 border border-red-500/30 p-6 rounded-3xl text-center shadow-lg">
                    <Activity className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-red-500 mb-2">Analysis Failed</h3>
                    <p className="text-sm font-medium text-red-400">{errorMsg}</p>
                    <Button variant="outline" size="sm" className="mt-6 border-red-500/50 text-red-500 hover:bg-red-500/10" onClick={() => setErrorMsg(null)}>Try Again</Button>
                  </motion.div>
                )}

                {loading && (
                  <motion.div key="loading" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative z-10 bg-[var(--surface)]/90 backdrop-blur-md px-8 py-6 rounded-3xl border border-brand-500/30 text-center shadow-2xl">
                    <div className="w-16 h-16 rounded-full border-2 border-brand-500 border-t-transparent animate-spin mx-auto mb-4" />
                    <p className="font-black tracking-widest text-brand-400 uppercase text-sm mb-1">Analyzing NPK Content...</p>
                    <p className="text-xs text-[var(--text-muted)] font-medium">Computing carbon reduction potential</p>
                  </motion.div>
                )}

                {liveRec && !loading && (
                  <motion.div key="result" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="relative z-10 w-full">
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-2xl relative overflow-hidden text-left">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-400 to-accent-500 opacity-20 blur-2xl -mr-10 -mt-10" />
                      
                      <div className="flex items-center gap-2 mb-6">
                        <CheckCircle2 className="w-5 h-5 text-brand-500" />
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Optimal Pathway Selected</span>
                      </div>
                      
                      <h3 className="text-4xl font-black text-[var(--text-primary)] tracking-tighter mb-2">
                        {liveRec.recommended_method || 'Unknown Method'}
                      </h3>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
                        <div className="p-4 bg-[var(--surface-hover)] rounded-2xl border border-[var(--border)]">
                          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Nitrogen (N)</p>
                          <p className="text-xl font-black text-brand-500">{(liveRec.npk_estimation?.nitrogen || 0).toFixed(1)} g</p>
                        </div>
                        <div className="p-4 bg-[var(--surface-hover)] rounded-2xl border border-[var(--border)]">
                          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Phosphorus (P)</p>
                          <p className="text-xl font-black text-brand-500">{(liveRec.npk_estimation?.phosphorus || 0).toFixed(1)} g</p>
                        </div>
                        <div className="p-4 bg-[var(--surface-hover)] rounded-2xl border border-[var(--border)]">
                          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Potassium (K)</p>
                          <p className="text-xl font-black text-brand-500">{(liveRec.npk_estimation?.potassium || 0).toFixed(1)} g</p>
                        </div>
                        <div className="p-4 bg-[var(--surface-hover)] rounded-2xl border border-[var(--border)]">
                          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Confidence</p>
                          <p className="text-xl font-black text-accent-500">{((liveRec.confidence_score || 0) * 100).toFixed(0)}%</p>
                        </div>
                      </div>

                      {liveRec.xai && (
                        <div className="mt-4 p-4 bg-[var(--surface-hover)] rounded-2xl border border-[var(--border)]">
                          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">AI Explanation (SHAP)</p>
                          <p className="text-sm text-[var(--text-primary)] font-medium leading-relaxed">{liveRec.xai.human_readable_explanation}</p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {(liveRec.xai.top_contributing_features || []).map((feature, idx) => (
                              <span key={idx} className="text-[10px] font-bold px-2 py-1 rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-400">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Static Methods Dictionary */}
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid md:grid-cols-3 gap-6 pt-4">
        {strategies.map((strat, idx) => {
          const Icon = strat.icon;
          return (
            <motion.div key={idx} variants={staggerItem}>
              <Card className="h-full p-6 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${strat.color} opacity-0 group-hover:opacity-10 transition-opacity blur-2xl rounded-full -mr-10 -mt-10`} />
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${strat.iconBg} ${strat.iconColor} flex items-center justify-center border border-white/10 shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-[var(--text-primary)] tracking-tight">{strat.title}</h3>
                </div>
                <p className="text-sm font-medium text-[var(--text-muted)] mb-6 leading-relaxed">{strat.description}</p>
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[var(--text-secondary)]">N: {strat.npk.N}</span>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[var(--text-secondary)]">P: {strat.npk.P}</span>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[var(--text-secondary)]">K: {strat.npk.K}</span>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

    </motion.div>
  );
}
