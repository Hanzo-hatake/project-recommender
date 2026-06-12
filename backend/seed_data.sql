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

 -- Insert 25 additional sample project topics
INSERT INTO topics (title, description, domain, difficulty, duration_months, tags) VALUES

-- Backend Development (6 topics)
('Distributed Cache Management System using Redis and Cluster Mode',
 'Build a distributed caching layer with Redis cluster support, implementing cache invalidation strategies, consistency protocols, and monitoring for high-throughput applications.',
 'Backend Development', 'advanced', 6,
 ARRAY['Redis', 'Caching', 'Distributed Systems', 'Performance']),

('GraphQL API Gateway with Schema Stitching',
 'Design and implement a GraphQL gateway that aggregates multiple microservices, implements schema stitching, authentication, rate limiting, and request batching.',
 'Backend Development', 'advanced', 5,
 ARRAY['GraphQL', 'API Gateway', 'Microservices', 'TypeScript']),

('Message Queue System using RabbitMQ',
 'Develop a robust message queue implementation for asynchronous task processing with dead letter queues, retry mechanisms, and monitoring dashboards.',
 'Backend Development', 'intermediate', 5,
 ARRAY['RabbitMQ', 'Message Queue', 'Async Processing', 'Backend']),

('OAuth 2.0 Identity Provider Implementation',
 'Build a complete OAuth 2.0 authorization server supporting multiple grant types, PKCE flow, token refresh, and integration with external identity providers.',
 'Backend Development', 'advanced', 6,
 ARRAY['OAuth', 'Security', 'Authentication', 'Authorization']),

('Real-time Analytics Dashboard Backend',
 'Create a scalable backend for real-time data aggregation and analytics using stream processing, supporting multiple data sources and WebSocket connections.',
 'Backend Development', 'intermediate', 5,
 ARRAY['Analytics', 'Real-time', 'Stream Processing', 'Backend']),

('Event Sourcing Architecture Implementation',
 'Implement event sourcing pattern with event store, event replay, CQRS pattern, and eventual consistency handling for complex domain models.',
 'Backend Development', 'advanced', 6,
 ARRAY['Event Sourcing', 'CQRS', 'Domain-Driven Design', 'Architecture']),

-- Frontend Development (6 topics)
('Progressive Web App with Offline Support',
 'Build a PWA with service workers, offline data synchronization, background sync, and native-like mobile experience across all devices.',
 'Frontend Development', 'intermediate', 5,
 ARRAY['PWA', 'React', 'Service Workers', 'Offline']),

('Real-time Collaborative Editor',
 'Develop a web-based document editor supporting simultaneous multi-user editing with operational transformation, conflict resolution, and live cursors.',
 'Frontend Development', 'advanced', 6,
 ARRAY['React', 'WebSocket', 'Collaboration', 'Real-time']),

('Advanced Data Visualization Dashboard',
 'Create interactive data visualization dashboards with D3.js/Three.js, supporting real-time updates, drill-down capabilities, and custom chart types.',
 'Frontend Development', 'intermediate', 5,
 ARRAY['D3.js', 'Visualization', 'React', 'Data Analytics']),

('State Management System using Redux',
 'Build a scalable state management solution with Redux, middleware support, time-travel debugging, and DevTools integration for complex applications.',
 'Frontend Development', 'intermediate', 4,
 ARRAY['Redux', 'State Management', 'React', 'Frontend']),

('Accessible Component Library',
 'Create a comprehensive accessible React component library following WCAG 2.1 guidelines, with keyboard navigation, screen reader support, and documentation.',
 'Frontend Development', 'intermediate', 5,
 ARRAY['React', 'Accessibility', 'Components', 'A11y']),

('3D Interactive Web Experience',
 'Build immersive 3D web experiences using Three.js/Babylon.js, supporting animation, physics simulation, and user interaction.',
 'Frontend Development', 'advanced', 6,
 ARRAY['Three.js', 'WebGL', 'Animation', '3D Graphics']),

-- Full Stack Development (4 topics)
('E-learning Platform with Progress Tracking',
 'Develop a complete e-learning system with course management, video streaming, quizzes, progress tracking, and AI-powered recommendations.',
 'Full Stack Development', 'intermediate', 6,
 ARRAY['Full Stack', 'Education', 'Video Streaming', 'React', 'Node.js']),

('Social Network Platform',
 'Build a social networking application with user profiles, feeds, real-time notifications, messaging, and content recommendation algorithms.',
 'Full Stack Development', 'advanced', 6,
 ARRAY['Full Stack', 'Social Network', 'Real-time', 'Recommendation']),

