use actix_web::{web, HttpResponse, post};
use crate::models::RecommendationRequest;
use crate::services::RecommendationService;

#[post("/api/recommendations")]
pub async fn get_recommendations(
    body: web::Json<RecommendationRequest>,
    rec_service: web::Data<RecommendationService>,
) -> HttpResponse {
    match rec_service.get_recommendations(
        &body.interests,
        &body.skill_level,
        body.preferred_domains.clone(),
        body.available_months,
        10, // top 10 recommendations
    ).await {
        Ok(recommendations) => {
            HttpResponse::Ok().json(recommendations)
        }
        Err(e) => {
            eprintln!("Error generating recommendations: {}", e);
            HttpResponse::InternalServerError()
                .json(serde_json::json!({
                    "error": "Failed to generate recommendations",
                    "details": e.to_string()
                }))
        }
    }
}

#[actix_web::get("/api/health")]
pub async fn health_check() -> HttpResponse {
    HttpResponse::Ok().json(serde_json::json!({
        "status": "healthy",
        "service": "Project Recommender API"
    }))
}

#[actix_web::get("/api/analytics")]
pub async fn get_analytics(
    pool: web::Data<sqlx::PgPool>,
) -> HttpResponse {
    let total_topics = sqlx::query_scalar::<_, i64>(
        "SELECT COUNT(*) FROM topics WHERE is_active = true"
    )
    .fetch_one(pool.get_ref())
    .await
    .unwrap_or(0);

    let domain_rows = sqlx::query!(
        "SELECT domain, COUNT(*) as count FROM topics WHERE is_active = true GROUP BY domain ORDER BY count DESC"
    )
    .fetch_all(pool.get_ref())
    .await
    .unwrap_or_default();

    let difficulty_rows = sqlx::query!(
        "SELECT difficulty, COUNT(*) as count FROM topics WHERE is_active = true GROUP BY difficulty"
    )
    .fetch_all(pool.get_ref())
    .await
    .unwrap_or_default();

    let domain_distribution: Vec<serde_json::Value> = domain_rows
        .iter()
        .map(|r| serde_json::json!({
            "domain": r.domain,
            "count": r.count.unwrap_or(0)
        }))
        .collect();

    let difficulty_distribution: Vec<serde_json::Value> = difficulty_rows
        .iter()
        .map(|r| serde_json::json!({
            "difficulty": r.difficulty,
            "count": r.count.unwrap_or(0)
        }))
        .collect();

    HttpResponse::Ok().json(serde_json::json!({
        "total_topics": total_topics,
        "domain_distribution": domain_distribution,
        "difficulty_distribution": difficulty_distribution,
    }))
}