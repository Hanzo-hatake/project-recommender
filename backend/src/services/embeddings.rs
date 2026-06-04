use candle_core::{Device, Tensor, DType};
use candle_nn::VarBuilder;
use candle_transformers::models::bert::{BertModel, Config};
use hf_hub::{api::sync::Api, Repo, RepoType};
use tokenizers::Tokenizer;
use std::sync::Arc;

pub struct EmbeddingService {
    model: Arc<BertModel>,
    tokenizer: Arc<Tokenizer>,
    device: Device,
}

impl Clone for EmbeddingService {
    fn clone(&self) -> Self {
        Self {
            model: Arc::clone(&self.model),
            tokenizer: Arc::clone(&self.tokenizer),
            device: Device::Cpu,
        }
    }
}

impl EmbeddingService {
    pub fn new() -> Result<Self, Box<dyn std::error::Error>> {
        println!("Initializing embedding service...");
        
        let device = Device::Cpu;
        println!("✓ Using CPU device");
        
        println!("Downloading model from HuggingFace (first time only)...");
        let api = Api::new()?;
        let repo = api.repo(Repo::new(
            "sentence-transformers/all-MiniLM-L6-v2".to_string(),
            RepoType::Model,
        ));
        
        println!("Downloading model weights...");
        let model_file = repo.get("model.safetensors")?;
        
        println!("Downloading tokenizer...");
        let tokenizer_file = repo.get("tokenizer.json")?;
        
        println!("Downloading config...");
        let config_file = repo.get("config.json")?;
        
        println!("✓ All files downloaded");
        
        println!("Loading tokenizer...");
        let tokenizer = Tokenizer::from_file(tokenizer_file)
            .map_err(|e| format!("Failed to load tokenizer: {}", e))?;
        println!("✓ Tokenizer loaded");
        
        println!("Loading model config...");
        let config: Config = serde_json::from_reader(
            std::fs::File::open(config_file)?
        )?;
        println!("✓ Config loaded");
        
        println!("Loading model weights...");
        let vb = unsafe { 
            VarBuilder::from_mmaped_safetensors(
                &[model_file], 
                DType::F32,
                &device
            )? 
        };
        
        println!("Building BERT model...");
        let model = BertModel::load(vb, &config)?;
        println!("✓ Model loaded successfully!");
        
        Ok(Self {
            model: Arc::new(model),
            tokenizer: Arc::new(tokenizer),
            device,
        })
    }
    
    pub fn encode(&self, text: &str) -> Result<Vec<f32>, Box<dyn std::error::Error>> {
        let encoding = self.tokenizer
            .encode(text, true)
            .map_err(|e| format!("Tokenization error: {}", e))?;
        
        let tokens = encoding.get_ids();
        let token_ids = Tensor::new(tokens, &self.device)?
            .unsqueeze(0)?;
        
        let token_type_ids = Tensor::zeros_like(&token_ids)?;
        
        let embeddings = self.model.forward(&token_ids, &token_type_ids, None)?;
        
        let pooled = embeddings.mean(1)?;
        let pooled = pooled.squeeze(0)?;
        let embedding_vec = pooled.to_vec1::<f32>()?;
        
        Ok(embedding_vec)
    }
    
    pub fn cosine_similarity(&self, a: &[f32], b: &[f32]) -> f32 {
        let dot_product: f32 = a.iter()
            .zip(b.iter())
            .map(|(x, y)| x * y)
            .sum();
        
        let magnitude_a: f32 = a.iter()
            .map(|x| x * x)
            .sum::<f32>()
            .sqrt();
            
        let magnitude_b: f32 = b.iter()
            .map(|x| x * x)
            .sum::<f32>()
            .sqrt();
        
        if magnitude_a == 0.0 || magnitude_b == 0.0 {
            0.0
        } else {
            dot_product / (magnitude_a * magnitude_b)
        }
    }
}