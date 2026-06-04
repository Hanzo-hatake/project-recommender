use crate::models::{Topic, RecommendedTopic};
use crate::services::embeddings::EmbeddingService;
use sqlx::PgPool;

#[derive(Clone)]
pub struct RecommendationService {
    embedding_service: EmbeddingService,
    db: PgPool,
}

impl RecommendationService {
    pub fn new(embedding_service: EmbeddingService, db: PgPool) -> Self {
        Self {
            embedding_service,
            db,
        }
    }
    
    pub async fn get_recommendations(
        &self,
        student_interests: &str,
        skill_level: &str,
        preferred_domains: Option<Vec<String>>,
        available_months: Option<i32>,
        top_n: usize,
    ) -> Result<Vec<RecommendedTopic>, Box<dyn std::error::Error>> {
        println!("📊 Generating recommendations...");
        
        // [1] EMBED student input
        println!("  [1/5] Embedding student interests...");
        let student_embedding = self.embedding_service.encode(student_interests)?;
        
        // [2] FETCH all active topics from database
        println!("  [2/5] Fetching topics from database...");
        let topics = sqlx::query_as::<_, Topic>(
            "SELECT id, title, description, domain, difficulty, duration_months, 
                    tags, embedding, is_active, times_selected
             FROM topics WHERE is_active = true"
        )
        .fetch_all(&self.db)
        .await?;
        
        println!("  Found {} topics", topics.len());
        
        // [3] CALCULATE similarity scores
        println!("  [3/5] Calculating similarity scores...");
        let mut recommendations: Vec<RecommendedTopic> = topics
            .into_iter()
            .filter_map(|topic| {
                // Only process topics with embeddings
                let embedding = topic.embedding.as_ref()?;
                
                // Calculate similarity
                let similarity = self.embedding_service
                    .cosine_similarity(&student_embedding, embedding);
                
                Some(RecommendedTopic {
                    id: topic.id,
                    title: topic.title,
                    description: topic.description,
                    domain: topic.domain,
                    difficulty: topic.difficulty,
                    duration_months: topic.duration_months,
                    tags: topic.tags,
                    match_score: similarity,
                })
            })
            .collect();
        
        // [4] SORT by similarity (highest first)
        println!("  [4/5] Ranking topics by relevance...");
        recommendations.sort_by(|a, b| {
            b.match_score.partial_cmp(&a.match_score).unwrap()
        });
        
        // [5] APPLY FILTERS (academic constraints)
        println!("  [5/5] Applying academic filters...");
        
        // Filter by skill level match
        let difficulty_order = vec!["beginner", "intermediate", "advanced"];
        let student_level_idx = difficulty_order
            .iter()
            .position(|&d| d == skill_level)
            .unwrap_or(1);
        
        recommendations.retain(|rec| {
            let topic_level_idx = difficulty_order
                .iter()
                .position(|&d| d == &rec.difficulty.to_lowercase())
                .unwrap_or(1);
            
            // Allow same level or one level up
            topic_level_idx <= student_level_idx + 1
        });
        
        // Filter by preferred domains
        if let Some(ref domains) = preferred_domains {
            if !domains.is_empty() {
                recommendations.retain(|rec| {
                    domains.iter().any(|d| {
                        rec.domain.to_lowercase().contains(&d.to_lowercase())
                    })
                });
            }
        }
        
        // Filter by available time
        if let Some(months) = available_months {
            recommendations.retain(|rec| rec.duration_months <= months);
        }
        
        // Return top N
        let result = recommendations.into_iter().take(top_n).collect();
        
        println!("✅ Generated {} recommendations", result.len());
        
        Ok(result)
    }
}