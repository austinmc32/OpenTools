export function qrcodeGenerator(container) {
    container.innerHTML = `
        <div class="tool-interface">
            <div class="qrcode-settings">
                <div class="control-group">
                    <label for="qrcode-type">QR Code Type:</label>
                    <select id="qrcode-type" class="full-width">
                        <option value="url" selected>URL</option>
                        <option value="text">Text</option>
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="sms">SMS</option>
                        <option value="wifi">WiFi</option>
                    </select>
                </div>
                
                <div class="control-group" id="qrcode-text-container">
                    <label for="qrcode-text">Content to encode:</label>
                    <textarea id="qrcode-text" rows="3" class="full-width">https://example.com</textarea>
                </div>
                
                <!-- WiFi specific fields -->
                <div id="wifi-fields" style="display: none;">
                    <div class="control-group">
                        <label for="wifi-ssid">Network Name (SSID):</label>
                        <input type="text" id="wifi-ssid" class="full-width" value="MyWiFi">
                    </div>
                    
                    <div class="control-group">
                        <label for="wifi-password">Password:</label>
                        <input type="text" id="wifi-password" class="full-width" value="password123">
                    </div>
                    
                    <div class="control-group">
                        <label for="wifi-encryption">Encryption Type:</label>
                        <select id="wifi-encryption" class="full-width">
                            <option value="WPA">WPA/WPA2</option>
                            <option value="WEP">WEP</option>
                            <option value="nopass">None</option>
                        </select>
                    </div>
                    
                    <div class="control-group checkbox">
                        <input type="checkbox" id="wifi-hidden">
                        <label for="wifi-hidden">Hidden Network</label>
                    </div>
                </div>
                
                <div class="control-row">
                    <div class="control-group half-width">
                        <label for="qrcode-size">Size (px):</label>
                        <input type="number" id="qrcode-size" value="200" min="100" max="500" step="10" class="full-width">
                    </div>
                    <div class="control-group half-width">
                        <label for="qrcode-margin">Margin:</label>
                        <input type="number" id="qrcode-margin" value="4" min="0" max="10" class="full-width">
                    </div>
                </div>
                
                <div class="control-row">
                    <div class="control-group half-width">
                        <label for="qrcode-error-correction">Error Correction:</label>
                        <select id="qrcode-error-correction" class="full-width">
                            <option value="L">Low (7%)</option>
                            <option value="M" selected>Medium (15%)</option>
                            <option value="Q">Quartile (25%)</option>
                            <option value="H">High (30%)</option>
                        </select>
                    </div>
                    <div class="control-group half-width">
                        <label for="qrcode-color">Color:</label>
                        <input type="color" id="qrcode-color" value="#000000" class="full-width">
                    </div>
                </div>
            </div>
            
            <button id="generate-qrcode" class="primary-button">Generate QR Code</button>
            
            <div class="output-area">
                <div class="qrcode-preview">
                    <canvas id="qrcode-canvas"></canvas>
                </div>
                <div class="button-group">
                    <button id="download-qr-png" class="secondary-button">Download PNG</button>
                    <button id="copy-qrcode" class="copy-button">Copy to Clipboard</button>
                </div>
            </div>
            
            <div class="qrcode-info">
                <h3>QR Code Information</h3>
                <div class="info-box">
                    <p>QR codes can store various types of data including URLs, text, contact information, and more.</p>
                    <p>Higher error correction levels make the QR code more resilient to damage but increase its size and complexity.</p>
                </div>
            </div>
        </div>
    `;

    // Add consistent button styling
    const style = document.createElement('style');
    style.textContent = `
        .primary-button, .secondary-button, .copy-button {
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
        
        .copy-button {
            background-color: #5cb85c;
            color: white;
        }
        
        .copy-button:hover {
            background-color: #4cae4c;
        }
        
        .button-group {
            display: flex;
            gap: 10px;
            margin-top: 15px;
            justify-content: center;
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
            
            .secondary-button:hover {
                background-color: #555;
            }
            
            .copy-button {
                background-color: #2d8a2d;
            }
            
            .copy-button:hover {
                background-color: #236b23;
            }
        }
        
        .radio-option {
            margin-right: 10px;
        }
    `;
    document.head.appendChild(style);

    // Get QR Code elements
    const qrcodeText = document.getElementById('qrcode-text');
    const qrcodeSize = document.getElementById('qrcode-size');
    const qrcodeMargin = document.getElementById('qrcode-margin');
    const qrcodeErrorCorrection = document.getElementById('qrcode-error-correction');
    const qrcodeColor = document.getElementById('qrcode-color');
    const qrcodeType = document.getElementById('qrcode-type');
    const generateQrcodeBtn = document.getElementById('generate-qrcode');
    const qrcodeCanvas = document.getElementById('qrcode-canvas');
    const downloadQrPngBtn = document.getElementById('download-qr-png');
    const copyQrcodeBtn = document.getElementById('copy-qrcode');

    // Get WiFi fields
    const wifiFields = document.getElementById('wifi-fields');
    const wifiSsid = document.getElementById('wifi-ssid');
    const wifiPassword = document.getElementById('wifi-password');
    const wifiEncryption = document.getElementById('wifi-encryption');
    const wifiHidden = document.getElementById('wifi-hidden');
    const qrcodeTextContainer = document.getElementById('qrcode-text-container');

    // QR code type templates
    const qrcodeTemplates = {
        url: (value) => value,
        text: (value) => value,
        email: (value) => `mailto:${value}`,
        phone: (value) => `tel:${value}`,
        sms: (value) => `sms:${value}`,
        wifi: (value) => {
            try {
                // Parse Wi-Fi information in format "SSID, password, WPA/WEP/nopass"
                const parts = value.split(',').map(p => p.trim());
                const ssid = parts[0] || '';
                const password = parts[1] || '';
                const encryption = (parts[2] || 'WPA').toUpperCase();
                
                return `WIFI:S:${ssid};T:${encryption};P:${password};;`;
            } catch (e) {
                return value;
            }
        }
    };

    // Event listeners for QR code
    qrcodeType.addEventListener('change', updateQrCodePlaceholder);
    generateQrcodeBtn.addEventListener('click', () => generateQRCode(true));

    // Initialize QR code interface
    updateQrCodePlaceholder();
    
    // Update QR code placeholder on type change
    function updateQrCodePlaceholder() {
        const selectedType = qrcodeType.value;
        
        // Hide WiFi fields by default
        wifiFields.style.display = 'none';
        qrcodeTextContainer.style.display = 'block';
        
        switch(selectedType) {
            case 'url':
                qrcodeText.placeholder = 'https://example.com';
                qrcodeText.value = qrcodeText.value || 'https://example.com';
                break;
            case 'text':
                qrcodeText.placeholder = 'Enter your text here';
                break;
            case 'email':
                qrcodeText.placeholder = 'example@domain.com';
                break;
            case 'phone':
                qrcodeText.placeholder = '+1234567890';
                break;
            case 'sms':
                qrcodeText.placeholder = '+1234567890';
                break;
            case 'wifi':
                // Show WiFi fields and hide the text area
                wifiFields.style.display = 'block';
                qrcodeTextContainer.style.display = 'none';
                break;
        }
    }

    function generateQRCode(showSuccessMsg = true) {
        try {
            // Get selected QR code type
            const selectedType = qrcodeType.value;
            
            // Get content to encode
            let content;
            
            if (selectedType === 'wifi') {
                // Format WiFi network info
                const ssid = wifiSsid.value;
                const password = wifiPassword.value;
                const encryption = wifiEncryption.value;
                const hidden = wifiHidden.checked;
                
                content = `WIFI:S:${ssid};T:${encryption};P:${password};${hidden ? 'H:true;' : ''};`;
            } else {
                // For other types, use the templates
                content = qrcodeTemplates[selectedType](qrcodeText.value);
            }
            
            // Generate QR code
            const options = {
                width: parseInt(qrcodeSize.value),
                height: parseInt(qrcodeSize.value),
                margin: parseInt(qrcodeMargin.value),
                color: {
                    dark: qrcodeColor.value,
                    light: "#ffffff"
                },
                errorCorrectionLevel: qrcodeErrorCorrection.value
            };
            
            // Clear previous QR code
            QRCode.toCanvas(qrcodeCanvas, content, options, (error) => {
                if (error) {
                    console.error(error);
                    showMessage('error', 'Failed to generate QR code. Check your input.');
                } else if (showSuccessMsg) {
                    showMessage('success', 'QR code generated successfully!');
                }
            });
        } catch (error) {
            console.error(error);
            showMessage('error', error.message || 'Failed to generate QR code. Check your input.');
        }
    }

    function showMessage(type, message) {
        // Remove any existing message
        const existingMessage = document.querySelector('.message');
        if (existingMessage) existingMessage.remove();
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        // Add message to DOM
        const outputArea = document.querySelector('.output-area');
        if (outputArea) {
            outputArea.insertBefore(messageDiv, outputArea.firstChild);
            
            // Auto-remove after 3 seconds
            setTimeout(() => {
                messageDiv.remove();
            }, 3000);
        }
    }

    // Download PNG (QR Code)
    downloadQrPngBtn.addEventListener('click', () => {
        const dataURL = qrcodeCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Copy QR code to clipboard
    copyQrcodeBtn.addEventListener('click', () => {
        qrcodeCanvas.toBlob(blob => {
            try {
                navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]).then(() => {
                    showMessage('success', 'QR code copied to clipboard!');
                }).catch(err => {
                    console.error(err);
                    showMessage('error', 'Failed to copy QR code. Browser may not support clipboard images.');
                });
            } catch (error) {
                console.error(error);
                showMessage('error', 'Failed to copy QR code. Browser may not support clipboard images.');
            }
        });
    });

    // Generate QR code on initial load
    generateQRCode(false);
}
