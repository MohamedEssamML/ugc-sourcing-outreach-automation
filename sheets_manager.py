import pandas as pd
import json
import js

async def save_to_sheets(creators, config):
    try:
        df = pd.DataFrame(creators)
        js.console.log("Saved to Google Sheets (mock):", df.to_dict())
        js.localStorage.setItem('creators', json.dumps(creators))
        
    except Exception as e:
        js.console.log(f"Error saving to Sheets: {str(e)}")

async def update_creator_status(email, status, config):
    try:
        creators = json.loads(js.localStorage.getItem('creators') or '[]')
        for creator in creators:
            if creator['email'] == email:
                creator['status'] = status
                creator['follow_up'] = (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d')
        js.localStorage.setItem('creators', json.dumps(creators))
        await save_to_sheets(creators, config)
        js.console.log(f"Updated status for {email} to {status}")
        
    except Exception as e:
        js.console.log(f"Error updating status: {str(e)}")