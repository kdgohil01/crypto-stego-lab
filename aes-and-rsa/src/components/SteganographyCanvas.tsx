import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, MousePointer, Eye, Download, Check, X, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ClickPoint {
  x: number;
  y: number;
  id: number;
}

interface SteganographyCanvasProps {
  encryptedData: string;
  onAuthSuccess: (extractedData: string) => void;
  onAuthFailure: () => void;
  isActive: boolean;
}

export const SteganographyCanvas = ({ encryptedData, onAuthSuccess, onAuthFailure, isActive }: SteganographyCanvasProps) => {
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [stegoImage, setStegoImage] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [authMode, setAuthMode] = useState<"setup" | "authenticate" | "idle">("idle");
  const [clickSequence, setClickSequence] = useState<ClickPoint[]>([]);
  const [correctSequence, setCorrectSequence] = useState<ClickPoint[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [authStatus, setAuthStatus] = useState<"idle" | "success" | "failed">("idle");
  const [isHiding, setIsHiding] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();

  const maxAttempts = 3;
  const requiredPoints = 4;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setCoverImage(file);
      setAuthMode("idle");
      setClickSequence([]);
      setCorrectSequence([]);
      setAttempts(0);
      setAuthStatus("idle");
    }
  };

  const hideDataInImage = async () => {
    if (!coverImage || !encryptedData) return;

    setIsHiding(true);
    try {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) throw new Error("Canvas not available");

      // Load the cover image
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = URL.createObjectURL(coverImage);
      });

      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Convert encrypted data to binary
      const dataToHide = encryptedData + "|||END|||"; // Add delimiter
      const binaryData = dataToHide.split('').map(char => 
        char.charCodeAt(0).toString(2).padStart(8, '0')
      ).join('');

      // Hide data in LSB of red channel
      let dataIndex = 0;
      for (let i = 0; i < data.length && dataIndex < binaryData.length; i += 4) {
        // Modify the least significant bit of the red channel
        data[i] = (data[i] & 0xFE) | parseInt(binaryData[dataIndex]);
        dataIndex++;
      }

      // Put modified image data back
      ctx.putImageData(imageData, 0, 0);

      // Convert to data URL for display
      const stegoDataUrl = canvas.toDataURL('image/png');
      setStegoImage(stegoDataUrl);
      setImageLoaded(true);
      setAuthMode("setup");

      toast({
        title: "Data Hidden Successfully",
        description: "Encrypted data has been embedded in the image. Set up click authentication.",
      });

    } catch (error) {
      toast({
        title: "Steganography Failed",
        description: "Failed to hide data in the image.",
        variant: "destructive",
      });
    } finally {
      setIsHiding(false);
    }
  };

  const extractDataFromImage = async (): Promise<string> => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) throw new Error("Canvas not available");

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Extract binary data from LSB of red channel
    let binaryData = '';
    for (let i = 0; i < data.length; i += 4) {
      binaryData += (data[i] & 1).toString();
    }

    // Convert binary to text
    let extractedData = '';
    for (let i = 0; i < binaryData.length; i += 8) {
      const byte = binaryData.substr(i, 8);
      if (byte.length === 8) {
        const char = String.fromCharCode(parseInt(byte, 2));
        extractedData += char;
        
        // Check for end delimiter
        if (extractedData.endsWith("|||END|||")) {
          return extractedData.replace("|||END|||", "");
        }
      }
    }

    throw new Error("No hidden data found or data corrupted");
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isActive || authStatus !== "idle" || !imageLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = ((e.clientX - rect.left) * scaleX / canvas.width) * 100;
    const y = ((e.clientY - rect.top) * scaleY / canvas.height) * 100;

    if (authMode === "setup") {
      if (correctSequence.length < requiredPoints) {
        const newPoint: ClickPoint = { x, y, id: correctSequence.length + 1 };
        setCorrectSequence(prev => [...prev, newPoint]);
        
        if (correctSequence.length + 1 === requiredPoints) {
          setAuthMode("authenticate");
          toast({
            title: "Authentication Ready",
            description: "Now click the points in the same sequence to extract data.",
          });
        }
      }
    } else if (authMode === "authenticate") {
      if (clickSequence.length < requiredPoints) {
        const newPoint: ClickPoint = { x, y, id: clickSequence.length + 1 };
        setClickSequence(prev => [...prev, newPoint]);

        if (clickSequence.length + 1 === requiredPoints) {
          verifySequence([...clickSequence, newPoint]);
        }
      }
    }
  };

  const verifySequence = async (sequence: ClickPoint[]) => {
    const tolerance = 5; // 5% tolerance for click position
    let isValid = true;

    for (let i = 0; i < requiredPoints; i++) {
      const correct = correctSequence[i];
      const clicked = sequence[i];
      
      const xDiff = Math.abs(correct.x - clicked.x);
      const yDiff = Math.abs(correct.y - clicked.y);
      
      if (xDiff > tolerance || yDiff > tolerance) {
        isValid = false;
        break;
      }
    }

    if (isValid) {
      setAuthStatus("success");
      try {
        const extractedData = await extractDataFromImage();
        toast({
          title: "Authentication Successful",
          description: "Hidden data extracted successfully!",
        });
        setTimeout(() => onAuthSuccess(extractedData), 1000);
      } catch (error) {
        toast({
          title: "Extraction Failed",
          description: "Failed to extract hidden data.",
          variant: "destructive",
        });
        onAuthFailure();
      }
    } else {
      setAttempts(prev => prev + 1);
      setClickSequence([]);
      
      if (attempts + 1 >= maxAttempts) {
        setAuthStatus("failed");
        toast({
          title: "Authentication Failed",
          description: "Maximum attempts exceeded. Access denied.",
          variant: "destructive",
        });
        setTimeout(() => onAuthFailure(), 1000);
      } else {
        toast({
          title: "Sequence Incorrect",
          description: `Try again. ${maxAttempts - (attempts + 1)} attempts remaining.`,
          variant: "destructive",
        });
      }
    }
  };

  const downloadStegoImage = () => {
    if (!stegoImage) return;
    
    const link = document.createElement('a');
    link.download = 'steganographic_image.png';
    link.href = stegoImage;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderClickPoint = (point: ClickPoint, isCorrect: boolean = false) => {
    if (!canvasRef.current) return null;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    return (
      <div
        key={`${isCorrect ? 'correct' : 'clicked'}-${point.id}`}
        className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
        style={{ 
          left: `${(point.x * canvas.width / 100) * (rect.width / canvas.width)}px`, 
          top: `${(point.y * canvas.height / 100) * (rect.height / canvas.height)}px` 
        }}
      >
        <div className={`relative flex items-center justify-center w-6 h-6 rounded-full border-2 text-xs font-bold ${
          isCorrect 
            ? "bg-cyber-primary/80 border-cyber-primary text-primary-foreground" 
            : authStatus === "success" 
              ? "bg-cyber-secondary/80 border-cyber-secondary text-primary-foreground"
              : authStatus === "failed"
                ? "bg-destructive/80 border-destructive text-primary-foreground"
                : "bg-muted/80 border-muted-foreground text-muted-foreground"
        }`}>
          {point.id}
          {isCorrect && authMode === "setup" && (
            <div className="absolute -inset-1 rounded-full border border-cyber-primary/50 animate-ping" />
          )}
        </div>
      </div>
    );
  };

  if (!isActive) return null;

  return (
    <Card className="bg-card/80 border-border/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-cyber-primary" />
            <span>Steganographic Security Layer</span>
            <Badge variant="outline" className="bg-cyber-primary/10 text-cyber-primary border-cyber-primary/50">
              Image + 4-Point Auth
            </Badge>
          </div>
          {stegoImage && (
            <Button variant="outline" size="sm" onClick={downloadStegoImage}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!coverImage && (
          <div className="space-y-2">
            <Label htmlFor="cover-image">Select Cover Image</Label>
            <Input
              id="cover-image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="bg-input/50"
            />
          </div>
        )}

        {coverImage && !stegoImage && (
          <Button 
            onClick={hideDataInImage} 
            disabled={isHiding}
            className="w-full bg-gradient-cyber hover:shadow-glow-cyber"
          >
            {isHiding ? (
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                <span>Hiding Data in Image...</span>
              </div>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Hide Data in Image
              </>
            )}
          </Button>
        )}

        {imageLoaded && stegoImage && (
          <>
            {/* Status */}
            <div className="flex items-center justify-between">
              <div className="text-sm">
                {authMode === "setup" ? (
                  <span className="text-muted-foreground">
                    Click {requiredPoints} points on the image to set authentication ({correctSequence.length}/{requiredPoints})
                  </span>
                ) : authMode === "authenticate" ? (
                  <span className="text-muted-foreground">
                    Click the sequence to extract hidden data ({clickSequence.length}/{requiredPoints})
                  </span>
                ) : (
                  <span className="text-muted-foreground">
                    Data hidden in image. Ready for authentication.
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  Attempt {attempts + 1}/{maxAttempts}
                </Badge>
                {authStatus === "success" && (
                  <Check className="h-4 w-4 text-cyber-secondary" />
                )}
                {authStatus === "failed" && (
                  <X className="h-4 w-4 text-destructive" />
                )}
              </div>
            </div>

            {/* Progress */}
            {authMode !== "idle" && (
              <Progress 
                value={authMode === "setup" 
                  ? (correctSequence.length / requiredPoints) * 100 
                  : (clickSequence.length / requiredPoints) * 100
                } 
                className="w-full" 
              />
            )}

            {/* Canvas Container */}
            <div className="relative border-2 border-dashed border-cyber-primary/50 rounded-lg overflow-hidden">
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className={`max-w-full h-auto cursor-pointer transition-all duration-300 ${
                  authStatus === "success" ? "border-cyber-secondary" :
                  authStatus === "failed" ? "border-destructive" :
                  "hover:brightness-110"
                }`}
                style={{ display: 'block', margin: '0 auto' }}
              />
              
              {/* Render click points */}
              {authMode === "setup" && correctSequence.map(point => renderClickPoint(point, true))}
              {authMode === "authenticate" && clickSequence.map(point => renderClickPoint(point, false))}
              
              {/* Status overlay */}
              {authStatus !== "idle" && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    {authStatus === "success" && (
                      <>
                        <Check className="h-12 w-12 mx-auto text-cyber-secondary" />
                        <div className="text-lg text-cyber-secondary font-medium">
                          Data Extracted Successfully
                        </div>
                      </>
                    )}
                    {authStatus === "failed" && (
                      <>
                        <AlertTriangle className="h-12 w-12 mx-auto text-destructive" />
                        <div className="text-lg text-destructive font-medium">
                          Access Denied
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• Click 4 points on the steganographic image to set authentication</div>
              <div>• Remember the sequence - you'll need it to extract the hidden data</div>
              <div>• You have {maxAttempts} attempts to authenticate correctly</div>
              <div>• Data is hidden using LSB steganography in the red channel</div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};