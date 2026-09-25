import asyncio
from playwright.async_api import async_playwright
import json
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()
        
        results = []
        errors = []
        
        page.on("console", lambda msg: errors.append(f"CONSOLE {msg.type}: {msg.text}") if msg.type in ['error', 'warning'] else None)
        page.on("pageerror", lambda err: errors.append(f"PAGE ERROR: {err}"))
        
        try:
            await page.goto("http://localhost:5173/", wait_until='load')
            await page.wait_for_selector("text=FoodCycle", timeout=5000)
            results.append({"page": "Landing", "result": "PASS", "issue": ""})
        except Exception as e:
            results.append({"page": "Landing", "result": "FAIL", "issue": str(e)})

        try:
            await page.goto("http://localhost:5173/login", wait_until='load')
            await page.fill("input[type='email']", "admin@foodcycleai.com")
            await page.fill("input[type='password']", "Admin@123")
            await page.click("button[type='submit']")
            await page.wait_for_url("**/dashboard", timeout=8000)
            results.append({"page": "Login", "result": "PASS", "issue": ""})
        except Exception as e:
            results.append({"page": "Login", "result": "FAIL", "issue": str(e)})

        try:
            await page.goto("http://localhost:5173/dashboard", wait_until='load')
            await page.wait_for_selector("text=Total Waste", timeout=5000)
            results.append({"page": "Dashboard", "result": "PASS", "issue": ""})
        except Exception as e:
            results.append({"page": "Dashboard", "result": "FAIL", "issue": str(e)})

        try:
            await page.goto("http://localhost:5173/prediction", wait_until='load')
            await page.wait_for_selector("text=Generate Prediction", timeout=5000)
            await page.click("button[type='submit']")
            await page.wait_for_selector("text=Predicted Waste Volume", timeout=8000)
            results.append({"page": "Prediction", "result": "PASS", "issue": ""})
        except Exception as e:
            results.append({"page": "Prediction", "result": "FAIL", "issue": str(e)})

        try:
            await page.goto("http://localhost:5173/vision", wait_until='load')
            await page.wait_for_selector("input[type='file']", timeout=5000)
            results.append({"page": "Vision", "result": "PASS", "issue": ""})
        except Exception as e:
            results.append({"page": "Vision", "result": "FAIL", "issue": str(e)})

        try:
            await page.goto("http://localhost:5173/recovery", wait_until='load')
            await page.wait_for_selector("text=Generate Recommendation", timeout=5000)
            await page.click("button[type='submit']")
            await page.wait_for_selector("text=Recommendation Generated", timeout=10000)
            results.append({"page": "Recovery", "result": "PASS", "issue": ""})
        except Exception as e:
            results.append({"page": "Recovery", "result": "FAIL", "issue": str(e)})

        try:
            await page.goto("http://localhost:5173/analytics", wait_until='load')
            await page.wait_for_selector(".recharts-wrapper", timeout=8000)
            results.append({"page": "Analytics", "result": "PASS", "issue": ""})
        except Exception as e:
            results.append({"page": "Analytics", "result": "FAIL", "issue": str(e)})

        try:
            await page.goto("http://localhost:5173/history", wait_until='load')
            await page.wait_for_selector("table", timeout=8000)
            results.append({"page": "History", "result": "PASS", "issue": ""})
        except Exception as e:
            results.append({"page": "History", "result": "FAIL", "issue": str(e)})

        for path in ["profile", "settings", "users"]:
            try:
                await page.goto(f"http://localhost:5173/{path}", wait_until='load')
                await page.wait_for_timeout(2000)
                results.append({"page": path.capitalize(), "result": "PASS", "issue": ""})
            except Exception as e:
                results.append({"page": path.capitalize(), "result": "FAIL", "issue": str(e)})

        try:
            page2 = await context.new_page()
            await page2.goto("http://127.0.0.1:8000/docs", wait_until='load')
            await page2.wait_for_selector(".swagger-ui", timeout=5000)
            results.append({"page": "Backend /docs", "result": "PASS", "issue": ""})
        except Exception as e:
            results.append({"page": "Backend /docs", "result": "FAIL", "issue": str(e)})

        print("--- RESULTS ---")
        for r in results:
            print(f"{r['page']} | {r['result']} | {r['issue']}")
            
        print("--- ERRORS ---")
        for e in errors:
            print(e)
            
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
