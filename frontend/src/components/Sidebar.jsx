import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, BarChart3, Camera, Leaf, History,
  User, Settings, X, ChevronLeft, ChevronRight,
  Brain, Users, ShieldCheck, Recycle
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
    section: 'OPERATIONS',
    items: [
      { name: 'Prediction',      path: '/prediction', icon: Brain },
      { name: 'Image Analysis',  path: '/vision',      icon: Camera },
      { name: 'Recovery',        path: '/recovery',    icon: Recycle },
      { name: 'History',         path: '/history',     icon: History },
    ]
  },
  {
    section: 'ADMINISTRATION',
    adminOnly: true,
    items: [
      { name: 'User Management', path: '/users',    icon: Users },
      { name: 'Settings',        path: '/settings', icon: Settings },
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

// Role color accent map
const roleAccent = {
  Administrator: 'text-purple-400 dark:text-purple-300',
  'Mess Manager': 'text-amber-500 dark:text-amber-400',
  User: 'text-brand-500 dark:text-brand-400',
};
const roleIcon = {
  Administrator: ShieldCheck,
  'Mess Manager': Leaf,
  User: User,
};

export default function Sidebar({ isOpen, setIsOpen, isCollapsed, toggleCollapse }) {
  const { user } = useAuth();
  const RoleIcon = roleIcon[user?.role] || User;

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-screen flex flex-col transition-all duration-300 ease-in-out",
        "bg-[var(--card)] dark:bg-[#0c1420] border-r border-[var(--border)] shadow-2xl lg:shadow-none",
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
        isCollapsed ? "w-20" : "w-64"
      )}>

        {/* ---- Header / Logo ---- */}
        <div className="h-16 flex items-center shrink-0 px-4 border-b border-[var(--border)] relative">
          <div className={cn("flex items-center gap-3 overflow-hidden", isCollapsed && "mx-auto")}>
            <div className="shrink-0">
              <Logo className="w-8 h-8 text-brand-500" />
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap"
                >
                  FoodCycle AI
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden absolute right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ---- Navigation ---- */}
        <nav className="flex-1 overflow-y-auto hide-scrollbar py-4 px-2.5 space-y-5">
          {navigation.map((group, groupIdx) => {
            if (group.adminOnly && user?.role !== 'Administrator') return null;

            const visibleItems = group.items.filter(item => {
              if (item.allowedRoles && !item.allowedRoles.includes(user?.role)) return false;
              if (item.hideForAdmin && user?.role === 'Administrator') return false;
              return true;
            });

            if (visibleItems.length === 0) return null;

            return (
              <div key={groupIdx} className="flex flex-col gap-0.5">
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.1em]"
                    >
                      {group.section}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isCollapsed && <div className="h-2" />}

                {visibleItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    title={isCollapsed ? item.name : undefined}
                    className={({ isActive }) => cn(
                      "group relative flex items-center rounded-xl transition-all duration-200 font-medium text-sm",
                      isCollapsed ? "justify-center p-3" : "gap-3 px-3 py-2.5",
                      isActive
                        ? "bg-brand-500/10 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                    )}
                  >
                    {({ isActive }) => (
                      <>
                        {/* Active bar indicator */}
                        {isActive && (
                          <motion.div
                            layoutId="sidebar-active-indicator"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-brand-500 rounded-r-full"
                          />
                        )}
                        <item.icon className={cn(
                          "shrink-0 transition-all duration-200",
                          isCollapsed ? "w-5 h-5" : "w-4.5 h-4.5",
                          isActive ? "text-brand-500" : "group-hover:scale-110"
                        )} />
                        <AnimatePresence>
                          {!isCollapsed && (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              className="whitespace-nowrap"
                            >
                              {item.name}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            );
          })}
        </nav>

        {/* ---- User Info (bottom) ---- */}
        <div className="shrink-0 p-3 border-t border-[var(--border)]">
          <AnimatePresence>
            {!isCollapsed ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50"
              >
                <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm shrink-0">
                  {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.full_name}</p>
                  <p className={cn("text-xs font-medium truncate", roleAccent[user?.role])}>
                    {user?.role}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center"
              >
                <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm">
                  {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapse toggle (desktop only) */}
          <button
            onClick={toggleCollapse}
            className="mt-2 hidden lg:flex items-center justify-center w-full p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>
    </>
  );
}
