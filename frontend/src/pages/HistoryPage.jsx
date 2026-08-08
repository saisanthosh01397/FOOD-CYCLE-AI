import { useState, useEffect } from 'react';
import { Search, Download, FileText, ArrowUpDown } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function HistoryPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      // Fetch food logs (the API returns food logs)
      const res = await api.get('/food-logs');
      setLogs(res.data);
    } catch (error) {
      toast.error('Failed to load history');
    }
    setLoading(false);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedLogs = [...logs].sort((a, b) => {
    const aVal = a[sortConfig.key] || '';
    const bVal = b[sortConfig.key] || '';
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredLogs = sortedLogs.filter(log => 
    (log.food_category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.meal_type || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ['Date', 'Category', 'Quantity (kg)', 'Meal Type'];
    const csvContent = [
      headers.join(','),
      ...filteredLogs.map(log => 
        [log.date, log.food_category, log.quantity_kg, log.meal_type].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'foodcycle_history.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV Exported');
    
    api.post('/users/log', { action_type: 'Report Export', description: 'Exported history to CSV' }).catch(console.error);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('FoodCycle AI - Recovery History', 14, 15);
    
    const tableColumn = ['Date', 'Category', 'Quantity (kg)', 'Meal Type'];
    const tableRows = filteredLogs.map(log => [
      log.date, 
      log.food_category, 
      log.quantity_kg, 
      log.meal_type
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 25,
    });
    
    doc.save('foodcycle_history.pdf');
    toast.success('PDF Exported');
    
    api.post('/users/log', { action_type: 'Report Export', description: 'Exported history to PDF' }).catch(console.error);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">History & Logs</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Review, filter, and export past food waste and prediction logs.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={exportCSV} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium rounded-lg flex items-center gap-2 transition-colors border dark:border-slate-700">
            <Download className="w-4 h-4" /> CSV
          </button>
          <button onClick={exportPDF} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg flex items-center gap-2 transition-colors">
            <FileText className="w-4 h-4" /> PDF
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input 
              type="text"
              placeholder="Search category or meal type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm border-b dark:border-slate-800">
                <th className="p-4 font-medium cursor-pointer hover:text-emerald-500 transition-colors" onClick={() => handleSort('date')}>
                  <div className="flex items-center gap-2">Date <ArrowUpDown className="w-4 h-4" /></div>
                </th>
                <th className="p-4 font-medium cursor-pointer hover:text-emerald-500 transition-colors" onClick={() => handleSort('food_category')}>
                  <div className="flex items-center gap-2">Category <ArrowUpDown className="w-4 h-4" /></div>
                </th>
                <th className="p-4 font-medium cursor-pointer hover:text-emerald-500 transition-colors" onClick={() => handleSort('quantity_kg')}>
                  <div className="flex items-center gap-2">Quantity (kg) <ArrowUpDown className="w-4 h-4" /></div>
                </th>
                <th className="p-4 font-medium cursor-pointer hover:text-emerald-500 transition-colors" onClick={() => handleSort('meal_type')}>
                  <div className="flex items-center gap-2">Meal Type <ArrowUpDown className="w-4 h-4" /></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-400">Loading history...</td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-16 text-center text-slate-400">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                      <FileText className="w-8 h-8" />
                    </div>
                    <p className="font-medium text-lg">No records found</p>
                    <p className="text-sm">Try adjusting your search criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/25 transition-colors">
                    <td className="p-4 whitespace-nowrap text-sm font-medium">{log.date}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-medium">
                        {log.food_category}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-emerald-600 dark:text-emerald-400">{log.quantity_kg} kg</td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{log.meal_type}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
