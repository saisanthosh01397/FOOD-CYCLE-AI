import { Menu, Moon, Sun, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TopNav({ toggleSidebar, toggleDarkMode, darkMode }) {
  const { user } = useAuth();

  return (
    <header className="h-16 glass sticky top-0 z-30 border-b dark:border-slate-800 px-4 md:px-6 flex items-center justify-between lg:justify-end">
      <div className="flex items-center gap-4 lg:hidden">
        <button onClick={toggleSidebar} className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border border-white dark:border-slate-900"></span>
        </button>
        
        <button 
          onClick={toggleDarkMode}
          className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
          {user?.email?.charAt(0).toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  );
}
