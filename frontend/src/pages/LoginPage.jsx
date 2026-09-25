import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, User, Eye, EyeOff, Leaf, Brain, Recycle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';

// Cinematic Ecosystem Visual for the left panel
function CinematicEcosystem() {
  return (
    <div className="relative w-full max-w-[420px] aspect-square mx-auto flex items-center justify-center">
      {/* 1. Deep background atmospheric pulses */}
      <motion.div 
        className="absolute inset-0 rounded-full bg-brand-500/10 blur-3xl mix-blend-screen"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div 
        className="absolute inset-0 rounded-full bg-accent-500/10 blur-[80px] mix-blend-screen"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* 2. Complex Orbital Rings */}
      <div className="absolute inset-0 border border-white/5 rounded-full" />
      <motion.div 
        className="absolute inset-4 border border-brand-500/20 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand-400 shadow-[0_0_10px_#34d399]" />
        <div className="absolute bottom-1/4 right-0 translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand-500/50" />
      </motion.div>
      <motion.div 
        className="absolute inset-16 border border-accent-500/20 rounded-full border-dashed"
        animate={{ rotate: -360 }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-full bg-accent-400 shadow-[0_0_12px_#22d3ee]" />
      </motion.div>

      {/* 3. Central Identity */}
      <motion.div 
        className="relative z-10 w-24 h-24 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-2xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, type: "spring" }}
      >
        <Logo className="w-14 h-14 text-white" animated />
      </motion.div>

      {/* 4. Connection Lines (SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
        <motion.path 
          d="M 50 15 Q 85 15 85 50 T 50 85 T 15 50 T 50 15" 
          fill="none" 
          stroke="url(#flowGrad)" 
          strokeWidth="0.5" 
          strokeDasharray="4 8"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.3 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
        <defs>
          <linearGradient id="flowGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* 5. Floating Intelligence Nodes */}
      {[
        { i: Leaf,   l: 'Detection',   a: -90, d: 0.2 },
        { i: Brain,  l: 'Prediction',  a: 30,  d: 0.4 },
        { i: Recycle,l: 'Recovery',    a: 150, d: 0.6 }
      ].map((node, idx) => {
        const rad = (node.a * Math.PI) / 180;
        const cx = 50 + 40 * Math.cos(rad);
        const cy = 50 + 40 * Math.sin(rad);
        const Icon = node.i;
        return (
          <motion.div
            key={idx}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
            style={{ left: `${cx}%`, top: `${cy}%` }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 + node.d, type: "spring", bounce: 0.5 }}
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl relative group">
              <Icon className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
              <motion.div 
                className="absolute inset-0 rounded-2xl border border-white/30"
                animate={{ scale: [1, 1.2, 1], opacity: [0, 0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: node.d }}
              />
            </div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-white/50">{node.l}</span>
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
    <div className="min-h-screen flex bg-[var(--background)]">

      {/* ===== LEFT PANEL — Cinematic Identity ===== */}
      <div className="hidden lg:flex lg:w-[50%] relative overflow-hidden bg-[#020610] items-center justify-center p-12">
        {/* Subtle grid background */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
            backgroundSize: '3rem 3rem'
          }}
        />

        <div className="relative z-10 w-full flex flex-col h-full justify-between">
          <Link to="/" className="flex items-center gap-3">
            <Logo className="w-8 h-8 text-brand-400" />
            <span className="text-xl font-bold text-white tracking-tight">FoodCycle <span className="text-brand-400">AI</span></span>
          </Link>
          
          <div className="flex-1 flex flex-col items-center justify-center -mt-12">
            <CinematicEcosystem />
            
            <motion.div 
              className="mt-16 text-center max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 1 }}
            >
              <h2 className="text-3xl font-bold text-white tracking-tight mb-4">Enterprise Sustainability</h2>
              <p className="text-[var(--text-muted)] leading-relaxed font-medium">
                Log, analyze, and recover food resources. Our AI determines the optimal pathway from kitchen to community.
              </p>
            </motion.div>
          </div>
          
          <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-600">
            <span>Platform v2.0</span>
            <span>Secure Access</span>
          </div>
        </div>
      </div>

      {/* ===== RIGHT PANEL — Auth Form ===== */}
      <div className="w-full lg:w-[50%] flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
        {/* Ambient background for dark mode form side */}
        <div className="absolute inset-0 pointer-events-none hidden dark:block">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/5 rounded-full blur-[100px]" />
        </div>

        <motion.div 
          className="w-full max-w-md relative z-10"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Mobile Logo */}
          <Link to="/" className="flex lg:hidden items-center gap-3 mb-10">
            <Logo className="w-8 h-8 text-brand-500" animated />
            <span className="text-2xl font-black text-[var(--text-primary)] tracking-tight">FoodCycle AI</span>
          </Link>

          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--text-primary)] mb-3">
              {isLogin ? 'Welcome back.' : 'Create an account.'}
            </h1>
            <p className="text-[var(--text-muted)] font-medium">
              {isLogin 
                ? 'Sign in to access your intelligence command center.' 
                : 'Join the circular food economy today.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <Input
                    icon={User}
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-12 bg-[var(--surface-hover)]"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Work Email
              </label>
              <Input
                icon={Mail}
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-[var(--surface-hover)] group-focus-within:border-brand-500 group-focus-within:ring-1 group-focus-within:ring-brand-500/50 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                  Password
                </label>
                {isLogin && (
                  <a href="#" className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline">
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="relative">
                <Input
                  icon={Lock}
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-[var(--surface-hover)] group-focus-within:border-brand-500 group-focus-within:ring-1 group-focus-within:ring-brand-500/50 transition-all"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[var(--text-muted)] hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full h-14 mt-6 text-base font-bold relative overflow-hidden group"
              isLoading={loading}
              icon={isLogin ? ArrowRight : ShieldCheck}
            >
              <span className="relative z-10">{isLogin ? 'Sign In' : 'Create Account'}</span>
              <motion.div 
                className="absolute inset-0 bg-brand-600 dark:bg-brand-400"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
              />
            </Button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm font-medium text-[var(--text-muted)]">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                className="text-brand-600 dark:text-brand-400 font-bold hover:underline"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setEmail('');
                  setPassword('');
                }}
              >
                {isLogin ? 'Request access' : 'Sign in instead'}
              </button>
            </p>
          </div>
          
        </motion.div>
      </div>
    </div>
  );
}
