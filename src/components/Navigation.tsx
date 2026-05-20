import { useState } from 'react';
import { Leaf, BarChart3, MessageSquare, Cloud, Menu, X, ChevronDown } from 'lucide-react';
import type { Page, LanguageCode } from '../types';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

const navItems = [
  { id: 'landing' as Page, label: { en: 'Home', hi: 'होम', te: 'హోమ్' }, icon: Leaf },
  { id: 'disease-detection' as Page, label: { en: 'Crop Diagnostics', hi: 'फसल निदान', te: 'పంట నిర్ధారణ' }, icon: BarChart3 },
  { id: 'farming-assistant' as Page, label: { en: 'Expert Chat', hi: 'विशेषज्ञ चैट', te: 'నిపుణ చాట్' }, icon: MessageSquare },
  { id: 'weather-dashboard' as Page, label: { en: 'Weather', hi: 'मौसम', te: 'వాతావరణం' }, icon: Cloud },
];

const languages: Array<{ code: LanguageCode; label: string }> = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'te', label: 'తెలుగు' },
];

export default function Navigation({ currentPage, onNavigate, currentLanguage, onLanguageChange }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const getLabel = (labels: Record<string, string>) => labels[currentLanguage] || labels.en;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => onNavigate('landing')} className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-gray-900 font-bold text-lg leading-tight">VYRON</span>
              <span className="text-gray-500 text-xs font-medium">Agricultural Intelligence</span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {getLabel(item.label)}
                </button>
              );
            })}
          </div>

          {/* Language Selector & Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                {languages.find(l => l.code === currentLanguage)?.label}
                <ChevronDown className="w-4 h-4" />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg border border-gray-200 shadow-lg z-10">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setLangOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                        currentLanguage === lang.code
                          ? 'bg-green-50 text-green-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden btn-icon"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200 bg-gray-50 py-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {getLabel(item.label)}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
