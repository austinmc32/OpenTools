export function csvJsonConverter(container) {
    container.innerHTML = `
        <style>
            .converter-interface { /* ...existing style... */ }
            .converter-section { margin-bottom: 20px; }
            .converter-buttons { display: flex; gap: 10px; margin-top: 10px; }
            textarea { width: 100%; height: 150px; padding: 10px; font-family: monospace; }
            
            .file-upload-area {
                border: 2px dashed #ccc;
                border-radius: 8px;
                padding: 20px;
                text-align: center;
                margin-bottom: 20px;
                cursor: pointer;
                transition: all 0.3s;
                position: relative;
            }
            
            .file-upload-area.drag-over {
                border-color: var(--accent-color);
                background-color: rgba(var(--accent-color-rgb), 0.1);
            }
            
            .file-upload-area input[type="file"] {
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                opacity: 0;
                cursor: pointer;
            }
            
            .upload-icon {
                font-size: 2rem;
                color: var(--accent-color);
                margin-bottom: 10px;
            }
        </style>
        <div class="tool-interface converter-interface">
            <div class="file-upload-area" id="file-drop-area">
                <i class="fas fa-file-upload upload-icon"></i>
                <p>Drag & drop a CSV or JSON file here, or click to select</p>
                <input type="file" id="file-upload" accept=".csv,.json">
            </div>
            
            <div class="converter-section">
                <label for="csv-input">CSV Input:</label>
                <textarea id="csv-input" placeholder="Enter CSV data..."></textarea>
            </div>
            <div class="converter-buttons">
                <button id="convert-to-json" class="primary-button">Convert to JSON</button>
            </div>
            <div class="converter-section">
                <label for="json-input">JSON Input:</label>
                <textarea id="json-input" placeholder="Enter JSON data..."></textarea>
            </div>
            <div class="converter-buttons">
                <button id="convert-to-csv" class="primary-button">Convert to CSV</button>
            </div>
            <div id="converter-message"></div>
        </div>
    `;

    const csvInput = document.getElementById('csv-input');
    const jsonInput = document.getElementById('json-input');
    const convertToJsonBtn = document.getElementById('convert-to-json');
    const convertToCsvBtn = document.getElementById('convert-to-csv');
    const messageDiv = document.getElementById('converter-message');
    const fileDropArea = document.getElementById('file-drop-area');
    const fileUpload = document.getElementById('file-upload');

    // File upload handling
    fileUpload.addEventListener('change', handleFileUpload);
    
    // Drag and drop functionality
    fileDropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileDropArea.classList.add('drag-over');
    });
    
    fileDropArea.addEventListener('dragleave', () => {
        fileDropArea.classList.remove('drag-over');
    });
    
    fileDropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileDropArea.classList.remove('drag-over');
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });
    
    function handleFileUpload(e) {
        const file = e.target.files[0];
        if (file) {
            handleFile(file);
        }
    }
    
    function handleFile(file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const content = e.target.result;
            
            if (file.name.endsWith('.csv')) {
                // It's a CSV file
                csvInput.value = content;
                showMessage('CSV file loaded successfully!');
            } else if (file.name.endsWith('.json')) {
                // It's a JSON file
                jsonInput.value = content;
                showMessage('JSON file loaded successfully!');
            } else {
                showMessage('Error: Unsupported file format. Please upload a CSV or JSON file.');
            }
        };
        
        reader.onerror = function() {
            showMessage('Error: Failed to read file.');
        };
        
        // Read the file as text
        reader.readAsText(file);
    }

    // Conversion handlers
    convertToJsonBtn.addEventListener('click', () => {
        try {
            const csvText = csvInput.value.trim();
            if (!csvText) throw new Error('CSV input is empty.');
            const lines = csvText.split(/\r?\n/).filter(line => line.trim());
            const headers = lines[0].split(',').map(h => h.trim());
            const result = lines.slice(1).map(line => {
                const values = line.split(',').map(v => v.trim());
                const obj = {};
                headers.forEach((header, index) => {
                    obj[header] = values[index] || "";
                });
                return obj;
            });
            jsonInput.value = JSON.stringify(result, null, 2);
            showMessage('Success: CSV converted to JSON.');
        } catch (error) {
            showMessage(`Error: ${error.message}`);
        }
    });

    convertToCsvBtn.addEventListener('click', () => {
        try {
            const jsonText = jsonInput.value.trim();
            if (!jsonText) throw new Error('JSON input is empty.');
            let data = JSON.parse(jsonText);
            if (!Array.isArray(data)) {
                throw new Error('JSON data must be an array of objects.');
            }
            if (data.length === 0) {
                throw new Error('JSON array is empty.');
            }
            const headers = Object.keys(data[0]);
            const csvLines = [];
            csvLines.push(headers.join(','));
            data.forEach(item => {
                const line = headers.map(header => {
                    let value = item[header] !== undefined ? item[header] : "";
                    if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                        value = '"' + value.replace(/"/g, '""') + '"';
                    }
                    return value;
                }).join(',');
                csvLines.push(line);
            });
            csvInput.value = csvLines.join('\n');
            showMessage('Success: JSON converted to CSV.');
        } catch (error) {
            showMessage(`Error: ${error.message}`);
        }
    });

    function showMessage(msg) {
        messageDiv.textContent = msg;
        setTimeout(() => { messageDiv.textContent = ''; }, 3000);
    }
}
