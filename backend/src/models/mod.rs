pub mod topic;
pub mod student_profile;
pub mod recommendation;
pub mod user;

pub use topic::{Topic, CreateTopicRequest, TopicResponse};
pub use student_profile::{StudentProfile, StudentProfileRequest};
pub use recommendation::{Recommendation, RecommendationRequest, RecommendedTopic};
pub use user::{User, RegisterRequest, LoginRequest, AuthResponse, Claims};