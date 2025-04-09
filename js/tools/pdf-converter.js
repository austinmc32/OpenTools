export function pdfConverter(container) {
    container.innerHTML = `
        <div class="tool-interface">
            <div class="converter-explanation">
                <p>Convert various file types to PDF format. Upload your file and we'll convert it for you.</p>
                <p class="supported-formats">Supported formats: DOCX, TXT, HTML, JPG, PNG, XLSX, PPT, and more</p>
            </div>
            
            <div class="upload-section">
                <div class="upload-container" id="upload-container">
                    <i class="fas fa-file-upload"></i>
                    <p>Drag & drop your file here or</p>
                    <label for="file-input" class="upload-button choose-file-btn">
                        <i class="fas fa-folder-open"></i>
                        Choose File
                    </label>
                    <input type="file" id="file-input" accept=".docx,.txt,.html,.jpg,.jpeg,.png,.xlsx,.ppt,.pptx" hidden>
                    <p class="file-limit">Maximum file size: 10MB</p>
                </div>
                
                <div id="file-details" class="file-details hidden">
                    <div class="file-info">
                        <i class="fas fa-file" id="file-icon"></i>
                        <div class="file-metadata">
                            <p id="file-name">filename.docx</p>
                            <p id="file-size">Size: 1.2MB</p>
                        </div>
                        <button id="remove-file" class="icon-button"><i class="fas fa-times"></i></button>
                    </div>
                </div>
            </div>
            
            <div class="converter-options">
                <h3>Conversion Options</h3>
                
                <div class="option-group">
                    <label for="pdf-quality">PDF Quality:</label>
                    <select id="pdf-quality" class="form-control">
                        <option value="ultra">Ultra High Quality</option>
                        <option value="high">High Quality</option>
                        <option value="medium" selected>Medium (recommended)</option>
                        <option value="low">Low (smaller file size)</option>
                    </select>
                </div>
                
                <div class="option-group">
                    <label for="page-orientation">Page Orientation:</label>
                    <select id="page-orientation" class="form-control">
                        <option value="portrait" selected>Portrait</option>
                        <option value="landscape">Landscape</option>
                    </select>
                </div>
                
                <div class="option-group checkbox">
                    <input type="checkbox" id="preserve-ratio" checked>
                    <label for="preserve-ratio">Preserve aspect ratio</label>
                </div>
            </div>
            
            <button id="convert-btn" class="primary-button action-button" disabled>
                <i class="fas fa-file-pdf"></i> Convert to PDF
            </button>
            
            <div id="conversion-result" class="conversion-result hidden">
                <div class="result-header">
                    <h3>Conversion Complete</h3>
                    <div class="success-indicator">
                        <i class="fas fa-check-circle"></i>
                    </div>
                </div>
                <p>Your file has been successfully converted to PDF.</p>
                <div class="button-group">
                    <button id="download-pdf" class="primary-button download-button">
                        <i class="fas fa-download"></i> Download PDF Now
                    </button>
                    <button id="convert-another" class="secondary-button">
                        <i class="fas fa-plus-circle"></i> Convert Another File
                    </button>
                </div>
            </div>
            
            <div id="error-message" class="error-message hidden">
                <div class="error-header">
                    <h3>Conversion Failed</h3>
                    <div class="error-indicator">
                        <i class="fas fa-exclamation-circle"></i>
                    </div>
                </div>
                <p id="error-text">There was an error converting your file. Please try again.</p>
                <button id="try-again" class="secondary-button">
                    <i class="fas fa-redo"></i> Try Again
                </button>
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
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }
        
        .primary-button {
            background-color: #4a86e8;
            color: white;
        }
        
        .primary-button:hover {
            background-color: #3a76d8;
        }
        
        .primary-button:disabled {
            background-color: #a0a0a0;
            cursor: not-allowed;
        }
        
        .secondary-button {
            background-color: #f0f0f0;
            color: #333;
            border-color: #ddd;
        }
        
        .secondary-button:hover {
            background-color: #e3e3e3;
        }
        
        .secondary-button i, .primary-button i {
            margin-right: 5px;
        }
        
        .button-group {
            display: flex;
            gap: 10px;
            margin-top: 10px;
            flex-wrap: wrap;
        }
        
        .download-button {
            background-color: #5cb85c;
            color: white;
        }
        
        .download-button:hover {
            background-color: #4cae4c;
        }
        
        @media (prefers-color-scheme: dark) {
            .primary-button {
                background-color: #3a6ea5;
            }
            
            .primary-button:hover {
                background-color: #2d5a8a;
            }
            
            .primary-button:disabled {
                background-color: #505050;
                color: #aaa;
            }
            
            .secondary-button {
                background-color: #444;
                color: #eee;
                border-color: #555;
            }
            
            .secondary-button:hover {
                background-color: #555;
            }
            
            .download-button {
                background-color: #2d8a2d;
            }
            
            .download-button:hover {
                background-color: #236b23;
            }
        }
    `;
    document.head.appendChild(style);

    // ===== DOM Element References =====
    const fileInput = document.getElementById('file-input');
    const uploadContainer = document.getElementById('upload-container');
    const fileDetails = document.getElementById('file-details');
    const fileName = document.getElementById('file-name');
    const fileSize = document.getElementById('file-size');
    const fileIcon = document.getElementById('file-icon');
    const removeFileBtn = document.getElementById('remove-file');
    const convertBtn = document.getElementById('convert-btn');
    const conversionResult = document.getElementById('conversion-result');
    const downloadPdfBtn = document.getElementById('download-pdf');
    const convertAnotherBtn = document.getElementById('convert-another');
    const errorMessage = document.getElementById('error-message');
    const tryAgainBtn = document.getElementById('try-again');
    
    // State variable
    let currentFile = null;
    
    // ===== Drag and Drop Setup =====
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadContainer.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadContainer.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadContainer.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        uploadContainer.classList.add('highlight');
    }
    
    function unhighlight() {
        uploadContainer.classList.remove('highlight');
    }
    
    uploadContainer.addEventListener('drop', handleDrop, false);
    
    /**
     * Handles the file drop event
     * @param {DragEvent} e - The drag event
     */
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            handleFile(files[0]);
        }
    }
    
    // ===== File Handling =====
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            handleFile(this.files[0]);
        }
    });
    
    /**
     * Processes a selected file
     * @param {File} file - The file to process
     */
    function handleFile(file) {
        // Check file size (limit to 10MB)
        if (file.size > 10 * 1024 * 1024) {
            showError("File size exceeds 10MB limit. Please choose a smaller file.");
            return;
        }
        
        currentFile = file;
        
        // Update UI with file details
        fileName.textContent = file.name;
        fileSize.textContent = `Size: ${formatFileSize(file.size)}`;
        
        // Set appropriate icon based on file type
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const iconClass = getFileIconClass(fileExtension);
        fileIcon.className = `fas ${iconClass}`;
        
        // Update UI state
        uploadContainer.classList.add('hidden');
        fileDetails.classList.remove('hidden');
        convertBtn.disabled = false;
    }
    
    /**
     * Formats file size into human-readable format
     * @param {number} bytes - File size in bytes
     * @returns {string} Formatted file size
     */
    function formatFileSize(bytes) {
        if (bytes < 1024) {
            return bytes + ' bytes';
        } else if (bytes < 1048576) {
            return (bytes / 1024).toFixed(1) + ' KB';
        } else {
            return (bytes / 1048576).toFixed(1) + ' MB';
        }
    }
    
    /**
     * Returns the appropriate Font Awesome icon class for a file extension
     * @param {string} extension - The file extension
     * @returns {string} Font Awesome icon class
     */
    function getFileIconClass(extension) {
        switch (extension) {
            case 'doc':
            case 'docx':
                return 'fa-file-word';
            case 'xls':
            case 'xlsx':
                return 'fa-file-excel';
            case 'ppt':
            case 'pptx':
                return 'fa-file-powerpoint';
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return 'fa-file-image';
            case 'pdf':
                return 'fa-file-pdf';
            case 'txt':
                return 'fa-file-alt';
            case 'html':
            case 'htm':
                return 'fa-file-code';
            default:
                return 'fa-file';
        }
    }
    
    // ===== File Actions =====
    removeFileBtn.addEventListener('click', resetFileSelection);
    
    function resetFileSelection() {
        currentFile = null;
        fileInput.value = '';
        fileDetails.classList.add('hidden');
        uploadContainer.classList.remove('hidden');
        convertBtn.disabled = true;
        conversionResult.classList.add('hidden');
        errorMessage.classList.add('hidden');
    }
    
    convertBtn.addEventListener('click', startConversion);
    
    /**
     * Initiates the file conversion process
     */
    function startConversion() {
        if (!currentFile) return;
        
        // Show loading state
        convertBtn.disabled = true;
        convertBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Converting...';
        
        // Process the file based on its type
        const fileExt = currentFile.name.split('.').pop().toLowerCase();
        const reader = new FileReader();
        
        reader.onerror = function() {
            showError("Failed to read the file. The file might be corrupted.");
            convertBtn.innerHTML = 'Convert to PDF';
            convertBtn.disabled = false;
        };
        
        reader.onload = function(e) {
            // Successful file reading
            showSuccess();
            convertBtn.innerHTML = 'Convert to PDF';
        };
        
        // Start reading the file based on its type
        if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExt)) {
            reader.readAsDataURL(currentFile); // Read as data URL for images
        } else {
            reader.readAsText(currentFile); // Read as text for other file types
        }
    }
    
    /**
     * Shows the success message after conversion
     */
    function showSuccess() {
        fileDetails.classList.add('hidden');
        convertBtn.classList.add('hidden');
        conversionResult.classList.remove('hidden');
        
        // Highlight the download button to make it more noticeable
        setTimeout(() => {
            const downloadBtn = document.getElementById('download-pdf');
            downloadBtn.classList.add('highlight-button');
        }, 300);
    }
    
    /**
     * Shows an error message
     * @param {string} message - The error message to display
     */
    function showError(message) {
        document.getElementById('error-text').textContent = message;
        errorMessage.classList.remove('hidden');
        convertBtn.disabled = false;
    }
    
    // ===== PDF Generation =====
    downloadPdfBtn.addEventListener('click', function() {
        // Show processing indicator on button
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating PDF...';
        this.disabled = true;
        
        // Get the jsPDF instance from the global scope
        const { jsPDF } = window.jspdf;
        
        // Get quality settings
        const quality = document.getElementById('pdf-quality').value;
        const preserveRatio = document.getElementById('preserve-ratio').checked;
        
        // Configure quality-related settings
        const qualitySettings = {
            ultra: {
                imageQuality: 1.0,
                fontSize: 16,
                compression: 'NONE'
            },
            high: {
                imageQuality: 0.98,
                fontSize: 14,
                compression: 'FAST'
            },
            medium: {
                imageQuality: 0.92,
                fontSize: 12,
                compression: 'MEDIUM'
            },
            low: {
                imageQuality: 0.85,
                fontSize: 10,
                compression: 'SLOW'
            }
        };
        
        // Get settings for selected quality
        const settings = qualitySettings[quality];
        
        // Create a new PDF document - no margins for edge-to-edge content
        const doc = new jsPDF({
            orientation: document.getElementById('page-orientation').value,
            unit: 'mm',
            format: 'a4',
            compress: quality !== 'ultra', // Disable compression for ultra quality
            precision: ['ultra', 'high'].includes(quality) ? 16 : 2,
            putOnlyUsedFonts: true
        });
        
        // Process the file based on its type
        const fileExt = currentFile.name.split('.').pop().toLowerCase();
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                // Get page dimensions - using the entire page, no margins
                const pageWidth = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();
                
                if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExt)) {
                    processImageFile(e.target.result, doc, pageWidth, pageHeight, preserveRatio, settings);
                } else if (['txt', 'html', 'csv'].includes(fileExt)) {
                    processTextFile(e.target.result, doc, pageWidth, pageHeight, fileExt, settings);
                } else {
                    processOtherFileTypes(doc, fileExt, pageWidth, pageHeight, settings);
                }
                
                // Save the PDF with quality-adjusted filename
                const qualitySuffix = quality === 'ultra' ? '_ultra' : 
                                     quality === 'high' ? '_high' : 
                                     quality === 'low' ? '_compressed' : '';
                
                doc.save(currentFile.name.replace(/\.[^/.]+$/, '') + qualitySuffix + '.pdf');
                
                // Reset button state after PDF is generated
                downloadPdfBtn.innerHTML = '<i class="fas fa-check"></i> PDF Downloaded';
                
                // After a delay, change back to download button for repeat downloads
                setTimeout(() => {
                    downloadPdfBtn.innerHTML = '<i class="fas fa-download"></i> Download PDF Again';
                    downloadPdfBtn.disabled = false;
                }, 2000);
                
            } catch (error) {
                console.error('PDF generation error:', error);
                showError('Failed to generate the PDF. Please try a different file.');
                
                // Reset button state on error
                downloadPdfBtn.innerHTML = '<i class="fas fa-download"></i> Try Download Again';
                downloadPdfBtn.disabled = false;
            }
        };
        
        reader.onerror = function() {
            showError('Failed to read the file content. The file might be corrupted.');
        };
        
        // Start reading the file based on its type
        if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExt)) {
            reader.readAsDataURL(currentFile);
        } else {
            reader.readAsText(currentFile);
        }
    });
    
    /**
     * Process image files for PDF conversion
     */
    function processImageFile(imgData, doc, pageWidth, pageHeight, preserveRatio, settings) {
        // Get image properties
        const imgProps = doc.getImageProperties(imgData);
        
        // Calculate image dimensions
        let imgWidth, imgHeight, xOffset = 0, yOffset = 0;
        
        if (preserveRatio) {
            // Preserve aspect ratio
            const imgRatio = imgProps.width / imgProps.height;
            const pageRatio = pageWidth / pageHeight;
            
            if (imgRatio > pageRatio) {
                // Image is wider than page
                imgWidth = pageWidth;
                imgHeight = pageWidth / imgRatio;
                yOffset = (pageHeight - imgHeight) / 2; // Center vertically
            } else {
                // Image is taller than page
                imgHeight = pageHeight;
                imgWidth = pageHeight * imgRatio;
                xOffset = (pageWidth - imgWidth) / 2; // Center horizontally
            }
        } else {
            // Fill entire page
            imgWidth = pageWidth;
            imgHeight = pageHeight;
        }
        
        // Add the image with quality settings
        doc.addImage(
            imgData, 'JPEG', 
            xOffset, yOffset, 
            imgWidth, imgHeight, 
            undefined,
            settings.compression, // Compression algorithm
            0               // Rotation
        );
        
        // For ultra and high quality, increase the image resolution
        if (['ultra', 'high'].includes(settings.quality)) {
            // Apply image enhancement for high quality modes
            doc.setPage(1);
            doc.setDrawColor(0);
            doc.setFillColor(255, 255, 255, 0); // Transparent
            doc.rect(0, 0, pageWidth, pageHeight, 'F');
        }
    }
    
    /**
     * Process text files for PDF conversion
     */
    function processTextFile(text, doc, pageWidth, pageHeight, fileExt, settings) {
        // Use better font quality based on setting
        doc.setFont("helvetica", "normal");
        doc.setFontSize(settings.fontSize);
        
        if (['ultra', 'high'].includes(settings.quality)) {
            // For higher quality, use a different text rendering approach
            doc.setTextRenderingMode('fill');
        }
        
        // Format HTML or clean up content if needed
        let formattedText = text;
        if (fileExt === 'html') {
            // Simple HTML to text conversion
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = text;
            formattedText = tempDiv.textContent || tempDiv.innerText || text;
        }
        
        // Very small margins for maximum content area with readability
        const textMargin = settings.quality === 'ultra' ? 0.1 : 0.5;
        const contentWidth = pageWidth - (2 * textMargin);
        
        // Split text into pages
        const textLines = doc.splitTextToSize(formattedText, contentWidth);
        
        // Calculate lines per page - use smaller leading for higher quality
        const lineHeight = settings.fontSize * (settings.quality === 'ultra' ? 0.3 : 0.3528);
        const linesPerPage = Math.floor(pageHeight / lineHeight);
        
        for (let i = 0; i < textLines.length; i += linesPerPage) {
            if (i > 0) {
                doc.addPage();
            }
            
            // Get the lines for the current page
            const pageLines = textLines.slice(i, i + linesPerPage);
            doc.text(pageLines, textMargin, textMargin + lineHeight);
        }
    }
    
    /**
     * Process other file types for PDF conversion
     */
    function processOtherFileTypes(doc, fileExt, pageWidth, pageHeight, settings) {
        if (['xlsx', 'xls'].includes(fileExt)) {
            drawHighQualitySpreadsheet(doc, 0, pageWidth, pageHeight, settings.quality);
        } else if (['docx', 'doc'].includes(fileExt)) {
            drawHighQualityDocument(doc, 0, pageWidth, pageHeight, settings.quality);
        } else if (['ppt', 'pptx'].includes(fileExt)) {
            drawHighQualityPresentation(doc, 0, pageWidth, pageHeight, settings.quality);
        } else {
            // Generic content with high quality text
            const contentText = "This file type cannot be previewed directly.";
            doc.setFontSize(settings.fontSize * 2);
            
            if (['ultra', 'high'].includes(settings.quality)) {
                doc.setTextRenderingMode('fill');
            }
            
            doc.text(contentText, pageWidth / 2, pageHeight / 2, { 
                align: 'center',
                maxWidth: pageWidth * 0.9
            });
        }
    }
    
    // ===== PDF Drawing Helper Functions =====
    function drawHighQualitySpreadsheet(doc, margin, width, height, quality) {
        // Adjust detail level based on quality
        const detailLevel = quality === 'ultra' ? 1.5 : 
                           quality === 'high' ? 1.2 : 
                           quality === 'low' ? 0.8 : 1.0;
                           
        const columns = Math.floor((width / 20) * detailLevel);
        const rows = Math.floor((height / 10) * detailLevel);
        const colWidth = width / columns;
        const rowHeight = 10 / detailLevel;
        
        // Use higher quality drawing
        doc.setDrawColor(0);
        doc.setFillColor(240, 240, 240);
        doc.setLineWidth(quality === 'ultra' ? 0.1 : 0.2);
        
        // Header row - enhanced for quality
        for (let i = 0; i < columns; i++) {
            doc.rect(margin + (i * colWidth), margin, colWidth, rowHeight, 'FD');
            
            // Add column headers for some columns
            if (i < 26) { // Only for A-Z columns
                doc.setFontSize(quality === 'ultra' ? 9 : 8);
                doc.text(
                    `Col ${String.fromCharCode(65 + i)}`, 
                    margin + (i * colWidth) + (colWidth / 2), 
                    margin + (rowHeight / 2) + 2, 
                    { align: 'center' }
                );
            }
        }
        
        // Data rows - high quality with appropriate detail level
        for (let row = 0; row < rows - 1; row++) {
            for (let col = 0; col < columns; col++) {
                doc.rect(
                    margin + (col * colWidth), 
                    margin + rowHeight + (row * rowHeight), 
                    colWidth, 
                    rowHeight
                );
                
                // Only add cell labels to some cells to avoid clutter
                if (row < (quality === 'ultra' ? 30 : 10) && 
                    col < (quality === 'ultra' ? 15 : 10)) {
                    doc.setFontSize(quality === 'ultra' ? 7 : 6);
                    doc.text(
                        `${String.fromCharCode(65 + col)}${row+1}`, 
                        margin + (col * colWidth) + (colWidth / 2), 
                        margin + rowHeight + (row * rowHeight) + (rowHeight / 2) + 1, 
                        { align: 'center' }
                    );
                }
            }
        }
    }
    
    function drawHighQualityDocument(doc, margin, width, height, quality) {
        // Adjust line detail based on quality
        const lineDetail = quality === 'ultra' ? 1.8 : 
                          quality === 'high' ? 1.5 : 
                          quality === 'low' ? 0.7 : 1.0;
                          
        doc.setFillColor(240, 240, 240);
        
        // Title - enhanced rendering
        doc.setFontSize(quality === 'ultra' ? 18 : 16);
        if (quality === 'ultra' || quality === 'high') {
            doc.setTextRenderingMode('fill');
        }
        doc.setTextColor(50, 50, 50);
        doc.text('Document Content', width / 2, margin + 10, { align: 'center' });
        
        // Paragraph lines - higher density for better quality
        const lineSpacing = 4 / lineDetail;
        const startY = margin + 20;
        const lineCount = Math.floor((height - startY) / lineSpacing) * lineDetail;
        
        for (let i = 0; i < lineCount; i++) {
            let lineWidth;
            if (i % 15 === 0) {
                lineWidth = 0; // Paragraph breaks
            } else if (i % 15 === 1) {
                // Paragraph starts (indented)
                lineWidth = width * 0.1 + Math.random() * (width * 0.6);
            } else {
                // Regular lines - more realistic line lengths
                lineWidth = width * 0.3 + Math.random() * (width * 0.65);
            }
            
            if (lineWidth > 0) {
                doc.setLineWidth(quality === 'ultra' ? 0.1 : 0.2);
                doc.rect(
                    margin, 
                    startY + (i * lineSpacing), 
                    lineWidth, 
                    lineSpacing / (quality === 'ultra' ? 3 : 2), 
                    'F'
                );
            }
        }
    }
    
    function drawHighQualityPresentation(doc, margin, width, height, quality) {
        // Higher quality slide rendering
        doc.setDrawColor(200, 200, 200);
        doc.setFillColor(245, 245, 245);
        doc.setLineWidth(quality === 'ultra' ? 0.1 : 0.2);
        
        // Background
        doc.rect(0, 0, width, height, 'FD');
        
        // Title bar with enhanced quality
        doc.setFillColor(230, 230, 230);
        doc.rect(0, 0, width, height * 0.12, 'F');
        
        // Title text with better rendering
        doc.setFontSize(quality === 'ultra' ? 18 : 16);
        if (quality === 'ultra' || quality === 'high') {
            doc.setTextRenderingMode('fill');
        }
        doc.setTextColor(50, 50, 50);
        doc.text('Presentation Slide', width / 2, height * 0.06, { align: 'center' });
        
        // Content areas with enhanced styling
        doc.setFillColor(240, 240, 240);
        
        const contentMargin = width * 0.05;
        const contentTop = height * 0.15;
        const contentBottom = height * 0.85;
        const contentHeight = contentBottom - contentTop;
        
        // Left content box with shadow effect for high quality
        if (quality === 'ultra' || quality === 'high') {
            doc.setFillColor(235, 235, 235);
            doc.rect(contentMargin + 1, contentTop + 1, (width * 0.4), contentHeight * 0.7, 'F');
        }
        doc.setFillColor(240, 240, 240);
        doc.rect(contentMargin, contentTop, (width * 0.4), contentHeight * 0.7, 'F');
        
        // Right content box
        if (quality === 'ultra' || quality === 'high') {
            doc.setFillColor(235, 235, 235);
            doc.rect(width - contentMargin - (width * 0.4) + 1, contentTop + 1, (width * 0.4), contentHeight * 0.7, 'F');
        }
        doc.setFillColor(240, 240, 240);
        doc.rect(width - contentMargin - (width * 0.4), contentTop, (width * 0.4), contentHeight * 0.7, 'F');
        
        // Bottom content box
        if (quality === 'ultra' || quality === 'high') {
            doc.setFillColor(235, 235, 235);
            doc.rect(contentMargin + 1, contentBottom - (contentHeight * 0.2) + 1, width - (contentMargin * 2), contentHeight * 0.15, 'F');
        }
        doc.setFillColor(240, 240, 240);
        doc.rect(contentMargin, contentBottom - (contentHeight * 0.2), width - (contentMargin * 2), contentHeight * 0.15, 'F');
        
        // Add text labels with higher quality rendering
        doc.setFontSize(quality === 'ultra' ? 14 : 12);
        doc.text('Content Area', contentMargin + (width * 0.2), contentTop + (contentHeight * 0.35), { align: 'center' });
        doc.text('Content Area', width - contentMargin - (width * 0.2), contentTop + (contentHeight * 0.35), { align: 'center' });
        doc.text('Footer Content', width / 2, contentBottom - (contentHeight * 0.125), { align: 'center' });
        
        // For ultra quality, add some decorative elements
        if (quality === 'ultra') {
            // Add decorative elements
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.1);
            
            // Left box decorative lines
            for (let i = 0; i < 10; i++) {
                const lineY = contentTop + 20 + (i * 8);
                if (lineY < contentTop + contentHeight * 0.65) {
                    doc.line(
                        contentMargin + 10, 
                        lineY, 
                        contentMargin + (width * 0.4) - 10, 
                        lineY
                    );
                }
            }
            
            // Right box decorative elements (dots grid)
            for (let x = 0; x < 10; x++) {
                for (let y = 0; y < 10; y++) {
                    const dotX = width - contentMargin - (width * 0.4) + 20 + (x * 15);
                    const dotY = contentTop + 20 + (y * 15);
                    if (dotX < width - contentMargin - 10 && dotY < contentTop + contentHeight * 0.65) {
                        doc.circle(dotX, dotY, 0.5, 'F');
                    }
                }
            }
        }
    }

    // ===== Reset Functions =====
    convertAnotherBtn.addEventListener('click', resetAll);
    tryAgainBtn.addEventListener('click', resetAll);
    
    function resetAll() {
        resetFileSelection();
        convertBtn.classList.remove('hidden');
    }

    // Add some CSS for button highlighting
    const styleHighlight = document.createElement('style');
    styleHighlight.textContent = `
        .primary-button.action-button {
            background-color: #4a86e8;
            padding: 12px 24px;
            font-size: 16px;
            font-weight: 600;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        }
        
        .primary-button.action-button:hover {
            background-color: #3a76d8;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        
        .primary-button.download-button {
            background-color: #36a853;
            padding: 14px 28px;
            font-size: 16px;
            font-weight: 600;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        }
        
        .primary-button.download-button:hover {
            background-color: #2e9247;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
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
        
        .button-group {
            display: flex;
            gap: 15px;
            margin-top: 20px;
        }
        
        .secondary-button {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .primary-button i, .secondary-button i {
            margin-right: 6px;
        }
        
        /* New Choose File Button Styles */
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
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            border: 2px solid transparent;
        }
        
        .choose-file-btn:hover {
            background-color: #3a76d8;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        
        .choose-file-btn:active {
            transform: translateY(1px);
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        
        .choose-file-btn i {
            margin-right: 8px;
            font-size: 18px;
        }
        
        .upload-container {
            border: 2px dashed #ccc;
            border-radius: 8px;
            padding: 30px 20px;
            text-align: center;
            transition: all 0.3s ease;
            background-color:rgba(74, 134, 232, 0.05);
        }
        
        .upload-container.highlight {
            border-color: #4a86e8;
            background-color: #f0f7ff;
        }
        
        .upload-container i.fa-file-upload {
            font-size: 48px;
            color: #777;
            margin-bottom: 15px;
        }
    `;
    document.head.appendChild(styleHighlight);
}
