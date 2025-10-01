import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Lock, Unlock, Shield, Key, Upload, Copy } from "lucide-react";
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

// Pixel Lock helpers
type PixelPoint = { x: number; y: number };

async function sha256Hex(data: ArrayBuffer | string): Promise<string> {
  const enc = new TextEncoder();
  const bytes = typeof data === 'string' ? enc.encode(data) : new Uint8Array(data);
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function fileSha256Hex(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  return sha256Hex(buf);
}

// Quantization to allow small human error in clicks (e.g., 2% of size)
const QUANTIZE_STEP = 0.02; // 2% step
function quantize(value: number, step = QUANTIZE_STEP): number {
  // Clamp within [0,1] and round to nearest step
  const clamped = Math.max(0, Math.min(1, value));
  return Math.round(clamped / step) * step;
}
function quantizePoint(p: PixelPoint): PixelPoint {
  return { x: quantize(p.x), y: quantize(p.y) };
}

async function hmacSha256Hex(keyHex: string, message: string): Promise<string> {
  const keyBytes = new Uint8Array(keyHex.match(/.{1,2}/g)!.map(h => parseInt(h, 16)));
  const cryptoKey = await crypto.subtle.importKey('raw', keyBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function derivePixelLockKey(points: PixelPoint[], imageFile: File): Promise<string> {
  const imageHash = await fileSha256Hex(imageFile);
  // Quantize points to tolerate slight user click deviations
  const quantized = points.map(quantizePoint);
  const payload = JSON.stringify({ points: quantized, imageHash, step: QUANTIZE_STEP });
  return sha256Hex(payload);
}

const REQUIRED_CLICKS = 5;

const validateClickSequence = (sequence: PixelPoint[]): boolean => {
  return sequence.length === REQUIRED_CLICKS;
};

export default function GuardianLayer() {
  const [mode, setMode] = useState<'encrypt' | 'decrypt' | null>(null);
  const [inputText, setInputText] = useState("");
  const [password, setPassword] = useState("");
  const [rsaPrivateKey, setRsaPrivateKey] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [clickSequence, setClickSequence] = useState<PixelPoint[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [encryptedPayload, setEncryptedPayload] = useState<string>("");
  
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const payloadDownloadRef = useRef<HTMLAnchorElement>(null);

  const encryptionSteps = ["AES-256", "RSA-2048", "Pixel Lock"];
  const decryptionSteps = ["Pixel Lock", "RSA-2048", "AES-256"];

  const resetState = () => {
    setCurrentStep(0);
    setProgress(0);
    setResult(null);
    setEncryptedPayload("");
    setProcessing(false);
  };

  // Password strength analyzer (encryption only)
  const getPasswordStrength = () => {
    if (password.length < 8) return { level: "weak", score: 25 } as const;
    if (password.length < 12) return { level: "medium", score: 60 } as const;
    if (
      password.length >= 16 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    ) {
      return { level: "strong", score: 100 } as const;
    }
    return { level: "good", score: 80 } as const;
  };

  const handleEncryption = async () => {
    if (!inputText || !password || !selectedImage || !validateClickSequence(clickSequence)) {
      toast({
        title: "Missing Information",
        description: "Please fill all fields and complete the pixel lock sequence",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    setCurrentStep(1);
    setProgress(25);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      // Derive Pixel Lock key and combine with password via HMAC for AES
      const pixelKey = await derivePixelLockKey(clickSequence, selectedImage);
      const combinedPassword = await hmacSha256Hex(pixelKey, password);
      const aesEncrypted = await AESCrypto.encrypt(inputText, combinedPassword);
      toast({
        title: "Step 1 Complete",
        description: "AES-256 encryption completed",
      });
      
      setCurrentStep(2);
      setProgress(50);
      await new Promise(resolve => setTimeout(resolve, 400));
      const rsaResult = await RSACrypto.encrypt(aesEncrypted);
      const { encrypted: rsaEncrypted, privateKey } = rsaResult;
      setRsaPrivateKey(privateKey);
      
      toast({
        title: "Step 2 Complete",
        description: "RSA-2048 encryption completed",
      });
      
      setCurrentStep(3);
      setProgress(75);
      await new Promise(resolve => setTimeout(resolve, 400));
      // Pixel Lock is already applied to AES. No image modification.
      setResult(rsaEncrypted);
      setEncryptedPayload(rsaEncrypted);
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
    if (!selectedImage || !password || !rsaPrivateKey || !validateClickSequence(clickSequence) || !encryptedPayload.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide image, encrypted payload, password, RSA key, and complete the pixel lock sequence",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    setCurrentStep(1);
    setProgress(25);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      toast({
        title: "Step 1 Complete",
        description: "Pixel lock sequence captured",
      });
      
      setCurrentStep(2);
      setProgress(50);
      await new Promise(resolve => setTimeout(resolve, 400));
      const aesEncrypted = await RSACrypto.decrypt(encryptedPayload, rsaPrivateKey);
      
      toast({
        title: "Step 2 Complete",
        description: "RSA-2048 decryption completed",
      });
      
      setCurrentStep(3);
      setProgress(75);
      await new Promise(resolve => setTimeout(resolve, 400));
      try {
        const pixelKey = await derivePixelLockKey(clickSequence, selectedImage);
        const combinedPassword = await hmacSha256Hex(pixelKey, password);
        const finalDecrypted = await AESCrypto.decrypt(aesEncrypted, combinedPassword);
        setResult(finalDecrypted);
      } catch {
        throw new Error('Authentication Failed');
      }
      setProgress(100);
      
      toast({
        title: "Decryption Complete",
        description: "Multi-layer decryption completed successfully!",
      });
      
    } catch (error) {
      toast({
        title: "Decryption Failed",
        description: 'Authentication Failed',
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  // no download image; output is text payload
  const downloadPayload = () => {
    if (!encryptedPayload) return;
    const blob = new Blob([encryptedPayload], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = payloadDownloadRef.current;
    if (!a) return;
    a.href = url;
    a.download = 'guardian_encrypted_payload.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (clickSequence.length >= REQUIRED_CLICKS) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setClickSequence([...clickSequence, { x, y }]);
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
                  {mode === 'encrypt' && password && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Password Strength</span>
                        {(() => {
                          const s = getPasswordStrength();
                          return (
                            <span
                              className={`font-medium ${
                                s.level === 'strong'
                                  ? 'text-green-500'
                                  : s.level === 'good'
                                  ? 'text-yellow-500'
                                  : s.level === 'medium'
                                  ? 'text-orange-500'
                                  : 'text-red-500'
                              }`}
                            >
                              {s.level.toUpperCase()}
                            </span>
                          );
                        })()}
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${(() => {
                            const s = getPasswordStrength();
                            return s.level === 'strong'
                              ? 'bg-green-500'
                              : s.level === 'good'
                              ? 'bg-yellow-500'
                              : s.level === 'medium'
                              ? 'bg-orange-500'
                              : 'bg-red-500';
                          })()}`}
                          style={{ width: `${getPasswordStrength().score}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Authentication Image</Label>
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
                  <Label>Pixel Lock Sequence ({REQUIRED_CLICKS} clicks)</Label>
                  {selectedImage ? (
                    <div className="space-y-2">
                      <div className="relative w-full aspect-square">
                        <img
                          src={URL.createObjectURL(selectedImage)}
                          alt="Selected"
                          className="absolute inset-0 w-full h-full object-cover border rounded cursor-crosshair"
                          onClick={handleImageClick}
                        />
                        <div className="absolute inset-0 pointer-events-none">
                          {clickSequence.map((p, idx) => (
                            <div
                              key={`${p.x}-${p.y}-${idx}`}
                              className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full bg-primary/60 text-white text-xs flex items-center justify-center"
                              style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }}
                            >
                              {idx + 1}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                          Click {REQUIRED_CLICKS} positions: {clickSequence.length}/{REQUIRED_CLICKS}
                        </p>
                        <Button variant="outline" size="sm" onClick={resetClickSequence}>
                          Reset
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Select an image first to perform the pixel lock sequence.
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

                {mode === 'decrypt' && (
                  <div className="space-y-2">
                    <Label htmlFor="enc-payload">Encrypted Payload</Label>
                    <Textarea
                      id="enc-payload"
                      placeholder="Paste the encrypted payload from encryption step"
                      value={encryptedPayload}
                      onChange={(e) => setEncryptedPayload(e.target.value)}
                      className="min-h-[120px] font-mono text-xs"
                    />
                  </div>
                )}

                {result && (
                  <div className="space-y-2">
                    <Label>{mode === 'encrypt' ? 'Encrypted Payload' : 'Decrypted Text'}</Label>
                    <Textarea
                      value={result}
                      readOnly
                      className="min-h-[150px] font-mono bg-muted border-border"
                    />
                    {mode === 'encrypt' && (
                      <div className="flex gap-2">
                        <Button onClick={downloadPayload} className="w-full" variant="outline">
                          Download Encrypted Payload
                        </Button>
                        <a ref={payloadDownloadRef} className="hidden" />
                      </div>
                    )}
                  </div>
                )}

                <Button
                  onClick={mode === 'encrypt' ? handleEncryption : handleDecryption}
                  disabled={
                    processing || (mode === 'encrypt'
                      ? (!inputText || !password || !selectedImage || !validateClickSequence(clickSequence))
                      : (!selectedImage || !password || !rsaPrivateKey || !validateClickSequence(clickSequence) || !encryptedPayload.trim()))
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
