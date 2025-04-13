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

        // Get all available voices
        voices = synthesis.getVoices();

        // Sort all voices alphabetically by name
        voices.sort((a, b) => a.name.localeCompare(b.name));

        voiceSelect.innerHTML = ''; // Clear existing options

        if (voices.length === 0) {
            // If no voices found at all, display a message
            const option = document.createElement('option');
            option.textContent = 'No voices available';
            option.disabled = true;
            voiceSelect.appendChild(option);
            speakBtn.disabled = true; // Disable speak if no voices
        } else {
            // Populate dropdown with all available voices
            voices.forEach(voice => {
                const option = document.createElement('option');
                option.textContent = `${voice.name} (${voice.lang})`;
                option.value = voice.name;
                voiceSelect.appendChild(option);
            });
            speakBtn.disabled = false; // Enable speak button
        }

        // If no voices are available *at all* yet (still loading), wait and try again
        if (synthesis.getVoices().length === 0) { // Check original list length here
            // Add a temporary "Loading..." option while waiting
            if (voiceSelect.options.length === 0) {
                 const loadingOption = document.createElement('option');
                 loadingOption.textContent = 'Loading voices...';
                 loadingOption.disabled = true;
                 voiceSelect.appendChild(loadingOption);
            }
            speakBtn.disabled = true; // Keep disabled while loading
            setTimeout(loadVoices, 150); // Increased timeout slightly
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
