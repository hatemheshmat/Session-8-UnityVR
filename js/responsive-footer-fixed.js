/**
 * Responsive Footer JavaScript - Fixed Version
 * Adds interactive functionality to the presentation footer
 * Fixes fullscreen persistence and quiz navigation issues
 */

// Store fullscreen state in localStorage
let isFullscreen = localStorage.getItem('isFullscreen') === 'true';
let isDarkTheme = localStorage.getItem('isDarkTheme') === 'true';

// Initialize the footer when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeFooter();
    
    // Apply saved theme if any
    if (isDarkTheme) {
        document.body.classList.add('dark-theme');
        const themeButton = document.getElementById('themeBtn');
        if (themeButton && themeButton.querySelector('i')) {
            themeButton.querySelector('i').className = 'fas fa-sun';
        }
    }
    
    // Apply saved fullscreen state if any
    if (isFullscreen) {
        requestFullscreen();
    }
    
    // Initialize quiz functionality if on a quiz slide
    initializeQuiz();
});

/**
 * Initialize the footer functionality
 */
function initializeFooter() {
    // Get current slide information
    const currentSlideInfo = getCurrentSlideInfo();
    
    // Update progress bar
    updateProgressBar(currentSlideInfo.current, currentSlideInfo.total);
    
    // Set up button event listeners
    setupButtonListeners(currentSlideInfo);
    
    // Set up keyboard navigation
    setupKeyboardNavigation(currentSlideInfo);
    
    // Initialize fullscreen functionality
    setupFullscreenMode();
    
    // Initialize theme toggle
    setupThemeToggle();
    
    // Initialize slide notes
    setupSlideNotes();
}

/**
 * Get information about the current slide
 */
function getCurrentSlideInfo() {
    // Extract current slide number and total from the page
    const slideNumberElement = document.querySelector('.slide-counter');
    let current = 1;
    let total = 45;
    
    if (slideNumberElement) {
        const slideText = slideNumberElement.textContent;
        const match = slideText.match(/(\d+)\s*\/\s*(\d+)/i);
        if (match) {
            current = parseInt(match[1]);
            total = parseInt(match[2]);
        }
    }
    
    // Determine previous and next slide paths
    const currentPath = window.location.pathname;
    const filename = currentPath.split('/').pop();
    
    // Get all slides in order
    const allSlides = getAllSlides();
    const currentIndex = allSlides.indexOf(filename);
    
    const prevSlide = currentIndex > 0 ? allSlides[currentIndex - 1] : null;
    const nextSlide = currentIndex < allSlides.length - 1 ? allSlides[currentIndex + 1] : null;
    
    return {
        current,
        total,
        currentIndex,
        prevSlide,
        nextSlide,
        allSlides
    };
}

/**
 * Get all slides in order
 */
function getAllSlides() {
    return [
        'index.html',
        'slide_00_agenda.html',
        'slide_00_cover.html',
        'slide_01_basketball_review.html',
        'slide_02_throw_velocity.html',
        'slide_03_hoop_trigger.html',
        'slide_04_score_manager.html',
        'slide_05_sound_effects.html',
        'slide_06_ball_reset.html',
        'slide_07_basketball_quiz.html',
        'slide_08_tictactoe_intro.html',
        'slide_09_arrays_csharp.html',
        'slide_10_game_state.html',
        'slide_11_game_board.html',
        'slide_12_win_detection.html',
        'slide_13_game_ui.html',
        'slide_14_new_game.html',
        'slide_15_break.html',
        'slide_16_tictactoe_quiz.html',
        'slide_17_projects_comparison.html',
        'slide_31_assignment.html',
        'slide_32_assignment.html',
        'slide_33_resources.html',
        'slide_34_thank_you.html'
    ];
}

/**
 * Update the progress bar based on current slide position
 */
function updateProgressBar(current, total) {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        const percentage = (current / total) * 100;
        progressBar.style.width = `${percentage}%`;
    }
}

/**
 * Set up event listeners for footer buttons
 */
