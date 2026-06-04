mod config;
mod db;
mod handlers;
mod models;
mod services;

use actix_web::{web, App, HttpServer, middleware as actix_middleware};
use actix_cors::Cors;
use dotenv::dotenv;
use std::env;

use db::create_pool;
use services::EmbeddingService;
use services::RecommendationService;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Load environment variables
    dotenv().ok();
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL not found in .env");
    let server_host = env::var("SERVER_HOST").unwrap_or_else(|_| "127.0.0.1".to_string());
    let server_port = env::var("SERVER_PORT").unwrap_or_else(|_| "8080".to_string());
    
    println!("🚀 Starting Project Recommender API Server...\n");
    
    // Create database connection pool
    println!("📦 Initializing database connection...");
    let pool = create_pool(&database_url)
        .await
        .expect("Failed to create database pool");
    
    // Initialize embedding service
    println!("🤖 Loading embedding model...");
    let embedding_service = EmbeddingService::new()
        .expect("Failed to initialize embedding service");
    println!("✓ Embedding service ready\n");
    
    // Create recommendation service
    let rec_service = RecommendationService::new(embedding_service, pool.clone());
    
    let server_addr = format!("{}:{}", server_host, server_port);
    println!("📡 Server listening on: http://{}\n", server_addr);
    
    // Create HTTP server
    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);
        
        App::new()
            .app_data(web::Data::new((rec_service.clone(), pool.clone())))
            .wrap(actix_middleware::Logger::default())
            .wrap(cors)
            .service(handlers::get_recommendations)
            .service(handlers::health_check)
            .route("/", actix_web::web::get().to(|| async { "Project Recommender API" }))
    })
    .bind(&server_addr)?
    .run()
    .await
}