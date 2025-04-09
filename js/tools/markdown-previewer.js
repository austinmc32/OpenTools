export function markdownPreviewer(container) {
    container.innerHTML = `
        <style>
            /* Markdown Previewer specific styles */
            .split-view {
                display: flex;
                gap: 20px;
                margin-bottom: 20px;
            }
            
            @media (max-width: 768px) {
                .split-view {
                    flex-direction: column;
                }
            }
            
            .editor-section, .preview-section {
                flex: 1;
            }
            
            .preview-container {
                border: 1px solid var(--border-color);
                border-radius: 4px;
                padding: 15px;
                min-height: 300px;
                max-height: 60vh;
                overflow: auto;
                background-color: var(--input-background);
                color: var(--text-color);
            }
            
            .preview-container img {
                max-width: 100%;
            }
            
            .syntax-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 10px;
                margin-top: 15px;
            }
            
            .syntax-item {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .syntax-item code {
                background-color: var(--output-background);
                border-radius: 3px;
                padding: 2px 5px;
                font-family: monospace;
                flex-shrink: 0;
            }
        </style>
        <div class="tool-interface">
            <h2>Markdown Previewer</h2>
            <p>Type Markdown in the left panel and see the rendered output on the right.</p>
            
            <div class="split-view">
                <div class="editor-section">
                    <h3>Markdown</h3>
                    <textarea id="markdown-input" class="form-control" rows="15" placeholder="Type your markdown here..."></textarea>
                </div>
                <div class="preview-section">
                    <h3>Preview</h3>
                    <div id="preview-output" class="preview-container"></div>
                </div>
            </div>
            
            <div class="info-box">
                <h3>Markdown Syntax Reference</h3>
                <div class="syntax-grid">
                    <div class="syntax-item">
                        <code># Heading</code>
                        <span>Heading level 1</span>
                    </div>
                    <div class="syntax-item">
                        <code>## Heading</code>
                        <span>Heading level 2</span>
                    </div>
                    <div class="syntax-item">
                        <code>**bold**</code>
                        <span>Bold text</span>
                    </div>
                    <div class="syntax-item">
                        <code>*italic*</code>
                        <span>Italic text</span>
                    </div>
                    <div class="syntax-item">
                        <code>[Link](url)</code>
                        <span>Hyperlink</span>
                    </div>
                    <div class="syntax-item">
                        <code>![Alt](image-url)</code>
                        <span>Image</span>
                    </div>
                    <div class="syntax-item">
                        <code>\`code\`</code>
                        <span>Inline code</span>
                    </div>
                    <div class="syntax-item">
                        <code>\`\`\`code block\`\`\`</code>
                        <span>Code block</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Your existing JavaScript code for the Markdown Previewer
    const markdownInput = document.getElementById('markdown-input');
    const previewOutput = document.getElementById('preview-output');
    
    // Add a simple markdown parser (you might want to use a library like marked.js for a real implementation)
    function parseMarkdown(markdown) {
        let html = markdown;
        
        // Parse headings
        html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
        html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
        html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
        
        // Parse bold and italic
        html = html.replace(/\*\*(.*)\*\*/gm, '<strong>$1</strong>');
        html = html.replace(/\*(.*)\*/gm, '<em>$1</em>');
        
        // Parse links
        html = html.replace(/\[([^\[]+)\]\(([^\)]+)\)/gm, '<a href="$2">$1</a>');
        
        // Parse images
        html = html.replace(/!\[([^\[]+)\]\(([^\)]+)\)/gm, '<img src="$2" alt="$1">');
        
        // Parse code
        html = html.replace(/`([^`]+)`/gm, '<code>$1</code>');
        
        // Parse lists
        html = html.replace(/^\- (.*$)/gm, '<ul><li>$1</li></ul>');
        
        // Parse paragraphs (simple version)
        html = html.split('\n\n').map(para => {
            if (!para.startsWith('<h') && !para.startsWith('<ul')) {
                return `<p>${para}</p>`;
            }
            return para;
        }).join('');
        
        return html;
    }
    
    // Update preview when input changes
    markdownInput.addEventListener('input', () => {
        previewOutput.innerHTML = parseMarkdown(markdownInput.value);
    });
    
    // Add sample markdown on load
    markdownInput.value = `# Markdown Previewer

This is a **live preview** of your markdown content.

## Features
* Headings
* Bold and *italic* text
* [Links](https://example.com)
* And more!

\`\`\`
// Code blocks
function hello() {
  console.log("Hello, world!");
}
\`\`\`
`;
    
    // Trigger initial render
    previewOutput.innerHTML = parseMarkdown(markdownInput.value);
}
