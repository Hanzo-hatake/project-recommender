use actix_web::HttpRequest;

pub struct ClerkAuthService {
    publishable_key: String,
}

impl ClerkAuthService {
    pub fn new(publishable_key: String) -> Self {
        Self { publishable_key }
    }
    
    pub fn extract_user_id_from_request(&self, req: &HttpRequest) -> Option<String> {
        // Extract from session/JWT that Clerk sets
        req.cookie("__session")
            .and_then(|c| Some(c.value().to_string()))
    }
}