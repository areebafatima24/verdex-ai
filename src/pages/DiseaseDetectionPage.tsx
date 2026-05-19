import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload, Cpu, AlertTriangle, CheckCircle, Info,
  ChevronDown, ChevronUp, Shield, FlaskConical, Leaf, X,
  Thermometer, Activity, Clock, Eye, Droplets
} from 'lucide-react';
import type { DiseaseResult } from '../types';

interface ExtendedDiseaseResult extends DiseaseResult {
  cropHealthScore: number;
  environmentalRisk: number;
  weatherRisk: string;
  sustainabilityImpact: string;
  irrigationSuggestion: string;
  treatmentTimeline: { step: string; time: string; desc: string }[];
  diseaseProbability: { name: string; prob: number }[];
}

const mockDiseases: Record<string, ExtendedDiseaseResult> = {
  default: {
    name: 'Early Blight (Alternaria solani)', confidence: 94.2, severity: 'moderate',
    causes: ['Fungal pathogen Alternaria solani', 'High humidity (above 80%) combined with warm temperatures (25-30°C)', 'Poor air circulation between plants', 'Infected crop debris left in the field from previous season'],
    treatments: ['Apply chlorothalonil or mancozeb fungicide every 7-10 days', 'Remove and destroy infected leaves immediately', 'Use copper-based fungicides (Bordeaux mixture) as organic alternative', 'Improve drainage and reduce overhead irrigation'],
    prevention: ['Use certified disease-free seeds and transplants', 'Rotate crops — avoid solanaceous crops in same field for 2+ years', 'Maintain proper plant spacing (60cm) for air circulation', 'Apply organic mulch to prevent soil-splash infection'],
    cropHealthScore: 58, environmentalRisk: 42,
    weatherRisk: 'High humidity (78%) increases fungal spread risk. Rain expected Tuesday — delay any spraying to avoid washout.',
    sustainabilityImpact: 'Chemical treatment may reduce soil microbiome diversity by 15-20%. Consider organic copper alternatives to minimize environmental impact.',
    irrigationSuggestion: 'Reduce overhead irrigation to lower leaf wetness. Switch to drip irrigation at base of plants. Water early morning only.',
    treatmentTimeline: [
      { step: '1', time: 'Immediate', desc: 'Remove and destroy all visibly infected leaves and stems' },
      { step: '2', time: 'Within 24h', desc: 'Apply first fungicide treatment — chlorothalonil or copper-based' },
      { step: '3', time: 'Day 3-5', desc: 'Improve field drainage and increase plant spacing for airflow' },
      { step: '4', time: 'Day 7-10', desc: 'Second fungicide application if symptoms persist' },
      { step: '5', time: 'Ongoing', desc: 'Weekly monitoring and preventive spray schedule through season' },
    ],
    diseaseProbability: [
      { name: 'Early Blight', prob: 94.2 }, { name: 'Septoria Leaf Spot', prob: 12.4 }, { name: 'Bacterial Speck', prob: 5.1 }, { name: 'Healthy', prob: 2.8 },
    ],
  },
  healthy: {
    name: 'No Disease Detected — Healthy Plant', confidence: 97.8, severity: 'low',
    causes: ['Plant appears healthy with no visible signs of pathogen activity'],
    treatments: ['No treatment required — maintain current care routine'],
    prevention: ['Continue regular monitoring every 7 days', 'Maintain optimal soil nutrition and pH levels (6.0-6.8)', 'Keep irrigation consistent and well-drained'],
    cropHealthScore: 94, environmentalRisk: 8,
    weatherRisk: 'Current conditions favorable. Monitor humidity levels during upcoming rain period.',
    sustainabilityImpact: 'No chemical intervention needed. Maintain organic practices for continued soil health.',
    irrigationSuggestion: 'Continue current irrigation schedule. Maintain consistent soil moisture at 60-70% field capacity.',
    treatmentTimeline: [
      { step: '1', time: 'Ongoing', desc: 'Continue regular crop monitoring schedule (every 7 days)' },
      { step: '2', time: 'Weekly', desc: 'Check for early signs of stress, nutrient deficiency, or disease' },
      { step: '3', time: 'Monthly', desc: 'Soil testing and nutrient assessment for optimal growth' },
    ],
    diseaseProbability: [
      { name: 'Healthy', prob: 97.8 }, { name: 'Mild Stress', prob: 4.5 }, { name: 'Early Blight', prob: 1.2 },
    ],
  },
  severe: {
    name: 'Late Blight (Phytophthora infestans)', confidence: 91.5, severity: 'severe',
    causes: ['Oomycete pathogen Phytophthora infestans', 'Cool, wet conditions (15-22°C with high moisture)', 'Spores spread rapidly via wind and water splash', 'Overcrowded planting with poor drainage'],
    treatments: ['URGENT: Apply systemic fungicide (metalaxyl + mancozeb) immediately', 'Destroy all severely infected plants to prevent spread', 'Avoid overhead irrigation — switch to drip systems', 'Apply preventive treatments to neighboring healthy plants within 10m radius'],
    prevention: ['Use resistant varieties when available', 'Ensure proper field drainage and plant spacing', 'Monitor weather forecasts for cool, wet periods', 'Destroy volunteer plants and crop debris after harvest'],
    cropHealthScore: 22, environmentalRisk: 78,
    weatherRisk: 'CRITICAL: Cool wet conditions forecast (18°C, rain). High risk of rapid spore spread. Act within 24 hours to contain outbreak.',
    sustainabilityImpact: 'Severe chemical intervention required. Soil remediation with organic compost recommended post-harvest. Avoid planting susceptible crops for 2 seasons.',
    irrigationSuggestion: 'STOP all overhead irrigation immediately. Switch to drip only. Avoid any leaf wetting. Reduce irrigation frequency to every 3-4 days.',
    treatmentTimeline: [
      { step: '1', time: 'URGENT', desc: 'Remove and destroy all severely infected plants immediately' },
      { step: '2', time: 'Within 6h', desc: 'Apply systemic fungicide to all remaining plants' },
      { step: '3', time: 'Day 2', desc: 'Treat neighboring fields preventively within 10m radius' },
      { step: '4', time: 'Day 5-7', desc: 'Second fungicide application — assess spread' },
      { step: '5', time: 'Day 14', desc: 'Full field assessment — consider crop removal if uncontrolled' },
    ],
    diseaseProbability: [
      { name: 'Late Blight', prob: 91.5 }, { name: 'Early Blight', prob: 28.3 }, { name: 'Septoria', prob: 15.7 }, { name: 'Healthy', prob: 0.8 },
    ],
  },
};

