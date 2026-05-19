import { useState, useEffect } from 'react';
import {
  Leaf, Droplets, BarChart3, Shield, TrendingUp, TrendingDown,
  CheckCircle, AlertCircle, Zap, Globe, Sun, Wind, Cpu, Droplet
} from 'lucide-react';
import type { SustainabilityMetrics, CropRecommendation } from '../types';

const metrics: SustainabilityMetrics = {
  waterUsage: 73,
  soilHealth: 87,
  pollutionImpact: 24,
  sustainabilityRating: 81,
  environmentalRisk: 18,
};

const crops: CropRecommendation[] = [
  { name: 'Pearl Millet (Bajra)', benefit: 'Drought-resistant, high nutrition, supports biodiversity', waterReq: 'Low (350-400mm/season)', sustainability: 'high', challenges: ['Prone to downy mildew', 'Needs warm climate'], score: 92 },
  { name: 'Sorghum (Jowar)', benefit: 'Excellent for arid conditions, carbon-efficient crop', waterReq: 'Low (400-500mm/season)', sustainability: 'high', challenges: ['Bird damage risk', 'Market price fluctuations'], score: 88 },
  { name: 'Chickpea (Chana)', benefit: 'Nitrogen-fixing, improves soil health naturally', waterReq: 'Medium (450-600mm/season)', sustainability: 'high', challenges: ['Fusarium wilt susceptibility', 'Pod borer pest'], score: 85 },
  { name: 'Sunflower', benefit: 'High oil yield, good rotation crop, pollinator-friendly', waterReq: 'Medium (500-600mm/season)', sustainability: 'medium', challenges: ['Aphid attacks common', 'Needs full sun'], score: 74 },
];

const ecoRecommendations = [
  { icon: Droplets, title: 'Install Drip Irrigation', desc: 'Reduces water consumption by 35-40% compared to flood irrigation. ROI within 2 seasons.', impact: 'High', color: 'text-blue-400', bg: 'bg-blue-500/6 border-blue-500/12' },
  { icon: Leaf, title: 'Adopt Cover Cropping', desc: 'Plant leguminous cover crops to improve nitrogen levels and prevent soil erosion.', impact: 'High', color: 'text-[#05cd99]', bg: 'bg-[rgba(5,205,153,0.06)] border-[rgba(5,205,153,0.12)]' },
  { icon: Sun, title: 'Solar-Powered Pumps', desc: 'Replace diesel pumps with solar to cut carbon emissions by 60% and fuel costs by 80%.', impact: 'Very High', color: 'text-amber-400', bg: 'bg-amber-500/6 border-amber-500/12' },
  { icon: Wind, title: 'Windbreak Plantation', desc: 'Plant native tree rows to reduce wind erosion, improve microclimate and biodiversity.', impact: 'Medium', color: 'text-teal-400', bg: 'bg-teal-500/6 border-teal-500/12' },
];

const irrigationSuggestions = [
  { icon: Droplet, title: 'Smart Scheduling', desc: 'AI-driven irrigation scheduling based on soil moisture, weather forecast, and crop growth stage reduces water waste by 40%.', impact: 'Very High', color: 'text-[#05cd99]', bg: 'bg-[rgba(5,205,153,0.06)] border-[rgba(5,205,153,0.12)]' },
  { icon: Zap, title: 'Fertigation Systems', desc: 'Combine fertilization with drip irrigation to deliver nutrients directly to root zones, improving uptake efficiency by 30%.', impact: 'High', color: 'text-cyan-400', bg: 'bg-cyan-500/6 border-cyan-500/12' },
  { icon: Shield, title: 'Rainwater Harvesting', desc: 'Capture monsoon rainfall in lined ponds for dry-season irrigation. A 1-hectare farm can collect 5M liters annually.', impact: 'High', color: 'text-blue-400', bg: 'bg-blue-500/6 border-blue-500/12' },
];

