import { useState, useEffect } from 'react';
import {
  Leaf, Cpu, CloudRain, BarChart3, Thermometer, Zap, Shield, Globe,
  ArrowRight, CheckCircle, Star, ChevronRight, Activity, Droplets,
  Wind, Sun, FlaskConical, Microscope, Satellite, Play
} from 'lucide-react';
import type { Page } from '../types';

interface LandingPageProps { onNavigate: (page: Page) => void; }

const features = [
  { icon: Microscope, title: 'AI Disease Detection', desc: 'Upload crop images for instant computer vision analysis with disease identification, severity scoring, and treatment plans.', page: 'disease-detection' as Page, gradient: 'from-[#05cd99] to-teal-600' },
  { icon: Zap, title: 'Farming AI Assistant', desc: 'Conversational AI with multilingual support, voice input, and personalized crop guidance for every farmer.', page: 'farming-assistant' as Page, gradient: 'from-cyan-500 to-blue-500' },
  { icon: CloudRain, title: 'Weather Intelligence', desc: 'Real-time weather monitoring with intelligent farming alerts and climate-aware spray scheduling.', page: 'weather-dashboard' as Page, gradient: 'from-blue-500 to-sky-400' },
  { icon: BarChart3, title: 'Sustainability Analytics', desc: 'Track water usage, soil health, pollution impact and get actionable eco-farming recommendations.', page: 'sustainability' as Page, gradient: 'from-teal-500 to-[#05cd99]' },
  { icon: Thermometer, title: 'Climate Simulation', desc: 'Interactive sliders to simulate climate scenarios and predict crop performance under different conditions.', page: 'climate-simulation' as Page, gradient: 'from-amber-500 to-orange-500' },
  { icon: FlaskConical, title: 'Smart Crop Advisor', desc: 'AI-powered recommendations based on soil type, season, and location for maximum yield sustainability.', page: 'sustainability' as Page, gradient: 'from-cyan-600 to-teal-500' },
];

const techStack = [
  { name: 'Gemini Vision AI', desc: 'Computer vision for disease detection', icon: Cpu, color: 'from-[#05cd99] to-teal-600' },
  { name: 'Weather API', desc: 'Real-time environmental data feeds', icon: CloudRain, color: 'from-blue-500 to-sky-500' },
  { name: 'Predictive Engine', desc: 'ML-based crop yield forecasting', icon: Activity, color: 'from-cyan-500 to-blue-500' },
  { name: 'Multilingual AI', desc: 'English, Hindi, Telugu support', icon: Globe, color: 'from-[#05cd99] to-teal-500' },
  { name: 'Sustainability AI', desc: 'Environmental impact analytics', icon: Leaf, color: 'from-teal-500 to-[#05cd99]' },
  { name: 'Climate Engine', desc: 'Simulation & predictive modeling', icon: Thermometer, color: 'from-amber-500 to-orange-500' },
  { name: 'Satellite Data', desc: 'Remote sensing & field analysis', icon: Satellite, color: 'from-cyan-500 to-blue-500' },
];

const testimonials = [
  { name: 'Rajesh Kumar', role: 'Wheat Farmer, Punjab', text: 'Verdex AI detected fungal blight on my wheat crop early. The AI recommendations saved 40% of my harvest this season.', rating: 5 },
  { name: 'Dr. Priya Sharma', role: 'Agricultural Researcher, ICAR', text: 'The climate simulation tools are incredibly accurate. This platform is what precision agriculture has been waiting for.', rating: 5 },
  { name: 'Venkat Reddy', role: 'Cotton Farmer, Telangana', text: 'The Telugu language support in the AI assistant is a game changer. Finally, AI that speaks my language.', rating: 5 },
];

