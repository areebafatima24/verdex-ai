import { useState, useEffect } from 'react';
import {
  CloudRain, Thermometer, Wind, Droplets, Sun, Cloud,
  AlertTriangle, CloudSnow, CloudLightning, Eye, Gauge, RefreshCw,
  Leaf, Zap, ArrowUp, ArrowDown, Cpu, Shield, Droplet
} from 'lucide-react';
import type { WeatherData } from '../types';

const mockWeatherData: WeatherData = {
  temperature: 32,
  humidity: 78,
  rainfall: 12,
  windSpeed: 18,
  condition: 'Partly Cloudy',
  location: 'Hyderabad, Telangana',
  forecast: [
    { day: 'Mon', temp: 33, condition: 'sunny', rainfall: 0 },
    { day: 'Tue', temp: 29, condition: 'rainy', rainfall: 25 },
    { day: 'Wed', temp: 27, condition: 'cloudy', rainfall: 8 },
    { day: 'Thu', temp: 31, condition: 'sunny', rainfall: 0 },
    { day: 'Fri', temp: 28, condition: 'thunder', rainfall: 40 },
    { day: 'Sat', temp: 26, condition: 'rainy', rainfall: 18 },
    { day: 'Sun', temp: 30, condition: 'cloudy', rainfall: 5 },
  ],
};

const farmingAlerts = [
  { level: 'warning' as const, title: 'High Humidity Alert', message: 'Current humidity at 78% may increase fungal infection risk on crops. Monitor leaves daily for early symptoms.', action: 'Apply preventive fungicide within 24 hours', icon: Droplets },
  { level: 'info' as const, title: 'Rain Expected Tomorrow', message: 'Rainfall of 25mm forecast for Tuesday. Delay pesticide spraying to avoid washout and chemical runoff.', action: 'Reschedule spray to Wednesday morning', icon: CloudRain },
  { level: 'success' as const, title: 'Ideal Irrigation Window', message: 'Low wind speeds (< 10 km/h) tonight offer optimal irrigation conditions with minimal evaporation loss.', action: 'Schedule drip irrigation for 8 PM–midnight', icon: Leaf },
  { level: 'warning' as const, title: 'Low Soil Moisture Detected', message: 'Soil moisture levels dropping below optimal range in upper root zone. Irrigation recommended before stress symptoms appear.', action: 'Apply 15mm irrigation within 48 hours', icon: Zap },
];

