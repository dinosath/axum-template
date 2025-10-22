use sea_orm::DatabaseConnection;

#[derive(Clone)]
pub(crate) struct AppState {
    pub db: DatabaseConnection,
}