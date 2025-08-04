// Global variables
let pyodide = null;
let currentSeedSVG = null;
let currentKeySVG = null;
let currentQRData = null;

// Initialize Pyodide
async function initPyodide() {
    try {
        console.log('Loading Pyodide...');
        pyodide = await loadPyodide();
        
        // Load required Python packages
        await pyodide.loadPackage(['numpy']);
        
        // Load our Python modules
        await loadPythonModules();
        
        console.log('Pyodide loaded successfully!');
        document.getElementById('loading-indicator').style.display = 'none';
    } catch (error) {
        console.error('Failed to load Pyodide:', error);
        alert('Failed to load Python environment. Please refresh the page.');
    }
}

// Load Python modules
async function loadPythonModules() {
    // Core encryption functions
    const encryptionCode = `
LETTERS = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
]

def cypher(letter, shift_number):
    letter_position = LETTERS.index(letter.upper())
    new_position = (letter_position + shift_number) % len(LETTERS)
    return LETTERS[new_position]

def decypher(letter, shift_number):
    letter_position = LETTERS.index(letter.upper())
    new_position = (letter_position - shift_number) % len(LETTERS)
    return LETTERS[new_position]

def cypher_word(word, shift_numbers=[]):
    word_split = list(word)
    cypher_result = ""
    for i, v in enumerate(word_split):
        cypher_result += cypher(v, shift_numbers[i % len(shift_numbers)])
    return cypher_result

def decypher_word(word, shift_numbers=[]):
    word_split = list(word)
    cypher_result = ""
    for i, v in enumerate(word_split):
        cypher_result += decypher(v, shift_numbers[i % len(shift_numbers)])
    return cypher_result

def cypher_phrase(phrase, shift_numbers):
    words = phrase.split()
    cyphered_results = []
    for word in words:
        result = cypher_word(word, shift_numbers)
        cyphered_results.append(result)
    return cyphered_results

def decypher_phrase(encrypted_words, shift_numbers):
    decyphered_results = []
    for word in encrypted_words:
        result = decypher_word(word, shift_numbers)
        decyphered_results.append(result)
    return decyphered_results
`;

    // SVG generation functions
    const svgCode = `
def create_seed_svg(seed_words):
    svg_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
    <style>
        text {{ font-family: Arial, sans-serif; font-size: 18pt; }}
    </style>
    <rect x="10" y="10" width="200" height="{len(seed_words) * 31}" stroke-width="2" stroke="black" fill="none"/>
'''
    
    for i, word in enumerate(seed_words):
        svg_content += f'    <text x="20" y="{(i * 30) + 45}">{word}</text>'
    
    svg_content += '</svg>'
    return svg_content

def create_key_svg(shift_numbers, shape="rect"):
    doc_width = 800
    doc_height = 800
    
    svg_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg width="{doc_width}" height="{doc_height}" xmlns="http://www.w3.org/2000/svg">
'''
    
    for i, num_items in enumerate(shift_numbers):
        num_items_per_row = num_items
        for j in range(num_items_per_row):
            width = doc_width / num_items_per_row
            
            if shape == "rect":
                svg_content += f'    <rect x="{width * j}" y="{i * 40 + 20}" width="{width}" height="40" stroke-width="3" stroke="black" fill="none"/>'
            elif shape == "circle":
                svg_content += f'    <circle cx="{doc_width - (width * j + 20)}" cy="{i * 25 + 20}" r="10" stroke-width="3" stroke="black" fill="none"/>'
    
    svg_content += '</svg>'
    return svg_content
`;

    await pyodide.runPythonAsync(encryptionCode);
    await pyodide.runPythonAsync(svgCode);
}

// Tab switching
function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(tabName + '-tab').classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

function updateWordCount(text) {
    console.log('updateWordCount called with:', text);
    const trimmedText = text.trim();
    console.log('trimmedText:', trimmedText);
    
    // More robust whitespace splitting - handle all types of whitespace
    const splitResult = trimmedText.split(/\s+/);
    console.log('splitResult:', splitResult);
    
    // Alternative: split on any whitespace character
    const altSplitResult = trimmedText.split(/[\s\t\n\r]+/);
    console.log('altSplitResult:', altSplitResult);
    
    // Use the alternative split if the first one didn't work
    const words = splitResult.length === 1 && splitResult[0] === trimmedText 
        ? altSplitResult.filter(word => word.length > 0)
        : splitResult.filter(word => word.length > 0);
    
    console.log('filtered words:', words);
    console.log('words array length:', words.length);
    
    const wordCountElement = document.getElementById('word-count');
    if (wordCountElement) {
        wordCountElement.textContent = words.length;
        console.log('Updated word count to:', words.length);
    } else {
        console.log('ERROR: Could not find word-count element');
    }
}

