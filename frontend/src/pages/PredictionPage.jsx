import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Users, Cloud, Star, Loader2, ArrowRight, Brain } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function PredictionPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

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
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Food Waste Prediction</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Input your daily event parameters and let our Prophet model forecast expected waste.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Form */}
        <div className="glass-card p-6 md:p-8">
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

        {/* Results */}
        <div className="glass-card p-6 md:p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
          {!result ? (
            <div className="text-slate-400 flex flex-col items-center">
              <Brain className="w-16 h-16 opacity-20 mb-4" />
              <p>Fill out the form to generate AI predictions.</p>
            </div>
          ) : (
            <div className="w-full animate-in fade-in zoom-in duration-300">
              <div className="inline-block p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl mb-6">
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
                  Predicted Waste for {result.prediction_date}
                </p>
                <h2 className="text-5xl font-extrabold text-slate-900 dark:text-white">
                  {result.predicted_quantity} <span className="text-2xl text-slate-500">kg</span>
                </h2>
              </div>
              
              <div className="space-y-4 text-left w-full max-w-sm mx-auto">
                <div>
                  <div className="flex justify-between text-sm font-medium mb-1">
                    <span>AI Confidence</span>
                    <span className="text-emerald-500">{result.confidence_score * 100}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${result.confidence_score * 100}%` }}></div>
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
      </div>
    </div>
  );
}
