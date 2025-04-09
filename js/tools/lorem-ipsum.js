export function loremIpsum(container) {
    container.innerHTML = `
        <div class="tool-interface">
            <div class="generator-controls">
                <div class="control-group">
                    <label for="lorem-type">Type:</label>
                    <select id="lorem-type" class="full-width">
                        <option value="paragraphs">Paragraphs</option>
                        <option value="sentences">Sentences</option>
                        <option value="words">Words</option>
                    </select>
                </div>
                
                <div class="control-group">
                    <label for="lorem-count">Count:</label>
                    <input type="number" id="lorem-count" min="1" max="50" value="3" class="full-width">
                </div>
                
                <div class="control-group checkbox">
                    <input type="checkbox" id="lorem-start-with" checked>
                    <label for="lorem-start-with">Start with "Lorem ipsum dolor sit amet"</label>
                </div>
            </div>
            
            <button id="generate-lorem" class="primary-button">Generate Lorem Ipsum</button>
            
            <div class="output-area">
                <div id="lorem-output" class="output-box"></div>
                <div class="button-group">
                    <button id="copy-lorem" class="copy-button">Copy to Clipboard</button>
                    <button id="download-lorem" class="secondary-button">Download as TXT</button>
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

    const loremType = document.getElementById('lorem-type');
    const loremCount = document.getElementById('lorem-count');
    const loremStartWith = document.getElementById('lorem-start-with');
    const generateBtn = document.getElementById('generate-lorem');
    const loremOutput = document.getElementById('lorem-output');
    const copyBtn = document.getElementById('copy-lorem');
    const downloadBtn = document.getElementById('download-lorem');
    
    // Lorem ipsum starter and words
    const loremStart = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
    const loremWords = [
        "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", 
        "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim", 
        "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "ut", 
        "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", 
        "reprehenderit", "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla", 
        "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "in", "culpa", 
        "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
    ];
    
    generateBtn.addEventListener('click', generateLorem);
    
    // Initial generation
    generateLorem();
    
    function generateLorem() {
        const type = loremType.value;
        const count = parseInt(loremCount.value);
        const startWith = loremStartWith.checked;
        
        let result = '';
        
        switch (type) {
            case 'paragraphs':
                // Generate paragraphs
                for (let i = 0; i < count; i++) {
                    if (i === 0 && startWith) {
                        result += loremStart + ' ';
                        result += generateSentences(getRandom(3, 5) - 1).join(' ');
                    } else {
                        result += generateSentences(getRandom(3, 8)).join(' ');
                    }
                    result += '\n\n';
                }
                break;
                
            case 'sentences':
                // Generate sentences
                const sentences = generateSentences(count, startWith);
                result = sentences.join(' ');
                break;
                
            case 'words':
                // Generate words
                if (startWith && count >= 5) {
                    result = "Lorem ipsum dolor sit amet";
                    if (count > 5) {
                        result += ', ' + generateWords(count - 5).join(' ');
                    }
                } else {
                    result = generateWords(count).join(' ');
                }
                break;
        }
        
        loremOutput.textContent = result.trim();
    }
    
    function generateSentences(count, startWithLorem = false) {
        const sentences = [];
        
        for (let i = 0; i < count; i++) {
            if (i === 0 && startWithLorem) {
                sentences.push(loremStart);
            } else {
                const wordCount = getRandom(5, 15);
                let sentence = generateWords(wordCount).join(' ');
                sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
                sentences.push(sentence);
            }
        }
        
        return sentences;
    }
    
    function generateWords(count) {
        const words = [];
        
        for (let i = 0; i < count; i++) {
            words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
        }
        
        return words;
    }
    
    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // Copy to clipboard
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(loremOutput.textContent).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        });
    });
    
    // Download as TXT
    downloadBtn.addEventListener('click', () => {
        const blob = new Blob([loremOutput.textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'lorem-ipsum.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}