// Form validation
function validateEncryptForm() {
    const seedPhrase = document.getElementById('seed-phrase').value.trim();
    const decryptionKey = document.getElementById('decryption-key').value.trim();
    
    if (!seedPhrase) {
        alert('Please enter a seed phrase.');
        return false;
    }
    
    const words = seedPhrase.split(/\s+/).filter(word => word.length > 0);
    if (words.length !== 24) {
        alert('Please enter exactly 24 seed words.');
        return false;
    }
    
    if (!decryptionKey) {
        alert('Please enter a decryption key.');
        return false;
    }
    
    const keyNumbers = decryptionKey.split(/\\s+/).map(num => parseInt(num));
    if (keyNumbers.some(num => isNaN(num) || num < 1 || num > 26)) {
        alert('Please enter valid numbers between 1 and 26 for the decryption key.');
        return false;
    }
    
    return true;
}

function validateDecryptForm() {
    const encryptedPhrase = document.getElementById('encrypted-phrase').value.trim();
    const decryptKey = document.getElementById('decrypt-key').value.trim();
    
    if (!encryptedPhrase) {
        alert('Please enter encrypted words.');
        return false;
    }
    
    if (!decryptKey) {
        alert('Please enter a decryption key.');
        return false;
    }
    
    return true;
}



// Display encryption results
function displayEncryptResults(encryptedWords, seedSVG, keySVG, originalPhrase) {
    // Store for download functions
    currentSeedSVG = seedSVG;
    currentKeySVG = keySVG;
    currentQRData = originalPhrase;
    
    // Display encrypted words
    document.getElementById('encrypted-words').textContent = encryptedWords.join(' ');
    
    // Display SVGs
    console.log('Seed SVG:', seedSVG);
    console.log('Key SVG:', keySVG);
    
    const seedContainer = document.getElementById('seed-svg-container');
    const keyContainer = document.getElementById('key-svg-container');
    
    if (seedContainer) {
        seedContainer.innerHTML = seedSVG;
        console.log('Seed SVG container updated');
    } else {
        console.error('Seed SVG container not found');
    }
    
    if (keyContainer) {
        keyContainer.innerHTML = keySVG;
        console.log('Key SVG container updated');
    } else {
        console.error('Key SVG container not found');
    }
    

    
    // Show results
    document.getElementById('encrypt-results').classList.remove('hidden');
}

// Display decryption results
function displayDecryptResults(decryptedWords) {
    document.getElementById('decrypted-words').textContent = decryptedWords.join('\\n');
    document.getElementById('decrypt-results').classList.remove('hidden');
}

// Generate QR code


// Download functions
function downloadEncryptedText() {
    const encryptedWords = document.getElementById('encrypted-words').textContent;
    downloadText(encryptedWords, 'encrypted-seed-phrase.txt');
}

function downloadDecryptedText() {
    const decryptedWords = document.getElementById('decrypted-words').textContent;
    downloadText(decryptedWords, 'decrypted-seed-phrase.txt');
}

