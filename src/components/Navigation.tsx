import { useState } from 'react';
import { Leaf, Cpu, CloudRain, BarChart3, Thermometer, Menu, X, Zap, ChevronRight } from 'lucide-react';
import type { Page } from '../types';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems = [
  { id: 'landing' as Page, label: 'Home', icon: Leaf },
  { id: 'disease-detection' as Page, label: 'Disease AI', icon: Cpu },
  { id: 'farming-assistant' as Page, label: 'AI Assistant', icon: Zap },
  { id: 'weather-dashboard' as Page, label: 'Weather', icon: CloudRain },
  { id: 'sustainability' as Page, label: 'Sustainability', icon: BarChart3 },
  { id: 'climate-simulation' as Page, label: 'Climate Sim', icon: Thermometer },
];

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="nav-glass border-b border-[rgba(5,205,153,0.06)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => onNavigate('landing')} className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#05cd99] to-cyan-500 flex items-center justify-center shadow-lg shadow-[rgba(5,205,153,0.2)] group-hover:shadow-[rgba(5,205,153,0.35)] transition-all duration-300">
                  <Leaf className="w-5 h-5 text-black" />
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#05cd99] to-cyan-500 blur-lg opacity-20 group-hover:opacity-35 transition-opacity" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-white font-bold text-lg tracking-tight font-display">Verdex</span>
                <span className="text-[#05cd99] font-bold text-lg tracking-tight font-display">AI</span>
              </div>
            </button>

            <div className="hidden lg:flex items-center gap-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button key={item.id} onClick={() => onNavigate(item.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'bg-[rgba(5,205,153,0.1)] text-[#05cd99] border border-[rgba(5,205,153,0.18)]' : 'text-gray-400 hover:text-[#05cd99] hover:bg-[rgba(5,205,153,0.05)]'}`}>
                    <Icon className="w-4 h-4" />{item.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => onNavigate('disease-detection')} className="hidden sm:flex items-center gap-1.5 btn-primary text-sm py-2 px-4">
                <Zap className="w-3.5 h-3.5" /> Launch AI <ChevronRight className="w-3 h-3" />
              </button>
              <button className="lg:hidden text-gray-400 hover:text-white transition-colors p-1" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-[rgba(5,205,153,0.05)] bg-gray-950/95 backdrop-blur-xl">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button key={item.id} onClick={() => { onNavigate(item.id); setMobileOpen(false); }} className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'bg-[rgba(5,205,153,0.1)] text-[#05cd99] border border-[rgba(5,205,153,0.18)]' : 'text-gray-400 hover:text-[#05cd99] hover:bg-[rgba(5,205,153,0.05)]'}`}>
                    <Icon className="w-4 h-4" />{item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
