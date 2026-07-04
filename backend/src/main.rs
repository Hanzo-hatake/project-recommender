mod config;
mod db;
mod handlers;
mod models;
mod services;
use actix_web::{web, App, HttpServer, middleware as actix_middleware};
use actix_cors::Cors;
use dotenv::dotenv;
use std::env;
use log::info;
use db::create_pool;
use services::{EmbeddingService, RecommendationService};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL not found in .env");
    let server_host = env::var("SERVER_HOST").unwrap_or_else(|_| "127.0.0.1".to_string());
    let server_port = env::var("SERVER_PORT").unwrap_or_else(|_| "8080".to_string());

    info!("🚀 Starting Project Recommender API Server...\n");

    info!("📦 Initializing database connection...");
    let pool = create_pool(&database_url)
        .await
        .expect("Failed to create database pool");
    info!("✓ Database connection established");

    info!("🤖 Loading embedding model...");
    let embedding_service = EmbeddingService::new()
        .expect("Failed to initialize embedding service");
    info!("✓ Embedding service ready\n");

    let rec_service = RecommendationService::new(embedding_service.clone(), pool.clone());

    let server_addr = format!("{}:{}", server_host, server_port);
    info!("📡 Server listening on: http://{}", server_addr);
    info!("✅ Clerk authentication enabled\n");

    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);

        App::new()
            .app_data(web::Data::new(rec_service.clone()))
            .app_data(web::Data::new(pool.clone()))   // ← ADD THIS
            .wrap(actix_middleware::Logger::default())
            .wrap(cors)
            .service(handlers::health_check)
            .service(handlers::get_recommendations)
            .service(handlers::get_analytics)
            .service(handlers::get_user_role)
            .service(handlers::make_admin)
            .service(handlers::get_admin_stats)
            .service(handlers::get_admin_topics)
            .service(handlers::get_admin_users)
            .route("/api/auth/status", actix_web::web::get().to(auth_status))
            .route("/", actix_web::web::get().to(|| async { "Project Recommender API - Powered by Clerk" }))
    })
    .bind(&server_addr)?
    .run()
    .await
}

async fn auth_status() -> actix_web::HttpResponse {
    actix_web::HttpResponse::Ok().json(serde_json::json!({
        "auth": "Clerk",
        "status": "enabled"
    }))
}