function downloadText(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function downloadSVG(type) {
    let svgContent, filename;
    
    if (type === 'seed') {
        svgContent = currentSeedSVG;
        filename = 'encrypted-seed.svg';
    } else if (type === 'key') {
        svgContent = currentKeySVG;
        filename = 'decryption-key.svg';
    }
    
    if (!svgContent) {
        alert('No SVG content available. Please generate the wallet first.');
        return;
    }
    
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function downloadPNG(type) {
    let svgElement;
    
    if (type === 'seed') {
        svgElement = document.querySelector('#seed-svg-container svg');
    } else if (type === 'key') {
        svgElement = document.querySelector('#key-svg-container svg');
    }
    
    if (!svgElement) {
        alert('No SVG available. Please generate the wallet first.');
        return;
    }
    
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = type === 'seed' ? 'encrypted-seed.png' : 'decryption-key.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
}



// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - setting up basic functionality');
    
    // Set up word count tracking FIRST (before Pyodide)
    const seedPhraseInput = document.getElementById('seed-phrase');
    if (seedPhraseInput) {
        console.log('Setting up word count tracking');
        
        // Word count tracking
        seedPhraseInput.addEventListener('input', function() {
            console.log('Input event fired');
            updateWordCount(this.value);
        });
        
        // Handle paste events to normalize text
        seedPhraseInput.addEventListener('paste', function(e) {
            console.log('Paste event fired');
            // Let the paste happen, then normalize the text
                            setTimeout(() => {
                    const text = this.value;
                    // Normalize whitespace and newlines
                    const normalizedText = text.replace(/\s+/g, ' ').trim();
                    this.value = normalizedText;
                    updateWordCount(normalizedText);
                }, 10);
        });
        
        console.log('Word count tracking set up successfully');
    } else {
        console.log('ERROR: Could not find seed phrase input');
    }
    
    // Add loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-indicator';
    loadingDiv.innerHTML = '<div class="spinner"></div> Loading Python environment...';
    loadingDiv.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.8); color: white; padding: 20px; border-radius: 10px; z-index: 1000;';
    document.body.appendChild(loadingDiv);
    

    
    // Initialize Pyodide in background (non-blocking)
    console.log('Starting Pyodide initialization');
    initPyodide().catch(error => {
        console.error('Pyodide initialization failed:', error);
        // Hide loading indicator even if Pyodide fails
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    });
    
    // Set up form event listeners
    const encryptForm = document.getElementById('encrypt-form');
    if (encryptForm) {
        encryptForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!pyodide) {
                alert('Python environment not loaded. Please wait and try again.');
                return;
            }
            
            if (!validateEncryptForm()) {
                return;
            }
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner"></span> Processing...';
            submitBtn.disabled = true;
            
            try {
                const seedPhrase = document.getElementById('seed-phrase').value.trim();
                const decryptionKey = document.getElementById('decryption-key').value.trim();
                const keyStyle = document.getElementById('key-style').value;
                
                const words = seedPhrase.split(/\s+/).filter(word => word.length > 0);
                const shiftNumbers = decryptionKey.split(/\s+/).map(num => parseInt(num));
                
                // Encrypt the words
                const encryptedWords = await pyodide.runPythonAsync(`
cypher_phrase("${words.join(' ')}", ${JSON.stringify(shiftNumbers)})
`);
                
                // Generate SVGs
                const seedSVG = await pyodide.runPythonAsync(`
create_seed_svg(${JSON.stringify(encryptedWords)})
`);
                
                const keySVG = await pyodide.runPythonAsync(`
create_key_svg(${JSON.stringify(shiftNumbers)}, "${keyStyle}")
`);
                
                // Display results
                displayEncryptResults(encryptedWords, seedSVG, keySVG, words.join(' '));
                
            } catch (error) {
                console.error('Encryption error:', error);
                alert('An error occurred during encryption. Please check your input and try again.');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    const decryptForm = document.getElementById('decrypt-form');
    if (decryptForm) {
        decryptForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!pyodide) {
                alert('Python environment not loaded. Please wait and try again.');
                return;
            }
            
            if (!validateDecryptForm()) {
                return;
            }
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner"></span> Processing...';
            submitBtn.disabled = true;
            
            try {
                const encryptedPhrase = document.getElementById('encrypted-phrase').value.trim();
                const decryptKey = document.getElementById('decrypt-key').value.trim();
                
                const encryptedWords = encryptedPhrase.split(/\n/).filter(word => word.trim().length > 0);
                const shiftNumbers = decryptKey.split(/\s+/).map(num => parseInt(num));
                
                // Decrypt the words
                const decryptedWords = await pyodide.runPythonAsync(`
decypher_phrase(${JSON.stringify(encryptedWords)}, ${JSON.stringify(shiftNumbers)})
`);
                
                // Display results
                displayDecryptResults(decryptedWords);
                
            } catch (error) {
                console.error('Decryption error:', error);
                alert('An error occurred during decryption. Please check your input and try again.');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}); 