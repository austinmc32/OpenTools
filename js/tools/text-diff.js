export function textDiff(container) {
    container.innerHTML = `
        <style>
            /* Text Diff specific styles */
            .diff-container {
                display: flex;
                gap: 20px;
                margin-bottom: 20px;
            }
            
            .diff-side {
                flex: 1;
            }
            
            .diff-output {
                border: 1px solid var(--border-color);
                border-radius: 4px;
                padding: 15px;
                margin-top: 20px;
                background-color: var(--output-background);
                overflow: auto;
                max-height: 500px;
            }
            
            .diff-line {
                display: flex;
                border-bottom: 1px solid var(--border-color);
                padding: 2px 0;
            }
            
            .line-number {
                min-width: 40px;
                text-align: right;
                padding-right: 10px;
                border-right: 1px solid var(--border-color);
                color: var(--text-light);
                user-select: none;
            }
            
            .line-diff {
                display: flex;
                flex-direction: column;
                padding-left: 10px;
                width: 100%;
            }
            
            .unchanged {
                color: var(--text-color);
            }
            
            .removed {
                background-color: rgba(244, 67, 54, 0.1);
                color: #F44336;
                text-decoration: line-through;
            }
            
            .added {
                background-color: rgba(76, 175, 80, 0.1);
                color: #4CAF50;
            }
            
            /* Dark mode specific styles */
            body.dark-mode .diff-output,
            body.dark-mode .diff-line {
                background-color: var(--dark-card-color);
                border-color: var(--dark-border-color);
            }
            
            body.dark-mode .line-number {
                border-color: var(--dark-border-color);
                color: var(--dark-text-light);
            }
            
            body.dark-mode .unchanged {
                color: var(--dark-text-color);
            }
            
            body.dark-mode .removed {
                background-color: rgba(244, 67, 54, 0.15);
                color: #ff7b72;
            }
            
            body.dark-mode .added {
                background-color: rgba(76, 175, 80, 0.15);
                color: #7ee787;
            }

            @media (max-width: 768px) {
                .diff-container {
                    flex-direction: column;
                }
            }
        </style>
        <div class="tool-interface">
            <div class="diff-container">
                <div class="diff-side">
                    <h3>Original Text</h3>
                    <textarea id="original-text" placeholder="Enter original text here..." rows="10" class="full-width"></textarea>
                </div>
                <div class="diff-side">
                    <h3>Modified Text</h3>
                    <textarea id="modified-text" placeholder="Enter modified text here..." rows="10" class="full-width"></textarea>
                </div>
            </div>
            <button id="compare-btn" class="primary-button">Compare Texts</button>
            <div id="diff-output" class="diff-output"></div>
        </div>
    `;

    const originalText = document.getElementById('original-text');
    const modifiedText = document.getElementById('modified-text');
    const compareBtn = document.getElementById('compare-btn');
    const diffOutput = document.getElementById('diff-output');

    compareBtn.addEventListener('click', () => {
        const original = originalText.value.split('\n');
        const modified = modifiedText.value.split('\n');
        
        diffOutput.innerHTML = '';
        
        if (!original.length || !modified.length) {
            diffOutput.innerHTML = '<p class="error-message">Please enter text in both fields.</p>';
            return;
        }
        
        // Simple line-by-line diff
        const maxLines = Math.max(original.length, modified.length);
        
        for (let i = 0; i < maxLines; i++) {
            const originalLine = original[i] || '';
            const modifiedLine = modified[i] || '';
            
            let lineElement = document.createElement('div');
            lineElement.className = 'diff-line';
            
            if (originalLine === modifiedLine) {
                lineElement.innerHTML = `<span class="line-number">${i+1}</span><span class="unchanged">${escapeHTML(originalLine)}</span>`;
            } else {
                lineElement.innerHTML = `
                    <span class="line-number">${i+1}</span>
                    <div class="line-diff">
                        <span class="removed">${escapeHTML(originalLine)}</span>
                        <span class="added">${escapeHTML(modifiedLine)}</span>
                    </div>
                `;
            }
            
            diffOutput.appendChild(lineElement);
        }
    });
    
    function escapeHTML(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}