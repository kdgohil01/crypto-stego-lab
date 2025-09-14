# Crypto-Stego-Lab: Advanced Security & Data Processing Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF.svg)](https://vitejs.dev/)

A comprehensive web-based platform for exploring and implementing advanced cryptographic techniques, steganography methods, and multilayered security systems. Built with modern web technologies and designed for both educational and practical security applications.

## 🚨 Problem Statement

In today's digital landscape, traditional single-layer encryption methods are increasingly vulnerable to sophisticated attacks. Organizations and individuals need robust, multilayered security solutions that combine multiple protection mechanisms. Our platform addresses this critical need by providing:

- **Educational Gap**: Limited accessible tools for learning advanced cryptographic concepts
- **Security Vulnerability**: Over-reliance on single encryption methods
- **Implementation Complexity**: Difficulty in combining multiple security layers effectively
- **Practical Application**: Need for real-world security tools with modern interfaces

## 🛡️ Threat Model

### Attack Vectors Addressed

| Threat Level | Attack Type | Our Defense | Implementation |
|--------------|-------------|-------------|----------------|
| **Basic** | Plaintext Interception | AES-256 Encryption | Web Crypto API |
| **Intermediate** | Key Compromise | RSA-2048 Key Exchange | Asymmetric Cryptography |
| **Advanced** | Traffic Analysis | Steganographic Hiding | LSB Pixel Manipulation |
| **Expert** | Multi-vector Attack | Multilayered Security | Guardian Layer System |

### Security Assumptions
- Client-side processing ensures data privacy
- Modern browser security features are trusted
- Users maintain secure key management practices
- Educational use with optional production deployment

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun runtime
- Modern web browser with Web Crypto API support
- Git for version control

### Installation & Setup

```bash
# Clone the repository
git clone [https://github.com/your-org/crypto-stego-lab.git](https://github.com/your-org/crypto-stego-lab.git)
cd crypto-stego-lab

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev

# Build for production
npm run build
# or
bun run build

# Preview production build
npm run preview
# or
bun preview
```
## Environment Configuration
Create a .env file in the root directory:
```
# Firebase Configuration (Optional - for authentication)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id

# Application Settings
VITE_APP_NAME=Crypto-Stego-Lab
VITE_APP_VERSION=1.0.0
```
## 📸 Demo Screenshots
### Main Dashboard
DashboardModern, responsive interface with dark/light theme support

### Guardian Layer - Multilayered Security
Guardian LayerMilitary-grade security with AES-256 → RSA-2048 → Steganography pipeline

### Cryptography Tools
CryptographyComprehensive encryption tools with real-time processing

### Steganography Interface
SteganographyAdvanced hiding techniques with visual feedback

## 🏗️ Architecture & Implementation
Technology Stack
```
Frontend Framework: React 18.3.1 + TypeScript 5.8.3
Build Tool: Vite 5.4.19
UI Framework: Tailwind CSS + shadcn/ui
Cryptography: Web Crypto API + CryptoJS
Authentication: Firebase Auth (optional)
State Management: React Hooks + Context API
Routing: React Router DOM 6.30.1
```
## Security Implementation Details
### AES-256-GCM Encryption
```
// PBKDF2 key derivation with 100,000 iterations
const key = await crypto.subtle.deriveKey(
  { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
  baseKey,
  { name: "AES-GCM", length: 256 },
  false,
  ["encrypt", "decrypt"]
);
```
### RSA-2048 Key Generation
```
// Generate RSA key pair with OAEP padding
const keyPair = await crypto.subtle.generateKey(
  { name: "RSA-OAEP", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
  true,
  ["encrypt", "decrypt"]
);
```
### LSB Steganography Algorithm
```
// Hide data in least significant bits of image pixels
const hideData = (imageData: ImageData, data: string) => {
  const binary = data.split('').map(char => 
    char.charCodeAt(0).toString(2).padStart(8, '0')
  ).join('');
  
  for (let i = 0; i < binary.length; i++) {
    const pixelIndex = i * 4; // RGBA format
    imageData.data[pixelIndex] = (imageData.data[pixelIndex] & 0xFE) | parseInt(binary[i]);
  }
};
```
## 📁 Project Structure
```
crypto-stego-lab/
├── docs/                          # Documentation and threat models
│   ├── threat-model.md            # Comprehensive threat analysis
│   ├── design-decisions.md        # Architecture decisions
│   ├── deployment-plan.md         # Production deployment guide
│   └── screenshots/               # Demo screenshots
├── src/                           # Source code
│   ├── components/                # React components
│   │   ├── crypto/               # Cryptography tools
│   │   ├── stego/                # Steganography tools
│   │   ├── multilayered/         # Guardian Layer system
│   │   ├── data/                 # Data processing tools
│   │   └── ui/                   # Reusable UI components
│   ├── pages/                    # Main application pages
│   ├── lib/                      # Utility libraries
│   ├── hooks/                    # Custom React hooks
│   └── contexts/                 # React context providers
├── tests/                         # Test suites
│   ├── sample-payloads/          # Test data and samples
│   ├── extraction-tests/         # Automated extraction tests
│   └── unit-tests/               # Component unit tests
├── benchmarks/                    # Performance analysis
│   ├── encryption-benchmarks.csv # Crypto performance data
│   ├── steganography-analysis.csv# Stego capacity analysis
│   └── plots/                    # Performance visualization
├── public/                       # Static assets
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```
## 🧪 Testing & Validation
Automated Test Suite
```
# Run all tests
npm test

# Run specific test categories
npm run test:crypto          # Cryptography tests
npm run test:stego           # Steganography tests
npm run test:integration     # Integration tests
npm run test:performance     # Performance benchmarks
```
sample test payload matrix

