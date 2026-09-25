import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Brain, Recycle, Camera, Leaf, Globe, Zap, BarChart3, Database } from 'lucide-react';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import { staggerContainer, staggerItem, pageZoomReveal } from '../utils/animations';

const orbitItems = [
  { label: 'Food',         icon: Leaf,     angle: 0,   color: 'from-emerald-400 to-emerald-600', delay: 0.1 },
  { label: 'Vision AI',    icon: Camera,   angle: 72,  color: 'from-cyan-400 to-cyan-600',       delay: 0.2 },
  { label: 'Prediction',   icon: Brain,    angle: 144, color: 'from-violet-400 to-violet-600',   delay: 0.3 },
  { label: 'Recovery',     icon: Recycle,  angle: 216, color: 'from-amber-400 to-amber-600',    delay: 0.4 },
  { label: 'Sustainability', icon: Globe,  angle: 288, color: 'from-teal-400 to-teal-600',      delay: 0.5 },
];

function polarToCartesian(angle, radius) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: 50 + radius * Math.cos(rad), y: 50 + radius * Math.sin(rad) };
}

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <motion.div 
      className="dark min-h-screen bg-slate-950 text-white selection:bg-brand-500/30 overflow-x-hidden relative"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageZoomReveal}
    >
      {/* Deep Space Background / Glowing Atmospheric Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-brand-500/10 rounded-full blur-[120px] mix-blend-screen"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-accent-500/10 rounded-full blur-[100px] mix-blend-screen"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Top Navbar */}
      <nav className="absolute top-0 w-full p-6 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Logo className="w-10 h-10 text-brand-400" />
            <span className="text-xl font-black tracking-tight text-white">
              FoodCycle <span className="text-brand-400">AI</span>
            </span>
          </motion.div>
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Link to="/login" className="text-sm font-bold text-slate-300 hover:text-brand-400 transition-colors">
              Sign In
            </Link>
            <Link to="/login">
              <Button size="sm" icon={ArrowRight} className="rounded-full px-5 hidden sm:flex">
                Access Platform
              </Button>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-32 pb-32 px-4">
        <motion.div 
          className="max-w-5xl mx-auto w-full z-10 flex flex-col items-center text-center"
          style={{ y: yHero, opacity: opacityHero }}
        >
          {/* High-End Animated Circular AI Core Visualization */}
          <div className="relative w-80 h-80 mb-16">
            
             {/* Flowing Grid / Orbit Lines */}
             <motion.div 
               className="absolute inset-4 border border-slate-700/50 rounded-full"
               animate={{ rotate: 360 }}
               transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
             >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand-400 shadow-[0_0_12px_#34d399]" />
             </motion.div>
             <motion.div 
               className="absolute inset-10 border border-slate-700/30 rounded-full border-dashed"
               animate={{ rotate: -360 }}
               transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
             />

             {/* Central AI Core */}
             <div className="absolute inset-0 flex items-center justify-center z-20">
               <motion.div 
                 className="w-24 h-24 bg-slate-900/80 backdrop-blur-xl rounded-full shadow-[0_0_50px_rgba(16,185,129,0.2)] border border-brand-500/30 flex items-center justify-center p-4 relative z-10"
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 transition={{ duration: 1, type: 'spring' }}
               >
                 <Logo className="w-12 h-12 text-brand-400" animated />
               </motion.div>
               
               {/* Core Pulsing Ring */}
               <motion.div 
                 className="absolute inset-0 rounded-full border border-brand-500/40"
                 initial={{ scale: 0.5, opacity: 0 }}
                 animate={{ scale: 2, opacity: 0 }}
                 transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
               />
             </div>

             {/* Floating Nodes */}
             <div className="absolute inset-0 z-10">
               {orbitItems.map((item, i) => {
                 const pos = polarToCartesian(item.angle, 45); 
                 const IconEl = item.icon;
                 return (
                   <motion.div
                     key={i}
                     className="absolute w-12 h-12 -ml-6 -mt-6 group"
                     style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                     initial={{ scale: 0, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     transition={{ duration: 0.8, delay: 1 + item.delay, type: 'spring', bounce: 0.5 }}
                   >
                     {/* Node Pulse */}
                     <motion.div 
                       className="absolute inset-0 border border-white/20 rounded-full"
                       animate={{ scale: [1, 1.5, 1], opacity: [0, 0.3, 0] }}
                       transition={{ duration: 3, delay: item.delay, repeat: Infinity }}
                     />
                     
                     {/* Node Surface */}
                     <div className="w-full h-full rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700 p-0.5 shadow-2xl flex items-center justify-center relative overflow-hidden group-hover:border-brand-500/50 transition-colors">
                        <IconEl className="w-5 h-5 text-slate-400 group-hover:text-brand-400 transition-colors" />
                     </div>
                     
                     {/* Connecting Energy Line (Visual Hint) */}
                     <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" style={{ transform: 'scale(5)' }}>
                       <line x1="50%" y1="50%" x2="50%" y2="50%" stroke="rgba(16,185,129,0.3)" strokeWidth="0.5" strokeDasharray="2 2" />
                     </svg>
                   </motion.div>
                 );
               })}
             </div>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="flex flex-col items-center relative z-20"
          >
            <motion.div variants={staggerItem} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-900/30 text-brand-400 font-bold text-sm mb-8 border border-brand-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)] backdrop-blur-md">
              <Zap className="w-4 h-4" /> Advanced Resource Intelligence
            </motion.div>
            
            <motion.h1 variants={staggerItem} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-6 leading-[1.1] max-w-5xl">
              Turn Food Waste Into <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-emerald-300 to-accent-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                Intelligence.
              </span>
            </motion.h1>
            
            <motion.p variants={staggerItem} className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl font-medium leading-relaxed">
              Predict what to prepare. Optimize quantities. Predict waste. Recover resources. Build a sustainable food cycle.
            </motion.p>
            
            <motion.div variants={staggerItem} className="flex flex-col sm:flex-row gap-4">
              <Link to="/login">
                <Button size="lg" className="rounded-full px-8 shadow-2xl shadow-brand-500/20 h-14 text-base relative overflow-hidden group" icon={ArrowRight}>
                  <span className="relative z-10">Initialize Platform</span>
                  <motion.div 
                    className="absolute inset-0 bg-brand-600"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
                  />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">System Pipeline</span>
          <div className="w-px h-12 bg-gradient-to-b from-brand-500 to-transparent relative overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 w-full h-1/3 bg-white shadow-[0_0_10px_white]"
              animate={{ top: ['-30%', '130%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </motion.div>
      </section>

      {/* Visual Transformation Flow Section */}
      <section className="py-32 px-4 relative z-10 border-t border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-24"
          >
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-white drop-shadow-md">
              The Circular AI Pipeline
            </h2>
            <p className="text-slate-400 font-medium max-w-2xl mx-auto">
              Surplus doesn't become waste. It enters an intelligent evaluation loop.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8 relative">
             {/* Connecting Line behind cards */}
             <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-slate-800 via-brand-500/50 to-slate-800 -translate-y-1/2 -z-10" />

            {[
              { title: 'Detect', icon: Camera, desc: 'YOLOv8 instantly maps and classifies food components from imagery.', color: 'text-cyan-400' },
              { title: 'Analyze', icon: Database, desc: 'Extract nutritional (NPK) values and calculate carbon footprint.', color: 'text-violet-400' },
              { title: 'Predict', icon: BarChart3, desc: 'XGBoost models forecast future waste trends to optimize sourcing.', color: 'text-accent-400' },
              { title: 'Recover', icon: Recycle, desc: 'Explainable AI routes surplus to donation, biogas, or compost.', color: 'text-brand-400' },
            ].map((step, idx) => {
              const IconEl = step.icon;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="relative"
                >
                  <div className="bg-slate-950/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-800 shadow-2xl h-full flex flex-col group hover:border-brand-500/40 hover:bg-slate-900 transition-all duration-300">
                    <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-slate-800 transition-transform duration-300 border border-slate-700/50 shadow-inner">
                      <IconEl className={`w-8 h-8 ${step.color} drop-shadow-[0_0_8px_currentColor]`} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>
                  {/* Flow arrow (hide on last and mobile) */}
                  {idx < 3 && (
                    <div className="hidden md:flex absolute top-1/2 -right-6 -translate-y-1/2 text-slate-600 bg-slate-950 rounded-full w-8 h-8 items-center justify-center border border-slate-800 z-10 shadow-lg">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
