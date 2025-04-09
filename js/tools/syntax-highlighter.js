export function syntaxHighlighter(container) {
    container.innerHTML = `
        <style>
            /* Syntax Highlighter specific styles */
            .code-editor {
                font-family: monospace;
                tab-size: 4;
                -moz-tab-size: 4;
                white-space: pre;
            }
            
            .highlighted-output {
                border: 1px solid var(--border-color);
                border-radius: 4px;
                padding: 15px;
                margin-top: 10px;
                background-color: var(--output-background);
                overflow: auto;
                max-height: 500px;
            }
        </style>
        <div class="tool-interface">
            <h2>Syntax Highlighter</h2>
            <p>Highlight and format code in different programming languages</p>
            
            <div class="form-group">
                <label for="language-select">Select Language:</label>
                <select id="language-select" class="form-control">
                    <option value="javascript">JavaScript</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="csharp">C#</option>
                    <option value="php">PHP</option>
                    <option value="ruby">Ruby</option>
                    <option value="go">Go</option>
                    <option value="rust">Rust</option>
                    <option value="typescript">TypeScript</option>
                    <option value="sql">SQL</option>
                    <option value="json">JSON</option>
                    <option value="bash">Bash</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="code-input">Enter your code:</label>
                <textarea id="code-input" class="form-control code-editor" rows="10" placeholder="Paste your code here..."></textarea>
            </div>
            
            <button id="highlight-btn" class="primary-button">Highlight Code</button>
            <button id="copy-btn" class="secondary-button">Copy Highlighted Code</button>
            
            <div class="info-box">
                <h3>Highlighted Code</h3>
                <div id="highlighted-output" class="highlighted-output">
                    <p class="text-muted">Highlighted code will appear here...</p>
                </div>
            </div>
        </div>
    `;

    // Your existing JavaScript code for the Syntax Highlighter
    const languageSelect = document.getElementById('language-select');
    const codeInput = document.getElementById('code-input');
    const highlightBtn = document.getElementById('highlight-btn');
    const copyBtn = document.getElementById('copy-btn');
    const highlightedOutput = document.getElementById('highlighted-output');
    
    // Function to highlight code
    highlightBtn.addEventListener('click', () => {
        const code = codeInput.value;
        const language = languageSelect.value;
        
        if (!code.trim()) {
            highlightedOutput.innerHTML = '<p class="error-message">Please enter some code to highlight.</p>';
            return;
        }
        
        // Use Prism.js for syntax highlighting (loaded in index.html)
        try {
            const html = Prism.highlight(code, Prism.languages[language], language);
            highlightedOutput.innerHTML = `<pre><code class="language-${language}">${html}</code></pre>`;
        } catch (error) {
            highlightedOutput.innerHTML = `<p class="error-message">Error highlighting code: ${error.message}</p>`;
        }
    });
    
    // Copy highlighted code
    copyBtn.addEventListener('click', () => {
        try {
            const codeElement = highlightedOutput.querySelector('code');
            if (!codeElement) {
                throw new Error('No highlighted code to copy');
            }
            
            // Get the raw text without HTML tags
            const tempElement = document.createElement('div');
            tempElement.innerHTML = codeElement.innerHTML;
            const textToCopy = tempElement.textContent || tempElement.innerText;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Show success message
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 2000);
            }).catch(err => {
                throw err;
            });
        } catch (error) {
            alert(`Failed to copy: ${error.message}`);
        }
    });
    
    // Add sample code on load
    codeInput.value = `function greeting(name) {
    // This is a comment
    console.log("Hello, " + name + "!");
    return "Hello, " + name + "!";
}

// Call the function
greeting("World");`;
    
    // Trigger initial highlight
    highlightBtn.click();
}
