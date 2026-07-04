use actix_web::{web, HttpResponse, post};
use crate::models::RecommendationRequest;
use crate::services::RecommendationService;
use serde::{Deserialize, Serialize};

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
        10,
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

#[derive(Serialize)]
struct UserRole {
    is_admin: bool,
    clerk_id: String,
    email: String,
}

#[derive(Deserialize)]
pub struct UserInfo {
    clerk_id: String,
    email: String,
    full_name: Option<String>,
}

#[derive(Deserialize)]
pub struct MakeAdminRequest {
    email: String,
}

#[actix_web::post("/api/users/role")]
pub async fn get_user_role(
    pool: web::Data<sqlx::PgPool>,
    body: web::Json<UserInfo>,
) -> HttpResponse {
    // Try to find existing user by clerk_id
    let existing = sqlx::query!(
        "SELECT clerk_id, email, is_admin FROM users WHERE clerk_id = $1",
        body.clerk_id
    )
    .fetch_optional(pool.get_ref())
    .await;

    match existing {
        Ok(Some(user)) => {
            HttpResponse::Ok().json(serde_json::json!({
                "is_admin": user.is_admin.unwrap_or(false),
                "clerk_id": user.clerk_id,
                "email": user.email,
            }))
        }
        Ok(None) => {
            let name = body.full_name
                .clone()
                .filter(|s| !s.is_empty())
                .unwrap_or_else(|| "Student".to_string());

            let result = sqlx::query!(
                "INSERT INTO users (clerk_id, email, full_name, role, is_admin)
                 VALUES ($1, $2, $3, 'student', FALSE)
                 ON CONFLICT (email) DO UPDATE
                 SET clerk_id = EXCLUDED.clerk_id
                 RETURNING clerk_id, email, is_admin",
                body.clerk_id,
                body.email,
                name
            )
            .fetch_one(pool.get_ref())
            .await;

            match result {
                Ok(user) => HttpResponse::Ok().json(serde_json::json!({
                    "is_admin": user.is_admin.unwrap_or(false),
                    "clerk_id": user.clerk_id,
                    "email": user.email,
                })),
                Err(e) => {
                    eprintln!("DB Insert Error: {}", e);
                    HttpResponse::InternalServerError().json(serde_json::json!({
                        "error": e.to_string()
                    }))
                }
            }
        }
        Err(e) => {
            eprintln!("DB Query Error: {}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({
                "error": e.to_string()
            }))
        }
    }
}

#[actix_web::post("/api/users/make-admin")]
pub async fn make_admin(
    pool: web::Data<sqlx::PgPool>,
    body: web::Json<MakeAdminRequest>,
) -> HttpResponse {
    let result = sqlx::query!(
        "UPDATE users SET is_admin = TRUE WHERE email = $1 RETURNING clerk_id, email, is_admin",
        body.email
    )
    .fetch_optional(pool.get_ref())
    .await;

    match result {
        Ok(Some(user)) => HttpResponse::Ok().json(serde_json::json!({
            "message": "User promoted to admin",
            "is_admin": user.is_admin.unwrap_or(false),
            "email": user.email,
        })),
        Ok(None) => HttpResponse::NotFound().json(serde_json::json!({
            "error": "User not found. Make sure they have logged in at least once."
        })),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": e.to_string()
        }))
    }
}

#[actix_web::get("/api/admin/stats")]
pub async fn get_admin_stats(
    pool: web::Data<sqlx::PgPool>,
) -> HttpResponse {
    let total_topics = sqlx::query_scalar::<_, i64>(
        "SELECT COUNT(*) FROM topics"
    )
    .fetch_one(pool.get_ref())
    .await
    .unwrap_or(0);

    let active_topics = sqlx::query_scalar::<_, i64>(
        "SELECT COUNT(*) FROM topics WHERE is_active = true"
    )
    .fetch_one(pool.get_ref())
    .await
    .unwrap_or(0);

    let total_users = sqlx::query_scalar::<_, i64>(
        "SELECT COUNT(*) FROM users"
    )
    .fetch_one(pool.get_ref())
    .await
    .unwrap_or(0);

    let admin_users = sqlx::query_scalar::<_, i64>(
        "SELECT COUNT(*) FROM users WHERE is_admin = true"
    )
    .fetch_one(pool.get_ref())
    .await
    .unwrap_or(0);

    let student_users = sqlx::query_scalar::<_, i64>(
        "SELECT COUNT(*) FROM users WHERE is_admin = false OR is_admin IS NULL"
    )
    .fetch_one(pool.get_ref())
    .await
    .unwrap_or(0);

    HttpResponse::Ok().json(serde_json::json!({
        "total_topics": total_topics,
        "active_topics": active_topics,
        "total_users": total_users,
        "admin_users": admin_users,
        "student_users": student_users,
    }))
}

#[actix_web::get("/api/admin/topics")]
pub async fn get_admin_topics(
    pool: web::Data<sqlx::PgPool>,
) -> HttpResponse {
    let topics = sqlx::query!(
        "SELECT id, title, domain, difficulty, duration_months, is_active
         FROM topics
         ORDER BY id ASC"
    )
    .fetch_all(pool.get_ref())
    .await
    .unwrap_or_default();

    let topics_json: Vec<serde_json::Value> = topics
        .iter()
        .map(|t| serde_json::json!({
            "id": t.id,
            "title": t.title,
            "domain": t.domain,
            "difficulty": t.difficulty,
            "duration_months": t.duration_months,
            "status": if t.is_active.unwrap_or(false) { "ACTIVE" } else { "INACTIVE" }
        }))
        .collect();

    HttpResponse::Ok().json(topics_json)
}

#[actix_web::get("/api/admin/users")]
pub async fn get_admin_users(
    pool: web::Data<sqlx::PgPool>,
) -> HttpResponse {
    let users = sqlx::query!(
        "SELECT id, email, full_name, is_admin, role, created_at
         FROM users
         ORDER BY created_at DESC"
    )
    .fetch_all(pool.get_ref())
    .await
    .unwrap_or_default();

    let users_json: Vec<serde_json::Value> = users
        .iter()
        .map(|u| serde_json::json!({
            "id": u.id,
            "email": u.email,
            "full_name": u.full_name,
            "is_admin": u.is_admin.unwrap_or(false),
            "role": u.role,
            "created_at": u.created_at.map(|d| d.to_string()).unwrap_or_default()
        }))
        .collect();

    HttpResponse::Ok().json(users_json)
}