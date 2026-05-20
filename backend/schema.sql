-- Users table (students and admins)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    matric_number VARCHAR(50) UNIQUE,
    role VARCHAR(20) NOT NULL DEFAULT 'student', -- 'student' or 'admin'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Project topics table
CREATE TABLE topics (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    domain VARCHAR(100) NOT NULL,
    difficulty VARCHAR(50) NOT NULL, -- 'beginner', 'intermediate', 'advanced'
    duration_months INTEGER NOT NULL,
    tags TEXT[], -- Array of tags
    embedding REAL[], -- Vector embedding (384 dimensions)
    is_active BOOLEAN DEFAULT true,
    times_selected INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student recommendations history
CREATE TABLE recommendations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    topic_id INTEGER REFERENCES topics(id),
    match_score REAL NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student profiles
CREATE TABLE student_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id),
    interests TEXT NOT NULL,
    skill_level VARCHAR(50) NOT NULL,
    preferred_domains TEXT[],
    available_months INTEGER,
    interests_embedding REAL[], -- Vector representation
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin activity logs
CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES users(id),
    action VARCHAR(255) NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX idx_topics_domain ON topics(domain);
CREATE INDEX idx_topics_difficulty ON topics(difficulty);
CREATE INDEX idx_recommendations_user ON recommendations(user_id);
CREATE INDEX idx_recommendations_status ON recommendations(status);