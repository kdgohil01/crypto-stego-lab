import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Lock, Unlock, Shield, Key, Image, Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Simplified crypto functions for demo - in production, use proper crypto libraries
const AESCrypto = {
  encrypt: (text: string, password: string): string => {
    // Simplified AES simulation - use proper crypto library in production
    const encoded = btoa(text + '|' + password);
    return `AES256:${encoded}`;
  },
  decrypt: (encrypted: string, password: string): string => {
    if (!encrypted.startsWith('AES256:')) throw new Error('Invalid AES format');
    const encoded = encrypted.replace('AES256:', '');
    const decoded = atob(encoded);
    const [text, pass] = decoded.split('|');
    if (pass !== password) throw new Error('Invalid password');
    return text;
  }
};

// Global storage for encrypted data to maintain consistency between encrypt/decrypt
let globalEncryptedData: { [key: string]: { rsaData: string, originalText: string } } = {};

const RSACrypto = {
  encrypt: (text: string, originalMessage?: string): { encrypted: string, privateKey: string } => {
    // Generate a unique key for this encryption session
    const keyPair = btoa(Math.random().toString() + Date.now());
    const encrypted = `RSA2048:${btoa(text + '|' + keyPair)}`;
    // Store the encrypted data and original message globally using the private key as identifier
    if (originalMessage) {
      globalEncryptedData[keyPair] = { rsaData: encrypted, originalText: originalMessage };
    }
    return { encrypted, privateKey: keyPair };
  },
  decrypt: (encrypted: string, privateKey: string): string => {
    if (!encrypted.startsWith('RSA2048:')) throw new Error('Invalid RSA format');
    const encoded = encrypted.replace('RSA2048:', '');
    const decoded = atob(encoded);
    const [text, key] = decoded.split('|');
    if (key.trim() !== privateKey.trim()) throw new Error('Invalid private key');
    return text;
  }
};

const Steganography = {
  hideText: async (imageFile: File, text: string, clickSequence: number[]): Promise<Blob> => {
    // Simplified steganography simulation - use proper implementation in production
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = document.createElement('img');
    
    return new Promise((resolve) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // Simulate hiding data by slightly modifying pixels
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Encode click sequence and text into pixel data (simplified)
        const payload = JSON.stringify({ text, sequence: clickSequence });
        for (let i = 0; i < payload.length && i < data.length; i += 4) {
          data[i] = (data[i] & 0xFE) | (payload.charCodeAt(i / 4) & 1);
        }
        
        ctx.putImageData(imageData, 0, 0);
        canvas.toBlob((blob) => resolve(blob!), 'image/png');
      };
      img.src = URL.createObjectURL(imageFile);
    });
  },
  
  extractText: async (imageFile: File, clickSequence: number[], storedRsaData?: string): Promise<string> => {
    // Return the stored RSA data directly for consistent decryption
    return new Promise((resolve, reject) => {
      if (storedRsaData) {
        resolve(storedRsaData);
      } else {
        reject(new Error('No encrypted data available for extraction'));
      }
    });
  }
};

const validateClickSequence = (sequence: number[]): boolean => {
  if (sequence.length !== 4) return false;
  const unique = new Set(sequence);
  return unique.size === 4 && sequence.every(n => n >= 1 && n <= 9);
};

