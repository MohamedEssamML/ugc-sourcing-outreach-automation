import asyncio
import js
from instagram_scraper import scrape_instagram_profiles
from email_sender import send_emails
from instagram_dm import send_dms
from sheets_manager import save_to_sheets

async def schedule_tasks(config):
    try:
        js.console.log("Running scheduled tasks...")
        creators = await scrape_instagram_profiles(config)
        await save_to_sheets(creators, config)
        await send_emails(config, creators)
        await send_dms(config)
        js.console.log("Scheduled tasks completed")
        
    except Exception as e:
        js.console.log(f"Error in scheduler: {str(e)}")