function setupButtonListeners(slideInfo) {
    // Previous slide button
    const prevButton = document.getElementById('prevSlideBtn');
    if (prevButton) {
        if (slideInfo.prevSlide) {
            prevButton.addEventListener('click', function() {
                navigateToSlide(slideInfo.prevSlide);
            });
        } else {
            prevButton.disabled = true;
        }
    }
    
    // Next slide button
    const nextButton = document.getElementById('nextSlideBtn');
    if (nextButton) {
        if (slideInfo.nextSlide) {
            nextButton.addEventListener('click', function() {
                // Check if we're on a quiz slide and handle quiz navigation
                if (isQuizSlide() && !shouldNavigateToNextSlide()) {
                    handleQuizNavigation();
                } else {
                    navigateToSlide(slideInfo.nextSlide);
                }
            });
        } else {
            nextButton.disabled = true;
        }
    }
    
    // First slide button
    const firstButton = document.getElementById('firstSlideBtn');
    if (firstButton) {
        firstButton.addEventListener('click', function() {
            navigateToSlide(slideInfo.allSlides[0]);
        });
    }
    
    // Last slide button
    const lastButton = document.getElementById('lastSlideBtn');
    if (lastButton) {
        lastButton.addEventListener('click', function() {
            navigateToSlide(slideInfo.allSlides[slideInfo.allSlides.length - 1]);
        });
    }
    
    // Home button
    const homeButton = document.getElementById('homeBtn');
    if (homeButton) {
        homeButton.addEventListener('click', function() {
            navigateToSlide('index.html');
        });
    }
}

/**
 * Navigate to a slide while preserving fullscreen and theme state
 */
function navigateToSlide(slidePath) {
    // Store current states before navigation
    localStorage.setItem('isFullscreen', isFullscreen);
    localStorage.setItem('isDarkTheme', document.body.classList.contains('dark-theme'));
    
    // Navigate to the slide
    window.location.href = slidePath;
}

/**
 * Set up keyboard navigation
 */
function setupKeyboardNavigation(slideInfo) {
    document.addEventListener('keydown', function(e) {
        // Right arrow or Space or Enter for next slide
        if ((e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter')) {
            // Check if we're on a quiz slide and handle quiz navigation
            if (isQuizSlide() && !shouldNavigateToNextSlide()) {
                handleQuizNavigation();
            } else if (slideInfo.nextSlide) {
                navigateToSlide(slideInfo.nextSlide);
            }
        }
        // Left arrow for previous slide
        else if (e.key === 'ArrowLeft' && slideInfo.prevSlide) {
            navigateToSlide(slideInfo.prevSlide);
        }
        // Home key for first slide
        else if (e.key === 'Home') {
            navigateToSlide(slideInfo.allSlides[0]);
        }
        // End key for last slide
        else if (e.key === 'End') {
            navigateToSlide(slideInfo.allSlides[slideInfo.allSlides.length - 1]);
        }
        // F key for fullscreen toggle
        else if (e.key === 'f' || e.key === 'F') {
            toggleFullscreen();
        }
    });
}

/**
 * Set up fullscreen mode
 */
function setupFullscreenMode() {
    const fullscreenButton = document.getElementById('fullscreenBtn');
    if (fullscreenButton) {
        fullscreenButton.addEventListener('click', toggleFullscreen);
    }
    
    // Listen for fullscreen change events
    document.addEventListener('fullscreenchange', function() {
        isFullscreen = !!document.fullscreenElement;
        localStorage.setItem('isFullscreen', isFullscreen);
        
        // Toggle fullscreen class on body
        if (isFullscreen) {
            document.body.classList.add('fullscreen-mode');
        } else {
            document.body.classList.remove('fullscreen-mode');
        }
    });
}

/**
 * Toggle fullscreen mode
 */
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        requestFullscreen();
    } else {
        exitFullscreen();
    }
}

/**
 * Request fullscreen mode
 */
function requestFullscreen() {
    document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
    });
    
    isFullscreen = true;
    localStorage.setItem('isFullscreen', true);
    document.body.classList.add('fullscreen-mode');
}

/**
 * Exit fullscreen mode
 */
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    }
    
    isFullscreen = false;
    localStorage.setItem('isFullscreen', false);
    document.body.classList.remove('fullscreen-mode');
}

/**
 * Set up theme toggle functionality
 */
