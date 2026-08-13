import { useState, useEffect } from 'react';
import { Search, Filter, Download, ChevronLeft, ChevronRight, FileJson, AlertCircle } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  
  // Pagination & Filters
  const [page, setPage] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [mealType, setMealType] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await api.get('/history', {
        params: { page, limit, search, category, meal_type: mealType }
      });
      setHistory(response.data.items);
      setTotal(response.data.total);
    } catch (error) {
      toast.error('Failed to fetch history');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, [page, category, mealType]); // Fetch on these changes

  // Fetch on search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchHistory();
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Data History</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Review your past logs, predictions, and recovery methods.</p>
        </div>
        <button className="px-4 py-2 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium rounded-xl flex items-center gap-2 hover:bg-emerald-100 transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="glass-card flex flex-col min-h-[600px]">
        {/* Toolbar */}
        <div className="p-4 border-b dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-900/20 rounded-t-2xl">
           <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
             <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
             <input 
               type="text" 
               placeholder="Search by category or meal..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
             />
           </form>
           
           <div className="flex gap-4 w-full md:w-auto">
             <div className="relative flex-1 md:w-40">
               <Filter className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
               <select 
                 value={category}
                 onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                 className="w-full pl-9 pr-4 py-2 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
               >
                 <option value="">All Categories</option>
                 <option value="Vegetables">Vegetables</option>
                 <option value="Fruits">Fruits</option>
                 <option value="Grains">Grains</option>
                 <option value="Meat">Meat</option>
                 <option value="Dairy">Dairy</option>
                 <option value="Mixed">Mixed</option>
               </select>
             </div>
             <div className="relative flex-1 md:w-40">
               <Filter className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
               <select 
                 value={mealType}
                 onChange={(e) => { setMealType(e.target.value); setPage(1); }}
                 className="w-full pl-9 pr-4 py-2 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
               >
                 <option value="">All Meals</option>
                 <option value="breakfast">Breakfast</option>
                 <option value="lunch">Lunch</option>
                 <option value="dinner">Dinner</option>
                 <option value="all_day">All Day</option>
               </select>
             </div>
           </div>
        </div>

        {/* Data Grid */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 text-sm">Date</th>
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 text-sm">Meal Type</th>
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 text-sm">Category</th>
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 text-sm">Quantity (kg)</th>
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 text-sm">Prediction (kg)</th>
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 text-sm">Recovery</th>
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 text-sm">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center">
                    <div className="flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-16 text-center text-slate-400">
                    <FileJson className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No records found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                history.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 text-sm whitespace-nowrap">{row.date}</td>
                    <td className="p-4 text-sm capitalize">{row.meal_type}</td>
                    <td className="p-4 text-sm font-medium">{row.food_category}</td>
                    <td className="p-4 text-sm font-bold text-slate-900 dark:text-white">{row.quantity_kg}</td>
                    <td className="p-4 text-sm">
                      {row.prediction ? <span className="text-emerald-500 font-semibold">{row.prediction}</span> : <span className="text-slate-400">-</span>}
                    </td>
                    <td className="p-4 text-sm">
                      {row.recovery ? (
                         <span className="px-2 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-md text-xs font-semibold">
                           {row.recovery}
                         </span>
                      ) : (
                         <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="p-4 text-sm">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-md text-xs font-semibold flex items-center gap-1 w-max">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/20 rounded-b-2xl">
           <div className="text-sm text-slate-500">
             Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{(page - 1) * limit + (history.length > 0 ? 1 : 0)}</span> to <span className="font-semibold text-slate-700 dark:text-slate-300">{Math.min(page * limit, total)}</span> of <span className="font-semibold text-slate-700 dark:text-slate-300">{total}</span> entries
           </div>
           
           <div className="flex gap-2">
             <button 
               onClick={() => setPage(p => Math.max(1, p - 1))}
               disabled={page === 1}
               className="p-2 border dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
             >
               <ChevronLeft className="w-5 h-5" />
             </button>
             <button 
               onClick={() => setPage(p => Math.min(totalPages, p + 1))}
               disabled={page === totalPages || totalPages === 0}
               className="p-2 border dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
             >
               <ChevronRight className="w-5 h-5" />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}
