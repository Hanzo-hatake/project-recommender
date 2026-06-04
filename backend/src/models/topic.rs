use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Topic {
    pub id: i32,
    pub title: String,
    pub description: String,
    pub domain: String,
    pub difficulty: String,
    pub duration_months: i32,
    pub tags: Option<Vec<String>>,
    pub embedding: Option<Vec<f32>>,
    pub is_active: bool,
    pub times_selected: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateTopicRequest {
    pub title: String,
    pub description: String,
    pub domain: String,
    pub difficulty: String,
    pub duration_months: i32,
    pub tags: Option<Vec<String>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TopicResponse {
    pub id: i32,
    pub title: String,
    pub description: String,
    pub domain: String,
    pub difficulty: String,
    pub duration_months: i32,
    pub tags: Option<Vec<String>>,
}