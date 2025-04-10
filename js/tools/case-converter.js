export function caseConverter(container) {
    container.innerHTML = `
        <style>
            /* Case converter specific styles */
            .converter-result {
                margin-top: 10px;
                font-weight: bold;
                padding: 15px;
                background-color: rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                min-height: 50px;
                word-wrap: break-word;
                overflow-wrap: break-word;
                white-space: normal;
                max-width: 100%;
            }
            .case-buttons-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 10px;
                margin: 15px 0;
            }
            .result-container {
                margin-top: 20px;
            }
            .copy-btn {
                padding: 8px 15px;
                background: linear-gradient(135deg, #4a5568, #2d3748);
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.9rem;
                transition: all 0.2s;
                margin-bottom: 10px;
                display: block;
                width: fit-content;
            }
            .copy-btn:hover {
                background: linear-gradient(135deg, #5a6678, #3d4758);
                transform: translateY(-2px);
                box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
            }
            .copy-btn.copied {
                background: linear-gradient(135deg, #48bb78, #38a169);
            }
        </style>
        <div class="tool-interface">
            <h2>Case Converter</h2>
            <!-- Tool-specific markup -->
            <div class="form-group">
                <label for="input-text">Enter text:</label>
                <input type="text" id="input-text" placeholder="Type here...">
            </div>
            
            <div class="case-buttons-grid">
                <button class="case-btn" data-case="lowercase">lowercase</button>
                <button class="case-btn" data-case="UPPERCASE">UPPERCASE</button>
                <button class="case-btn" data-case="Title Case">Title Case</button>
                <button class="case-btn" data-case="Sentence case">Sentence case</button>
                <button class="case-btn" data-case="camelCase">camelCase</button>
                <button class="case-btn" data-case="PascalCase">PascalCase</button>
                <button class="case-btn" data-case="snake_case">snake_case</button>
                <button class="case-btn" data-case="kebab-case">kebab-case</button>
                <button class="case-btn" data-case="CONSTANT_CASE">CONSTANT_CASE</button>
            </div>
            
            <div class="result-container">
                <button id="copy-btn" class="copy-btn">Copy to clipboard</button>
                <div id="converter-result" class="converter-result">Result will appear here</div>
            </div>
        </div>
    `;

    // Get elements using container.querySelector
    const input = container.querySelector('#input-text');
    const result = container.querySelector('#converter-result');
    const copyBtn = container.querySelector('#copy-btn');
    const caseButtons = container.querySelectorAll('.case-btn');

    // Case conversion functions
    const caseConverters = {
        lowercase: (text) => text.toLowerCase(),
        
        UPPERCASE: (text) => text.toUpperCase(),
        
        'Title Case': (text) => {
            return text.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
        },
        
        'Sentence case': (text) => {
            return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
        },
        
        camelCase: (text) => {
            return text
                .toLowerCase()
                .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
                .replace(/^[A-Z]/, c => c.toLowerCase());
        },
        
        PascalCase: (text) => {
            return text
                .toLowerCase()
                .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
                .replace(/^[a-z]/, c => c.toUpperCase());
        },
        
        snake_case: (text) => {
            return text
                .toLowerCase()
                .replace(/\s+/g, '_')
                .replace(/[^a-zA-Z0-9_]/g, '');
        },
        
        'kebab-case': (text) => {
            return text
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-zA-Z0-9-]/g, '');
        },
        
        CONSTANT_CASE: (text) => {
            return text
                .toUpperCase()
                .replace(/\s+/g, '_')
                .replace(/[^a-zA-Z0-9_]/g, '');
        }
    };

    // Add event listeners for case buttons
    caseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const text = input.value;
            const selectedCase = button.dataset.case;
            
            if (text && caseConverters[selectedCase]) {
                result.textContent = caseConverters[selectedCase](text);
                
                // Make all buttons normal style
                caseButtons.forEach(btn => {
                    btn.classList.remove('primary-button');
                    btn.classList.add('secondary-button');
                });
                
                // Highlight selected button
                button.classList.remove('secondary-button');
                button.classList.add('primary-button');
            }
        });
    });
    
    // Copy to clipboard functionality
    copyBtn.addEventListener('click', () => {
        const textToCopy = result.textContent;
        if (textToCopy && textToCopy !== 'Result will appear here') {
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Visual feedback
                copyBtn.textContent = 'Copied!';
                copyBtn.classList.add('copied');
                
                setTimeout(() => {
                    copyBtn.textContent = 'Copy';
                    copyBtn.classList.remove('copied');
                }, 2000);
            });
        }
    });
    
    // Initialize with example if input is empty
    if (!input.value) {
        input.value = "The Quick Brown Fox Jumps Over The Lazy Dog";
    }
    
    // Apply button styling on load
    caseButtons.forEach(btn => {
        btn.classList.add('secondary-button');
    });
}
