export type Page = 'landing' | 'disease-detection' | 'farming-assistant' | 'weather-dashboard' | 'sustainability' | 'climate-simulation';

export interface DiseaseResult {
  name: string;
  confidence: number;
  severity: 'low' | 'moderate' | 'severe';
  causes: string[];
  treatments: string[];
  prevention: string[];
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  condition: string;
  location: string;
  forecast: ForecastDay[];
}

export interface ForecastDay {
  day: string;
  temp: number;
  condition: string;
  rainfall: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface CropRecommendation {
  name: string;
  benefit: string;
  waterReq: string;
  sustainability: 'high' | 'medium' | 'low';
  challenges: string[];
  score: number;
}

export interface SustainabilityMetrics {
  waterUsage: number;
  soilHealth: number;
  pollutionImpact: number;
  sustainabilityRating: number;
  environmentalRisk: number;
}
