import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Users, Cloud, Star, Loader2, ArrowRight, Brain, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function PredictionPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Fetch historical predictions to show in graph and list
    const fetchHistory = async () => {
      try {
        const response = await api.get('/history?limit=10');
        if (response.data && response.data.items) {
           const pastLogs = response.data.items;
           // Filter items that have predictions
           const withPredictions = pastLogs.filter(l => l.prediction !== null);
           setHistory(withPredictions);
           
           // Format chart data
           const cData = pastLogs.reverse().map(l => ({
             date: l.date,
             actual: l.quantity_kg,
             predicted: l.prediction || l.quantity_kg // Fallback if no prediction
           }));
           setChartData(cData);
        }
      } catch (error) {
        console.error("Failed to load history", error);
      }
    };
    fetchHistory();
  }, [result]); // Re-fetch when new result is generated

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
      <div>
        <h1 className="text-3xl font-bold">Food Waste Prediction</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Input your daily event parameters and let our Prophet model forecast expected waste.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form and Previous Predictions */}
        <div className="space-y-6">
          <div className="glass-card p-6 md:p-8">
            <h3 className="text-lg font-bold mb-4">Generate Forecast</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">Target Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input 
                    type="date" 
                    {...register("date", { required: true })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Meal Type</label>
                <select 
                  {...register("meal_type", { required: true })}
                  className="w-full px-4 py-2.5 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="all_day">All Day Event</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">People Served (Estimated)</label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input 
                    type="number" 
                    placeholder="e.g. 150"
                    {...register("people", { required: true, min: 1 })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Weather</label>
                  <div className="relative">
                    <Cloud className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <select 
                      {...register("weather")}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      <option value="sunny">Sunny</option>
                      <option value="rainy">Rainy</option>
                      <option value="cloudy">Cloudy</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Event</label>
                  <div className="relative">
                    <Star className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <select 
                      {...register("event")}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      <option value="none">Normal Day</option>
                      <option value="festival">Festival</option>
                      <option value="corporate">Corporate</option>
                    </select>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-6 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Brain className="w-5 h-5" /> Generate Forecast</>}
              </button>
            </form>
          </div>

          <div className="glass-card p-6">
             <h3 className="text-lg font-bold mb-4">Previous Predictions</h3>
             {history.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No recent predictions found.</p>
             ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {history.map((h, i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-lg border dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                       <div>
                          <div className="text-sm font-semibold">{h.date} - {h.meal_type}</div>
                          <div className="text-xs text-slate-500">Actual: {h.quantity_kg}kg</div>
                       </div>
                       <div className="text-right">
                          <div className="text-sm font-bold text-emerald-500">{h.prediction}kg</div>
                          <div className="text-xs text-slate-500">Predicted</div>
                       </div>
                    </div>
                  ))}
                </div>
             )}
          </div>
        </div>

        {/* Results and Charts */}
        <div className="space-y-6">
          <div className="glass-card p-6 md:p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
            {!result ? (
              <div className="text-slate-400 flex flex-col items-center">
                <Brain className="w-16 h-16 opacity-20 mb-4" />
                <p>Fill out the form to generate AI predictions.</p>
              </div>
            ) : (
              <div className="w-full animate-in fade-in zoom-in duration-300">
                <div className="inline-block p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl mb-6 border dark:border-emerald-500/20">
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold mb-1 flex items-center justify-center gap-2">
                    <TrendingUp className="w-4 h-4"/> Predicted Waste for {result.prediction_date}
                  </p>
                  <h2 className="text-5xl font-extrabold text-slate-900 dark:text-white">
                    {result.predicted_quantity} <span className="text-2xl text-slate-500">kg</span>
                  </h2>
                </div>
                
                <div className="space-y-4 text-left w-full max-w-sm mx-auto">
                  <div>
                    <div className="flex justify-between text-sm font-medium mb-1">
                      <span>Prophet Model Confidence</span>
                      <span className="text-emerald-500">{result.confidence_score * 100}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${result.confidence_score * 100}%` }}></div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 mt-4">
                    <h4 className="font-semibold text-sm mb-1">Recommendation</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Based on this volume, we recommend preparing your compost bins early and contacting local donation centers if surplus exceeds 10kg.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="glass-card p-6 h-[320px]">
             <h3 className="text-lg font-bold mb-4">Actual vs Predicted Forecast</h3>
             {chartData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400">Not enough historical data</div>
             ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }} />
                    <Area type="monotone" dataKey="predicted" stroke="#3b82f6" fill="url(#colorPredicted)" strokeWidth={2} />
                    <Area type="monotone" dataKey="actual" stroke="#10b981" fill="url(#colorActual)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
