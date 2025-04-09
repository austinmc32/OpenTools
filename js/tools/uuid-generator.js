export function uuidGenerator(container) {
    container.innerHTML = `
        <div class="tool-interface">
            <div class="uuid-controls">
                <div class="control-group">
                    <label for="uuid-version">UUID Version:</label>
                    <select id="uuid-version" class="full-width">
                        <option value="4">Version 4 (Random)</option>
                        <option value="1">Version 1 (Time-based)</option>
                    </select>
                </div>
                
                <div class="control-group">
                    <label for="uuid-count">Number of UUIDs:</label>
                    <input type="number" id="uuid-count" min="1" max="100" value="5" class="full-width">
                </div>
                
                <div class="format-options">
                    <div class="control-group checkbox">
                        <input type="checkbox" id="uppercase-uuid">
                        <label for="uppercase-uuid">Uppercase</label>
                    </div>
                    
                    <div class="control-group checkbox">
                        <input type="checkbox" id="braces-uuid">
                        <label for="braces-uuid">Add Braces {}</label>
                    </div>
                    
                    <div class="control-group checkbox">
                        <input type="checkbox" id="hyphens-uuid" checked>
                        <label for="hyphens-uuid">Include Hyphens</label>
                    </div>
                </div>
            </div>
            
            <button id="generate-uuid" class="primary-button">Generate UUIDs</button>
            
            <div class="output-area">
                <div id="uuid-output" class="output-box"></div>
                <div class="button-group">
                    <button id="copy-uuid" class="copy-button">Copy to Clipboard</button>
                    <button id="download-uuid" class="secondary-button">Download as TXT</button>
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
    `;
    document.head.appendChild(style);

    const uuidVersion = document.getElementById('uuid-version');
    const uuidCount = document.getElementById('uuid-count');
    const uppercaseUuid = document.getElementById('uppercase-uuid');
    const bracesUuid = document.getElementById('braces-uuid');
    const hyphensUuid = document.getElementById('hyphens-uuid');
    const generateBtn = document.getElementById('generate-uuid');
    const uuidOutput = document.getElementById('uuid-output');
    const copyBtn = document.getElementById('copy-uuid');
    const downloadBtn = document.getElementById('download-uuid');
    
    generateBtn.addEventListener('click', generateUUIDs);
    
    // Initial generation
    generateUUIDs();
    
    function generateUUIDs() {
        const version = parseInt(uuidVersion.value);
        const count = parseInt(uuidCount.value);
        const uppercase = uppercaseUuid.checked;
        const braces = bracesUuid.checked;
        const hyphens = hyphensUuid.checked;
        
        let result = '';
        
        for (let i = 0; i < count; i++) {
            let uuid = generateUUID(version, hyphens);
            
            if (uppercase) {
                uuid = uuid.toUpperCase();
            }
            
            if (braces) {
                uuid = '{' + uuid + '}';
            }
            
            result += uuid + '\n';
        }
        
        uuidOutput.textContent = result.trim();
    }
    
    function generateUUID(version, hyphens) {
        if (version === 1) {
            // Simple time-based UUID for demo purposes
            const now = new Date();
            const timestamp = now.getTime();
            const timestampHex = timestamp.toString(16).padStart(16, '0');
            const randomHex = generateRandomHex(16);
            
            let uuid = timestampHex.slice(0, 8) + 
                       '-' + 
                       timestampHex.slice(8, 12) + 
                       '-1' + 
                       timestampHex.slice(13, 16) + 
                       '-' + 
                       randomHex.slice(0, 4) + 
                       '-' + 
                       randomHex.slice(4, 16);
                       
            if (!hyphens) {
                uuid = uuid.replace(/-/g, '');
            }
            
            return uuid;
        } else {
            // Version 4 UUID (random)
            let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            
            if (!hyphens) {
                uuid = uuid.replace(/-/g, '');
            }
            
            return uuid;
        }
    }
    
    function generateRandomHex(length) {
        let result = '';
        const characters = 'abcdef0123456789';
        
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        
        return result;
    }
    
    // Copy to clipboard
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(uuidOutput.textContent).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        });
    });
    
    // Download as TXT
    downloadBtn.addEventListener('click', () => {
        const blob = new Blob([uuidOutput.textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'uuids.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}
