export function passwordGenerator(container) {
    container.innerHTML = `
        <style>
            .password-display {
                margin-top: 15px;
                padding: 15px;
                font-family: monospace;
                font-size: 18px;
                letter-spacing: 0.05em;
                background-color: rgba(0, 0, 0, 0.05);
                border-radius: 6px;
                word-break: break-all;
                position: relative;
                border: 1px solid #ddd;
                cursor: text; /* Indicate that the field is editable */
            }

            .password-display[contenteditable="true"]:focus {
                outline: 2px solid #5c9eff;
            }

            .copy-icon {
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                cursor: pointer;
                padding: 5px;
                border-radius: 3px;
                transition: background-color 0.2s;
            }

            .copy-icon:hover {
                background-color: rgba(0, 0, 0, 0.1);
            }

            .slider-container {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 15px;
            }

            .checkbox-group {
                margin-bottom: 15px;
            }

            .checkbox-option {
                margin-bottom: 8px;
                display: flex;
                align-items: center;
            }

            .checkbox-option input[type="checkbox"] {
                margin-right: 8px;
                width: 18px;
                height: 18px;
            }

            .password-strength {
                margin-top: 15px;
                padding: 10px;
                border-radius: 4px;
            }

            .strength-meter {
                height: 8px;
                border-radius: 4px;
                margin-top: 5px;
                background-color: #e0e0e0;
                position: relative;
                overflow: hidden;
            }

            .strength-meter-fill {
                height: 100%;
                transition: width 0.3s;
            }

            .very-weak { background-color: #FF4C4C; width: 20%; }
            .weak { background-color: #FFA500; width: 40%; }
            .medium { background-color: #FFDD00; width: 60%; }
            .strong { background-color: #86C232; width: 80%; }
            .very-strong { background-color: #229954; width: 100%; }

            .exclude-similar-group {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 15px;
            }

            .exclude-similar-group input[type="checkbox"] {
                width: 18px;
                height: 18px;
            }

            .exclude-similar-group label {
                font-size: 1em;
                color: inherit;
            }

            .exclude-similar-group .checkbox-label {
                font-size: 0.9em;
                color: #666;
            }

            @media (prefers-color-scheme: dark) {
                .password-display {
                    background-color: rgba(255, 255, 255, 0.1);
                    border-color: #444;
                }
                
                .copy-icon:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                }

                .exclude-similar-group .checkbox-label {
                    color: #aaa;
                }
            }
        </style>
        <div class="tool-interface">
            <div class="form-group slider-container">
                <label for="length-input">Password Length:</label>
                <input type="range" id="length-input" min="6" max="32" value="12">
                <span id="length-display">12</span>
            </div>
            
            <div class="checkbox-group">
                <label>Include:</label>
                <div class="checkbox-option">
                    <input type="checkbox" id="uppercase-check" checked>
                    <label for="uppercase-check">Uppercase Letters (A-Z)</label>
                </div>
                <div class="checkbox-option">
                    <input type="checkbox" id="lowercase-check" checked>
                    <label for="lowercase-check">Lowercase Letters (a-z)</label>
                </div>
                <div class="checkbox-option">
                    <input type="checkbox" id="numbers-check" checked>
                    <label for="numbers-check">Numbers (0-9)</label>
                </div>
                <div class="checkbox-option">
                    <input type="checkbox" id="symbols-check" checked>
                    <label for="symbols-check">Symbols (!@#$%...)</label>
                </div>
            </div>
            
            <div class="exclude-similar-group">
                <input type="checkbox" id="exclude-similar">
                <label for="exclude-similar">Exclude Similar Characters</label>
                <span class="checkbox-label">(e.g. i, l, 1, I, o, 0, O)</span>
            </div>
            
            <button id="generate-btn" class="primary-button">Generate Password</button>
            
            <div class="password-display" id="password-display" contenteditable="true">
                Generate a password to see it here
                <span class="copy-icon" id="copy-password" title="Copy to clipboard">
                    <i class="fas fa-copy"></i>
                </span>
            </div>
            
            <div class="password-strength">
                <div>Password Strength: <span id="strength-text">N/A</span></div>
                <div class="strength-meter">
                    <div class="strength-meter-fill" id="strength-meter-fill"></div>
                </div>
            </div>
        </div>
    `;

    // Get elements
    const passwordDisplay = document.getElementById('password-display');
    const lengthInput = document.getElementById('length-input');
    const lengthDisplay = document.getElementById('length-display');
    const uppercaseCheck = document.getElementById('uppercase-check');
    const lowercaseCheck = document.getElementById('lowercase-check');
    const numbersCheck = document.getElementById('numbers-check');
    const symbolsCheck = document.getElementById('symbols-check');
    const excludeSimilarCheck = document.getElementById('exclude-similar');
    const generateBtn = document.getElementById('generate-btn');
    const copyPasswordBtn = document.getElementById('copy-password');
    const strengthText = document.getElementById('strength-text');
    const strengthMeterFill = document.getElementById('strength-meter-fill');

    // Update slider display value
    lengthInput.addEventListener('input', () => {
        lengthDisplay.textContent = lengthInput.value;
    });

    // Character sets
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_-+=<>?/{}[]|';
    const similarChars = 'iIl1oO0';

    // Generate password
    generateBtn.addEventListener('click', () => {
        // Ensure at least one character type is selected
        if (![uppercaseCheck, lowercaseCheck, numbersCheck, symbolsCheck].some(cb => cb.checked)) {
            showMessage('error', 'Please select at least one character type.');
            return;
        }

        const length = parseInt(lengthInput.value) || 12;
        let charset = '';
        
        if (uppercaseCheck.checked) charset += uppercaseChars;
        if (lowercaseCheck.checked) charset += lowercaseChars;
        if (numbersCheck.checked) charset += numberChars;
        if (symbolsCheck.checked) charset += symbolChars;
        
        // Remove similar characters if option is checked
        if (excludeSimilarCheck.checked) {
            charset = charset.split('').filter(c => !similarChars.includes(c)).join('');
        }
        
        // Generate password
        let password = '';
        
        // Ensure at least one character from each selected type
        if (uppercaseCheck.checked) {
            password += getRandomChar(uppercaseChars.replace(similarChars, ''));
        }
        if (lowercaseCheck.checked) {
            password += getRandomChar(lowercaseChars.replace(similarChars, ''));
        }
        if (numbersCheck.checked) {
            password += getRandomChar(numberChars.replace(similarChars, ''));
        }
        if (symbolsCheck.checked) {
            password += getRandomChar(symbolChars);
        }
        
        // Fill remaining characters
        for (let i = password.length; i < length; i++) {
            password += getRandomChar(charset);
        }
        
        // Shuffle the password to avoid predictable patterns
        password = shuffleString(password);
        
        // Display password
        passwordDisplay.innerHTML = password + `
            <span class="copy-icon" id="copy-password" title="Copy to clipboard">
                <i class="fas fa-copy"></i>
            </span>
        `;
        
        // Update strength meter
        updatePasswordStrength(password);
        
        // Re-attach event listener after DOM update
        document.getElementById('copy-password').addEventListener('click', copyPassword);
    });
    
    // Helper function to get random character
    function getRandomChar(charset) {
        return charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Helper function to shuffle string
    function shuffleString(str) {
        const array = str.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }
    
    // Copy password to clipboard
    function copyPassword() {
        const passwordText = passwordDisplay.textContent.trim();
        
        navigator.clipboard.writeText(passwordText)
            .then(() => {
                showMessage('success', 'Password copied to clipboard!');
            })
            .catch(err => {
                showMessage('error', 'Failed to copy password.');
                console.error('Could not copy text: ', err);
            });
    }
    
    // Initial event listener for copy button
    copyPasswordBtn.addEventListener('click', copyPassword);
    
    // Calculate password strength
    function updatePasswordStrength(password) {
        const length = password.length;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSymbols = /[!@#$%^&*()_\-+=<>?/{}[\]|]/.test(password);
        
        const charTypesCount = [hasUppercase, hasLowercase, hasNumbers, hasSymbols].filter(Boolean).length;
        
        let strength = 0;
        
        // Length contribution
        if (length > 8) strength += 1;
        if (length > 12) strength += 1;
        if (length > 16) strength += 1;
        
        // Character variety contribution
        strength += charTypesCount;
        
        // Set strength indicators
        strengthMeterFill.className = 'strength-meter-fill';
        if (strength <= 2) {
            strengthText.textContent = 'Very Weak';
            strengthMeterFill.classList.add('very-weak');
        } else if (strength === 3) {
            strengthText.textContent = 'Weak';
            strengthMeterFill.classList.add('weak');
        } else if (strength === 4) {
            strengthText.textContent = 'Medium';
            strengthMeterFill.classList.add('medium');
        } else if (strength === 5) {
            strengthText.textContent = 'Strong';
            strengthMeterFill.classList.add('strong');
        } else {
            strengthText.textContent = 'Very Strong';
            strengthMeterFill.classList.add('very-strong');
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
        const toolInterface = document.querySelector('.tool-interface');
        toolInterface.insertBefore(messageDiv, toolInterface.firstChild);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
    
    // Add event listener to update password strength when the user types in the password display
    passwordDisplay.addEventListener('input', () => {
        const typedPassword = passwordDisplay.textContent.trim();
        updatePasswordStrength(typedPassword);
    });

    // Generate initial password
    generateBtn.click();
}