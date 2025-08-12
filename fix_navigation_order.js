// Script to fix the correct navigation order
const fs = require('fs');
const path = require('path');

// Define the correct slide order
const correctOrder = [
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

console.log('Fixing navigation order for', correctOrder.length, 'slides');

// Update navigation for each file
correctOrder.forEach((file, index) => {
    const filePath = path.join(__dirname, file);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
        console.log(`Warning: ${file} does not exist, skipping...`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Determine previous and next slide
    const prevSlide = index > 0 ? correctOrder[index - 1] : correctOrder[correctOrder.length - 1];
    const nextSlide = index < correctOrder.length - 1 ? correctOrder[index + 1] : correctOrder[0];
    
    // Update total slide count
    content = content.replace(/id="totalSlides">(\d+)<\/span>/g, `id="totalSlides">${correctOrder.length}</span>`);
    
    // Update current slide number
    content = content.replace(/id="currentSlideNum">(\d+)<\/span>/g, `id="currentSlideNum">${index + 1}</span>`);
    
    // Update progress bar
    content = content.replace(/id="slideProgress"[^>]*style="width: [^"]*"/g, 
                             `id="slideProgress" style="width: ${((index + 1) / correctOrder.length * 100).toFixed(1)}%"`);
    
    // Update navigation script if it exists
    if (content.includes('// Navigation script')) {
        // Replace existing navigation script
        const navigationScript = `
        // Navigation script
        document.getElementById('prevSlideBtn').addEventListener('click', function() {
            window.location.href = '${prevSlide}';
        });
        
        document.getElementById('nextSlideBtn').addEventListener('click', function() {
            window.location.href = '${nextSlide}';
        });
        
        document.getElementById('firstSlideBtn').addEventListener('click', function() {
            window.location.href = '${correctOrder[0]}';
        });
        
        document.getElementById('lastSlideBtn').addEventListener('click', function() {
            window.location.href = '${correctOrder[correctOrder.length - 1]}';
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
                window.location.href = '${nextSlide}';
            } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                window.location.href = '${prevSlide}';
            } else if (e.key === 'Home') {
                window.location.href = '${correctOrder[0]}';
            } else if (e.key === 'End') {
                window.location.href = '${correctOrder[correctOrder.length - 1]}';
            }
        });`;
        
        // Replace the navigation script section
        content = content.replace(/\/\/ Navigation script[\s\S]*?(?=<\/script>)/m, navigationScript);
    }
    
    // Write updated content back to file
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file} - prev: ${prevSlide}, next: ${nextSlide}`);
});

console.log('Navigation order fixed successfully!');

