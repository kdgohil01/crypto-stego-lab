document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const encodeBtn = document.getElementById('encodeBtn');
    const decodeBtn = document.getElementById('decodeBtn');
    const base64EncodeBtn = document.getElementById('base64EncodeBtn');
    const base64DecodeBtn = document.getElementById('base64DecodeBtn');
    const aesEncryptBtn = document.getElementById('aesEncryptBtn');
    const aesDecryptBtn = document.getElementById('aesDecryptBtn');
    const resetBtn = document.getElementById('resetBtn');
    const learnBtn = document.getElementById('learnBtn');
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const modal = document.getElementById('learnModal');
    const closeBtn = document.querySelector('.close');

    // Encode button click handler
    encodeBtn.addEventListener('click', function() {
        try {
            const encodedText = encodeURIComponent(inputText.value);
            outputText.value = encodedText;
            copyToClipboard(encodedText);
            showNotification('Level 1 encoding completed and copied to clipboard!');
        } catch (error) {
            showNotification('Error encoding text: ' + error.message, 'error');
        }
    });

    // Decode button click handler
    decodeBtn.addEventListener('click', function() {
        try {
            const decodedText = decodeURIComponent(inputText.value.replace(/\+/g, ' '));
            outputText.value = decodedText;
            copyToClipboard(decodedText);
            showNotification('Level 1 decoding completed and copied to clipboard!');
        } catch (error) {
            showNotification('Error decoding text. Make sure the input is properly encoded.', 'error');
        }
    });

    // Base64 encode button click handler
    base64EncodeBtn.addEventListener('click', function() {
        try {
            const encodedText = btoa(inputText.value);
            outputText.value = encodedText;
            copyToClipboard(encodedText);
            showNotification('Level 2 encoding completed and copied to clipboard!');
        } catch (error) {
            showNotification('Error encoding text: ' + error.message, 'error');
        }
    });

    // Base64 decode button click handler
    base64DecodeBtn.addEventListener('click', function() {
        try {
            const decodedText = atob(inputText.value);
            outputText.value = decodedText;
            copyToClipboard(decodedText);
            showNotification('Level 2 decoding completed and copied to clipboard!');
        } catch (error) {
            showNotification('Error decoding text. Make sure the input is valid Base64.', 'error');
        }
    });

    // AES encrypt button click handler
    aesEncryptBtn.addEventListener('click', async function() {
        const password = prompt('Enter password for AES encryption:');
        if (!password) {
            showNotification('Password is required for AES encryption.', 'error');
            return;
        }
        
        try {
            const encryptedText = await aesEncrypt(inputText.value, password);
            outputText.value = encryptedText;
            copyToClipboard(encryptedText);
            showNotification('Level 3 encryption completed and copied to clipboard!');
        } catch (error) {
            showNotification('Error encrypting text: ' + error.message, 'error');
        }
    });

    // AES decrypt button click handler
    aesDecryptBtn.addEventListener('click', async function() {
        const password = prompt('Enter password for AES decryption:');
        if (!password) {
            showNotification('Password is required for AES decryption.', 'error');
            return;
        }
        
        try {
            const decryptedText = await aesDecrypt(inputText.value, password);
            outputText.value = decryptedText;
            copyToClipboard(decryptedText);
            showNotification('Level 3 decryption completed and copied to clipboard!');
        } catch (error) {
            showNotification('Error decrypting text. Check password and input format.', 'error');
        }
    });


    // Reset button click handler
    resetBtn.addEventListener('click', function() {
        inputText.value = '';
        outputText.value = '';
        showNotification('Input and output cleared.');
    });

    // Learn button click handler
    learnBtn.addEventListener('click', function() {
        modal.style.display = 'block';
    });

    // Close modal when clicking the X
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside the modal
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Handle keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        // Ctrl+Enter to encode
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            encodeBtn.click();
            event.preventDefault();
        }
        // Escape to close modal
        if (event.key === 'Escape') {
            modal.style.display = 'none';
        }
    });

    // Copy text to clipboard
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).catch(err => {
            console.error('Could not copy text: ', err);
        });
    }

    // Show notification
    function showNotification(message, type = 'success') {
        // Remove any existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // Style the notification
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 25px';
        notification.style.borderRadius = '5px';
        notification.style.color = 'white';
        notification.style.fontWeight = '500';
        notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        notification.style.zIndex = '1000';
        notification.style.transition = 'opacity 0.3s, transform 0.3s';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';

        // Set background color based on type
        if (type === 'error') {
            notification.style.backgroundColor = '#e74c3c';
        } else {
            notification.style.backgroundColor = '#2ecc71';
        }

        // Add to DOM
        document.body.appendChild(notification);

        // Trigger animation
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Add a nice animation to the buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });


    // AES encryption functions
    async function aesEncrypt(text, password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        
        // Generate a key from the password
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            encoder.encode(password),
            { name: 'PBKDF2' },
            false,
            ['deriveKey']
        );
        
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const key = await crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: 100000,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt']
        );
        
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encrypted = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            data
        );
        
        // Combine salt, iv, and encrypted data
        const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
        combined.set(salt, 0);
        combined.set(iv, salt.length);
        combined.set(new Uint8Array(encrypted), salt.length + iv.length);
        
        return btoa(String.fromCharCode(...combined));
    }
    
    async function aesDecrypt(encryptedData, password) {
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();
        
        // Decode the base64 data
        const combined = new Uint8Array(atob(encryptedData).split('').map(char => char.charCodeAt(0)));
        
        // Extract salt, iv, and encrypted data
        const salt = combined.slice(0, 16);
        const iv = combined.slice(16, 28);
        const encrypted = combined.slice(28);
        
        // Generate the key from password and salt
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            encoder.encode(password),
            { name: 'PBKDF2' },
            false,
            ['deriveKey']
        );
        
        const key = await crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: 100000,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['decrypt']
        );
        
        // Decrypt the data
        const decrypted = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            encrypted
        );
        
        return decoder.decode(decrypted);
    }

});
