use crate::services::embeddings::EmbeddingService;
use sqlx::PgPool;

pub struct Recommender {
    embedding_service: EmbeddingService,
    db: PgPool,
}

impl Recommender {
    pub fn new(db: PgPool) -> Result<Self, Box<dyn std::error::Error>> {
        let embedding_service = EmbeddingService::new()?;
        Ok(Self {
            embedding_service,
            db,
        })
    }

    pub async fn get_recommendations(
        &self,
        user_interests: &str,
        top_n: usize,
    ) -> Result<Vec<TopicRecommendation>, Box<dyn std::error::Error>> {
        // 1. Generate embedding for user interests
        let user_embedding = self.embedding_service.encode(user_interests)?;

        // 2. Fetch all topics from database
        let topics = sqlx::query!(
            "SELECT id, title, description, embedding FROM topics WHERE is_active = true"
        )
        .fetch_all(&self.db)
        .await?;

        // 3. Calculate similarity scores
        let mut recommendations = Vec::new();

        for topic in topics {
            let topic_embedding: Vec<f32> = topic.embedding.expect("Topic missing embedding");

            let score = self
                .embedding_service
                .cosine_similarity(&user_embedding, &topic_embedding);

            recommendations.push(TopicRecommendation {
                id: topic.id,
                title: topic.title,
                description: topic.description,
                match_score: score,
            });
        }

        // 4. Sort by score (highest first)
        recommendations.sort_by(|a, b| b.match_score.partial_cmp(&a.match_score).unwrap());

        // 5. Return top N
        Ok(recommendations.into_iter().take(top_n).collect())
    }
}

#[derive(Debug)]
pub struct TopicRecommendation {
    pub id: i32,
    pub title: String,
    pub description: String,
    pub match_score: f32,
}
