use backend::services::embeddings::EmbeddingService;
use sqlx::postgres::PgPoolOptions;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Load environment
    dotenv::dotenv().ok();
    let database_url = std::env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set in .env");
    
    // Connect to database
    println!("Connecting to database...");
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await?;
    
    // Initialize embedding service
    println!("Loading embedding model (this may take a minute)...");
    let embedding_service = EmbeddingService::new()?;
    println!("✓ Model loaded successfully!");
    
    // Fetch topics without embeddings
    let topics = sqlx::query!(
        "SELECT id, title, description FROM topics WHERE embedding IS NULL"
    )
    .fetch_all(&pool)
    .await?;
    
    if topics.is_empty() {
        println!("No topics need embeddings. All done!");
        return Ok(());
    }
    
    println!("Found {} topics to process\n", topics.len());
    
    // Generate embeddings
    for topic in &topics {
        let text = format!("{}. {}", topic.title, topic.description);
        
        println!("Processing topic {}: {}", topic.id, topic.title);
        
        let embedding = embedding_service.encode(&text)?;
        
        // Update database
        sqlx::query!(
            "UPDATE topics SET embedding = $1 WHERE id = $2",
            &embedding,
            topic.id
        )
        .execute(&pool)
        .await?;
        
        println!("  ✓ Embedding generated and saved\n");
    }
    
    println!("✅ All {} topics processed successfully!", topics.len());
    
    Ok(())
}