('Healthcare Appointment System',
 'Create a complete healthcare booking system with appointment scheduling, doctor profiles, patient records, notifications, and payment integration.',
 'Full Stack Development', 'intermediate', 6,
 ARRAY['Full Stack', 'Healthcare', 'Scheduling', 'Payment Gateway']),

('Project Management Tool',
 'Develop a Jira-like project management platform with kanban boards, sprint planning, time tracking, team collaboration, and reporting.',
 'Full Stack Development', 'intermediate', 6,
 ARRAY['Full Stack', 'Project Management', 'Collaboration', 'React']),

-- Machine Learning (4 topics)
('Computer Vision Object Detection System',
 'Implement an object detection system using YOLO/Faster R-CNN for real-time detection, with training pipeline and performance optimization.',
 'Machine Learning', 'advanced', 6,
 ARRAY['Computer Vision', 'Deep Learning', 'YOLO', 'PyTorch']),

('Natural Language Processing Chatbot',
 'Build an intelligent chatbot using transformer models (BERT/GPT), fine-tuning, intent classification, and context management for customer support.',
 'Machine Learning', 'intermediate', 5,
 ARRAY['NLP', 'Transformers', 'Chatbot', 'Deep Learning']),

('Time Series Forecasting for Stock Prices',
 'Develop a time series forecasting model using LSTM/GRU networks for stock price prediction with backtesting and performance metrics.',
 'Machine Learning', 'intermediate', 5,
 ARRAY['Time Series', 'LSTM', 'Forecasting', 'Finance']),

('Recommender System using Collaborative Filtering',
 'Build a recommendation engine using matrix factorization, deep learning approaches, and A/B testing framework for movie/product recommendations.',
 'Machine Learning', 'intermediate', 5,
 ARRAY['Recommendation', 'Collaborative Filtering', 'Deep Learning', 'Python']),

-- Mobile Development (3 topics)
('Cross-Platform Mobile App with Flutter',
 'Develop a feature-rich mobile application using Flutter supporting iOS and Android with native plugins, offline support, and push notifications.',
 'Mobile Development', 'intermediate', 5,
 ARRAY['Flutter', 'Mobile', 'Cross-platform', 'Dart']),

('iOS App with SwiftUI',
 'Create a modern iOS application using SwiftUI, Core Data persistence, URL schemes, and integration with native iOS features.',
 'Mobile Development', 'intermediate', 4,
 ARRAY['iOS', 'SwiftUI', 'Swift', 'Mobile']),

('Real-time Location Tracking App',
 'Build a location-based service app with real-time GPS tracking, geofencing, route optimization, and background location updates.',
 'Mobile Development', 'intermediate', 5,
 ARRAY['Mobile', 'Location Services', 'GPS', 'Real-time']),

-- Data Science (3 topics)
('Customer Churn Prediction Model',
 'Develop a machine learning pipeline to predict customer churn using feature engineering, model selection, hyperparameter tuning, and business metrics.',
 'Data Science', 'intermediate', 5,
 ARRAY['Machine Learning', 'Churn Prediction', 'Classification', 'Python']),

('Big Data Processing with Apache Spark',
 'Build a big data processing pipeline using Spark for ETL operations, distributed computing, and large-scale data analysis.',
 'Data Science', 'intermediate', 5,
 ARRAY['Apache Spark', 'Big Data', 'ETL', 'Python']),

('Data Pipeline and Warehouse Design',
 'Design and implement a data warehouse with ETL pipelines, data quality checks, and analytics-ready schemas for business intelligence.',
 'Data Science', 'intermediate', 6,
 ARRAY['Data Warehouse', 'ETL', 'SQL', 'Analytics']),

-- Cloud & DevOps (3 topics)
('Kubernetes Microservices Orchestration',
 'Deploy and manage microservices on Kubernetes with service mesh (Istio), monitoring, logging, and auto-scaling configurations.',
 'Cloud & DevOps', 'advanced', 6,
 ARRAY['Kubernetes', 'Microservices', 'Docker', 'DevOps']),

('CI/CD Pipeline Implementation',
 'Build automated CI/CD pipelines using Jenkins/GitLab CI for continuous integration, testing, and deployment across environments.',
 'Cloud & DevOps', 'intermediate', 5,
 ARRAY['CI/CD', 'Jenkins', 'DevOps', 'Automation']),

('Infrastructure as Code with Terraform',
 'Implement Infrastructure as Code approach using Terraform for cloud resource provisioning, management, and disaster recovery.',
 'Cloud & DevOps', 'intermediate', 5,
 ARRAY['Terraform', 'IaC', 'Cloud', 'DevOps']);

-- Insert admin user (password: admin123 - you'll hash this in code)
INSERT INTO users (email, password_hash, full_name, role) VALUES
('admin@mcpherson.edu.ng', 'PLACEHOLDER_HASH', 'System Administrator', 'admin');