export function ipFinder(container) {
    container.innerHTML = `
        <div class="tool-interface">
            <div class="ip-card">
                <h3>External IP Finder</h3>
                <div class="ip-display">
                    <span id="public-ip">Loading...</span>
                    <button id="copy-ip" class="copy-button" title="Copy to clipboard">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
                <div class="ip-details" id="ip-details">
                    <div class="detail-spinner">
                        <i class="fas fa-circle-notch fa-spin"></i> Loading IP information...
                    </div>
                </div>
            </div>
            
            <div class="ip-actions">
                <button id="refresh-ip" class="primary-button">
                    <i class="fas fa-sync-alt"></i> Refresh
                </button>
            </div>
        </div>
    `;

    // Add styles with consistent button styling
    const style = document.createElement('style');
    style.textContent = `
        .ip-card {
            background-color: var(--card-color);
            border-radius: 8px;
            box-shadow: var(--shadow);
            padding: 1.5rem;
            margin-bottom: 1.5rem;
        }
        
        .ip-display {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            margin: 1.5rem 0;
        }
        
        #public-ip {
            font-size: 2rem;
            font-weight: bold;
            font-family: monospace;
            color: var(--accent-color);
        }
        
        .primary-button, .copy-button {
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            border: 1px solid transparent;
            transition: all 0.2s ease;
        }
        
        .primary-button {
            background-color: #4a86e8;
            color: white;
        }
        
        .primary-button:hover {
            background-color: #3a76d8;
        }
        
        .copy-button {
            background: none;
            border: none;
            color: var(--text-light);
            font-size: 1.2rem;
            transition: color var(--transition-fast);
        }
        
        .copy-button:hover {
            color: var(--accent-color);
        }
        
        @media (prefers-color-scheme: dark) {
            .primary-button {
                background-color: #3a6ea5;
            }
            
            .primary-button:hover {
                background-color: #2d5a8a;
            }
        }
        
        .ip-details {
            margin-top: 1.5rem;
            background-color: var(--background-color);
            border-radius: 8px;
            padding: 1rem;
        }
        
        .detail-item {
            display: flex;
            margin-bottom: 0.5rem;
        }
        
        .detail-label {
            font-weight: bold;
            width: 120px;
            color: var(--text-light);
        }
        
        .detail-value {
            flex: 1;
        }
        
        .ip-actions {
            display: flex;
            justify-content: center;
            margin-bottom: 2rem;
        }
        
        .detail-spinner {
            text-align: center;
            color: var(--text-light);
            padding: 1rem;
        }
    `;
    document.head.appendChild(style);

    // Elements
    const publicIpElement = document.getElementById('public-ip');
    const copyIpButton = document.getElementById('copy-ip');
    const ipDetails = document.getElementById('ip-details');
    const refreshIpButton = document.getElementById('refresh-ip');
    
    // Fetch the IP on load
    fetchIpAddress();
    
    // Event listeners
    copyIpButton.addEventListener('click', () => {
        const ip = publicIpElement.textContent;
        if (ip && ip !== 'Loading...') {
            navigator.clipboard.writeText(ip).then(() => {
                // Show feedback
                const originalIcon = copyIpButton.innerHTML;
                copyIpButton.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    copyIpButton.innerHTML = originalIcon;
                }, 2000);
            });
        }
    });
    
    refreshIpButton.addEventListener('click', fetchIpAddress);
    
    // Functions
    function fetchIpAddress() {
        // Reset UI
        publicIpElement.textContent = 'Loading...';
        ipDetails.innerHTML = `
            <div class="detail-spinner">
                <i class="fas fa-circle-notch fa-spin"></i> Loading IP information...
            </div>
        `;
        
        // Fetch IP using a public API
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                publicIpElement.textContent = data.ip;
                fetchIpDetails(data.ip);
            })
            .catch(error => {
                console.error('Error fetching IP:', error);
                publicIpElement.textContent = 'Error';
                ipDetails.innerHTML = '<div class="error-message">Failed to fetch IP address. Please try again.</div>';
            });
    }
    
    function fetchIpDetails(ip) {
        // Fetch IP details using a public API
        fetch(`https://ipapi.co/${ip}/json/`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    throw new Error(data.reason || 'Failed to fetch IP details');
                }
                
                ipDetails.innerHTML = `
                    <div class="detail-item">
                        <div class="detail-label">Location:</div>
                        <div class="detail-value">${data.city || 'Unknown'}, ${data.region || ''}, ${data.country_name || 'Unknown'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">ISP:</div>
                        <div class="detail-value">${data.org || 'Unknown'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Region:</div>
                        <div class="detail-value">${data.region || 'Unknown'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Country:</div>
                        <div class="detail-value">${data.country_name || 'Unknown'} (${data.country_code || ''})</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Timezone:</div>
                        <div class="detail-value">${data.timezone || 'Unknown'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Postal Code:</div>
                        <div class="detail-value">${data.postal || 'Unknown'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Coordinates:</div>
                        <div class="detail-value">${data.latitude || 'Unknown'}, ${data.longitude || 'Unknown'}</div>
                    </div>
                `;
            })
            .catch(error => {
                console.error('Error fetching IP details:', error);
                ipDetails.innerHTML = '<div class="error-message">Failed to fetch IP details. Please try again.</div>';
            });
    }
}
