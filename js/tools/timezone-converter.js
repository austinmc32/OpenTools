export function timezoneConverter(container) {
    container.innerHTML = `
        <style>
            .timezone-container {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            
            .timezone-row {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .timezone-controls {
                display: flex;
                gap: 15px;
                flex-wrap: wrap;
            }
            
            @media (min-width: 768px) {
                .timezone-controls {
                    align-items: center;
                }
            }
            
            .timezone-controls label {
                margin-bottom: 5px;
                display: block;
            }
            
            .timezone-controls select, 
            .timezone-controls input {
                padding: 8px 12px;
                border-radius: 4px;
                border: 1px solid #ccc;
                min-width: 200px;
            }
            
            .timezone-list {
                margin-top: 20px;
            }
            
            .timezone-card {
                background: var(--card-bg-color);
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 15px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .timezone-card .time {
                font-size: 1.2rem;
                font-weight: bold;
            }
            
            .timezone-card .date {
                color: var(--secondary-text-color);
                font-size: 0.9rem;
            }
            
            .timezone-card .timezone-info {
                display: flex;
                flex-direction: column;
            }
            
            .timezone-card .remove-btn {
                background: none;
                border: none;
                color: var(--accent-color);
                cursor: pointer;
                font-size: 1.1rem;
            }
            
            .timezone-actions {
                display: flex;
                gap: 10px;
                margin-top: 15px;
                justify-content: space-between;
            }
            
            .current-local-time {
                text-align: center;
                padding: 10px;
                background: var(--accent-color);
                color: white;
                border-radius: 8px;
                margin-bottom: 20px;
            }
            
            .current-local-time h3 {
                margin-bottom: 5px;
            }
        </style>
        
        <div class="tool-interface timezone-container">
            <div class="current-local-time">
                <h3>Your Current Local Time</h3>
                <div id="local-time" class="time"></div>
                <div id="local-date" class="date"></div>
            </div>
            
            <div class="timezone-row">
                <h3>Convert Time</h3>
                <div class="timezone-controls">
                    <div>
                        <label for="source-date">Date</label>
                        <input type="date" id="source-date">
                    </div>
                    <div>
                        <label for="source-time">Time</label>
                        <input type="time" id="source-time">
                    </div>
                    <div>
                        <label for="source-timezone">From Timezone</label>
                        <select id="source-timezone"></select>
                    </div>
                    <div>
                        <label for="target-timezone">To Timezone</label>
                        <select id="target-timezone"></select>
                    </div>
                </div>
                <div class="timezone-actions">
                    <button id="convert-btn" class="primary-button">Convert</button>
                    <button id="add-comparison-btn" class="secondary-button">Add to Comparison</button>
                </div>
            </div>
            
            <div>
                <h3>Conversion Result</h3>
                <div id="conversion-result" class="timezone-card">
                    <div class="timezone-info">
                        <div class="time">--:-- --</div>
                        <div class="date">------</div>
                        <div class="timezone">Select timezones above to convert</div>
                    </div>
                </div>
            </div>
            
            <div class="timezone-list">
                <h3>Timezone Comparison</h3>
                <div id="comparison-list"></div>
            </div>
        </div>
    `;

    // Common timezones array
    const commonTimezones = [
        'UTC', 
        'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
        'America/Toronto', 'America/Vancouver', 'America/Mexico_City', 
        'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Athens', 'Europe/Moscow',
        'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Dubai', 'Asia/Kolkata',
        'Australia/Sydney', 'Australia/Perth', 'Pacific/Auckland'
    ];

    // Get time elements
    const localTimeEl = document.getElementById('local-time');
    const localDateEl = document.getElementById('local-date');
    const sourceDateInput = document.getElementById('source-date');
    const sourceTimeInput = document.getElementById('source-time');
    const sourceTimezoneSelect = document.getElementById('source-timezone');
    const targetTimezoneSelect = document.getElementById('target-timezone');
    const convertBtn = document.getElementById('convert-btn');
    const addComparisonBtn = document.getElementById('add-comparison-btn');
    const conversionResult = document.getElementById('conversion-result');
    const comparisonList = document.getElementById('comparison-list');

    // Initialize with current date and time
    const now = new Date();
    const timeString = now.toTimeString().substring(0, 5);
    const dateString = now.toISOString().substring(0, 10);
    
    sourceDateInput.value = dateString;
    sourceTimeInput.value = timeString;
    
    // Populate timezone dropdowns
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    populateTimezoneDropdowns(userTimezone);
    
    // Set up local time display
    updateLocalTime();
    setInterval(updateLocalTime, 1000);
    
    // Setup event listeners
    convertBtn.addEventListener('click', convertTime);
    addComparisonBtn.addEventListener('click', addToComparison);
    
    // Initial conversion
    convertTime();
    
    // Functions
    function updateLocalTime() {
        const now = new Date();
        localTimeEl.textContent = now.toLocaleTimeString();
        localDateEl.textContent = now.toLocaleDateString();
    }
    
    function populateTimezoneDropdowns(defaultTimezone) {
        // Get all IANA timezones if Intl has them
        let timezones = [];
        
        try {
            // Try to get supported timezones (not supported in all browsers)
            timezones = Intl.supportedValuesOf ? 
                        Intl.supportedValuesOf('timeZone') : 
                        commonTimezones;
        } catch (e) {
            // Fallback to common timezones list
            timezones = commonTimezones;
        }
        
        // Create elements for each dropdown
        timezones.forEach(timezone => {
            // Get the timezone offset
            const offset = getTimezoneOffsetString(timezone);
            
            const sourceOption = document.createElement('option');
            sourceOption.value = timezone;
            sourceOption.textContent = `${formatTimezoneName(timezone)} ${offset}`;
            sourceOption.selected = timezone === defaultTimezone;
            sourceTimezoneSelect.appendChild(sourceOption);
            
            const targetOption = document.createElement('option');
            targetOption.value = timezone;
            targetOption.textContent = `${formatTimezoneName(timezone)} ${offset}`;
            targetTimezoneSelect.appendChild(targetOption);
        });
    }
    
    function getTimezoneOffsetString(timezone) {
        try {
            // Create a date object to get the current offset for this timezone
            const date = new Date();
            
            // Get the timezone's offset in minutes
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: timezone,
                timeZoneName: 'short'
            });
            
            // Try to extract the UTC offset from the formatted date
            const formatted = formatter.format(date);
            const match = formatted.match(/GMT([+-]\d+)$|UTC([+-]\d+)$/);
            
            if (match) {
                return match[0]; // Return the matched GMT+XX or UTC+XX part
            } else {
                // Calculate the offset manually
                const localDate = new Date();
                const tzDate = new Date(localDate.toLocaleString('en-US', { timeZone: timezone }));
                
                // Adjust for browser timezone
                const browserOffset = localDate.getTimezoneOffset();
                const targetOffset = (localDate - tzDate) / 60000 - browserOffset;
                
                // Round to nearest whole hour number for display
                const hours = Math.round(Math.abs(targetOffset) / 60);
                const sign = targetOffset >= 0 ? '+' : '-';
                
                return `UTC${sign}${hours}`;
            }
        } catch (e) {
            console.error(`Error getting offset for ${timezone}:`, e);
            return ''; // Return empty string if there's an error
        }
    }
    
    function formatTimezoneName(timezone) {
        // Format "Area/Location" to "Location (Area)" - e.g., "America/New_York" to "New York (America)"
        if (timezone.includes('/')) {
            const parts = timezone.split('/');
            const area = parts[0];
            let location = parts[parts.length - 1].replace(/_/g, ' ');
            return `${location} (${area})`;
        }
        return timezone;
    }
    
    function convertTime() {
        try {
            const sourceDate = sourceDateInput.value;
            const sourceTime = sourceTimeInput.value;
            const sourceTimezone = sourceTimezoneSelect.value;
            const targetTimezone = targetTimezoneSelect.value;
            
            if (!sourceDate || !sourceTime) {
                showError('Please provide both date and time');
                return;
            }
            
            // Create a date in the source timezone
            const dateTimeString = `${sourceDate}T${sourceTime}:00`;
            
            const options = {
                timeZone: targetTimezone,
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            };
            
            // Create date object with the input date/time in the source timezone
            const sourceDateTime = new Date(`${dateTimeString}Z`);
            
            // Adjust for the source timezone offset
            const sourceOffset = getTimezoneOffset(sourceDateTime, sourceTimezone);
            const utcDateTime = new Date(sourceDateTime.getTime() - sourceOffset);
            
            // Convert to target timezone
            const targetDateTime = new Date(utcDateTime.getTime());
            const targetFormatted = new Intl.DateTimeFormat('en-US', options).format(targetDateTime);
            
            // Update the result
            conversionResult.innerHTML = `
                <div class="timezone-info">
                    <div class="time">${targetFormatted.split(',')[1].trim()}</div>
                    <div class="date">${targetFormatted.split(',')[0]}</div>
                    <div class="timezone">${formatTimezoneName(targetTimezone)} ${getTimezoneOffsetString(targetTimezone)}</div>
                </div>
            `;
        } catch (error) {
            showError(`Conversion error: ${error.message}`);
        }
    }
    
    function addToComparison() {
        const sourceDate = sourceDateInput.value;
        const sourceTime = sourceTimeInput.value;
        const sourceTimezone = sourceTimezoneSelect.value;
        const targetTimezone = targetTimezoneSelect.value;
        
        if (!sourceDate || !sourceTime) {
            showError('Please provide both date and time');
            return;
        }
        
        const dateTimeString = `${sourceDate}T${sourceTime}:00`;
        const baseDateTime = new Date(`${dateTimeString}Z`);
        const sourceOffset = getTimezoneOffset(baseDateTime, sourceTimezone);
        const utcDateTime = new Date(baseDateTime.getTime() - sourceOffset);
        
        // Only use the selected source and target timezones
        const timezones = new Set([sourceTimezone, targetTimezone]);
        
        // Create or update comparison cards
        addTimezonesToComparison(timezones, utcDateTime);
    }
    
    function addTimezonesToComparison(timezones, utcDateTime) {
        timezones.forEach(timezone => {
            // Skip if this timezone is already in the comparison
            if (document.querySelector(`.timezone-card[data-timezone="${timezone}"]`)) {
                return;
            }
            
            const offset = getTimezoneOffsetString(timezone);
            const options = {
                timeZone: timezone,
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            };
            
            try {
                const localDateTime = new Date(utcDateTime);
                const formatted = new Intl.DateTimeFormat('en-US', options).format(localDateTime);
                
                const card = document.createElement('div');
                card.className = 'timezone-card';
                card.setAttribute('data-timezone', timezone);
                card.innerHTML = `
                    <div class="timezone-info">
                        <div class="time">${formatted.split(',')[1].trim()}</div>
                        <div class="date">${formatted.split(',')[0]}</div>
                        <div class="timezone">${formatTimezoneName(timezone)} ${offset}</div>
                    </div>
                    <button class="remove-btn">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                card.querySelector('.remove-btn').addEventListener('click', function() {
                    card.remove();
                });
                
                comparisonList.appendChild(card);
            } catch (error) {
                console.error(`Error formatting time for ${timezone}:`, error);
            }
        });
    }
    
    function getTimezoneOffset(date, timeZone) {
        try {
            const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
            const tzDate = new Date(date.toLocaleString('en-US', { timeZone }));
            return utcDate.getTime() - tzDate.getTime();
        } catch (e) {
            // Fallback to system timezone if specific one fails
            return 0;
        }
    }
    
    function showError(message) {
        // Add an error message at the top of the conversion result
        conversionResult.innerHTML = `
            <div class="timezone-info">
                <div style="color: #f44336; margin-bottom: 10px;">${message}</div>
                <div class="time">--:-- --</div>
                <div class="date">------</div>
                <div class="timezone">Please try again</div>
            </div>
        `;
    }
}
