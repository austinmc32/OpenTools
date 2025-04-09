export function imageConverter(container) {
    container.innerHTML = `
        <div class="tool-interface">
            <div class="converter-card">
                <div class="file-upload-area">
                    <div class="upload-container" id="upload-container">
                        <i class="fas fa-cloud-upload-alt upload-icon"></i>
                        <p>Drag & drop your images here or</p>
                        <label for="file-input" class="upload-button choose-file-btn">
                            <i class="fas fa-folder-open"></i>
                            Choose File
                        </label>
                        <input type="file" id="file-input" accept="image/*" hidden>
                        <p class="file-types">Supports: JPG, PNG, GIF, BMP, WEBP, TIFF, SVG, HEIC and more</p>
                    </div>
                    <div id="file-preview" class="file-preview hidden">
                        <div class="preview-header">
                            <h4>Preview:</h4>
                            <button id="remove-file" class="text-button">
                                <i class="fas fa-trash"></i> Remove
                            </button>
                        </div>
                        <div class="preview-content">
                            <img id="image-preview" src="#" alt="Preview">
                            <div class="file-info" id="file-info"></div>
                        </div>
                    </div>
                </div>
                
                <div class="conversion-options">
                    <h4>Conversion Options</h4>
                    
                    <div class="option-group">
                        <label for="format-select">Output Format:</label>
                        <select id="format-select" class="form-control">
                            <option value="jpeg">JPEG/JPG</option>
                            <option value="png">PNG</option>
                            <option value="webp">WebP</option>
                            <option value="gif">GIF</option>
                            <option value="bmp">BMP</option>
                            <option value="tiff">TIFF</option>
                            <option value="svg">SVG</option>
                            <option value="ico">ICO</option>
                        </select>
                    </div>
                    
                    <div class="option-group">
                        <label>Quality:</label>
                        <div class="slider-container">
                            <input type="range" id="quality-slider" min="1" max="100" value="85">
                            <span id="quality-value">85%</span>
                        </div>
                    </div>
                    
                    <div class="option-group">
                        <label>Resize:</label>
                        <div class="resize-options">
                            <div class="resize-inputs">
                                <div class="dimension-input">
                                    <label for="width-input">Width:</label>
                                    <input type="number" id="width-input" placeholder="Auto" class="form-control small-input">
                                </div>
                                <span class="dimension-separator">×</span>
                                <div class="dimension-input">
                                    <label for="height-input">Height:</label>
                                    <input type="number" id="height-input" placeholder="Auto" class="form-control small-input">
                                </div>
                            </div>
                            <div class="maintain-ratio">
                                <input type="checkbox" id="maintain-ratio" checked>
                                <label for="maintain-ratio">Maintain aspect ratio</label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="convert-actions">
                        <button id="convert-btn" class="primary-button action-button" disabled>
                            <i class="fas fa-exchange-alt"></i> Convert
                        </button>
                    </div>
                </div>
            </div>
            
            <div id="result-container" class="result-container hidden">
                <h4>Conversion Result</h4>
                <div class="result-preview">
                    <img id="result-image" src="#" alt="Converted image">
                </div>
                <div class="result-actions">
                    <button id="download-btn" class="primary-button download-button">
                        <i class="fas fa-download"></i> Download
                    </button>
                    <button id="convert-another" class="secondary-button">
                        <i class="fas fa-redo"></i> Convert Another
                    </button>
                </div>
            </div>
        </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .converter-card {
            background-color: var(--card-color);
            border-radius: 8px;
            box-shadow: var(--shadow);
            padding: 1.5rem;
            margin-bottom: 1.5rem;
        }
        
        .file-upload-area {
            margin-bottom: 1.5rem;
        }
        
        .upload-container {
            border: 2px dashed var(--border-color);
            border-radius: 8px;
            padding: 2rem;
            text-align: center;
            transition: border-color var(--transition-fast);
            background-color: rgba(74, 134, 232, 0.05);
        }
        
        .upload-container.dragover {
            border-color: var(--accent-color);
            background-color: rgba(74, 134, 232, 0.1);
        }
        
        .upload-icon {
            font-size: 3rem;
            color: var(--text-light);
            margin-bottom: 1rem;
        }
        
        .choose-file-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background-color: #4a86e8;
            color: white;
            padding: 12px 24px;
            border-radius: 4px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            margin: 15px 0;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
            border: 2px solid transparent;
        }

        .choose-file-btn:hover {
            background-color: #3a76d8;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        .choose-file-btn:active {
            transform: translateY(1px);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        .choose-file-btn i {
            margin-right: 8px;
            font-size: 18px;
        }
        
        .file-preview {
            margin-top: 1.5rem;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            overflow: hidden;
        }
        
        .preview-header {
            padding: 0.75rem 1rem;
            background-color: var(--background-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--border-color);
        }
        
        .preview-header h4 {
            margin: 0;
        }
        
        .preview-content {
            padding: 1rem;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
        }
        
        #image-preview {
            max-width: 100%;
            max-height: 200px;
            border-radius: 4px;
        }
        
        .file-info {
            font-size: 0.9rem;
            color: var(--text-light);
        }
        
        .conversion-options {
            background-color: var(--background-color);
            border-radius: 8px;
            padding: 1rem;
        }
        
        .option-group {
            margin-bottom: 1.5rem;
        }
        
        .slider-container {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .slider-container input {
            flex: 1;
        }
        
        .resize-options {
            margin-top: 0.5rem;
        }
        
        .resize-inputs {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.5rem;
        }
        
        .dimension-input {
            display: flex;
            flex-direction: column;
        }
        
        .small-input {
            width: 100px;
        }
        
        .maintain-ratio {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .convert-actions {
            text-align: center;
            margin-top: 2rem;
        }
        
        .result-container {
            background-color: var(--card-color);
            border-radius: 8px;
            box-shadow: var(--shadow);
            padding: 1.5rem;
            margin-top: 2rem;
        }
        
        .result-preview {
            text-align: center;
            margin: 1.5rem 0;
        }
        
        #result-image {
            max-width: 100%;
            max-height: 300px;
            border-radius: 4px;
        }
        
        .result-actions {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-top: 1.5rem;
        }
        
        .text-button {
            background: none;
            border: none;
            color: var(--text-light);
            cursor: pointer;
            transition: color var(--transition-fast);
        }
        
        .text-button:hover {
            color: var(--accent-color);
        }
        
        .hidden {
            display: none;
        }
        
        /* Enhanced button styles */
        .primary-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background-color: var(--accent-color);
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
            border: none;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .primary-button:hover {
            background-color: var(--accent-hover);
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        
        .primary-button:disabled {
            background-color: #a0a0a0;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }
        
        .primary-button i {
            margin-right: 8px;
        }
        
        .primary-button.action-button {
            background-color: var(--accent-color);
            padding: 12px 24px;
            font-size: 16px;
            font-weight: 600;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .primary-button.action-button:hover:not(:disabled) {
            background-color: var(--accent-hover);
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        
        .primary-button.download-button {
            background-color: #36a853;
            padding: 14px 28px;
            font-size: 16px;
            font-weight: 600;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
        
        .primary-button.download-button:hover {
            background-color: #2e9247;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        
        .secondary-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background-color: var(--background-color);
            color: var(--text-color);
            border: 1px solid var(--border-color);
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .secondary-button:hover {
            background-color: var(--hover-color);
            transform: translateY(-2px);
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
        }
        
        .secondary-button i {
            margin-right: 8px;
        }
        
        .highlight-button {
            animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
            0% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
            100% {
                transform: scale(1);
            }
        }
    `;
    document.head.appendChild(style);

    // Get DOM elements
    const uploadContainer = document.getElementById('upload-container');
    const fileInput = document.getElementById('file-input');
    const filePreview = document.getElementById('file-preview');
    const imagePreview = document.getElementById('image-preview');
    const fileInfo = document.getElementById('file-info');
    const removeFileBtn = document.getElementById('remove-file');
    const qualitySlider = document.getElementById('quality-slider');
    const qualityValue = document.getElementById('quality-value');
    const widthInput = document.getElementById('width-input');
    const heightInput = document.getElementById('height-input');
    const maintainRatioCheck = document.getElementById('maintain-ratio');
    const convertBtn = document.getElementById('convert-btn');
    const resultContainer = document.getElementById('result-container');
    const resultImage = document.getElementById('result-image');
    const downloadBtn = document.getElementById('download-btn');
    const convertAnotherBtn = document.getElementById('convert-another');
    const formatSelect = document.getElementById('format-select');

    let currentFile = null;
    let originalDimensions = { width: 0, height: 0 };
    let aspectRatio = 1;

    // Event Listeners
    uploadContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadContainer.classList.add('dragover');
    });

    ['dragleave', 'dragend'].forEach(eventName => {
        uploadContainer.addEventListener(eventName, () => {
            uploadContainer.classList.remove('dragover');
        });
    });

    uploadContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadContainer.classList.remove('dragover');
        
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            handleFile(fileInput.files[0]);
        }
    });

    removeFileBtn.addEventListener('click', () => {
        resetUploadArea();
    });

    qualitySlider.addEventListener('input', () => {
        qualityValue.textContent = `${qualitySlider.value}%`;
    });

    widthInput.addEventListener('input', () => {
        if (maintainRatioCheck.checked && originalDimensions.width > 0) {
            const newWidth = parseInt(widthInput.value) || 0;
            if (newWidth > 0) {
                heightInput.value = Math.round(newWidth / aspectRatio);
            } else {
                heightInput.value = '';
            }
        }
    });

    heightInput.addEventListener('input', () => {
        if (maintainRatioCheck.checked && originalDimensions.height > 0) {
            const newHeight = parseInt(heightInput.value) || 0;
            if (newHeight > 0) {
                widthInput.value = Math.round(newHeight * aspectRatio);
            } else {
                widthInput.value = '';
            }
        }
    });

    convertBtn.addEventListener('click', convertImage);
    downloadBtn.addEventListener('click', downloadConvertedImage);
    convertAnotherBtn.addEventListener('click', () => {
        resultContainer.classList.add('hidden');
        resetUploadArea();
    });

    // Functions
    function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file');
            return;
        }

        currentFile = file;
        convertBtn.disabled = false;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            
            // Get file info
            const size = formatFileSize(file.size);
            fileInfo.innerHTML = `
                <div><strong>Name:</strong> ${file.name}</div>
                <div><strong>Type:</strong> ${file.type}</div>
                <div><strong>Size:</strong> ${size}</div>
            `;
            
            // Get image dimensions
            const img = new Image();
            img.onload = () => {
                originalDimensions.width = img.width;
                originalDimensions.height = img.height;
                aspectRatio = img.width / img.height;
                
                fileInfo.innerHTML += `
                    <div><strong>Dimensions:</strong> ${img.width}×${img.height} px</div>
                `;
                
                // Set default resize values
                widthInput.placeholder = img.width;
                heightInput.placeholder = img.height;
            };
            img.src = e.target.result;
        };
        
        reader.readAsDataURL(file);
        
        filePreview.classList.remove('hidden');
        uploadContainer.style.display = 'none';
    }

    function resetUploadArea() {
        fileInput.value = '';
        currentFile = null;
        convertBtn.disabled = true;
        filePreview.classList.add('hidden');
        uploadContainer.style.display = 'block';
        widthInput.value = '';
        heightInput.value = '';
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function convertImage() {
        if (!currentFile) return;
        
        // Create a canvas to handle the conversion
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        // Show loading state on button
        convertBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Converting...';
        
        img.onload = () => {
            // Set dimensions
            let width = parseInt(widthInput.value) || img.width;
            let height = parseInt(heightInput.value) || img.height;
            
            canvas.width = width;
            canvas.height = height;
            
            // Draw image on canvas
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convert to the selected format
            const format = formatSelect.value;
            const quality = qualitySlider.value / 100;
            
            let resultType = 'image/jpeg';
            switch (format) {
                case 'png': 
                    resultType = 'image/png'; 
                    break;
                case 'webp': 
                    resultType = 'image/webp'; 
                    break;
                case 'gif': 
                    resultType = 'image/gif'; 
                    break;
                case 'bmp': 
                    resultType = 'image/bmp'; 
                    break;
                case 'tiff': 
                    // Browser support is limited for TIFF
                    resultType = 'image/tiff'; 
                    break;
                case 'svg':
                    // SVG requires different handling - simplified for demo
                    alert('SVG conversion requires server-side processing'); 
                    return;
                case 'ico':
                    // ICO requires different handling
                    alert('ICO conversion requires server-side processing');
                    return;
            }
            
            // Generate result
            try {
                const resultDataUrl = canvas.toDataURL(resultType, quality);
                resultImage.src = resultDataUrl;
                resultContainer.classList.remove('hidden');
                
                // Add highlight effect to download button
                downloadBtn.classList.add('highlight-button');
                
                // Reset convert button
                convertBtn.innerHTML = '<i class="fas fa-exchange-alt"></i> Convert';
                
                // Scroll to result
                resultContainer.scrollIntoView({ behavior: 'smooth' });
            } catch (error) {
                alert(`Error converting image: ${error.message}`);
                convertBtn.innerHTML = '<i class="fas fa-exchange-alt"></i> Convert';
            }
        };
        
        img.src = URL.createObjectURL(currentFile);
    }

    function downloadConvertedImage() {
        if (!resultImage.src || resultImage.src === '#') return;
        
        const format = formatSelect.value;
        const link = document.createElement('a');
        
        // Generate a filename without the original extension
        let filename = currentFile.name;
        const lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex !== -1) {
            filename = filename.substring(0, lastDotIndex);
        }
        
        link.download = `${filename}-converted.${format}`;
        link.href = resultImage.src;
        link.click();
        
        // Remove highlight effect after download
        downloadBtn.classList.remove('highlight-button');
    }
}
