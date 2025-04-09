export function barcodeGenerator(container) {
    container.innerHTML = `
        <style>
            /* Retain only barcode-generator specific styles */
            .barcode-preview {
                margin-top: 20px;
                text-align: center;
            }
            /* Removed redundant common styles like .btn-primary, .form-control, etc. */
        </style>
        <div class="tool-interface">
            <h2>Barcode Generator</h2>
            <!-- Tool-specific markup -->
            <div class="form-group">
                <label for="barcode-input">Enter text:</label>
                <input type="text" id="barcode-input" placeholder="Type here...">
            </div>
            <button id="generate-btn" class="primary-button">Generate Barcode</button>
            <div id="barcode-preview" class="barcode-preview"></div>
        </div>
    `;

    // Get Barcode elements
    const barcodeInput = document.getElementById('barcode-input');
    const generateBtn = document.getElementById('generate-btn');
    const barcodePreview = document.getElementById('barcode-preview');

    // Event listener for barcode generation
    generateBtn.addEventListener('click', () => generateBarcode());

    function generateBarcode() {
        try {
            // Clear previous barcode
            barcodePreview.innerHTML = '';

            // Set options
            const options = {
                format: 'CODE128',
                height: 100,
                width: 2,
                displayValue: true,
                margin: 10,
                background: "#ffffff",
                lineColor: "#000000"
            };

            // Generate barcode
            JsBarcode("#barcode-preview", barcodeInput.value, options);

            // Show success message
            showMessage('success', 'Barcode generated successfully!');
        } catch (error) {
            console.error(error);
            showMessage('error', error.message || 'Failed to generate barcode. Check your input.');
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
        const outputArea = document.querySelector('.tool-interface');
        if (outputArea) {
            outputArea.appendChild(messageDiv);

            // Auto-remove after 3 seconds
            setTimeout(() => {
                messageDiv.remove();
            }, 3000);
        }
    }
}
