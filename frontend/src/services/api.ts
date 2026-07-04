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
export interface UserRole {
  is_admin: boolean
  clerk_id: string
  email: string
}

export const userService = {
  getUserRole: async (clerkId: string, email: string): Promise<UserRole> => {
    const response = await api.post<UserRole>('/users/role', { clerk_id: clerkId, email })
    return response.data
  },
}

export interface AdminStats {
  total_topics: number
  active_topics: number
  total_users: number
  admin_users: number
  student_users: number
}

export interface AdminTopic {
  id: number
  title: string
  domain: string
  difficulty: string
  duration_months: number
  status: string
}

export interface AdminUser {
  id: number
  email: string
  full_name: string
  is_admin: boolean
  role: string
  created_at: string
}

export const adminService = {
  getStats: async (): Promise<AdminStats> => {
    const response = await api.get<AdminStats>('/admin/stats')
    return response.data
  },
  getTopics: async (): Promise<AdminTopic[]> => {
    const response = await api.get<AdminTopic[]>('/admin/topics')
    return response.data
  },
  getUsers: async (): Promise<AdminUser[]> => {
    const response = await api.get<AdminUser[]>('/admin/users')
    return response.data
  },
}