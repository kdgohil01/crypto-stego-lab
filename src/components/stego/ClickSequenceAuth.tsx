import React, { useState, useRef, useCallback } from 'react';
import { Lock, Unlock, Upload, Download, RotateCcw, Copy, Eye, EyeOff, MousePointer } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface ClickPoint {
  x: number;
  y: number;
  order: number;
}

interface SteganographyData {
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

// Normalize click point coordinates
function normalizeClickPoint(x: number, y: number, width: number, height: number, order: number): ClickPoint {
  return {
    x: Math.round((x / width) * 1000) / 1000, // Normalize to 0-1 range with 3 decimal precision
    y: Math.round((y / height) * 1000) / 1000,
    order
  };
}

// Hide data in image using LSB steganography
function encodeMessage(canvas: HTMLCanvasElement, data: SteganographyData): Promise<Blob> {
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
function decodeMessage(canvas: HTMLCanvasElement): SteganographyData | null {
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
      binaryData += bit;

  // Check for delimiter
      if (binaryData.length >= delimiter.length) {
        const lastBits = binaryData.slice(-delimiter.length);
        if (lastBits === delimiter) {
          // Found delimiter, extract message candidate
          const messageBinary = binaryData.slice(0, -delimiter.length);
          const messageString = binaryToString(messageBinary);
          
          try {
            const parsed = JSON.parse(messageString) as SteganographyData;
            return parsed;
          } catch {
            // Not valid JSON at this delimiter. Continue scanning for the next occurrence.
          }
        }
      }
    }

    return null;
  } catch {
    return null;
  }
}

