import { useState } from 'react';
import Navigation from './components/Navigation';
import LandingPage from './pages/LandingPage';
import DiseaseDetectionPage from './pages/DiseaseDetectionPage';
import FarmingAssistantPage from './pages/FarmingAssistantPage';
import WeatherDashboardPage from './pages/WeatherDashboardPage';
import type { Page, LanguageCode } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [language, setLanguage] = useState<LanguageCode>('en');

  const navigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentPage={currentPage}
        onNavigate={navigate}
        currentLanguage={language}
        onLanguageChange={setLanguage}
      />
      <main className="animate-fadeInUp" key={currentPage}>
        {currentPage === 'landing' && <LandingPage onNavigate={navigate} language={language} />}
        {currentPage === 'disease-detection' && <DiseaseDetectionPage language={language} />}
        {currentPage === 'farming-assistant' && <FarmingAssistantPage language={language} />}
        {currentPage === 'weather-dashboard' && <WeatherDashboardPage language={language} />}
      </main>
    </div>
  );
}
