import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Image as ImageIcon, Loader2, Leaf, ShieldAlert, CheckCircle2 } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

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
      setResult(null); // clear old result
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [] },
    maxSize: 10485760, // 10MB
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

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Vision Analysis</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Upload a photo of food waste. YOLOv8 will classify it and our AI will recommend the best recovery strategy.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'border-slate-300 dark:border-slate-700 hover:border-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-900'
            }`}
          >
            <input {...getInputProps()} />
            {preview ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-md">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <p className="text-white font-medium">Click or drag to change image</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-12">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 text-emerald-500">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <p className="font-medium text-lg">Drag & Drop your image here</p>
                <p className="text-sm text-slate-500 mt-2">Supports JPG, PNG up to 10MB</p>
              </div>
            )}
          </div>

          <div className="glass-card p-6">
            <label className="block text-sm font-medium mb-2">Estimated Quantity (kg)</label>
            <div className="flex gap-4">
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <button 
                onClick={handleAnalyze}
                disabled={loading || !file}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-xl flex items-center gap-2 transition-colors"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                Analyze Image
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="glass-card p-6 md:p-8 flex flex-col min-h-[500px]">
          {!result ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <ImageIcon className="w-16 h-16 opacity-20 mb-4" />
              <p>Upload an image to see YOLOv8 detection results.</p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1 flex flex-col">
              <div className="flex items-center justify-between border-b dark:border-slate-800 pb-4 mb-6">
                <h3 className="text-xl font-bold">Analysis Results</h3>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Success
                </span>
              </div>

              <div className="space-y-6 flex-1">
                {/* Visual Confidence */}
                <div>
                  <div className="flex justify-between text-sm font-medium mb-1">
                    <span className="text-slate-500">Detected Category</span>
                    <span className="font-bold">{result.detected_category}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2 mt-4">
                    <span className="text-slate-500">YOLO Confidence</span>
                    <span className="text-emerald-500 font-bold">{(result.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${result.confidence * 100}%` }}
                    />
                  </div>
                </div>

                {/* Recommendation */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border dark:border-slate-700">
                  <h4 className="flex items-center gap-2 font-semibold mb-3">
                    <Leaf className="w-5 h-5 text-emerald-500" />
                    Recovery Recommendation
                  </h4>
                  <p className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                    {result.recovery_recommendation || 'No recommendation available'}
                  </p>
                  
                  {result.explainable_ai_reason && (
                    <div className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-4 rounded-lg border dark:border-slate-800">
                      <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white block mb-1">AI Reasoning (SHAP)</span>
                        {result.explainable_ai_reason}
                      </div>
                    </div>
                  )}
                </div>

                {/* NPK Output (if available) */}
                {result.npk_values && (
                  <div>
                    <h4 className="font-semibold mb-3">Estimated Resource Output</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-3 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-900">
                        <div className="text-xs text-slate-500 mb-1">Nitrogen (N)</div>
                        <div className="font-bold">{result.npk_values.N}</div>
                      </div>
                      <div className="text-center p-3 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-900">
                        <div className="text-xs text-slate-500 mb-1">Phosphorus (P)</div>
                        <div className="font-bold">{result.npk_values.P}</div>
                      </div>
                      <div className="text-center p-3 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-900">
                        <div className="text-xs text-slate-500 mb-1">Potassium (K)</div>
                        <div className="font-bold">{result.npk_values.K}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
