/**
 * Tool Request Handler
 * 
 * This script handles the request tool modal and form submissions 
 * for tool requests and saves them to the submissions folder.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Modal elements
    const requestBtn = document.getElementById('request-tool-btn');
    const requestModal = document.getElementById('request-modal');
    const closeModalBtn = document.getElementById('close-modal');
    
    // Form elements
    const requestForm = document.getElementById('tool-request-form');
    const requestSuccess = document.getElementById('request-success');
    const requestAnother = document.getElementById('request-another');
    
    // Show modal when clicking the request button
    if (requestBtn && requestModal) {
        requestBtn.addEventListener('click', () => {
            requestModal.classList.remove('hidden');
            requestModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    }
    
    // Close modal
    if (closeModalBtn && requestModal) {
        closeModalBtn.addEventListener('click', closeModal);
        
        // Also close when clicking outside the modal content
        requestModal.addEventListener('click', (e) => {
            if (e.target === requestModal) {
                closeModal();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !requestModal.classList.contains('hidden')) {
                closeModal();
            }
        });
    }
    
    function closeModal() {
        requestModal.classList.remove('active');
        setTimeout(() => {
            requestModal.classList.add('hidden');
            document.body.style.overflow = ''; // Allow scrolling again
        }, 300); // Wait for transition to finish
    }
    
    // Handle form submission
    if (requestForm) {
        requestForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('request-name').value;
            const email = document.getElementById('request-email').value;
            const toolName = document.getElementById('tool-name').value;
            const toolDescription = document.getElementById('tool-description').value;
            
            // Create submission object
            const submission = {
                name,
                email,
                toolName,
                toolDescription,
                timestamp: new Date().toISOString()
            };
            
            try {
                // In a real application, you would send this to a server
                // For this demo, we'll simulate saving to "submissions" folder
                await saveSubmission(submission);
                
                // Show success message
                requestForm.classList.add('hidden');
                requestSuccess.classList.remove('hidden');
                
                // Clear form
                requestForm.reset();
                
            } catch (error) {
                console.error('Error submitting tool request:', error);
                alert('There was an error submitting your request. Please try again.');
            }
        });
    }
    
    // Allow requesting another tool
    if (requestAnother) {
        requestAnother.addEventListener('click', () => {
            requestSuccess.classList.add('hidden');
            requestForm.classList.remove('hidden');
        });
    }
    
    /**
     * Save the submission to the submissions folder
     * This is a placeholder function - in a real application,
     * this would be an API call to your backend
     */
    async function saveSubmission(submission) {
        // In a real application, this would be an API call to your server:
        // return fetch('/api/tool-requests', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(submission)
        // });
        
        // For this demo, we're simulating a successful save
        return new Promise((resolve) => {
            // Log the submission to console (for demo purposes)
            console.log('Tool request submitted:', submission);
            
            // Simulate network delay
            setTimeout(() => {
                // This would typically write to "submissions/[timestamp]_[tool-name].json"
                localStorage.setItem(
                    `tool-request-${Date.now()}`, 
                    JSON.stringify(submission)
                );
                resolve();
            }, 1000);
        });
    }
});
