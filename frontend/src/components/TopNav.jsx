import React, { useState, useRef, useEffect } from 'react';
import { Menu, Sun, Moon, LogOut, User as UserIcon, ChevronDown, Bell, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const pageTitles = {
  dashboard:  'Dashboard',
  analytics:  'Analytics',
  prediction: 'Prediction',
  vision:     'Image Analysis',
  recovery:   'Recovery',
  history:    'History',
  profile:    'Profile',
  settings:   'Settings',
  users:      'User Management',
};

export default function TopNav({ toggleSidebar, toggleDarkMode, darkMode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  
  const userRef = useRef();
  const notifRef = useRef();

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (userRef.current && !userRef.current.contains(event.target)) setDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pathSegment = location.pathname.split('/')[1] || 'dashboard';
  const pageTitle = pageTitles[pathSegment] || (pathSegment.charAt(0).toUpperCase() + pathSegment.slice(1));

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/login');
  };

  const menuSpring = {
    initial: { opacity: 0, scale: 0.9, y: 10, filter: 'blur(4px)' },
    animate: { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', transition: { type: "spring", bounce: 0.4, duration: 0.6 } },
    exit: { opacity: 0, scale: 0.95, y: -5, filter: 'blur(2px)', transition: { duration: 0.2 } }
  };

  return (
    <header className="h-[72px] shrink-0 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">

      {/* Left: Hamburger + Breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2.5 -ml-2 rounded-xl text-[var(--text-muted)] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-3">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Platform</span>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
            <span className="text-sm font-black tracking-tight text-[var(--text-primary)]">{pageTitle}</span>
          </motion.div>
        </div>
      </div>

      {/* Right: Theme, Notifications, User */}
      <div className="flex items-center gap-1.5 md:gap-3">

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2.5 text-[var(--text-muted)] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={darkMode ? 'sun' : 'moon'}
              initial={{ opacity: 0, rotate: -45, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 45, scale: 0.5 }}
              transition={{ duration: 0.3, type: "spring" }}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.div>
          </AnimatePresence>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2.5 relative text-[var(--text-muted)] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-[var(--background)]" />
          </button>
          
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                {...menuSpring}
                className="absolute right-0 mt-2 w-80 bg-[var(--surface)]/90 backdrop-blur-2xl border border-[var(--border)] rounded-3xl shadow-2xl overflow-hidden origin-top-right z-50"
              >
                <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Notifications</span>
                  <span className="text-[10px] font-bold text-brand-500 bg-brand-500/10 px-2 py-0.5 rounded-full">2 New</span>
                </div>
                <div className="p-2 max-h-64 overflow-y-auto">
                  <div className="p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer border border-transparent hover:border-[var(--border)] mb-1">
                    <p className="text-sm font-bold text-[var(--text-primary)]">AI Prediction Complete</p>
                    <p className="text-xs font-medium text-[var(--text-muted)] mt-0.5">Prophet model finished analyzing breakfast logs.</p>
                  </div>
                  <div className="p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer border border-transparent hover:border-[var(--border)]">
                    <p className="text-sm font-bold text-[var(--text-primary)]">System Backup</p>
                    <p className="text-xs font-medium text-[var(--text-muted)] mt-0.5">Automated database backup completed successfully.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden md:block mx-1" />

        {/* User Profile */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 pl-1.5 pr-4 py-1.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all outline-none focus-visible:ring-2 focus-visible:ring-brand-500 border border-transparent"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-400 to-accent-500 text-white flex items-center justify-center font-black text-xs shadow-md">
              {user?.full_name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-bold text-[var(--text-primary)] leading-none mb-1">{user?.full_name}</span>
              <span className="text-[10px] font-bold text-[var(--text-muted)] leading-none uppercase tracking-wider">{user?.role}</span>
            </div>
            <motion.div animate={{ rotate: dropdownOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown className="w-4 h-4 text-[var(--text-muted)] ml-1" />
            </motion.div>
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                {...menuSpring}
                className="absolute right-0 mt-2 w-56 bg-[var(--surface)]/90 backdrop-blur-2xl border border-[var(--border)] rounded-3xl shadow-2xl overflow-hidden origin-top-right z-50 p-2"
              >
                <div className="px-4 py-3 mb-2 border-b border-[var(--border)]">
                  <p className="text-sm font-black text-[var(--text-primary)] truncate">{user?.full_name}</p>
                  <p className="text-xs font-medium text-[var(--text-muted)] truncate mt-0.5">{user?.email}</p>
                </div>

                <div className="space-y-1">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-[var(--text-secondary)] hover:text-brand-500 dark:hover:text-brand-400 hover:bg-brand-500/10 rounded-xl transition-colors"
                  >
                    <UserIcon className="w-4 h-4" /> My Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-[var(--text-secondary)] hover:text-brand-500 dark:hover:text-brand-400 hover:bg-brand-500/10 rounded-xl transition-colors"
                  >
                    <Settings className="w-4 h-4" /> Preferences
                  </Link>
                </div>

                <div className="mt-2 pt-2 border-t border-[var(--border)]">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  );
}
