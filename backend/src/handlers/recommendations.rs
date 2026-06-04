use actix_web::{web, HttpResponse, post};
use crate::models::{RecommendationRequest, RecommendedTopic};
use crate::services::RecommendationService;
use sqlx::PgPool;

#[post("/api/recommendations")]
pub async fn get_recommendations(
    body: web::Json<RecommendationRequest>,
    data: web::Data<(RecommendationService, PgPool)>,
) -> HttpResponse {
    let (rec_service, _pool) = data.get_ref();
    
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