export default function ClickSequenceAuth() {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [clickSequence, setClickSequence] = useState<ClickPoint[]>([]);
  const [isSettingSequence, setIsSettingSequence] = useState(false);
  const [encodedImage, setEncodedImage] = useState<Blob | null>(null);
  const [extractedMessage, setExtractedMessage] = useState('');
  const [extractedSequence, setExtractedSequence] = useState<ClickPoint[]>([]);
  const [showSequence, setShowSequence] = useState(false);
  const [activeTab, setActiveTab] = useState('encode');
  const [isVerifyingSequence, setIsVerifyingSequence] = useState(false);
  const [userClickSequence, setUserClickSequence] = useState<ClickPoint[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please select a valid image file.",
        variant: "destructive",
      });
      return;
    }

    const img = new Image();
    img.onload = () => {
      setImage(img);
      
      if (activeTab === 'encode') {
        // Reset everything for encode mode
        setClickSequence([]);
        setEncodedImage(null);
        setIsSettingSequence(false);
      } else {
        // Reset everything for decode mode
        setExtractedMessage('');
        setExtractedSequence([]);
        setIsVerifyingSequence(false);
        setUserClickSequence([]);
        setIsAuthenticated(false);
      }
      
      drawImageOnCanvas(img);
      
      toast({
        title: "Image loaded",
        description: "Image is ready for steganography operations.",
      });
    };
    img.src = URL.createObjectURL(file);
  };

  const drawImageOnCanvas = (img: HTMLImageElement) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw at the image's original pixel dimensions to preserve LSB data
    const w = (img as HTMLImageElement).naturalWidth || img.width;
    const h = (img as HTMLImageElement).naturalHeight || img.height;

    canvas.width = w;
    canvas.height = h;

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    
    // Ensure canvas is interactive
    canvas.style.pointerEvents = 'auto';
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // Prefer native offsetX/Y when available (Edge reliability), fallback to clientX/Y
    const native = event.nativeEvent as MouseEvent & { offsetX?: number; offsetY?: number };
    let xDisplay = typeof native.offsetX === 'number' ? native.offsetX : event.clientX - rect.left;
    let yDisplay = typeof native.offsetY === 'number' ? native.offsetY : event.clientY - rect.top;

    // Clamp to element bounds
    xDisplay = Math.max(0, Math.min(xDisplay, rect.width));
    yDisplay = Math.max(0, Math.min(yDisplay, rect.height));

    // Map from CSS pixels to canvas (internal) pixels
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = xDisplay * scaleX;
    const y = yDisplay * scaleY;

    // Handle encode mode - setting sequence
    if (isSettingSequence && activeTab === 'encode') {
      if (clickSequence.length >= 4) {
        toast({
          title: "Maximum clicks reached",
          description: "You can set a maximum of 4 click points.",
          variant: "destructive",
        });
        return;
      }

      const newPoint = normalizeClickPoint(x, y, canvas.width, canvas.height, clickSequence.length);
      setClickSequence(prev => [...prev, newPoint]);
      
      // Draw click point on canvas (use canvas pixel coordinates)
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
        
        // Add number label
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.fillText((clickSequence.length + 1).toString(), x + 8, y - 8);
      }
      
      toast({
        title: `Click point ${clickSequence.length + 1} set`,
        description: `Coordinates: (${Math.round(xDisplay)}, ${Math.round(yDisplay)})`,
      });
    }

    // Handle decode mode - verifying sequence
    if (isVerifyingSequence && activeTab === 'decode') {
      if (userClickSequence.length >= extractedSequence.length) {
        toast({
          title: "Sequence complete",
          description: "You have clicked all required points. Verifying...",
        });
        return;
      }

      const newPoint = normalizeClickPoint(x, y, canvas.width, canvas.height, userClickSequence.length);
      const newUserSequence = [...userClickSequence, newPoint];
      setUserClickSequence(newUserSequence);
      
      // Draw RED click point on canvas for user confirmation
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ff0000'; // RED dots for decode verification
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fill();
        
        // Add white border for visibility
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Add number label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Arial';
        ctx.fillText((userClickSequence.length + 1).toString(), x + 10, y - 10);
      }
      
      toast({
        title: `Verification click ${userClickSequence.length + 1}`,
        description: `Point ${userClickSequence.length + 1} of ${extractedSequence.length} recorded`,
      });

      // Check if sequence is complete
      if (newUserSequence.length === extractedSequence.length) {
        setTimeout(() => verifyClickSequence(newUserSequence), 500); // Small delay to show final dot
      }
    }
  };

  const handleCanvasPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const native = event.nativeEvent as PointerEvent & { offsetX?: number; offsetY?: number };
    let xDisplay = typeof native.offsetX === 'number' ? native.offsetX : event.clientX - rect.left;
    let yDisplay = typeof native.offsetY === 'number' ? native.offsetY : event.clientY - rect.top;

    xDisplay = Math.max(0, Math.min(xDisplay, rect.width));
    yDisplay = Math.max(0, Math.min(yDisplay, rect.height));

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = xDisplay * scaleX;
    const y = yDisplay * scaleY;

    // Encode mode
    if (isSettingSequence && activeTab === 'encode') {
      if (clickSequence.length >= 4) {
        toast({
          title: "Maximum clicks reached",
          description: "You can set a maximum of 4 click points.",
          variant: "destructive",
        });
        return;
      }
      const newPoint = normalizeClickPoint(x, y, canvas.width, canvas.height, clickSequence.length);
      setClickSequence(prev => [...prev, newPoint]);

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.fillText((clickSequence.length + 1).toString(), x + 8, y - 8);
      }
      toast({
        title: `Click point ${clickSequence.length + 1} set`,
        description: `Coordinates: (${Math.round(xDisplay)}, ${Math.round(yDisplay)})`,
      });
    }

    // Decode mode
    if (isVerifyingSequence && activeTab === 'decode') {
      if (userClickSequence.length >= extractedSequence.length) {
        toast({
          title: "Sequence complete",
          description: "You have clicked all required points. Verifying...",
          variant: "destructive",
        });
        return;
      }

      const newPoint = normalizeClickPoint(x, y, canvas.width, canvas.height, userClickSequence.length);
      const newUserSequence = [...userClickSequence, newPoint];
      setUserClickSequence(newUserSequence);

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ff0000'; // RED dots for decode verification
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fill();
        
        // Add white border for visibility
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Arial';
        ctx.fillText((userClickSequence.length + 1).toString(), x + 10, y - 10);
      }
      toast({
        title: `Verification click ${userClickSequence.length + 1}`,
        description: `Point ${userClickSequence.length + 1} of ${extractedSequence.length} recorded`,
      });

      if (newUserSequence.length === extractedSequence.length) {
        setTimeout(() => verifyClickSequence(newUserSequence), 500); // Small delay to show final dot
      }
    }
  };

  const startSettingSequence = () => {
    if (!image) {
      toast({
        title: "No image loaded",
        description: "Please upload an image first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSettingSequence(true);
    setClickSequence([]);
    drawImageOnCanvas(image);
    
    toast({
      title: "Click sequence mode activated",
      description: "Click on the image to set up to 4 authentication points.",
    });
  };

  const finishSettingSequence = () => {
    if (clickSequence.length === 0) {
      toast({
        title: "No clicks set",
        description: "Please set at least one click point.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSettingSequence(false);
    toast({
      title: "Click sequence completed",
      description: `${clickSequence.length} click points set successfully.`,
    });
  };

  const encodeMessageInImage = async () => {
    if (!message.trim()) {
      toast({
        title: "No message",
        description: "Please enter a message to encode.",
        variant: "destructive",
      });
      return;
    }

    if (clickSequence.length === 0) {
      toast({
        title: "No click sequence",
        description: "Please set up click sequence authentication first.",
        variant: "destructive",
      });
      return;
    }

    if (!canvasRef.current) {
      toast({
        title: "No canvas",
        description: "Please upload an image first.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Ensure canvas shows the original image (without any drawn markers)
      // so only imperceptible LSB changes are encoded.
      if (image) {
        drawImageOnCanvas(image);
      }

      const data: SteganographyData = {
        message: message.trim(),
        clickSequence
      };

      const blob = await encodeMessage(canvasRef.current, data);
      setEncodedImage(blob);
      
      toast({
        title: "Message encoded successfully!",
        description: "Your message has been hidden in the image with click sequence authentication.",
      });
    } catch (error) {
      toast({
        title: "Encoding failed",
        description: error instanceof Error ? error.message : "Failed to encode message.",
        variant: "destructive",
      });
    }
  };

  const decodeMessageFromImage = () => {
    if (!canvasRef.current) {
      toast({
        title: "No image",
        description: "Please upload an image to decode.",
        variant: "destructive",
      });
      return;
    }

    try {
      const data = decodeMessage(canvasRef.current);
      
      if (data) {
        // Ensure the sequence is in the correct order (defensive sort)
        const sorted = [...data.clickSequence].sort((a, b) => a.order - b.order);
        setExtractedSequence(sorted);
        setExtractedMessage(data.message);
        setIsVerifyingSequence(false); // Don't auto-start verification
        setUserClickSequence([]);
        setIsAuthenticated(false);
        
        // Redraw image clean for verification
        if (image) {
          drawImageOnCanvas(image);
        }
        
        toast({
          title: "Encoded data found!",
          description: `Found ${sorted.length} authentication points. Click "Start Click Verification" to reveal the message.`,
        });
      } else {
        toast({
          title: "No hidden message found",
          description: "This image doesn't contain any hidden data or the data is corrupted.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Decoding failed",
        description: "Failed to decode message from image.",
        variant: "destructive",
      });
    }
  };

  const verifyClickSequence = (userSequence: ClickPoint[]) => {
    const tolerance = 0.03; // 3% tolerance for click accuracy - more strict
    
    // Ensure we have the same number of clicks
    if (userSequence.length !== extractedSequence.length) {
      resetVerification();
      toast({
        title: "Authentication failed",
        description: "Incorrect number of clicks. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    let isValid = true;
    let failedAtPoint = -1;
    
    for (let i = 0; i < userSequence.length; i++) {
      const userPoint = userSequence[i];
      const expectedPoint = extractedSequence[i];
      
      const xDiff = Math.abs(userPoint.x - expectedPoint.x);
      const yDiff = Math.abs(userPoint.y - expectedPoint.y);
      
      if (xDiff > tolerance || yDiff > tolerance) {
        isValid = false;
        failedAtPoint = i + 1;
        break;
      }
    }
    
    if (isValid) {
      setIsAuthenticated(true);
      setIsVerifyingSequence(false);
      toast({
        title: "🎉 Authentication successful!",
        description: "Click sequence verified perfectly. Message revealed below.",
      });
    } else {
      resetVerification();
      toast({
        title: "❌ Authentication failed",
        description: `Incorrect click at point ${failedAtPoint}. Please try again with exact precision.`,
        variant: "destructive",
      });
    }
  };
  
  const resetVerification = () => {
    setUserClickSequence([]);
    setIsAuthenticated(false);
    setIsVerifyingSequence(true); // Keep verification mode active
    if (image) {
      drawImageOnCanvas(image); // Clear the canvas
    }
  };

  const startVerification = () => {
    if (extractedSequence.length === 0) {
      toast({
        title: "No sequence to verify",
        description: "Please decode an image first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsVerifyingSequence(true);
    setUserClickSequence([]);
    setIsAuthenticated(false);
    
    // Ensure image is redrawn clean for verification
    if (image) {
      drawImageOnCanvas(image);
    }
    
    toast({
      title: "🎯 Verification mode activated",
      description: `Click the ${extractedSequence.length} authentication points in the EXACT sequence and locations. Red dots will show your clicks.`,
    });
  };

  const downloadEncodedImage = () => {
    if (!encodedImage) return;
    
    const url = URL.createObjectURL(encodedImage);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'encoded_image.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Your encoded image is being downloaded.",
    });
  };

  const reset = () => {
    setMessage('');
    setImage(null);
    setClickSequence([]);
    setIsSettingSequence(false);
    setEncodedImage(null);
    setExtractedMessage('');
    setExtractedSequence([]);
    setShowSequence(false);
    setIsVerifyingSequence(false);
    setUserClickSequence([]);
    setIsAuthenticated(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  const handleTabChange = (value: string) => {
    if (activeTab === 'encode' && value === 'decode') {
      // Reset everything when switching from encode to decode
      reset();
    }
    setActiveTab(value);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Message has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy message to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gradient mb-2 leading-tight pb-2">Click Sequence Authentication</h1>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Badge className="bg-green-500 text-white border-transparent">Intermediate</Badge>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Hide messages in images using click-based authentication. Secure your data with pixel coordinates that only you know.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image Upload and Canvas */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MousePointer className="h-5 w-5" />
              Image Canvas
            </CardTitle>
            <CardDescription>
              Upload an image and set click sequence authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Click to upload an image
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports PNG, JPG, and other image formats
                </p>
              </label>
            </div>

            {image && (
              <div className="space-y-4">
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  className={`border rounded-lg max-w-full ${(isSettingSequence || isVerifyingSequence) ? 'cursor-crosshair' : 'cursor-default'}`}
                  style={{ width: '100%', maxWidth: '600px', height: 'auto', maxHeight: '400px', pointerEvents: 'auto' }}
                />
                
                <div className="flex gap-2 flex-wrap">
                  {!isSettingSequence ? (
                    <Button onClick={startSettingSequence} variant="outline">
                      <MousePointer className="h-4 w-4 mr-2" />
                      Set Click Sequence
                    </Button>
                  ) : (
                    <Button onClick={finishSettingSequence} variant="outline">
                      Finish Sequence ({clickSequence.length}/4)
                    </Button>
                  )}
                  
                  <Button onClick={reset} variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>

                {clickSequence.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Click sequence: {clickSequence.length} point{clickSequence.length !== 1 ? 's' : ''} set
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Steganography Operations */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle>Steganography Operations</CardTitle>
            <CardDescription>
              Encode messages with click authentication or decode hidden messages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="encode" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Encode
                </TabsTrigger>
                <TabsTrigger value="decode" className="flex items-center gap-2">
                  <Unlock className="h-4 w-4" />
                  Decode
                </TabsTrigger>
              </TabsList>

              <TabsContent value="encode" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="message">Secret Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Enter your secret message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[100px] input-cyber"
                  />
                  <p className="text-xs text-muted-foreground">
                    Message length: {message.length} characters
                  </p>
                </div>

                <Button
                  onClick={encodeMessageInImage}
                  disabled={!message.trim() || clickSequence.length === 0 || !image}
                  className="w-full"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Encode Message
                </Button>

                {encodedImage && (
                  <Button
                    onClick={downloadEncodedImage}
                    variant="secondary"
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Encoded Image
                  </Button>
                )}
              </TabsContent>

              <TabsContent value="decode" className="space-y-4">
                <Button
                  onClick={decodeMessageFromImage}
                  disabled={!image}
                  className="w-full"
                >
                  <Unlock className="h-4 w-4 mr-2" />
                  Decode Message
                </Button>

                {extractedSequence.length > 0 && !isAuthenticated && (
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-muted/50">
                      <h4 className="font-medium mb-2">Authentication Required</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Click the {extractedSequence.length} authentication points in the correct sequence to reveal the hidden message.
                      </p>
                      
                      {!isVerifyingSequence ? (
                        <Button onClick={startVerification} className="w-full">
                          <MousePointer className="h-4 w-4 mr-2" />
                          Start Click Verification
                        </Button>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">
                            Progress: {userClickSequence.length} / {extractedSequence.length} clicks
                          </p>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${(userClickSequence.length / extractedSequence.length) * 100}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Click on the image above to set authentication points
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Only show extracted message if authenticated */}
                {isAuthenticated && extractedMessage && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Extracted Message</Label>
                      <div className="relative">
                        <Textarea
                          value={extractedMessage}
                          readOnly
                          className="min-h-[100px] input-cyber"
                        />
                        <Button
                          onClick={() => copyToClipboard(extractedMessage)}
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {extractedSequence.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label>Click Sequence</Label>
                          <Button
                            onClick={() => setShowSequence(!showSequence)}
                            variant="ghost"
                            size="sm"
                          >
                            {showSequence ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        {showSequence && (
                          <div className="text-sm text-muted-foreground space-y-1">
                            {extractedSequence.map((point, index) => (
                              <div key={index}>
                                Point {index + 1}: ({(point.x * 100).toFixed(1)}%, {(point.y * 100).toFixed(1)}%)
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <Card className="card-glow mt-8">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">How Click Sequence Authentication Works</CardTitle>
          <CardDescription className="text-base">
            Understanding pixel-based steganography with authentication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-secondary-foreground font-bold mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Upload Image</h3>
              <p className="text-sm text-muted-foreground">Select an image that will serve as the carrier for your secret message</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-secondary-foreground font-bold mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">Set Click Points</h3>
              <p className="text-sm text-muted-foreground">Click on specific pixels to create an authentication sequence</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-secondary-foreground font-bold mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Encode Message</h3>
              <p className="text-sm text-muted-foreground">Hide your message and click sequence using LSB steganography</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-secondary-foreground font-bold mb-4">
                4
              </div>
              <h3 className="font-semibold mb-2">Decode Later</h3>
              <p className="text-sm text-muted-foreground">Extract both the message and authentication sequence from the image</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
