import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Recycle, Camera, Leaf, Globe, Zap, BarChart3 } from 'lucide-react';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import { staggerContainer, staggerItem, fadeUp } from '../utils/animations';

// Orbital concept pills around the central logo
const orbitItems = [
  { label: 'Food',         icon: Leaf,     angle: 0,   color: 'from-green-500 to-emerald-600',  delay: 0     },
  { label: 'Vision AI',    icon: Camera,   angle: 72,  color: 'from-blue-500 to-cyan-600',       delay: 0.15  },
  { label: 'Prediction',   icon: Brain,    angle: 144, color: 'from-violet-500 to-purple-600',   delay: 0.3   },
  { label: 'Recovery',     icon: Recycle,  angle: 216, color: 'from-amber-500 to-orange-600',    delay: 0.45  },
  { label: 'Sustainability', icon: Globe,  angle: 288, color: 'from-teal-500 to-brand-600',      delay: 0.6   },
];

// Convert polar to cartesian coordinates
function polarToCartesian(angle, radius) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: 50 + radius * Math.cos(rad), y: 50 + radius * Math.sin(rad) };
}

const features = [
  {
    icon: Camera,
    title: 'YOLOv8 Vision',
    description: 'Snap a photo. Our computer vision instantly classifies food waste with enterprise-grade precision and confidence scoring.',
    accent: 'brand',
  },
  {
    icon: Brain,
    title: 'Prophet Forecasting',
    description: 'Time-series forecasting with Facebook Prophet and Random Forest models predict waste patterns days in advance.',
    accent: 'accent',
  },
  {
    icon: Recycle,
    title: 'Smart Recovery',
    description: 'Explainable AI routes waste to optimal recovery — composting, biogas generation, or community donation.',
    accent: 'brand',
  },
];

const sdgs = [
  { num: 2,  title: 'Zero Hunger',              color: 'text-amber-600 dark:text-amber-400'    },
  { num: 12, title: 'Responsible Consumption',  color: 'text-brand-600 dark:text-brand-400'    },
  { num: 13, title: 'Climate Action',            color: 'text-accent-600 dark:text-accent-400'  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#070e1a] text-slate-900 dark:text-white selection:bg-brand-500/30 overflow-x-hidden">

      {/* === Background glow blobs === */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/3 right-0 w-[700px] h-[700px] bg-brand-500/8 dark:bg-brand-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-1/4 w-[600px] h-[600px] bg-accent-500/8 dark:bg-accent-500/5 rounded-full blur-3xl" />
      </div>

      {/* === Navigation === */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Logo className="w-9 h-9 text-brand-500" />
          <span className="text-xl font-bold tracking-tight">FoodCycle AI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-500 dark:hover:text-brand-400 transition-colors hidden sm:block"
          >
            Sign In
          </Link>
          <Link to="/login">
            <Button size="sm" className="shadow-lg shadow-brand-500/20">
              Get Started <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* === Hero === */}
      <main className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Hero content */}
        <section className="pt-16 pb-24 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-400 font-semibold text-sm mb-10 border border-brand-200 dark:border-brand-800/40"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
            </span>
            AI-Powered Circular Economy Platform
          </motion.div>

          {/* Central animated logo + orbiting pills */}
          <div className="relative w-72 h-72 md:w-96 md:h-96 mx-auto mb-16">
            {/* Orbit track rings */}
            <div className="absolute inset-0 rounded-full border border-slate-200/50 dark:border-slate-800/50" />
            <div className="absolute inset-6 rounded-full border border-slate-200/30 dark:border-slate-800/30 border-dashed" />

            {/* Central Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-brand-500/20 rounded-full blur-2xl scale-150" />
                <Logo className="w-20 h-20 md:w-24 md:h-24 text-brand-500" animated />
              </div>
            </motion.div>

            {/* Orbiting concept pills */}
            {orbitItems.map((item, i) => {
              const pos = polarToCartesian(item.angle, 46); // 46% radius
              const IconEl = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + item.delay, duration: 0.4, type: 'spring', stiffness: 200 }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${item.color} text-white text-xs font-bold shadow-lg whitespace-nowrap`}>
                    <IconEl className="w-3 h-3" />
                    {item.label}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 leading-none"
          >
            Turn Food Waste<br />
            Into <span className="text-gradient">Intelligence.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 mb-4 font-medium"
          >
            Predict. Recover. Reduce.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="text-base md:text-lg text-slate-500 dark:text-slate-500 mb-12 max-w-2xl mx-auto"
          >
            An enterprise AI platform combining YOLOv8, Prophet, and Explainable AI to transform food waste into a circular economy resource.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/login">
              <Button size="lg" className="h-13 px-8 text-base rounded-2xl shadow-xl shadow-brand-500/25">
                Launch Platform <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* === Features === */}
        <section className="pb-24">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-80px' }}
            className="grid md:grid-cols-3 gap-6"
          >
            {features.map((f, i) => {
              const IconEl = f.icon;
              return (
                <motion.div
                  key={f.title}
                  variants={staggerItem}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="group p-8 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-brand-200 dark:hover:border-brand-800/60 transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/5"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-50 to-accent-50 dark:from-brand-900/30 dark:to-accent-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconEl className="w-7 h-7 text-brand-600 dark:text-brand-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{f.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{f.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* === Flow visualization === */}
        <section className="pb-24 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-12 text-slate-900 dark:text-white">
              The <span className="text-gradient">Circular Flow</span>
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-0">
              {[
                { label: 'Food Waste',    color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400', icon: '🍽️' },
                { label: 'AI Detection',  color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',     icon: '🔍' },
                { label: 'Prediction',    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400', icon: '📈' },
                { label: 'Recovery',      color: 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400', icon: '♻️' },
                { label: 'Sustainability',color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400',     icon: '🌱' },
              ].map((step, i) => (
                <React.Fragment key={step.label}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm ${step.color}`}
                  >
                    <span className="text-lg">{step.icon}</span>
                    {step.label}
                  </motion.div>
                  {i < 4 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + 0.15 }}
                      className="text-slate-300 dark:text-slate-700 font-light text-xl mx-1 hidden md:block"
                    >
                      →
                    </motion.div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        </section>

        {/* === SDGs === */}
        <section className="pb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium text-sm mb-8 bg-white/50 dark:bg-slate-900/50">
              <Globe className="w-4 h-4 text-brand-500" />
              Aligned with UN Sustainable Development Goals
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {sdgs.map((sdg) => (
                <div key={sdg.num} className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-full border-2 border-current flex items-center justify-center font-bold text-sm">
                    <span className={sdg.color}>{sdg.num}</span>
                  </div>
                  <span className={`font-semibold text-sm ${sdg.color}`}>{sdg.title}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      </main>

      {/* === Footer === */}
      <footer className="border-t border-slate-100 dark:border-slate-800/50 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-500">
          <div className="flex items-center gap-2">
            <Logo className="w-5 h-5 text-brand-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-400">FoodCycle AI &copy; 2026</span>
          </div>
          <p>Developed by <strong className="text-slate-700 dark:text-slate-300">Sai Santhosh Bontha</strong> · Kalasalingam Academy of Research and Education</p>
        </div>
      </footer>
    </div>
  );
}
