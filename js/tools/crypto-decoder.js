export function cryptoDecoder(container) {
    container.innerHTML = `
        <div class="tool-interface">
            <div class="decoder-controls">
                <div class="control-group">
                    <label for="crypto-type">Encoding Type:</label>
                    <select id="crypto-type" class="form-control">
                        <option value="morse">Morse Code</option>
                        <option value="binary">Binary</option>
                        <option value="hex">Hexadecimal</option>
                        <option value="base64">Base64</option>
                        <option value="caesar">Caesar Cipher</option>
                        <option value="url">URL Encoding</option>
                        <option value="ascii">ASCII/Unicode</option>
                    </select>
                </div>
                
                <div class="control-group">
                    <label for="conversion-direction">Direction:</label>
                    <select id="conversion-direction" class="form-control">
                        <option value="encode">Encode</option>
                        <option value="decode">Decode</option>
                    </select>
                </div>
                
                <div id="options-container" class="options-container">
                    <!-- Dynamic options will appear here based on selected encoding -->
                </div>
            </div>
            
            <div class="conversion-container">
                <div class="conversion-panel">
                    <h3 id="input-label">Text to Encode</h3>
                    <textarea id="input-text" placeholder="Enter text here..." rows="6" class="full-width"></textarea>
                </div>
                
                <div class="conversion-actions">
                    <button id="convert-btn" class="primary-button">
                        <i class="fas fa-exchange-alt"></i> Convert
                    </button>
                    <button id="swap-btn" class="secondary-button" title="Swap Input/Output">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                </div>
                
                <div class="conversion-panel">
                    <h3 id="output-label">Encoded Result</h3>
                    <textarea id="output-text" placeholder="Result will appear here..." rows="6" class="full-width" readonly></textarea>
                    <button id="copy-result" class="copy-button">
                        <i class="fas fa-copy"></i> Copy to Clipboard
                    </button>
                </div>
            </div>
            
            <div class="decoder-info">
                <div class="info-header">
                    <h3 id="info-title">About Morse Code</h3>
                    <button id="toggle-info" class="toggle-button">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </div>
                <div id="info-content" class="info-content">
                    <!-- Dynamic content will be loaded here -->
                </div>
            </div>
        </div>
    `;

    // Add styles with consistent button styling
    const style = document.createElement('style');
    style.textContent = `
        .decoder-controls {
            background-color: var(--card-color);
            border-radius: 8px;
            box-shadow: var(--shadow);
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
        }
        
        .control-group {
            flex: 1;
            min-width: 200px;
        }
        
        .options-container {
            width: 100%;
            margin-top: 0.5rem;
        }
        
        .conversion-container {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            margin-bottom: 1.5rem;
        }
        
        .conversion-panel {
            flex: 1;
            min-width: 300px;
            background-color: var(--card-color);
            border-radius: 8px;
            box-shadow: var(--shadow);
            padding: 1.5rem;
        }
        
        .conversion-actions {
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 1rem;
        }
        
        .copy-button {
            margin-top: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            justify-content: center;
        }
        
        .decoder-info {
            background-color: var(--card-color);
            border-radius: 8px;
            box-shadow: var(--shadow);
            overflow: hidden;
        }
        
        .info-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 1.5rem;
            border-bottom: 1px solid var(--border-color);
            cursor: pointer;
        }
        
        .info-content {
            padding: 1.5rem;
            max-height: 0;
            overflow: hidden;
            transition: max-height var(--transition-medium);
        }
        
        .info-content.open {
            max-height: 500px;
        }
        
        .toggle-button {
            background: none;
            border: none;
            color: var(--text-color);
            cursor: pointer;
            transition: transform var(--transition-fast);
        }
        
        .toggle-button.open i {
            transform: rotate(180deg);
        }
        
        .reference-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
        }
        
        .reference-table th, .reference-table td {
            border: 1px solid var(--border-color);
            padding: 0.5rem;
            text-align: left;
        }
        
        .reference-table th {
            background-color: var(--background-color);
        }
        
        .reference-row td:first-child {
            font-weight: bold;
            font-family: monospace;
        }
        
        .cipher-option {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-top: 1rem;
        }
        
        .cipher-option label {
            min-width: 100px;
        }
        
        .cipher-option input[type="range"] {
            flex: 1;
        }
        
        .cipher-option .value-display {
            min-width: 30px;
            text-align: center;
        }
        
        .primary-button, .secondary-button, .copy-button {
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            border: 1px solid transparent;
            transition: all 0.2s ease;
            margin: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
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
        
        .primary-button i, .secondary-button i {
            margin-right: 5px;
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
        }
    `;
    document.head.appendChild(style);

    // Elements
    const cryptoType = document.getElementById('crypto-type');
    const conversionDirection = document.getElementById('conversion-direction');
    const optionsContainer = document.getElementById('options-container');
    const inputText = document.getElementById('input-text');
    const outputText = document.getElementById('output-text');
    const convertBtn = document.getElementById('convert-btn');
    const swapBtn = document.getElementById('swap-btn');
    const copyResult = document.getElementById('copy-result');
    const inputLabel = document.getElementById('input-label');
    const outputLabel = document.getElementById('output-label');
    const infoTitle = document.getElementById('info-title');
    const infoContent = document.getElementById('info-content');
    const toggleInfo = document.getElementById('toggle-info');
    
    // References to encoding/decoding functions and options
    let currentOptions = {};
    
    // Initialize
    updateCryptoType();
    updateLabels();
    loadInfoContent();
    
    // Event listeners
    cryptoType.addEventListener('change', () => {
        updateCryptoType();
        loadInfoContent();
    });
    
    conversionDirection.addEventListener('change', updateLabels);
    
    convertBtn.addEventListener('click', convertText);
    
    swapBtn.addEventListener('click', () => {
        // Swap input and output text
        const temp = inputText.value;
        inputText.value = outputText.value;
        outputText.value = temp;
        
        // Also swap the conversion direction
        conversionDirection.value = conversionDirection.value === 'encode' ? 'decode' : 'encode';
        updateLabels();
    });
    
    copyResult.addEventListener('click', () => {
        navigator.clipboard.writeText(outputText.value).then(() => {
            const originalText = copyResult.innerHTML;
            copyResult.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyResult.innerHTML = originalText;
            }, 2000);
        });
    });
    
    toggleInfo.addEventListener('click', function() {
        infoContent.classList.toggle('open');
        this.classList.toggle('open');
    });
    
    // Functions to update UI based on selections
    function updateCryptoType() {
        const type = cryptoType.value;
        
        // Clear options container
        optionsContainer.innerHTML = '';
        
        // Add specific options based on selected crypto type
        switch(type) {
            case 'caesar':
                optionsContainer.innerHTML = `
                    <div class="cipher-option">
                        <label for="caesar-shift">Shift Value:</label>
                        <input type="range" id="caesar-shift" min="1" max="25" value="3">
                        <span id="shift-value" class="value-display">3</span>
                    </div>
                `;
                
                // Add event listener for the shift value
                document.getElementById('caesar-shift').addEventListener('input', function() {
                    document.getElementById('shift-value').textContent = this.value;
                });
                break;
                
            case 'ascii':
                optionsContainer.innerHTML = `
                    <div class="cipher-option">
                        <label for="ascii-format">Format:</label>
                        <select id="ascii-format" class="form-control">
                            <option value="decimal">Decimal (65 66 67)</option>
                            <option value="hex">Hexadecimal (41 42 43)</option>
                            <option value="binary">Binary (01000001 01000010 01000011)</option>
                        </select>
                    </div>
                `;
                break;
        }
        
        updateLabels();
    }
    
    function updateLabels() {
        const direction = conversionDirection.value;
        const type = cryptoType.value;
        
        if (direction === 'encode') {
            inputLabel.textContent = 'Text to Encode';
            outputLabel.textContent = `${capitalizeFirstLetter(type)} Encoded Result`;
        } else {
            inputLabel.textContent = `${capitalizeFirstLetter(type)} to Decode`;
            outputLabel.textContent = 'Decoded Text';
        }
    }
    
    function loadInfoContent() {
        const type = cryptoType.value;
        infoTitle.textContent = `About ${capitalizeFirstLetter(type)} Encoding`;
        
        let content = '';
        
        switch(type) {
            case 'morse':
                content = `
                    <p>Morse code is a method of transmitting text information as a series of on-off tones, lights, or clicks that can be directly understood by a skilled listener or observer without special equipment.</p>
                    <p>Each letter, number and punctuation mark is represented by a unique sequence of dots and dashes (or short and long signals).</p>
                    <table class="reference-table">
                        <tr>
                            <th>Character</th>
                            <th>Morse Code</th>
                        </tr>
                        <tr class="reference-row"><td>A</td><td>.-</td></tr>
                        <tr class="reference-row"><td>B</td><td>-...</td></tr>
                        <tr class="reference-row"><td>C</td><td>-.-.</td></tr>
                        <tr class="reference-row"><td>1</td><td>.----</td></tr>
                        <tr class="reference-row"><td>2</td><td>..---</td></tr>
                        <tr class="reference-row"><td>.</td><td>.-.-.-</td></tr>
                        <tr class="reference-row"><td>,</td><td>--..--</td></tr>
                    </table>
                `;
                break;
                
            case 'binary':
                content = `
                    <p>Binary encoding converts text to binary numbers. Each character is represented by its ASCII/Unicode value in binary (base-2).</p>
                    <p>For example, the letter 'A' has an ASCII value of 65, which in binary is 01000001.</p>
                    <table class="reference-table">
                        <tr>
                            <th>Character</th>
                            <th>Binary</th>
                        </tr>
                        <tr class="reference-row"><td>A</td><td>01000001</td></tr>
                        <tr class="reference-row"><td>B</td><td>01000010</td></tr>
                        <tr class="reference-row"><td>C</td><td>01000011</td></tr>
                        <tr class="reference-row"><td>1</td><td>00110001</td></tr>
                        <tr class="reference-row"><td>2</td><td>00110010</td></tr>
                        <tr class="reference-row"><td>Space</td><td>00100000</td></tr>
                    </table>
                `;
                break;
                
            case 'hex':
                content = `
                    <p>Hexadecimal (base-16) encoding represents each byte of data as a two-digit hexadecimal number (0-9, A-F).</p>
                    <p>For example, the letter 'A' has an ASCII value of 65, which in hexadecimal is 41.</p>
                    <table class="reference-table">
                        <tr>
                            <th>Character</th>
                            <th>Hexadecimal</th>
                        </tr>
                        <tr class="reference-row"><td>A</td><td>41</td></tr>
                        <tr class="reference-row"><td>B</td><td>42</td></tr>
                        <tr class="reference-row"><td>C</td><td>43</td></tr>
                        <tr class="reference-row"><td>1</td><td>31</td></tr>
                        <tr class="reference-row"><td>2</td><td>32</td></tr>
                        <tr class="reference-row"><td>Space</td><td>20</td></tr>
                    </table>
                `;
                break;
                
            case 'base64':
                content = `
                    <p>Base64 is a group of binary-to-text encoding schemes that represent binary data in an ASCII string format by translating it into a radix-64 representation.</p>
                    <p>It's commonly used when there is a need to encode binary data that needs to be stored and transferred over media that are designed to deal with ASCII text. This ensures that the data remains intact without modification during transport.</p>
                    <p>Base64 is commonly used in email attachments, to encode binary data in URLs, and in many other applications where binary data needs to be stored or transmitted as text.</p>
                `;
                break;
                
            case 'caesar':
                content = `
                    <p>The Caesar cipher is one of the earliest and simplest encryption techniques. It's a type of substitution cipher where each letter in the plaintext is shifted a certain number of places down the alphabet.</p>
                    <p>For example, with a left shift of 3, D would be replaced by A, E would become B, and so on.</p>
                    <p>The method is named after Julius Caesar, who used it in his private correspondence.</p>
                    <table class="reference-table">
                        <tr>
                            <th>Original</th>
                            <th>A</th><th>B</th><th>C</th><th>D</th><th>E</th><th>F</th><th>G</th><th>H</th><th>...</th>
                        </tr>
                        <tr class="reference-row">
                            <td>Shift 1</td>
                            <td>B</td><td>C</td><td>D</td><td>E</td><td>F</td><td>G</td><td>H</td><td>I</td><td>...</td>
                        </tr>
                        <tr class="reference-row">
                            <td>Shift 2</td>
                            <td>C</td><td>D</td><td>E</td><td>F</td><td>G</td><td>H</td><td>I</td><td>J</td><td>...</td>
                        </tr>
                        <tr class="reference-row">
                            <td>Shift 3</td>
                            <td>D</td><td>E</td><td>F</td><td>G</td><td>H</td><td>I</td><td>J</td><td>K</td><td>...</td>
                        </tr>
                    </table>
                `;
                break;
                
            case 'url':
                content = `
                    <p>URL encoding, also known as percent-encoding, is a mechanism for encoding information in a Uniform Resource Identifier (URI) especially when URI characters are not allowed or unsafe in certain contexts.</p>
                    <p>In URL encoding, certain characters are replaced with a % followed by their ASCII value in hexadecimal. For example, space is encoded as %20.</p>
                    <table class="reference-table">
                        <tr>
                            <th>Character</th>
                            <th>URL Encoded</th>
                        </tr>
                        <tr class="reference-row"><td>Space</td><td>%20</td></tr>
                        <tr class="reference-row"><td>!</td><td>%21</td></tr>
                        <tr class="reference-row"><td>#</td><td>%23</td></tr>
                        <tr class="reference-row"><td>$</td><td>%24</td></tr>
                        <tr class="reference-row"><td>&</td><td>%26</td></tr>
                        <tr class="reference-row"><td>'</td><td>%27</td></tr>
                        <tr class="reference-row"><td>(</td><td>%28</td></tr>
                        <tr class="reference-row"><td>)</td><td>%29</td></tr>
                    </table>
                `;
                break;
                
            case 'ascii':
                content = `
                    <p>ASCII (American Standard Code for Information Interchange) is a character encoding standard for electronic communication. ASCII codes represent text in computers, telecommunications equipment, and other devices.</p>
                    <p>Each ASCII character is assigned a numerical value from 0 to 127. For example, the ASCII value for the uppercase letter 'A' is 65.</p>
                    <p>This tool can convert between text and ASCII values in different formats: decimal, hexadecimal, or binary.</p>
                    <table class="reference-table">
                        <tr>
                            <th>Character</th>
                            <th>Decimal</th>
                            <th>Hexadecimal</th>
                            <th>Binary</th>
                        </tr>
                        <tr class="reference-row">
                            <td>A</td><td>65</td><td>41</td><td>01000001</td>
                        </tr>
                        <tr class="reference-row">
                            <td>B</td><td>66</td><td>42</td><td>01000010</td>
                        </tr>
                        <tr class="reference-row">
                            <td>C</td><td>67</td><td>43</td><td>01000011</td>
                        </tr>
                        <tr class="reference-row">
                            <td>Space</td><td>32</td><td>20</td><td>00100000</td>
                        </tr>
                    </table>
                `;
                break;
        }
        
        infoContent.innerHTML = content;
    }
    
    // Main conversion function
    function convertText() {
        const type = cryptoType.value;
        const direction = conversionDirection.value;
        const input = inputText.value.trim();
        
        if (!input) {
            outputText.value = '';
            return;
        }
        
        let result = '';
        
        try {
            switch(type) {
                case 'morse':
                    result = direction === 'encode' ? textToMorse(input) : morseToText(input);
                    break;
                    
                case 'binary':
                    result = direction === 'encode' ? textToBinary(input) : binaryToText(input);
                    break;
                    
                case 'hex':
                    result = direction === 'encode' ? textToHex(input) : hexToText(input);
                    break;
                    
                case 'base64':
                    result = direction === 'encode' ? btoa(unescape(encodeURIComponent(input))) : decodeURIComponent(escape(atob(input)));
                    break;
                    
                case 'caesar':
                    const shift = parseInt(document.getElementById('caesar-shift').value);
                    result = caesarCipher(input, direction === 'encode' ? shift : (26 - shift));
                    break;
                    
                case 'url':
                    result = direction === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input);
                    break;
                    
                case 'ascii':
                    const format = document.getElementById('ascii-format').value;
                    result = direction === 'encode' ? textToAscii(input, format) : asciiToText(input, format);
                    break;
            }
            
            outputText.value = result;
            
        } catch (error) {
            outputText.value = `Error: ${error.message}`;
        }
    }
    
    // Conversion functions for different encodings
    function textToMorse(text) {
        const morseCodeMap = {
            'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
            'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
            'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..',
            '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
            '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
            '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
            ' ': '/'
        };
        
        return text.toUpperCase().split('').map(char => {
            return morseCodeMap[char] || char;
        }).join(' ');
    }
    
    function morseToText(morse) {
        const morseToTextMap = {
            '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I', '.---': 'J',
            '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T',
            '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y', '--..': 'Z',
            '-----': '0', '.----': '1', '..---': '2', '...--': '3', '....-': '4', '.....': '5', '-....': '6', '--...': '7', '---..': '8', '----.': '9',
            '.-.-.-': '.', '--..--': ',', '..--..': '?', '.----.': "'", '-.-.--': '!', '-..-.': '/', '-.--.': '(', '-.--.-': ')',
            '.-...': '&', '---...': ':', '-.-.-.': ';', '-...-': '=', '.-.-.': '+', '-....-': '-', '..--.-': '_', '.-..-.': '"', '...-..-': '$', '.--.-.': '@',
            '/': ' '
        };
        
        return morse.split(' ').map(code => {
            return morseToTextMap[code] || code;
        }).join('');
    }
    
    function textToBinary(text) {
        return text.split('').map(char => {
            return char.charCodeAt(0).toString(2).padStart(8, '0');
        }).join(' ');
    }
    
    function binaryToText(binary) {
        return binary.split(' ').map(bin => {
            return String.fromCharCode(parseInt(bin, 2));
        }).join('');
    }
    
    function textToHex(text) {
        return text.split('').map(char => {
            return char.charCodeAt(0).toString(16).padStart(2, '0');
        }).join(' ');
    }
    
    function hexToText(hex) {
        return hex.split(' ').map(h => {
            return String.fromCharCode(parseInt(h, 16));
        }).join('');
    }
    
    function caesarCipher(text, shift) {
        return text.split('').map(char => {
            const code = char.charCodeAt(0);
            
            // Handle uppercase letters
            if (code >= 65 && code <= 90) {
                return String.fromCharCode(((code - 65 + shift) % 26) + 65);
            }
            // Handle lowercase letters
            else if (code >= 97 && code <= 122) {
                return String.fromCharCode(((code - 97 + shift) % 26) + 97);
            }
            // Leave other characters unchanged
            return char;
        }).join('');
    }
    
    function textToAscii(text, format) {
        return text.split('').map(char => {
            const code = char.charCodeAt(0);
            switch(format) {
                case 'decimal':
                    return code;
                case 'hex':
                    return code.toString(16).padStart(2, '0');
                case 'binary':
                    return code.toString(2).padStart(8, '0');
                default:
                    return code;
            }
        }).join(' ');
    }
    
    function asciiToText(ascii, format) {
        return ascii.split(' ').map(code => {
            let charCode;
            switch(format) {
                case 'decimal':
                    charCode = parseInt(code);
                    break;
                case 'hex':
                    charCode = parseInt(code, 16);
                    break;
                case 'binary':
                    charCode = parseInt(code, 2);
                    break;
                default:
                    charCode = parseInt(code);
            }
            return String.fromCharCode(charCode);
        }).join('');
    }
    
    // Helper function
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}
