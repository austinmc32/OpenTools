export function textParaphraser(container) {
    container.innerHTML = `
        <style>
            .paraphraser-container {
                max-width: 800px;
                margin: 0 auto;
            }
            
            .textarea-container {
                position: relative;
                margin-bottom: 20px;
            }
            
            .textarea-container textarea {
                width: 100%;
                min-height: 200px;
                padding: 15px;
                font-family: inherit;
                line-height: 1.5;
                border: 1px solid var(--border-color);
                border-radius: 5px;
                background-color: var(--input-background);
                color: var(--text-color);
                resize: vertical;
            }
            
            .textarea-stats {
                position: absolute;
                bottom: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.6);
                color: #fff;
                padding: 3px 8px;
                border-radius: 3px;
                font-size: 12px;
            }
            
            .options-container {
                margin-bottom: 20px;
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
            }
            
            .options-container .option {
                padding: 8px 15px;
                border-radius: 20px;
                border: 1px solid var(--border-color);
                background-color: var(--card-color);
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .options-container .option.active {
                background-color: var(--accent-color);
                color: #fff;
                border-color: var(--accent-color);
            }
            
            .results-container {
                position: relative;
                margin-top: 30px;
                border-top: 1px solid var(--border-color);
                padding-top: 20px;
            }
            
            .loading-indicator {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10;
                border-radius: 5px;
            }
            
            .loading-indicator span {
                display: inline-block;
                width: 20px;
                height: 20px;
                margin: 0 5px;
                background-color: var(--accent-color);
                border-radius: 50%;
                animation: bounce 1.4s infinite ease-in-out both;
            }
            
            .loading-indicator span:nth-child(1) { animation-delay: -0.32s; }
            .loading-indicator span:nth-child(2) { animation-delay: -0.16s; }
            
            @keyframes bounce {
                0%, 80%, 100% {
                    transform: scale(0);
                } 40% {
                    transform: scale(1);
                }
            }
            
            .actions-container {
                display: flex;
                gap: 10px;
                margin: 20px 0;
            }
            
            .paraphrase-level {
                margin-bottom: 20px;
            }
            
            .paraphrase-level label {
                display: block;
                margin-bottom: 10px;
            }
            
            .paraphrase-level input[type="range"] {
                width: 100%;
            }
            
            .slider-labels {
                display: flex;
                justify-content: space-between;
                margin-top: 5px;
                font-size: 12px;
                color: var(--text-light);
            }
            
            .copy-message {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 10px 20px;
                background-color: var(--accent-color);
                color: white;
                border-radius: 5px;
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.3s ease;
                z-index: 100;
            }
            
            .copy-message.show {
                opacity: 1;
                transform: translateY(0);
            }
        </style>
        
        <div class="tool-interface paraphraser-container">
            <div class="form-group">
                <label for="input-text">Enter text to paraphrase:</label>
                <div class="textarea-container">
                    <textarea id="input-text" placeholder="Enter or paste your text here..."></textarea>
                    <div class="textarea-stats" id="input-stats">0 characters</div>
                </div>
            </div>
            
            <div class="paraphrase-level">
                <label for="paraphrase-strength">Paraphrase Strength:</label>
                <input type="range" id="paraphrase-strength" min="1" max="3" value="2" step="1">
                <div class="slider-labels">
                    <span>Minimal Changes</span>
                    <span>Moderate</span>
                    <span>Maximum Rewording</span>
                </div>
            </div>
            
            <div class="options-container">
                <div class="option active" data-mode="standard">Standard</div>
                <div class="option" data-mode="formal">Formal</div>
                <div class="option" data-mode="simple">Simplify</div>
            </div>
            
            <div class="actions-container">
                <button id="paraphrase-button" class="primary-button">Paraphrase</button>
                <button id="clear-button" class="secondary-button">Clear</button>
            </div>
            
            <div class="results-container" id="results-container" style="display: none;">
                <h3>Paraphrased Text:</h3>
                <div class="textarea-container">
                    <textarea id="output-text" readonly></textarea>
                    <div class="textarea-stats" id="output-stats">0 characters</div>
                </div>
                
                <div class="actions-container">
                    <button id="copy-button" class="secondary-button">
                        <i class="fas fa-copy"></i> Copy Result
                    </button>
                    <button id="try-again-button" class="secondary-button">
                        <i class="fas fa-sync-alt"></i> Try Another Variation
                    </button>
                </div>
            </div>
            
            <div class="loading-indicator" id="loading-indicator" style="display: none;">
                <span></span>
                <span></span>
                <span></span>
            </div>
            
            <div class="copy-message" id="copy-message">
                Copied to clipboard!
            </div>
        </div>
    `;

    // Elements
    const inputText = document.getElementById('input-text');
    const inputStats = document.getElementById('input-stats');
    const outputText = document.getElementById('output-text');
    const outputStats = document.getElementById('output-stats');
    const paraphraseButton = document.getElementById('paraphrase-button');
    const clearButton = document.getElementById('clear-button');
    const copyButton = document.getElementById('copy-button');
    const tryAgainButton = document.getElementById('try-again-button');
    const resultsContainer = document.getElementById('results-container');
    const loadingIndicator = document.getElementById('loading-indicator');
    const copyMessage = document.getElementById('copy-message');
    const paraphraseStrength = document.getElementById('paraphrase-strength');
    const modeOptions = document.querySelectorAll('.option');
    
    // Variables
    let currentMode = 'standard';
    
    // Event listeners
    inputText.addEventListener('input', updateInputStats);
    paraphraseButton.addEventListener('click', paraphraseText);
    clearButton.addEventListener('click', clearAll);
    copyButton.addEventListener('click', copyResult);
    tryAgainButton.addEventListener('click', regenerateParaphrase);
    
    // Mode selection
    modeOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove active class from all options
            modeOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            option.classList.add('active');
            
            // Update current mode
            currentMode = option.dataset.mode;
        });
    });
    
    // Functions
    function updateInputStats() {
        const text = inputText.value;
        const charCount = text.length;
        const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        
        inputStats.textContent = `${charCount} chars | ${wordCount} words`;
    }
    
    function updateOutputStats() {
        const text = outputText.value;
        const charCount = text.length;
        const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        
        outputStats.textContent = `${charCount} chars | ${wordCount} words`;
    }
    
    function paraphraseText() {
        const text = inputText.value.trim();
        
        if (!text) {
            showToast('Please enter some text first');
            return;
        }
        
        // Show loading
        loadingIndicator.style.display = 'flex';
        resultsContainer.style.display = 'block';
        outputText.value = '';
        
        // Simulate processing delay
        setTimeout(() => {
            const paraphrasedText = processTextForParaphrasing(text);
            
            // Hide loading and show results
            loadingIndicator.style.display = 'none';
            outputText.value = paraphrasedText;
            updateOutputStats();
        }, 1000 + Math.random() * 2000); // Random delay to simulate processing
    }
    
    function clearAll() {
        inputText.value = '';
        outputText.value = '';
        resultsContainer.style.display = 'none';
        updateInputStats();
    }
    
    function copyResult() {
        const text = outputText.value;
        
        if (!text) return;
        
        navigator.clipboard.writeText(text)
            .then(() => {
                // Show copy message
                copyMessage.classList.add('show');
                
                // Hide copy message after 2 seconds
                setTimeout(() => {
                    copyMessage.classList.remove('show');
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                showToast('Failed to copy text to clipboard');
            });
    }
    
    function regenerateParaphrase() {
        paraphraseText();
    }
    
    function showToast(message) {
        copyMessage.textContent = message;
        copyMessage.classList.add('show');
        
        setTimeout(() => {
            copyMessage.classList.remove('show');
        }, 2000);
    }
    
    // Paraphrasing logic
    function processTextForParaphrasing(inputText) {
        // Split text into sentences
        const sentences = splitIntoSentences(inputText);
        
        // Paraphrase each sentence
        const paraphrasedSentences = sentences.map(sentence => {
            // Skip very short sentences or just spaces
            if (sentence.trim().length < 4) return sentence;
            
            return paraphraseSentence(sentence);
        });
        
        // Join sentences back together
        return paraphrasedSentences.join(' ');
    }
    
    function splitIntoSentences(text) {
        // Basic sentence splitting
        return text.split(/(?<=[.!?])\s+/);
    }
    
    function paraphraseSentence(sentence) {
        // Choose paraphrasing strategy based on mode and strength
        const strength = parseInt(paraphraseStrength.value);
        
        // Apply basic transformations
        let result = sentence;
        
        // Apply more aggressive word substitution
        result = substituteWords(result, strength);
        
        // Apply sentence structure changes based on mode
        switch(currentMode) {
            case 'formal':
                result = makeFormal(result, strength);
                break;
            case 'simple':
                result = makeSimple(result, strength);
                break;
            default: // standard
                result = changeStructure(result, strength);
                break;
        }
        
        // Apply additional aggressive transformations
        if (strength > 1) {
            result = applyAggressiveTransformations(result, strength);
        }
        
        return result;
    }
    
    // New function for more aggressive transformations
    function applyAggressiveTransformations(text, strength) {
        let result = text;
        
        // Apply multiple transformations based on strength
        const transformations = [
            // Rearrange clauses in complex sentences
            (text) => {
                if (text.includes(',') && text.split(' ').length > 8) {
                    const parts = text.split(', ');
                    if (parts.length >= 2) {
                        // Move the first part to the end or vice versa
                        if (Math.random() > 0.5) {
                            // First part to end
                            let newText = parts.slice(1).join(', ') + ', ' + parts[0].toLowerCase();
                            // Ensure proper capitalization
                            newText = newText.charAt(0).toUpperCase() + newText.slice(1);
                            return newText;
                        } else {
                            // Last part to beginning
                            let lastPart = parts.pop();
                            // Remove trailing period if exists
                            if (lastPart.endsWith('.')) {
                                lastPart = lastPart.slice(0, -1);
                            }
                            let newText = lastPart + ', ' + parts.join(', ');
                            // Ensure proper capitalization
                            newText = newText.charAt(0).toUpperCase() + newText.slice(1);
                            return newText;
                        }
                    }
                }
                return text;
            },
            
            // Convert between active and passive voice
            (text) => {
                const activeToPassivePatterns = [
                    {
                        regex: /(\w+)\s+([\w\s]+)\s+the\s+(\w+)/i,
                        replace: (match, subject, verb, object) => {
                            // Simple active to passive conversion
                            const trimmedVerb = verb.trim();
                            return `The ${object} ${transformVerbToPassive(trimmedVerb)} by ${subject.toLowerCase()}`;
                        }
                    },
                    {
                        regex: /(\w+)\s+([\w\s]+)\s+(\w+)/i,
                        replace: (match, subject, verb, object) => {
                            // Only convert if probability is right
                            if (Math.random() > 0.7) {
                                const trimmedVerb = verb.trim();
                                return `${object} ${transformVerbToPassive(trimmedVerb)} by ${subject.toLowerCase()}`;
                            }
                            return match;
                        }
                    }
                ];
                
                const passiveToActivePatterns = [
                    {
                        regex: /(\w+)\s+(?:is|are|was|were)\s+(\w+)(?:ed|en)\s+by\s+(\w+)/i,
                        replace: (match, object, verb, subject) => {
                            // Simple passive to active conversion
                            return `${subject} ${verb}s ${object.toLowerCase()}`;
                        }
                    }
                ];
                
                // Determine if we should convert to passive or active
                const patterns = Math.random() > 0.5 ? activeToPassivePatterns : passiveToActivePatterns;
                
                // Apply patterns
                let modified = text;
                patterns.some(pattern => {
                    const match = modified.match(pattern.regex);
                    if (match) {
                        modified = modified.replace(pattern.regex, pattern.replace);
                        return true; // Stop after first successful replacement
                    }
                    return false;
                });
                
                return modified;
            },
            
            // Add or remove transitional phrases
            (text) => {
                const transitions = [
                    'Consequently', 'Therefore', 'As a result', 'Thus',
                    'In contrast', 'On the other hand', 'However', 'Nevertheless',
                    'Furthermore', 'Moreover', 'In addition', 'Besides',
                    'For instance', 'For example', 'Specifically', 'To illustrate'
                ];
                
                if (!transitions.some(t => text.startsWith(t))) {
                    // Add transition if probability matches
                    if (Math.random() > 0.6) {
                        const transition = transitions[Math.floor(Math.random() * transitions.length)];
                        return `${transition}, ${text.charAt(0).toLowerCase() + text.slice(1)}`;
                    }
                } else {
                    // Remove transition if already present and probability matches
                    if (Math.random() > 0.7) {
                        for (const transition of transitions) {
                            if (text.startsWith(transition + ',')) {
                                let newText = text.slice(transition.length + 1).trim();
                                return newText.charAt(0).toUpperCase() + newText.slice(1);
                            }
                            else if (text.startsWith(transition)) {
                                let newText = text.slice(transition.length).trim();
                                return newText.charAt(0).toUpperCase() + newText.slice(1);
                            }
                        }
                    }
                }
                return text;
            },
            
            // Change sentence type (declarative, interrogative, imperative)
            (text) => {
                // Check if sentence is a question
                const isQuestion = text.trim().endsWith('?');
                
                if (!isQuestion && text.split(' ').length > 5 && Math.random() > 0.7) {
                    // Convert declarative to question
                    const words = text.split(' ');
                    
                    // Remove period if present
                    if (words[words.length-1].endsWith('.')) {
                        words[words.length-1] = words[words.length-1].slice(0, -1);
                    }
                    
                    // Different question transformations
                    const questionType = Math.floor(Math.random() * 3);
                    if (questionType === 0) {
                        // Yes/no question
                        const questionStarters = ['Do', 'Does', 'Did', 'Is', 'Are', 'Was', 'Were', 'Can', 'Could', 'Will', 'Would'];
                        const starter = questionStarters[Math.floor(Math.random() * questionStarters.length)];
                        return `${starter} ${words.join(' ').toLowerCase()}?`;
                    } else if (questionType === 1) {
                        // Wh-question
                        const whWords = ['Why', 'How', 'What', 'When', 'Where'];
                        const whWord = whWords[Math.floor(Math.random() * whWords.length)];
                        return `${whWord} ${words.join(' ').toLowerCase()}?`;
                    } else {
                        // Tag question
                        let baseText = words.join(' ');
                        const subject = getSubject(baseText);
                        const tag = generateQuestionTag(subject);
                        return `${baseText}, ${tag}?`;
                    }
                } else if (isQuestion && Math.random() > 0.6) {
                    // Convert question to statement
                    let statement = text.slice(0, -1); // Remove question mark
                    
                    // Remove question words
                    const questionWords = ['Do ', 'Does ', 'Did ', 'Is ', 'Are ', 'Was ', 'Were ', 'Can ', 'Could ', 'Will ', 'Would ', 'Why ', 'How ', 'What ', 'When ', 'Where '];
                    for (const qWord of questionWords) {
                        if (statement.startsWith(qWord)) {
                            statement = statement.slice(qWord.length);
                            break;
                        }
                    }
                    
                    statement = statement.charAt(0).toUpperCase() + statement.slice(1);
                    return `${statement}.`;
                }
                
                return text;
            },
            
            // Split or combine sentences
            (text) => {
                // Only apply to longer sentences
                if (text.length > 60 && text.includes(',') && Math.random() > 0.5) {
                    // Split sentence at a comma
                    const parts = text.split(', ');
                    if (parts.length > 1) {
                        const splitIndex = Math.floor(parts.length / 2);
                        
                        const firstHalf = parts.slice(0, splitIndex).join(', ');
                        const secondHalf = parts.slice(splitIndex).join(', ');
                        
                        // Ensure proper capitalization and punctuation
                        let firstSentence = firstHalf;
                        if (!firstSentence.endsWith('.')) {
                            firstSentence += '.';
                        }
                        
                        let secondSentence = secondHalf.charAt(0).toUpperCase() + secondHalf.slice(1);
                        
                        return `${firstSentence} ${secondSentence}`;
                    }
                }
                return text;
            }
        ];
        
        // Apply more transformations for higher strength levels
        const numberOfTransformations = strength === 3 ? 3 : 1;
        
        // Shuffle transformations to randomly select them
        const shuffledTransformations = transformations.sort(() => 0.5 - Math.random());
        
        // Apply selected transformations
        for (let i = 0; i < numberOfTransformations; i++) {
            if (i < shuffledTransformations.length) {
                result = shuffledTransformations[i](result);
            }
        }
        
        return result;
    }
    
    // Helper function to transform verbs to passive form
    function transformVerbToPassive(verb) {
        // Simple rules for passive transformation
        if (verb.endsWith('s')) {
            return 'is ' + verb.slice(0, -1) + 'ed';
        } else if (verb.endsWith('ed')) {
            return 'was ' + verb;
        } else {
            return 'is ' + verb + 'ed';
        }
    }
    
    // Helper to attempt to get subject from sentence
    function getSubject(sentence) {
        const words = sentence.split(' ');
        if (words.length > 0) {
            return words[0].toLowerCase();
        }
        return 'it';
    }
    
    // Generate question tag based on subject
    function generateQuestionTag(subject) {
        const subjectToTag = {
            'i': "aren't I",
            'you': "aren't you",
            'he': "isn't he",
            'she': "isn't she",
            'it': "isn't it",
            'we': "aren't we",
            'they': "aren't they",
            'this': "isn't it",
            'that': "isn't it",
            'these': "aren't they",
            'those': "aren't they"
        };
        
        return subjectToTag[subject] || "isn't it";
    }
    
    function substituteWords(text, strength) {
        // Common word substitutions - EXPANDED for more aggressive substitution
        const substitutions = {
            // Original substitutions
            'good': ['great', 'excellent', 'wonderful', 'positive', 'favorable', 'superb', 'outstanding', 'exceptional'],
            'bad': ['poor', 'terrible', 'negative', 'unfortunate', 'unfavorable', 'dreadful', 'awful', 'inferior'],
            'big': ['large', 'substantial', 'considerable', 'significant', 'enormous', 'massive', 'immense', 'colossal'],
            'small': ['tiny', 'little', 'minor', 'compact', 'miniature', 'diminutive', 'microscopic', 'minuscule'],
            // Many more substitutions...
            // ...existing substitutions...
            
            // More aggressive substitutions
            'said': ['expressed', 'communicated', 'articulated', 'conveyed', 'voiced', 'uttered', 'declared', 'announced'],
            'went': ['proceeded', 'advanced', 'journeyed', 'traveled', 'moved', 'progressed', 'ventured', 'headed'],
            'saw': ['observed', 'witnessed', 'perceived', 'noticed', 'spotted', 'glimpsed', 'identified', 'detected'],
            'came': ['arrived', 'approached', 'appeared', 'emerged', 'materialized', 'surfaced', 'presented', 'manifested'],
            'took': ['acquired', 'obtained', 'secured', 'procured', 'claimed', 'seized', 'snatched', 'grasped'],
            'know': ['understand', 'recognize', 'comprehend', 'perceive', 'apprehend', 'acknowledge', 'discern', 'identify'],
            'need': ['require', 'necessitate', 'demand', 'call for', 'oblige', 'warrant', 'desire', 'seek'],
            'want': ['desire', 'wish', 'crave', 'long for', 'yearn for', 'aspire to', 'hope for', 'request'],
            'put': ['place', 'position', 'set', 'situate', 'locate', 'install', 'deposit', 'plant'],
            'see': ['observe', 'notice', 'spot', 'identify', 'recognize', 'detect', 'witness', 'perceive'],
            'give': ['provide', 'supply', 'furnish', 'contribute', 'donate', 'grant', 'bestow', 'present'],
            'take': ['accept', 'receive', 'grab', 'seize', 'acquire', 'collect', 'gather', 'adopt'],
            'work': ['function', 'operate', 'perform', 'act', 'serve', 'exert', 'labor', 'toil'],
            'call': ['contact', 'communicate', 'phone', 'summon', 'name', 'address', 'label', 'designate'],
            'try': ['attempt', 'endeavor', 'strive', 'seek', 'pursue', 'undertake', 'venture', 'experiment'],
            'ask': ['inquire', 'question', 'query', 'interrogate', 'request', 'solicit', 'probe', 'investigate'],
            'seem': ['appear', 'look', 'give the impression of', 'come across as', 'strike as', 'present as', 'manifest as', 'emerge as'],
            'help': ['assist', 'aid', 'support', 'facilitate', 'contribute to', 'further', 'benefit', 'advance'],
            'new': ['novel', 'fresh', 'recent', 'modern', 'innovative', 'original', 'cutting-edge', 'state-of-the-art'],
            'old': ['ancient', 'aged', 'vintage', 'antique', 'classic', 'archaic', 'outdated', 'obsolete'],
            'part': ['section', 'segment', 'component', 'portion', 'division', 'fragment', 'element', 'constituent'],
            
            // Common prepositions and conjunctions for more variety
            'with': ['alongside', 'beside', 'together with', 'accompanied by', 'in conjunction with', 'in association with', 'in connection with', 'in combination with'],
            'from': ['derived from', 'originating from', 'stemming from', 'emerging from', 'arising from', 'obtained from', 'sourced from', 'coming from'],
            'about': ['concerning', 'regarding', 'with respect to', 'in reference to', 'in relation to', 'pertaining to', 'on the subject of', 'touching on'],
            'like': ['akin to', 'similar to', 'reminiscent of', 'comparable to', 'analogous to', 'resembling', 'in the manner of', 'in the style of']
        };
        
        // The higher the strength, the more words we substitute
        const substitutionProbability = Math.min(0.3 * strength * 1.5, 0.9); // More aggressive
        
        // Split text into words but preserve punctuation
        const tokens = text.split(/\b/);
        
        const processedTokens = tokens.map(token => {
            // Skip punctuation and whitespace
            if (!/\w/.test(token)) return token;
            
            // Only substitute some words based on probability
            if (Math.random() > substitutionProbability) {
                return token;
            }
            
            const lowerToken = token.toLowerCase();
            
            // Check if we have substitutions for this word
            if (substitutions[lowerToken]) {
                const substitutionOptions = substitutions[lowerToken];
                const newWord = substitutionOptions[Math.floor(Math.random() * substitutionOptions.length)];
                
                // Preserve capitalization
                if (token[0] === token[0].toUpperCase()) {
                    return newWord.charAt(0).toUpperCase() + newWord.slice(1);
                }
                
                return newWord;
            }
            
            return token;
        });
        
        return processedTokens.join('');
    }
    
    // Make the existing methods more aggressive too
    
    function changeStructure(text, strength) {
        // Attempt to restructure sentences in various ways
        let result = text;
        
        // Try different restructuring techniques
        const techniques = [
            // ...existing techniques...
            
            // New aggressive techniques
            // Inversion
            text => {
                if (text.includes('because')) {
                    return text.replace(/(.+) because (.+)/, '$2. Therefore, $1');
                }
                return text;
            },
            
            // Convert if statement to although
            text => {
                if (text.includes('if') && !text.includes('would') && !text.includes('could')) {
                    return text.replace(/if (.+), (.+)/, 'Although $1, $2 nevertheless');
                }
                return text;
            },
            
            // Change emphasis with cleft sentences
            text => {
                const words = text.split(' ');
                if (words.length > 8 && Math.random() < 0.3) {
                    const subject = words.slice(0, 1).join(' ');
                    const rest = words.slice(1).join(' ');
                    return `It is ${subject} that ${rest}`;
                }
                return text;
            },
            
            // Add or remove emphasis
            text => {
                if (Math.random() < 0.4) {
                    const emphasisPhrases = [
                        'indeed', 'certainly', 'definitely', 'absolutely', 
                        'unquestionably', 'undoubtedly', 'clearly'
                    ];
                    const phrase = emphasisPhrases[Math.floor(Math.random() * emphasisPhrases.length)];
                    
                    const words = text.split(' ');
                    const insertPosition = Math.min(2, words.length);
                    words.splice(insertPosition, 0, phrase);
                    return words.join(' ');
                }
                return text;
            }
        ];
        
        // Apply more techniques for higher strength
        const techniquesToApply = Math.floor(Math.random() * strength * 2) + strength;
        
        // Shuffle techniques for more variety
        const shuffledTechniques = techniques.sort(() => 0.5 - Math.random());
        
        // Apply selected techniques
        for (let i = 0; i < Math.min(techniquesToApply, shuffledTechniques.length); i++) {
            result = shuffledTechniques[i](result);
        }
        
        return result;
    }

    function makeFormal(text, strength) {
        // Formal mode substitutions
        const casualToFormal = {
            'a lot': 'considerably',
            'lots of': 'numerous',
            'get': 'obtain',
            'got': 'acquired',
            'use': 'utilize',
            'show': 'demonstrate',
            'tell': 'inform',
            'find out': 'discover',
            'look into': 'investigate',
            'go up': 'increase',
            'go down': 'decrease',
            'look at': 'examine',
            'give up': 'abandon',
            'keep up': 'maintain',
            'start': 'commence',
            'end': 'conclude',
            'big': 'substantial',
            'small': 'minimal',
            'good': 'favorable',
            'bad': 'unfavorable',
            'right': 'correct',
            'wrong': 'incorrect',
            'kind of': 'somewhat',
            'sort of': 'relatively',
            'I think': 'I believe',
            'I guess': 'I presume',
            'I feel': 'I perceive',
            'pretty': 'rather',
            'really': 'significantly',
            'so': 'therefore',
            'also': 'additionally',
            'but': 'however',
            'and': 'furthermore',
            'so': 'consequently',
            'about': 'approximately',
            'for': 'regarding',
            'like': 'similar to',
            'still': 'nevertheless'
        };
        
        // Replace casual terms with formal ones
        let formalText = text;
        
        Object.keys(casualToFormal).forEach(casual => {
            // Only substitute based on strength probability
            if (Math.random() < strength * 0.3) {
                const regex = new RegExp(`\\b${casual}\\b`, 'gi');
                formalText = formalText.replace(regex, casualToFormal[casual]);
            }
        });
        
        // Remove contractions
        const contractions = {
            "aren't": "are not",
            "can't": "cannot",
            "couldn't": "could not",
            "didn't": "did not",
            "doesn't": "does not",
            "don't": "do not",
            "hadn't": "had not",
            "hasn't": "has not",
            "haven't": "have not",
            "he'd": "he would",
            "he'll": "he will",
            "he's": "he is",
            "I'd": "I would",
            "I'll": "I will",
            "I'm": "I am",
            "I've": "I have",
            "isn't": "is not",
            "it's": "it is",
            "let's": "let us",
            "mustn't": "must not",
            "shan't": "shall not",
            "she'd": "she would",
            "she'll": "she will",
            "she's": "she is",
            "shouldn't": "should not",
            "that's": "that is",
            "there's": "there is",
            "they'd": "they would",
            "they'll": "they will",
            "they're": "they are",
            "they've": "they have",
            "we'd": "we would",
            "we'll": "we will",
            "we're": "we are",
            "we've": "we have",
            "weren't": "were not",
            "what'll": "what will",
            "what're": "what are",
            "what's": "what is",
            "what've": "what have",
            "where's": "where is",
            "who'd": "who would",
            "who'll": "who will",
            "who're": "who are",
            "who's": "who is",
            "who've": "who have",
            "won't": "will not",
            "wouldn't": "would not",
            "you'd": "you would",
            "you'll": "you will",
            "you're": "you are",
            "you've": "you have"
        };
        
        // Replace contractions
        if (strength > 1) {
            Object.keys(contractions).forEach(contraction => {
                const regex = new RegExp(`\\b${contraction}\\b`, 'g');
                formalText = formalText.replace(regex, contractions[contraction]);
            });
        }
        
        // Add formal transitions
        if (strength > 2 && Math.random() < 0.4) {
            const formalTransitions = [
                'Furthermore, ', 'In addition, ', 'Moreover, ', 
                'Consequently, ', 'Therefore, ', 'Subsequently, '
            ];
            const transition = formalTransitions[Math.floor(Math.random() * formalTransitions.length)];
            formalText = transition + formalText.charAt(0).toLowerCase() + formalText.slice(1);
        }
        
        return formalText;
    }
    
    function makeSimple(text, strength) {
        // Simplification strategies
        
        // Break long sentences
        if (text.length > 80 && text.includes(', ')) {
            const parts = text.split(', ');
            if (parts.length > 1) {
                const firstPart = parts[0] + '.';
                const secondPart = parts.slice(1).join(', ');
                const firstChar = secondPart.charAt(0).toUpperCase();
                const restOfSecond = secondPart.slice(1);
                
                text = firstPart + ' ' + firstChar + restOfSecond;
            }
        }
        
        // Replace complex words with simpler ones
        const complexToSimple = {
            'accomplish': 'do',
            'additional': 'more',
            'sufficient': 'enough',
            'consequently': 'so',
            'nevertheless': 'still',
            'approximately': 'about',
            'regarding': 'about',
            'numerous': 'many',
            'assist': 'help',
            'attempt': 'try',
            'commence': 'start',
            'conclude': 'end',
            'utilize': 'use',
            'purchase': 'buy',
            'inquire': 'ask',
            'obtain': 'get',
            'comprehend': 'understand',
            'demonstrate': 'show',
            'inform': 'tell',
            'discover': 'find',
            'investigate': 'look into',
            'increase': 'go up',
            'decrease': 'go down',
            'examine': 'look at',
            'abandon': 'give up',
            'maintain': 'keep up',
            'substantial': 'big',
            'minimal': 'small',
            'favorable': 'good',
            'unfavorable': 'bad',
            'correct': 'right',
            'incorrect': 'wrong',
            'relatively': 'kind of',
            'significantly': 'really',
            'therefore': 'so',
            'additionally': 'also',
            'however': 'but',
            'furthermore': 'and',
            'consequently': 'so'
        };
        
        // Replace complex words based on strength
        let simpleText = text;
        
        Object.keys(complexToSimple).forEach(complex => {
            if (Math.random() < strength * 0.4) {
                const regex = new RegExp(`\\b${complex}\\b`, 'gi');
                simpleText = simpleText.replace(regex, complexToSimple[complex]);
            }
        });
        
        // Replace long words with shorter ones wherever possible
        const words = simpleText.split(' ');
        const simplifiedWords = words.map(word => {
            // Preserve punctuation
            const punctuationAtEnd = word.match(/[.,!?;:"]$/);
            const punctuation = punctuationAtEnd ? punctuationAtEnd[0] : '';
            const cleanWord = punctuation ? word.slice(0, -1) : word;
            
            // Try to simplify very long words only
            if (cleanWord.length > 8 && Math.random() < strength * 0.3) {
                // This would be where a real thesaurus lookup would happen
                // For this example, we'll just truncate some words as a placeholder
                return cleanWord.substring(0, 6) + punctuation;
            }
            
            return word;
        });
        
        // Put it back together with some adjustments for readability
        simpleText = simplifiedWords.join(' ');
        
        return simpleText;
    }
    
    // Initialize stats
    updateInputStats();
}
