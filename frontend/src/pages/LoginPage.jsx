import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, User, Eye, EyeOff, Leaf, Brain, Recycle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import { fadeUp, scaleIn } from '../utils/animations';

// Simple circular economy visual for the left panel
function CircularEconomyVisual() {
  const steps = [
    { icon: Leaf,    label: 'Food',         angle: 0,   delay: 0    },
    { icon: Brain,   label: 'AI Analysis',  angle: 120, delay: 0.2  },
    { icon: Recycle, label: 'Recovery',     angle: 240, delay: 0.4  },
  ];

  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Rotating orbit ring */}
      <div
        className="absolute inset-0 rounded-full border-2 border-brand-500/20 border-dashed"
        style={{ animation: 'orbit-slow 20s linear infinite' }}
      />
      <div
        className="absolute inset-8 rounded-full border border-accent-500/15"
        style={{ animation: 'orbit-reverse 30s linear infinite' }}
      />

      {/* Center logo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-brand-500/20 rounded-full blur-xl scale-150" />
          <Logo className="w-16 h-16 text-brand-400" animated />
        </div>
      </div>

      {/* 3 orbiting step nodes */}
      {steps.map((step, i) => {
        const rad = ((step.angle - 90) * Math.PI) / 180;
        const cx = 50 + 42 * Math.cos(rad);
        const cy = 50 + 42 * Math.sin(rad);
        const IconEl = step.icon;
        return (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + step.delay, type: 'spring', stiffness: 200 }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${cx}%`, top: `${cy}%` }}
          >
            <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg">
              <IconEl className="w-5 h-5 text-brand-300" />
            </div>
            <p className="text-center text-[10px] text-white/60 mt-1 whitespace-nowrap font-medium">{step.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let success = false;
    if (isLogin) {
      success = await login(email, password);
      if (success) navigate('/dashboard');
    } else {
      success = await register(email, password, fullName);
      if (success) setIsLogin(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#070e1a]">

      {/* ===== LEFT PANEL — Branding ===== */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#0b1d2e] to-[#0a1a10] items-center justify-center p-12">
        {/* Background glow blobs */}
        <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-brand-500/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-3xl" />

        {/* Dot grid texture */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(16,185,129,0.15) 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }}
        />

        <div className="relative z-10 max-w-md text-center">
          {/* Logo + Name */}
          <div className="flex items-center gap-3 justify-center mb-12">
            <Logo className="w-10 h-10 text-brand-400" animated />
            <span className="text-2xl font-bold text-white tracking-tight">FoodCycle AI</span>
          </div>

          {/* Circular economy visual */}
          <CircularEconomyVisual />

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="mt-10"
          >
            <h2 className="text-3xl font-extrabold text-white mb-3 leading-tight">
              Turn Food Waste<br />Into Intelligence.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Enterprise AI for food waste prediction, recovery optimization, and circular economy management.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.4 }}
            className="mt-10 flex items-center justify-center gap-10"
          >
            {[
              { value: '92%',  label: 'AI Accuracy'  },
              { value: '3x',   label: 'Waste Reduced' },
              { value: 'SDG',  label: 'Aligned'       },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-black text-brand-400">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ===== RIGHT PANEL — Auth Form ===== */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-20 bg-slate-50 dark:bg-[#0a1118]">
        <div className="w-full max-w-md mx-auto">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 justify-center mb-10">
            <Logo className="w-9 h-9 text-brand-500" />
            <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">FoodCycle AI</span>
          </div>

          {/* Header */}
          <motion.div variants={fadeUp} initial="initial" animate="animate" className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {isLogin
                ? 'Sign in to your FoodCycle AI dashboard.'
                : 'Start your sustainability journey today.'}
            </p>
          </motion.div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <Input
                    icon={User}
                    type="text"
                    required={!isLogin}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    autoComplete="name"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email address
              </label>
              <Input
                icon={Mail}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@organization.com"
                autoComplete="email"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                {isLogin && (
                  <span className="text-xs text-brand-600 dark:text-brand-400 font-medium">
                    Forgot password?
                  </span>
                )}
              </div>
              {/* Password input wrapper with eye toggle */}
              <div className="relative">
                <Input
                  icon={Lock}
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              isLoading={loading}
              size="lg"
            >
              {loading
                ? (isLogin ? 'Authenticating...' : 'Creating account...')
                : (isLogin ? 'Sign in' : 'Create account')}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <span className="text-slate-500 dark:text-slate-400 text-sm">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
            </span>
            <button
              onClick={() => setIsLogin(v => !v)}
              className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
            >
              {isLogin ? 'Register now' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
