/**
 * Image Utilities for StegoCrypt
 * 
 * Handles image loading, canvas operations, and PNG export.
 * 
 * Important Notes on Image Formats:
 * ─────────────────────────────────
 * 
 * LOSSLESS FORMATS (Safe for Steganography):
 * - PNG: Lossless compression, preserves all pixel data
 * - BMP: No compression, preserves all pixel data
 * 
 * LOSSY FORMATS (DESTROY Hidden Data):
 * - JPEG: Lossy compression alters pixel values
 * - WebP (lossy mode): Similar to JPEG
 * - Social media platforms often re-encode images as JPEG
 * 
 * Always export stego-images as PNG to preserve hidden data!
 */

/**
 * Loads an image file and returns ImageData
 * 
 * @param file - Image file from input
 * @returns Promise resolving to ImageData
 */
export function loadImageAsData(file: File): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      
      URL.revokeObjectURL(url);
      resolve(imageData);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Converts ImageData to a PNG blob
 * 
 * @param imageData - The ImageData to convert
 * @returns Promise resolving to PNG Blob
 */
export function imageDataToPng(imageData: ImageData): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }

    ctx.putImageData(imageData, 0, 0);
    
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to create PNG blob'));
      }
    }, 'image/png');
  });
}

/**
 * Creates a data URL from an image file for preview
 */
export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Creates a data URL from ImageData for preview
 */
export function imageDataToDataUrl(imageData: ImageData): string {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');
  
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
}

/**
 * Downloads an image from ImageData as PNG
 */
export async function downloadImageAsPng(imageData: ImageData, filename: string): Promise<void> {
  const blob = await imageDataToPng(imageData);
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.png') ? filename : `${filename}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  URL.revokeObjectURL(url);
}

/**
 * Validates that an image is suitable for steganography
 */
export function validateCarrierImage(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/png', 'image/bmp', 'image/jpeg', 'image/jpg', 'image/webp'];
  
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid image type: ${file.type}. Please use PNG, BMP, JPEG, or WebP.`,
    };
  }

  // Warn about JPEG source (data will be preserved in output PNG)
  if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
    console.warn('Source image is JPEG. Output will be PNG to preserve hidden data.');
  }

  return { valid: true };
}

/**
 * Gets image dimensions from a file
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

