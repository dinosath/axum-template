mod app_state;
mod controllers;
mod models;
mod services;
mod server;


#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    server::run().await
}