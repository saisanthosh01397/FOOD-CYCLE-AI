import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import Logo from './ui/Logo';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check local storage for settings
    const storedDarkMode = localStorage.getItem('theme') === 'dark';
    const storedCollapse = localStorage.getItem('sidebarCollapse') === 'true';
    
    setSidebarCollapsed(storedCollapse);
    
    if (storedDarkMode || (!localStorage.getItem('theme') && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark');
  };

  const toggleCollapse = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapse', newState.toString());
  };

  // Listen for storage events (e.g. from SettingsPage)
  useEffect(() => {
    const handleStorage = () => {
        setSidebarCollapsed(localStorage.getItem('sidebarCollapse') === 'true');
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        } else if (theme === 'light') {
            setDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors duration-300">
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        isCollapsed={sidebarCollapsed} 
        toggleCollapse={toggleCollapse} 
      />
      
      <div className={`${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'} flex flex-col min-h-screen transition-all duration-300 ease-in-out`}>
        <TopNav toggleSidebar={() => setSidebarOpen(true)} toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
        
        <footer className="w-full border-t dark:border-slate-800/50 p-6 mt-auto bg-slate-50/50 dark:bg-slate-900/10">
          <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Logo className="w-5 h-5 text-brand-500" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">FoodCycle AI &copy; 2026</span>
            </div>
            <p>Developed by <strong className="text-slate-700 dark:text-slate-300">Sai Santhosh Bontha</strong> | Kalasalingam Academy of Research and Education</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
