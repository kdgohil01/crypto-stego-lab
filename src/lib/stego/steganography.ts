/**
 * LSB Steganography Module for StegoCrypt
 * 
 * This module implements Least Significant Bit (LSB) steganography for
 * hiding binary data within PNG/BMP images.
 * 
 * How LSB Steganography Works:
 * ─────────────────────────────
 * Each pixel in an image has color channels (RGBA - Red, Green, Blue, Alpha).
 * Each channel is stored as an 8-bit value (0-255).
 * 
 * The human eye is insensitive to small changes in color values.
 * By modifying the least significant bits of each color channel,
 * we can hide data while keeping the image visually similar.
 * 
 * Enhanced Mode (2 LSBs per channel):
 * Using 2 LSBs doubles capacity with minimal visual impact.
 * Color values can change by up to 3 (e.g., 148 → 145-151)
 * 
 * Data Format:
 * ────────────
 * [Header: 32 bits = data length] [Payload: variable length data]
 * 
 * Capacity Calculation (2 LSBs, RGB channels):
 * ─────────────────────────────────────────────
 * Each pixel has 3 usable channels (RGB, we skip Alpha for compatibility).
 * Each channel can store 2 bits of data.
 * Capacity (bits) = width × height × 3 × 2
 * Capacity (bytes) = (width × height × 3 × 2) / 8
 */

const HEADER_BITS = 32; // 4 bytes for storing data length
const BITS_PER_CHANNEL = 2; // Use 2 LSBs for more capacity
const CHANNELS_PER_PIXEL = 3; // RGB only, skip Alpha

/**
 * Represents the result of embedding data into an image
 */
export interface EmbedResult {
  imageData: ImageData;
  originalSize: number;
  embeddedSize: number;
}

/**
 * Calculates the maximum bytes that can be embedded in an image
 * 
 * @param width - Image width in pixels
 * @param height - Image height in pixels
 * @returns Maximum embeddable bytes
 */
export function calculateCapacity(width: number, height: number): number {
  // Total pixels × 3 channels × 2 bits per channel = total bits available
  // Divide by 8 to get bytes, subtract 4 for header
  const totalBits = width * height * CHANNELS_PER_PIXEL * BITS_PER_CHANNEL;
  const totalBytes = Math.floor(totalBits / 8);
  return Math.max(0, totalBytes - 4); // Reserve 4 bytes for header
}

/**
 * Checks if data can fit within the image
 * 
 * @param dataLength - Length of data to embed in bytes
 * @param width - Image width in pixels
 * @param height - Image height in pixels
 * @returns true if data fits, false otherwise
 */
export function canFitData(dataLength: number, width: number, height: number): boolean {
  return dataLength <= calculateCapacity(width, height);
}

/**
 * Gets specific bits from a byte
 * 
 * @param byte - The byte to extract from
 * @param position - Bit position (0 = LSB)
 * @param count - Number of bits to extract
 * @returns The extracted bits
 */
function getBits(byte: number, position: number, count: number): number {
  const mask = (1 << count) - 1;
  return (byte >> position) & mask;
}

/**
 * Sets the least significant bits of a byte
 * 
 * @param byte - The original byte
 * @param bits - The bits to set
 * @param count - Number of LSBs to modify
 * @returns Modified byte with new LSBs
 */
function setLSBs(byte: number, bits: number, count: number): number {
  const mask = (1 << count) - 1;
  return (byte & ~mask) | (bits & mask);
}

/**
 * Embeds binary data into an image using LSB steganography
 * 
 * @param imageData - The carrier image as ImageData
 * @param data - Binary data to embed
 * @returns Modified ImageData with embedded data
 * @throws Error if data is too large for the image
 */
export function embedData(imageData: ImageData, data: Uint8Array): EmbedResult {
  const { width, height } = imageData;
  
  // Check capacity
  if (!canFitData(data.length, width, height)) {
    const capacity = calculateCapacity(width, height);
    throw new Error(
      `Data too large: ${data.length} bytes, but image can only hold ${capacity} bytes`
    );
  }

  // Clone the image data to avoid modifying the original
  const pixels = new Uint8ClampedArray(imageData.data);
  
  // Create header with data length (32-bit big-endian)
  const header = new Uint8Array(4);
  const view = new DataView(header.buffer);
  view.setUint32(0, data.length, false); // Big-endian

  // Combine header and data
  const payload = new Uint8Array(4 + data.length);
  payload.set(header, 0);
  payload.set(data, 4);

  // Convert payload to bit pairs for 2-bit embedding
  const bitPairs: number[] = [];
  for (let i = 0; i < payload.length; i++) {
    // Extract 4 bit-pairs from each byte (MSB first)
    bitPairs.push(getBits(payload[i], 6, 2));
    bitPairs.push(getBits(payload[i], 4, 2));
    bitPairs.push(getBits(payload[i], 2, 2));
    bitPairs.push(getBits(payload[i], 0, 2));
  }

  // Embed each bit-pair into LSBs of RGB channels
  let pairIndex = 0;

  outer: for (let i = 0; i < pixels.length; i += 4) {
    // For each pixel, modify R, G, B channels (skip Alpha at index 3)
    for (let channel = 0; channel < CHANNELS_PER_PIXEL; channel++) {
      if (pairIndex >= bitPairs.length) break outer;
      
      pixels[i + channel] = setLSBs(pixels[i + channel], bitPairs[pairIndex], BITS_PER_CHANNEL);
      pairIndex++;
    }
  }

  return {
    imageData: new ImageData(pixels, width, height),
    originalSize: data.length,
    embeddedSize: payload.length,
  };
}

/**
 * Extracts embedded data from a stego-image
 * 
 * @param imageData - The stego-image as ImageData
 * @returns Extracted binary data
 * @throws Error if extraction fails or data is corrupted
 */
export function extractData(imageData: ImageData): Uint8Array {
  const { width, height, data: pixels } = imageData;
  
  // Extract bit-pairs from pixels
  const extractedPairs: number[] = [];
  const mask = (1 << BITS_PER_CHANNEL) - 1;

  for (let i = 0; i < pixels.length; i += 4) {
    for (let channel = 0; channel < CHANNELS_PER_PIXEL; channel++) {
      extractedPairs.push(pixels[i + channel] & mask);
    }
  }

  // Convert first 16 bit-pairs (32 bits) to header length
  let dataLength = 0;
  for (let i = 0; i < 16; i++) {
    dataLength = (dataLength << 2) | extractedPairs[i];
  }

  // Validate data length
  const maxCapacity = calculateCapacity(width, height);
  if (dataLength <= 0 || dataLength > maxCapacity) {
    throw new Error('No valid embedded data found or data is corrupted');
  }

  // Calculate total bit-pairs needed (header + data)
  const totalPairsNeeded = (4 + dataLength) * 4; // 4 pairs per byte
  
  if (extractedPairs.length < totalPairsNeeded) {
    throw new Error('Image does not contain enough data');
  }

  // Convert bit-pairs back to bytes (skip header)
  const result = new Uint8Array(dataLength);
  for (let i = 0; i < dataLength; i++) {
    const pairOffset = 16 + i * 4; // Skip 16 header pairs
    result[i] = 
      (extractedPairs[pairOffset] << 6) |
      (extractedPairs[pairOffset + 1] << 4) |
      (extractedPairs[pairOffset + 2] << 2) |
      extractedPairs[pairOffset + 3];
  }

  return result;
}

/**
 * Formats bytes into human-readable format
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

