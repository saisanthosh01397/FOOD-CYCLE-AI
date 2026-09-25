import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()
        
        errors = []
        page.on("pageerror", lambda err: errors.append(str(err)))
        page.on("console", lambda msg: errors.append(f"CONSOLE {msg.type}: {msg.text}") if msg.type in ["error"] else None)
        
        print("Navigating to login...")
        await page.goto("http://localhost:5173/login", wait_until="load")
        await page.fill("input[type='email']", "admin@foodcycleai.com")
        await page.fill("input[type='password']", "Admin@123")
        await page.click("button[type='submit']")
        await page.wait_for_url("**/dashboard", timeout=8000)
        
        print("Navigating to recovery...")
        await page.goto("http://localhost:5173/recovery", wait_until="load")
        await page.wait_for_selector("text=Recovery Strategies", timeout=5000)
        
        print("Submitting recovery form...")
        await page.click("button[type='submit']")
        await page.wait_for_selector("text=Optimal Pathway Selected", timeout=10000)
        
        print("Checking NPK values...")
        content = await page.content()
        if "Nitrogen (N)" in content and "Phosphorus (P)" in content and "Potassium (K)" in content:
            print("SUCCESS: Recovery page fully tested. Results are visibly displayed!")
        
        if errors:
            print("ERRORS ENCOUNTERED:")
            for e in errors:
                print(e)
                
        await browser.close()

asyncio.run(main())
