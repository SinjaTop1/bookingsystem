// Real-time Availability Checker
// This module handles checking appointment availability against booked slots

class AvailabilityChecker {
    constructor(config) {
        this.config = config;
        this.bookedSlots = new Map(); // Cache for booked appointments
        this.lastFetch = null;
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
    }
    
    // Method 1: Google Sheets Integration
    async checkAvailabilityFromSheets(googleSheetsId, apiKey) {
        try {
            // Check if we need to refresh cache
            if (this.shouldRefreshCache()) {
                await this.fetchBookedSlotsFromSheets(googleSheetsId, apiKey);
            }
            
            return this.bookedSlots;
        } catch (error) {
            console.error('Error checking availability from sheets:', error);
            // Fallback to static availability if API fails
            return new Map();
        }
    }
    
    async fetchBookedSlotsFromSheets(googleSheetsId, apiKey) {
        const range = 'Sheet1!A:E'; // Adjust range as needed
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${googleSheetsId}/values/${range}?key=${apiKey}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.values) {
            this.bookedSlots.clear();
            
            // Skip header row, process appointment data
            for (let i = 1; i < data.values.length; i++) {
                const row = data.values[i];
                const [date, time, datetime, enddate, status] = row;
                
                if (status === 'confirmed' || status === 'booked') {
                    const key = `${date}_${time}`;
                    this.bookedSlots.set(key, {
                        date,
                        time,
                        datetime,
                        enddate,
                        status
                    });
                }
            }
        }
        
        this.lastFetch = Date.now();
    }
    
    // Method 2: Google Calendar Integration
    async checkAvailabilityFromCalendar(calendarId, apiKey, date) {
        try {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            
            const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}&timeMin=${startOfDay.toISOString()}&timeMax=${endOfDay.toISOString()}&singleEvents=true`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            const busyTimes = [];
            if (data.items) {
                data.items.forEach(event => {
                    if (event.start && event.end) {
                        busyTimes.push({
                            start: new Date(event.start.dateTime || event.start.date),
                            end: new Date(event.end.dateTime || event.end.date),
                            summary: event.summary
                        });
                    }
                });
            }
            
            return busyTimes;
        } catch (error) {
            console.error('Error checking calendar availability:', error);
            return [];
        }
    }
    
    // Check if a specific time slot is available
    isTimeSlotAvailable(date, time, duration = 30) {
        const key = `${this.formatDate(date)}_${time}`;
        
        // Check exact match first
        if (this.bookedSlots.has(key)) {
            return false;
        }
        
        // Check for overlapping appointments
        const appointmentStart = this.parseDateTime(date, time);
        const appointmentEnd = new Date(appointmentStart.getTime() + duration * 60000);
        
        for (const [bookedKey, booking] of this.bookedSlots) {
            const bookedStart = new Date(booking.datetime);
            const bookedEnd = new Date(booking.enddate);
            
            // Check for overlap
            if (this.isOverlapping(appointmentStart, appointmentEnd, bookedStart, bookedEnd)) {
                return false;
            }
        }
        
        return true;
    }
    
    // Get all available time slots for a specific date
    getAvailableSlots(date, businessHours, slotDuration = 30, bufferTime = 15) {
        const availableSlots = [];
        
        if (!businessHours || businessHours.closed) {
            return availableSlots;
        }
        
        const startTime = this.parseTime(businessHours.start);
        const endTime = this.parseTime(businessHours.end);
        
        let currentTime = new Date(startTime);
        
        while (currentTime < endTime) {
            const timeString = this.formatTime(currentTime);
            
            if (this.isTimeSlotAvailable(date, timeString, slotDuration)) {
                availableSlots.push(timeString);
            }
            
            // Move to next slot
            currentTime = new Date(currentTime.getTime() + (slotDuration + bufferTime) * 60000);
        }
        
        return availableSlots;
    }
    
    // Utility functions
    shouldRefreshCache() {
        return !this.lastFetch || (Date.now() - this.lastFetch) > this.cacheTimeout;
    }
    
    isOverlapping(start1, end1, start2, end2) {
        return start1 < end2 && end1 > start2;
    }
    
    parseDateTime(date, timeString) {
        const appointmentDate = new Date(date);
        const timeParts = this.parseTimeString(timeString);
        appointmentDate.setHours(timeParts.hours, timeParts.minutes, 0, 0);
        return appointmentDate;
    }
    
    parseTimeString(timeString) {
        const timeStr = timeString.trim();
        
        if (timeStr.includes('AM') || timeStr.includes('PM')) {
            const [time, period] = timeStr.split(/\s+/);
            const [hours, minutes] = time.split(':').map(Number);
            
            let hour24 = hours;
            if (period.toUpperCase() === 'PM' && hours !== 12) {
                hour24 += 12;
            } else if (period.toUpperCase() === 'AM' && hours === 12) {
                hour24 = 0;
            }
            
            return { hours: hour24, minutes: minutes || 0 };
        } else {
            const [hours, minutes] = timeStr.split(':').map(Number);
            return { hours: hours, minutes: minutes || 0 };
        }
    }
    
    parseTime(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
    }
    
    formatTime(date) {
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    }
    
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}

// Make available globally
window.AvailabilityChecker = AvailabilityChecker;
