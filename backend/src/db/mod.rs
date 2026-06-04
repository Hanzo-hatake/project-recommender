// Database module placeholder
pub mod connection;

pub use connection::create_pool;
pub use sqlx::postgres::PgPool;