const monthlyData = [62, 68, 71, 74, 78, 81, 83, 87, 85, 89, 87, 91];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const steps = 50;
    const step = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= value) { setCount(value); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 30);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{count}{suffix}</span>;
}

function RadialGauge({ value, color, size = 140 }: { value: number; color: string; size?: number }) {
  const radius = (size - 24) / 2;
  const circumference = Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size / 2 + 12} viewBox={`0 0 ${size} ${size / 2 + 12}`}>
      <path d={`M 12 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 12} ${size / 2}`} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10" strokeLinecap="round" />
      <path
        d={`M 12 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 12} ${size / 2}`}
        fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1.5s ease', filter: `drop-shadow(0 0 8px ${color})` }}
      />
      <text x={size / 2} y={size / 2 - 4} textAnchor="middle" fill="white" fontSize="22" fontWeight="bold" fontFamily="Space Grotesk, sans-serif">{value}</text>
      <text x={size / 2} y={size / 2 + 14} textAnchor="middle" fill="#6b7280" fontSize="10" fontFamily="Inter, sans-serif">Score</text>
    </svg>
  );
}

export default function SustainabilityPage() {
  const [selectedCrop, setSelectedCrop] = useState<CropRecommendation | null>(null);
  const [soilType, setSoilType] = useState('loamy');
  const [season, setSeason] = useState('kharif');
  const [location, setLocation] = useState('');
  const [showRecs, setShowRecs] = useState(false);
  const maxBar = Math.max(...monthlyData);
  const susColor = metrics.sustainabilityRating >= 80 ? '#05cd99' : metrics.sustainabilityRating >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="min-h-screen pt-16 px-4 sm:px-6 lg:px-8 pb-16 relative">
      <div className="absolute inset-0 hex-bg pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(5,205,153,0.06)] border border-[rgba(5,205,153,0.15)] text-[#05cd99] text-sm mb-4">
            <BarChart3 className="w-4 h-4" /> Verdex Sustainability Analytics
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 font-display">Environmental Intelligence</h1>
          <p className="text-gray-400">Track your farm's ecological footprint and sustainability performance with Verdex AI.</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {[
            { label: 'Water Usage', value: metrics.waterUsage, icon: Droplets, color: 'from-blue-500 to-cyan-500', textColor: '#06b6d4', desc: 'Efficiency Score' },
            { label: 'Soil Health', value: metrics.soilHealth, icon: Leaf, color: 'from-[#05cd99] to-teal-500', textColor: '#05cd99', desc: 'Organic Matter' },
            { label: 'Pollution', value: 100 - metrics.pollutionImpact, icon: Globe, color: 'from-teal-500 to-[#05cd99]', textColor: '#14b8a6', desc: 'Low = Better' },
            { label: 'Sustainability', value: metrics.sustainabilityRating, icon: CheckCircle, color: 'from-[#05cd99] to-cyan-500', textColor: '#05cd99', desc: 'Overall Rating' },
            { label: 'Eco Risk', value: 100 - metrics.environmentalRisk, icon: Shield, color: 'from-amber-500 to-orange-500', textColor: '#f59e0b', desc: 'Low Risk' },
          ].map(m => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="glass-card p-4 text-center hover:border-[rgba(5,205,153,0.15)] transition-all hover:-translate-y-0.5 group">
                <Icon className="w-5 h-5 mx-auto mb-2" style={{ color: m.textColor }} />
                <div className="text-2xl font-bold text-white mb-0.5"><AnimatedCounter value={m.value} suffix="%" /></div>
                <div className="text-xs text-gray-400 mb-2">{m.label}</div>
                <div className="h-1 rounded-full bg-gray-800/80 overflow-hidden">
                  <div className={`h-full rounded-full bg-gradient-to-r ${m.color}`} style={{ width: `${m.value}%`, transition: 'width 1.5s ease' }} />
                </div>
                <div className="text-gray-600 text-xs mt-1">{m.desc}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
          {/* Trend Chart */}
          <div className="lg:col-span-2 glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold flex items-center gap-2 font-display">
                <TrendingUp className="w-5 h-5 text-[#05cd99]" />
                Sustainability Score Trend
              </h3>
              <div className="flex items-center gap-1.5 text-[#05cd99] text-sm">
                <TrendingUp className="w-4 h-4" /><span>+29pts this year</span>
              </div>
            </div>
            <div className="flex items-end gap-2 h-36">
              {monthlyData.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="text-gray-600 text-xs opacity-0 hover:opacity-100 transition-opacity">{val}</div>
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-[rgba(5,205,153,0.4)] to-[rgba(5,205,153,0.6)] bar-animate hover:from-[rgba(5,205,153,0.6)] hover:to-[rgba(5,205,153,0.8)] transition-colors cursor-default"
                    style={{ height: `${(val / maxBar) * 100}%`, animationDelay: `${i * 0.05}s`, minHeight: '4px' }}
                  />
                  <span className="text-gray-600 text-xs">{months[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sustainability Gauge */}
          <div className="glass-card p-6 flex flex-col items-center justify-center">
            <h3 className="text-white font-semibold mb-4 font-display">Overall Score</h3>
            <RadialGauge value={metrics.sustainabilityRating} color={susColor} size={160} />
            <div className="mt-4 text-center">
              <div className="text-[#05cd99] font-semibold text-sm">Excellent Performance</div>
              <p className="text-gray-500 text-xs mt-1 max-w-40 text-center">Your farm is in the top 15% of sustainable operations in your region.</p>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 w-full">
              {[
                { label: 'Low', color: 'bg-red-500' },
                { label: 'Good', color: 'bg-amber-500' },
                { label: 'Excellent', color: 'bg-[#05cd99]' },
              ].map(item => (
                <div key={item.label} className="text-center">
                  <div className={`h-1 rounded-full ${item.color} mb-1`} />
                  <span className="text-gray-600 text-xs">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Crop Recommendation Engine */}
        <div className="glass-card p-6 mb-8 gradient-border-animated">
          <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2 font-display">
            <Cpu className="w-5 h-5 text-[#05cd99]" />
            Smart Crop Recommendation Engine
          </h2>
          <p className="text-gray-400 text-sm mb-6">Enter your farm details to get AI-powered crop recommendations from Verdex AI.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-gray-400 text-xs mb-1.5 block">Soil Type</label>
              <select value={soilType} onChange={e => setSoilType(e.target.value)} className="w-full bg-gray-800/40 border border-gray-700/50 rounded-xl px-3 py-2.5 text-white text-sm focus:border-[rgba(5,205,153,0.35)] outline-none">
                {['loamy', 'sandy', 'clayey', 'silty', 'black'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)} Soil</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1.5 block">Season</label>
              <select value={season} onChange={e => setSeason(e.target.value)} className="w-full bg-gray-800/40 border border-gray-700/50 rounded-xl px-3 py-2.5 text-white text-sm focus:border-[rgba(5,205,153,0.35)] outline-none">
                {['kharif', 'rabi', 'zaid'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)} Season</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1.5 block">Location</label>
              <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g., Hyderabad, Telangana" className="w-full bg-gray-800/40 border border-gray-700/50 rounded-xl px-3 py-2.5 text-white text-sm focus:border-[rgba(5,205,153,0.35)] outline-none placeholder:text-gray-600" />
            </div>
          </div>
          <button onClick={() => setShowRecs(true)} className="btn-primary flex items-center gap-2">
            <Zap className="w-4 h-4" /> Get AI Recommendations
          </button>
          {showRecs && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {crops.map(crop => (
                <button key={crop.name} onClick={() => setSelectedCrop(selectedCrop?.name === crop.name ? null : crop)} className={`glass-card-cyan p-4 text-left hover:border-[rgba(5,205,153,0.2)] transition-all hover:-translate-y-0.5 ${selectedCrop?.name === crop.name ? 'border-[rgba(5,205,153,0.25)] glow-green' : ''}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${crop.sustainability === 'high' ? 'bg-[rgba(5,205,153,0.12)] text-[#05cd99]' : crop.sustainability === 'medium' ? 'bg-amber-500/12 text-amber-400' : 'bg-red-500/12 text-red-400'}`}>
                      {crop.sustainability.charAt(0).toUpperCase() + crop.sustainability.slice(1)} Eco
                    </div>
                    <span className="text-white font-bold text-sm">{crop.score}</span>
                  </div>
                  <h4 className="text-white font-semibold text-sm mb-1 font-display">{crop.name}</h4>
                  <p className="text-gray-400 text-xs leading-relaxed mb-3">{crop.benefit}</p>
                  <div className="flex items-center gap-1 text-blue-400 text-xs"><Droplets className="w-3 h-3" /><span>{crop.waterReq}</span></div>
                  {selectedCrop?.name === crop.name && (
                    <div className="mt-3 pt-3 border-t border-gray-700/30 animate-fadeIn">
                      <p className="text-gray-500 text-xs mb-1">Challenges:</p>
                      {crop.challenges.map((c, i) => <div key={i} className="flex items-center gap-1 text-xs text-orange-400"><AlertCircle className="w-3 h-3 shrink-0" />{c}</div>)}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Irrigation Suggestions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2 font-display">
            <Droplet className="w-5 h-5 text-[#05cd99]" /> Irrigation Intelligence
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {irrigationSuggestions.map(rec => {
              const Icon = rec.icon;
              return (
                <div key={rec.title} className={`glass-card p-5 border ${rec.bg} hover:-translate-y-1 transition-transform`}>
                  <div className="flex items-center justify-between mb-3">
                    <Icon className={`w-6 h-6 ${rec.color}`} />
                    <span className={`text-xs px-2 py-0.5 rounded-full ${rec.bg} ${rec.color} font-medium border`}>{rec.impact} Impact</span>
                  </div>
                  <h4 className="text-white font-semibold text-sm mb-2 font-display">{rec.title}</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">{rec.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Eco Recommendations */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2 font-display">
            <CheckCircle className="w-5 h-5 text-[#05cd99]" /> Eco Farming Recommendations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ecoRecommendations.map(rec => {
              const Icon = rec.icon;
              return (
                <div key={rec.title} className={`glass-card p-5 border ${rec.bg} hover:-translate-y-1 transition-transform`}>
                  <div className="flex items-center justify-between mb-3">
                    <Icon className={`w-6 h-6 ${rec.color}`} />
                    <span className={`text-xs px-2 py-0.5 rounded-full ${rec.bg} ${rec.color} font-medium border`}>{rec.impact} Impact</span>
                  </div>
                  <h4 className="text-white font-semibold text-sm mb-2 font-display">{rec.title}</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">{rec.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Yearly comparison */}
        <div className="glass-card p-6 gradient-border-animated">
          <h3 className="text-white font-semibold mb-6 flex items-center gap-2 font-display">
            <TrendingDown className="w-5 h-5 text-[#05cd99]" /> Environmental Impact Reduction (vs Last Year)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { label: 'Water Saved', value: '35%', icon: Droplets, color: 'text-blue-400' },
              { label: 'Chemicals Reduced', value: '40%', icon: Leaf, color: 'text-[#05cd99]' },
              { label: 'Carbon Reduced', value: '25%', icon: Globe, color: 'text-teal-400' },
              { label: 'Waste Minimized', value: '60%', icon: Shield, color: 'text-amber-400' },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="text-center">
                  <Icon className={`w-8 h-8 ${item.color} mx-auto mb-2`} />
                  <div className={`text-3xl font-bold ${item.color} text-glow-green font-display`}>{item.value}</div>
                  <div className="text-gray-400 text-sm mt-1">{item.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
