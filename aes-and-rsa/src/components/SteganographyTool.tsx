import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Upload, Download, Image, AlertTriangle } from "lucide-react";
import { SteganographyUtils } from "@/lib/crypto";
import { useToast } from "@/hooks/use-toast";

export const SteganographyTool = () => {
  const [mode, setMode] = useState<"hide" | "extract">("hide");
  const [secretText, setSecretText] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = document.createElement('img');
          img.onload = () => {
            setOriginalImage(e.target?.result as string);
            drawImageOnCanvas(img);
          };
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file (PNG, JPG, etc.)",
          variant: "destructive",
        });
      }
    }
  };

  const drawImageOnCanvas = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to image size (max 800px for performance)
    const maxSize = 800;
    const ratio = Math.min(maxSize / img.width, maxSize / img.height);
    canvas.width = img.width * ratio;
    canvas.height = img.height * ratio;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };

  const hideText = async () => {
    if (!secretText || !canvasRef.current) {
      toast({
        title: "Missing Information",
        description: "Please provide text and upload an image.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const canvas = canvasRef.current;
      const processedImageData = SteganographyUtils.hideTextInImage(canvas, secretText, password);
      setProcessedImage(processedImageData);
      toast({
        title: "Text Hidden Successfully",
        description: "Your secret text has been embedded in the image.",
      });
    } catch (error) {
      toast({
        title: "Steganography Failed",
        description: "An error occurred while hiding the text.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const extractText = async () => {
    if (!canvasRef.current) {
      toast({
        title: "No Image Available",
        description: "Please upload an image to extract text from.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const canvas = canvasRef.current;
      const extracted = SteganographyUtils.extractTextFromImage(canvas, password);
      setExtractedText(extracted);
      toast({
        title: "Text Extracted",
        description: extracted ? "Hidden text found in the image." : "No hidden text found.",
      });
    } catch (error) {
      toast({
        title: "Extraction Failed",
        description: "An error occurred while extracting text.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.download = 'steganography_image.png';
    link.href = processedImage;
    link.click();
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Control Panel */}
      <div className="space-y-6">
        {/* Mode Selection */}
        <Card className="bg-card/80 border-border/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-cyber-primary" />
              <span>Steganography Tool</span>
              <Badge variant="secondary">Hide in Plain Sight</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Button
                variant={mode === "hide" ? "default" : "outline"}
                onClick={() => setMode("hide")}
                className={mode === "hide" ? "bg-gradient-cyber" : ""}
              >
                <EyeOff className="h-4 w-4 mr-2" />
                Hide Text
              </Button>
              <Button
                variant={mode === "extract" ? "default" : "outline"}
                onClick={() => setMode("extract")}
                className={mode === "extract" ? "bg-gradient-cyber" : ""}
              >
                <Eye className="h-4 w-4 mr-2" />
                Extract Text
              </Button>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Upload Image</Label>
              <div className="flex space-x-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                  className="bg-input/50"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Password (Optional) */}
            <div className="space-y-2">
              <Label>Password (Optional)</Label>
              <Input
                type="password"
                placeholder="Optional encryption password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input/50"
              />
            </div>

            {mode === "hide" ? (
              <>
                {/* Secret Text Input */}
                <div className="space-y-2">
                  <Label>Secret Text to Hide</Label>
                  <Textarea
                    placeholder="Enter your secret message..."
                    value={secretText}
                    onChange={(e) => setSecretText(e.target.value)}
                    rows={4}
                    className="bg-input/50"
                  />
                  <div className="text-xs text-muted-foreground">
                    {secretText.length} characters
                  </div>
                </div>

                <Button
                  onClick={hideText}
                  disabled={isProcessing || !secretText || !originalImage}
                  className="w-full bg-gradient-cyber hover:shadow-glow-cyber"
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      <span>Hiding Text...</span>
                    </div>
                  ) : (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Hide Text in Image
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={extractText}
                  disabled={isProcessing || !originalImage}
                  className="w-full bg-gradient-cyber hover:shadow-glow-cyber"
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      <span>Extracting Text...</span>
                    </div>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Extract Hidden Text
                    </>
                  )}
                </Button>

                {/* Extracted Text Display */}
                {extractedText && (
                  <div className="space-y-2">
                    <Label>Extracted Secret Text</Label>
                    <Textarea
                      value={extractedText}
                      readOnly
                      rows={4}
                      className="bg-input/50 font-mono"
                    />
                  </div>
                )}
              </>
            )}

            {/* Security Warning */}
            <div className="flex items-start space-x-2 p-3 bg-muted/50 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium">Steganography Note:</p>
                <p>This technique hides data in the least significant bits of image pixels. Use lossless formats (PNG) for best results.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Image Preview */}
      <Card className="bg-card/80 border-border/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Image className="h-5 w-5 text-cyber-primary" />
              <span>Image Preview</span>
            </div>
            {processedImage && (
              <Button variant="outline" size="sm" onClick={downloadImage}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {originalImage ? (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Original Image</Label>
                  <img
                    src={originalImage}
                    alt="Original"
                    className="w-full max-w-md mx-auto rounded-lg border border-border"
                  />
                </div>
                
                {processedImage && mode === "hide" && (
                  <div>
                    <Label className="text-sm font-medium">Image with Hidden Text</Label>
                    <img
                      src={processedImage}
                      alt="With hidden text"
                      className="w-full max-w-md mx-auto rounded-lg border border-border"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-lg">
                <div className="text-center">
                  <Image className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Upload an image to get started</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hidden Canvas for Processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};