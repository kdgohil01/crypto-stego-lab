/**
 * CyberVault Cryptographic Utilities
 * Web-based implementation of AES-256 encryption with PBKDF2 key derivation
 */

class CryptoUtils {
    constructor() {
        this.ITERATIONS = 100000; // PBKDF2 iterations (same as Python version)
        this.KEY_LENGTH = 32; // 256 bits for AES-256
        this.IV_LENGTH = 16; // 128 bits for AES IV
        this.SALT_LENGTH = 16; // 128 bits for salt
    }

    /**
     * Generate a random salt
     * @returns {Uint8Array} Random salt
     */
    generateSalt() {
        return crypto.getRandomValues(new Uint8Array(this.SALT_LENGTH));
    }

    /**
     * Generate a random IV
     * @returns {Uint8Array} Random IV
     */
    generateIV() {
        return crypto.getRandomValues(new Uint8Array(this.IV_LENGTH));
    }

    /**
     * Derive key from password using PBKDF2
     * @param {string} password - User password
     * @param {Uint8Array} salt - Salt for key derivation
     * @returns {Promise<CryptoKey>} Derived key
     */
    async deriveKey(password, salt) {
        const encoder = new TextEncoder();
        const passwordBuffer = encoder.encode(password);

        // Import password as key material
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            passwordBuffer,
            { name: 'PBKDF2' },
            false,
            ['deriveKey']
        );

