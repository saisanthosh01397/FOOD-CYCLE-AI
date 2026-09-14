import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  UploadCloud, Image as ImageIcon, Leaf, ShieldAlert, CheckCircle2,
  FlaskConical, Beaker, TestTube2, Wind, Scan, Zap, Brain, X
} from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import PageHeader from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUp, scaleIn, staggerContainer, staggerItem, resultReveal } from '../utils/animations';

// AI Scanning overlay shown while processing
function AIScanningOverlay() {
  return (
    <div className="absolute inset-0 z-20 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 rounded-xl">
      {/* Scan animation */}
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-2 border-brand-500/30 animate-ping" />
        <div className="absolute inset-2 rounded-full border-2 border-brand-500/50" style={{ animation: 'orbit-slow 3s linear infinite' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <Scan className="w-8 h-8 text-brand-400" style={{ animation: 'leaf-glow 1.5s ease-in-out infinite' }} />
        </div>
        {/* Scan sweep line */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <div
            className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-400 to-transparent"
            style={{ animation: 'scan-sweep 1.8s ease-in-out infinite' }}
          />
        </div>
      </div>
      <div className="text-center">
        <p className="text-brand-400 font-bold text-sm">YOLOv8 Analyzing...</p>
        <p className="text-slate-400 text-xs mt-1">Processing image with neural network</p>
      </div>
    </div>
  );
}

export default function VisionPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [quantity, setQuantity] = useState(5.0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const selected = acceptedFiles[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [] },
    maxSize: 10485760,
    multiple: false
  });

  const handleAnalyze = async () => {
    if (!file) {
      toast.error('Please upload an image first.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('quantity_kg', quantity);
    try {
      const response = await api.post('/vision/analyze-image', formData);
      setResult(response.data);
      toast.success('Analysis complete!');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Analysis failed. Please try again.');
    }
    setLoading(false);
  };

  const clearImage = (e) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <PageHeader
        title="AI Vision Analysis"
        description="Upload a food waste image. YOLOv8 will classify it and recommend the optimal recovery strategy."
      />

      <div className="grid lg:grid-cols-5 gap-6">

        {/* ===== LEFT: Upload & Controls ===== */}
        <div className="lg:col-span-2 space-y-5">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer min-h-[260px] flex flex-col items-center justify-center overflow-hidden
              ${isDragActive
                ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-500/10'
                : 'border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-700 bg-white dark:bg-slate-900/50'
              }`}
          >
            <input {...getInputProps()} />

            {/* AI scan overlay while loading */}
            <AnimatePresence>
              {loading && preview && <AIScanningOverlay />}
            </AnimatePresence>

            {preview ? (
              <>
                <img src={preview} alt="Preview" className="w-full h-full object-cover absolute inset-0 rounded-xl" />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                  <p className="text-white text-sm font-semibold flex items-center gap-2">
                    <UploadCloud className="w-4 h-4" /> Replace image
                  </p>
                </div>
                {/* Clear button */}
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg z-10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center text-center p-8"
              >
                <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center mb-4 text-brand-500">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">Drop image here</p>
                <p className="text-xs text-slate-500">or click to browse · JPG / PNG · max 10MB</p>
              </motion.div>
            )}
          </div>

          {/* Controls */}
          <Card className="p-5">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              Estimated Quantity
            </label>
            <div className="flex gap-3">
              <Input
                type="number"
                step="0.1"
                min="0.1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="kg"
              />
              <Button
                onClick={handleAnalyze}
                disabled={loading || !file}
                isLoading={loading}
                icon={loading ? Scan : Zap}
                className="shrink-0"
              >
                {loading ? 'Analyzing...' : 'Analyze'}
              </Button>
            </div>
          </Card>

          {/* How it works */}
          <Card className="p-5">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">How It Works</h3>
            <div className="space-y-3">
              {[
                { step: 1, icon: UploadCloud, label: 'Upload Image', desc: 'Photo of food waste' },
                { step: 2, icon: Brain, label: 'YOLOv8 Detection', desc: 'Object detection + classification' },
                { step: 3, icon: Leaf, label: 'Recovery AI', desc: 'Explainable recommendation' },
              ].map((s) => (
                <div key={s.step} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center shrink-0">
                    <s.icon className="w-4 h-4 text-brand-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{s.label}</p>
                    <p className="text-xs text-slate-500">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ===== RIGHT: Results ===== */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="empty"
                variants={scaleIn}
                initial="initial"
                animate="animate"
                exit="exit"
                className="h-full min-h-[500px] flex items-center justify-center"
              >
                <Card className="w-full h-full min-h-[500px] flex flex-col items-center justify-center p-10 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-5">
                    <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">Awaiting Image</h3>
                  <p className="text-sm text-slate-500 max-w-xs">
                    Upload an image to see YOLOv8 detection results and Explainable AI recovery recommendations.
                  </p>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                variants={fadeUp}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Card className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-6">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Analysis Results</h3>
                    </div>
                    <Badge variant="success" icon={CheckCircle2}>Complete</Badge>
                  </div>

                  <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="space-y-6"
                  >
                    {/* Annotated image */}
                    {result.annotated_image && (
                      <motion.div variants={staggerItem}>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">YOLOv8 Output</h4>
                        <div className="rounded-xl overflow-hidden border border-[var(--border)] shadow-sm">
                          <img
                            src={`/static/results/${result.annotated_image}`}
                            alt="Annotated"
                            className="w-full object-cover"
                          />
                        </div>
                      </motion.div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-5">
                      {/* Detections */}
                      <motion.div variants={staggerItem}>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Detected Objects</h4>
                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-[var(--border)] overflow-hidden">
                          {result.all_detections?.map((det, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.08 }}
                              className="flex items-center justify-between px-4 py-3 border-b last:border-b-0 border-[var(--border)]"
                            >
                              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                {det.food_category}
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                  <motion.div
                                    className="h-full bg-brand-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${det.confidence * 100}%` }}
                                    transition={{ delay: 0.3 + idx * 0.08, duration: 0.6 }}
                                  />
                                </div>
                                <Badge variant="primary">{(det.confidence * 100).toFixed(0)}%</Badge>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {/* Confidence bar */}
                        <div className="mt-4">
                          <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1.5">
                            <span>Model Confidence</span>
                            <span className="text-brand-600 dark:text-brand-400">{(result.confidence * 100).toFixed(1)}%</span>
                          </div>
                          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${result.confidence * 100}%` }}
                              transition={{ delay: 0.4, duration: 0.9, ease: 'easeOut' }}
                            />
                          </div>
                        </div>
                      </motion.div>

                      {/* Recovery recommendation */}
                      <motion.div variants={staggerItem}>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">AI Recovery Strategy</h4>
                        <div className="bg-brand-50 dark:bg-brand-950/30 rounded-xl p-5 border border-brand-200 dark:border-brand-900/50 h-full">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-7 h-7 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                              <Leaf className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                            </div>
                            <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">Primary Recommendation</span>
                          </div>
                          <p className="text-xl font-black text-slate-900 dark:text-white mb-4">
                            {result.recovery_recommendation || 'No recommendation'}
                          </p>
                          {result.explainable_ai_reason && (
                            <div className="bg-white/80 dark:bg-slate-900/60 rounded-xl p-3.5 border border-brand-200/50 dark:border-slate-800">
                              <div className="flex items-start gap-2">
                                <ShieldAlert className="w-4 h-4 text-accent-500 shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-xs font-bold text-slate-900 dark:text-white mb-1">XAI Reasoning (SHAP)</p>
                                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{result.explainable_ai_reason}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </div>

                    {/* Sustainability metrics */}
                    <motion.div variants={staggerItem}>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Estimated Output & Impact</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {result.npk_values && (
                          <>
                            <div className="text-center p-4 rounded-xl border border-[var(--border)] bg-slate-50 dark:bg-slate-900/40">
                              <FlaskConical className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                              <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Nitrogen</p>
                              <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{result.npk_values.nitrogen}</p>
                            </div>
                            <div className="text-center p-4 rounded-xl border border-[var(--border)] bg-slate-50 dark:bg-slate-900/40">
                              <Beaker className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                              <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Phosphorus</p>
                              <p className="text-lg font-black text-blue-600 dark:text-blue-400">{result.npk_values.phosphorus}</p>
                            </div>
                            <div className="text-center p-4 rounded-xl border border-[var(--border)] bg-slate-50 dark:bg-slate-900/40">
                              <TestTube2 className="w-5 h-5 text-amber-500 mx-auto mb-2" />
                              <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Potassium</p>
                              <p className="text-lg font-black text-amber-600 dark:text-amber-400">{result.npk_values.potassium}</p>
                            </div>
                          </>
                        )}
                        <div className="text-center p-4 rounded-xl border border-[var(--border)] bg-slate-50 dark:bg-slate-900/40">
                          <Wind className="w-5 h-5 text-purple-500 mx-auto mb-2" />
                          <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">CO₂ Saved</p>
                          <p className="text-lg font-black text-purple-600 dark:text-purple-400">{(quantity * 1.5).toFixed(1)} kg</p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
