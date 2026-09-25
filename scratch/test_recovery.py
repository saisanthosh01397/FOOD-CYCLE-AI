import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()
        
        page.on("pageerror", lambda err: print("PAGE ERROR:", err))
        page.on("console", lambda msg: print("CONSOLE ERROR:", msg.text) if msg.type in ["error", "warning"] else None)
        
        print("Navigating to login...")
        await page.goto("http://localhost:5173/login", wait_until="load")
        await page.fill("input[type='email']", "admin@foodcycleai.com")
        await page.fill("input[type='password']", "Admin@123")
        await page.click("button[type='submit']")
        await page.wait_for_url("**/dashboard", timeout=8000)
        
        print("Navigating to recovery...")
        await page.goto("http://localhost:5173/recovery", wait_until="load")
        await asyncio.sleep(3)
        print("Recovery page content:")
        content = await page.content()
        print(content[:500])
        
        await browser.close()

asyncio.run(main())
