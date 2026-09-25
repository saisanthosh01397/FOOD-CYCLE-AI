from playwright.sync_api import sync_playwright
import time

def test_e2e():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # 1. Login
        print("Testing Login...")
        page.goto("http://localhost:5173/login")
        page.fill("input[type='email']", "admin@foodcycleai.com")
        page.fill("input[type='password']", "Admin@123")
        page.click("button[type='submit']")
        page.wait_for_url("**/dashboard")
        print("Login SUCCESS")
        
        # 2. Prediction
        print("Testing Prediction...")
        page.goto("http://localhost:5173/prediction")
        page.fill("input[type='number']", "150")
        page.click("button[type='submit']")
        page.wait_for_selector("text=Dish-Level Forecast", timeout=15000)
        print("Prediction SUCCESS")
        
        # 3. Recovery
        print("Testing Recovery...")
        page.goto("http://localhost:5173/recovery")
        page.fill("input[type='number']", "10") # quantity
        page.click("button[type='submit']")
        page.wait_for_selector("text=Optimal Pathway Selected", timeout=15000)
        print("Recovery SUCCESS")
        
        # 4. History
        print("Testing History...")
        page.goto("http://localhost:5173/history")
        page.wait_for_selector("text=Distributed Ledger")
        
        # We should see rows
        rows = page.locator("tbody tr").count()
        if rows > 0:
            print(f"History SUCCESS: Found {rows} logs")
        else:
            print("History FAILED: No logs found")

        # 5. Analytics
        print("Testing Analytics...")
        page.goto("http://localhost:5173/analytics")
        page.wait_for_selector("text=Total Waste")
        print("Analytics SUCCESS")

        browser.close()

if __name__ == "__main__":
    test_e2e()