function setupThemeToggle() {
    const themeButton = document.getElementById('themeBtn');
    if (themeButton) {
        themeButton.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            isDarkTheme = document.body.classList.contains('dark-theme');
            localStorage.setItem('isDarkTheme', isDarkTheme);
            
            // Update button icon
            const icon = themeButton.querySelector('i');
            if (icon) {
                if (isDarkTheme) {
                    icon.className = 'fas fa-sun';
                } else {
                    icon.className = 'fas fa-moon';
                }
            }
        });
    }
}

/**
 * Set up slide notes functionality
 */
function setupSlideNotes() {
    const notesButton = document.getElementById('notesBtn');
    if (notesButton) {
        notesButton.addEventListener('click', function() {
            const notesPanel = document.getElementById('notesPanel');
            if (notesPanel) {
                notesPanel.classList.toggle('show');
                
                // Update button icon
                const icon = notesButton.querySelector('i');
                if (notesPanel.classList.contains('show')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-sticky-note';
                }
            }
        });
    }
}

/**
 * Create slide notes panel if it doesn't exist
 */
function createNotesPanel() {
    if (!document.getElementById('notesPanel')) {
        const notesPanel = document.createElement('div');
        notesPanel.id = 'notesPanel';
        notesPanel.className = 'notes-panel';
        
        const notesPanelHeader = document.createElement('div');
        notesPanelHeader.className = 'notes-panel-header';
        notesPanelHeader.innerHTML = '<h3>Slide Notes</h3>';
        
        const notesPanelContent = document.createElement('div');
        notesPanelContent.className = 'notes-panel-content';
        notesPanelContent.innerHTML = '<textarea placeholder="Add your notes here..."></textarea>';
        
        notesPanel.appendChild(notesPanelHeader);
        notesPanel.appendChild(notesPanelContent);
        
        document.body.appendChild(notesPanel);
    }
}

/**
 * Check if current slide is a quiz slide
 */
function isQuizSlide() {
    // Check if this is a quiz slide by looking for quiz-specific elements
    return document.querySelector('.quiz-container') !== null;
}

/**
 * Check if we should navigate to the next slide
 * Returns true if we're on the last question or results page
 */
function shouldNavigateToNextSlide() {
    // If we're showing results or on the last question and it's answered, navigate to next slide
    const resultsVisible = document.getElementById('results') && 
                          !document.getElementById('results').classList.contains('hidden');
    
    // Get the current question number
    const currentQuestionSpan = document.getElementById('currentQuestion');
    const totalQuestions = document.querySelectorAll('.question-card').length;
    
    if (resultsVisible) {
        return true;
    }
    
    if (currentQuestionSpan) {
        const currentQuestion = parseInt(currentQuestionSpan.textContent);
        // If we're on the last question and it's been answered
        if (currentQuestion === totalQuestions) {
            const lastQuestionCard = document.getElementById(`question${totalQuestions}`);
            const selectedOption = lastQuestionCard.querySelector('.option-btn.selected');
            if (selectedOption) {
                // If the last question has been answered, check if we've shown results
                return document.getElementById('results') && 
                      !document.getElementById('results').classList.contains('hidden');
            }
        }
    }
    
    return false;
}

/**
 * Handle quiz navigation
 */
function handleQuizNavigation() {
    // Find the next/submit button in the quiz
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
        // Simulate a click on the quiz's next button
        nextBtn.click();
    }
}

/**
 * Initialize quiz functionality
 */
