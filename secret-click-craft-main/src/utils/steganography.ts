export interface ClickPoint {
  x: number;
  y: number;
  order: number;
}

export interface SteganographyData {
  message: string;
  clickSequence: ClickPoint[];
}

// Convert string to binary
function stringToBinary(str: string): string {
  return str.split('').map(char => 
    char.charCodeAt(0).toString(2).padStart(8, '0')
  ).join('');
}

// Convert binary to string
function binaryToString(binary: string): string {
  const chars = binary.match(/.{8}/g);
  if (!chars) return '';
  return chars.map(byte => 
    String.fromCharCode(parseInt(byte, 2))
  ).join('');
}

// Hide data in image using LSB steganography
export function encodeMessage(
  canvas: HTMLCanvasElement, 
  data: SteganographyData
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      // Serialize the data
      const serializedData = JSON.stringify(data);
      const binaryData = stringToBinary(serializedData);
      
      // Add delimiter to mark end of data
      const delimiter = '1111111111111110'; // 16 bits of delimiter
      const fullBinary = binaryData + delimiter;

      if (fullBinary.length > pixels.length / 4) {
        throw new Error('Message too long for this image');
      }

      // Hide data in LSB of red channel
      for (let i = 0; i < fullBinary.length; i++) {
        const pixelIndex = i * 4; // Red channel (RGBA)
        const bit = parseInt(fullBinary[i]);
        
        // Clear LSB and set new bit
        pixels[pixelIndex] = (pixels[pixelIndex] & 0xFE) | bit;
      }

      ctx.putImageData(imageData, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create blob'));
      }, 'image/png');
    } catch (error) {
      reject(error);
    }
  });
}

// Extract data from image
export function decodeMessage(canvas: HTMLCanvasElement): SteganographyData | null {
  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    let binaryData = '';
    const delimiter = '1111111111111110';

    // Extract bits from LSB of red channel
    for (let i = 0; i < pixels.length / 4; i++) {
      const pixelIndex = i * 4;
      const bit = pixels[pixelIndex] & 1;
      binaryData += bit.toString();

      // Check if we've hit the delimiter
      if (binaryData.endsWith(delimiter)) {
        binaryData = binaryData.slice(0, -delimiter.length);
        break;
      }
    }

    if (!binaryData) return null;

    // Convert binary to string
    const jsonString = binaryToString(binaryData);
    if (!jsonString) return null;

    // Parse the JSON data
    const data = JSON.parse(jsonString) as SteganographyData;
    return data;
  } catch (error) {
    console.error('Error decoding message:', error);
    return null;
  }
}

// Normalize click coordinates relative to canvas size
export function normalizeClickPoint(
  x: number, 
  y: number, 
  canvasWidth: number, 
  canvasHeight: number,
  order: number
): ClickPoint {
  return {
    x: x / canvasWidth,
    y: y / canvasHeight,
    order
  };
}

// Denormalize click coordinates for canvas display
export function denormalizeClickPoint(
  point: ClickPoint, 
  canvasWidth: number, 
  canvasHeight: number
): { x: number; y: number } {
  return {
    x: point.x * canvasWidth,
    y: point.y * canvasHeight
  };
}

// Check if click is close enough to target point (within tolerance)
export function isClickNearPoint(
  clickX: number, 
  clickY: number, 
  targetX: number, 
  targetY: number, 
  tolerance: number = 30
): boolean {
  const distance = Math.sqrt(
    Math.pow(clickX - targetX, 2) + Math.pow(clickY - targetY, 2)
  );
  return distance <= tolerance;
}