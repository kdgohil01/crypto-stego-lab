/**
 * File Processor Module for StegoCrypt
 * 
 * Handles reading files, creating metadata packages, and reconstructing
 * files from extracted data.
 * 
 * Metadata Format:
 * ────────────────
 * The embedded data includes file metadata for proper reconstruction:
 * 
 * [Magic Bytes: 4 bytes "STEG"]
 * [Version: 1 byte]
 * [Filename Length: 2 bytes]
 * [Filename: variable]
 * [MIME Type Length: 2 bytes]  
 * [MIME Type: variable]
 * [Original Size: 4 bytes]
 * [File Data: variable]
 */

const MAGIC_BYTES = new Uint8Array([0x53, 0x54, 0x45, 0x47]); // "STEG"
const VERSION = 1;

/**
 * Represents a processed file ready for embedding
 */
export interface ProcessedFile {
  filename: string;
  mimeType: string;
  data: Uint8Array;
  originalSize: number;
}

/**
 * Reads a file and returns its binary content with metadata
 * 
 * @param file - File object from input
 * @returns ProcessedFile containing all file information
 */
export async function readFile(file: File): Promise<ProcessedFile> {
  const buffer = await file.arrayBuffer();
  return {
    filename: file.name,
    mimeType: file.type || 'application/octet-stream',
    data: new Uint8Array(buffer),
    originalSize: file.size,
  };
}

/**
 * Packages file data with metadata for embedding
 * 
 * @param processedFile - File data with metadata
 * @returns Packed binary data including metadata
 */
export function packFileWithMetadata(processedFile: ProcessedFile): Uint8Array {
  const encoder = new TextEncoder();
  const filenameBytes = encoder.encode(processedFile.filename);
  const mimeTypeBytes = encoder.encode(processedFile.mimeType);

  // Calculate total size
  const totalSize = 
    4 + // Magic bytes
    1 + // Version
    2 + // Filename length
    filenameBytes.length +
    2 + // MIME type length
    mimeTypeBytes.length +
    4 + // Original size
    processedFile.data.length;

  const result = new Uint8Array(totalSize);
  const view = new DataView(result.buffer);
  let offset = 0;

  // Write magic bytes
  result.set(MAGIC_BYTES, offset);
  offset += 4;

  // Write version
  result[offset] = VERSION;
  offset += 1;

  // Write filename
  view.setUint16(offset, filenameBytes.length, false);
  offset += 2;
  result.set(filenameBytes, offset);
  offset += filenameBytes.length;

  // Write MIME type
  view.setUint16(offset, mimeTypeBytes.length, false);
  offset += 2;
  result.set(mimeTypeBytes, offset);
  offset += mimeTypeBytes.length;

  // Write original size
  view.setUint32(offset, processedFile.originalSize, false);
  offset += 4;

  // Write file data
  result.set(processedFile.data, offset);

  return result;
}

/**
 * Extracts file and metadata from packed data
 * 
 * @param data - Packed binary data from extraction
 * @returns ProcessedFile with original file information
 * @throws Error if data format is invalid
 */
export function unpackFileWithMetadata(data: Uint8Array): ProcessedFile {
  const decoder = new TextDecoder();
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  let offset = 0;

  // Verify magic bytes
  for (let i = 0; i < 4; i++) {
    if (data[offset + i] !== MAGIC_BYTES[i]) {
      throw new Error('Invalid file format: magic bytes mismatch');
    }
  }
  offset += 4;

  // Read version
  const version = data[offset];
  if (version !== VERSION) {
    throw new Error(`Unsupported file version: ${version}`);
  }
  offset += 1;

  // Read filename
  const filenameLength = view.getUint16(offset, false);
  offset += 2;
  const filename = decoder.decode(data.slice(offset, offset + filenameLength));
  offset += filenameLength;

  // Read MIME type
  const mimeTypeLength = view.getUint16(offset, false);
  offset += 2;
  const mimeType = decoder.decode(data.slice(offset, offset + mimeTypeLength));
  offset += mimeTypeLength;

  // Read original size
  const originalSize = view.getUint32(offset, false);
  offset += 4;

  // Read file data
  const fileData = data.slice(offset);

  return {
    filename,
    mimeType,
    data: fileData,
    originalSize,
  };
}

/**
 * Creates a downloadable blob from file data
 */
export function createDownloadBlob(processedFile: ProcessedFile): Blob {
  return new Blob([processedFile.data.buffer as ArrayBuffer], { type: processedFile.mimeType });
}

/**
 * Triggers file download in the browser
 */
export function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Gets file extension from filename
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';
}

/**
 * Returns a user-friendly file type description
 */
export function getFileTypeDescription(mimeType: string, filename: string): string {
  const extension = getFileExtension(filename).toUpperCase();
  
  const typeMap: Record<string, string> = {
    'application/pdf': 'PDF Document',
    'application/zip': 'ZIP Archive',
    'application/x-zip-compressed': 'ZIP Archive',
    'application/msword': 'Word Document',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
    'application/vnd.ms-excel': 'Excel Spreadsheet',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel Spreadsheet',
    'text/plain': 'Text File',
    'audio/mpeg': 'MP3 Audio',
    'video/mp4': 'MP4 Video',
    'image/jpeg': 'JPEG Image',
    'image/png': 'PNG Image',
  };

  return typeMap[mimeType] || (extension ? `${extension} File` : 'Unknown File');
}