function initializeQuiz() {
    if (!isQuizSlide()) return;
    
    const questions = document.querySelectorAll('.question-card');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const currentQuestionSpan = document.getElementById('currentQuestion');
    const quizNav = document.getElementById('quizNav');
    const results = document.getElementById('results');
    const scoreDisplay = document.getElementById('score');
    const progressFill = document.getElementById('progressFill');
    const feedback = document.getElementById('feedback');
    const restartBtn = document.getElementById('restartBtn');
    
    let currentQuestionIndex = 0;
    let score = 0;
    let answered = [false, false, false];
    
    // Initialize option buttons
    document.querySelectorAll('.option-btn').forEach(button => {
        button.addEventListener('click', function() {
            const questionIndex = parseInt(this.closest('.question-card').id.replace('question', '')) - 1;
            
            // Only allow selection if not already answered
            if (!answered[questionIndex]) {
                // Remove selected class from all options in this question
                const options = this.closest('.options-container').querySelectorAll('.option-btn');
                options.forEach(opt => opt.classList.remove('selected'));
                
                // Add selected class to clicked option
                this.classList.add('selected');
            }
        });
    });
    
    // Navigation functions
    function showQuestion(index) {
        questions.forEach((q, i) => {
            if (i === index) {
                q.classList.remove('hidden');
                q.classList.add('active');
            } else {
                q.classList.add('hidden');
                q.classList.remove('active');
            }
        });
        
        currentQuestionIndex = index;
        if (currentQuestionSpan) {
            currentQuestionSpan.textContent = index + 1;
        }
        
        // Update button states
        if (prevBtn) {
            prevBtn.disabled = index === 0;
        }
        
        if (nextBtn) {
            if (index === questions.length - 1) {
                nextBtn.textContent = 'Submit';
                nextBtn.classList.remove('next-btn');
                nextBtn.classList.add('submit-btn');
            } else {
                nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right ml-2"></i>';
                nextBtn.classList.add('next-btn');
                nextBtn.classList.remove('submit-btn');
            }
        }
    }
    
    function checkAnswer(questionIndex) {
        if (answered[questionIndex]) return;
        
        const questionCard = document.getElementById(`question${questionIndex + 1}`);
        const selectedOption = questionCard.querySelector('.option-btn.selected');
        
        if (!selectedOption) return;
        
        const isCorrect = selectedOption.getAttribute('data-correct') === 'true';
        
        if (isCorrect) {
            selectedOption.classList.add('correct');
            selectedOption.innerHTML += '<i class="fas fa-check feedback-icon text-green-500"></i>';
            score++;
        } else {
            selectedOption.classList.add('incorrect');
            selectedOption.innerHTML += '<i class="fas fa-times feedback-icon text-red-500"></i>';
            
            // Highlight the correct answer
            questionCard.querySelectorAll('.option-btn').forEach(option => {
                if (option.getAttribute('data-correct') === 'true') {
                    option.classList.add('correct');
                    option.innerHTML += '<i class="fas fa-check feedback-icon text-green-500"></i>';
                }
            });
        }
        
        answered[questionIndex] = true;
    }
    
    function showResults() {
        questions.forEach(q => {
            q.classList.add('hidden');
            q.classList.remove('active');
        });
        
        if (results) {
            results.classList.remove('hidden');
            
            if (scoreDisplay) {
                scoreDisplay.textContent = score;
            }
            
            if (progressFill) {
                progressFill.style.width = `${(score / questions.length) * 100}%`;
            }
            
            if (feedback) {
                if (score === questions.length) {
                    feedback.innerHTML = '<div class="text-green-500 font-semibold"><i class="fas fa-trophy mr-2"></i>Perfect! You\'ve mastered these concepts.</div>';
                } else if (score >= questions.length / 2) {
                    feedback.innerHTML = '<div class="text-blue-500 font-semibold"><i class="fas fa-thumbs-up mr-2"></i>Good job! You\'re on the right track.</div>';
                } else {
                    feedback.innerHTML = '<div class="text-yellow-500 font-semibold"><i class="fas fa-book mr-2"></i>Keep learning! Review the material and try again.</div>';
                }
            }
            
            if (quizNav) {
                quizNav.classList.add('hidden');
            }
        }
    }
    
    function restartQuiz() {
        score = 0;
        answered = [false, false, false];
        currentQuestionIndex = 0;
        
        // Reset all options
        document.querySelectorAll('.option-btn').forEach(option => {
            option.classList.remove('selected', 'correct', 'incorrect');
            option.innerHTML = option.innerHTML.replace(/<i class="fas fa-[^"]+[^<]+<\/i>/, '');
        });
        
        // Hide results
        if (results) {
            results.classList.add('hidden');
        }
        
        // Show quiz navigation
        if (quizNav) {
            quizNav.classList.remove('hidden');
        }
        
        // Show first question
        showQuestion(0);
    }
    
    // Set up event listeners for quiz navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentQuestionIndex > 0) {
                showQuestion(currentQuestionIndex - 1);
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            checkAnswer(currentQuestionIndex);
            
            if (currentQuestionIndex < questions.length - 1) {
                showQuestion(currentQuestionIndex + 1);
            } else {
                showResults();
            }
        });
    }
    
    if (restartBtn) {
        restartBtn.addEventListener('click', restartQuiz);
    }
    
    // Initialize the first question
    showQuestion(0);
}

