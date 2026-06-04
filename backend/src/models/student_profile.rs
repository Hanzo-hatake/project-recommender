use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StudentProfile {
    pub id: i32,
    pub user_id: i32,
    pub interests: String,
    pub skill_level: String,  // 'beginner', 'intermediate', 'advanced'
    pub preferred_domains: Option<Vec<String>>,
    pub available_months: Option<i32>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct StudentProfileRequest {
    pub interests: String,
    pub skill_level: String,
    pub preferred_domains: Option<Vec<String>>,
    pub available_months: Option<i32>,
}