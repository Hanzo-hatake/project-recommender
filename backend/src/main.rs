mod config;
mod db;
mod handlers;
mod models;
mod services;
mod middleware;

use actix_web::{web, App, HttpServer, middleware as actix_middleware};
use actix_cors::Cors;
use dotenv::dotenv;
use std::env;

use db::create_pool;
use services::{EmbeddingService, RecommendationService, AuthService};
use middleware::AuthMiddleware;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL not found in .env");
    let jwt_secret = env::var("JWT_SECRET")
        .expect("JWT_SECRET not found in .env");
    let server_host = env::var("SERVER_HOST").unwrap_or_else(|_| "127.0.0.1".to_string());
    let server_port = env::var("SERVER_PORT").unwrap_or_else(|_| "8080".to_string());
    
    println!("🚀 Starting Project Recommender API Server...\n");
    
    println!("📦 Initializing database connection...");
    let pool = create_pool(&database_url)
        .await
        .expect("Failed to create database pool");
    
    println!("🤖 Loading embedding model...");
    let embedding_service = EmbeddingService::new()
        .expect("Failed to initialize embedding service");
    println!("✓ Embedding service ready\n");
    
    let rec_service = RecommendationService::new(embedding_service.clone(), pool.clone());
    let auth_service = AuthService::new(pool.clone(), jwt_secret);
    let auth_middleware = AuthMiddleware::new(auth_service.clone());
    
    let server_addr = format!("{}:{}", server_host, server_port);
    println!("📡 Server listening on: http://{}\n", server_addr);
    
    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);
        
        App::new()
            .app_data(web::Data::new(rec_service.clone()))
            .app_data(web::Data::new(auth_service.clone()))
            .wrap(actix_middleware::Logger::default())
            .wrap(cors)
            // Public endpoints (no auth required)
            .service(handlers::get_recommendations)
            .service(handlers::health_check)
            .service(handlers::register)
            .service(handlers::login)
            .route("/", actix_web::web::get().to(|| async { "Project Recommender API" }))
    })
    .bind(&server_addr)?
    .run()
    .await
}