# VetClinic Appointment Booking System

A modern, sleek appointment booking system designed specifically for veterinary clinics. This system provides a Calendly-like experience that integrates seamlessly with Zapier for automated appointment management.

## ✨ Features

- **Modern, Responsive Design** - Beautiful UI that works perfectly on all devices
- **Easy Clinic Customization** - Simple configuration file for each clinic
- **Calendly-Style Booking** - Intuitive date and time selection
- **Zapier Integration** - Automated appointment processing and notifications
- **No Server Required** - Static files that can be hosted anywhere
- **Form Validation** - Comprehensive client-side validation
- **Mobile Optimized** - Perfect experience on smartphones and tablets

## 🚀 Quick Start

### 1. Download the Files
Copy all files to your web hosting directory:
- `index.html` - Main booking interface
- `styles.css` - Styling and responsive design
- `script.js` - Booking functionality
- `config.js` - Clinic configuration
- `README.md` - This documentation

### 2. Configure Your Clinic
Edit the `config.js` file to customize for your clinic:

```javascript
const CLINIC_CONFIG = {
    clinicName: "Your Clinic Name",
    clinicSubtitle: "Book your pet's appointment",
    clinicPhone: "(555) 123-4567",
    clinicEmail: "appointments@yourclinic.com",
    zapierWebhookUrl: "YOUR_ZAPIER_WEBHOOK_URL_HERE",
    // ... more configuration options
};
```

### 3. Set Up Zapier Integration
1. Create a Zapier account at https://zapier.com
2. Create a new Zap with "Webhooks by Zapier" as the trigger
3. Choose "Catch Hook" and copy the webhook URL
4. Paste the webhook URL into your `config.js` file
5. Connect your desired actions (email, calendar, CRM, etc.)

### 4. Deploy
Upload the files to any web hosting service:
- **GitHub Pages** - Free hosting for static sites
- **Netlify** - Easy drag-and-drop deployment
- **Vercel** - Simple static site hosting
- **Traditional Web Hosting** - Any hosting provider

## ⚙️ Configuration Guide

### Clinic Information
```javascript
clinicName: "VetCare Clinic",
clinicSubtitle: "Book your pet's appointment",
clinicPhone: "(555) 123-4567",
clinicEmail: "appointments@vetcare.com",
clinicAddress: "123 Pet Street, Animal City, AC 12345",
```

### Business Hours
```javascript
businessHours: {
    monday: { start: "09:00", end: "18:00", closed: false },
    tuesday: { start: "09:00", end: "18:00", closed: false },
    // Set closed: true for days you're closed
    sunday: { start: "10:00", end: "15:00", closed: false }
},
```

### Services
```javascript
services: [
    {
        id: "checkup",
        name: "General Checkup",
        description: "Comprehensive health examination for your pet",
        duration: 30, // minutes
        price: "$75",
        available: true
    },
    // Add more services as needed
],
```

### Appointment Settings
```javascript
appointmentSettings: {
    slotDuration: 30, // minutes per appointment
    bufferTime: 15, // minutes between appointments
    advanceBookingDays: 30, // how far ahead clients can book
    minAdvanceHours: 2, // minimum notice required
    maxAppointmentsPerDay: 20
},
```

### Blocked Dates and Times
```javascript
// Block specific dates (holidays, etc.)
blockedDates: [
    "2024-12-25", // Christmas
    "2024-01-01"  // New Year
],

// Block recurring time slots
blockedTimeSlots: {
    daily: [
        { start: "12:00", end: "13:00" } // Lunch break
    ],
    wednesday: [
        { start: "17:00", end: "18:00" } // Staff meeting
    ]
}
```

## 🔗 Zapier Integration Setup

### Step 1: Create the Webhook
1. In Zapier, create a new Zap
2. Choose "Webhooks by Zapier" as the trigger
3. Select "Catch Hook"
4. Copy the webhook URL to your `config.js`

### Step 2: Test the Integration
1. Make a test booking on your site
2. Check that Zapier received the data
3. The webhook will receive this data structure:

```json
{
    "service": {
        "id": "checkup",
        "name": "General Checkup",
        "duration": 30,
        "price": "$75"
    },
    "date": "2024-01-15",
    "time": "10:00 AM",
    "customer": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "phone": "(555) 123-4567"
    },
    "pet": {
        "name": "Buddy",
        "type": "dog",
        "breed": "Golden Retriever"
    },
    "notes": "First visit",
    "bookingId": "ABC123",
    "clinic": {
        "name": "VetCare Clinic",
        "phone": "(555) 123-4567",
        "email": "appointments@vetcare.com"
    }
}
```

### Step 3: Add Actions
Connect your preferred services:

**Email Confirmation:**
- Gmail, Outlook, or email service
- Use the booking data to send confirmation emails

**Calendar Integration:**
- Google Calendar, Outlook Calendar
- Create appointments with all details

**CRM/Database:**
- Airtable, Google Sheets
- Store customer and appointment data

**SMS Notifications:**
- Twilio, SMS by Zapier
- Send appointment reminders

## 🎨 Customization

### Colors and Branding
Edit the theme section in `config.js`:
```javascript
theme: {
    primaryColor: "#4f46e5",
    secondaryColor: "#7c3aed",
    accentColor: "#10b981",
    backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
}
```

### Logo
Replace the SVG logo in `index.html` with your clinic's logo:
```html
<div class="clinic-logo">
    <!-- Replace with your logo -->
    <img src="your-logo.png" alt="Your Clinic" width="40" height="40">
</div>
```

### Additional Features
Enable optional features in `config.js`:
```javascript
features: {
    allowPetPhotos: false,
    requirePetAge: false,
    allowMultiplePets: false,
    sendSMSReminders: true,
    collectInsuranceInfo: true
}
```

## 📱 Mobile Optimization

The booking system is fully responsive and optimized for:
- Smartphones (iOS/Android)
- Tablets
- Desktop computers
- Touch interfaces

## 🔒 Security & Privacy

- **No Server-Side Processing** - All validation happens client-side
- **HTTPS Required** - Use SSL certificates for data protection
- **Data Minimization** - Only collects necessary information
- **Privacy Compliant** - Easy to add privacy policy links

## 🚀 Deployment Options

### GitHub Pages (Free)
1. Create a GitHub repository
2. Upload your files
3. Enable GitHub Pages in repository settings
4. Your site will be available at `username.github.io/repository-name`

### Netlify (Free Tier Available)
1. Sign up at netlify.com
2. Drag and drop your files
3. Get instant HTTPS and custom domain support

### Vercel (Free Tier Available)
1. Sign up at vercel.com
2. Connect your GitHub repository or upload files
3. Automatic deployments on file changes

### Traditional Hosting
Upload files to any web hosting provider:
- Shared hosting
- VPS
- Dedicated servers

## 🛠️ Technical Requirements

- **No Server Requirements** - Pure HTML/CSS/JavaScript
- **Modern Browser Support** - Chrome, Firefox, Safari, Edge
- **HTTPS Recommended** - For secure data transmission
- **Mobile Responsive** - Works on all screen sizes

## 📞 Support

For technical support or customization requests:
- Check the configuration options in `config.js`
- Review the Zapier integration setup
- Ensure all files are uploaded correctly
- Verify webhook URL is correct

## 📄 License

This booking system is provided as-is for veterinary clinics. Feel free to customize and deploy for your clinic's needs.

---

**Ready to go live?** Simply configure your `config.js` file, set up your Zapier webhook, and upload to your hosting provider!
