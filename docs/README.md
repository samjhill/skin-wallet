# Skin Wallet Web Interface

This directory contains the web interface for the Skin Wallet generator.

## Files

- `index.html` - Main web interface
- `styles.css` - Styling and responsive design
- `app.js` - JavaScript logic and Pyodide integration
- `test.html` - Test page for debugging

## Features

### 🔒 Encryption
- Input 24-word seed phrase
- Choose custom decryption key (numbers 1-26)
- Generate encrypted output
- Create visual art for tattoos

### 🔓 Decryption
- Input encrypted words
- Provide decryption key
- Recover original seed phrase

### 🎨 Visual Outputs
- **SVG/PNG generation** for tattoo designs
- **QR code creation** for easy sharing
- **Multiple download formats** (SVG, PNG, text)

### 🔐 Security
- **Client-side processing** - no data sent to servers
- **Pyodide integration** - runs Python code in browser
- **Local storage only** - your data stays private

## Technical Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern, responsive styling
- **JavaScript ES6+** - Modern JavaScript features
- **Pyodide** - Python in the browser
- **QRCode.js** - QR code generation

## Browser Compatibility

- ✅ Chrome/Chromium (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ Internet Explorer (not supported)

## Development

### Local Testing
```bash
cd docs
python3 -m http.server 8000
# Visit http://localhost:8000
```

### Testing
Visit `http://localhost:8000/test.html` for diagnostic tests.

### Build Process
The main build script is in the root directory:
```bash
./build.sh
```

## Deployment

This directory is automatically deployed to GitHub Pages via GitHub Actions when changes are pushed to the main branch.

## Security Notes

⚠️ **Important Disclaimers:**

1. This is for **educational purposes only**
2. The Vigenère cipher is **not cryptographically secure**
3. **Do not use** for actual cryptocurrency storage
4. All processing happens **locally in your browser**
5. No data is sent to any external servers

## Troubleshooting

### Pyodide Loading Issues
- Check internet connection (Pyodide loads from CDN)
- Try refreshing the page
- Check browser console for errors

### QR Code Issues
- Ensure QRCode.js library is loaded
- Check browser console for errors

### SVG Generation Issues
- Verify Python code is loaded in Pyodide
- Check input validation
- Review browser console for errors

## Contributing

1. Make changes to the web interface files
2. Test locally using the build script
3. Push to main branch for automatic deployment
4. GitHub Actions will deploy to GitHub Pages

## License

Same as the main project - for educational purposes only. 