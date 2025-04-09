export function passwordGenerator(container) {
    container.innerHTML = `
        <style>
            /* Retain only password-generator specific styles */
            .password-display {
                margin-top: 20px;
                font-family: monospace;
                letter-spacing: 0.05em;
            }
            .slider-container {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 15px;
            }
            /* Removed duplicate common styles (e.g., .primary-button, .form-control) */
        </style>
        <div class="tool-interface">
            <h2>Password Generator</h2>
            <!-- Tool-specific markup -->
            <div class="form-group slider-container">
                <label for="length-input">Password Length:</label>
                <input type="range" id="length-input" min="6" max="32" value="8">
                <span id="length-display">8</span>
            </div>
            <button id="generate-btn" class="primary-button">Generate Password</button>
            <div id="password-display" class="password-display"></div>
        </div>
    `;

    // Get elements
    const passwordDisplay = document.getElementById('password-display');
    const lengthInput = document.getElementById('length-input');
    const lengthDisplay = document.getElementById('length-display');
    const generateBtn = document.getElementById('generate-btn');

    // Update slider display value
    lengthInput.addEventListener('input', () => {
        lengthDisplay.textContent = lengthInput.value;
    });

    // Character sets
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_-+=<>?/{}[]|';

    // Generate password
    generateBtn.addEventListener('click', () => {
        const length = parseInt(lengthInput.value) || 8;
        let charset = uppercaseChars + lowercaseChars + numberChars + symbolChars;
        let password = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }

        passwordDisplay.textContent = password;
    });
}