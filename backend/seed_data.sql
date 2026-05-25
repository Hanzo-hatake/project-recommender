-- Insert sample project topics
INSERT INTO topics (title, description, domain, difficulty, duration_months, tags) VALUES
('Design and Implementation of a RESTful API using Microservices', 
 'Build a scalable backend system using microservices architecture with REST APIs, Docker containers, and service discovery.',
 'Backend Development', 'intermediate', 5, 
 ARRAY['Backend', 'APIs', 'Microservices', 'Docker']),

('Real-time Chat Application using WebSockets',
 'Develop a real-time messaging application with WebSocket protocol, user authentication, and message persistence.',
 'Web Development', 'beginner', 4,
 ARRAY['WebSockets', 'Real-time', 'Chat', 'Frontend']),

('Student Management System with Role-Based Access Control',
 'Create a comprehensive student management system with different access levels for students, teachers, and administrators.',
 'Full Stack Development', 'intermediate', 6,
 ARRAY['Full Stack', 'RBAC', 'Database', 'Security']),

('E-commerce Platform with Payment Integration',
 'Build an online store with product catalog, shopping cart, and integrated payment gateway.',
 'Web Development', 'advanced', 6,
 ARRAY['E-commerce', 'Payment', 'Frontend', 'Backend']),

('Machine Learning Model for Sentiment Analysis',
 'Develop a sentiment analysis system using NLP techniques to classify text as positive, negative, or neutral.',
 'Machine Learning', 'intermediate', 5,
 ARRAY['ML', 'NLP', 'Python', 'Sentiment Analysis']);

-- Insert admin user (password: admin123 - you'll hash this in code)
INSERT INTO users (email, password_hash, full_name, role) VALUES
('admin@mcpherson.edu.ng', 'PLACEHOLDER_HASH', 'System Administrator', 'admin');