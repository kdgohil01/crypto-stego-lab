import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Lock, Unlock, Shield, Key, Download, Upload, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Real AES-256 encryption using Web Crypto API
const AESCrypto = {
  encrypt: async (text: string, password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    const passwordBuffer = encoder.encode(password);
    const salt = crypto.getRandomValues(new Uint8Array(16));
    
    const keyMaterial = await crypto.subtle.importKey(
      'raw', passwordBuffer, 'PBKDF2', false, ['deriveBits', 'deriveKey']
    );
    
    const key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: salt, iterations: 100000, hash: 'SHA-256' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false, ['encrypt']
    );
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, data);
    
    const result = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
    result.set(salt, 0);
    result.set(iv, salt.length);
    result.set(new Uint8Array(encrypted), salt.length + iv.length);
    
    return btoa(String.fromCharCode(...result));
  },
  
  decrypt: async (encryptedData: string, password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    const data = new Uint8Array(atob(encryptedData).split('').map(c => c.charCodeAt(0)));
    const salt = data.slice(0, 16);
    const iv = data.slice(16, 28);
    const encrypted = data.slice(28);
    
    const passwordBuffer = encoder.encode(password);
    const keyMaterial = await crypto.subtle.importKey(
      'raw', passwordBuffer, 'PBKDF2', false, ['deriveBits', 'deriveKey']
    );
    
    const key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: salt, iterations: 100000, hash: 'SHA-256' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false, ['decrypt']
    );
    
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, key, encrypted);
    return decoder.decode(decrypted);
  }
};

// Real RSA-2048 encryption using Web Crypto API
const RSACrypto = {
  encrypt: async (text: string): Promise<{ encrypted: string, privateKey: string }> => {
    const keyPair = await crypto.subtle.generateKey(
      { name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
      true, ['encrypt', 'decrypt']
    );
    
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const encrypted = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, keyPair.publicKey, data);
    
    const privateKeyData = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
    const privateKeyString = btoa(String.fromCharCode(...new Uint8Array(privateKeyData)));
    
    return {
      encrypted: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
      privateKey: privateKeyString
    };
  },
  
  decrypt: async (encryptedData: string, privateKeyString: string): Promise<string> => {
    const decoder = new TextDecoder();
    
    const privateKeyData = new Uint8Array(atob(privateKeyString).split('').map(c => c.charCodeAt(0)));
    const privateKey = await crypto.subtle.importKey(
      'pkcs8', privateKeyData,
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      false, ['decrypt']
    );
    
    const encrypted = new Uint8Array(atob(encryptedData).split('').map(c => c.charCodeAt(0)));
    const decrypted = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, privateKey, encrypted);
    
    return decoder.decode(decrypted);
  }
};

