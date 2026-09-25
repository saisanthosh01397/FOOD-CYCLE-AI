import React, { useState, useEffect } from 'react';
import {
  Search, Filter, Download, ChevronLeft, ChevronRight,
  Database, Clock, Leaf, Brain, Activity
} from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, staggerItem, pageDataReveal } from '../utils/animations';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

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
    } catch (error) { toast.error('Failed to fetch history'); }
    setLoading(false);
  };

  useEffect(() => { fetchHistory(); }, [page, category, mealType]);

  const handleSearchSubmit = (e) => { e.preventDefault(); setPage(1); fetchHistory(); };
  const totalPages = Math.ceil(total / limit);

  return (
    <motion.div variants={pageDataReveal} initial="initial" animate="animate" exit="exit" className="space-y-6 max-w-[1600px] mx-auto min-h-[calc(100vh-100px)] flex flex-col">
      
      <div className="flex items-center justify-between shrink-0 mb-4">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-3">
            <Database className="w-8 h-8 text-brand-500" /> Distributed Ledger
          </h1>
          <p className="text-[var(--text-muted)] font-medium mt-1">Immutable history of food waste logs, AI predictions, and recovery pathways.</p>
        </div>
        <Button variant="outline" icon={Download} size="lg" className="rounded-2xl border-[var(--border)] shadow-sm hidden sm:flex">Export CSV</Button>
      </div>

      <Card className="flex-1 overflow-hidden flex flex-col shadow-2xl rounded-3xl border-[var(--border)] bg-[var(--surface)]">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-[var(--border)] bg-slate-50/50 dark:bg-slate-900/30 flex flex-col md:flex-row gap-4 shrink-0">
          <form onSubmit={handleSearchSubmit} className="flex-1 md:max-w-md relative group">
            <div className="absolute inset-0 bg-brand-500/5 blur-xl group-focus-within:bg-brand-500/20 transition-all rounded-full pointer-events-none" />
            <Input icon={Search} type="text" placeholder="Search operational ledger..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-12 bg-[var(--surface)] rounded-xl relative z-10" />
            <button type="submit" className="hidden" />
          </form>
          <div className="flex gap-3">
            <Select icon={Filter} value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="h-12 bg-[var(--surface)] rounded-xl w-40">
              <option value="">All Categories</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Grains">Grains</option>
              <option value="Meat">Meat</option>
              <option value="Dairy">Dairy</option>
              <option value="Mixed">Mixed</option>
            </Select>
            <Select icon={Filter} value={mealType} onChange={(e) => { setMealType(e.target.value); setPage(1); }} className="h-12 bg-[var(--surface)] rounded-xl w-40">
              <option value="">All Meals</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="all_day">All Day</option>
            </Select>
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-x-auto relative">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-900/50 border-b border-[var(--border)] text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-black">
                <th className="py-4 px-6 whitespace-nowrap">Timestamp</th>
                <th className="py-4 px-6 whitespace-nowrap">Context</th>
                <th className="py-4 px-6 whitespace-nowrap">Category</th>
                <th className="py-4 px-6 whitespace-nowrap text-right">Logged (kg)</th>
                <th className="py-4 px-6 whitespace-nowrap text-right text-brand-600 dark:text-brand-400"><Brain className="w-3 h-3 inline mr-1" /> Predicted</th>
                <th className="py-4 px-6 whitespace-nowrap">Pathway</th>
                <th className="py-4 px-6 whitespace-nowrap">Network Status</th>
              </tr>
            </thead>
            <motion.tbody variants={staggerContainer} initial="initial" animate="animate">
              {loading ? (
                [...Array(limit)].map((_, i) => (
                  <tr key={i} className="border-b border-[var(--border)]">
                    <td className="py-4 px-6"><div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" /></td>
                    <td className="py-4 px-6"><div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" /></td>
                    <td className="py-4 px-6"><div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" /></td>
                    <td className="py-4 px-6"><div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded animate-pulse ml-auto" /></td>
                    <td className="py-4 px-6"><div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded animate-pulse ml-auto" /></td>
                    <td className="py-4 px-6"><div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" /></td>
                    <td className="py-4 px-6"><div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" /></td>
                  </tr>
                ))
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="flex flex-col items-center justify-center py-24 opacity-50">
                      <Database className="w-12 h-12 text-[var(--text-muted)] mb-4" />
                      <p className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest">No Records Found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                history.map((row, idx) => (
                  <motion.tr 
                    key={row.id} 
                    variants={staggerItem}
                    className="border-b border-[var(--border)] hover:bg-brand-500/5 dark:hover:bg-brand-500/10 transition-colors group cursor-default"
                  >
                    <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-[var(--text-secondary)] group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{row.date}</td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm capitalize text-[var(--text-secondary)] font-bold">{row.meal_type.replace('_', ' ')}</td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-colors">
                          <Leaf className="w-3 h-3 text-[var(--text-muted)] group-hover:text-white" />
                        </div>
                        <span className="text-sm font-medium text-[var(--text-primary)]">{row.food_category}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-right font-black text-[var(--text-primary)]">{row.quantity_kg ? row.quantity_kg.toFixed(1) : '—'}</td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-right font-bold text-brand-600 dark:text-brand-400">
                      {row.prediction && row.prediction.total_expected_waste_kg !== undefined ? row.prediction.total_expected_waste_kg.toFixed(1) : '—'}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <Badge variant={row.recovery ? 'success' : 'secondary'} className="text-[10px]">
                        {row.recovery || 'Unassigned'}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <Badge variant={row.status === 'Completed' ? 'success' : 'warning'} className="text-[10px]">
                        {row.status}
                      </Badge>
                    </td>
                  </motion.tr>
                ))
              )}
            </motion.tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-[var(--border)] flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/30">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
            Showing <span className="text-[var(--text-primary)]">{(page - 1) * limit + 1}</span> to <span className="text-[var(--text-primary)]">{Math.min(page * limit, total)}</span> of <span className="text-[var(--text-primary)]">{total}</span>
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={ChevronLeft} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="rounded-xl px-4">Prev</Button>
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="rounded-xl px-4">Next <ChevronRight className="w-4 h-4 ml-2" /></Button>
          </div>
        </div>

      </Card>
    </motion.div>
  );
}
