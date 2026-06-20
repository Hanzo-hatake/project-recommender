import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface RecommendationRequest {
  interests: string;
  skill_level: 'beginner' | 'intermediate' | 'advanced';
  preferred_domains?: string[];
  available_months?: number;
}

export interface RecommendedTopic {
  id: number;
  title: string;
  description: string;
  domain: string;
  difficulty: string;
  duration_months: number;
  tags: string[];
  match_score: number;
}

export const recommendationService = {
  getRecommendations: async (request: RecommendationRequest) => {
    const response = await api.post<RecommendedTopic[]>('/recommendations', request);
    return response.data;
  },

  getHealthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;

export interface AnalyticsData {
  total_topics: number
  domain_distribution: { domain: string; count: number }[]
  difficulty_distribution: { difficulty: string; count: number }[]
}

export const analyticsService = {
  getAnalytics: async (): Promise<AnalyticsData> => {
    const response = await api.get<AnalyticsData>('/analytics')
    return response.data
  },
}