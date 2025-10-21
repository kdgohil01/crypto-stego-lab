# Media Encryption & Decryption Tool

A comprehensive desktop application for encrypting video and audio files into secure text format and decrypting them back to their original form.

## Features

🔒 **Encryption**: Convert video/audio files to encrypted text format
🔓 **Decryption**: Restore original media files from encrypted text
📚 **Learning Tab**: Step-by-step guide for using the application
🛡️ **Security**: AES-256 encryption with PBKDF2 key derivation
🎨 **Modern UI**: Clean, intuitive interface with progress indicators

## Supported Formats

### Video Files
- MP4, AVI, MOV, MKV, WMV

### Audio Files
- MP3, WAV, M4A, FLAC, AAC

## Installation

1. Make sure you have Python 3.7+ installed
2. Install required dependencies:
```bash
pip install cryptography==41.0.7
```

3. Run the application:
```bash
python main.py
```

## How It Works

1. **Encryption Process**:
   - Select your media file
   - Enter a secure password
   - File is encrypted using AES-256 encryption
   - Encrypted data is encoded to Base64 text format
   - Text file is saved with metadata

2. **Decryption Process**:
   - Select the encrypted text file
   - Enter the same password used for encryption
   - Text is decoded and decrypted
   - Original media file is restored

## Security Features

- **AES-256 Encryption**: Military-grade encryption standard
- **PBKDF2 Key Derivation**: Secure password-based key generation with 100,000 iterations
- **Salt-based Security**: Each encryption uses a unique random salt
- **Base64 Encoding**: Safe text representation of binary data

## Usage Tips

- Use strong, unique passwords
- Keep encrypted text files safe
- Don't modify encrypted text files manually
- Ensure sufficient disk space for large files
- Test with small files first

## File Structure

```
windsurf-project/
├── main.py              # Main application file
├── requirements.txt     # Python dependencies
└── README.md           # This file
```

## Troubleshooting

- **File not found**: Ensure file path is correct
- **Wrong password**: Check password spelling and case sensitivity
- **Slow processing**: Large files take more time - be patient
- **Corrupted output**: Don't edit encrypted text files manually

## License

This project is open source and available under the MIT License.
