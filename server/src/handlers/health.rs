use salvo::prelude::*;
use serde::Serialize;

#[derive(Serialize)]
struct HealthResponse {
    code: i32,
    message: String,
    data: &'static str,
}

#[handler]
pub async fn healthz(res: &mut Response) {
    let body = HealthResponse {
        code: 0,
        message: "success".to_string(),
        data: "ok",
    };

    res.render(Json(body));
}