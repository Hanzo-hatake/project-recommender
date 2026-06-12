use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct User {
    pub id: i32,  // CHANGED: i32 → i64
    pub email: String,
    pub password_hash: String,
    pub full_name: String,
    pub matric_number: Option<String>,
    pub role: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RegisterRequest {
    pub email: String,
    pub password: String,
    pub full_name: String,
    pub matric_number: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AuthResponse {
    pub id: i32,  // CHANGED: i32 → i64
    pub email: String,
    pub full_name: String,
    pub role: String,
    pub token: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: i32,  // CHANGED: i32 → i64
    pub email: String,
    pub role: String,
    pub exp: i64,
}