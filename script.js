// Appointment Booking System
class AppointmentBooking {
    constructor() {
        this.currentStep = 1;
        this.selectedService = null;
        this.selectedDate = null;
        this.selectedTime = null;
        this.formData = {};
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        
        this.init();
    }
    
    init() {
        this.loadClinicInfo();
        this.loadServices();
        this.setupEventListeners();
        this.generateCalendar();
        this.updateStepDisplay();
    }
    
    loadClinicInfo() {
        document.getElementById('clinic-name').textContent = CLINIC_CONFIG.clinicName;
        document.getElementById('clinic-subtitle').textContent = CLINIC_CONFIG.clinicSubtitle;
        document.getElementById('clinic-title').textContent = `${CLINIC_CONFIG.clinicName} - Book Appointment`;
    }
    
    loadServices() {
        const servicesContainer = document.getElementById('services-list');
        servicesContainer.innerHTML = '';
        
        CLINIC_CONFIG.services
            .filter(service => service.available)
            .forEach(service => {
                const serviceCard = document.createElement('div');
                serviceCard.className = 'service-card';
                serviceCard.dataset.serviceId = service.id;
                
                serviceCard.innerHTML = `
                    <h3>${service.name}</h3>
                    <p>${service.description}</p>
                    <div class="service-details">
                        <span class="service-duration">${service.duration} minutes</span>
                        <span class="service-price">${service.price}</span>
                    </div>
                `;
                
                serviceCard.addEventListener('click', () => this.selectService(service));
                servicesContainer.appendChild(serviceCard);
            });
    }
    
    setupEventListeners() {
        // Navigation buttons
        document.getElementById('next-btn').addEventListener('click', () => this.nextStep());
        document.getElementById('back-btn').addEventListener('click', () => this.prevStep());
        document.getElementById('book-btn').addEventListener('click', () => this.submitBooking());
        
        // Calendar navigation
        document.getElementById('prev-month').addEventListener('click', () => this.prevMonth());
        document.getElementById('next-month').addEventListener('click', () => this.nextMonth());
        
        // Form validation
        const form = document.getElementById('booking-form');
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }
    
    selectService(service) {
        // Remove previous selection
        document.querySelectorAll('.service-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selection to clicked card
        document.querySelector(`[data-service-id="${service.id}"]`).classList.add('selected');
        
        this.selectedService = service;
        this.updateNextButton();
    }
    
    generateCalendar() {
        const calendarGrid = document.getElementById('calendar-grid');
        const monthYearDisplay = document.getElementById('calendar-month-year');
        
        // Clear previous calendar
        calendarGrid.innerHTML = '';
        
        // Set month/year display
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        monthYearDisplay.textContent = `${monthNames[this.currentMonth]} ${this.currentYear}`;
        
        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });
        
        // Get first day of month and number of days
        const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
        const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        const today = new Date();
        
        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day';
            calendarGrid.appendChild(emptyDay);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            const currentDate = new Date(this.currentYear, this.currentMonth, day);
            const dateString = this.formatDate(currentDate);
            
            // Check if day is available
            if (this.isDateAvailable(currentDate)) {
                dayElement.classList.add('available');
                dayElement.addEventListener('click', () => this.selectDate(currentDate));
            } else {
                dayElement.classList.add('unavailable');
            }
            
            // Mark today
            if (this.isSameDay(currentDate, today)) {
                dayElement.classList.add('today');
            }
            
            // Mark selected date
            if (this.selectedDate && this.isSameDay(currentDate, this.selectedDate)) {
                dayElement.classList.add('selected');
            }
            
