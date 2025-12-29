/**
 * CyberVault Main Application
 * Handles UI interactions, file processing, and encryption/decryption operations
 */

class CyberVaultApp {
    constructor() {
        this.cryptoUtils = new CryptoUtils();
        this.currentEncryptedData = null;
        this.currentDecryptedData = null;
        this.currentFileName = '';
        this.currentFileType = '';
        
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        // Show welcome animation, then main app
        setTimeout(() => {
            document.getElementById('welcome-screen').style.display = 'none';
            const mainApp = document.getElementById('main-app');
            mainApp.classList.remove('hidden');
            setTimeout(() => {
                mainApp.classList.add('show');
            }, 100);
        }, 2500);

        this.setupEventListeners();
        this.setupTabNavigation();
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // File input listeners
        document.getElementById('encrypt-file-input').addEventListener('change', (e) => {
            this.handleEncryptFileSelect(e);
        });

        document.getElementById('decrypt-file-input').addEventListener('change', (e) => {
            this.handleDecryptFileSelect(e);
        });

        // Password input listeners
        document.getElementById('encrypt-password').addEventListener('input', () => {
            this.updateEncryptButtonState();
        });

        document.getElementById('decrypt-password').addEventListener('input', () => {
            this.updateDecryptButtonState();
        });

        // Action button listeners
        document.getElementById('encrypt-btn').addEventListener('click', () => {
            this.handleEncrypt();
        });

        document.getElementById('decrypt-btn').addEventListener('click', () => {
            this.handleDecrypt();
        });

        // Download button listeners
        document.getElementById('download-encrypted').addEventListener('click', () => {
            this.downloadEncryptedFile();
        });

        document.getElementById('download-decrypted').addEventListener('click', () => {
            this.downloadDecryptedFile();
        });
    }

    /**
     * Setup tab navigation
     */
    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');

                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                // Add active class to clicked button and corresponding content
                button.classList.add('active');
                document.getElementById(`${targetTab}-tab`).classList.add('active');

