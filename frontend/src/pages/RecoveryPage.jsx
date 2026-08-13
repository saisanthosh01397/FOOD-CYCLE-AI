import { useState } from 'react';
import { Leaf, Box, Wind, ArrowRight, Activity, Loader2, ShieldAlert } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function RecoveryPage() {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [liveRec, setLiveRec] = useState(null);
  const strategies = [
    {
      title: 'Composting',
      icon: Leaf,
      description: 'Convert organic waste into nutrient-rich fertilizer for local agriculture.',
      npk: { N: 'High', P: 'Medium', K: 'High' },
      output: 'Rich Soil Conditioner',
      color: 'emerald',
      suitability: 'Ideal for vegetable scraps, fruit peels, and coffee grounds.'
    },
    {
      title: 'Biogas Generation',
      icon: Wind,
      description: 'Anaerobic digestion to produce renewable energy and digestate.',
      npk: { N: 'Medium', P: 'Low', K: 'Medium' },
      output: 'Methane Gas & Digestate',
      color: 'blue',
      suitability: 'Best for cooked food waste, dairy, and mixed organics.'
    },
    {
      title: 'Donation Hub',
      icon: Box,
      description: 'Redirect surplus edible food to local charities and food banks.',
      npk: { N: 'N/A', P: 'N/A', K: 'N/A' },
      output: 'Meals for Communities',
      color: 'amber',
      suitability: 'Requires untouched, safely stored surplus food within expiry.'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Recovery Guidelines</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Explore our AI-recommended strategies for maximum sustainability impact.</p>
      </div>

      {/* Dynamic Recommendation Form */}
      <div className="glass-card p-6 md:p-8 mb-8 bg-gradient-to-br from-emerald-500/5 to-transparent">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1 w-full">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Activity className="w-6 h-6 text-emerald-500" /> Live AI Recommendation
            </h3>
            <form onSubmit={handleSubmit(async (data) => {
              setLoading(true);
              try {
                const res = await api.post('/recovery', data);
                setLiveRec(res.data);
                toast.success('Recommendation generated!');
              } catch (e) {
                toast.error('Failed to get recommendation');
              }
              setLoading(false);
            })} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Food Category</label>
                  <select {...register('food_category')} className="w-full px-4 py-2.5 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none">
                    <option value="Vegetables">Vegetables</option>
                    <option value="Meat">Meat</option>
                    <option value="Grains">Grains</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Mixed">Mixed Food Waste</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Quantity (kg)</label>
                  <input type="number" step="0.1" {...register('quantity_kg')} defaultValue={10} className="w-full px-4 py-2.5 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
              </div>
              <button disabled={loading} type="submit" className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Get AI Recommendation'}
              </button>
            </form>
          </div>

          <div className="flex-1 w-full bg-white dark:bg-slate-900 rounded-2xl p-6 border dark:border-slate-700 min-h-[200px] flex flex-col justify-center">
            {!liveRec ? (
              <div className="text-center text-slate-400">
                <Box className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Fill out the form to get a dynamic AI recovery strategy.</p>
              </div>
            ) : (
              <div className="animate-in fade-in duration-300">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-500 mb-1">Recommended Method</div>
                <h4 className="text-2xl font-bold mb-3">{liveRec.recommended_method}</h4>
                {liveRec.xai && (
                  <div className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                    <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white block mb-1">AI Reasoning (SHAP)</span>
                      {liveRec.xai.human_readable_explanation}
                    </div>
                  </div>
                )}
                {liveRec.npk_estimation && (
                  <div className="mt-4 flex gap-4 text-sm font-semibold">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 rounded-full">N: {liveRec.npk_estimation.nitrogen}</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full">P: {liveRec.npk_estimation.phosphorus}</span>
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 rounded-full">K: {liveRec.npk_estimation.potassium}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {strategies.map((s, idx) => (
          <div key={idx} className="glass-card flex flex-col overflow-hidden group">
            <div className={`h-2 w-full bg-${s.color}-500`} />
            <div className="p-6 flex-1 flex flex-col">
              <div className={`w-14 h-14 rounded-2xl bg-${s.color}-100 dark:bg-${s.color}-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <s.icon className={`w-7 h-7 text-${s.color}-500`} />
              </div>
              <h2 className="text-2xl font-bold mb-3">{s.title}</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6 flex-1">{s.description}</p>
              
              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Expected Output</div>
                  <div className="font-semibold text-slate-900 dark:text-white">{s.output}</div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Best For</div>
                  <div className="text-sm">{s.suitability}</div>
                </div>
              </div>

              {s.title !== 'Donation Hub' && (
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mt-auto">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 text-center">NPK Value Estimation</div>
                  <div className="flex justify-between text-center">
                    <div>
                      <div className="text-xl font-bold text-slate-900 dark:text-white">N</div>
                      <div className="text-xs text-emerald-500 font-semibold">{s.npk.N}</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-slate-900 dark:text-white">P</div>
                      <div className="text-xs text-blue-500 font-semibold">{s.npk.P}</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-slate-900 dark:text-white">K</div>
                      <div className="text-xs text-amber-500 font-semibold">{s.npk.K}</div>
                    </div>
                  </div>
                </div>
              )}

              <button className={`w-full mt-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors bg-slate-100 dark:bg-slate-800 hover:bg-${s.color}-500 hover:text-white`}>
                Learn More <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
