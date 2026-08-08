import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PieChart, Camera, Leaf, History, User, Settings, X } from 'lucide-react';
import { cn } from '../utils/cn'; // We'll create this utility
import { useAuth } from '../context/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Prediction', path: '/prediction', icon: PieChart },
  { name: 'Image Analysis', path: '/vision', icon: Camera },
  { name: 'Recovery', path: '/recovery', icon: Leaf },
  { name: 'Analytics', path: '/analytics', icon: PieChart },
  { name: 'History', path: '/history', icon: History },
  { name: 'User Management', path: '/users', icon: User, adminOnly: true },
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar({ isOpen, setIsOpen, isCollapsed }) {
  const { user } = useAuth();
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-screen glass dark:bg-slate-900 border-r dark:border-slate-800 transition-all duration-300 ease-in-out lg:translate-x-0 overflow-y-auto",
        isOpen ? "translate-x-0" : "-translate-x-full",
        isCollapsed ? "w-20" : "w-64"
      )}>
        <div className={cn("flex items-center h-16 px-6 border-b dark:border-slate-800", isCollapsed ? "justify-center px-0" : "justify-between")}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-400 dark:from-emerald-400 dark:to-emerald-200 whitespace-nowrap">
                FoodCycle AI
              </span>
            )}
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            if (item.adminOnly && user?.role !== 'Administrator') return null;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                title={isCollapsed ? item.name : undefined}
                className={({ isActive }) => cn(
                  "flex items-center rounded-xl transition-all duration-200",
                  isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3",
                  isActive 
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 font-medium" 
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800"
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
