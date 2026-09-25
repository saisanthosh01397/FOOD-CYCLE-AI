import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  UploadCloud, Image as ImageIcon, Leaf, ShieldAlert, CheckCircle2,
  FlaskConical, Beaker, TestTube2, Wind, Scan, Brain, X, ArrowRight,
  Crosshair, Focus, Sparkles, Recycle, Activity
} from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import { pageForwardSlide, staggerContainer, staggerItem } from '../utils/animations';

// =====================================================
// AI SCANNING OVERLAY (Cinematic)
// =====================================================
function AIScanningOverlay() {
  return (
    <motion.div 
      className="absolute inset-0 z-30 bg-[var(--surface)]/90 backdrop-blur-md flex flex-col items-center justify-center gap-6 rounded-3xl overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background grid scanning */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{ backgroundImage: `linear-gradient(var(--color-brand-500) 1px, transparent 1px)`, backgroundSize: '100% 4px' }}
      >
        <motion.div 
          className="w-full h-full bg-gradient-to-b from-transparent via-brand-500 to-transparent opacity-50"
          animate={{ y: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="relative z-10 w-32 h-32 flex items-center justify-center">
        <motion.div 
          className="absolute inset-0 rounded-full border border-brand-500/50 border-dashed"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div 
          className="absolute inset-4 rounded-full border border-accent-500/50"
          animate={{ rotate: -360, scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <Scan className="w-10 h-10 text-brand-400" />
      </div>

      <div className="relative z-10 text-center">
        <motion.p 
          className="text-brand-400 font-black text-lg tracking-widest uppercase mb-1"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          YOLOv8 Processing
        </motion.p>
        <p className="text-[var(--text-muted)] font-medium text-sm">Extracting spatial features & classification data...</p>
      </div>
    </motion.div>
  );
}

// =====================================================
// BOUNDING BOX RENDERING
// =====================================================
const BoundingBox = ({ detection, index }) => {
  const { bbox, raw_class, confidence, approximate_mapping } = detection;
  
  if (!bbox || bbox.length !== 4) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 + index * 0.15, type: 'spring' }}
      className="absolute border-2 border-brand-400 bg-brand-400/10 backdrop-blur-[1px] pointer-events-none group shadow-[0_0_15px_rgba(52,211,153,0.3)]"
      style={{
        left: `${bbox[0]}px`,
        top: `${bbox[1]}px`,
        width: `${bbox[2] - bbox[0]}px`,
        height: `${bbox[3] - bbox[1]}px`,
      }}
    >
      <div className="absolute -top-6 -left-0.5 bg-brand-400 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-t-sm whitespace-nowrap shadow-lg flex items-center gap-1">
        <Focus className="w-3 h-3" />
        <span className="uppercase">{raw_class || 'Unknown'}</span>
        <span className="bg-slate-900/10 px-1 rounded-sm">{(confidence * 100).toFixed(0)}%</span>
      </div>
      
      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-brand-300" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-brand-300" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-brand-300" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-brand-300" />
    </motion.div>
  );
};

// =====================================================
// MAIN VISION PAGE COMPONENT
// =====================================================
export default function VisionPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [quantity, setQuantity] = useState(5.0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const selected = acceptedFiles[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
      setErrorMsg(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/jpeg': [], 'image/png': [] }, maxSize: 10485760, multiple: false
  });

  const handleAnalyze = async () => {
    if (!file) { toast.error('Upload an image first.'); return; }
    setLoading(true);
    setErrorMsg(null);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('quantity_kg', quantity);
    try {
      const response = await api.post('/vision/analyze-image', formData);
      setResult(response.data);
      if (response.data.error) {
        toast.error('Food category not recognized.');
      } else {
        toast.success('YOLOv8 Analysis Complete');
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.detail || error.response?.data?.message || error.message || 'Vision analysis failed.');
      toast.error('Analysis failed.');
    }
    setLoading(false);
  };

  const clearImage = (e) => {
    e.stopPropagation(); setFile(null); setPreview(null); setResult(null); setErrorMsg(null);
  };

  return (
    <motion.div variants={pageForwardSlide} initial="initial" animate="animate" exit="exit" className="max-w-[1600px] mx-auto h-[calc(100vh-100px)] flex flex-col">
      <div className="mb-6 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-3">
            <Scan className="w-8 h-8 text-brand-500" /> AI Vision Lab
          </h1>
          <p className="text-[var(--text-muted)] font-medium mt-1">Computer vision workspace for food classification and spatial analysis.</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* ===================================== */}
        {/* LEFT / CENTER: WORKSPACE */}
        {/* ===================================== */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <Card className="flex-1 relative overflow-hidden bg-slate-950 border-[var(--border)] p-2 rounded-3xl flex flex-col group shadow-2xl">
            {/* Cinematic Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-900/20 via-slate-950 to-slate-950 pointer-events-none" />
            
            <AnimatePresence>
              {loading && <AIScanningOverlay />}
            </AnimatePresence>

            {preview ? (
              <div className="relative w-full h-full flex items-center justify-center bg-slate-900/50 rounded-2xl overflow-hidden border border-white/5">
                <button onClick={clearImage} className="absolute top-4 right-4 z-40 p-2 bg-slate-900/80 hover:bg-rose-500/20 text-[var(--text-muted)] hover:text-rose-400 rounded-full backdrop-blur-md border border-white/10 transition-colors">
                  <X className="w-5 h-5" />
                </button>
                
                <div className="relative inline-block shadow-2xl">
                  <img src={preview} alt="Upload preview" className="max-w-full max-h-[calc(100vh-250px)] object-contain rounded-lg" />
                  
                  {/* Render Bounding Boxes */}
                  {result && result.all_detections && result.all_detections.map((det, idx) => (
                    <BoundingBox key={idx} detection={det} index={idx} />
                  ))}
                  
                  {/* Scanner line that passes over once image loads */}
                  {!result && !loading && (
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-500/20 to-transparent"
                      initial={{ y: '-100%' }}
                      animate={{ y: '100%' }}
                      transition={{ duration: 2, ease: "linear" }}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div {...getRootProps()} className={`relative w-full h-full flex items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 ${isDragActive ? 'border-brand-500 bg-brand-500/5' : 'border-slate-800 hover:border-slate-700 bg-slate-900/30'}`}>
                <input {...getInputProps()} />
                <div className="text-center p-8 max-w-sm">
                  <motion.div 
                    className="w-20 h-20 mx-auto rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center mb-6 shadow-xl"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Crosshair className="w-8 h-8 text-brand-400" />
                  </motion.div>
                  <p className="text-lg font-bold text-white mb-2">Initialize Vision Scan</p>
                  <p className="text-sm text-[var(--text-muted)]">Drag & drop a food waste image, or click to browse. Max 10MB.</p>
                </div>
              </div>
            )}
          </Card>

          {/* Action Bar */}
          <Card className="p-4 rounded-3xl shrink-0 flex items-center justify-between gap-4 border-[var(--border)] bg-[var(--surface)]">
            <div className="flex-1 max-w-xs">
              <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Batch Weight (kg)</label>
              <Input type="number" min="0.1" step="0.1" value={quantity} onChange={(e) => setQuantity(e.target.value)} disabled={loading} className="h-10 bg-[var(--surface-hover)]" />
            </div>
            <Button size="lg" className="rounded-2xl px-8 h-12 shadow-xl shadow-brand-500/20 text-base" onClick={handleAnalyze} isLoading={loading} disabled={!file} icon={Brain}>
              Execute Analysis
            </Button>
          </Card>
        </div>

        {/* ===================================== */}
        {/* RIGHT: AI INTELLIGENCE PANEL */}
        {/* ===================================== */}
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence mode="wait">
            {errorMsg ? (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center text-center p-8 border border-red-500/30 rounded-3xl bg-red-500/5">
                <ShieldAlert className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="font-bold text-red-500 mb-2">Analysis Failed</h3>
                <p className="text-sm font-medium text-red-400 mb-6">{errorMsg}</p>
                <Button variant="outline" size="sm" className="border-red-500/50 text-red-500 hover:bg-red-500/10" onClick={() => setErrorMsg(null)}>Dismiss</Button>
              </motion.div>
            ) : !result ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-[var(--border)] rounded-3xl bg-[var(--surface)] opacity-50">
                <Brain className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-4" />
                <p className="font-bold text-[var(--text-muted)]">Awaiting Image Data</p>
                <p className="text-xs text-[var(--text-muted)] mt-2">Results, XAI confidence, and NPK metrics will appear here.</p>
              </motion.div>
            ) : result.error ? (
              <motion.div key="unrecognized" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center text-center p-8 border border-amber-500/30 rounded-3xl bg-amber-500/5">
                <ShieldAlert className="w-12 h-12 text-amber-500 mb-4" />
                <h3 className="font-bold text-amber-500 mb-2">Recognition Limitation</h3>
                <p className="text-sm font-medium text-amber-400 mb-6">{result.error}</p>
              </motion.div>
            ) : (
              <motion.div key="results" variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
                
                {/* 1. Detection Summary */}
                <motion.div variants={staggerItem}>
                  <Card className="p-5 rounded-3xl overflow-hidden relative border-brand-500/30">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-brand-500/20 text-brand-400 rounded-xl"><Sparkles className="w-5 h-5" /></div>
                      <div>
                        <h3 className="font-bold text-[var(--text-primary)] uppercase tracking-wider text-xs">Primary Classification</h3>
                        <p className="text-2xl font-black text-brand-600 dark:text-brand-400 capitalize">{result.detected_category}</p>
                      </div>
                    </div>
                    {result.all_detections?.length > 0 ? (
                      <div className="flex gap-2 flex-wrap mt-4 pt-4 border-t border-[var(--border)]">
                        {result.all_detections.map((d, i) => (
                          <Badge key={i} variant="primary" className="text-xs py-1 px-3 border border-brand-500/30">
                            {d.raw_class} <span className="opacity-60 ml-1">{(d.confidence*100).toFixed(0)}%</span>
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-4 pt-4 border-t border-[var(--border)] text-sm font-bold text-amber-500 text-center">
                        No recognized food objects detected.
                      </div>
                    )}
                  </Card>
                </motion.div>
                
                {/* 2. Intelligent Routing (Recovery) */}
                <motion.div variants={staggerItem}>
                  <Card className="p-5 rounded-3xl border-[var(--border)]">
                    <h3 className="font-bold text-[var(--text-muted)] uppercase tracking-widest text-[10px] mb-4 flex items-center gap-2">
                      <ArrowRight className="w-3 h-3" /> Recommended Pathway
                    </h3>
                    <div className="flex items-center justify-between p-4 bg-[var(--surface-hover)] rounded-2xl border border-[var(--border)]">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${result.recovery_recommendation === 'Donation' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-accent-500/20 text-accent-500'}`}>
                          {result.recovery_recommendation === 'Donation' ? <Leaf className="w-6 h-6" /> : <Recycle className="w-6 h-6" />}
                        </div>
                        <div>
                          <p className="font-black text-[var(--text-primary)]">{result.recovery_recommendation}</p>
                          <p className="text-xs font-medium text-[var(--text-muted)] mt-0.5">Route to facility</p>
                        </div>
                      </div>
                      <Badge variant="success">Optimal</Badge>
                    </div>
                  </Card>
                </motion.div>

                {/* 3. NPK / Impact */}
                <motion.div variants={staggerItem}>
                  <Card className="p-5 rounded-3xl border-[var(--border)]">
                    <h3 className="font-bold text-[var(--text-muted)] uppercase tracking-widest text-[10px] mb-4 flex items-center gap-2">
                      <TestTube2 className="w-3 h-3" /> Nutrient & Impact Analysis
                    </h3>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-3 rounded-2xl bg-[var(--surface-hover)] border border-[var(--border)] text-center">
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Nitrogen (N)</p>
                        <p className="text-lg font-black text-[var(--text-primary)]">{result.npk_values?.nitrogen?.toFixed(2) || 0}g</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-[var(--surface-hover)] border border-[var(--border)] text-center">
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Phosphorus (P)</p>
                        <p className="text-lg font-black text-[var(--text-primary)]">{result.npk_values?.phosphorus?.toFixed(2) || 0}g</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-[var(--surface-hover)] border border-[var(--border)] text-center">
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Potassium (K)</p>
                        <p className="text-lg font-black text-[var(--text-primary)]">{result.npk_values?.potassium?.toFixed(2) || 0}g</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-[var(--surface-hover)] border border-[var(--border)] flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-[var(--text-primary)]">
                        <Brain className="w-4 h-4 text-brand-500" />
                        <span className="font-bold text-[10px] uppercase tracking-widest text-[var(--text-muted)]">XAI Reasoning</span>
                      </div>
                      <span className="font-medium text-sm text-[var(--text-secondary)] leading-relaxed">{result.explainable_ai_reason || "AI reasoned this based on standard food waste profiles."}</span>
                    </div>
                  </Card>
                </motion.div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </motion.div>
  );
}
