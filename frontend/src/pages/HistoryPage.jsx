import React, { useState, useEffect } from 'react';
import {
  Search, Filter, Download, ChevronLeft, ChevronRight,
  Database, Clock, Leaf, Brain, Activity
} from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import PageHeader from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, staggerItem } from '../utils/animations';

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
    } catch (error) {
      toast.error('Failed to fetch history');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, [page, category, mealType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchHistory();
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Data History"
        description="Review your past food waste logs, predictions, and recovery methods."
      >
        <Button variant="outline" icon={Download} size="sm">Export CSV</Button>
      </PageHeader>

      <Card className="overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-[var(--border)] bg-slate-50/50 dark:bg-slate-900/20 flex flex-col md:flex-row gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1 md:max-w-sm">
            <Input
              icon={Search}
              type="text"
              placeholder="Search by category or meal..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="hidden" />
          </form>
          <div className="flex gap-3">
            <Select
              icon={Filter}
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            >
              <option value="">All Categories</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Grains">Grains</option>
              <option value="Meat">Meat</option>
              <option value="Dairy">Dairy</option>
              <option value="Mixed">Mixed</option>
            </Select>
            <Select
              icon={Filter}
              value={mealType}
              onChange={(e) => { setMealType(e.target.value); setPage(1); }}
            >
              <option value="">All Meals</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="all_day">All Day</option>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-slate-50/80 dark:bg-slate-900/30">
                {['Date', 'Meal', 'Category', 'Quantity (kg)', 'Predicted (kg)', 'Recovery', 'Status'].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 skeleton rounded" style={{ width: `${60 + j * 5}%`, opacity: 1 - j * 0.1 }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Database className="w-7 h-7 text-slate-300 dark:text-slate-600" />
                      </div>
                      <p className="font-bold text-slate-900 dark:text-white">No records found</p>
                      <p className="text-sm text-slate-500">No historical data matches your current filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {history.map((row, i) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.25 }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">{row.date}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm font-semibold capitalize text-slate-800 dark:text-slate-200">
                        {row.meal_type}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <Leaf className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{row.food_category}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm font-black text-slate-900 dark:text-white">{row.quantity_kg}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        {row.prediction ? (
                          <div className="flex items-center gap-1.5">
                            <Brain className="w-3.5 h-3.5 text-accent-500 shrink-0" />
                            <span className="text-sm font-bold text-accent-600 dark:text-accent-400">{row.prediction}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        {row.recovery ? (
                          <Badge variant="primary" className="text-xs whitespace-nowrap">{row.recovery}</Badge>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge variant="success" className="text-xs">{row.status}</Badge>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-[var(--border)] bg-slate-50/50 dark:bg-slate-900/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing{' '}
            <span className="font-bold text-slate-900 dark:text-white">
              {(page - 1) * limit + (history.length > 0 ? 1 : 0)}
            </span>{' '}
            to{' '}
            <span className="font-bold text-slate-900 dark:text-white">
              {Math.min(page * limit, total)}
            </span>{' '}
            of{' '}
            <span className="font-bold text-slate-900 dark:text-white">{total}</span> entries
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
                      page === pageNum
                        ? 'bg-brand-500 text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="px-3"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
