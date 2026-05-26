use candle_core::{Device, Tensor};
use candle_nn::VarBuilder;
use candle_transformers::models::bert::{BertModel, Config};
use hf_hub::{Repo, RepoType, api::sync::Api};
use tokenizers::Tokenizer;

pub struct EmbeddingService {
    model: BertModel,
    tokenizer: Tokenizer,
    device: Device,
}

impl EmbeddingService {
    pub fn new() -> Result<Self, Box<dyn std::error::Error>> {
        // Use CPU (change to Device::new_cuda(0)? for GPU)
        let device = Device::Cpu;

        // Download model from HuggingFace
        let api = Api::new()?;
        let repo = api.repo(Repo::new(
            "sentence-transformers/all-MiniLM-L6-v2".to_string(),
            RepoType::Model,
        ));

        // Download model files
        let model_file = repo.get("model.safetensors")?;
        let tokenizer_file = repo.get("tokenizer.json")?;
        let config_file = repo.get("config.json")?;

        // Load tokenizer
        let tokenizer = Tokenizer::from_file(tokenizer_file)
            .map_err(|e| format!("Failed to load tokenizer: {}", e))?;

        // Load config
        let config: Config = serde_json::from_reader(std::fs::File::open(config_file)?)?;

        // Load model
        let vb = unsafe { VarBuilder::from_mmaped_safetensors(&[model_file], dtype, &device)? };
        let model = BertModel::load(vb, &config)?;

        Ok(Self {
            model,
            tokenizer,
            device,
        })
    }

    pub fn encode(&self, text: &str) -> Result<Vec<f32>, Box<dyn std::error::Error>> {
        // Tokenize input
        let encoding = self
            .tokenizer
            .encode(text, true)
            .map_err(|e| format!("Tokenization error: {}", e))?;

        let tokens = encoding.get_ids();
        let token_ids = Tensor::new(tokens, &self.device)?.unsqueeze(0)?; // Add batch dimension

        // Run through model
        let embeddings = self.model.forward(&token_ids)?;

        // Mean pooling (average across all tokens)
        let pooled = embeddings.mean(1)?;

        // Convert to Vec<f32>
        let embedding_vec = pooled.to_vec1::<f32>()?;

        Ok(embedding_vec)
    }

    pub fn cosine_similarity(&self, a: &[f32], b: &[f32]) -> f32 {
        let dot_product: f32 = a.iter().zip(b.iter()).map(|(x, y)| x * y).sum();
        let magnitude_a: f32 = a.iter().map(|x| x * x).sum::<f32>().sqrt();
        let magnitude_b: f32 = b.iter().map(|x| x * x).sum::<f32>().sqrt();

        dot_product / (magnitude_a * magnitude_b)
    }
}
