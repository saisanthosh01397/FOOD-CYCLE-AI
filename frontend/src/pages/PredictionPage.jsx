import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Calendar, Users, Cloud, Star, Brain, Activity, Clock, ShieldAlert, CheckCircle2, TrendingUp, ChevronRight
} from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import AnimatedNumber from '../components/ui/AnimatedNumber';
import { motion, AnimatePresence } from 'framer-motion';
import { pageForwardSlide, staggerContainer, staggerItem } from '../utils/animations';

function AIProcessingStage({ stage }) {
  const stages = [
    'Integrating historical demand data...',
    'Evaluating Genpact menu preferences...',
    'Mapping HPI waste probability distributions...',
    'Running Dish-Level Model Ensembles...',
    'Generating prevention strategy...'
  ];

  return (
    <motion.div 
      className="absolute inset-0 z-30 bg-[var(--surface)]/90 backdrop-blur-md flex flex-col items-center justify-center rounded-3xl overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="relative w-48 h-48 flex items-center justify-center mb-8">
        <motion.div className="absolute inset-0 rounded-full border border-brand-500/30" animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
        <motion.div className="absolute inset-4 rounded-full border border-accent-500/30 border-dashed" animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />
        <motion.div className="absolute inset-8 rounded-full border border-violet-500/30 border-dashed" animate={{ rotate: -360 }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} />
        <div className="relative z-10 w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] border border-brand-500/50">
          <Brain className="w-8 h-8 text-brand-400" />
        </div>
      </div>
      <div className="text-center h-16">
        <AnimatePresence mode="wait">
          <motion.p 
            key={stage}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="text-brand-400 font-bold uppercase tracking-widest text-sm"
          >
            {stages[stage] || 'Processing...'}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function PredictionPage() {
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      meal_type: 'breakfast'
    }
  });
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState(null);
  
  const MENU_DATA = {
    breakfast: ['Idli', 'Vada', 'Sambar', 'Coconut Chutney', 'Upma', 'Dosa'],
    lunch: ['Rice', 'Sambar', 'Vegetable Curry', 'Rasam', 'Curd', 'Chapati', 'Dal'],
    dinner: ['Chapati', 'Dal', 'Vegetable Curry', 'Paneer Butter Masala', 'Rice']
  };

  const mealType = watch('meal_type');
  const [selectedMenu, setSelectedMenu] = useState(MENU_DATA.breakfast);

  useEffect(() => {
    if (mealType && MENU_DATA[mealType.toLowerCase()]) {
      setSelectedMenu(MENU_DATA[mealType.toLowerCase()]);
    }
  }, [mealType]);

  const handleMenuToggle = (item) => {
    setSelectedMenu(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const onSubmit = async (data) => {
    if (selectedMenu.length === 0) {
      toast.error('Please select at least one menu item.');
      return;
    }
    setLoading(true);
    setResult(null);
    setStage(0);
    
    const stageInterval = setInterval(() => {
      setStage(prev => {
        if (prev >= 4) { clearInterval(stageInterval); return prev; }
        return prev + 1;
      });
    }, 600);

    try {
      const payload = {
        ...data,
        menu_items: selectedMenu
      };
      const response = await api.post('/prediction', payload);
      clearInterval(stageInterval);
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        setResult(response.data);
        toast.success('AI Preparation Plan generated.');
      }
      setLoading(false);
    } catch (error) {
      clearInterval(stageInterval);
      setLoading(false);
      toast.error('Failed to generate prediction');
    }
  };

  const [showActuals, setShowActuals] = useState(false);
  const [actuals, setActuals] = useState({});

  const handleActualsChange = (dish_name, field, value) => {
    setActuals(prev => ({
      ...prev,
      [dish_name]: {
        ...prev[dish_name],
        [field]: value
      }
    }));
  };

  const [actualsRecorded, setActualsRecorded] = useState(false);

  const submitActuals = async () => {
    if (!result?.log_id) return toast.error('No prediction log found to update.');
    
    // Format actuals
    const measurements = result.items.map(item => ({
      dish_name: item.dish_name,
      prepared: parseFloat(actuals[item.dish_name]?.prepared || 0),
      remaining: parseFloat(actuals[item.dish_name]?.remaining || 0),
      waste: parseFloat(actuals[item.dish_name]?.waste || 0),
      unit: item.unit
    }));

    // Validate impossible values
    for (const m of measurements) {
        if (m.remaining + m.waste > m.prepared) {
            return toast.error(`Impossible values for ${m.dish_name}: Remaining + Waste cannot exceed Prepared.`);
        }
    }

    try {
      setLoading(true);
      await api.post('/prediction/actuals', { log_id: result.log_id, measurements });
      toast.success('Actuals successfully recorded in ledger.');
      setActualsRecorded(true);
    } catch (e) {
      toast.error('Failed to save actuals.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div variants={pageForwardSlide} initial="initial" animate="animate" exit="exit" className="max-w-[1600px] mx-auto min-h-[calc(100vh-100px)] flex flex-col space-y-6">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-3">
            <Brain className="w-8 h-8 text-accent-500" /> AI Preparation Planner
          </h1>
          <p className="text-[var(--text-muted)] font-medium mt-1">AI-driven menu and batch prediction to optimize institutional preparation.</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ===================================== */}
        {/* LEFT: CONTROLS */}
        {/* ===================================== */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card className="p-6 rounded-3xl border-[var(--border)] relative overflow-hidden group shadow-2xl flex flex-col gap-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10 flex flex-col h-full">
              
              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[var(--border)]">
                  <ChevronRight className="w-5 h-5 text-accent-500" />
                  <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">Step 1: Forecast Parameters</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1.5">Target Date</label>
                    <Input type="date" icon={Calendar} required {...register("date")} className="h-10 bg-[var(--surface-hover)] text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1.5">Meal Phase</label>
                    <Select icon={Clock} required {...register("meal_type")} className="h-10 bg-[var(--surface-hover)] text-sm">
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1.5">Expected Population</label>
                    <Input type="number" placeholder="150" icon={Users} required min="1" {...register("people")} className="h-10 bg-[var(--surface-hover)] text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1.5">Environment</label>
                      <Select icon={Cloud} {...register("weather")} className="h-10 bg-[var(--surface-hover)] text-sm">
                        <option value="sunny">Sunny</option>
                        <option value="rainy">Rainy</option>
                        <option value="cloudy">Cloudy</option>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1.5">Occasion</label>
                      <Select icon={Star} {...register("special_event")} className="h-10 bg-[var(--surface-hover)] text-sm">
                        <option value="none">Standard</option>
                        <option value="holiday">Holiday</option>
                        <option value="festival">Festival</option>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[var(--border)]">
                  <ChevronRight className="w-5 h-5 text-accent-500" />
                  <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">Step 2: Menu Planner</h3>
                </div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3">Select actual dishes to be served:</label>
                <div className="grid grid-cols-2 gap-3">
                  {mealType && MENU_DATA[mealType.toLowerCase()]?.map(item => (
                    <label key={item} className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] cursor-pointer hover:border-brand-500/50 transition-colors">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded text-brand-500 focus:ring-brand-500 focus:ring-offset-0 bg-[var(--surface)] border-[var(--border)]"
                        checked={selectedMenu.includes(item)}
                        onChange={() => handleMenuToggle(item)}
                      />
                      <span className="text-sm font-bold text-[var(--text-secondary)]">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full h-12 mt-4 bg-accent-600 hover:bg-accent-700 text-white rounded-xl shadow-xl shadow-accent-500/20 text-sm" disabled={loading}>
                {loading ? 'Initializing Ensembles...' : 'Generate AI Preparation Plan'}
              </Button>
            </form>
          </Card>
        </div>

        {/* ===================================== */}
        {/* RIGHT: VISUALIZATION & RESULTS */}
        {/* ===================================== */}
        <div className="lg:col-span-8 flex flex-col gap-6 relative">
          
          <AnimatePresence>
            {loading && <AIProcessingStage stage={stage} />}
          </AnimatePresence>

          {!result && !loading && (
             <Card className="flex-1 p-6 rounded-3xl border-[var(--border)] min-h-[400px] flex flex-col items-center justify-center opacity-50 border-dashed">
                <Brain className="w-16 h-16 text-[var(--text-muted)] mb-4" />
                <h3 className="font-bold text-[var(--text-primary)] mb-2">Awaiting Parameters & Menu</h3>
                <p className="text-sm font-medium text-[var(--text-muted)] max-w-sm text-center">Select your meal phase and menu to receive a customized AI preparation plan.</p>
             </Card>
          )}

          {result && !loading && !showActuals && (
             <motion.div variants={staggerContainer} initial="initial" animate="animate" className="flex flex-col gap-6">
                
                {/* Dish Table */}
                <motion.div variants={staggerItem}>
                  <Card className="rounded-3xl border-[var(--border)] overflow-hidden">
                    <div className="p-5 border-b border-[var(--border)] bg-brand-500/10 flex justify-between items-center">
                      <h3 className="text-lg font-black text-brand-500 uppercase tracking-wider flex items-center gap-2"><TrendingUp className="w-5 h-5"/> AI Preparation Recommendations</h3>
                      <Button onClick={() => setShowActuals(true)} className="bg-[var(--surface)] text-brand-500 border border-brand-500/30 hover:bg-brand-500/10 text-xs h-8">Record Post-Meal Actuals</Button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-[var(--surface)] text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                          <tr>
                            <th className="px-6 py-4 font-bold">Dish</th>
                            <th className="px-6 py-4 font-bold text-center">Recommended Preparation</th>
                            <th className="px-6 py-4 font-bold text-center">Unit</th>
                            <th className="px-6 py-4 font-bold text-center">Risk / Confidence</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                          {result.items.map((item, idx) => (
                            <tr key={idx} className="hover:bg-[var(--surface-hover)] transition-colors">
                              <td className="px-6 py-4 font-bold text-[var(--text-primary)] text-lg">{item.dish_name}</td>
                              <td className="px-6 py-4 font-black text-brand-600 dark:text-brand-400 text-center text-xl"><AnimatedNumber value={item.recommended_preparation} /></td>
                              <td className="px-6 py-4 font-medium text-[var(--text-secondary)] text-center text-sm">{item.unit}</td>
                              <td className="px-6 py-4 text-center flex justify-center">
                                <span className={`inline-flex items-center px-3 py-1 text-[11px] font-bold uppercase tracking-widest rounded-md border ${
                                  item.risk_level === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/30' :
                                  item.risk_level === 'Medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' :
                                  'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                                }`}>
                                  {item.risk_level} Risk
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </motion.div>

                {/* Prevention Plan */}
                <motion.div variants={staggerItem}>
                  <Card className="p-6 rounded-3xl border-violet-500/30 bg-violet-500/5 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
                    <div className="flex items-center gap-2 mb-4 relative z-10">
                      <ShieldAlert className="w-5 h-5 text-violet-500" />
                      <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">Operational Recommendations</h3>
                    </div>
                    <ul className="space-y-3 relative z-10">
                      {result.preventive_actions.map((action, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
                          <span className="font-medium text-sm text-[var(--text-secondary)]">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </motion.div>
             </motion.div>
          )}

          {showActuals && result && !actualsRecorded && (
            <motion.div variants={pageForwardSlide} initial="initial" animate="animate" className="flex flex-col gap-6">
              <Card className="rounded-3xl border-[var(--border)] overflow-hidden shadow-2xl">
                <div className="p-5 border-b border-[var(--border)] bg-amber-500/10 flex justify-between items-center">
                  <h3 className="text-lg font-black text-amber-500 uppercase tracking-wider flex items-center gap-2"><Activity className="w-5 h-5"/> Step 3: Record Actuals</h3>
                  <Button onClick={() => setShowActuals(false)} className="bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)] hover:bg-[var(--surface-hover)] text-xs h-8">Back to Prediction</Button>
                </div>
                <div className="p-6 space-y-6">
                  <p className="text-sm text-[var(--text-muted)] font-medium">After the meal service, record the real-world measurements here. This feedback loop improves future predictions.</p>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {result.items.map((item, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)] items-center">
                        <div className="font-bold text-[var(--text-primary)]">{item.dish_name} <span className="text-xs font-normal text-[var(--text-muted)] ml-2">({item.unit})</span></div>
                        <div>
                          <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">Prepared</label>
                          <Input type="number" step="0.1" placeholder={item.recommended_preparation} onChange={(e) => handleActualsChange(item.dish_name, 'prepared', e.target.value)} className="h-8 text-sm" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">Remaining (Safe Surplus)</label>
                          <Input type="number" step="0.1" placeholder="0" onChange={(e) => handleActualsChange(item.dish_name, 'remaining', e.target.value)} className="h-8 text-sm" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">Waste (Spoiled/Plate)</label>
                          <Input type="number" step="0.1" placeholder="0" onChange={(e) => handleActualsChange(item.dish_name, 'waste', e.target.value)} className="h-8 text-sm" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={submitActuals} disabled={loading} className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-xl shadow-amber-500/20 px-8">
                      {loading ? 'Saving...' : 'Save Actuals to Ledger'}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {actualsRecorded && (
            <motion.div variants={pageForwardSlide} initial="initial" animate="animate" className="flex flex-col gap-6">
              <Card className="rounded-3xl border-emerald-500/30 overflow-hidden bg-emerald-500/5 shadow-xl">
                <div className="p-8 text-center space-y-6 flex flex-col items-center">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mb-2">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-black text-[var(--text-primary)]">Ledger Updated Successfully</h2>
                  <p className="text-sm font-medium text-[var(--text-muted)] max-w-md">
                    The actuals have been recorded. Based on your inputs, do you need to route surplus food for rescue or waste for recovery?
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    <Button onClick={() => window.location.href = `/rescue`} className="bg-emerald-500 text-white hover:bg-emerald-600 px-6 h-12 rounded-xl shadow-lg">
                      Manage Safe Surplus
                    </Button>
                    <Button onClick={() => window.location.href = `/recovery`} className="bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--surface-hover)] px-6 h-12 rounded-xl">
                      Analyze Waste for Recovery
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

        </div>
      </div>
    </motion.div>
  );
}
