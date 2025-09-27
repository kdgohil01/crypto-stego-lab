import CryptoJS from 'crypto-js';
import { pki, md, util } from 'node-forge';

// AES-256 Encryption/Decryption
export class AESCrypto {
  static encrypt(text: string, password: string): string {
    const salt = CryptoJS.lib.WordArray.random(128/8);
    const key = CryptoJS.PBKDF2(password, salt, {
      keySize: 256/32,
      iterations: 10000
    });
    
    const iv = CryptoJS.lib.WordArray.random(128/8);
    const encrypted = CryptoJS.AES.encrypt(text, key, { 
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });
    
    const encryptedData = salt.concat(iv).concat(encrypted.ciphertext);
    return encryptedData.toString(CryptoJS.enc.Base64);
  }
  
  static decrypt(encryptedText: string, password: string): string {
    const encryptedData = CryptoJS.enc.Base64.parse(encryptedText);
    const salt = CryptoJS.lib.WordArray.create(encryptedData.words.slice(0, 4));
    const iv = CryptoJS.lib.WordArray.create(encryptedData.words.slice(4, 8));
    const encrypted = CryptoJS.lib.WordArray.create(encryptedData.words.slice(8));
    
    const key = CryptoJS.PBKDF2(password, salt, {
      keySize: 256/32,
      iterations: 10000
    });
    
    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: encrypted } as any,
      key,
      { iv: iv, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC }
    );
    
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}

// RSA-2048 Encryption/Decryption
export class RSACrypto {
  private static generateKeyPair(): { publicKey: string, privateKey: string } {
    const keypair = pki.rsa.generateKeyPair(2048);
    const publicKeyPem = pki.publicKeyToPem(keypair.publicKey);
    const privateKeyPem = pki.privateKeyToPem(keypair.privateKey);
    
    return {
      publicKey: publicKeyPem,
      privateKey: privateKeyPem
    };
  }
  
  static encrypt(text: string): { encrypted: string, privateKey: string } {
    const { publicKey, privateKey } = this.generateKeyPair();
    const publicKeyObj = pki.publicKeyFromPem(publicKey);
    
    // RSA can only encrypt small amounts of data, so we'll use it for a key
    const aesKey = CryptoJS.lib.WordArray.random(256/8).toString();
    const encryptedAesKey = publicKeyObj.encrypt(aesKey, 'RSA-OAEP');
    const encryptedAesKeyBase64 = util.encode64(encryptedAesKey);
    
    // Use AES to encrypt the actual data
    const encryptedData = AESCrypto.encrypt(text, aesKey);
    
    return {
      encrypted: JSON.stringify({
        key: encryptedAesKeyBase64,
        data: encryptedData
      }),
      privateKey
    };
  }
  
  static decrypt(encryptedData: string, privateKey: string): string {
    const privateKeyObj = pki.privateKeyFromPem(privateKey);
    const { key, data } = JSON.parse(encryptedData);
    
    // Decrypt the AES key using RSA
    const encryptedAesKey = util.decode64(key);
    const aesKey = privateKeyObj.decrypt(encryptedAesKey, 'RSA-OAEP');
    
    // Decrypt the data using AES
    return AESCrypto.decrypt(data, aesKey);
  }
}

// Steganography
export class Steganography {
  static async hideText(imageFile: File, text: string, clickSequence: number[]): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx!.drawImage(img, 0, 0);
        
        const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Add click sequence as metadata
        const metadata = JSON.stringify({ clickSequence, textLength: text.length });
        const fullText = metadata + '|' + text;
        
        // Convert text to binary
        const binaryText = fullText.split('').map(char => 
          char.charCodeAt(0).toString(2).padStart(8, '0')
        ).join('') + '1111111111111110'; // End marker
        
        let textIndex = 0;
        
        // Hide binary data in LSB of red channel
        for (let i = 0; i < data.length && textIndex < binaryText.length; i += 4) {
          if (textIndex < binaryText.length) {
            const bit = parseInt(binaryText[textIndex]);
            data[i] = (data[i] & 0xFE) | bit; // Modify LSB
            textIndex++;
          }
        }
        
        ctx!.putImageData(imageData, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create blob'));
        }, 'image/png');
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(imageFile);
    });
  }
  
  static async extractText(imageFile: File, clickSequence: number[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx!.drawImage(img, 0, 0);
        
        const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        let binaryText = '';
        
        // Extract binary data from LSB of red channel
        for (let i = 0; i < data.length; i += 4) {
          binaryText += (data[i] & 1).toString();
          
          // Check for end marker
          if (binaryText.endsWith('1111111111111110')) {
            break;
          }
        }
        
        // Remove end marker
        binaryText = binaryText.slice(0, -16);
        
        // Convert binary to text
        let fullText = '';
        for (let i = 0; i < binaryText.length; i += 8) {
          const byte = binaryText.substr(i, 8);
          if (byte.length === 8) {
            fullText += String.fromCharCode(parseInt(byte, 2));
          }
        }
        
        // Extract metadata and text
        const separatorIndex = fullText.indexOf('|');
        if (separatorIndex === -1) {
          reject(new Error('Invalid steganographic image'));
          return;
        }
        
        const metadata = JSON.parse(fullText.slice(0, separatorIndex));
        const extractedText = fullText.slice(separatorIndex + 1);
        
        // Verify click sequence
        if (JSON.stringify(metadata.clickSequence) !== JSON.stringify(clickSequence)) {
          reject(new Error('Invalid click sequence'));
          return;
        }
        
        resolve(extractedText);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(imageFile);
    });
  }
}

export const validateClickSequence = (sequence: number[]): boolean => {
  return sequence.length === 4 && 
         sequence.every(num => num >= 1 && num <= 9) &&
         new Set(sequence).size === sequence.length; // All unique
};