// Clinic Configuration
// Customize this file for each clinic deployment

const CLINIC_CONFIG = {
    // Clinic Information
    clinicName: "VetCare Clinic",
    clinicSubtitle: "Book your pet's appointment",
    
    // Contact Information
    clinicPhone: "(555) 123-4567",
    clinicEmail: "appointments@vetcare.com",
    clinicAddress: "123 Pet Street, Animal City, AC 12345",
    
    // Zapier Integration
    zapierWebhookUrl: "https://hooks.zapier.com/hooks/catch/24512681/u1y0oc9/",
    
    // Business Hours (24-hour format)
    businessHours: {
        monday: { start: "09:00", end: "18:00", closed: false },
        tuesday: { start: "09:00", end: "18:00", closed: false },
        wednesday: { start: "09:00", end: "18:00", closed: false },
        thursday: { start: "09:00", end: "18:00", closed: false },
        friday: { start: "09:00", end: "18:00", closed: false },
        saturday: { start: "09:00", end: "16:00", closed: false },
        sunday: { start: "10:00", end: "15:00", closed: false }
    },
    
    // Appointment Settings
    appointmentSettings: {
        slotDuration: 30, // minutes
        bufferTime: 15, // minutes between appointments
        advanceBookingDays: 30, // how many days ahead can clients book
        minAdvanceHours: 2, // minimum hours in advance for booking
        maxAppointmentsPerDay: 20
    },
    
    // Services Offered
    services: [
        {
            id: "checkup",
            name: "General Checkup",
            description: "Comprehensive health examination for your pet",
            duration: 30, // minutes
            price: "$75",
            available: true
        },
        {
            id: "vaccination",
            name: "Vaccinations",
            description: "Essential vaccines to keep your pet healthy",
            duration: 20,
            price: "$45",
            available: true
        },
        {
            id: "dental",
            name: "Dental Cleaning",
            description: "Professional dental care and cleaning",
            duration: 60,
            price: "$150",
            available: true
        },
        {
            id: "surgery",
            name: "Minor Surgery",
            description: "Outpatient surgical procedures",
            duration: 90,
            price: "$300",
            available: true
        },
        {
            id: "grooming",
            name: "Pet Grooming",
            description: "Full grooming service including bath and nail trim",
            duration: 45,
            price: "$60",
            available: true
        },
        {
            id: "emergency",
            name: "Emergency Consultation",
            description: "Urgent care for your pet's immediate needs",
            duration: 45,
            price: "$120",
            available: true
        }
    ],
    
    // Blocked Dates (YYYY-MM-DD format)
    blockedDates: [
        // Add specific dates that should be unavailable
        // Example: "2024-12-25", "2024-01-01"
    ],
    
    // Blocked Time Slots (for specific recurring times)
    blockedTimeSlots: {
        // Example: lunch break every day
        daily: [
            { start: "12:00", end: "13:00" } // Lunch break
        ],
        // Example: staff meeting every Wednesday
        wednesday: [
            { start: "17:00", end: "18:00" } // Staff meeting
        ]
    },
    
    // Theme Customization
    theme: {
        primaryColor: "#4f46e5",
        secondaryColor: "#7c3aed",
        accentColor: "#10b981",
        backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    
    // Email Templates (for confirmation emails via Zapier)
    emailTemplates: {
        confirmationSubject: "Appointment Confirmed - {{clinicName}}",
        confirmationMessage: `
            Dear {{customerName}},
            
            Your appointment has been confirmed!
            
            Appointment Details:
            - Service: {{serviceName}}
            - Date: {{appointmentDate}}
            - Time: {{appointmentTime}}
            - Pet: {{petName}} ({{petType}})
            
            Please arrive 10 minutes early for check-in.
            
            If you need to reschedule or cancel, please contact us at least 24 hours in advance.
            
            Thank you for choosing {{clinicName}}!
            
            Best regards,
            The {{clinicName}} Team
        `
    },
    
    // Additional Features
    features: {
        allowPetPhotos: false, // Enable pet photo upload
        requirePetAge: false, // Require pet age in form
        allowMultiplePets: false, // Allow booking for multiple pets
        sendSMSReminders: false, // Enable SMS reminders via Zapier
        collectInsuranceInfo: false // Collect pet insurance information
    }
};

// Make config available globally
window.CLINIC_CONFIG = CLINIC_CONFIG;
