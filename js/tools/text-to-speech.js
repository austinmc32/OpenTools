/**
 * Text to Speech Converter Tool
 * Converts text input to speech using the Web Speech API
 */

export function textToSpeech(container) {
    // Set up the HTML structure first
    container.innerHTML = `
        <div class="tool-interface">
            <h2>Text to Speech Converter</h2>
            <div class="form-group">
                <label for="tts-input">Enter text to convert to speech:</label>
                <textarea id="tts-input" class="full-width" rows="6" placeholder="Type or paste your text here..."></textarea>
            </div>
            <div class="form-group">
                <label for="voice-select">Select Voice:</label>
                <select id="voice-select" class="full-width"></select>
            </div>
            <div class="form-group">
                <label for="rate-input">Speech Rate:</label>
                <input type="range" id="rate-input" min="0.5" max="2" value="1" step="0.1" class="full-width">
                <span id="rate-value">1</span>
            </div>
            <div class="form-group">
                <label for="pitch-input">Pitch:</label>
                <input type="range" id="pitch-input" min="0.5" max="2" value="1" step="0.1" class="full-width">
                <span id="pitch-value">1</span>
            </div>
            <div class="control-buttons">
                <button id="speak-btn" class="primary-button"><i class="fas fa-play"></i> Speak</button>
                <button id="pause-btn" class="secondary-button" disabled><i class="fas fa-pause"></i> Pause</button>
                <button id="resume-btn" class="secondary-button" disabled><i class="fas fa-play"></i> Resume</button>
                <button id="stop-btn" class="btn-danger" disabled><i class="fas fa-stop"></i> Stop</button>
            </div>
        </div>
    `;

    // Now get the elements after they've been created
    const textInput = container.querySelector('#tts-input');
    const voiceSelect = container.querySelector('#voice-select');
    const rateInput = container.querySelector('#rate-input');
    const pitchInput = container.querySelector('#pitch-input');
    const rateValue = container.querySelector('#rate-value');
    const pitchValue = container.querySelector('#pitch-value');
    const speakBtn = container.querySelector('#speak-btn');
    const pauseBtn = container.querySelector('#pause-btn');
    const resumeBtn = container.querySelector('#resume-btn');
    const stopBtn = container.querySelector('#stop-btn');

    // Initialize the speech synthesis
    const synthesis = window.speechSynthesis;
    let voices = [];
    
    // Function to load available voices
    function loadVoices() {
        // Make sure voiceSelect exists before trying to manipulate it
        if (!voiceSelect) {
            console.error('Voice select element not found');
            return;
        }

        voices = synthesis.getVoices();
        
        // Sort voices: Microsoft voices first (prioritizing natural ones), 
        // then other English voices, then the rest
        voices.sort((a, b) => {
            // Microsoft natural voices first
            const aMicrosoftNatural = a.name.toLowerCase().includes('microsoft') && 
                                     a.name.toLowerCase().includes('natural') && 
                                     a.lang.startsWith('en');
            const bMicrosoftNatural = b.name.toLowerCase().includes('microsoft') && 
                                     b.name.toLowerCase().includes('natural') && 
                                     b.lang.startsWith('en');
            
            // Then other Microsoft voices
            const aMicrosoft = a.name.toLowerCase().includes('microsoft');
            const bMicrosoft = b.name.toLowerCase().includes('microsoft');
            
            // Then English voices
            const aEnglish = a.lang.startsWith('en');
            const bEnglish = b.lang.startsWith('en');
            
            // Sort order logic
            if (aMicrosoftNatural && !bMicrosoftNatural) return -1;
            if (!aMicrosoftNatural && bMicrosoftNatural) return 1;
            if (aMicrosoft && !bMicrosoft) return -1;
            if (!aMicrosoft && bMicrosoft) return 1;
            if (aEnglish && !bEnglish) return -1;
            if (!aEnglish && bEnglish) return 1;
            
            // Default sort by name
            return a.name.localeCompare(b.name);
        });
        
        voiceSelect.innerHTML = '';
        
        voices.forEach(voice => {
            const option = document.createElement('option');
            option.textContent = `${voice.name} (${voice.lang})`;
            option.value = voice.name;
            voiceSelect.appendChild(option);
        });
        
        // If no voices are available yet, wait and try again
        if (voices.length === 0) {
            setTimeout(loadVoices, 100);
        }
    }
    
    // Chrome loads voices asynchronously
    if (synthesis.onvoiceschanged !== undefined) {
        synthesis.onvoiceschanged = loadVoices;
    }
    
    // Initial load of voices
    loadVoices();
    
    // Update displayed values for sliders
    rateInput.addEventListener('input', () => {
        rateValue.textContent = rateInput.value;
    });
    
    pitchInput.addEventListener('input', () => {
        pitchValue.textContent = pitchInput.value;
    });
    
    // Speak functionality
    let utterance = null;
    
    speakBtn.addEventListener('click', () => {
        // Cancel any ongoing speech
        synthesis.cancel();
        
        if (textInput.value !== '') {
            // Create a new utterance
            utterance = new SpeechSynthesisUtterance(textInput.value);
            
            // Set selected voice
            const selectedVoice = voices.find(voice => voice.name === voiceSelect.value);
            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }
            
            // Set rate and pitch
            utterance.rate = parseFloat(rateInput.value);
            utterance.pitch = parseFloat(pitchInput.value);
            
            // Enable control buttons
            pauseBtn.disabled = false;
            stopBtn.disabled = false;
            resumeBtn.disabled = true;
            
            // Speak
            synthesis.speak(utterance);
            
            // When speech ends
            utterance.onend = () => {
                resetButtons();
            };
        }
    });
    
    // Pause speech
    pauseBtn.addEventListener('click', () => {
        if (synthesis.speaking) {
            synthesis.pause();
            pauseBtn.disabled = true;
            resumeBtn.disabled = false;
        }
    });
    
    // Resume speech
    resumeBtn.addEventListener('click', () => {
        if (synthesis.paused) {
            synthesis.resume();
            pauseBtn.disabled = false;
            resumeBtn.disabled = true;
        }
    });
    
    // Stop speech
    stopBtn.addEventListener('click', () => {
        if (synthesis.speaking) {
            synthesis.cancel();
            resetButtons();
        }
    });
    
    // Reset button states
    function resetButtons() {
        pauseBtn.disabled = true;
        resumeBtn.disabled = true;
        stopBtn.disabled = true;
    }

    // Add example text if input is empty
    if (!textInput.value) {
        textInput.value = "Hello! This is an example text to convert to speech. Adjust the voice, rate, and pitch to customize how it sounds.";
    }
}
