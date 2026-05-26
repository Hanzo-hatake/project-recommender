use sqlx::postgres::PgPoolOptions;
use your_backend_name::services::embeddings::EmbeddingService;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Load environment
    dotenv::dotenv().ok();
    let database_url = std::env::var("DATABASE_URL")?;

    // Connect to database
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await?;

    // Initialize embedding service
    println!("Loading embedding model...");
    let embedding_service = EmbeddingService::new()?;
    println!("Model loaded successfully!");

    // Fetch topics without embeddings
    let topics = sqlx::query!("SELECT id, title, description FROM topics WHERE embedding IS NULL")
        .fetch_all(&pool)
        .await?;

    println!("Found {} topics to process", topics.len());

    // Generate embeddings
    for topic in topics {
        let text = format!("{}. {}", topic.title, topic.description);

        println!(
            "Generating embedding for topic {}: {}",
            topic.id, topic.title
        );

        let embedding = embedding_service.encode(&text)?;

        // Update database
        sqlx::query!(
            "UPDATE topics SET embedding = $1 WHERE id = $2",
            &embedding,
            topic.id
        )
        .execute(&pool)
        .await?;

        println!("✓ Topic {} updated", topic.id);
    }

    println!("\n✅ All embeddings generated successfully!");

    Ok(())
}
