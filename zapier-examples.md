# 🔗 Zapier Integration Examples

This document provides examples of how to set up common Zapier integrations for your vet clinic appointment booking system.

## 📧 Email Confirmation Setup

### Gmail Integration
**Trigger:** Webhooks by Zapier → Catch Hook
**Action:** Gmail → Send Email

**Email Template:**
```
Subject: Appointment Confirmed - {{clinic__name}}

Dear {{customer__firstName}} {{customer__lastName}},

Your appointment has been confirmed!

📅 **Appointment Details:**
• Service: {{service__name}}
• Date: {{date}}
• Time: {{time}}
• Duration: {{service__duration}} minutes
• Price: {{service__price}}

🐾 **Pet Information:**
• Pet Name: {{pet__name}}
• Pet Type: {{pet__type}}
• Breed: {{pet__breed}}

📞 **Clinic Contact:**
• Phone: {{clinic__phone}}
• Email: {{clinic__email}}

**Important Notes:**
• Please arrive 10 minutes early for check-in
• Bring your pet's vaccination records if this is your first visit
• To reschedule or cancel, please call us at least 24 hours in advance

{{#notes}}
**Your Notes:** {{notes}}
{{/notes}}

Thank you for choosing {{clinic__name}}!

Best regards,
The {{clinic__name}} Team

---
Booking ID: {{bookingId}}
```

## 📅 Google Calendar Integration

**Trigger:** Webhooks by Zapier → Catch Hook
**Action:** Google Calendar → Create Detailed Event

**Event Settings:**
- **Summary:** `{{service__name}} - {{pet__name}} ({{customer__firstName}} {{customer__lastName}})`
- **Start Date:** `{{date}}`
- **Start Time:** `{{time}}`
- **Duration:** `{{service__duration}} minutes`
- **Description:**
```
Client: {{customer__firstName}} {{customer__lastName}}
Phone: {{customer__phone}}
Email: {{customer__email}}

Pet: {{pet__name}} ({{pet__type}})
Breed: {{pet__breed}}

Service: {{service__name}}
Duration: {{service__duration}} minutes
Price: {{service__price}}

Notes: {{notes}}

Booking ID: {{bookingId}}
```

## 📊 Google Sheets Database

**Trigger:** Webhooks by Zapier → Catch Hook
**Action:** Google Sheets → Create Spreadsheet Row

**Column Mapping:**
| Column | Zapier Field |
|--------|--------------|
| Date | `{{date}}` |
| Time | `{{time}}` |
| Service | `{{service__name}}` |
| Duration | `{{service__duration}}` |
| Price | `{{service__price}}` |
| Client Name | `{{customer__firstName}} {{customer__lastName}}` |
| Email | `{{customer__email}}` |
| Phone | `{{customer__phone}}` |
| Pet Name | `{{pet__name}}` |
| Pet Type | `{{pet__type}}` |
| Pet Breed | `{{pet__breed}}` |
| Notes | `{{notes}}` |
| Booking ID | `{{bookingId}}` |
| Booking Time | `{{bookingDate}}` |
| Status | `{{status}}` |

## 📱 SMS Reminders (Twilio)

### Immediate Confirmation SMS
**Trigger:** Webhooks by Zapier → Catch Hook
**Action:** SMS by Zapier → Send SMS

**Message:**
```
Hi {{customer__firstName}}! Your appointment at {{clinic__name}} is confirmed for {{date}} at {{time}} for {{pet__name}}. Please arrive 10 minutes early. Questions? Call {{clinic__phone}}
```

### 24-Hour Reminder SMS
**Trigger:** Webhooks by Zapier → Catch Hook
**Action:** Delay by Zapier → Delay For (calculate time until 24 hours before appointment)
**Action:** SMS by Zapier → Send SMS

**Message:**
```
Reminder: {{pet__name}} has an appointment tomorrow at {{clinic__name}} on {{date}} at {{time}}. See you soon! {{clinic__phone}}
```

## 🗂️ Airtable CRM Integration

