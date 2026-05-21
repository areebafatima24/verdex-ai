import { useState } from 'react';
import Navigation from './components/Navigation';
import LandingPage from './pages/LandingPage';
import DiseaseDetectionPage from './pages/DiseaseDetectionPage';
import FarmingAssistantPage from './pages/FarmingAssistantPage';
import WeatherDashboardPage from './pages/WeatherDashboardPage';
import SustainabilityPage from './pages/SustainabilityPage';
import ClimateSimulationPage from './pages/ClimateSimulationPage';
import type { Page } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  const navigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Navigation currentPage={currentPage} onNavigate={navigate} />
      <main className="section-enter" key={currentPage}>
        {currentPage === 'landing' && <LandingPage onNavigate={navigate} />}
        {currentPage === 'disease-detection' && <DiseaseDetectionPage />}
        {currentPage === 'farming-assistant' && <FarmingAssistantPage />}
        {currentPage === 'weather-dashboard' && <WeatherDashboardPage />}
        {currentPage === 'sustainability' && <SustainabilityPage />}
        {currentPage === 'climate-simulation' && <ClimateSimulationPage />}
      </main>
    </div>
  );
}
