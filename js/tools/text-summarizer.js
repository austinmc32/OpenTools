/**
 * Text Summarizer Tool
 * Provides an extractive text summarization functionality
 */

export const textSummarizer = {
    name: 'Text Summarizer',
    description: 'Generate concise summaries from longer text',
    icon: 'file-earmark-text',
    
    init(container) {
        container.innerHTML = `
            <div class="tool-interface">
                <h2>Text Summarizer</h2>
                <!-- Tool-specific markup updated to use base classes -->
                <textarea id="text-input" class="form-control" placeholder="Enter text to summarize..."></textarea>
                <button class="btn btn-primary">Summarize</button>
                <div id="summary-output"></div>
            </div>
        `;
        
        const inputText = container.querySelector('#text-input');
        const summaryOutput = container.querySelector('#summary-output');
        const summarizeBtn = container.querySelector('.btn-primary');
        
        summarizeBtn.addEventListener('click', () => {
            const text = inputText.value.trim();
            if (!text) {
                summaryOutput.innerHTML = '<div class="text-muted">Please enter some text to summarize.</div>';
                return;
            }
            
            const summary = this.generateSummary(text, 3); // Default to 3 sentences
            summaryOutput.innerHTML = summary || '<div class="text-muted">Could not generate a summary from the provided text.</div>';
        });
    },
    
    generateSummary(text, sentenceCount) {
        // Break text into sentences
        const sentences = text.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|");
        
        if (sentences.length <= sentenceCount) {
            return text; // Return original if it's already short
        }
        
        // Calculate word frequency
        const wordFreq = {};
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        
        words.forEach(word => {
            if (word.length > 2) { // Ignore short words
                wordFreq[word] = (wordFreq[word] || 0) + 1;
            }
        });
        
        // Score sentences
        const sentenceScores = sentences.map(sentence => {
            const sentenceWords = sentence.toLowerCase().match(/\b\w+\b/g) || [];
            let score = 0;
            
            sentenceWords.forEach(word => {
                if (wordFreq[word]) {
                    score += wordFreq[word];
                }
            });
            
            // Normalize score by sentence length to avoid favoring long sentences
            return {
                sentence: sentence.trim(),
                score: score / Math.max(sentenceWords.length, 1)
            };
        });
        
        // Keep original order of sentences
        const topSentences = [...sentenceScores]
            .sort((a, b) => b.score - a.score)
            .slice(0, sentenceCount)
            .sort((a, b) => sentenceScores.indexOf(a) - sentenceScores.indexOf(b));
        
        return topSentences.map(item => item.sentence).join(' ');
    }
};
