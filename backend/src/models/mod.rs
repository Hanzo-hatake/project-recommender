pub mod topic;
pub mod student_profile;
pub mod recommendation;

pub use topic::{Topic, CreateTopicRequest, TopicResponse};
pub use student_profile::{StudentProfile, StudentProfileRequest};
pub use recommendation::{Recommendation, RecommendationRequest, RecommendedTopic};