/**
 * Text to Speech Converter Tool
 * Converts text input to speech using the Web Speech API
 */

export function textToSpeech(container) {
    container.innerHTML = `
        <div class="tool-interface">
            <h2>Text to Speech</h2>
            <!-- Updated markup that uses base classes -->
            <textarea id="speech-input" class="form-control" placeholder="Enter text for speech..."></textarea>
            <button class="btn btn-primary">Speak</button>
            <button class="btn btn-secondary">Pause</button>
            <button class="btn btn-secondary">Resume</button>
        </div>
    `;
    const voiceSelect = container.querySelector('#voice-select');
    const textInput = container.querySelector('#text-input');
    const rateInput = container.querySelector('#rate-input');
    const rateValue = container.querySelector('#rate-value');
    const pitchInput = container.querySelector('#pitch-input');
    const pitchValue = container.querySelector('#pitch-value');
    const speakBtn = container.querySelector('#speak-btn');
    const pauseBtn = container.querySelector('#pause-btn');
    const resumeBtn = container.querySelector('#resume-btn');
    const stopBtn = container.querySelector('#stop-btn');
    
    // Initialize speech synthesis
    const synth = window.speechSynthesis;
    let voices = [];
    
    // Load available voices
    function loadVoices() {
        voices = synth.getVoices();
        voiceSelect.innerHTML = '';
        
        voices.forEach(voice => {
            const option = document.createElement('option');
            option.textContent = `${voice.name} (${voice.lang})`;
            option.setAttribute('data-lang', voice.lang);
            option.setAttribute('data-name', voice.name);
            voiceSelect.appendChild(option);
        });
    }
    
    // Chrome loads voices asynchronously
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    // Load initial voices
    loadVoices();
    
    // Update sliders display values
    rateInput.addEventListener('input', () => {
        rateValue.textContent = rateInput.value;
    });
    
    pitchInput.addEventListener('input', () => {
        pitchValue.textContent = pitchInput.value;
    });
    
    // Speak function
    speakBtn.addEventListener('click', () => {
        // Cancel any ongoing speech
        if (synth.speaking) {
            synth.cancel();
        }
        
        const text = textInput.value;
        if (!text) return;
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set voice
        const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');
        utterance.voice = voices.find(voice => voice.name === selectedVoice);
        
        // Set other parameters
        utterance.rate = parseFloat(rateInput.value);
        utterance.pitch = parseFloat(pitchInput.value);
        
        // Speak
        synth.speak(utterance);
    });
    
    // Control buttons
    pauseBtn.addEventListener('click', () => {
        if (synth.speaking) {
            synth.pause();
        }
    });
    
    resumeBtn.addEventListener('click', () => {
        if (synth.paused) {
            synth.resume();
        }
    });
    
    stopBtn.addEventListener('click', () => {
        synth.cancel();
    });
}