        // Derive the actual encryption key
        return await crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: this.ITERATIONS,
                hash: 'SHA-256'
            },
            keyMaterial,
            {
                name: 'AES-GCM',
                length: this.KEY_LENGTH * 8 // Convert to bits
            },
            false,
            ['encrypt', 'decrypt']
        );
    }

    /**
     * Encrypt file data
     * @param {ArrayBuffer} fileData - File data to encrypt
     * @param {string} password - Encryption password
     * @param {Function} progressCallback - Progress callback function
     * @returns {Promise<Object>} Encrypted data with metadata
     */
    async encryptFile(fileData, password, progressCallback = null) {
        try {
            if (progressCallback) progressCallback(10);

            // Generate salt and IV
            const salt = this.generateSalt();
            const iv = this.generateIV();

            if (progressCallback) progressCallback(20);

            // Derive key from password
            const key = await this.deriveKey(password, salt);

            if (progressCallback) progressCallback(40);

            // Encrypt the file data
            const encryptedData = await crypto.subtle.encrypt(
                {
                    name: 'AES-GCM',
                    iv: iv
                },
                key,
                fileData
            );

            if (progressCallback) progressCallback(80);

            // Combine salt, IV, and encrypted data
            const combinedData = new Uint8Array(
                this.SALT_LENGTH + this.IV_LENGTH + encryptedData.byteLength
            );
            
            combinedData.set(salt, 0);
            combinedData.set(iv, this.SALT_LENGTH);
            combinedData.set(new Uint8Array(encryptedData), this.SALT_LENGTH + this.IV_LENGTH);

            // Convert to Base64 for text representation
            const base64Data = this.arrayBufferToBase64(combinedData);

            if (progressCallback) progressCallback(100);

            return {
                success: true,
                encryptedData: base64Data,
                salt: this.arrayBufferToBase64(salt),
                iv: this.arrayBufferToBase64(iv)
            };

        } catch (error) {
            console.error('Encryption error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Decrypt file data
     * @param {string} encryptedBase64 - Base64 encoded encrypted data
     * @param {string} password - Decryption password
     * @param {Function} progressCallback - Progress callback function
     * @returns {Promise<Object>} Decrypted data
     */
    async decryptFile(encryptedBase64, password, progressCallback = null) {
        try {
            if (progressCallback) progressCallback(10);

            // Convert Base64 back to ArrayBuffer
            const combinedData = this.base64ToArrayBuffer(encryptedBase64);

            if (progressCallback) progressCallback(20);

            // Extract salt, IV, and encrypted data
            const salt = combinedData.slice(0, this.SALT_LENGTH);
            const iv = combinedData.slice(this.SALT_LENGTH, this.SALT_LENGTH + this.IV_LENGTH);
            const encryptedData = combinedData.slice(this.SALT_LENGTH + this.IV_LENGTH);

            if (progressCallback) progressCallback(40);

            // Derive key from password
            const key = await this.deriveKey(password, salt);

            if (progressCallback) progressCallback(60);

            // Decrypt the data
            const decryptedData = await crypto.subtle.decrypt(
                {
                    name: 'AES-GCM',
                    iv: iv
                },
                key,
                encryptedData
            );

            if (progressCallback) progressCallback(100);

            return {
                success: true,
                decryptedData: decryptedData
            };

        } catch (error) {
            console.error('Decryption error:', error);
            return {
                success: false,
                error: error.message === 'OperationError' ? 'Invalid password or corrupted data' : error.message
            };
        }
    }

    /**
     * Convert ArrayBuffer to Base64 string
     * @param {ArrayBuffer|Uint8Array} buffer - Buffer to convert
     * @returns {string} Base64 string
     */
    arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    /**
     * Convert Base64 string to ArrayBuffer
     * @param {string} base64 - Base64 string
     * @returns {Uint8Array} Array buffer
     */
    base64ToArrayBuffer(base64) {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
    }

    /**
     * Create encrypted text file content with metadata
     * @param {string} encryptedData - Base64 encrypted data
     * @param {string} originalFileName - Original file name
     * @param {string} fileType - File type/extension
     * @returns {string} Formatted encrypted text content
     */
    createEncryptedTextFile(encryptedData, originalFileName, fileType) {
        const timestamp = new Date().toISOString();
        const header = `# CyberVault Encrypted Media File
# Generated: ${timestamp}
# Original File: ${originalFileName}
# File Type: ${fileType}
# Encryption: AES-256-GCM with PBKDF2 (100,000 iterations)
# 
# WARNING: Do not modify this file manually!
# Use CyberVault to decrypt this file back to its original format.
#
# ===== ENCRYPTED DATA BEGINS BELOW =====

`;
        return header + encryptedData;
    }

    /**
     * Parse encrypted text file and extract data
     * @param {string} textContent - Content of encrypted text file
     * @returns {Object} Parsed data
     */
    parseEncryptedTextFile(textContent) {
        try {
            // Find the data section (after the header)
            const dataStartMarker = '# ===== ENCRYPTED DATA BEGINS BELOW =====';
            const dataStartIndex = textContent.indexOf(dataStartMarker);
            
            if (dataStartIndex === -1) {
                throw new Error('Invalid encrypted file format');
            }

            // Extract the encrypted data (everything after the marker and newlines)
            const encryptedData = textContent
                .substring(dataStartIndex + dataStartMarker.length)
                .trim();

            // Extract metadata from header
            const lines = textContent.split('\n');
            let originalFileName = 'decrypted_file';
            let fileType = '';

            for (const line of lines) {
                if (line.startsWith('# Original File:')) {
                    originalFileName = line.replace('# Original File:', '').trim();
                } else if (line.startsWith('# File Type:')) {
                    fileType = line.replace('# File Type:', '').trim();
                }
            }

            return {
                success: true,
                encryptedData,
                originalFileName,
                fileType
            };

        } catch (error) {
            return {
                success: false,
                error: 'Invalid encrypted file format: ' + error.message
            };
        }
    }

    /**
     * Get file extension from filename
     * @param {string} filename - File name
     * @returns {string} File extension
     */
    getFileExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    }

    /**
     * Get MIME type from file extension
     * @param {string} extension - File extension
     * @returns {string} MIME type
     */
    getMimeType(extension) {
        const mimeTypes = {
            // Video formats
            'mp4': 'video/mp4',
            'avi': 'video/x-msvideo',
            'mov': 'video/quicktime',
            'mkv': 'video/x-matroska',
            'wmv': 'video/x-ms-wmv',
            
            // Audio formats
            'mp3': 'audio/mpeg',
            'wav': 'audio/wav',
            'm4a': 'audio/mp4',
            'flac': 'audio/flac',
            'aac': 'audio/aac'
        };

        return mimeTypes[extension] || 'application/octet-stream';
    }

    /**
     * Validate if file type is supported
     * @param {string} filename - File name
     * @returns {boolean} True if supported
     */
    isSupportedFileType(filename) {
        const extension = this.getFileExtension(filename);
        const supportedExtensions = [
            'mp4', 'avi', 'mov', 'mkv', 'wmv', // Video
            'mp3', 'wav', 'm4a', 'flac', 'aac'  // Audio
        ];
        return supportedExtensions.includes(extension);
    }
}

// Export for use in other modules
window.CryptoUtils = CryptoUtils;
