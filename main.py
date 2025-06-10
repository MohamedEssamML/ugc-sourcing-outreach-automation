import asyncio
import json
from pyodide.http import pyfetch
import js
from email_sender import send_emails
from instagram_dm import send_dms
from instagram_scraper import scrape_instagram_profiles
from sheets_manager import save_to_sheets, update_creator_status
from main_scheduler import schedule_tasks

async def main():
    try:
        # Load config
        response = await pyfetch('config.json')
        config = json.loads(await response.text())
        
        # Schedule tasks (e.g., daily scraping, email sending)
        await schedule_tasks(config)
        
    except Exception as e:
        js.console.log(f"Error in main: {str(e)}")

if __name__ == "__main__":
    asyncio.ensure_future(main())