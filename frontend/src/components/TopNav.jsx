import React, { useState } from 'react';
import { Menu, Sun, Moon, LogOut, User as UserIcon, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Badge from './ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import { scaleIn } from '../utils/animations';

// Map path segments to readable page titles
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

  const pathSegment = location.pathname.split('/')[1] || 'dashboard';
  const pageTitle = pageTitles[pathSegment] || (pathSegment.charAt(0).toUpperCase() + pathSegment.slice(1));

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 shrink-0 border-b border-[var(--border)] bg-white/90 dark:bg-[#0c1420]/90 backdrop-blur-md sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between">

      {/* Left: Hamburger + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 -ml-1 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-sm">
          <span className="text-slate-400 dark:text-slate-600 font-medium">FoodCycle AI</span>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">{pageTitle}</span>
        </div>
      </div>

      {/* Right: Theme + User */}
      <div className="flex items-center gap-2">

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={darkMode ? 'sun' : 'moon'}
              initial={{ opacity: 0, rotate: -30 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 30 }}
              transition={{ duration: 0.2 }}
            >
              {darkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </motion.div>
          </AnimatePresence>
        </button>

        <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden md:block mx-1" />

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(v => !v)}
            className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center font-bold text-xs">
              {user?.full_name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="hidden md:flex flex-col items-start leading-none">
              <span className="text-xs font-semibold text-slate-900 dark:text-white">{user?.full_name}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{user?.role}</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <>
                {/* Click away overlay */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />
                <motion.div
                  variants={scaleIn}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="absolute right-0 top-full mt-2 w-60 z-20"
                >
                  <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                    {/* Profile header */}
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center font-bold">
                          {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{user?.full_name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Badge
                          variant={user?.role === 'Administrator' ? 'admin' : user?.role === 'Mess Manager' ? 'info' : 'success'}
                          className="text-xs"
                        >
                          {user?.role}
                        </Badge>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-2">
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                      >
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Settings</span>
                      </Link>
                      <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
