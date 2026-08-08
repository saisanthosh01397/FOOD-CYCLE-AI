import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, ArrowRight, Brain, Recycle, Globe, Camera } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white selection:bg-emerald-500/30">
      {/* Nav */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-400">
            FoodCycle AI
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-emerald-500 font-medium transition-colors">
            Sign In
          </Link>
          <Link to="/login" className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors shadow-lg shadow-emerald-500/25">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-3xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8"
          >
            Predict. Recover. <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">Impact.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 dark:text-slate-400 mb-12"
          >
            An AI-powered Decision Support System for intelligent food waste prediction, computer vision classification, and resource recovery.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/login" className="flex items-center gap-2 px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-emerald-500/25">
              Launch Dashboard <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>

        {/* Features / Workflow */}
        <div className="grid md:grid-cols-3 gap-8 mt-32">
          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-500">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Vision AI</h3>
            <p className="text-slate-600 dark:text-slate-400">Snap a photo. YOLOv8 instantly classifies the food waste category with high precision.</p>
          </div>
          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-500">
              <Brain className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Predictive ML</h3>
            <p className="text-slate-600 dark:text-slate-400">Prophet & Random Forest analyze environmental data to forecast waste trends accurately.</p>
          </div>
          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-500">
              <Recycle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Smart Recovery</h3>
            <p className="text-slate-600 dark:text-slate-400">Automatically routes waste to composting, biogas, or donation with Explainable AI reasoning.</p>
          </div>
        </div>

        {/* SDGs */}
        <div className="mt-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium mb-6">
            <Globe className="w-4 h-4 text-emerald-500" /> Aligned with UN SDGs
          </div>
          <h2 className="text-3xl font-bold mb-12">Driving Sustainable Development</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="px-6 py-3 rounded-xl border dark:border-slate-800 font-semibold flex items-center gap-2">
              <span className="text-emerald-500">2</span> Zero Hunger
            </div>
            <div className="px-6 py-3 rounded-xl border dark:border-slate-800 font-semibold flex items-center gap-2">
              <span className="text-emerald-500">12</span> Responsible Consumption
            </div>
            <div className="px-6 py-3 rounded-xl border dark:border-slate-800 font-semibold flex items-center gap-2">
              <span className="text-emerald-500">13</span> Climate Action
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
