/**
 * Cryptographic Module for StegoCrypt
 * 
 * This module provides AES-256-GCM encryption with PBKDF2 key derivation.
 * 
 * Security Features:
 * - AES-256-GCM: Authenticated encryption providing confidentiality and integrity
 * - PBKDF2: Password-based key derivation with 100,000 iterations
 * - Random IV: 12-byte initialization vector for each encryption
 * - Random Salt: 16-byte salt for key derivation
 * 
 * Data Format:
 * [Salt (16 bytes)] [IV (12 bytes)] [Ciphertext + Auth Tag (variable)]
 */

const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const KEY_LENGTH = 256;
const ITERATIONS = 100000;

/**
 * Derives a cryptographic key from a password using PBKDF2
 * 
 * @param password - User-provided password
 * @param salt - Random salt for key derivation
 * @returns CryptoKey suitable for AES-256-GCM
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  // Import password as raw key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveKey']
  );

  // Derive AES-256-GCM key using PBKDF2
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt.buffer as ArrayBuffer,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts data using AES-256-GCM with PBKDF2 key derivation
 * 
 * @param data - Raw binary data to encrypt
 * @param password - User-provided password
 * @returns Encrypted data with salt and IV prepended
 */
export async function encrypt(data: Uint8Array, password: string): Promise<Uint8Array> {
  // Generate random salt and IV
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

  // Derive key from password
  const key = await deriveKey(password, salt);

  // Encrypt data with AES-256-GCM
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    data.buffer as ArrayBuffer
  );

  // Combine salt + IV + ciphertext
  const result = new Uint8Array(SALT_LENGTH + IV_LENGTH + ciphertext.byteLength);
  result.set(salt, 0);
  result.set(iv, SALT_LENGTH);
  result.set(new Uint8Array(ciphertext), SALT_LENGTH + IV_LENGTH);

  return result;
}

/**
 * Decrypts AES-256-GCM encrypted data
 * 
 * @param encryptedData - Data encrypted by the encrypt function
 * @param password - User-provided password
 * @returns Decrypted raw binary data
 * @throws Error if password is incorrect or data is corrupted
 */
export async function decrypt(encryptedData: Uint8Array, password: string): Promise<Uint8Array> {
  // Extract salt, IV, and ciphertext
  const salt = encryptedData.slice(0, SALT_LENGTH);
  const iv = encryptedData.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const ciphertext = encryptedData.slice(SALT_LENGTH + IV_LENGTH);

  // Derive key from password
  const key = await deriveKey(password, salt);

  try {
    // Decrypt and verify authentication tag
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );

    return new Uint8Array(decrypted);
  } catch {
    throw new Error('Decryption failed: incorrect password or corrupted data');
  }
}