// Real steganography implementation with LSB technique
const Steganography = {
  hideText: async (imageFile: File, text: string, clickSequence: number[]): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = document.createElement('img');
    
    return new Promise((resolve) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        const payload = JSON.stringify({ 
          text, 
          sequence: clickSequence,
          timestamp: Date.now(),
          checksum: btoa(text + clickSequence.join(''))
        });
        
        const binaryPayload = payload.split('').map(char => 
          char.charCodeAt(0).toString(2).padStart(8, '0')
        ).join('');
        
        const delimiter = '1111111111111110';
        const fullPayload = binaryPayload + delimiter;
        
        let bitIndex = 0;
        for (let i = 0; i < data.length && bitIndex < fullPayload.length; i += 4) {
          data[i] = (data[i] & 0xFE) | parseInt(fullPayload[bitIndex]);
          bitIndex++;
        }
        
        ctx.putImageData(imageData, 0, 0);
        canvas.toBlob((blob) => resolve(blob!), 'image/png');
      };
      img.src = URL.createObjectURL(imageFile);
    });
  },
  
  extractText: async (imageFile: File, clickSequence: number[]): Promise<string> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = document.createElement('img');
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        let binaryData = '';
        const delimiter = '1111111111111110';
        
        for (let i = 0; i < data.length; i += 4) {
          binaryData += (data[i] & 1).toString();
          if (binaryData.endsWith(delimiter)) {
            binaryData = binaryData.slice(0, -delimiter.length);
            break;
          }
        }
        
        if (!binaryData) {
          reject(new Error('No hidden data found in image'));
          return;
        }
        
        let payload = '';
        for (let i = 0; i < binaryData.length; i += 8) {
          const byte = binaryData.slice(i, i + 8);
          if (byte.length === 8) {
            payload += String.fromCharCode(parseInt(byte, 2));
          }
        }
        
        try {
          const hiddenData = JSON.parse(payload);
          
          if (JSON.stringify(hiddenData.sequence) !== JSON.stringify(clickSequence)) {
            reject(new Error('Invalid click sequence - authentication failed'));
            return;
          }
          
          const expectedChecksum = btoa(hiddenData.text + hiddenData.sequence.join(''));
          if (hiddenData.checksum !== expectedChecksum) {
            reject(new Error('Data integrity check failed'));
            return;
          }
          
          resolve(hiddenData.text);
        } catch (error) {
          reject(new Error('Failed to parse hidden data'));
        }
      };
      img.src = URL.createObjectURL(imageFile);
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
  
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultImageRef = useRef<HTMLAnchorElement>(null);

  const encryptionSteps = ["AES-256", "RSA-2048", "Steganography"];
  const decryptionSteps = ["Steganography", "RSA-2048", "AES-256"];

  const resetState = () => {
    setCurrentStep(0);
    setProgress(0);
    setResult(null);
    setResultImage(null);
    setProcessing(false);
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
        title: "Invalid Click Sequence",
        description: "Please select 4 unique positions",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    setCurrentStep(1);
    setProgress(25);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const aesEncrypted = await AESCrypto.encrypt(inputText, password);
      toast({
        title: "Step 1 Complete",
        description: "AES-256 encryption completed",
      });
      
      setCurrentStep(2);
      setProgress(50);
      await new Promise(resolve => setTimeout(resolve, 800));
      const rsaResult = await RSACrypto.encrypt(aesEncrypted);
      const { encrypted: rsaEncrypted, privateKey } = rsaResult;
      setRsaPrivateKey(privateKey);
      
      localStorage.setItem('guardian_layer_data', JSON.stringify({
        rsaEncrypted,
        privateKey,
        originalText: inputText,
        clickSequence,
        timestamp: Date.now()
      }));
      
      toast({
        title: "Step 2 Complete",
        description: "RSA-2048 encryption completed",
      });
      
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
        title: "Invalid Click Sequence",
        description: "Please select 4 unique positions",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    setCurrentStep(1);
    setProgress(25);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const extractedRsaData = await Steganography.extractText(selectedImage, clickSequence);
      
      toast({
        title: "Step 1 Complete",
        description: "Data extracted from steganography",
      });
      
      setCurrentStep(2);
      setProgress(50);
      await new Promise(resolve => setTimeout(resolve, 800));
      const aesEncrypted = await RSACrypto.decrypt(extractedRsaData, rsaPrivateKey);
      
      toast({
        title: "Step 2 Complete",
        description: "RSA-2048 decryption completed",
      });
      
      setCurrentStep(3);
      setProgress(75);
      await new Promise(resolve => setTimeout(resolve, 800));
      const finalDecrypted = await AESCrypto.decrypt(aesEncrypted, password);
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
                  {mode === 'encrypt' ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
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
                    placeholder={mode === 'encrypt' ? "Enter a strong password..." : "Enter decryption password..."}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Steganography Image</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1"
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
                </div>

                <div className="space-y-2">
                  <Label>4-Click Security Sequence</Label>
                  {selectedImage ? (
                    <div className="space-y-2">
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(selectedImage)}
                          alt="Selected"
                          className="w-full max-w-sm border rounded cursor-crosshair"
                          onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;
                            const gridX = Math.floor((x / rect.width) * 3);
                            const gridY = Math.floor((y / rect.height) * 3);
                            const position = gridY * 3 + gridX + 1;
                            handleGridClick(position);
                          }}
                        />
                        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                          {Array.from({ length: 9 }, (_, i) => (
                            <div
                              key={i}
                              className={`border border-white/30 flex items-center justify-center text-white font-bold text-lg ${
                                clickSequence.includes(i + 1) ? 'bg-primary/50' : ''
                              }`}
                            >
                              {clickSequence.includes(i + 1) && clickSequence.indexOf(i + 1) + 1}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                          Click 4 positions: {clickSequence.join(' → ')} {clickSequence.length < 4 && `(${4 - clickSequence.length} more)`}
                        </p>
                        <Button variant="outline" size="sm" onClick={resetClickSequence}>
                          Reset
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Select an image first to perform the 4-click sequence.
                    </p>
                  )}
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
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs font-semibold text-orange-600">
                        ⚠️ IMPORTANT: Save your RSA Private Key
                      </Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(rsaPrivateKey);
                          toast({
                            title: "Key Copied!",
                            description: "RSA private key has been copied to clipboard.",
                          });
                        }}
                        className="gap-1"
                      >
                        <Copy className="h-3 w-3" />
                        Copy Key
                      </Button>
                    </div>
                    <Textarea
                      value={rsaPrivateKey}
                      readOnly
                      className="mt-2 font-mono text-xs h-32 bg-background"
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
                      className="min-h-[150px] font-mono bg-muted border-border"
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
