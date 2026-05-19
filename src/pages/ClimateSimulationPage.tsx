import { useState, useEffect } from 'react';
import { Thermometer, CloudRain, Wind, Leaf, Droplets, AlertTriangle, Activity, TrendingUp, TrendingDown, Eye, Droplet, Cpu } from 'lucide-react';

interface SimulationResult {
  cropImpact: number;
  diseaseRisk: number;
  waterUsage: number;
  sustainabilityScore: number;
  yieldForecast: number;
  irrigationNeed: number;
}

function computeSimulation(temp: number, rainfall: number, pollution: number, humidity: number): SimulationResult {
  const tempBase = 26;
  const tempDelta = temp - tempBase;
  const rainfallIdeal = 600;
  const rainfallDelta = Math.abs(rainfall - rainfallIdeal);

  const cropImpact = Math.max(10, Math.min(100, 100 - Math.abs(tempDelta) * 3.5 - rainfallDelta * 0.035 - pollution * 0.25 - (humidity > 85 ? (humidity - 85) * 0.5 : 0)));
  const diseaseRisk = Math.min(100, Math.max(5, (temp > 30 ? (temp - 30) * 4 : 0) + (humidity > 70 ? (humidity - 70) * 0.8 : 0) + (rainfall > 700 ? (rainfall - 700) * 0.04 : 0) + pollution * 0.18 + 15));
  const waterUsage = Math.min(100, Math.max(20, 50 + tempDelta * 2.5 - rainfall * 0.025 + pollution * 0.15 + humidity * 0.1));
  const sustainabilityScore = Math.max(10, Math.min(100, 90 - pollution * 0.45 - Math.abs(tempDelta) * 1.8 - (rainfall > 900 ? 8 : 0) - (humidity > 85 ? 5 : 0)));
  const yieldForecast = Math.max(10, Math.min(100, 85 - Math.abs(tempDelta) * 3 - rainfallDelta * 0.025 - pollution * 0.2 - (humidity > 80 ? (humidity - 80) * 0.3 : 0)));
  const irrigationNeed = Math.min(100, Math.max(5, 60 + tempDelta * 1.5 - rainfall * 0.03 + pollution * 0.1 - humidity * 0.15));

  return {
    cropImpact: Math.round(cropImpact),
    diseaseRisk: Math.round(diseaseRisk),
    waterUsage: Math.round(waterUsage),
    sustainabilityScore: Math.round(sustainabilityScore),
    yieldForecast: Math.round(yieldForecast),
    irrigationNeed: Math.round(irrigationNeed),
  };
}

function getScenarioLabel(s: number): { label: string; color: string; desc: string } {
  if (s >= 75) return { label: 'Optimal Conditions', color: 'text-[#05cd99]', desc: 'Favorable for most crops' };
  if (s >= 55) return { label: 'Moderate Stress', color: 'text-amber-400', desc: 'Some adaptation needed' };
  return { label: 'Critical Conditions', color: 'text-red-400', desc: 'Urgent intervention required' };
}

