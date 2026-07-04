FROM rust:latest as builder

WORKDIR /app

RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    libopenblas-dev \
    cmake \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

COPY Cargo.toml Cargo.lock ./

# Create dummy src to cache dependencies
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release --bin backend 2>/dev/null || true
RUN rm -rf src

# Copy real source
COPY src ./src

# Touch to force rebuild
RUN touch src/main.rs

RUN cargo build --release --bin backend

FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y \
    libssl3 \
    ca-certificates \
    libopenblas0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/target/release/backend .

EXPOSE 8080

CMD ["./backend"]