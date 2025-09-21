# 🐾 Quick Setup Guide for Clinic Owners

**Get your appointment booking system running in 15 minutes!**

## Step 1: Download & Extract Files ⬇️
- Download all the booking system files
- Extract to a folder on your computer
- You should see: `index.html`, `styles.css`, `script.js`, `config.js`, and documentation files

## Step 2: Customize Your Clinic Information 📝

Open the `config.js` file in any text editor and update these key settings:

### Basic Information
```javascript
clinicName: "Your Clinic Name Here",           // Your clinic's name
clinicSubtitle: "Book your pet's appointment", // Subtitle text
clinicPhone: "(555) 123-4567",                // Your phone number
clinicEmail: "appointments@yourclinic.com",    // Your email
```

### Business Hours
```javascript
businessHours: {
    monday:    { start: "09:00", end: "18:00", closed: false },
    tuesday:   { start: "09:00", end: "18:00", closed: false },
    wednesday: { start: "09:00", end: "18:00", closed: false },
    thursday:  { start: "09:00", end: "18:00", closed: false },
    friday:    { start: "09:00", end: "18:00", closed: false },
    saturday:  { start: "09:00", end: "16:00", closed: false },
    sunday:    { start: "10:00", end: "15:00", closed: true }   // Set closed: true if closed
},
```

### Your Services & Prices
```javascript
services: [
    {
        name: "General Checkup",
        description: "Comprehensive health examination",
        duration: 30,  // minutes
        price: "$75",  // your price
        available: true
    },
    // Add/remove services as needed
],
```

## Step 3: Set Up Zapier (5 minutes) 🔗

### Create Your Zapier Account
1. Go to https://zapier.com and sign up (free account works)
2. Click "Make a Zap"

### Set Up the Webhook
1. Search for "Webhooks by Zapier" and select it
2. Choose "Catch Hook" as the trigger
3. Click "Continue"
4. **Copy the webhook URL** - you'll need this!

### Add the Webhook to Your Config
1. Go back to your `config.js` file
2. Find this line: `zapierWebhookUrl: "https://hooks.zapier.com/..."`
3. Replace the URL with your webhook URL from Zapier

### Connect Your Actions
**For Email Confirmations:**
1. Add a new step in your Zap
2. Choose Gmail, Outlook, or your email service
3. Set up an email template using the booking data

**For Calendar Integration:**
1. Add Google Calendar or Outlook Calendar
2. Create new events with appointment details

## Step 4: Test Your Setup 🧪

1. Save your `config.js` file
2. Open `index.html` in your web browser
3. Make a test appointment booking
4. Check that Zapier received the data
5. Verify emails/calendar events are created

## Step 5: Go Live! 🚀

### Option A: Free Hosting (Recommended for beginners)
**GitHub Pages:**
1. Create account at github.com
2. Create new repository
3. Upload your files
4. Enable GitHub Pages in settings
5. Your site will be at `yourusername.github.io/repository-name`

**Netlify:**
1. Go to netlify.com
2. Drag and drop your folder
3. Get instant live site with HTTPS

### Option B: Your Existing Website
- Upload files to your website's folder
- Link to `index.html` from your main site

## 🎯 Quick Checklist

- [ ] Updated clinic name and contact info
- [ ] Set correct business hours
- [ ] Added your services and prices
- [ ] Created Zapier webhook
- [ ] Added webhook URL to config
- [ ] Tested a booking
- [ ] Uploaded files to hosting
- [ ] Shared booking link with clients

## ⚡ Pro Tips

**Block Time for Lunch:**
```javascript
blockedTimeSlots: {
    daily: [
        { start: "12:00", end: "13:00" } // Lunch break
    ]
}
```

**Holiday Closures:**
```javascript
blockedDates: [
    "2024-12-25", // Christmas
    "2024-07-04"  // July 4th
]
```

**Change Colors:**
```javascript
theme: {
    primaryColor: "#your-color-here"
}
```

## 🆘 Need Help?

**Common Issues:**
- **Bookings not working?** Check your Zapier webhook URL
- **Wrong business hours?** Verify the time format (24-hour: "09:00")
- **Services not showing?** Make sure `available: true`

**Testing:**
- Always test with a real booking before going live
- Check your email for test confirmations
- Verify calendar events are created correctly

---

**That's it! Your appointment booking system is ready to accept bookings! 🎉**

Share your booking page link with clients and start receiving online appointments!