function ResultBar({ label, value, icon: Icon, low = false, colorHigh = 'from-[#05cd99] to-teal-400', colorLow = 'from-red-500 to-orange-500' }: {
  label: string; value: number; icon: React.ElementType; low?: boolean; colorHigh?: string; colorLow?: string;
}) {
  const isGood = low ? value < 40 : value >= 60;
  const gradient = isGood ? colorHigh : colorLow;
  const textColor = isGood ? 'text-[#05cd99]' : value < 50 ? 'text-red-400' : 'text-amber-400';

  return (
    <div className="glass-card-cyan p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300 text-sm">{label}</span>
        </div>
        <span className={`font-bold text-lg ${textColor}`}>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-gray-800/80 overflow-hidden">
        <div className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700`} style={{ width: `${value}%` }} />
      </div>
      {low && value >= 60 && (
        <div className="flex items-center gap-1 mt-1.5">
          <AlertTriangle className="w-3 h-3 text-orange-400" />
          <span className="text-orange-400 text-xs">High risk — consider mitigation</span>
        </div>
      )}
    </div>
  );
}

const presets = [
  { label: 'Ideal Kharif', temp: 26, rainfall: 600, pollution: 10, humidity: 55, color: 'text-[#05cd99]', bg: 'border-[rgba(5,205,153,0.2)] bg-[rgba(5,205,153,0.06)]' },
  { label: 'Summer Stress', temp: 40, rainfall: 200, pollution: 45, humidity: 30, color: 'text-orange-400', bg: 'border-orange-500/20 bg-orange-500/6' },
  { label: 'Monsoon Excess', temp: 28, rainfall: 1200, pollution: 20, humidity: 90, color: 'text-blue-400', bg: 'border-blue-500/20 bg-blue-500/6' },
  { label: 'Climate Crisis', temp: 42, rainfall: 150, pollution: 80, humidity: 25, color: 'text-red-400', bg: 'border-red-500/20 bg-red-500/6' },
];

function getIrrigationSuggestion(result: SimulationResult, temp: number, rainfall: number, humidity: number): string {
  if (result.irrigationNeed >= 70) {
    return `Critical irrigation need detected. Apply 25-30mm water via drip system within 24 hours. Schedule between 6-8 AM to minimize evaporation. At ${temp}°C with only ${rainfall}mm rainfall, crops face severe water stress.`;
  }
  if (result.irrigationNeed >= 45) {
    return `Moderate irrigation required. Apply 15-20mm water in next 48 hours. Consider splitting into 2 cycles of 10mm each. Current humidity at ${humidity}% provides some relief but root zone moisture is declining.`;
  }
  if (rainfall > 800) {
    return `Rainfall of ${rainfall}mm exceeds crop water requirements. Pause irrigation for 72 hours. Monitor soil drainage to prevent waterlogging and root rot. Resume only when soil moisture drops below 45%.`;
  }
  return `Irrigation conditions are favorable. Current parameters support healthy crop growth. Maintain standard irrigation schedule of 12-15mm per cycle. Soil moisture levels are within optimal range.`;
}

export default function ClimateSimulationPage() {
  const [temp, setTemp] = useState(28);
  const [rainfall, setRainfall] = useState(600);
  const [pollution, setPollution] = useState(20);
  const [humidity, setHumidity] = useState(55);
  const [result, setResult] = useState<SimulationResult>(computeSimulation(28, 600, 20, 55));
  const [prevResult, setPrevResult] = useState<SimulationResult | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPrevResult(result);
      setResult(computeSimulation(temp, rainfall, pollution, humidity));
    }, 120);
    return () => clearTimeout(timer);
  }, [temp, rainfall, pollution, humidity]);

  const scenario = getScenarioLabel(result.sustainabilityScore);

  const getDelta = (cur: number, prev: number | undefined) => {
    if (prev === undefined) return null;
    const d = cur - prev;
    return Math.abs(d) < 1 ? null : d;
  };

  const loadPreset = (p: typeof presets[0]) => {
    setTemp(p.temp);
    setRainfall(p.rainfall);
    setPollution(p.pollution);
    setHumidity(p.humidity);
  };

  const irrigationSuggestion = getIrrigationSuggestion(result, temp, rainfall, humidity);

  return (
    <div className="min-h-screen pt-16 px-4 sm:px-6 lg:px-8 pb-16 relative">
      <div className="absolute inset-0 hex-bg pointer-events-none" />
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(5,205,153,0.06)] border border-[rgba(5,205,153,0.15)] text-[#05cd99] text-sm mb-4">
            <Activity className="w-4 h-4" /> Verdex Climate Simulation
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 font-display">Climate Impact Simulator</h1>
          <p className="text-gray-400">Adjust environmental parameters and see real-time predictions for your crops.</p>
        </div>

        {/* Preset Scenarios */}
        <div className="flex flex-wrap gap-3 mb-8">
          {presets.map(p => (
            <button key={p.label} onClick={() => loadPreset(p)} className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all hover:-translate-y-0.5 ${p.bg} ${p.color}`}>
              {p.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sliders */}
          <div className="space-y-5">
            <div className="glass-card p-6 gradient-border-animated">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-semibold text-lg flex items-center gap-2 font-display">
                  <Thermometer className="w-5 h-5 text-orange-400" />
                  Climate Parameters
                </h2>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold border border-current/15 ${scenario.color}`}>
                  {scenario.label}
                </div>
              </div>

              {/* Temperature */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-orange-400" />
                    <span className="text-gray-300 text-sm font-medium">Temperature</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-xl ${temp > 38 ? 'text-red-400' : temp > 32 ? 'text-amber-400' : 'text-[#05cd99]'}`}>{temp}°C</span>
                    {temp > 38 && <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />}
                  </div>
                </div>
                <input type="range" min={10} max={50} value={temp} onChange={e => setTemp(Number(e.target.value))} className="w-full" style={{ background: 'linear-gradient(to right, #06b6d4 0%, #05cd99 30%, #f59e0b 60%, #ef4444 80%, #ef4444 100%)' }} />
                <div className="flex justify-between text-xs text-gray-600 mt-1.5"><span>10°C</span><span className="text-gray-500">Optimal: 22-30°C</span><span>50°C</span></div>
              </div>

              {/* Rainfall */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CloudRain className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300 text-sm font-medium">Annual Rainfall</span>
                  </div>
                  <span className={`font-bold text-xl ${rainfall < 300 ? 'text-red-400' : rainfall > 1000 ? 'text-blue-400' : 'text-cyan-400'}`}>{rainfall}mm</span>
                </div>
                <input type="range" min={0} max={2000} step={10} value={rainfall} onChange={e => setRainfall(Number(e.target.value))} className="w-full" style={{ background: 'linear-gradient(to right, #ef4444 0%, #f59e0b 20%, #05cd99 40%, #06b6d4 70%, #3b82f6 100%)' }} />
                <div className="flex justify-between text-xs text-gray-600 mt-1.5"><span>0mm</span><span className="text-gray-500">Optimal: 500-800mm</span><span>2000mm</span></div>
              </div>

              {/* Pollution */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 text-sm font-medium">Pollution Index</span>
                  </div>
                  <span className={`font-bold text-xl ${pollution > 60 ? 'text-red-400' : pollution > 35 ? 'text-amber-400' : 'text-[#05cd99]'}`}>{pollution}</span>
                </div>
                <input type="range" min={0} max={100} value={pollution} onChange={e => setPollution(Number(e.target.value))} className="w-full" style={{ background: 'linear-gradient(to right, #05cd99 0%, #f59e0b 50%, #ef4444 100%)' }} />
                <div className="flex justify-between text-xs text-gray-600 mt-1.5"><span>Clean (0)</span><span className="text-gray-500">Optimal: &lt;30</span><span>Toxic (100)</span></div>
              </div>

              {/* Humidity */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Droplet className="w-4 h-4 text-blue-300" />
                    <span className="text-gray-300 text-sm font-medium">Relative Humidity</span>
                  </div>
                  <span className={`font-bold text-xl ${humidity > 85 ? 'text-red-400' : humidity > 70 ? 'text-amber-400' : 'text-[#05cd99]'}`}>{humidity}%</span>
                </div>
                <input type="range" min={0} max={100} value={humidity} onChange={e => setHumidity(Number(e.target.value))} className="w-full" style={{ background: 'linear-gradient(to right, #f59e0b 0%, #05cd99 30%, #06b6d4 60%, #3b82f6 80%, #ef4444 100%)' }} />
                <div className="flex justify-between text-xs text-gray-600 mt-1.5"><span>0%</span><span className="text-gray-500">Optimal: 40-65%</span><span>100%</span></div>
              </div>
            </div>

            {/* Parameter Summary */}
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-400 text-sm font-medium">Current Parameters</span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Temp', val: `${temp}°C`, icon: Thermometer, color: temp > 38 ? 'text-red-400' : 'text-orange-400' },
                  { label: 'Rain', val: `${rainfall}mm`, icon: CloudRain, color: 'text-blue-400' },
                  { label: 'Pollution', val: `${pollution}/100`, icon: Wind, color: pollution > 50 ? 'text-red-400' : 'text-gray-400' },
                  { label: 'Humidity', val: `${humidity}%`, icon: Droplet, color: humidity > 80 ? 'text-amber-400' : 'text-blue-300' },
                ].map(p => {
                  const Icon = p.icon;
                  return (
                    <div key={p.label} className="text-center">
                      <Icon className={`w-5 h-5 mx-auto mb-1 ${p.color}`} />
                      <div className={`font-bold text-sm ${p.color}`}>{p.val}</div>
                      <div className="text-gray-600 text-xs">{p.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div className="glass-card p-5 border-[rgba(5,205,153,0.08)]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#05cd99]" />
                  <h2 className="text-white font-semibold font-display">Live Prediction Results</h2>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="status-dot bg-[#05cd99] text-[#05cd99]" />
                  <span className="text-[#05cd99] text-xs font-medium">Live</span>
                </div>
              </div>

              <div className="space-y-3">
                <ResultBar label="Crop Yield Impact" value={result.cropImpact} icon={Leaf} colorHigh="from-[#05cd99] to-teal-400" colorLow="from-red-500 to-orange-500" />
                <ResultBar label="Disease Risk" value={result.diseaseRisk} icon={AlertTriangle} low={true} colorHigh="from-[#05cd99] to-teal-400" colorLow="from-red-500 to-orange-500" />
                <ResultBar label="Water Usage Demand" value={result.waterUsage} icon={Droplets} low={true} colorHigh="from-blue-500 to-cyan-400" colorLow="from-orange-500 to-red-500" />
                <ResultBar label="Sustainability Score" value={result.sustainabilityScore} icon={Leaf} colorHigh="from-teal-500 to-[#05cd99]" colorLow="from-red-500 to-orange-500" />

                {/* Yield Forecast */}
                <div className={`glass-card-cyan p-4 border ${result.yieldForecast >= 70 ? 'border-[rgba(5,205,153,0.2)]' : result.yieldForecast >= 50 ? 'border-amber-500/20' : 'border-red-500/20'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">Yield Forecast</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {prevResult && getDelta(result.yieldForecast, prevResult.yieldForecast) !== null && (
                        <span className={`text-xs flex items-center gap-0.5 ${getDelta(result.yieldForecast, prevResult.yieldForecast)! > 0 ? 'text-[#05cd99]' : 'text-red-400'}`}>
                          {getDelta(result.yieldForecast, prevResult.yieldForecast)! > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {Math.abs(getDelta(result.yieldForecast, prevResult.yieldForecast)!)}%
                        </span>
                      )}
                      <span className={`font-bold text-2xl ${result.yieldForecast >= 70 ? 'text-[#05cd99]' : result.yieldForecast >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                        {result.yieldForecast}%
                      </span>
                    </div>
                  </div>
                  <div className="text-gray-500 text-xs mt-2">
                    {result.yieldForecast >= 70 ? 'Favorable conditions — expect good harvest yield.' : result.yieldForecast >= 50 ? 'Moderate yield expected. Consider adaptive measures.' : 'Poor yield forecast. Urgent intervention needed.'}
                  </div>
                </div>
              </div>
            </div>

            {/* Irrigation Suggestion */}
            <div className="glass-card p-5 border-[rgba(5,205,153,0.12)] gradient-border-animated">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[rgba(5,205,153,0.15)] to-cyan-500/15 flex items-center justify-center shrink-0">
                  <Droplet className="w-4 h-4 text-[#05cd99]" />
                </div>
                <div>
                  <h4 className="text-[#05cd99] font-semibold text-sm mb-1 font-display">Irrigation Suggestion</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">{irrigationSuggestion}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">Irrigation Need:</span>
                    <span className={`text-xs font-bold ${result.irrigationNeed >= 70 ? 'text-red-400' : result.irrigationNeed >= 45 ? 'text-amber-400' : 'text-[#05cd99]'}`}>{result.irrigationNeed}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insight */}
            <div className="glass-card p-4 border-cyan-500/12">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/15 to-blue-500/15 flex items-center justify-center shrink-0">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-cyan-400 font-semibold text-sm mb-1 font-display">Verdex AI Insight</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {temp > 38 ? `At ${temp}°C, most crops face severe heat stress. Consider shade nets, mulching, and drought-resistant varieties.` :
                     humidity > 85 ? `Humidity at ${humidity}% creates high fungal disease pressure. Increase ventilation and apply preventive fungicide.` :
                     rainfall < 300 ? `Rainfall at ${rainfall}mm is critically low. Irrigation becomes essential. Explore water-efficient crops like sorghum or pearl millet.` :
                     pollution > 60 ? `Pollution index of ${pollution} significantly impacts soil microbiome and plant health. Bioremediation recommended.` :
                     `Current conditions (${temp}°C, ${rainfall}mm, ${humidity}% humidity) are ${result.yieldForecast >= 70 ? 'favorable' : 'moderate'} for most Kharif crops.`}
                  </p>
                </div>
              </div>
            </div>

            {/* Risk matrix */}
            <div className="glass-card p-4">
              <h4 className="text-white font-medium text-sm mb-3 font-display">Simulation Risk Matrix</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Drought Risk', level: rainfall < 400 ? 'high' : rainfall < 600 ? 'medium' : 'low' },
                  { label: 'Heat Stress', level: temp > 38 ? 'high' : temp > 32 ? 'medium' : 'low' },
                  { label: 'Flood Risk', level: rainfall > 1200 ? 'high' : rainfall > 900 ? 'medium' : 'low' },
                  { label: 'Fungal Risk', level: humidity > 80 ? 'high' : humidity > 60 ? 'medium' : 'low' },
                  { label: 'Soil Degradation', level: pollution > 60 ? 'high' : pollution > 35 ? 'medium' : 'low' },
                  { label: 'Water Stress', level: rainfall < 300 && temp > 35 ? 'high' : rainfall < 500 ? 'medium' : 'low' },
                ].map(risk => {
                  const colors: Record<string, string> = {
                    high: 'bg-red-500/8 border-red-500/20 text-red-400',
                    medium: 'bg-amber-500/8 border-amber-500/20 text-amber-400',
                    low: 'bg-[rgba(5,205,153,0.08)] border-[rgba(5,205,153,0.2)] text-[#05cd99]',
                  };
                  return (
                    <div key={risk.label} className={`p-2.5 rounded-xl border ${colors[risk.level]} flex items-center justify-between`}>
                      <span className="text-xs text-gray-300">{risk.label}</span>
                      <span className="text-xs font-semibold capitalize">{risk.level}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
