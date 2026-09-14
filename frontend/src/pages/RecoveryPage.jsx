import React, { useState } from 'react';
import { Leaf, Box, Wind, ArrowRight, Activity, ShieldAlert, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../utils/api';
import toast from 'react-hot-toast';
import PageHeader from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, staggerItem, fadeUp, scaleIn } from '../utils/animations';

const strategies = [
  {
    title: 'Composting',
    icon: Leaf,
    description: 'Convert organic waste into nutrient-rich fertilizer for local agriculture.',
    npk: { N: 'High', P: 'Medium', K: 'High' },
    output: 'Rich Soil Conditioner',
    color: 'from-emerald-500 to-green-600',
    iconBg: 'bg-emerald-50 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    accent: '#10b981',
    suitability: 'Ideal for vegetable scraps, fruit peels, and coffee grounds.'
  },
  {
    title: 'Biogas Generation',
    icon: Wind,
    description: 'Anaerobic digestion produces renewable methane energy and liquid digestate.',
    npk: { N: 'Medium', P: 'Low', K: 'Medium' },
    output: 'Methane Gas & Digestate',
    color: 'from-blue-500 to-cyan-600',
    iconBg: 'bg-blue-50 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    accent: '#06b6d4',
    suitability: 'Best for cooked food waste, dairy, and mixed organics.'
  },
  {
    title: 'Donation Hub',
    icon: Box,
    description: 'Redirect surplus edible food to local charities, NGOs, and food banks.',
    npk: { N: 'N/A', P: 'N/A', K: 'N/A' },
    output: 'Meals for Communities',
    color: 'from-amber-500 to-orange-600',
    iconBg: 'bg-amber-50 dark:bg-amber-900/30',
    iconColor: 'text-amber-600 dark:text-amber-400',
    accent: '#f59e0b',
    suitability: 'Requires untouched, safely stored surplus food within expiry.'
  },
];

export default function RecoveryPage() {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [liveRec, setLiveRec] = useState(null);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post('/recovery', data);
      setLiveRec(res.data);
      toast.success('Recommendation generated!');
    } catch (e) {
      toast.error('Failed to get recommendation');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <PageHeader
        title="Recovery Strategies"
        description="AI-powered recovery recommendations to maximize sustainability impact from food waste."
      />

      {/* AI Recommendation Form */}
      <motion.div {...fadeUp}>
        <Card className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5 dark:from-brand-500/8 dark:to-transparent pointer-events-none" />

          <div className="relative z-10 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-brand-500" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Live AI Recommendation</h3>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Food Category
                    </label>
                    <Select {...register('food_category')}>
                      <option value="Vegetables">Vegetables</option>
                      <option value="Meat">Meat</option>
                      <option value="Grains">Grains</option>
                      <option value="Dairy">Dairy</option>
                      <option value="Mixed">Mixed Food Waste</option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Quantity (kg)
                    </label>
                    <Input type="number" step="0.1" {...register('quantity_kg')} defaultValue={10} />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  isLoading={loading}
                  size="lg"
                  className="w-full"
                  icon={Sparkles}
                >
                  {loading ? 'Analyzing...' : 'Get AI Recommendation'}
                </Button>
              </form>

              {/* Result panel */}
              <AnimatePresence mode="wait">
                {!liveRec ? (
                  <motion.div
                    key="empty"
                    variants={scaleIn}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="bg-slate-50/80 dark:bg-slate-800/30 border border-[var(--border)] rounded-2xl p-6 flex items-center justify-center min-h-[160px]"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 shadow-sm">
                        <Activity className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                      </div>
                      <p className="text-sm font-semibold text-slate-500">Awaiting request</p>
                      <p className="text-xs text-slate-400 mt-1">Fill out the form to get an AI recovery strategy.</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    variants={fadeUp}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="bg-white dark:bg-slate-900/60 border border-[var(--border)] rounded-2xl p-6"
                  >
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-500 mb-2">Recommended Method</p>
                    <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
                      {liveRec.recommended_method}
                    </h4>

                    {liveRec.xai && (
                      <div className="bg-accent-50 dark:bg-slate-800/50 border border-accent-200/50 dark:border-slate-700 rounded-xl p-4 mb-4">
                        <div className="flex items-start gap-2">
                          <ShieldAlert className="w-4 h-4 text-accent-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white mb-1">XAI Reasoning (SHAP)</p>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                              {liveRec.xai.human_readable_explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {liveRec.npk_estimation && (
                      <div className="flex gap-3">
                        <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 rounded-lg text-sm font-bold border border-emerald-200 dark:border-emerald-900/50">
                          N: {liveRec.npk_estimation.nitrogen}
                        </span>
                        <span className="px-3 py-1.5 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400 rounded-lg text-sm font-bold border border-blue-200 dark:border-blue-900/50">
                          P: {liveRec.npk_estimation.phosphorus}
                        </span>
                        <span className="px-3 py-1.5 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400 rounded-lg text-sm font-bold border border-amber-200 dark:border-amber-900/50">
                          K: {liveRec.npk_estimation.potassium}
                        </span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Strategy cards */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid md:grid-cols-3 gap-6"
      >
        {strategies.map((s, idx) => {
          const IconEl = s.icon;
          return (
            <motion.div
              key={idx}
              variants={staggerItem}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Card className="flex flex-col overflow-hidden group h-full hover:shadow-xl transition-all duration-300">
                {/* Top accent bar */}
                <div
                  className="h-1 w-full"
                  style={{ background: `linear-gradient(90deg, ${s.accent}, transparent)` }}
                />
                <div className="p-6 flex-1 flex flex-col">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl ${s.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <IconEl className={`w-7 h-7 ${s.iconColor}`} />
                  </div>

                  <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{s.title}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6 flex-1">
                    {s.description}
                  </p>

                  {/* Output & suitability */}
                  <div className="space-y-3 mb-5">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Expected Output</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{s.output}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Best For</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{s.suitability}</p>
                    </div>
                  </div>

                  {/* NPK values */}
                  {s.title !== 'Donation Hub' && (
                    <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4 mb-4 border border-[var(--border)]">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3 text-center">NPK Value Estimation</p>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        {[
                          { label: 'N', value: s.npk.N, color: 'text-emerald-600 dark:text-emerald-400' },
                          { label: 'P', value: s.npk.P, color: 'text-blue-600 dark:text-blue-400' },
                          { label: 'K', value: s.npk.K, color: 'text-amber-600 dark:text-amber-400' },
                        ].map((npk) => (
                          <div key={npk.label}>
                            <p className="text-xs font-black text-slate-900 dark:text-white mb-0.5">{npk.label}</p>
                            <p className={`text-xs font-bold uppercase ${npk.color}`}>{npk.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Learn more button */}
                  <button
                    className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-white group/btn"
                    style={{ '--hover-bg': s.accent }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = s.accent; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; }}
                  >
                    Learn More <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
