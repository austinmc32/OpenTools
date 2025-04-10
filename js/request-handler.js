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
    const copyEmailBtn = document.getElementById('copy-email-btn');

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

    // Copy email to clipboard
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            navigator.clipboard.writeText('austinmc35@gmail.com').then(() => {
                alert('Email copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy email:', err);
            });
        });
    }
});
