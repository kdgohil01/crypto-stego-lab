import { useState, useRef } from "react";
import { Upload, Download, Eye, EyeOff, RotateCcw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

// Simple LSB Steganography implementation
const hideTextInImage = (canvas: HTMLCanvasElement, text: string): string => {
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Convert text to binary with end marker
  const binaryText = (text + '\0').split('').map(char => 
    char.charCodeAt(0).toString(2).padStart(8, '0')
  ).join('');
  
  // Hide binary data in LSBs of red channel
  for (let i = 0; i < binaryText.length; i++) {
    if (i * 4 < data.length) {
      const bit = parseInt(binaryText[i]);
      data[i * 4] = (data[i * 4] & 0xFE) | bit; // Modify LSB of red channel
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
};

const extractTextFromImage = (canvas: HTMLCanvasElement): string => {
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  let binaryText = '';
  let text = '';
  
  // Extract LSBs from red channel
  for (let i = 0; i < data.length; i += 4) {
    binaryText += (data[i] & 1).toString();
    
    // Process every 8 bits
    if (binaryText.length % 8 === 0) {
      const charCode = parseInt(binaryText.slice(-8), 2);
      if (charCode === 0) break; // End marker
      text += String.fromCharCode(charCode);
    }
  }
  
  return text;
};

export default function TextInImage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [secretText, setSecretText] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [processedImageUrl, setProcessedImageUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setProcessedImageUrl("");
      setExtractedText("");
    }
  };

  const loadImageToCanvas = (imageSrc: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        resolve();
      };
      img.onerror = reject;
      img.src = imageSrc;
    });
  };

  const hideText = async () => {
    if (!selectedFile || !secretText.trim()) {
      toast({
        title: "Missing data",
        description: "Please select an image and enter text to hide",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      await loadImageToCanvas(previewUrl);
      const canvas = canvasRef.current!;
      const resultUrl = hideTextInImage(canvas, secretText);
      setProcessedImageUrl(resultUrl);
      
      toast({
        title: "Success!",
        description: "Text has been hidden in the image",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to hide text in image",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const extractText = async () => {
    if (!selectedFile) {
      toast({
        title: "Missing image",
        description: "Please select an image to extract text from",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      await loadImageToCanvas(previewUrl);
      const canvas = canvasRef.current!;
      const extracted = extractTextFromImage(canvas);
      
      if (extracted) {
        setExtractedText(extracted);
        toast({
          title: "Text extracted!",
          description: `Found hidden text: "${extracted.substring(0, 30)}${extracted.length > 30 ? '...' : ''}"`,
        });
      } else {
        setExtractedText("");
        toast({
          title: "No text found",
          description: "No hidden text detected in this image",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to extract text from image",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadProcessedImage = () => {
    if (!processedImageUrl) return;
    
    const link = document.createElement('a');
    link.href = processedImageUrl;
    link.download = `hidden_text_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setSecretText("");
    setExtractedText("");
    setProcessedImageUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gradient mb-2">Text in Image Steganography</h1>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Badge className="bg-blue-500 text-white border-transparent">Beginner</Badge>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Hide secret messages inside images using LSB (Least Significant Bit) manipulation. The changes are invisible to the naked eye.
        </p>
      </div>

      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Image Steganography Tool
            <Button variant="outline" size="sm" onClick={reset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </CardTitle>
          <CardDescription>
            Upload an image to hide text inside it or extract hidden text from an image
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* File Upload */}
          <div className="mb-6">
            <Label htmlFor="image-upload">Select Image</Label>
            <div 
              className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-w-full max-h-48 mx-auto rounded"
                />
              ) : (
                <div className="space-y-2">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">Click to upload an image</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, or GIF files</p>
                </div>
              )}
            </div>
          </div>

          <Tabs defaultValue="hide" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="hide" className="gap-2">
                <EyeOff className="h-4 w-4" />
                Hide Text
              </TabsTrigger>
              <TabsTrigger value="extract" className="gap-2">
                <Eye className="h-4 w-4" />
                Extract Text
              </TabsTrigger>
            </TabsList>

            <TabsContent value="hide" className="space-y-4">
              <div>
                <Label htmlFor="secret-text">Secret Message</Label>
                <Textarea
                  id="secret-text"
                  placeholder="Enter the secret message to hide..."
                  value={secretText}
                  onChange={(e) => setSecretText(e.target.value)}
                  className="input-cyber min-h-[100px]"
                />
              </div>
              
              <Button 
                onClick={hideText} 
                disabled={!selectedFile || !secretText.trim() || isProcessing}
                className="w-full btn-hero"
              >
                {isProcessing ? "Processing..." : "Hide Text in Image"}
              </Button>

              {processedImageUrl && (
                <Card className="bg-secondary/10 border-secondary/20">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <h3 className="font-semibold text-secondary">Image with Hidden Text</h3>
                      <img 
                        src={processedImageUrl} 
                        alt="Processed" 
                        className="max-w-full max-h-48 mx-auto rounded border"
                      />
                      <Button 
                        onClick={downloadProcessedImage}
                        className="gap-2 bg-secondary hover:bg-secondary/90"
                      >
                        <Download className="h-4 w-4" />
                        Download Image
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="extract" className="space-y-4">
              <Button 
                onClick={extractText} 
                disabled={!selectedFile || isProcessing}
                className="w-full btn-hero"
              >
                {isProcessing ? "Processing..." : "Extract Hidden Text"}
              </Button>

              {extractedText && (
                <Card className="bg-accent/10 border-accent/20">
                  <CardContent className="pt-6">
                    <Label htmlFor="extracted-text">Extracted Message</Label>
                    <Textarea
                      id="extracted-text"
                      value={extractedText}
                      readOnly
                      className="input-cyber min-h-[100px] mt-2"
                    />
                  </CardContent>
                </Card>
              )}

              {extractedText === "" && selectedFile && (
                <Card className="bg-muted/20 border-border/30">
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">No hidden text found in this image.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Info Panel */}
          <Card className="mt-6 bg-muted/20 border-border/30">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">How LSB Steganography Works:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Modifies the least significant bit of each pixel's red channel</li>
                <li>• Changes are virtually invisible to the human eye</li>
                <li>• Can hide approximately 1 character per 8 pixels</li>
                <li>• Works best with PNG format (lossless compression)</li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}