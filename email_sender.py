import json
import js
from datetime import datetime, timedelta

async def send_emails(config, creators=None):
    try:
        if creators is None:
            creators = json.loads(js.localStorage.getItem('creators') or '[]')
        
        # Mock email sending (replace with smtplib or Gmail API in production)
        email_template = """Hi {name},

We love your {niche} content on Instagram! At [Brand], we're building a community of authentic creators to showcase our products. We'd love to collaborate on UGC.

Details:
- Content: 1-minute video showcasing our product
- Compensation: $100 or free product
- Timeline: Content due by {due_date}

Reply to this email or DM us at [BrandHandle] to discuss!

Best,
[Your Name]
[Brand]"""
        
        count = 0
        for creator in creators[:100]:
            if creator['status'] == 'New':
                js.console.log(f"Sending email to {creator['email']}: {email_template.format(
                    name=creator['name'], niche=creator['niche'],
                    due_date=(datetime.now() + timedelta(days=14)).strftime('%Y-%m-%d'))}")
                creator['status'] = 'Contacted'
                creator['follow_up'] = (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d')
                count += 1
        
        js.localStorage.setItem('creators', json.dumps(creators))
        js.console.log(f"Sent {count} emails (mock implementation)")
        
    except Exception as e:
        js.console.log(f"Error sending emails: {str(e)}")