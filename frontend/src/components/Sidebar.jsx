import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, BarChart3, Camera, Leaf, History,
  User, Settings, X, ChevronLeft, ChevronRight,
  Brain, Users, ShieldCheck, Recycle, HeartHandshake
} from 'lucide-react';
import { cn } from './ui/Button';
import { useAuth } from '../context/AuthContext';
import Logo from './ui/Logo';
import { motion, AnimatePresence } from 'framer-motion';

const navigation = [
  {
    section: 'OVERVIEW',
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Analytics',  path: '/analytics',  icon: BarChart3, allowedRoles: ['Administrator', 'Mess Manager'] },
    ]
  },
  {
    section: 'INTELLIGENCE',
    items: [
      { name: 'Prediction',      path: '/prediction', icon: Brain },
      { name: 'Vision AI',       path: '/vision',     icon: Camera },
      { name: 'Recovery',        path: '/recovery',   icon: Recycle },
    ]
  },
  {
    section: 'OPERATIONS',
    items: [
      { name: 'Rescue Network',  path: '/rescue',     icon: HeartHandshake },
      { name: 'History',         path: '/history',    icon: History },
    ]
  },
  {
    section: 'ADMINISTRATION',
    adminOnly: true,
    items: [
      { name: 'Users',           path: '/users',      icon: Users },
      { name: 'Settings',        path: '/settings',   icon: Settings },
    ]
  },
  {
    section: 'ACCOUNT',
    items: [
      { name: 'Profile',  path: '/profile',  icon: User },
      { name: 'Settings', path: '/settings', icon: Settings, hideForAdmin: true },
    ]
  }
];

export default function Sidebar({ isOpen, setIsOpen, isCollapsed, toggleCollapse }) {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside 
        className={cn(
          "fixed top-0 left-0 z-50 h-screen flex flex-col bg-[var(--surface)]/80 backdrop-blur-xl border-r border-[var(--border)] shadow-2xl lg:shadow-none overflow-hidden",
          "lg:translate-x-0"
        )}
        initial={false}
        animate={{ 
          width: isCollapsed ? 80 : 280,
          x: isOpen || window.innerWidth >= 1024 ? 0 : -300
        }}
        transition={{ duration: 0.4, type: "spring", bounce: 0, damping: 25 }}
      >
        {/* Header / Logo */}
        <div className="h-[72px] flex items-center shrink-0 px-5 border-b border-[var(--border)] relative">
          <div className={cn("flex items-center gap-3 overflow-hidden", isCollapsed && "mx-auto")}>
            <div className="shrink-0 group">
              <Logo className="w-9 h-9 text-brand-500 group-hover:text-brand-400 transition-colors" />
            </div>
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}
                  className="flex flex-col whitespace-nowrap"
                >
                  <span className="text-lg font-black tracking-tight text-[var(--text-primary)] leading-none">
                    FoodCycle AI
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-brand-500 mt-1">Platform v2.0</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden absolute right-4 p-2 rounded-xl text-[var(--text-muted)] hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Area */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar py-6 px-3 space-y-6">
          {navigation.map((group, groupIdx) => {
            if (group.adminOnly && user?.role !== 'Administrator') return null;
            const visibleItems = group.items.filter(item => {
              if (item.allowedRoles && !item.allowedRoles.includes(user?.role)) return false;
              if (item.hideForAdmin && user?.role === 'Administrator') return false;
              return true;
            });
            if (visibleItems.length === 0) return null;

            return (
              <div key={groupIdx} className="flex flex-col gap-1 relative">
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                      className="px-4 py-1 text-[10px] font-black text-[var(--text-muted)]/80 uppercase tracking-[0.15em] mb-1"
                    >
                      {group.section}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {visibleItems.map((item) => {
                  const isActive = location.pathname.startsWith(item.path);
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className="relative px-3 py-3 rounded-2xl flex items-center gap-3 transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    >
                      {/* Active Background Indicator (Framer Motion shared layout) */}
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute inset-0 bg-brand-500/10 dark:bg-brand-500/15 rounded-2xl"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      
                      {/* Active Border Glow */}
                      {isActive && (
                         <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-500 rounded-r-full shadow-[0_0_10px_var(--color-brand-500)]" />
                      )}
                      
                      <div className={cn(
                        "shrink-0 z-10 transition-colors duration-300 relative",
                        isActive ? "text-brand-600 dark:text-brand-400" : "text-[var(--text-muted)] group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200",
                        isCollapsed && "mx-auto"
                      )}>
                        <item.icon className={cn("w-5 h-5", isActive && "drop-shadow-sm")} />
                      </div>

                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}
                            className={cn(
                              "text-sm font-bold z-10 whitespace-nowrap tracking-wide",
                              isActive ? "text-brand-700 dark:text-brand-400" : "text-[var(--text-secondary)] group-hover:text-slate-900 dark:group-hover:text-white"
                            )}
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      
                      {/* Tooltip for collapsed state */}
                      {isCollapsed && (
                        <div className="absolute left-16 bg-[var(--surface)] border border-[var(--border)] shadow-xl px-3 py-1.5 rounded-lg text-sm font-bold text-[var(--text-primary)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                          {item.name}
                        </div>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* ---- Footer / Collapse Toggle ---- */}
        <div className="p-4 border-t border-[var(--border)] shrink-0 flex items-center justify-center">
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex items-center justify-center w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-900/50 text-[var(--text-muted)] hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all outline-none"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <motion.div animate={{ rotate: isCollapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronLeft className="w-5 h-5" />
            </motion.div>
          </button>
        </div>
      </motion.aside>
    </>
  );
}
