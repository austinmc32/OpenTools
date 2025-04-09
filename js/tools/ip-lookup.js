export function ipLookup(container) {
    container.innerHTML = `
        <div class="tool-interface">
            <div class="lookup-card">
                <h3>IP Address Lookup</h3>
                <p>Enter an IP address to get detailed information about it.</p>
                
                <div class="lookup-form">
                    <div class="input-group">
                        <input type="text" id="lookup-ip" placeholder="Enter an IP address (e.g., 8.8.8.8)" class="form-control">
                        <button id="lookup-btn" class="primary-button">Lookup</button>
                    </div>
                </div>
            </div>
            
            <div id="lookup-results" class="results-card hidden">
                <h3>Lookup Results</h3>
                <div class="results-content">
                    <div class="detail-spinner">
                        <i class="fas fa-circle-notch fa-spin"></i> Looking up IP information...
                    </div>
                </div>
                
                <div class="results-actions hidden">
                    <button id="copy-results" class="secondary-button">
                        <i class="fas fa-copy"></i> Copy Results
                    </button>
                </div>
            </div>
            
            <div class="lookup-history">
                <h3>Recent Lookups</h3>
                <div id="history-list" class="history-list">
                    <p class="empty-history">No recent lookups</p>
                </div>
                <button id="clear-history" class="secondary-button" disabled>Clear History</button>
            </div>
        </div>
    `;

    // Add styles with consistent button styling
    const style = document.createElement('style');
    style.textContent = `
        .lookup-card, .results-card, .lookup-history {
            background-color: var(--card-color);
            border-radius: 8px;
            box-shadow: var(--shadow);
            padding: 1.5rem;
            margin-bottom: 1.5rem;
        }
        
        .lookup-form {
            margin-top: 1.5rem;
        }
        
        .input-group {
            display: flex;
            gap: 0.5rem;
            width: 100%;
        }
        
        .input-group .form-control {
            flex: 1;
            padding: 0.75rem;
            border: 1px solid var(--border-color);
            border-radius: 5px;
            font-size: 1rem;
            background-color: var(--background-color);
            color: var(--text-color);
        }
        
        .results-content {
            background-color: var(--background-color);
            border-radius: 8px;
            padding: 1rem;
            margin: 1rem 0;
        }
        
        .detail-item {
            display: flex;
            margin-bottom: 0.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid var(--border-color);
        }
        
        .detail-item:last-child {
            border-bottom: none;
        }
        
        .detail-label {
            font-weight: bold;
            width: 120px;
            color: var(--text-light);
        }
        
        .detail-value {
            flex: 1;
        }
        
        .results-actions {
            display: flex;
            justify-content: flex-end;
            margin-top: 1rem;
        }
        
        .detail-spinner {
            text-align: center;
            color: var(--text-light);
            padding: 1rem;
        }
        
        .history-list {
            margin: 1rem 0;
            max-height: 200px;
            overflow-y: auto;
            background-color: var(--background-color);
            border-radius: 8px;
            padding: 0.5rem;
        }
        
        .history-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem;
            border-bottom: 1px solid var(--border-color);
            cursor: pointer;
            transition: background-color var(--transition-fast);
        }
        
        .history-item:hover {
            background-color: rgba(var(--primary-color-rgb), 0.1);
        }
        
        .history-item:last-child {
            border-bottom: none;
        }
        
        .empty-history {
            text-align: center;
            color: var(--text-light);
            padding: 1rem;
        }
        
        .error-message {
            color: #e74c3c;
            padding: 0.5rem;
            text-align: center;
            background-color: rgba(231, 76, 60, 0.1);
            border-radius: 5px;
            margin: 1rem 0;
        }
        
        .ip-badge {
            font-family: monospace;
            background-color: var(--card-color);
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            margin-right: 0.5rem;
        }
        
        .timestamp {
            color: var(--text-light);
            font-size: 0.8rem;
        }
        
        .primary-button, .secondary-button {
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            border: 1px solid transparent;
            transition: all 0.2s ease;
            margin: 5px;
        }
        
        .primary-button {
            background-color: #4a86e8;
            color: white;
        }
        
        .primary-button:hover {
            background-color: #3a76d8;
        }
        
        .secondary-button {
            background-color: #f0f0f0;
            color: #333;
            border-color: #ddd;
        }
        
        .secondary-button:hover {
            background-color: #e3e3e3;
        }
        
        .secondary-button:disabled {
            background-color: #e0e0e0;
            color: #999;
            cursor: not-allowed;
        }
        
        @media (prefers-color-scheme: dark) {
            .primary-button {
                background-color: #3a6ea5;
            }
            
            .primary-button:hover {
                background-color: #2d5a8a;
            }
            
            .secondary-button {
                background-color: #444;
                color: #eee;
                border-color: #555;
            }
            
            .secondary-button:hover:not(:disabled) {
                background-color: #555;
            }
            
            .secondary-button:disabled {
                background-color: #333;
                color: #777;
                border-color: #444;
            }
        }
    `;
    document.head.appendChild(style);

    // Elements
    const lookupIpInput = document.getElementById('lookup-ip');
    const lookupBtn = document.getElementById('lookup-btn');
    const lookupResults = document.getElementById('lookup-results');
    const resultsContent = lookupResults.querySelector('.results-content');
    const resultsActions = lookupResults.querySelector('.results-actions');
    const copyResultsBtn = document.getElementById('copy-results');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history');
    
    // Load history from localStorage
    let lookupHistory = JSON.parse(localStorage.getItem('ip-lookup-history') || '[]');
    updateHistoryList();
    
    // Event listeners
    lookupBtn.addEventListener('click', lookupIp);
    
    lookupIpInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            lookupIp();
        }
    });
    
    copyResultsBtn.addEventListener('click', function() {
        // Get all text content from results
        const textToCopy = Array.from(resultsContent.querySelectorAll('.detail-item'))
            .map(item => {
                const label = item.querySelector('.detail-label').textContent.trim();
                const value = item.querySelector('.detail-value').textContent.trim();
                return `${label} ${value}`;
            })
            .join('\n');
            
        navigator.clipboard.writeText(textToCopy).then(() => {
            // Show feedback
            const originalText = copyResultsBtn.textContent;
            copyResultsBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyResultsBtn.innerHTML = originalText;
            }, 2000);
        });
    });
    
    clearHistoryBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear your lookup history?')) {
            lookupHistory = [];
            localStorage.setItem('ip-lookup-history', JSON.stringify(lookupHistory));
            updateHistoryList();
        }
    });
    
    // Functions
    function lookupIp() {
        const ip = lookupIpInput.value.trim();
        
        if (!isValidIp(ip)) {
            resultsContent.innerHTML = '<div class="error-message">Please enter a valid IP address</div>';
            lookupResults.classList.remove('hidden');
            resultsActions.classList.add('hidden');
            return;
        }
        
        // Show loading state
        lookupResults.classList.remove('hidden');
        resultsContent.innerHTML = `
            <div class="detail-spinner">
                <i class="fas fa-circle-notch fa-spin"></i> Looking up information for ${ip}...
            </div>
        `;
        resultsActions.classList.add('hidden');
        
        fetch(`https://ipapi.co/${ip}/json/`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    throw new Error(data.reason || 'Failed to fetch IP details');
                }
                
                // Format results
                resultsContent.innerHTML = `
                    <div class="detail-item">
                        <div class="detail-label">IP Address:</div>
                        <div class="detail-value">${ip}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Location:</div>
                        <div class="detail-value">${data.city || 'Unknown'}, ${data.region || ''}, ${data.country_name || 'Unknown'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">ISP:</div>
                        <div class="detail-value">${data.org || 'Unknown'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">ASN:</div>
                        <div class="detail-value">${data.asn || 'Unknown'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Country:</div>
                        <div class="detail-value">${data.country_name || 'Unknown'} (${data.country_code || ''})</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Region:</div>
                        <div class="detail-value">${data.region || 'Unknown'} (${data.region_code || ''})</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">City:</div>
                        <div class="detail-value">${data.city || 'Unknown'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Postal Code:</div>
                        <div class="detail-value">${data.postal || 'Unknown'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Timezone:</div>
                        <div class="detail-value">${data.timezone || 'Unknown'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Coordinates:</div>
                        <div class="detail-value">${data.latitude || 'Unknown'}, ${data.longitude || 'Unknown'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Currency:</div>
                        <div class="detail-value">${data.currency || 'Unknown'} (${data.currency_name || ''})</div>
                    </div>
                `;
                
                resultsActions.classList.remove('hidden');
                
                // Add to history
                addToHistory(ip, data);
            })
            .catch(error => {
                console.error('Error looking up IP:', error);
                resultsContent.innerHTML = `
                    <div class="error-message">
                        Failed to lookup IP details. Please try again.
                        <div class="error-details">${error.message}</div>
                    </div>
                `;
                resultsActions.classList.add('hidden');
            });
    }
    
    function isValidIp(ip) {
        // Basic IPv4 validation
        const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return ipv4Regex.test(ip);
    }
    
    function addToHistory(ip, data) {
        // Add to beginning of array (most recent first)
        lookupHistory.unshift({
            ip: ip,
            location: data.country_name ? `${data.city || ''}, ${data.country_name}` : 'Unknown',
            timestamp: new Date().toISOString()
        });
        
        // Limit history to 10 items
        if (lookupHistory.length > 10) {
            lookupHistory = lookupHistory.slice(0, 10);
        }
        
        // Save to localStorage
        localStorage.setItem('ip-lookup-history', JSON.stringify(lookupHistory));
        
        // Update the UI
        updateHistoryList();
    }
    
    function updateHistoryList() {
        if (lookupHistory.length === 0) {
            historyList.innerHTML = '<p class="empty-history">No recent lookups</p>';
            clearHistoryBtn.disabled = true;
            return;
        }
        
        clearHistoryBtn.disabled = false;
        historyList.innerHTML = '';
        
        lookupHistory.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            // Format the timestamp
            const timestamp = new Date(item.timestamp);
            const formattedTime = timestamp.toLocaleString();
            
            historyItem.innerHTML = `
                <div>
                    <span class="ip-badge">${item.ip}</span>
                    <span class="location">${item.location}</span>
                </div>
                <span class="timestamp">${formattedTime}</span>
            `;
            
            // Add click handler to lookup this IP again
            historyItem.addEventListener('click', () => {
                lookupIpInput.value = item.ip;
                lookupIp();
            });
            
            historyList.appendChild(historyItem);
        });
    }
}