const stats = [
  { value: '98.2%', label: 'Detection Accuracy' },
  { value: '50K+', label: 'Farmers Empowered' },
  { value: '12', label: 'Crop Types Analyzed' },
  { value: '30%', label: 'Yield Improvement' },
];

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const [activeFeature, setActiveFeature] = useState(0);
  const [visibleStats, setVisibleStats] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setActiveFeature(prev => (prev + 1) % features.length), 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setVisibleStats(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 grid-overlay" />
        <div className="absolute inset-0 hex-bg" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[rgba(5,205,153,0.04)] rounded-full blur-[100px] animate-orb" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/4 rounded-full blur-[100px] animate-orb" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-blue-500/3 rounded-full blur-[80px] animate-orb" style={{ animationDelay: '6s' }} />
        </div>

        {[...Array(12)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${5 + i * 8}%`, width: `${2 + (i % 3)}px`, height: `${2 + (i % 3)}px`,
            animationDuration: `${10 + i * 2}s`, animationDelay: `${i * 0.8}s`,
            background: i % 2 === 0 ? 'rgba(5,205,153,0.3)' : 'rgba(6,182,212,0.3)',
          }} />
        ))}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(5,205,153,0.18)] bg-[rgba(5,205,153,0.05)] mb-8 animate-fadeInUp">
            <div className="w-2 h-2 rounded-full bg-[#05cd99] animate-pulse" />
            <span className="text-[#05cd99] text-sm font-medium">Verdex AI — Now Live</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold mb-6 leading-[1.1] animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <span className="text-white">The Future of</span><br />
            <span className="holo-text">Smart Farming</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-4 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            AI-powered smart farming and sustainability intelligence platform.
          </p>
          <p className="text-base text-gray-500 max-w-2xl mx-auto mb-10 animate-fadeInUp" style={{ animationDelay: '0.25s' }}>
            Disease detection, climate insights, and precision advisory — all in one intelligent platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <button onClick={() => onNavigate('disease-detection')} className="btn-primary flex items-center gap-2 text-base py-3 px-6">
              <Play className="w-4 h-4" /> Analyze Your Crops <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => onNavigate('sustainability')} className="btn-secondary flex items-center gap-2 text-base py-3 px-6">
              <BarChart3 className="w-4 h-4" /> View Dashboard
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-16 max-w-3xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            {stats.map((stat) => (
              <div key={stat.label} className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-[#05cd99] text-glow-green">{visibleStats ? stat.value : '—'}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-xs text-gray-600 uppercase tracking-[0.2em]">Explore</span>
          <div className="w-px h-8 bg-gradient-to-b from-[rgba(5,205,153,0.3)] to-transparent" />
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/5 border border-cyan-500/12 text-cyan-400 text-sm mb-4">
            <Zap className="w-4 h-4" /> AI-Powered Platform
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 font-display">Intelligent Agriculture Suite</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">From AI disease detection to climate simulation — Verdex AI gives you the intelligence to farm smarter.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <button key={feature.title} onClick={() => onNavigate(feature.page)} className={`glass-card p-6 text-left hover:border-[rgba(5,205,153,0.18)] transition-all duration-300 hover:-translate-y-1 group ${activeFeature === i ? 'border-[rgba(5,205,153,0.18)] glow-green' : ''}`}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 font-display">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                <div className="flex items-center gap-1 mt-4 text-[#05cd99] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Explore <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(5,205,153,0.05)] border border-[rgba(5,205,153,0.12)] text-[#05cd99] text-sm mb-4">
            <Activity className="w-4 h-4" /> AI Workflow
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 font-display">How Verdex AI Works</h2>
          <p className="text-gray-400 max-w-xl mx-auto">Four intelligent steps from data to actionable farming decisions.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 relative">
          <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-px bg-gradient-to-r from-[rgba(5,205,153,0.12)] via-cyan-500/12 to-blue-500/12" />
          {[
            { num: '01', title: 'Capture', desc: 'Upload crop photos or input farm data via web or mobile.', icon: Cpu, gradient: 'from-[#05cd99] to-teal-600' },
            { num: '02', title: 'Analyze', desc: 'AI vision models process images; ML engines analyze environmental data.', icon: Microscope, gradient: 'from-cyan-500 to-blue-500' },
            { num: '03', title: 'Predict', desc: 'Predictive algorithms generate disease risk scores and yield forecasts.', icon: Activity, gradient: 'from-blue-500 to-sky-500' },
            { num: '04', title: 'Act', desc: 'Receive personalized treatment plans, alerts, and sustainability tips.', icon: CheckCircle, gradient: 'from-teal-500 to-[#05cd99]' },
          ].map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="glass-card p-6 text-center relative">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-xs text-gray-600 font-mono mb-2">{step.num}</div>
                <h3 className="text-lg font-semibold text-white mb-2 font-display">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sustainability Impact */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-8 sm:p-12 relative overflow-hidden gradient-border-animated">
            <div className="absolute inset-0 grid-overlay opacity-30" />
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-[rgba(5,205,153,0.04)] rounded-full blur-[80px]" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-500/4 rounded-full blur-[80px]" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(5,205,153,0.05)] border border-[rgba(5,205,153,0.12)] text-[#05cd99] text-sm mb-6">
                  <Leaf className="w-4 h-4" /> Environmental Impact
                </div>
                <h2 className="text-4xl font-bold text-white mb-6 font-display">Farming Smarter,<br /><span className="holo-text">Saving the Planet</span></h2>
                <p className="text-gray-400 leading-relaxed mb-8">Verdex AI helps farmers reduce chemical usage by 35%, optimize water consumption, and measure their environmental footprint in real-time.</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Droplets, label: '35% Less Water', color: 'text-blue-400' },
                    { icon: Leaf, label: '40% Fewer Chemicals', color: 'text-[#05cd99]' },
                    { icon: Sun, label: '25% Carbon Reduction', color: 'text-amber-400' },
                    { icon: Wind, label: '60% Waste Minimized', color: 'text-cyan-400' },
                  ].map(item => {
                    const Icon = item.icon;
                    return <div key={item.label} className="flex items-center gap-2.5"><Icon className={`w-5 h-5 ${item.color}`} /><span className="text-gray-300 text-sm">{item.label}</span></div>;
                  })}
                </div>
                <button onClick={() => onNavigate('sustainability')} className="btn-primary mt-8 inline-flex items-center gap-2">View Sustainability Dashboard <ArrowRight className="w-4 h-4" /></button>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Soil Health Score', value: 87, color: 'from-[#05cd99] to-teal-400', icon: Leaf },
                  { label: 'Water Efficiency', value: 73, color: 'from-blue-500 to-cyan-400', icon: Droplets },
                  { label: 'Sustainability Rating', value: 91, color: 'from-teal-500 to-[#05cd99]', icon: CheckCircle },
                  { label: 'Environmental Risk', value: 18, color: 'from-amber-500 to-orange-400', icon: Shield },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="glass-card-cyan p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2"><Icon className="w-4 h-4 text-gray-400" /><span className="text-gray-300 text-sm">{item.label}</span></div>
                        <span className={`text-sm font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>{item.value}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-800/80 overflow-hidden">
                        <div className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-1000`} style={{ width: `${item.value}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/5 border border-blue-500/12 text-blue-400 text-sm mb-4">
            <Cpu className="w-4 h-4" /> Technology Stack
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 font-display">Powered by Cutting-Edge AI</h2>
          <p className="text-gray-400 max-w-xl mx-auto">State-of-the-art models and APIs delivering real agricultural intelligence.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {techStack.map((tech) => {
            const Icon = tech.icon;
            return (
              <div key={tech.name} className="glass-card p-4 text-center hover:border-[rgba(5,205,153,0.18)] transition-all duration-200 hover:-translate-y-1 group">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tech.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-white text-xs font-semibold mb-1">{tech.name}</div>
                <div className="text-gray-500 text-xs leading-tight">{tech.desc}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4 font-display">Trusted by Farmers Across India</h2>
          <p className="text-gray-400">Real stories from real farmers using Verdex AI.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div key={t.name} className="glass-card p-6 hover:border-[rgba(5,205,153,0.15)] transition-all duration-200">
              <div className="flex mb-4">{[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}</div>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#05cd99] to-cyan-500 flex items-center justify-center text-black font-bold text-sm">{t.name[0]}</div>
                <div><div className="text-white font-medium text-sm">{t.name}</div><div className="text-gray-500 text-xs">{t.role}</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Responsible AI */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="glass-card p-8 border-amber-500/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0"><Shield className="w-6 h-6 text-white" /></div>
            <div><h3 className="text-xl font-bold text-white font-display">Responsible AI & Safety</h3><p className="text-gray-400 text-sm">Transparent, trustworthy, and ethical AI for agriculture.</p></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: 'Confidence Levels', desc: 'All AI predictions display confidence scores so you understand certainty.' },
              { title: 'AI Limitations', desc: 'We clearly communicate where AI may be less accurate and needs expert input.' },
              { title: 'Expert Advisories', desc: 'For severe cases, Verdex AI always recommends consulting certified agronomists.' },
            ].map(item => (
              <div key={item.title} className="bg-amber-500/3 border border-amber-500/8 rounded-xl p-4">
                <h4 className="text-amber-400 font-semibold text-sm mb-2">{item.title}</h4>
                <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card p-12 relative overflow-hidden gradient-border-animated">
            <div className="absolute inset-0 grid-overlay opacity-20" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-[rgba(5,205,153,0.3)] to-transparent" />
            <div className="relative z-10">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 font-display">Ready to Transform<br /><span className="holo-text">Your Farm?</span></h2>
              <p className="text-gray-400 text-lg mb-8">Join thousands of farmers using AI to grow smarter, save resources, and build a sustainable future.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => onNavigate('disease-detection')} className="btn-primary flex items-center justify-center gap-2 text-base py-3 px-6"><Cpu className="w-5 h-5" /> Start Free Analysis</button>
                <button onClick={() => onNavigate('farming-assistant')} className="btn-secondary flex items-center justify-center gap-2 text-base py-3 px-6">Talk to AI Assistant</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#05cd99] to-cyan-500 flex items-center justify-center"><Leaf className="w-4 h-4 text-black" /></div>
              <span className="text-white font-bold font-display">Verdex AI</span>
            </div>
            <p className="text-gray-500 text-sm text-center">AI-powered smart farming and sustainability intelligence platform.</p>
            <div className="flex items-center gap-2 text-gray-600 text-sm"><Shield className="w-4 h-4" /><span>Responsible AI Platform</span></div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800/25 text-center">
            <p className="text-gray-600 text-xs">&copy; 2026 Verdex AI — Intelligent Agriculture & Sustainability Platform</p>
            <p className="text-gray-700 text-xs mt-1">AI recommendations are for guidance only. Always consult certified agricultural experts for critical decisions.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
