use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Recommendation {
    pub id: i32,
    pub user_id: i32,
    pub topic_id: i32,
    pub match_score: f32,
    pub status: String,  // 'pending', 'accepted', 'rejected'
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RecommendationRequest {
    pub interests: String,
    pub skill_level: String,
    pub preferred_domains: Option<Vec<String>>,
    pub available_months: Option<i32>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RecommendedTopic {
    pub id: i32,
    pub title: String,
    pub description: String,
    pub domain: String,
    pub difficulty: String,
    pub duration_months: i32,
    pub tags: Option<Vec<String>>,
    pub match_score: f32,
}