const weatherRecommendations = [
  { title: 'Spray Scheduling', desc: 'Wind speed at 18 km/h. Avoid aerial spraying. Ground-based application recommended for next 2 days.', icon: Wind, color: 'text-blue-400', bg: 'bg-blue-500/6 border-blue-500/12' },
  { title: 'Harvest Window', desc: 'Clear skies Thursday offer optimal harvesting conditions. Low moisture risk for grain crops.', icon: Sun, color: 'text-amber-400', bg: 'bg-amber-500/6 border-amber-500/12' },
  { title: 'Disease Risk', desc: 'High humidity + upcoming rain creates moderate-high fungal and bacterial disease pressure on susceptible crops.', icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/6 border-orange-500/12' },
  { title: 'Irrigation Advisory', desc: 'Skip irrigation Monday–Tuesday due to expected 25mm rainfall. Save water and reduce waterlogging risk.', icon: Droplets, color: 'text-cyan-400', bg: 'bg-cyan-500/6 border-cyan-500/12' },
];

const irrigationInsights = [
  { title: 'Drip Irrigation Priority', desc: 'Current evapotranspiration rate is 5.2mm/day. Drip systems should deliver 4-5 liters/plant for tomato crops.', icon: Droplet, color: 'text-[#05cd99]', bg: 'bg-[rgba(5,205,153,0.06)] border-[rgba(5,205,153,0.12)]' },
  { title: 'Soil Moisture Status', desc: 'Root zone moisture at 42% (optimal: 50-70%). Increase irrigation cycle by 15 minutes per zone.', icon: Gauge, color: 'text-amber-400', bg: 'bg-amber-500/6 border-amber-500/12' },
  { title: 'Water Conservation', desc: 'Rain expected Tuesday — pause irrigation for 48 hours to leverage natural rainfall and save ~12,000 liters/hectare.', icon: Shield, color: 'text-cyan-400', bg: 'bg-cyan-500/6 border-cyan-500/12' },
];

const alertConfig: Record<string, { bg: string; icon: string; dot: string }> = {
  warning: { bg: 'bg-amber-500/6 border-amber-500/20', icon: 'text-amber-400', dot: 'bg-amber-400' },
  info: { bg: 'bg-blue-500/6 border-blue-500/20', icon: 'text-blue-400', dot: 'bg-blue-400' },
  success: { bg: 'bg-[rgba(5,205,153,0.06)] border-[rgba(5,205,153,0.2)]', icon: 'text-[#05cd99]', dot: 'bg-[#05cd99]' },
};

function WeatherIcon({ condition, size = 'w-6 h-6' }: { condition: string; size?: string }) {
  switch (condition) {
    case 'rainy': return <CloudRain className={`${size} text-blue-400`} />;
    case 'sunny': return <Sun className={`${size} text-amber-400`} />;
    case 'thunder': return <CloudLightning className={`${size} text-orange-400`} />;
    case 'snow': return <CloudSnow className={`${size} text-sky-300`} />;
    default: return <Cloud className={`${size} text-gray-400`} />;
  }
}

export default function WeatherDashboardPage() {
  const [data] = useState<WeatherData>(mockWeatherData);
  const [time, setTime] = useState(new Date());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const refresh = () => { setLoading(true); setTimeout(() => setLoading(false), 1500); };
  const tempColor = data.temperature > 35 ? 'text-red-400' : data.temperature > 28 ? 'text-amber-400' : 'text-cyan-400';

  return (
    <div className="min-h-screen pt-16 px-4 sm:px-6 lg:px-8 pb-16 relative">
      <div className="absolute inset-0 hex-bg pointer-events-none" />
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(5,205,153,0.06)] border border-[rgba(5,205,153,0.15)] text-[#05cd99] text-sm mb-3">
              <Cpu className="w-4 h-4" /> Verdex Weather Intelligence
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white font-display">Environmental Dashboard</h1>
            <p className="text-gray-400 mt-1">Real-time conditions with intelligent farming guidance</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-white font-mono text-lg">{time.toLocaleTimeString()}</div>
              <div className="text-gray-500 text-xs">{data.location}</div>
            </div>
            <button onClick={refresh} className={`w-10 h-10 rounded-xl glass-card flex items-center justify-center hover:border-[rgba(5,205,153,0.2)] hover:text-[#05cd99] text-gray-400 transition-all ${loading ? 'animate-rotate-slow' : ''}`}>
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main weather card */}
        <div className="glass-card p-6 mb-6 relative overflow-hidden gradient-border-animated">
          <div className="absolute inset-0 grid-overlay opacity-30" />
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-[rgba(5,205,153,0.04)] rounded-full blur-[60px]" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-cyan-500/5 rounded-full blur-[60px]" />
          <div className="relative z-10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="sm:col-span-2">
                <div className="flex items-end gap-4">
                  <div className={`text-7xl font-bold ${tempColor} text-glow-cyan font-display`}>{data.temperature}°</div>
                  <div className="pb-3">
                    <div className="text-gray-300 font-medium">{data.condition}</div>
                    <div className="text-gray-500 text-sm">{data.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <div className="status-dot bg-[#05cd99] text-[#05cd99]" />
                  <span className="text-[#05cd99] text-xs font-medium">Live Data</span>
                  <span className="text-gray-600 text-xs">Updated just now</span>
                </div>
              </div>
              {[
                { icon: Droplets, label: 'Humidity', value: `${data.humidity}%`, color: 'text-blue-400', desc: 'High — monitor fungal risk', trend: 'up' },
                { icon: CloudRain, label: 'Rainfall', value: `${data.rainfall}mm`, color: 'text-cyan-400', desc: 'Last 24 hours', trend: 'down' },
                { icon: Wind, label: 'Wind Speed', value: `${data.windSpeed} km/h`, color: 'text-teal-400', desc: 'NE direction', trend: 'stable' },
              ].map(stat => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="glass-card-cyan p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                      {stat.trend === 'up' && <ArrowUp className="w-3 h-3 text-amber-400" />}
                      {stat.trend === 'down' && <ArrowDown className="w-3 h-3 text-cyan-400" />}
                    </div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
                    <div className="text-xs text-gray-600 mt-1">{stat.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
          {/* 7-Day Forecast */}
          <div className="lg:col-span-2 glass-card p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2 font-display">
              <Eye className="w-4 h-4 text-cyan-400" />
              7-Day Forecast
            </h3>
            <div className="grid grid-cols-7 gap-2">
              {data.forecast.map((day, i) => (
                <div key={day.day} className={`glass-card-cyan p-2.5 text-center hover:border-cyan-500/20 transition-all ${i === 1 ? 'border-blue-500/20 bg-blue-500/3' : ''}`}>
                  <div className="text-gray-400 text-xs mb-2">{day.day}</div>
                  <div className="flex justify-center mb-2"><WeatherIcon condition={day.condition} size="w-5 h-5" /></div>
                  <div className="text-white font-semibold text-sm">{day.temp}°</div>
                  {day.rainfall > 0 && (
                    <div className="text-blue-400 text-xs mt-1 flex items-center justify-center gap-0.5">
                      <Droplets className="w-2.5 h-2.5" />{day.rainfall}mm
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Atmospheric stats */}
          <div className="glass-card p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2 font-display">
              <Gauge className="w-4 h-4 text-[#05cd99]" />
              Atmospheric Data
            </h3>
            <div className="space-y-4">
              {[
                { label: 'UV Index', value: 7, max: 12, color: 'from-amber-500 to-orange-500', unit: '/12' },
                { label: 'Cloud Cover', value: 65, max: 100, color: 'from-gray-500 to-gray-400', unit: '%' },
                { label: 'Dew Point', value: 24, max: 40, color: 'from-cyan-500 to-blue-500', unit: '°C' },
                { label: 'Pressure', value: 76, max: 100, color: 'from-[#05cd99] to-teal-500', unit: '%' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-400">{item.label}</span>
                    <span className="text-white font-medium">{item.value}{item.unit}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-800/80 overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${item.color}`} style={{ width: `${(item.value / item.max) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Farming Alerts */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2 font-display">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Intelligent Farming Alerts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {farmingAlerts.map((alert, i) => {
              const cfg = alertConfig[alert.level];
              const AlertIcon = alert.icon;
              return (
                <div key={i} className={`glass-card p-4 border ${cfg.bg} animate-fadeInUp`} style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${cfg.dot} animate-pulse`} />
                    <AlertIcon className={`w-4 h-4 ${cfg.icon}`} />
                    <h4 className={`font-semibold text-xs ${cfg.icon}`}>{alert.title}</h4>
                  </div>
                  <p className="text-gray-300 text-xs leading-relaxed mb-3">{alert.message}</p>
                  <div className="border-t border-gray-700/25 pt-2">
                    <span className="text-gray-500 text-xs">Action: </span>
                    <span className="text-gray-300 text-xs">{alert.action}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Irrigation Intelligence */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2 font-display">
            <Droplet className="w-5 h-5 text-[#05cd99]" />
            Irrigation Intelligence
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {irrigationInsights.map((insight) => {
              const Icon = insight.icon;
              return (
                <div key={insight.title} className={`glass-card p-5 border ${insight.bg} hover:-translate-y-1 transition-transform`}>
                  <Icon className={`w-6 h-6 ${insight.color} mb-3`} />
                  <h4 className="text-white font-semibold text-sm mb-2 font-display">{insight.title}</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">{insight.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weather Recommendations */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2 font-display">
            <Thermometer className="w-5 h-5 text-cyan-400" />
            Weather-Aware Recommendations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {weatherRecommendations.map((rec) => {
              const Icon = rec.icon;
              return (
                <div key={rec.title} className={`glass-card p-5 border ${rec.bg} hover:-translate-y-1 transition-transform`}>
                  <Icon className={`w-6 h-6 ${rec.color} mb-3`} />
                  <h4 className="text-white font-semibold text-sm mb-2 font-display">{rec.title}</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">{rec.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
