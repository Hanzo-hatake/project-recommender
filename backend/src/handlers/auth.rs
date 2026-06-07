use actix_web::{web, HttpResponse, post};
use crate::models::{RegisterRequest, LoginRequest};
use crate::services::AuthService;

#[post("/api/auth/register")]
pub async fn register(
    body: web::Json<RegisterRequest>,
    auth_service: web::Data<AuthService>,
) -> HttpResponse {
    match auth_service.register(body.into_inner()).await {
        Ok(response) => HttpResponse::Created().json(response),
        Err(e) => {
            eprintln!("Registration error: {}", e);
            HttpResponse::BadRequest().json(serde_json::json!({
                "error": "Registration failed",
                "details": e.to_string()
            }))
        }
    }
}

#[post("/api/auth/login")]
pub async fn login(
    body: web::Json<LoginRequest>,
    auth_service: web::Data<AuthService>,
) -> HttpResponse {
    match auth_service.login(body.into_inner()).await {
        Ok(response) => HttpResponse::Ok().json(response),
        Err(e) => {
            eprintln!("Login error: {}", e);
            HttpResponse::Unauthorized().json(serde_json::json!({
                "error": "Login failed",
                "details": "Invalid email or password"
            }))
        }
    }
}