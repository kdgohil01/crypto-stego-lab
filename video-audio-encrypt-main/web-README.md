# CyberVault Web - Media Encryption Suite

A modern web-based application for encrypting video and audio files into secure text format and decrypting them back to their original form using military-grade AES-256 encryption.

## 🌟 Features

- **🔒 Encryption**: Convert video/audio files to encrypted text format
- **🔓 Decryption**: Restore original media files from encrypted text
- **📚 Learning Tab**: Interactive step-by-step guide
- **🛡️ Security**: AES-256-GCM encryption with PBKDF2 key derivation (100,000 iterations)
- **🎨 Modern UI**: Responsive dark theme with animations
- **📱 Cross-Platform**: Works on any device with a modern web browser
- **🚀 No Installation**: Run directly in your browser

## 🎯 Supported Formats

### Video Files
- MP4, AVI, MOV, MKV, WMV

### Audio Files
- MP3, WAV, M4A, FLAC, AAC

## 🚀 Quick Start

### Option 1: Local Setup
1. Download all files to a folder:
   - `index.html`
   - `styles.css`
   - `crypto-utils.js`
   - `app.js`

2. Open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge)

3. Start encrypting your media files!

### Option 2: Web Server (Recommended)
For better performance and security, serve the files through a web server:

```bash
# Using Python (if installed)
python -m http.server 8000

# Using Node.js (if installed)
npx http-server

# Then open http://localhost:8000 in your browser
```

## 📖 How to Use

### Encrypting Files
1. Click on the **Encrypt** tab
2. Click "Select Media File" and choose your video/audio file
3. Enter a strong password (remember it!)
4. Click "Encrypt to Text"
5. Wait for the process to complete
6. Download your encrypted text file

### Decrypting Files
1. Click on the **Decrypt** tab
2. Click "Select Encrypted Text File" and choose your .txt file
3. Enter the same password used for encryption
4. Click "Decrypt to Media"
5. Wait for the process to complete
6. Download your restored original file

## 🔐 Security Features

- **AES-256-GCM Encryption**: Military-grade encryption standard
- **PBKDF2 Key Derivation**: Secure password-based key generation with 100,000 iterations
- **Random Salt & IV**: Each encryption uses unique random values for maximum security
- **Base64 Encoding**: Safe text representation of binary data
- **Client-Side Processing**: All encryption/decryption happens in your browser - files never leave your device

## 🌐 Browser Compatibility

### Fully Supported
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

### Requirements
- Web Crypto API support
- File API support
- Modern JavaScript (ES6+)

## ⚠️ Important Notes

### File Size Limits
- Maximum file size: 100MB (browser limitation)
- For larger files, use the Python desktop version

### Password Security
- Use strong, unique passwords
- Store passwords securely
- **Lost passwords cannot be recovered!**

### File Management
- Keep encrypted text files safe
- Don't edit encrypted text files manually
- Original files are not modified during encryption

## 🔧 Technical Details

### Architecture
- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Encryption**: Web Crypto API (SubtleCrypto)
- **No Backend**: Fully client-side application
- **No Dependencies**: No external libraries required

### File Structure
```
cybervault-web/
├── index.html          # Main application interface
├── styles.css          # Modern dark theme styling
├── crypto-utils.js     # Cryptographic utilities
├── app.js             # Main application logic
└── web-README.md      # This documentation
```

### Encryption Process
1. File is read as ArrayBuffer
2. Random salt and IV are generated
3. Password is derived using PBKDF2 (100,000 iterations)
4. File data is encrypted using AES-256-GCM
5. Salt + IV + encrypted data are combined
6. Result is encoded to Base64 text format
7. Metadata header is added to create the final text file

### Decryption Process
1. Encrypted text file is parsed
2. Metadata and encrypted data are extracted
3. Salt and IV are extracted from the data
4. Password is derived using the same PBKDF2 process
5. Data is decrypted using AES-256-GCM
6. Original file is restored and made available for download

## 🆚 Comparison with Python Version

| Feature | Web Version | Python Version |
|---------|-------------|----------------|
| **Installation** | None required | Python + dependencies |
| **Platform** | Any modern browser | Windows/Mac/Linux |
| **File Size Limit** | 100MB | No practical limit |
| **Performance** | Good for small-medium files | Excellent for all sizes |
| **Security** | Same AES-256 encryption | Same AES-256 encryption |
| **UI** | Modern web interface | Desktop GUI |
| **Portability** | Extremely portable | Requires Python runtime |

## 🛠️ Troubleshooting

### Common Issues

**"File too large" error**
- Solution: Use files smaller than 100MB or use the Python desktop version

**"Unsupported file type" error**
- Solution: Ensure your file is one of the supported formats (MP4, AVI, MOV, MKV, WMV, MP3, WAV, M4A, FLAC, AAC)

**"Invalid password" error**
- Solution: Check password spelling and case sensitivity

**Browser compatibility issues**
- Solution: Use a modern browser (Chrome 60+, Firefox 55+, Safari 11+, Edge 79+)

**Slow performance**
- Solution: Use a local web server instead of opening the file directly

### Performance Tips
1. Use a local web server for better performance
2. Close other browser tabs to free up memory
3. Test with smaller files first
4. Ensure stable internet connection (for loading external resources)

## 🔒 Privacy & Security

- **No Data Collection**: No analytics, tracking, or data collection
- **Client-Side Only**: All processing happens in your browser
- **No Network Transmission**: Files never leave your device
- **Open Source**: All code is visible and auditable
- **No External Dependencies**: No third-party libraries or services

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve CyberVault Web.

---

**Happy Encrypting! 🚀**

*Secure your media files with confidence using CyberVault Web - the modern, browser-based encryption solution.*
