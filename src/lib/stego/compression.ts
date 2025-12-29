/**
 * Compression Module for StegoCrypt
 * 
 * Uses zlib (deflate) compression via the pako library to reduce
 * the size of data before encryption and embedding.
 * 
 * Benefits:
 * - Reduces payload size, allowing larger files to fit in images
 * - Adds an additional layer of obfuscation
 * - Fast and widely compatible compression algorithm
 */

import pako from 'pako';

/**
 * Compresses binary data using zlib deflate algorithm
 * 
 * @param data - Raw binary data to compress
 * @returns Compressed data as Uint8Array
 */
export function compress(data: Uint8Array): Uint8Array {
  return pako.deflate(data, { level: 9 });
}

/**
 * Decompresses zlib-compressed data
 * 
 * @param compressedData - Previously compressed data
 * @returns Original uncompressed data
 * @throws Error if data is not valid zlib format
 */
export function decompress(compressedData: Uint8Array): Uint8Array {
  try {
    return pako.inflate(compressedData);
  } catch {
    throw new Error('Decompression failed: data may be corrupted');
  }
}

/**
 * Estimates compression ratio for a given data type
 * (Useful for capacity calculations)
 */
export function estimateCompressionRatio(data: Uint8Array): number {
  const compressed = compress(data);
  return compressed.length / data.length;
}