| Payload Type  | Size       | Description              | Test Coverage         |
| ------------- | ---------- | ------------------------ | --------------------- |
| Text Messages | 1KB–100KB  | Various text formats     | Encryption/Decryption |
| Binary Data   | 1MB–10MB   | Images, documents        | Steganographic hiding |
| Unicode Text  | 500B–50KB  | International characters | Character encoding    |
| Large Files   | 10MB–100MB | Stress testing           | Performance limits    |

## 🔒 Security Comparison
Cryptography vs Steganography vs Multilayered Security

| Aspect         | Cryptography          | Steganography              | Multilayered Security    | Data Processing       |
| -------------- | --------------------- | -------------------------- | ------------------------ | --------------------- |
| Purpose        | Make data unreadable  | Hide data existence        | Triple-layer protection  | Transform data format |
| Visibility     | Obviously encrypted   | Appears normal             | Completely invisible     | Encoded but visible   |
| Detection      | Easy to detect        | Hard to detect             | Nearly impossible        | Easily detectable     |
| Strength       | Mathematical security | Security through obscurity | Military-grade combined  | Format compatibility  |
| Best Use       | Secure communication  | Covert communication       | Maximum security needs   | Data transmission     |
| Algorithms     | AES-256, RSA-2048     | LSB, DCT, Spread Spectrum  | Combined pipeline        | URL, Base64, Hashing  |
| Key Management | Critical requirement  | Optional                   | Multi-level keys         | No keys required      |
| Performance    | Fast                  | Medium                     | Slower (combined)        | Very fast             |
| Capacity       | Unlimited             | Limited by cover           | Limited by weakest layer | Unlimited             |

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

MIT License

Copyright (c) 2024 Crypto-Stego-Lab Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Team Members

| Name                 | Role                                | Expertise                                   | Contact                                |
| -------------------- | ----------------------------------- | ------------------------------------------- | -------------------------------------- |
| Hem Patel            | Backend Developer & Integration Architect | Cryptography, Full-stack Development        | [![GitHub](https://img.shields.io/badge/GitHub-hemathens-181717?logo=github)](https://github.com/hemathens)|
| Karmadeepsinh Gohil  | Stegnography Expert | Algorithm Implementation, Security Analysis |[![GitHub](https://img.shields.io/badge/GitHub-kdgohil01-181717?logo=github)](https://github.com/kdgohil)|
| Harshdeepsinh Jadeja | Cryptography Specialist | Image Processing, Covert Communications |[![GitHub](https://img.shields.io/badge/GitHub-harshdeepsinhjadeja27-181717?logo=github)](https://github.com/harshdeepsinhjadeja27)|
| Meet Sanchaniya      | UI/UX Developer & Testing Lead | Frontend Development, User Experience       | [GitHub](#)|

## 🤝 Contributing
We welcome contributions! Please see our Contributing Guidelines for details on:

-Code style and standards
-Pull request process
-Issue reporting
-Security vulnerability disclosure
-Development setup

## 📞 Support & Contact
-Issues: GitHub Issues
-Discussions: GitHub Discussions
-Security: security@crypto-stego-lab.com
-Documentation: docs.crypto-stego-lab.com

## 🔗 Related Projects
Guardian Layer Standalone
Crypto Utils Library
Steganography Toolkit

⚠️ Disclaimer: This software is provided for educational and research purposes. Users are responsible for compliance with applicable laws and regulations regarding cryptography and data security in their jurisdiction.

🔒 Security Notice: While this implementation uses industry-standard algorithms, it is designed primarily for educational purposes. For production use, please conduct thorough security audits and consider additional security measures.
