export function characterCounter(container) {
    container.innerHTML = `
        <div class="tool-interface">
            <textarea id="text-input" placeholder="Enter your text here..." rows="8" class="full-width"></textarea>
            <div class="stats-container">
                <div class="stat-box">
                    <h3>Characters</h3>
                    <p id="char-count">0</p>
                </div>
                <div class="stat-box">
                    <h3>Characters (no spaces)</h3>
                    <p id="char-no-space-count">0</p>
                </div>
                <div class="stat-box">
                    <h3>Words</h3>
                    <p id="word-count">0</p>
                </div>
                <div class="stat-box">
                    <h3>Sentences</h3>
                    <p id="sentence-count">0</p>
                </div>
                <div class="stat-box">
                    <h3>Paragraphs</h3>
                    <p id="paragraph-count">0</p>
                </div>
                <div class="stat-box">
                    <h3>Reading Time</h3>
                    <p id="reading-time">0 sec</p>
                </div>
            </div>
        </div>
    `;

    // Add styles for dark mode compatibility
    const style = document.createElement('style');
    style.textContent = `
        .stats-container {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin-top: 20px;
        }
        
        .stat-box {
            background-color: #f7f7f7;
            border-radius: 8px;
            padding: 15px;
            flex: 1;
            min-width: 120px;
            text-align: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        }
        
        .stat-box h3 {
            margin: 0 0 10px 0;
            font-size: 16px;
            color: #555;
        }
        
        .stat-box p {
            margin: 0;
            font-size: 22px;
            font-weight: bold;
            color: #2c3e50;
        }
        
        @media (prefers-color-scheme: dark) {
            .stat-box {
                background-color: #2a2a2a;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }
            
            .stat-box h3 {
                color: #bbb;
            }
            
            .stat-box p {
                color: #e0e0e0;
            }
        }
    `;
    document.head.appendChild(style);

    const textInput = document.getElementById('text-input');
    const charCount = document.getElementById('char-count');
    const charNoSpaceCount = document.getElementById('char-no-space-count');
    const wordCount = document.getElementById('word-count');
    const sentenceCount = document.getElementById('sentence-count');
    const paragraphCount = document.getElementById('paragraph-count');
    const readingTime = document.getElementById('reading-time');
    
    textInput.addEventListener('input', updateCounts);
    
    function updateCounts() {
        const text = textInput.value;
        
        // Character count
        charCount.textContent = text.length;
        
        // Character count (no spaces)
        charNoSpaceCount.textContent = text.replace(/\s/g, '').length;
        
        // Word count
        const words = text.match(/\b\w+\b/g) || [];
        wordCount.textContent = words.length;
        
        // Sentence count
        const sentences = text.split(/[.!?]+\s*/) || [];
        sentenceCount.textContent = sentences.length > 1 ? sentences.length - 1 : 0;
        
        // Paragraph count
        const paragraphs = text.split(/\n\s*\n/) || [];
        paragraphCount.textContent = paragraphs.length > 0 && text.trim() !== '' ? paragraphs.length : 0;
        
        // Reading time (avg reading speed: 200 words per minute)
        const minutes = words.length / 200;
        const seconds = Math.ceil(minutes * 60);
        readingTime.textContent = seconds < 60 ? 
            `${seconds} sec` : 
            `${Math.floor(minutes)} min ${Math.ceil((minutes % 1) * 60)} sec`;
    }
}