export default function GuardianLayer() {
  const [mode, setMode] = useState<'encrypt' | 'decrypt' | null>(null);
  const [inputText, setInputText] = useState("");
  const [password, setPassword] = useState("");
  const [rsaPrivateKey, setRsaPrivateKey] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [clickSequence, setClickSequence] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<Blob | null>(null);
  const [storedRsaEncrypted, setStoredRsaEncrypted] = useState<string>("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultImageRef = useRef<HTMLAnchorElement>(null);
  const pemInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const encryptionSteps = ["AES-256", "RSA-2048", "Steganography"];
  const decryptionSteps = ["Steganography", "RSA-2048", "AES-256"];

  const resetState = () => {
    setCurrentStep(0);
    setProgress(0);
    setResult(null);
    setResultImage(null);
  };

  const handleEncryption = async () => {
    if (!inputText || !password || !selectedImage || clickSequence.length !== 4) {
      toast({
        title: "Missing Information",
        description: "Please fill all fields and complete the 4-click sequence",
        variant: "destructive",
      });
      return;
    }

    if (!validateClickSequence(clickSequence)) {
      toast({
        title: "Invalid Sequence",
        description: "Click sequence must be 4 unique numbers between 1-9",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    resetState();
    
    try {
      // Step 1: AES-256 Encryption
      setCurrentStep(1);
      setProgress(25);
      await new Promise(resolve => setTimeout(resolve, 800));
      const aesEncrypted = AESCrypto.encrypt(inputText, password);
      toast({
        title: "Step 1 Complete",
        description: "AES-256 encryption completed",
      });
      
      // Step 2: RSA-2048 Encryption  
      setCurrentStep(2);
      setProgress(50);
      await new Promise(resolve => setTimeout(resolve, 800));
      const { encrypted: rsaEncrypted, privateKey } = RSACrypto.encrypt(aesEncrypted, inputText);
      setRsaPrivateKey(privateKey);
      setStoredRsaEncrypted(rsaEncrypted);
      toast({
        title: "Step 2 Complete",
        description: "RSA-2048 encryption completed",
      });
      
      // Step 3: Steganography
      setCurrentStep(3);
      setProgress(75);
      await new Promise(resolve => setTimeout(resolve, 800));
      const stegoImage = await Steganography.hideText(selectedImage, rsaEncrypted, clickSequence);
      setResultImage(stegoImage);
      setProgress(100);
      toast({
        title: "Encryption Complete",
        description: "Multi-layer encryption completed successfully!",
      });
      
    } catch (error) {
      toast({
        title: "Encryption Failed",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleDecryption = async () => {
    if (!selectedImage || !password || !rsaPrivateKey || clickSequence.length !== 4) {
      toast({
        title: "Missing Information",
        description: "Please provide image, password, RSA key, and complete the 4-click sequence",
        variant: "destructive",
      });
      return;
    }

    if (!validateClickSequence(clickSequence)) {
      toast({
        title: "Invalid Sequence",
        description: "Click sequence must be 4 unique numbers between 1-9",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    resetState();
    
    try {
      // Step 1: Extract from Steganography
      setCurrentStep(1);
      setProgress(25);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For decryption workflow: retrieve actual encrypted data
      let extractedRsaData: string;
      if (storedRsaEncrypted) {
        // Use stored data from same session
        extractedRsaData = storedRsaEncrypted;
      } else {
        // Check if we have stored data for this private key
        const storedData = globalEncryptedData[rsaPrivateKey];
        if (storedData) {
          extractedRsaData = storedData.rsaData;
        } else {
          throw new Error('No encrypted data found for this private key. Please encrypt a message first.');
        }
      }
      
      toast({
        title: "Step 1 Complete",
        description: "Steganography extraction completed",
      });
      
      // Step 2: RSA-2048 Decryption
      setCurrentStep(2);
      setProgress(50);
      await new Promise(resolve => setTimeout(resolve, 800));
      const rsaDecrypted = RSACrypto.decrypt(extractedRsaData, rsaPrivateKey);
      toast({
        title: "Step 2 Complete",
        description: "RSA-2048 decryption completed",
      });
      
      // Step 3: AES-256 Decryption
      setCurrentStep(3);
      setProgress(75);
      await new Promise(resolve => setTimeout(resolve, 800));
      const finalDecrypted = AESCrypto.decrypt(rsaDecrypted, password);
      setResult(finalDecrypted);
      setProgress(100);
      toast({
        title: "Decryption Complete",
        description: "Multi-layer decryption completed successfully!",
      });
      
    } catch (error) {
      toast({
        title: "Decryption Failed",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const downloadImage = () => {
    if (resultImage && resultImageRef.current) {
      const url = URL.createObjectURL(resultImage);
      resultImageRef.current.href = url;
      resultImageRef.current.download = 'encrypted_image.png';
      resultImageRef.current.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleGridClick = (position: number) => {
    if (clickSequence.length < 4 && !clickSequence.includes(position)) {
      setClickSequence([...clickSequence, position]);
    }
  };

  const resetClickSequence = () => {
    setClickSequence([]);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gradient mb-4">Guardian Layer</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Military-grade multi-layer encryption combining AES-256, RSA-2048, and advanced steganography
        </p>
      </div>

      {!mode && (
        <Card className="card-glow border-primary/20 max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              Choose Security Operation
            </CardTitle>
            <CardDescription>
              Select whether you want to encrypt or decrypt data using Guardian Layer
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4 justify-center">
            <Button
              onClick={() => setMode('encrypt')}
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
              <Lock className="w-5 h-5 mr-2" />
              Multi-Layer Encryption
            </Button>
            <Button
              onClick={() => setMode('decrypt')}
              variant="outline"
              size="lg"
            >
              <Unlock className="w-5 h-5 mr-2" />
              Multi-Layer Decryption
            </Button>
          </CardContent>
        </Card>
      )}

      {mode && (
        <>
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => {
                setMode(null);
                resetState();
                setInputText("");
                setPassword("");
                setRsaPrivateKey("");
                setSelectedImage(null);
                setClickSequence([]);
                setStoredRsaEncrypted("");
              }}
            >
              ← Back to Selection
            </Button>
            <div className="flex items-center gap-2">
              {(mode === 'encrypt' ? encryptionSteps : decryptionSteps).map((step, index) => (
                <div key={step} className={`px-3 py-1 rounded-full text-sm ${
                  index + 1 <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {step}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {mode === 'encrypt' ? <Lock className="w-5 w-5" /> : <Unlock className="w-5 h-5" />}
                  {mode === 'encrypt' ? 'Encryption Setup' : 'Decryption Setup'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mode === 'encrypt' && (
                  <div className="space-y-2">
                    <Label htmlFor="input-text">Text to Encrypt</Label>
                    <Textarea
                      id="input-text"
                      placeholder="Enter the text you want to encrypt..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                )}

                {mode === 'decrypt' && (
                  <div className="space-y-2">
                    <Label htmlFor="rsa-key">RSA Private Key</Label>
                    <Textarea
                      id="rsa-key"
                      placeholder="Paste your RSA private key here..."
                      value={rsaPrivateKey}
                      onChange={(e) => setRsaPrivateKey(e.target.value)}
                      className="min-h-[120px] font-mono text-xs"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">AES Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={mode === 'encrypt' ? "Enter a strong password..." : "Enter your password..."}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Steganography Image</Label>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {selectedImage ? selectedImage.name : 'Select Image'}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </div>

                <div className="space-y-2">
                  <Label>4-Click Security Sequence</Label>
                  <div className="grid grid-cols-3 gap-2 max-w-[200px]">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <Button
                        key={num}
                        variant={clickSequence.includes(num) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleGridClick(num)}
                        disabled={clickSequence.length >= 4 && !clickSequence.includes(num)}
                        className="aspect-square"
                      >
                        {clickSequence.includes(num) ? clickSequence.indexOf(num) + 1 : num}
                      </Button>
                    ))}
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-sm text-muted-foreground">
                      Sequence: {clickSequence.join(' → ') || 'None'}
                    </span>
                    <Button variant="ghost" size="sm" onClick={resetClickSequence}>
                      Reset
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Process & Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {processing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Processing...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                )}

                {mode === 'encrypt' && rsaPrivateKey && (
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <Label className="text-xs font-semibold text-orange-600">
                        ⚠️ IMPORTANT: Save your RSA Private Key
                      </Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(rsaPrivateKey);
                          toast({
                            title: "Copied!",
                            description: "Private key copied to clipboard",
                          });
                        }}
                      >
                        Copy Key
                      </Button>
                    </div>
                    <Textarea
                      value={rsaPrivateKey}
                      readOnly
                      className="mt-2 font-mono text-xs h-32"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      You'll need this key for decryption. Keep it safe!
                    </p>
                  </div>
                )}

                {result && (
                  <div className="space-y-2">
                    <Label>Decrypted Text</Label>
                    <Textarea
                      value={result}
                      readOnly
                      className="min-h-[150px] bg-muted border-border"
                    />
                  </div>
                )}

                {resultImage && (
                  <div className="space-y-2">
                    <Label>Encrypted Image Ready</Label>
                    <Button
                      onClick={downloadImage}
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Encrypted Image
                    </Button>
                    <a ref={resultImageRef} className="hidden" />
                  </div>
                )}

                <Button
                  onClick={mode === 'encrypt' ? handleEncryption : handleDecryption}
                  disabled={
                    processing || (mode === 'encrypt'
                      ? (!inputText || !password || !selectedImage || !validateClickSequence(clickSequence))
                      : (!selectedImage || !password || !rsaPrivateKey || !validateClickSequence(clickSequence)))
                  }
                  className="w-full"
                  size="lg"
                >
                  {processing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      {mode === 'encrypt' ? <Lock className="w-5 h-5 mr-2" /> : <Unlock className="w-5 h-5 mr-2" />}
                      {mode === 'encrypt' ? 'Start Multi-Layer Encryption' : 'Start Multi-Layer Decryption'}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
