export function barcodeGenerator(container) {
    container.innerHTML = `
        <style>
            .barcode-preview {
                margin-top: 20px;
                text-align: center;
                padding: 20px;
                background-color: #fff;
                border-radius: 5px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                overflow: auto;
            }
            
            .barcode-options {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin-bottom: 20px;
            }
            
            @media (max-width: 768px) {
                .barcode-options {
                    grid-template-columns: 1fr;
                }
            }
            
            .options-group {
                margin-bottom: 15px;
            }
            
            .color-inputs {
                display: flex;
                gap: 10px;
            }
            
            .color-preview {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                border: 1px solid #ccc;
                display: inline-block;
                vertical-align: middle;
                margin-left: 10px;
            }
            
            .download-options {
                margin-top: 20px;
                display: flex;
                gap: 10px;
                justify-content: center;
            }
            
            @media (prefers-color-scheme: dark) {
                .barcode-preview {
                    background-color: #fff;
                    /* Always keep white background for barcode visibility */
                }
            }
            
            .checkbox-group {
                display: flex;
                align-items: center;
                margin-bottom: 15px;
            }
            
            .checkbox-group input[type="checkbox"] {
                margin-right: 10px;
                width: 18px;
                height: 18px;
            }
            
            .checkbox-group label {
                font-size: 1.05em;
            }
        </style>
        <div class="tool-interface">
            <div class="form-group">
                <label for="barcode-input">Text/Data to Encode:</label>
                <input type="text" id="barcode-input" placeholder="Enter text or number for the barcode...">
            </div>
            
            <div class="barcode-options">
                <div class="options-column">
                    <div class="form-group options-group">
                        <label for="barcode-format">Barcode Format:</label>
                        <select id="barcode-format" class="form-control">
                            <option value="CODE128">Code 128 (General purpose)</option>
                            <option value="CODE128A">Code 128 A (ASCII control chars)</option>
                            <option value="CODE128B">Code 128 B (Text)</option>
                            <option value="CODE128C">Code 128 C (Numbers)</option>
                            <option value="EAN13">EAN-13 (13 digits)</option>
                            <option value="EAN8">EAN-8 (8 digits)</option>
                            <option value="EAN5">EAN-5 (5 digits)</option>
                            <option value="EAN2">EAN-2 (2 digits)</option>
                            <option value="UPC">UPC (12 digits)</option>
                            <option value="CODE39">Code 39</option>
                            <option value="ITF14">ITF-14</option>
                            <option value="ITF">Interleaved 2 of 5</option>
                            <option value="MSI">MSI</option>
                            <option value="MSI10">MSI10</option>
                            <option value="MSI11">MSI11</option>
                            <option value="MSI1010">MSI1010</option>
                            <option value="MSI1110">MSI1110</option>
                            <option value="pharmacode">Pharmacode</option>
                            <option value="codabar">Codabar</option>
                        </select>
                    </div>
                    
                    <div class="form-group options-group">
                        <label for="barcode-height">Height (px):</label>
                        <input type="number" id="barcode-height" min="20" max="200" value="100">
                    </div>
                    
                    <div class="form-group options-group">
                        <label for="barcode-width">Bar Width (px):</label>
                        <input type="number" id="barcode-width" min="1" max="5" value="2" step="0.5">
                    </div>
                    
                    <div class="form-group options-group">
                        <label for="barcode-margin">Margin (px):</label>
                        <input type="number" id="barcode-margin" min="0" max="50" value="10">
                    </div>
                </div>
                
                <div class="options-column">
                    <div class="form-group options-group">
                        <div class="checkbox-group">
                            <input type="checkbox" id="display-value" checked>
                            <label for="display-value">Display Value</label>
                        </div>
                    </div>
                </div>
            </div>
            
            <button id="generate-btn" class="primary-button">Generate Barcode</button>
            
            <div id="barcode-preview" class="barcode-preview"></div>
            
            <div class="download-options hidden" id="download-options">
                <button id="download-svg-btn" class="secondary-button">Download SVG</button>
                <button id="download-png-btn" class="secondary-button">Download PNG</button>
            </div>
        </div>
    `;

    // Get Barcode elements
    const barcodeInput = document.getElementById('barcode-input');
    const barcodeFormat = document.getElementById('barcode-format');
    const barcodeHeight = document.getElementById('barcode-height');
    const barcodeWidth = document.getElementById('barcode-width');
    const displayValue = document.getElementById('display-value');
    const barcodeMargin = document.getElementById('barcode-margin');
    const generateBtn = document.getElementById('generate-btn');
    const barcodePreview = document.getElementById('barcode-preview');
    const downloadOptions = document.getElementById('download-options');
    const downloadSvgBtn = document.getElementById('download-svg-btn');
    const downloadPngBtn = document.getElementById('download-png-btn');
    
    // Event listener for barcode generation
    generateBtn.addEventListener('click', () => generateBarcode());
    
    // Initial format change to handle format-specific requirements
    barcodeFormat.addEventListener('change', handleFormatChange);
    
    function handleFormatChange() {
        const format = barcodeFormat.value;
        const input = barcodeInput.value;
        
        // Clear any previous error messages
        const existingMessage = document.querySelector('.message');
        if (existingMessage) existingMessage.remove();
        
        // Set format-specific placeholders and hints
        if (format === 'EAN13') {
            barcodeInput.placeholder = "Enter exactly 12 digits (checksum will be calculated)";
        } else if (format === 'EAN8') {
            barcodeInput.placeholder = "Enter exactly 7 digits (checksum will be calculated)";
        } else if (format === 'UPC') {
            barcodeInput.placeholder = "Enter exactly 11 digits (checksum will be calculated)";
        } else if (format.startsWith('MSI')) {
            barcodeInput.placeholder = "Enter numbers only";
        } else if (format === 'pharmacode') {
            barcodeInput.placeholder = "Enter number between 3 and 131070";
        } else {
            barcodeInput.placeholder = "Enter text or number for the barcode...";
        }
    }

    function generateBarcode() {
        try {
            // Clear previous barcode
            barcodePreview.innerHTML = '';
            downloadOptions.classList.add('hidden');

            // Get values from inputs
            const value = barcodeInput.value.trim();
            const format = barcodeFormat.value;
            
            if (!value) {
                showMessage('error', 'Please enter a value for the barcode.');
                return;
            }
            
            // Special validation for specific formats
            if (format === 'EAN13' && !/^\d{12}$/.test(value)) {
                showMessage('error', 'EAN-13 requires exactly 12 digits.');
                return;
            } else if (format === 'EAN8' && !/^\d{7}$/.test(value)) {
                showMessage('error', 'EAN-8 requires exactly 7 digits.');
                return;
            } else if (format === 'UPC' && !/^\d{11}$/.test(value)) {
                showMessage('error', 'UPC requires exactly 11 digits.');
                return;
            } else if (format === 'pharmacode' && (parseInt(value) < 3 || parseInt(value) > 131070)) {
                showMessage('error', 'Pharmacode must be a number between 3 and 131070.');
                return;
            }
            
            // Set options
            const options = {
                format: format,
                height: parseInt(barcodeHeight.value),
                width: parseFloat(barcodeWidth.value),
                displayValue: displayValue.checked,
                margin: parseInt(barcodeMargin.value),
                background: "#FFFFFF",
                lineColor: "#000000"
            };

            // Generate barcode - FIXED APPROACH
            // Create the SVG element directly in the preview
            barcodePreview.innerHTML = '<svg id="barcode"></svg>';
            
            // Generate the barcode using JsBarcode
            try {
                JsBarcode("#barcode", value, options);
                
                // Show download options
                downloadOptions.classList.remove('hidden');
                
                // Show success message
                showMessage('success', 'Barcode generated successfully!');
            } catch (error) {
                console.error("JsBarcode error:", error);
                showMessage('error', `Failed to generate barcode: ${error.message}`);
            }
        } catch (error) {
            console.error(error);
            showMessage('error', error.message || 'Failed to generate barcode. Check your input.');
        }
    }
    
    // Download functionality
    downloadSvgBtn.addEventListener('click', () => {
        const svgElement = document.getElementById('barcode');
        if (!svgElement) return;
        
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
        const svgUrl = URL.createObjectURL(svgBlob);
        
        const downloadLink = document.createElement('a');
        downloadLink.href = svgUrl;
        downloadLink.download = 'barcode.svg';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    });
    
    downloadPngBtn.addEventListener('click', () => {
        const svgElement = document.getElementById('barcode');
        if (!svgElement) return;
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const img = new Image();
        
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            const pngUrl = canvas.toDataURL('image/png');
            
            const downloadLink = document.createElement('a');
            downloadLink.href = pngUrl;
            downloadLink.download = 'barcode.png';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        };
        
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    });

    function showMessage(type, message) {
        // Remove any existing message
        const existingMessage = document.querySelector('.message');
        if (existingMessage) existingMessage.remove();

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;

        // Add message to DOM
        const outputArea = document.querySelector('.tool-interface');
        if (outputArea) {
            outputArea.insertBefore(messageDiv, barcodePreview);

            // Auto-remove after 3 seconds
            setTimeout(() => {
                messageDiv.remove();
            }, 3000);
        }
    }
    
    // Initialize with format-specific requirements
    handleFormatChange();

    // Check if JsBarcode is available
    if (typeof JsBarcode === 'undefined') {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'alert alert-danger';
        errorMessage.innerHTML = `
            <strong>Error:</strong> JsBarcode library is not available. 
            Please check your internet connection and reload the page.
        `;
        container.prepend(errorMessage);
    }
}
