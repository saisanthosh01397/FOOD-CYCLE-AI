import React, { useState, useEffect } from 'react';
import {
  User, Mail, Shield, LogOut, Settings, Activity, Camera,
  Brain, CheckCircle, XCircle, Calendar, Hash, Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import PageHeader from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import AnimatedNumber from '../components/ui/AnimatedNumber';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, fadeUp } from '../utils/animations';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (user) {
      api.get('/users/me')
        .then(res => setProfileData(res.data))
        .catch(err => console.error('Failed to load profile details', err));
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="My Profile"
        description="View and manage your account information and activity summary."
      />

      <div className="grid md:grid-cols-3 gap-6">

        {/* ===== LEFT: Avatar card ===== */}
        <motion.div {...fadeUp} className="md:col-span-1">
          <Card className="p-8 flex flex-col items-center text-center relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-brand-500/5 to-transparent dark:from-brand-500/8 dark:to-transparent pointer-events-none" />
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl" />

            <div className="relative z-10 w-full flex flex-col items-center">
              {/* Avatar */}
              <div className="relative mb-6">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-white text-4xl font-black shadow-xl"
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    user?.full_name?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                {/* Online dot */}
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-brand-500 rounded-full border-2 border-white dark:border-[var(--card)]">
                  <div className="absolute inset-0 rounded-full bg-brand-500 animate-ping opacity-60" />
                </div>
              </div>

              <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">
                {user?.full_name || user?.email?.split('@')[0] || 'User'}
              </h2>
              <p className="text-sm text-slate-500 mb-4">{user?.email}</p>

              <Badge
                variant={user?.role === 'Administrator' ? 'admin' : user?.role === 'Mess Manager' ? 'info' : 'success'}
                icon={Shield}
                className="px-3 py-1.5 text-xs font-bold"
              >
                {user?.role || 'User'}
              </Badge>

              {/* Account details */}
              {profileData && (
                <div className="w-full space-y-3 mt-6 pt-6 border-t border-[var(--border)]">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5" /> Status
                    </span>
                    {profileData.is_active ? (
                      <span className="flex items-center gap-1 text-brand-600 dark:text-brand-400 font-bold text-xs">
                        <CheckCircle className="w-3.5 h-3.5" /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold text-xs">
                        <XCircle className="w-3.5 h-3.5" /> Inactive
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Joined
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white text-xs">
                      {new Date(profileData.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium flex items-center gap-1.5">
                      <Hash className="w-3.5 h-3.5" /> User ID
                    </span>
                    <span className="font-mono text-xs text-slate-500 truncate max-w-[80px]" title={profileData.id}>
                      {profileData.id?.slice(0, 8)}...
                    </span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="w-full space-y-2 mt-6">
                <Link to="/settings" className="block">
                  <Button variant="outline" icon={Settings} className="w-full">
                    Account Settings
                  </Button>
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="danger"
                  icon={LogOut}
                  className="w-full"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* ===== RIGHT: Details ===== */}
        <div className="md:col-span-2 space-y-6">

          {/* Personal information */}
          <motion.div {...fadeUp}>
            <Card className="p-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-5 pb-4 border-b border-[var(--border)]">
                Account Information
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', value: user?.full_name, icon: User },
                  { label: 'Email Address', value: user?.email, icon: Mail },
                  { label: 'Role', value: user?.role, icon: Shield },
                  {
                    label: 'Last Login',
                    value: profileData?.last_login ? new Date(profileData.last_login).toLocaleString() : 'N/A',
                    icon: Clock
                  },
                ].map((field) => {
                  const IconEl = field.icon;
                  return (
                    <div key={field.label}>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                        {field.label}
                      </label>
                      <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-[var(--border)]">
                        <IconEl className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                          {field.value || '—'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* Activity stats */}
          {profileData && (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <motion.div variants={staggerItem} whileHover={{ y: -3, transition: { duration: 0.2 } }}>
                <Card className="p-6 flex items-center gap-5 hover:border-brand-200 dark:hover:border-brand-800/50 transition-all duration-300 group">
                  <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-900/30 text-brand-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Brain className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Total Predictions
                    </p>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">
                      <AnimatedNumber value={profileData.total_predictions || 0} />
                    </p>
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={staggerItem} whileHover={{ y: -3, transition: { duration: 0.2 } }}>
                <Card className="p-6 flex items-center gap-5 hover:border-accent-200 dark:hover:border-accent-800/50 transition-all duration-300 group">
                  <div className="w-14 h-14 rounded-2xl bg-accent-50 dark:bg-accent-900/30 text-accent-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Camera className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Image Analyses
                    </p>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">
                      <AnimatedNumber value={profileData.total_image_analyses || 0} />
                    </p>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
