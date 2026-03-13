mod router;
mod handlers;
mod config;
mod common;

use salvo::prelude::*;

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();

    let router = router::create_router();

    let acceptor = TcpListener::new("0.0.0.0:5800").bind().await;
    println!("blog-server running at http://127.0.0.1:5800");

    Server::new(acceptor).serve(router).await;
}