            calendarGrid.appendChild(dayElement);
        }
    }
    
    isDateAvailable(date) {
        const today = new Date();
        const minDate = new Date(today.getTime() + (CLINIC_CONFIG.appointmentSettings.minAdvanceHours * 60 * 60 * 1000));
        const maxDate = new Date(today.getTime() + (CLINIC_CONFIG.appointmentSettings.advanceBookingDays * 24 * 60 * 60 * 1000));
        
        // Check if date is within booking window
        if (date < minDate || date > maxDate) {
            return false;
        }
        
        // Check if date is blocked
        const dateString = this.formatDate(date);
        if (CLINIC_CONFIG.blockedDates.includes(dateString)) {
            return false;
        }
        
        // Check if day of week is open
        const dayName = this.getDayName(date.getDay()).toLowerCase();
        const businessHours = CLINIC_CONFIG.businessHours[dayName];
        
        return businessHours && !businessHours.closed;
    }
    
    selectDate(date) {
        // Remove previous selection
        document.querySelectorAll('.calendar-day.selected').forEach(day => {
            day.classList.remove('selected');
        });
        
        // Add selection to clicked day
        event.target.classList.add('selected');
        
        this.selectedDate = date;
        this.generateTimeSlots(date);
        this.updateSelectedDateDisplay(date);
        this.updateNextButton();
    }
    
    generateTimeSlots(date) {
        const timeSlotsContainer = document.getElementById('time-slots');
        timeSlotsContainer.innerHTML = '';
        
        const dayName = this.getDayName(date.getDay()).toLowerCase();
        const businessHours = CLINIC_CONFIG.businessHours[dayName];
        
        if (!businessHours || businessHours.closed) {
            timeSlotsContainer.innerHTML = '<p>No appointments available on this day.</p>';
            return;
        }
        
        const startTime = this.parseTime(businessHours.start);
        const endTime = this.parseTime(businessHours.end);
        const slotDuration = CLINIC_CONFIG.appointmentSettings.slotDuration;
        const bufferTime = CLINIC_CONFIG.appointmentSettings.bufferTime;
        
        let currentTime = new Date(startTime);
        
        while (currentTime < endTime) {
            const timeString = this.formatTime(currentTime);
            
            if (this.isTimeSlotAvailable(date, currentTime)) {
                const timeSlot = document.createElement('div');
                timeSlot.className = 'time-slot';
                timeSlot.textContent = timeString;
                timeSlot.addEventListener('click', () => this.selectTimeSlot(timeString, timeSlot));
                timeSlotsContainer.appendChild(timeSlot);
            }
            
            // Move to next time slot
            currentTime = new Date(currentTime.getTime() + (slotDuration + bufferTime) * 60000);
        }
    }
    
    isTimeSlotAvailable(date, time) {
        const dayName = this.getDayName(date.getDay()).toLowerCase();
        const blockedSlots = CLINIC_CONFIG.blockedTimeSlots;
        
        // Check daily blocked slots
        if (blockedSlots.daily) {
            for (const blocked of blockedSlots.daily) {
                const blockedStart = this.parseTime(blocked.start);
                const blockedEnd = this.parseTime(blocked.end);
                if (time >= blockedStart && time < blockedEnd) {
                    return false;
                }
            }
        }
        
        // Check day-specific blocked slots
        if (blockedSlots[dayName]) {
            for (const blocked of blockedSlots[dayName]) {
                const blockedStart = this.parseTime(blocked.start);
                const blockedEnd = this.parseTime(blocked.end);
                if (time >= blockedStart && time < blockedEnd) {
                    return false;
                }
            }
        }
        
        // Check if slot is in the past
        const now = new Date();
        const slotDateTime = new Date(date);
        slotDateTime.setHours(time.getHours(), time.getMinutes(), 0, 0);
        
        if (slotDateTime <= now) {
            return false;
        }
        
        return true;
    }
    
    selectTimeSlot(timeString, element) {
        // Remove previous selection
        document.querySelectorAll('.time-slot.selected').forEach(slot => {
            slot.classList.remove('selected');
        });
        
        // Add selection to clicked slot
        element.classList.add('selected');
        
        this.selectedTime = timeString;
        this.updateNextButton();
    }
    
    updateSelectedDateDisplay(date) {
        const display = document.getElementById('selected-date-display');
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        display.textContent = date.toLocaleDateString('en-US', options);
    }
    
    prevMonth() {
        if (this.currentMonth === 0) {
            this.currentMonth = 11;
            this.currentYear--;
        } else {
            this.currentMonth--;
        }
        this.generateCalendar();
    }
    
    nextMonth() {
        if (this.currentMonth === 11) {
            this.currentMonth = 0;
            this.currentYear++;
        } else {
            this.currentMonth++;
        }
        this.generateCalendar();
    }
    
    nextStep() {
        if (this.currentStep < 4) {
            if (this.validateCurrentStep()) {
                this.currentStep++;
                this.updateStepDisplay();
                
                if (this.currentStep === 4) {
                    this.showConfirmation();
                }
            }
        }
    }
    
    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
        }
    }
    
    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                if (!this.selectedService) {
                    alert('Please select a service.');
                    return false;
                }
                return true;
            case 2:
                if (!this.selectedDate || !this.selectedTime) {
                    alert('Please select both date and time.');
                    return false;
                }
                return true;
            case 3:
                return this.validateForm();
            default:
                return true;
        }
    }
    
    validateForm() {
        const form = document.getElementById('booking-form');
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Clear previous error
        this.clearFieldError(field);
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required.';
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number.';
            }
        }
        
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }
        
        return isValid;
    }
    
    showFieldError(field, message) {
        field.style.borderColor = '#ef4444';
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.style.color = '#ef4444';
            errorElement.style.fontSize = '0.875rem';
            errorElement.style.marginTop = '4px';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }
    
    clearFieldError(field) {
        field.style.borderColor = '#d1d5db';
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    updateStepDisplay() {
        // Hide all steps
        document.querySelectorAll('.booking-step').forEach(step => {
            step.classList.add('hidden');
        });
        
        // Show current step
        document.getElementById(`step-${this.currentStep}`).classList.remove('hidden');
        
        // Update step indicators
        document.querySelectorAll('.step').forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNumber === this.currentStep) {
                step.classList.add('active');
            } else if (stepNumber < this.currentStep) {
                step.classList.add('completed');
            }
        });
        
        // Update navigation buttons
        this.updateNavigationButtons();
    }
    
    updateNavigationButtons() {
        const backBtn = document.getElementById('back-btn');
        const nextBtn = document.getElementById('next-btn');
        const bookBtn = document.getElementById('book-btn');
        
        // Back button
        if (this.currentStep === 1) {
            backBtn.classList.add('hidden');
        } else {
            backBtn.classList.remove('hidden');
        }
        
        // Next/Book button
        if (this.currentStep === 4) {
            nextBtn.classList.add('hidden');
            bookBtn.classList.add('hidden');
        } else if (this.currentStep === 3) {
            nextBtn.classList.add('hidden');
            bookBtn.classList.remove('hidden');
        } else {
            nextBtn.classList.remove('hidden');
            bookBtn.classList.add('hidden');
        }
        
        this.updateNextButton();
    }
    
    updateNextButton() {
        const nextBtn = document.getElementById('next-btn');
        const bookBtn = document.getElementById('book-btn');
        
        let canProceed = false;
        
        switch (this.currentStep) {
            case 1:
                canProceed = !!this.selectedService;
                break;
            case 2:
                canProceed = !!(this.selectedDate && this.selectedTime);
                break;
            case 3:
                canProceed = true; // Will validate on click
                break;
        }
        
        if (this.currentStep === 3) {
            bookBtn.disabled = !canProceed;
        } else {
            nextBtn.disabled = !canProceed;
        }
    }
    
    showConfirmation() {
        const confirmationDetails = document.getElementById('confirmation-details');
        const formData = new FormData(document.getElementById('booking-form'));
        
        confirmationDetails.innerHTML = `
            <div class="confirmation-row">
                <span class="confirmation-label">Service:</span>
                <span class="confirmation-value">${this.selectedService.name}</span>
            </div>
            <div class="confirmation-row">
                <span class="confirmation-label">Date:</span>
                <span class="confirmation-value">${this.selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div class="confirmation-row">
                <span class="confirmation-label">Time:</span>
                <span class="confirmation-value">${this.selectedTime}</span>
            </div>
            <div class="confirmation-row">
                <span class="confirmation-label">Duration:</span>
                <span class="confirmation-value">${this.selectedService.duration} minutes</span>
            </div>
            <div class="confirmation-row">
                <span class="confirmation-label">Price:</span>
                <span class="confirmation-value">${this.selectedService.price}</span>
            </div>
            <div class="confirmation-row">
                <span class="confirmation-label">Client:</span>
                <span class="confirmation-value">${formData.get('firstName')} ${formData.get('lastName')}</span>
            </div>
            <div class="confirmation-row">
                <span class="confirmation-label">Pet:</span>
                <span class="confirmation-value">${formData.get('petName')} (${formData.get('petType')})</span>
            </div>
            <div class="confirmation-row">
                <span class="confirmation-label">Contact:</span>
                <span class="confirmation-value">${formData.get('email')}</span>
            </div>
        `;
    }
    
    async submitBooking() {
        const loadingOverlay = document.getElementById('loading-overlay');
        loadingOverlay.classList.remove('hidden');
        
        try {
            const formData = new FormData(document.getElementById('booking-form'));
            
            const bookingData = {
                // Appointment Details
                service: this.selectedService,
                date: this.formatDate(this.selectedDate),
                time: this.selectedTime,
                duration: this.selectedService.duration,
                
                // Customer Information
                customer: {
                    firstName: formData.get('firstName'),
                    lastName: formData.get('lastName'),
                    email: formData.get('email'),
                    phone: formData.get('phone')
                },
                
                // Pet Information
                pet: {
                    name: formData.get('petName'),
                    type: formData.get('petType'),
                    breed: formData.get('petBreed') || 'Not specified'
                },
                
                // Additional Information
                notes: formData.get('notes') || '',
                
                // Clinic Information
                clinic: {
                    name: CLINIC_CONFIG.clinicName,
                    phone: CLINIC_CONFIG.clinicPhone,
                    email: CLINIC_CONFIG.clinicEmail
                },
                
                // Booking Metadata
                bookingId: this.generateBookingId(),
                bookingDate: new Date().toISOString(),
                status: 'confirmed'
            };
            
            // Debug: Log the data being sent
            console.log('Sending booking data:', bookingData);
            console.log('Webhook URL:', CLINIC_CONFIG.zapierWebhookUrl);
            
            // Send to Zapier webhook
            const response = await fetch(CLINIC_CONFIG.zapierWebhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData)
            });
            
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            
            if (response.ok) {
                // Success - move to confirmation step
                console.log('Booking successful!');
                this.currentStep = 4;
                this.updateStepDisplay();
            } else {
                const errorText = await response.text();
                console.error('Server response:', errorText);
                throw new Error(`Failed to create appointment. Server responded with: ${response.status} ${response.statusText}`);
            }
            
        } catch (error) {
            console.error('Booking error details:', error);
            
            // More detailed error messages
            let errorMessage = 'Sorry, there was an error creating your appointment. ';
            
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                errorMessage += 'Network error - please check your internet connection. ';
            } else if (error.message.includes('CORS')) {
                errorMessage += 'CORS error - this may be due to testing locally. ';
            } else {
                errorMessage += error.message + ' ';
            }
            
            errorMessage += '\n\nFor testing purposes, check the browser console for more details. ';
            errorMessage += 'Please try again or contact us directly.';
            
            alert(errorMessage);
        } finally {
            loadingOverlay.classList.add('hidden');
        }
    }
    
    generateBookingId() {
        const timestamp = Date.now().toString(36);
        const randomStr = Math.random().toString(36).substr(2, 5);
        return `${timestamp}-${randomStr}`.toUpperCase();
    }
    
    // Utility functions
    formatDate(date) {
        return date.toISOString().split('T')[0];
    }
    
    formatTime(date) {
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    }
    
    parseTime(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
    }
    
    getDayName(dayIndex) {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        return days[dayIndex];
    }
    
    isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }
}

// Initialize the booking system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AppointmentBooking();
});
