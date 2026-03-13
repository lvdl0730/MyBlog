use salvo::prelude::*;
use crate::handlers::health::healthz;

pub fn create_router() -> Router {
    Router::new()
        .push(Router::with_path("healthz").get(healthz))
}