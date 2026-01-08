use e2e::{base_url, browser, http_client, TestBrowser};
use rstest::rstest;

#[rstest]
#[tokio::test]
async fn test_homepage_loads(
    #[future] base_url: String,
    #[future] browser: TestBrowser,
) {
    let base_url = base_url.await;
    let browser = browser.await;
    
    let page = browser.browser.new_page().await.expect("Failed to create page");
    page.goto(&base_url, None).await.expect("Failed to navigate");

    let title = page.title().await.expect("Failed to get title");
    assert!(!title.is_empty(), "Page title should not be empty");
    
    browser.browser.close().await.expect("Failed to close browser");
}

#[rstest]
#[tokio::test]
async fn test_api_health(
    #[future] base_url: String,
    http_client: reqwest::Client,
) {
    let base_url = base_url.await;
    
    let response = http_client
        .get(format!("{}/api/health", base_url))
        .send()
        .await
        .expect("Failed to call health endpoint");
    
    assert!(response.status().is_success(), "Health endpoint should return success");
}
