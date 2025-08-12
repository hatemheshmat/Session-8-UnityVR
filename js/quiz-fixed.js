/**
 * Quiz Functionality - Fixed Version
 * Handles quiz navigation and scoring
 */

// Initialize quiz when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if this is a quiz slide
    if (document.querySelector('.quiz-container')) {
        initializeQuiz();
    }
});

/**
 * Initialize quiz functionality
 */
function initializeQuiz() {
    // Get quiz elements
    const questions = document.querySelectorAll('.question-card');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const currentQuestionSpan = document.getElementById('currentQuestion');
    const totalQuestionsSpan = document.getElementById('totalQuestions');
    const quizNav = document.getElementById('quizNav');
    const results = document.getElementById('results');
    const scoreDisplay = document.getElementById('score');
    const progressFill = document.getElementById('progressFill');
    const feedback = document.getElementById('feedback');
    const restartBtn = document.getElementById('restartBtn');
    
    // Quiz state
    let currentQuestionIndex = 0;
    let score = 0;
    let answered = Array(questions.length).fill(false);
    let selectedOptions = Array(questions.length).fill(null);
    
    // Set total questions count
    if (totalQuestionsSpan) {
        totalQuestionsSpan.textContent = questions.length;
    }
    
    // Show first question
    showQuestion(0);
    
    // Add event listeners to option buttons
    document.querySelectorAll('.option-btn').forEach(button => {
        button.addEventListener('click', function() {
            const questionCard = this.closest('.question-card');
            const questionIndex = parseInt(questionCard.getAttribute('data-question-index'));
            
            // Only allow selection if not already answered
            if (!answered[questionIndex]) {
                // Remove selected class from all options in this question
                const options = questionCard.querySelectorAll('.option-btn');
                options.forEach(opt => opt.classList.remove('selected'));
                
                // Add selected class to clicked option
                this.classList.add('selected');
                
                // Store selected option
                selectedOptions[questionIndex] = this;
            }
        });
    });
    
    // Add event listeners to navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentQuestionIndex > 0) {
                showQuestion(currentQuestionIndex - 1);
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            const currentQuestion = questions[currentQuestionIndex];
            const selectedOption = selectedOptions[currentQuestionIndex];
            
            // If this is the last question and it's been answered, show results
            if (currentQuestionIndex === questions.length - 1 && selectedOption) {
                // Mark as answered
                answered[currentQuestionIndex] = true;
                
                // Check if correct
                if (selectedOption.classList.contains('correct')) {
                    score++;
                    selectedOption.classList.add('correct-selected');
                } else {
                    selectedOption.classList.add('incorrect-selected');
                    // Highlight the correct answer
                    currentQuestion.querySelector('.option-btn.correct').classList.add('correct-highlight');
                }
                
                // Show results
                showResults();
            } 
            // If current question has been answered, move to next question
            else if (selectedOption) {
                // Mark as answered
                answered[currentQuestionIndex] = true;
                
                // Check if correct
                if (selectedOption.classList.contains('correct')) {
                    score++;
                    selectedOption.classList.add('correct-selected');
                } else {
                    selectedOption.classList.add('incorrect-selected');
                    // Highlight the correct answer
                    currentQuestion.querySelector('.option-btn.correct').classList.add('correct-highlight');
                }
                
                // Move to next question after a short delay
                setTimeout(function() {
                    showQuestion(currentQuestionIndex + 1);
                }, 1000);
            } else {
                // Alert user to select an option
                alert('Please select an answer before proceeding.');
            }
        });
    }
    
    // Add event listener to restart button
    if (restartBtn) {
        restartBtn.addEventListener('click', function() {
            resetQuiz();
        });
    }
    
    /**
     * Show a specific question
     */
    function showQuestion(index) {
        // Hide all questions
        questions.forEach(q => {
            q.classList.add('hidden');
            q.classList.remove('active');
        });
        
        // Show the specified question
        if (index < questions.length) {
            questions[index].classList.remove('hidden');
            questions[index].classList.add('active');
            
            // Update current question index
            currentQuestionIndex = index;
            
            // Update question counter
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
                } else {
                    nextBtn.textContent = 'Next';
                }
            }
            
            // Hide results if visible
            if (results && !results.classList.contains('hidden')) {
                results.classList.add('hidden');
            }
        }
    }
    
    /**
     * Show quiz results
     */
    function showResults() {
        // Hide all questions
        questions.forEach(q => {
            q.classList.add('hidden');
            q.classList.remove('active');
        });
        
        // Show results
        if (results) {
            results.classList.remove('hidden');
            
            // Update score
            if (scoreDisplay) {
                scoreDisplay.textContent = `${score}/${questions.length}`;
            }
            
            // Update progress bar
            if (progressFill) {
                const percentage = (score / questions.length) * 100;
                progressFill.style.width = `${percentage}%`;
            }
            
            // Update feedback
            if (feedback) {
                if (score === questions.length) {
                    feedback.textContent = 'Perfect! You got all questions correct!';
                    feedback.className = 'feedback perfect';
                } else if (score >= questions.length * 0.7) {
                    feedback.textContent = 'Great job! You have a good understanding.';
                    feedback.className = 'feedback great';
                } else if (score >= questions.length * 0.5) {
                    feedback.textContent = 'Good effort! Review the topics you missed.';
                    feedback.className = 'feedback good';
                } else {
                    feedback.textContent = 'Keep practicing! Review the material and try again.';
                    feedback.className = 'feedback needs-work';
                }
            }
            
            // Hide navigation buttons
            if (quizNav) {
                quizNav.classList.add('hidden');
            }
        }
    }
    
    /**
     * Reset the quiz
     */
    function resetQuiz() {
        // Reset state
        currentQuestionIndex = 0;
        score = 0;
        answered = Array(questions.length).fill(false);
        selectedOptions = Array(questions.length).fill(null);
        
        // Reset option buttons
        document.querySelectorAll('.option-btn').forEach(button => {
            button.classList.remove('selected', 'correct-selected', 'incorrect-selected', 'correct-highlight');
        });
        
        // Show first question
        showQuestion(0);
        
        // Show navigation buttons
        if (quizNav) {
            quizNav.classList.remove('hidden');
        }
    }
}

