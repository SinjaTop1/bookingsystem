# 🕒 Real-Time Availability Setup Guide

This guide shows you how to implement real-time availability checking so clients see only truly available appointment slots.

## 🎯 **Overview**

Instead of showing static time slots, the system can now:
- ✅ Check against actual booked appointments
- ✅ Show only genuinely available times
- ✅ Update in real-time as bookings are made
- ✅ Prevent double-bookings automatically

## 🔧 **Setup Methods**

### **Method 1: Google Sheets (Recommended - Easiest)**

**How it works:**
1. Zapier saves appointments to Google Sheets
2. Booking system reads from the same sheet
3. Only shows available time slots

**Setup Steps:**

#### **Step 1: Create Google Sheets Database**
1. Create a new Google Sheet
2. Set up columns: `date`, `time`, `datetime`, `enddate`, `status`, `customer_name`, `pet_name`, `service`
3. Make the sheet public (Share → Anyone with link can view)
4. Copy the Sheet ID from URL: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`

#### **Step 2: Update Zapier to Save to Sheets**
1. In your existing Zap, add a new action
2. Choose "Google Sheets" → "Create Spreadsheet Row"
3. Map the webhook data to sheet columns:
   - `date` → `{{date}}`
   - `time` → `{{time}}`
   - `datetime` → `{{datetime}}`
   - `enddate` → `{{enddate}}`
   - `status` → `confirmed`
   - `customer_name` → `{{customer_firstName}} {{customer_lastName}}`
   - `pet_name` → `{{pet_name}}`
   - `service` → `{{service_name}}`

#### **Step 3: Get Google API Key**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing one
3. Enable "Google Sheets API"
4. Create credentials → API Key
5. Restrict the key to "Google Sheets API" only
6. Copy the API key

#### **Step 4: Configure Your Booking System**
Update `config.js`:
```javascript
realTimeAvailability: {
    enabled: true,
    method: 'googleSheets',
    googleSheetsId: 'YOUR_SHEET_ID_HERE',
    apiKey: 'YOUR_API_KEY_HERE',
    cacheTimeout: 300000 // 5 minutes
}
```

---

### **Method 2: Google Calendar (Most Accurate)**

**How it works:**
1. Zapier creates calendar events
2. Booking system checks calendar for conflicts
3. Shows only truly available slots

**Setup Steps:**

#### **Step 1: Create Dedicated Calendar**
1. Create a new Google Calendar for appointments
2. Go to Calendar Settings → Share with specific people
3. Make it public or get the calendar ID
4. Calendar ID format: `your-calendar-id@group.calendar.google.com`

#### **Step 2: Update Zapier to Create Events**
1. In your Zap, add "Google Calendar" → "Create Detailed Event"
2. Map webhook data:
   - **Summary**: `{{service_name}} - {{pet_name}} ({{customer_firstName}} {{customer_lastName}})`
   - **Start Date & Time**: `{{datetime}}`
   - **End Date & Time**: `{{enddate}}`
   - **Description**: Include all appointment details

#### **Step 3: Get Google API Key**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable "Google Calendar API"
3. Create API Key (restrict to Calendar API)

#### **Step 4: Configure Your Booking System**
Update `config.js`:
```javascript
realTimeAvailability: {
    enabled: true,
    method: 'googleCalendar',
    googleCalendarId: 'your-calendar-id@group.calendar.google.com',
    apiKey: 'YOUR_API_KEY_HERE',
    cacheTimeout: 300000
}
```

---

## 🚀 **Testing Your Setup**

### **Test Checklist:**
1. **Make a test booking** through your system
2. **Check data appears** in Google Sheets or Calendar
3. **Refresh the booking page** and verify that time slot is no longer available
4. **Try booking the same slot** - should not be possible
5. **Check different dates** - availability should be accurate

### **Debugging:**
- Open browser console to see availability API calls
- Check Google Sheets/Calendar permissions
- Verify API key restrictions
- Test API endpoints directly

## 📊 **Expected Behavior**

### **Before Real-Time Availability:**
- Shows all possible time slots based on business hours
- Doesn't know about existing bookings
- Possible double-bookings

### **After Real-Time Availability:**
- Shows only genuinely available slots
- Updates as bookings are made
- Prevents conflicts automatically
- Cache refreshes every 5 minutes

## 🔒 **Security Considerations**

### **API Key Security:**
- Restrict API keys to specific APIs only
- Consider IP restrictions for production
- Regularly rotate API keys
- Monitor API usage

### **Data Privacy:**
- Google Sheets: Only appointment times are public, not personal data
- Google Calendar: Use dedicated calendar, not personal one
- Consider data retention policies

## 🛠️ **Advanced Configuration**

### **Custom Cache Timeout:**
```javascript
cacheTimeout: 60000  // 1 minute for high-traffic clinics
```

### **Multiple Clinic Support:**
```javascript
// Different sheets/calendars per clinic
googleSheetsId: CLINIC_NAME === 'Clinic A' ? 'sheet_id_a' : 'sheet_id_b'
```

### **Fallback Behavior:**
If real-time availability fails, system automatically falls back to static availability.

## 🎯 **Benefits**

- **Prevents Double-Bookings**: Impossible to book occupied slots
- **Real-Time Updates**: Availability changes as bookings happen
- **Better User Experience**: Clients see only valid options
- **Automatic Sync**: No manual calendar management needed
- **Professional Appearance**: Shows you have a real booking system

## 📞 **Support**

**Common Issues:**
- **"Loading available times..." stuck**: Check API key and permissions
- **No time slots showing**: Verify Google Sheets/Calendar setup
- **API errors**: Check console for specific error messages

**Testing URLs:**
- Google Sheets API test: `https://sheets.googleapis.com/v4/spreadsheets/SHEET_ID/values/Sheet1!A1:A1?key=API_KEY`
- Google Calendar API test: Check Google Cloud Console API explorer

---

**Ready to implement real-time availability? Choose your method and follow the setup steps above!** 🚀
