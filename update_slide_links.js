// Script to update slide links in the presentation
const fs = require('fs');
const path = require('path');

// Get all HTML files in the directory
const directoryPath = __dirname;
const files = fs.readdirSync(directoryPath).filter(file => file.endsWith('.html'));

// Sort files to ensure correct order
const slideFiles = files.filter(file => file.startsWith('slide_') || file === 'index.html');
slideFiles.sort((a, b) => {
    // Make sure index.html comes first
    if (a === 'index.html') return -1;
    if (b === 'index.html') return 1;
    
    // Extract slide numbers for sorting
    const numA = parseInt(a.match(/slide_(\d+)/)?.[1] || '0');
    const numB = parseInt(b.match(/slide_(\d+)/)?.[1] || '0');
    return numA - numB;
});

console.log('Found slide files:', slideFiles);

// Update slide links in each file
slideFiles.forEach((file, index) => {
    const filePath = path.join(directoryPath, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Determine previous and next slide
    const prevSlide = index > 0 ? slideFiles[index - 1] : slideFiles[slideFiles.length - 1];
    const nextSlide = index < slideFiles.length - 1 ? slideFiles[index + 1] : slideFiles[0];
    
    // Update total slide count
    content = content.replace(/id="totalSlides">(\d+)<\/span>/g, `id="totalSlides">${slideFiles.length}</span>`);
    
    // Update current slide number
    content = content.replace(/id="currentSlideNum">(\d+)<\/span>/g, `id="currentSlideNum">${index + 1}</span>`);
    
    // Update progress bar
    content = content.replace(/id="slideProgress" style="width: .*?%"/g, 
                             `id="slideProgress" style="width: ${((index + 1) / slideFiles.length * 100).toFixed(1)}%"`);
    
    // Add navigation script if it doesn't exist
    if (!content.includes('// Navigation script')) {
        const navigationScript = `
    <!-- Navigation script -->
    <script>
        // Navigation script
        document.getElementById('prevSlideBtn').addEventListener('click', function() {
            window.location.href = '${prevSlide}';
        });
        
        document.getElementById('nextSlideBtn').addEventListener('click', function() {
            window.location.href = '${nextSlide}';
        });
        
        document.getElementById('firstSlideBtn').addEventListener('click', function() {
            window.location.href = '${slideFiles[0]}';
        });
        
        document.getElementById('lastSlideBtn').addEventListener('click', function() {
            window.location.href = '${slideFiles[slideFiles.length - 1]}';
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
                window.location.href = '${nextSlide}';
            } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                window.location.href = '${prevSlide}';
            } else if (e.key === 'Home') {
                window.location.href = '${slideFiles[0]}';
            } else if (e.key === 'End') {
                window.location.href = '${slideFiles[slideFiles.length - 1]}';
            }
        });
    </script>`;
        
        // Insert navigation script before the closing body tag
        content = content.replace('</body>', `${navigationScript}\n</body>`);
    } else {
        // Update existing navigation script
        content = content.replace(/window\.location\.href = '.*?';(\s*\/\/ Previous slide)/g, 
                                `window.location.href = '${prevSlide}';$1`);
        content = content.replace(/window\.location\.href = '.*?';(\s*\/\/ Next slide)/g, 
                                `window.location.href = '${nextSlide}';$1`);
        content = content.replace(/window\.location\.href = '.*?';(\s*\/\/ First slide)/g, 
                                `window.location.href = '${slideFiles[0]}';$1`);
        content = content.replace(/window\.location\.href = '.*?';(\s*\/\/ Last slide)/g, 
                                `window.location.href = '${slideFiles[slideFiles.length - 1]}';$1`);
    }
    
    // Update dropdown menu links
    const menuLinks = `
                    <a href="index.html">Home</a>
                    <a href="slide_00_cover.html">Cover</a>
                    <a href="slide_00_agenda.html">Agenda</a>
                    <a href="slide_15_break.html">Break</a>
                    <a href="slide_34_thank_you.html">Thank You</a>`;
    
    content = content.replace(/<div class="footer-dropdown-content">[\s\S]*?<\/div>/m, 
                             `<div class="footer-dropdown-content">${menuLinks}\n                </div>`);
    
    // Write updated content back to file
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
});

console.log('All slide links updated successfully!');

