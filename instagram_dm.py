import json
import js
from datetime import datetime, timedelta

async def send_dms(config, creators=None):
    try:
        if creators is None:
            creators = json.loads(js.localStorage.getItem('creators') or '[]')
        
        dm_template = "Hi @{handle}, we reached out via email about a UGC collaboration with [Brand]. Excited to connect! Reply here or email us."
        
        count = 0
        for creator in creators[:50]:
            if creator['status'] == 'Contacted' and not creator['follow_up'].startswith(datetime.now().strftime('%Y-%m-%d')):
                js.console.log(f"Sending DM to @{creator['handle']}: {dm_template.format(handle=creator['handle'])}")
                creator['status'] = 'DM Sent'
                creator['follow_up'] = (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d')
                count += 1
        
        js.localStorage.setItem('creators', json.dumps(creators))
        js.console.log(f"Sent {count} DMs (mock implementation)")
        
    except Exception as e:
        js.console.log(f"Error sending DMs: {str(e)}")