**Trigger:** Webhooks by Zapier → Catch Hook
**Action:** Airtable → Create Record

**Base Setup:**
Create tables for:
1. **Clients** - Store customer information
2. **Pets** - Store pet information  
3. **Appointments** - Store appointment details

**Field Mapping for Appointments Table:**
- Client Name: `{{customer__firstName}} {{customer__lastName}}`
- Email: `{{customer__email}}`
- Phone: `{{customer__phone}}`
- Pet Name: `{{pet__name}}`
- Pet Type: `{{pet__type}}`
- Service: `{{service__name}}`
- Date: `{{date}}`
- Time: `{{time}}`
- Status: `{{status}}`
- Booking ID: `{{bookingId}}`

## 💬 Slack Notifications

**Trigger:** Webhooks by Zapier → Catch Hook
**Action:** Slack → Send Channel Message

**Message:**
```
🐾 **New Appointment Booked!**

📅 **{{date}} at {{time}}**
👤 **Client:** {{customer__firstName}} {{customer__lastName}}
📞 **Phone:** {{customer__phone}}
🐕 **Pet:** {{pet__name}} ({{pet__type}})
🏥 **Service:** {{service__name}} ({{service__duration}} min)
💰 **Price:** {{service__price}}

{{#notes}}
📝 **Notes:** {{notes}}
{{/notes}}

📋 **Booking ID:** {{bookingId}}
```

## 🔄 Multi-Step Automation Example

### Complete Appointment Workflow
1. **Webhook Trigger** → Receive booking data
2. **Gmail** → Send confirmation email to client
3. **Google Calendar** → Create appointment event
4. **Google Sheets** → Log appointment in database
5. **Slack** → Notify staff of new booking
6. **Delay** → Wait until 24 hours before appointment
7. **SMS** → Send reminder to client

## 🛠️ Advanced Zapier Features

### Conditional Logic
Use Zapier's **Filter** or **Paths** to:
- Send different emails based on service type
- Apply different pricing for different pet types
- Route emergency appointments differently

### Data Formatting
Use Zapier's **Formatter** to:
- Convert date formats
- Calculate appointment end times
- Format phone numbers
- Clean up text data

### Error Handling
Set up error notifications:
- Email admin if booking fails
- Slack notification for webhook errors
- Backup data storage options

## 📋 Testing Your Zapier Setup

### Test Checklist
- [ ] Webhook receives all booking data correctly
- [ ] Email confirmations are sent and formatted properly
- [ ] Calendar events are created with correct details
- [ ] Database entries are accurate and complete
- [ ] SMS notifications work (if enabled)
- [ ] All team notifications are sent

### Sample Test Data
Use this data for testing your Zapier integration:

```json
{
  "service": {
    "id": "checkup",
    "name": "General Checkup",
    "duration": 30,
    "price": "$75"
  },
  "date": "2024-01-15",
  "time": "2:00 PM",
  "customer": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@email.com",
    "phone": "(555) 123-4567"
  },
  "pet": {
    "name": "Buddy",
    "type": "dog",
    "breed": "Golden Retriever"
  },
  "notes": "First visit, very friendly dog",
  "bookingId": "TEST123",
  "clinic": {
    "name": "VetCare Clinic",
    "phone": "(555) 987-6543",
    "email": "appointments@vetcare.com"
  }
}
```

## 🔧 Troubleshooting

### Common Issues
1. **Webhook not receiving data**
   - Check the webhook URL in config.js
   - Ensure HTTPS is being used
   - Verify Zapier webhook is active

2. **Missing data in actions**
   - Check field mappings in Zapier
   - Verify webhook data structure
   - Use Zapier's test feature

3. **Email formatting issues**
   - Test with simple text first
   - Check for special characters
   - Verify email template syntax

### Getting Help
- Use Zapier's built-in testing tools
- Check the Zapier Community forums
- Review webhook logs for errors
- Test each step individually

---

**Pro Tip:** Start with a simple email confirmation, then gradually add more integrations as you get comfortable with Zapier!
