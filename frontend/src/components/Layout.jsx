import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

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
    <div className="min-h-screen bg-secondary/50 dark:bg-background transition-colors duration-300">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} isCollapsed={sidebarCollapsed} />
      
      <div className={`${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'} flex flex-col min-h-screen transition-all duration-300`}>
        <TopNav toggleSidebar={() => setSidebarOpen(true)} toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
        
        <footer className="w-full border-t dark:border-slate-800 p-4 mt-auto">
          <div className="max-w-7xl mx-auto text-center text-sm text-slate-500 dark:text-slate-400 space-y-1">
            <p className="font-medium text-slate-700 dark:text-slate-300">FoodCycle AI &copy; 2026 | Version 1.0.0</p>
            <p>Developed by <strong>Sai Santhosh Bontha</strong> | Kalasalingam Academy of Research and Education</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