const severityConfig = {
  low: { label: 'Low Severity', color: 'text-[#05cd99]', bg: 'bg-[rgba(5,205,153,0.06)] border-[rgba(5,205,153,0.18)]', bar: 'bg-[#05cd99]', dot: 'bg-[#05cd99]' },
  moderate: { label: 'Moderate Severity', color: 'text-amber-400', bg: 'bg-amber-500/6 border-amber-500/18', bar: 'bg-amber-500', dot: 'bg-amber-400' },
  severe: { label: 'Severe Infection', color: 'text-red-400', bg: 'bg-red-500/6 border-red-500/18', bar: 'bg-red-500', dot: 'bg-red-400' },
};

type ScanPhase = 'idle' | 'uploading' | 'scanning' | 'analyzing' | 'complete';

const analysisMessages = [
  'Initializing computer vision model...',
  'Preprocessing image — normalizing exposure...',
  'Analyzing crop texture and color signatures...',
  'Detecting leaf patterns and surface anomalies...',
  'Detecting fungal infection markers...',
  'Running disease classification model v3.2...',
  'Comparing agricultural disease database...',
  'Calculating environmental impact...',
  'Generating AI sustainability recommendations...',
  'Compiling comprehensive analysis report...',
];

export default function DiseaseDetectionPage() {
  const [image, setImage] = useState<string | null>(null);
  const [phase, setPhase] = useState<ScanPhase>('idle');
  const [result, setResult] = useState<ExtendedDiseaseResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('treatments');
  const [scanProgress, setScanProgress] = useState(0);
  const [analysisMsg, setAnalysisMsg] = useState('');
  const [analysisMsgIndex, setAnalysisMsgIndex] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const msgTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAnalysis = useCallback((diseaseKey: string) => {
    setResult(null); setPhase('uploading'); setScanProgress(0); setAnalysisMsgIndex(0);
    setTimeout(() => {
      setPhase('scanning');
      let progress = 0;
      const scanInterval = setInterval(() => {
        progress += 2; setScanProgress(Math.min(progress, 100));
        if (progress >= 100) {
          clearInterval(scanInterval); setPhase('analyzing');
          let msgIdx = 0; setAnalysisMsg(analysisMessages[0]);
          msgTimerRef.current = setInterval(() => {
            msgIdx++;
            if (msgIdx < analysisMessages.length) { setAnalysisMsg(analysisMessages[msgIdx]); setAnalysisMsgIndex(msgIdx); }
            else { if (msgTimerRef.current) clearInterval(msgTimerRef.current); setResult(mockDiseases[diseaseKey as keyof typeof mockDiseases]); setPhase('complete'); }
          }, 450);
        }
      }, 35);
    }, 600);
  }, []);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file); setImage(url);
    const rand = Math.random(); startAnalysis(rand > 0.7 ? 'healthy' : rand > 0.3 ? 'default' : 'severe');
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setDragOver(false); const file = e.dataTransfer.files[0]; if (file) handleFile(file); };
  const reset = () => { setImage(null); setResult(null); setPhase('idle'); setScanProgress(0); setAnalysisMsg(''); setAnalysisMsgIndex(0); if (msgTimerRef.current) clearInterval(msgTimerRef.current); };
  const toggleSection = (s: string) => setExpandedSection(prev => prev === s ? null : s);
  const sev = result ? severityConfig[result.severity] : null;

  useEffect(() => { return () => { if (msgTimerRef.current) clearInterval(msgTimerRef.current); }; }, []);

  return (
    <div className="min-h-screen pt-16 px-4 sm:px-6 lg:px-8 pb-16">
      <div className="max-w-6xl mx-auto">
        <div className="py-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(5,205,153,0.05)] border border-[rgba(5,205,153,0.15)] text-[#05cd99] text-sm mb-4"><Cpu className="w-4 h-4" /> Computer Vision AI</div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 font-display">AI Plant Disease Detection</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Upload a crop or leaf image for instant AI analysis — disease identification, severity scoring, and actionable treatment plans.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Panel */}
          <div className="space-y-4">
            <div className={`glass-card p-6 border-2 border-dashed transition-all duration-300 cursor-pointer relative overflow-hidden ${dragOver ? 'border-[rgba(5,205,153,0.45)] bg-[rgba(5,205,153,0.04)]' : 'border-gray-700/40 hover:border-[rgba(5,205,153,0.2)]'}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop} onClick={() => !image && fileRef.current?.click()}>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
              {image ? (
                <div className="relative">
                  <img src={image} alt="Uploaded crop" className="w-full h-64 sm:h-72 object-cover rounded-xl" />
                  {(phase === 'scanning' || phase === 'analyzing') && (
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <div className="absolute inset-0 bg-[rgba(5,205,153,0.04)]" />
                      <div className="scan-line" /><div className="scan-line-reverse" style={{ animationDelay: '0.5s' }} />
                      {[['top-3 left-3', 'border-t-2 border-l-2'], ['top-3 right-3', 'border-t-2 border-r-2'], ['bottom-3 left-3', 'border-b-2 border-l-2'], ['bottom-3 right-3', 'border-b-2 border-r-2']].map(([pos, border], i) => (
                        <div key={i} className={`absolute ${pos} w-8 h-8 ${border} border-[#05cd99]/70`} />
                      ))}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="relative w-20 h-20 mx-auto mb-3">
                            <div className="absolute inset-0 rounded-full border-2 border-[rgba(5,205,153,0.15)] animate-pulse-ring" />
                            <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-pulse-ring" style={{ animationDelay: '0.6s' }} />
                            <div className="w-20 h-20 rounded-full border-2 border-[#05cd99]/40 flex items-center justify-center bg-[rgba(5,205,153,0.08)] backdrop-blur-sm">
                              <Cpu className="w-8 h-8 text-[#05cd99] animate-pulse" />
                            </div>
                          </div>
                          <div className="text-[#05cd99] text-sm font-mono font-semibold tracking-wider">{phase === 'scanning' ? 'SCANNING' : 'ANALYZING'}</div>
                          {phase === 'analyzing' && analysisMsg && <div className="text-gray-400 text-xs mt-2 max-w-52 animate-fadeIn" key={analysisMsgIndex}>{analysisMsg}</div>}
                        </div>
                      </div>
                    </div>
                  )}
                  {phase === 'scanning' && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-gray-950/90 to-transparent">
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5"><span>AI Scan Progress</span><span className="text-[#05cd99] font-mono font-semibold">{scanProgress}%</span></div>
                      <div className="h-1.5 rounded-full bg-gray-800/80 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-[#05cd99] to-cyan-500 transition-all duration-100 animate-glow-pulse" style={{ width: `${scanProgress}%` }} /></div>
                    </div>
                  )}
                  {phase === 'complete' && <button onClick={(e) => { e.stopPropagation(); reset(); }} className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-gray-900/80 border border-gray-700/50 flex items-center justify-center hover:bg-red-500/12 hover:border-red-500/25 transition-all"><X className="w-4 h-4 text-gray-300" /></button>}
                </div>
              ) : (
                <div className="text-center py-14">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[rgba(5,205,153,0.1)] to-cyan-500/10 border border-[rgba(5,205,153,0.1)] flex items-center justify-center mx-auto mb-5 animate-glow-pulse"><Upload className="w-9 h-9 text-[#05cd99]" /></div>
                  <h3 className="text-white font-semibold text-lg mb-2 font-display">Upload Crop Image</h3>
                  <p className="text-gray-400 text-sm mb-4">Drag & drop or click to select</p>
                  <div className="text-xs text-gray-600 mb-5">Supports JPG, PNG, WEBP up to 10MB</div>
                  <div className="flex flex-wrap gap-2 justify-center">{['Tomato leaf', 'Wheat crop', 'Rice paddy', 'Cotton plant'].map(tag => <span key={tag} className="px-2.5 py-1 rounded-lg bg-gray-800/40 text-gray-500 text-xs">{tag}</span>)}</div>
                </div>
              )}
            </div>

            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3"><Eye className="w-4 h-4 text-cyan-400" /><span className="text-cyan-400 text-sm font-medium">Quick Test Images</span></div>
              <p className="text-gray-500 text-xs mb-3">Try with these agricultural scenarios:</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Tomato Blight', src: 'https://images.pexels.com/photos/1382394/pexels-photo-1382394.jpeg?w=300', key: 'default' },
                  { label: 'Healthy Crop', src: 'https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=300', key: 'healthy' },
                  { label: 'Late Blight', src: 'https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg?w=300', key: 'severe' },
                  { label: 'Rice Paddy', src: 'https://images.pexels.com/photos/2252603/pexels-photo-2252603.jpeg?w=300', key: 'default' },
                ].map(sample => (
                  <button key={sample.label} onClick={() => { setImage(sample.src); startAnalysis(sample.key); }} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-800/25 hover:bg-[rgba(5,205,153,0.04)] hover:border-[rgba(5,205,153,0.15)] border border-transparent transition-all text-left">
                    <img src={sample.src} alt={sample.label} className="w-11 h-11 rounded-lg object-cover" /><span className="text-gray-300 text-xs font-medium">{sample.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-4">
            {phase === 'idle' && (
              <div className="glass-card p-10 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-20 h-20 rounded-2xl bg-gray-800/25 flex items-center justify-center mb-5"><Leaf className="w-10 h-10 text-gray-600" /></div>
                <h3 className="text-gray-400 font-medium mb-2 font-display text-lg">Awaiting Analysis</h3>
                <p className="text-gray-600 text-sm max-w-xs">Upload a crop image to activate AI-powered disease detection and receive a comprehensive analysis report.</p>
              </div>
            )}

            {(phase === 'uploading' || phase === 'scanning' || phase === 'analyzing') && (
              <div className="glass-card p-10 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="relative w-28 h-28 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full border-2 border-[rgba(5,205,153,0.12)] animate-pulse-ring" />
                  <div className="absolute inset-0 rounded-full border-2 border-cyan-500/15 animate-pulse-ring" style={{ animationDelay: '0.7s' }} />
                  <div className="absolute inset-2 rounded-full border border-[rgba(5,205,153,0.08)] animate-rotate-slow" />
                  <div className="w-28 h-28 rounded-full border-2 border-[#05cd99]/25 flex items-center justify-center bg-[rgba(5,205,153,0.04)]"><Cpu className="w-12 h-12 text-[#05cd99] animate-pulse" /></div>
                </div>
                <h3 className="text-[#05cd99] font-semibold mb-2 font-display text-lg">{phase === 'uploading' ? 'Preparing Image...' : phase === 'scanning' ? 'AI Scanning in Progress' : 'Deep Analysis Running'}</h3>
                {phase === 'analyzing' && analysisMsg && <p className="text-gray-400 text-sm animate-fadeIn max-w-xs mb-2" key={analysisMsgIndex}>{analysisMsg}</p>}
                <div className="flex gap-1.5 justify-center mt-3"><span className="w-2 h-2 rounded-full bg-[#05cd99] typing-dot" /><span className="w-2 h-2 rounded-full bg-[#05cd99] typing-dot" /><span className="w-2 h-2 rounded-full bg-[#05cd99] typing-dot" /></div>
                {phase === 'scanning' && <div className="w-48 mt-4"><div className="h-1 rounded-full bg-gray-800 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-[#05cd99] to-cyan-500 transition-all" style={{ width: `${scanProgress}%` }} /></div></div>}
              </div>
            )}

            {phase === 'complete' && result && sev && (
              <>
                <div className={`glass-card p-5 border ${sev.bg} animate-fadeInUp`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 mr-4">
                      <div className="flex items-center gap-2 mb-1.5"><div className={`w-2.5 h-2.5 rounded-full ${sev.dot} animate-pulse`} /><span className={`text-xs font-semibold uppercase tracking-wider ${sev.color}`}>{sev.label}</span></div>
                      <h3 className="text-white font-bold text-xl font-display">{result.name}</h3>
                    </div>
                    <div className="text-right shrink-0"><div className="text-3xl font-bold text-white">{result.confidence}%</div><div className="text-xs text-gray-500">AI Confidence</div></div>
                  </div>
                  <div className="mb-4"><div className="h-2.5 rounded-full bg-gray-800/80 overflow-hidden"><div className={`h-full rounded-full ${sev.bar} transition-all duration-1000`} style={{ width: `${result.confidence}%` }} /></div></div>
                  <div className="grid grid-cols-3 gap-2">
                    {(['low', 'moderate', 'severe'] as const).map(level => {
                      const cfg = severityConfig[level]; const isActive = result.severity === level;
                      return <div key={level} className={`p-2.5 rounded-xl text-center border transition-all ${isActive ? cfg.bg : 'bg-gray-800/15 border-gray-700/25'}`}><div className={`text-xs font-medium ${isActive ? cfg.color : 'text-gray-600'}`}>{level.charAt(0).toUpperCase() + level.slice(1)}</div></div>;
                    })}
                  </div>
                </div>

                <div className="glass-card p-5 animate-fadeInUp" style={{ animationDelay: '0.05s' }}>
                  <h4 className="text-white font-medium text-sm mb-3 flex items-center gap-2 font-display"><Activity className="w-4 h-4 text-cyan-400" />Disease Probability</h4>
                  <div className="space-y-2.5">
                    {result.diseaseProbability.map((d, i) => (
                      <div key={d.name} className="flex items-center gap-3">
                        <div className="w-24 text-xs text-gray-400 truncate">{d.name}</div>
                        <div className="flex-1 h-2 rounded-full bg-gray-800/80 overflow-hidden"><div className={`h-full rounded-full transition-all duration-1000 ${i === 0 ? 'bg-gradient-to-r from-[#05cd99] to-cyan-500' : 'bg-gray-600/40'}`} style={{ width: `${d.prob}%` }} /></div>
                        <div className={`text-xs font-mono w-12 text-right ${i === 0 ? 'text-[#05cd99]' : 'text-gray-500'}`}>{d.prob}%</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                  <div className="glass-card p-4">
                    <div className="flex items-center gap-2 mb-2"><Activity className="w-4 h-4 text-[#05cd99]" /><span className="text-gray-400 text-xs">Crop Health Score</span></div>
                    <div className="text-3xl font-bold text-white mb-2 font-display">{result.cropHealthScore}</div>
                    <div className="h-1.5 rounded-full bg-gray-800/80 overflow-hidden"><div className={`h-full rounded-full ${result.cropHealthScore >= 70 ? 'bg-[#05cd99]' : result.cropHealthScore >= 40 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${result.cropHealthScore}%` }} /></div>
                  </div>
                  <div className="glass-card p-4">
                    <div className="flex items-center gap-2 mb-2"><Shield className="w-4 h-4 text-amber-400" /><span className="text-gray-400 text-xs">Environmental Risk</span></div>
                    <div className="text-3xl font-bold text-white mb-2 font-display">{result.environmentalRisk}</div>
                    <div className="h-1.5 rounded-full bg-gray-800/80 overflow-hidden"><div className={`h-full rounded-full ${result.environmentalRisk < 30 ? 'bg-[#05cd99]' : result.environmentalRisk < 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${result.environmentalRisk}%` }} /></div>
                  </div>
                </div>

                <div className="glass-card-cyan p-4 animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
                  <div className="flex items-center gap-2 mb-2"><Thermometer className="w-4 h-4 text-cyan-400" /><span className="text-cyan-400 text-sm font-medium">Weather-Related Risk</span></div>
                  <p className="text-gray-300 text-sm leading-relaxed">{result.weatherRisk}</p>
                </div>

                <div className="glass-card p-4 border-[rgba(5,205,153,0.1)] animate-fadeInUp" style={{ animationDelay: '0.18s' }}>
                  <div className="flex items-center gap-2 mb-2"><Droplets className="w-4 h-4 text-blue-400" /><span className="text-blue-400 text-sm font-medium">Irrigation Suggestion</span></div>
                  <p className="text-gray-300 text-sm leading-relaxed">{result.irrigationSuggestion}</p>
                </div>

                <div className="glass-card p-4 border-[rgba(5,205,153,0.1)] animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-center gap-2 mb-2"><Leaf className="w-4 h-4 text-[#05cd99]" /><span className="text-[#05cd99] text-sm font-medium">Sustainability Impact</span></div>
                  <p className="text-gray-300 text-sm leading-relaxed">{result.sustainabilityImpact}</p>
                </div>

                <div className="glass-card p-5 animate-fadeInUp" style={{ animationDelay: '0.25s' }}>
                  <div className="flex items-center gap-2 mb-4"><Clock className="w-4 h-4 text-cyan-400" /><span className="text-white font-medium text-sm font-display">Treatment Timeline</span></div>
                  <div className="space-y-3">
                    {result.treatmentTimeline.map((step, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i === 0 && result.severity === 'severe' ? 'bg-red-500/12 text-red-400 border border-red-500/2' : 'bg-[rgba(5,205,153,0.08)] text-[#05cd99] border border-[rgba(5,205,153,0.15)]'}`}>{step.step}</div>
                          {i < result.treatmentTimeline.length - 1 && <div className="w-px h-5 bg-gray-700/30" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`text-xs font-semibold ${i === 0 && result.severity === 'severe' ? 'text-red-400' : 'text-cyan-400'}`}>{step.time}</span>
                          <p className="text-gray-300 text-xs leading-relaxed mt-0.5">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {[
                  { key: 'causes', label: 'Causes', icon: FlaskConical, items: result.causes, color: 'text-blue-400', iconBg: 'bg-blue-500/8' },
                  { key: 'treatments', label: 'Treatment Plan', icon: CheckCircle, items: result.treatments, color: 'text-[#05cd99]', iconBg: 'bg-[rgba(5,205,153,0.08)]' },
                  { key: 'prevention', label: 'Prevention Tips', icon: Shield, items: result.prevention, color: 'text-cyan-400', iconBg: 'bg-cyan-500/8' },
                ].map(section => {
                  const SectionIcon = section.icon; const isOpen = expandedSection === section.key;
                  return (
                    <div key={section.key} className="glass-card overflow-hidden animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                      <button onClick={() => toggleSection(section.key)} className="w-full flex items-center justify-between p-4 hover:bg-white/[0.015] transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg ${section.iconBg} flex items-center justify-center`}><SectionIcon className={`w-4 h-4 ${section.color}`} /></div>
                          <span className="text-white font-medium text-sm">{section.label}</span>
                          <span className="text-xs text-gray-600 bg-gray-800/40 px-2 py-0.5 rounded-full">{section.items.length}</span>
                        </div>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 border-t border-gray-700/25">
                          <ul className="space-y-2 mt-3">{section.items.map((item, i) => <li key={i} className="flex items-start gap-2 text-sm text-gray-300"><div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${section.color.replace('text-', 'bg-')}`} />{item}</li>)}</ul>
                        </div>
                      )}
                    </div>
                  );
                })}

                {result.severity === 'severe' && (
                  <div className="glass-card p-4 border border-red-500/15 bg-red-500/4 animate-fadeInUp">
                    <div className="flex items-start gap-3"><AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" /><div><p className="text-red-400 font-semibold text-sm mb-1">Expert Consultation Required</p><p className="text-gray-300 text-xs leading-relaxed">Consult an agricultural expert for severe infections. AI analysis is for guidance only and may not replace professional diagnosis.</p></div></div>
                  </div>
                )}

                <div className="glass-card p-4 border-amber-500/10 animate-fadeInUp">
                  <div className="flex items-start gap-3"><Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" /><p className="text-gray-400 text-xs leading-relaxed">AI confidence: {result.confidence}%. Results are generated by computer vision models and should be used as a supplementary tool. Environmental conditions, image quality, and crop variety can affect accuracy. Always verify with local agricultural experts.</p></div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
