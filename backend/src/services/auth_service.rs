use crate::models::{User, RegisterRequest, LoginRequest, AuthResponse, Claims};
use bcrypt::{hash, verify, DEFAULT_COST};
use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use sqlx::PgPool;

pub struct AuthService {
    db: PgPool,
    jwt_secret: String,
}

impl AuthService {
    pub fn new(db: PgPool, jwt_secret: String) -> Self {
        Self { db, jwt_secret }
    }
    
    pub async fn register(
        &self,
        req: RegisterRequest,
    ) -> Result<AuthResponse, Box<dyn std::error::Error>> {
        println!("📝 Registering user: {}", req.email);
        
        // Check if email already exists
        let existing = sqlx::query_scalar::<_, i32>(
            "SELECT COUNT(*) FROM users WHERE email = $1"
        )
        .bind(&req.email)
        .fetch_one(&self.db)
        .await?;
        
        if existing > 0 {
            return Err("Email already registered".into());
        }
        
        // Hash password
        let password_hash = hash(&req.password, DEFAULT_COST)?;
        
        // Insert user
        let user = sqlx::query_as::<_, User>(
            "INSERT INTO users (email, password_hash, full_name, matric_number, role, created_at)
             VALUES ($1, $2, $3, $4, 'student', NOW())
             RETURNING id, email, password_hash, full_name, matric_number, role, created_at"
        )
        .bind(&req.email)
        .bind(&password_hash)
        .bind(&req.full_name)
        .bind(&req.matric_number)
        .fetch_one(&self.db)
        .await?;
        
        // Generate JWT token
        let token = self.generate_token(user.id, &user.email, &user.role)?;
        
        println!("✅ User registered successfully: {}", user.email);
        
        Ok(AuthResponse {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
            token,
        })
    }
    
    pub async fn login(
        &self,
        req: LoginRequest,
    ) -> Result<AuthResponse, Box<dyn std::error::Error>> {
        println!("🔐 Logging in user: {}", req.email);
        
        // Fetch user by email
        let user = sqlx::query_as::<_, User>(
            "SELECT id, email, password_hash, full_name, matric_number, role, created_at
             FROM users WHERE email = $1"
        )
        .bind(&req.email)
        .fetch_optional(&self.db)
        .await?
        .ok_or("Invalid email or password")?;
        
        // Verify password
        let password_valid = verify(&req.password, &user.password_hash)?;
        if !password_valid {
            return Err("Invalid email or password".into());
        }
        
        // Generate JWT token
        let token = self.generate_token(user.id, &user.email, &user.role)?;
        
        println!("✅ User logged in successfully: {}", user.email);
        
        Ok(AuthResponse {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
            token,
        })
    }
    
    pub fn generate_token(
        &self,
        user_id: i32,
        email: &str,
        role: &str,
    ) -> Result<String, Box<dyn std::error::Error>> {
        let expiration = Utc::now() + Duration::hours(24);
        
        let claims = Claims {
            sub: user_id,
            email: email.to_string(),
            role: role.to_string(),
            exp: expiration.timestamp(),
        };
        
        let token = encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(self.jwt_secret.as_ref()),
        )?;
        
        Ok(token)
    }
    
    pub fn verify_token(&self, token: &str) -> Result<Claims, Box<dyn std::error::Error>> {
        let data = decode::<Claims>(
            token,
            &DecodingKey::from_secret(self.jwt_secret.as_ref()),
            &Validation::default(),
        )?;
        
        Ok(data.claims)
    }
}