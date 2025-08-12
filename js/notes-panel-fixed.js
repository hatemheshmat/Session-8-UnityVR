/**
 * Notes Panel Functionality - Fixed Version
 * Handles slide notes functionality with proper local storage
 */

// Initialize notes when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create notes panel if it doesn't exist
    createNotesPanel();
    
    // Set up notes functionality
    setupNotesPanel();
    
    // Load saved notes for current slide
    loadNotes();
});

/**
 * Create the notes panel if it doesn't exist
 */
function createNotesPanel() {
    if (!document.getElementById('notesPanel')) {
        // Create the notes panel container
        const notesPanel = document.createElement('div');
        notesPanel.id = 'notesPanel';
        notesPanel.className = 'notes-panel';
        
        // Create the header with title and close button
        const notesPanelHeader = document.createElement('div');
        notesPanelHeader.className = 'notes-panel-header';
        notesPanelHeader.innerHTML = '<h3>Slide Notes</h3><button id="closeNotesBtn" class="close-btn"><i class="fas fa-times"></i></button>';
        
        // Create the content area with textarea
        const notesPanelContent = document.createElement('div');
        notesPanelContent.className = 'notes-panel-content';
        
        // Get current slide ID for unique identification
        const slideId = getCurrentSlideId();
        
        // Create textarea with unique ID based on slide
        const textarea = document.createElement('textarea');
        textarea.id = 'slideNotes';
        textarea.placeholder = 'Add your notes for this slide here...';
        textarea.setAttribute('data-slide-id', slideId);
        
        // Add textarea to content area
        notesPanelContent.appendChild(textarea);
        
        // Add save button
        const saveButton = document.createElement('button');
        saveButton.id = 'saveNotesBtn';
        saveButton.className = 'save-notes-btn';
        saveButton.innerHTML = '<i class="fas fa-save"></i> Save Notes';
        notesPanelContent.appendChild(saveButton);
        
        // Assemble the panel
        notesPanel.appendChild(notesPanelHeader);
        notesPanel.appendChild(notesPanelContent);
        
        // Add to the document
        document.body.appendChild(notesPanel);
    }
}

/**
 * Set up the notes panel functionality
 */
function setupNotesPanel() {
    // Toggle notes panel visibility
    const notesButton = document.getElementById('notesBtn');
    if (notesButton) {
        notesButton.addEventListener('click', function() {
            const notesPanel = document.getElementById('notesPanel');
            if (notesPanel) {
                notesPanel.classList.toggle('show');
                
                // Update button icon
                const icon = notesButton.querySelector('i');
                if (icon) {
                    if (notesPanel.classList.contains('show')) {
                        icon.className = 'fas fa-times';
                    } else {
                        icon.className = 'fas fa-sticky-note';
                    }
                }
            }
        });
    }
    
    // Close button functionality
    const closeButton = document.getElementById('closeNotesBtn');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            const notesPanel = document.getElementById('notesPanel');
            if (notesPanel) {
                notesPanel.classList.remove('show');
                
                // Update notes button icon
                const notesButton = document.getElementById('notesBtn');
                if (notesButton) {
                    const icon = notesButton.querySelector('i');
                    if (icon) {
                        icon.className = 'fas fa-sticky-note';
                    }
                }
            }
        });
    }
    
    // Auto-save notes when textarea changes
    const textarea = document.getElementById('slideNotes');
    if (textarea) {
        textarea.addEventListener('input', debounce(function() {
            saveNotes();
        }, 500));
    }
    
    // Save button functionality
    const saveButton = document.getElementById('saveNotesBtn');
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            saveNotes();
            
            // Show save confirmation
            const saveConfirmation = document.createElement('div');
            saveConfirmation.className = 'save-confirmation';
            saveConfirmation.textContent = 'Notes saved!';
            document.body.appendChild(saveConfirmation);
            
            // Remove confirmation after a delay
            setTimeout(function() {
                saveConfirmation.classList.add('fade-out');
                setTimeout(function() {
                    document.body.removeChild(saveConfirmation);
                }, 500);
            }, 1500);
        });
    }
}

/**
 * Save notes to localStorage
 */
function saveNotes() {
    const textarea = document.getElementById('slideNotes');
    if (textarea) {
        const slideId = getCurrentSlideId();
        const notes = textarea.value;
        
        // Get existing notes object or create new one
        let allNotes = JSON.parse(localStorage.getItem('slideNotes') || '{}');
        
        // Save notes for this slide
        allNotes[slideId] = notes;
        
        // Save back to localStorage
        localStorage.setItem('slideNotes', JSON.stringify(allNotes));
        
        console.log(`Notes saved for slide: ${slideId}`);
    }
}

/**
 * Load notes from localStorage
 */
function loadNotes() {
    const textarea = document.getElementById('slideNotes');
    if (textarea) {
        const slideId = getCurrentSlideId();
        
        // Get existing notes object
        let allNotes = JSON.parse(localStorage.getItem('slideNotes') || '{}');
        
        // Load notes for this slide if they exist
        if (allNotes[slideId]) {
            textarea.value = allNotes[slideId];
            console.log(`Notes loaded for slide: ${slideId}`);
        }
    }
}

/**
 * Get current slide ID for unique identification
 */
function getCurrentSlideId() {
    // Extract filename from path
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    
    // Remove extension
    return filename.replace('.html', '');
}

/**
 * Debounce function to limit how often a function is called
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, wait);
    };
}