                // Reset forms when switching tabs
                this.resetForms();
            });
        });
    }

    /**
     * Handle file selection for encryption
     */
    handleEncryptFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        const fileName = file.name;
        const fileNameSpan = document.getElementById('encrypt-file-name');

        // Validate file type
        if (!this.cryptoUtils.isSupportedFileType(fileName)) {
            this.showError('Unsupported file type. Please select a video or audio file.');
            fileNameSpan.textContent = 'No file selected';
            this.updateEncryptButtonState();
            return;
        }

        // Check file size (limit to 100MB for web browser)
        const maxSize = 100 * 1024 * 1024; // 100MB
        if (file.size > maxSize) {
            this.showError('File too large. Please select a file smaller than 100MB.');
            fileNameSpan.textContent = 'No file selected';
            this.updateEncryptButtonState();
            return;
        }

        fileNameSpan.textContent = `Selected: ${fileName} (${this.formatFileSize(file.size)})`;
        this.currentFileName = fileName;
        this.currentFileType = this.cryptoUtils.getFileExtension(fileName);
        this.updateEncryptButtonState();
    }

    /**
     * Handle file selection for decryption
     */
    handleDecryptFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        const fileName = file.name;
        const fileNameSpan = document.getElementById('decrypt-file-name');

        // Validate file type (should be .txt)
        if (!fileName.toLowerCase().endsWith('.txt')) {
            this.showError('Please select a .txt file containing encrypted data.');
            fileNameSpan.textContent = 'No file selected';
            this.updateDecryptButtonState();
            return;
        }

        fileNameSpan.textContent = `Selected: ${fileName}`;
        this.updateDecryptButtonState();
    }

    /**
     * Update encrypt button state
     */
    updateEncryptButtonState() {
        const fileInput = document.getElementById('encrypt-file-input');
        const passwordInput = document.getElementById('encrypt-password');
        const encryptBtn = document.getElementById('encrypt-btn');

        const hasFile = fileInput.files.length > 0 && this.currentFileName;
        const hasPassword = passwordInput.value.trim().length > 0;

        encryptBtn.disabled = !(hasFile && hasPassword);
    }

    /**
     * Update decrypt button state
     */
    updateDecryptButtonState() {
        const fileInput = document.getElementById('decrypt-file-input');
        const passwordInput = document.getElementById('decrypt-password');
        const decryptBtn = document.getElementById('decrypt-btn');

        const hasFile = fileInput.files.length > 0;
        const hasPassword = passwordInput.value.trim().length > 0;

        decryptBtn.disabled = !(hasFile && hasPassword);
    }

    /**
     * Handle encryption process
     */
    async handleEncrypt() {
        const fileInput = document.getElementById('encrypt-file-input');
        const passwordInput = document.getElementById('encrypt-password');
        const progressContainer = document.getElementById('encrypt-progress');
        const resultContainer = document.getElementById('encrypt-result');
        const encryptBtn = document.getElementById('encrypt-btn');

        const file = fileInput.files[0];
        const password = passwordInput.value.trim();

        if (!file || !password) {
            this.showError('Please select a file and enter a password.');
            return;
        }

        try {
            // Show progress
            encryptBtn.disabled = true;
            progressContainer.classList.remove('hidden');
            resultContainer.classList.add('hidden');

            // Read file as ArrayBuffer
            const fileData = await this.readFileAsArrayBuffer(file);

            // Encrypt the file
            const result = await this.cryptoUtils.encryptFile(
                fileData,
                password,
                (progress) => this.updateProgress('encrypt', progress)
            );

            if (result.success) {
                // Create encrypted text file content
                const encryptedTextContent = this.cryptoUtils.createEncryptedTextFile(
                    result.encryptedData,
                    this.currentFileName,
                    this.currentFileType
                );

                this.currentEncryptedData = encryptedTextContent;
                
                // Show success
                progressContainer.classList.add('hidden');
                resultContainer.classList.remove('hidden');
                
                this.showSuccess('File encrypted successfully!');
            } else {
                throw new Error(result.error);
            }

        } catch (error) {
            console.error('Encryption failed:', error);
            this.showError('Encryption failed: ' + error.message);
            progressContainer.classList.add('hidden');
        } finally {
            encryptBtn.disabled = false;
        }
    }

    /**
     * Handle decryption process
     */
    async handleDecrypt() {
        const fileInput = document.getElementById('decrypt-file-input');
        const passwordInput = document.getElementById('decrypt-password');
        const progressContainer = document.getElementById('decrypt-progress');
        const resultContainer = document.getElementById('decrypt-result');
        const decryptBtn = document.getElementById('decrypt-btn');

        const file = fileInput.files[0];
        const password = passwordInput.value.trim();

        if (!file || !password) {
            this.showError('Please select an encrypted text file and enter the password.');
            return;
        }

        try {
            // Show progress
            decryptBtn.disabled = true;
            progressContainer.classList.remove('hidden');
            resultContainer.classList.add('hidden');

            // Read file as text
            const textContent = await this.readFileAsText(file);

            // Parse encrypted file
            const parseResult = this.cryptoUtils.parseEncryptedTextFile(textContent);
            if (!parseResult.success) {
                throw new Error(parseResult.error);
            }

            // Decrypt the file
            const result = await this.cryptoUtils.decryptFile(
                parseResult.encryptedData,
                password,
                (progress) => this.updateProgress('decrypt', progress)
            );

            if (result.success) {
                this.currentDecryptedData = result.decryptedData;
                this.currentFileName = parseResult.originalFileName;
                this.currentFileType = parseResult.fileType;
                
                // Show success
                progressContainer.classList.add('hidden');
                resultContainer.classList.remove('hidden');
                
                this.showSuccess('File decrypted successfully!');
            } else {
                throw new Error(result.error);
            }

        } catch (error) {
            console.error('Decryption failed:', error);
            this.showError('Decryption failed: ' + error.message);
            progressContainer.classList.add('hidden');
        } finally {
            decryptBtn.disabled = false;
        }
    }

    /**
     * Download encrypted file
     */
    downloadEncryptedFile() {
        if (!this.currentEncryptedData) {
            this.showError('No encrypted data available for download.');
            return;
        }

        const fileName = this.currentFileName.replace(/\.[^/.]+$/, '') + '_encrypted.txt';
        this.downloadTextFile(this.currentEncryptedData, fileName);
    }

    /**
     * Download decrypted file
     */
    downloadDecryptedFile() {
        if (!this.currentDecryptedData) {
            this.showError('No decrypted data available for download.');
            return;
        }

        const mimeType = this.cryptoUtils.getMimeType(this.currentFileType);
        this.downloadBinaryFile(this.currentDecryptedData, this.currentFileName, mimeType);
    }

    /**
     * Update progress bar
     */
    updateProgress(type, progress) {
        const progressFill = document.querySelector(`#${type}-progress .progress-fill`);
        const progressText = document.querySelector(`#${type}-progress .progress-text`);
        
        progressFill.style.width = `${progress}%`;
        
        let operation = type === 'encrypt' ? 'Encrypting' : 'Decrypting';
        progressText.textContent = `${operation}... ${progress}%`;
    }

    /**
     * Reset all forms
     */
    resetForms() {
        // Reset encrypt form
        document.getElementById('encrypt-file-input').value = '';
        document.getElementById('encrypt-password').value = '';
        document.getElementById('encrypt-file-name').textContent = 'No file selected';
        document.getElementById('encrypt-progress').classList.add('hidden');
        document.getElementById('encrypt-result').classList.add('hidden');

        // Reset decrypt form
        document.getElementById('decrypt-file-input').value = '';
        document.getElementById('decrypt-password').value = '';
        document.getElementById('decrypt-file-name').textContent = 'No file selected';
        document.getElementById('decrypt-progress').classList.add('hidden');
        document.getElementById('decrypt-result').classList.add('hidden');

        // Update button states
        this.updateEncryptButtonState();
        this.updateDecryptButtonState();

        // Clear current data
        this.currentEncryptedData = null;
        this.currentDecryptedData = null;
        this.currentFileName = '';
        this.currentFileType = '';
    }

    /**
     * Read file as ArrayBuffer
     */
    readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsArrayBuffer(file);
        });
    }

    /**
     * Read file as text
     */
    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    /**
     * Download text file
     */
    downloadTextFile(content, fileName) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Download binary file
     */
    downloadBinaryFile(arrayBuffer, fileName, mimeType) {
        const blob = new Blob([arrayBuffer], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Format file size for display
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Show error message
     */
    showError(message) {
        alert('❌ Error: ' + message);
    }

    /**
     * Show success message
     */
    showSuccess(message) {
        // You could implement a better notification system here
        console.log('✅ Success: ' + message);
    }
}

/**
 * Toggle password visibility
 */
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CyberVaultApp();
});
