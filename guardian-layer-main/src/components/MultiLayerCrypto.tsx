import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Lock, Unlock, Shield, Key, Image, Download, Upload } from "lucide-react";
import { toast } from "sonner";
import { AESCrypto, RSACrypto, Steganography, validateClickSequence } from "@/lib/crypto";
import { ImageClickSequenceOverlay } from "./ImageClickSequenceOverlay";
import { StepIndicator } from "./StepIndicator";

export const MultiLayerCrypto = () => {
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
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultImageRef = useRef<HTMLAnchorElement>(null);
  const pemInputRef = useRef<HTMLInputElement>(null);

  const encryptionSteps = ["AES-256", "RSA-2048", "Steganography"];
  const decryptionSteps = ["Steganography", "RSA-2048", "AES-256"];

  const resetState = () => {
    setCurrentStep(0);
    setProgress(0);
    setResult(null);
    setResultImage(null);
  };

  // Normalize pasted/uploaded PEM keys to avoid common formatting issues
  const sanitizePem = (key: string): string => {
    let s = (key || "").trim();
    // remove surrounding quotes/backticks
    if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'")) || (s.startsWith("`") && s.endsWith("`"))) {
      s = s.slice(1, -1);
    }
    s = s.replace(/\r/g, "");

    // If header/footer are missing, assume content is base64 and wrap it
    if (!/BEGIN [A-Z ]+PRIVATE KEY/.test(s)) {
      const compact = s.replace(/\s+/g, "");
      if (compact.length > 0) {
        s = `-----BEGIN PRIVATE KEY-----\n${compact}\n-----END PRIVATE KEY-----`;
      }
    }
    return s;
  };

  const handleEncryption = async () => {
    if (!inputText || !password || !selectedImage || clickSequence.length !== 4) {
      toast.error("Please fill all fields and complete the 4-click sequence");
      return;
    }

    if (!validateClickSequence(clickSequence)) {
      toast.error("Click sequence must be 4 unique numbers between 1-9");
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
      toast.success("AES-256 encryption completed");
      
      // Step 2: RSA-2048 Encryption  
      setCurrentStep(2);
      setProgress(50);
      await new Promise(resolve => setTimeout(resolve, 800));
      const { encrypted: rsaEncrypted, privateKey } = RSACrypto.encrypt(aesEncrypted);
      setRsaPrivateKey(privateKey);
      toast.success("RSA-2048 encryption completed");
      
      // Step 3: Steganography
      setCurrentStep(3);
      setProgress(75);
      await new Promise(resolve => setTimeout(resolve, 800));
      const stegoImage = await Steganography.hideText(selectedImage, rsaEncrypted, clickSequence);
      setResultImage(stegoImage);
      setProgress(100);
      toast.success("Multi-layer encryption completed successfully!");
      
    } catch (error) {
      toast.error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleDecryption = async () => {
    if (!selectedImage || !password || !rsaPrivateKey || clickSequence.length !== 4) {
      toast.error("Please provide image, password, RSA key, and complete the 4-click sequence");
      return;
    }

    if (!validateClickSequence(clickSequence)) {
      toast.error("Click sequence must be 4 unique numbers between 1-9");
      return;
    }

    setProcessing(true);
    resetState();
    
    try {
      // Step 1: Extract from Steganography
      setCurrentStep(1);
      setProgress(25);
      await new Promise(resolve => setTimeout(resolve, 800));
      const extractedRsaData = await Steganography.extractText(selectedImage, clickSequence);
      toast.success("Steganography extraction completed");
      
      // Step 2: RSA-2048 Decryption
      setCurrentStep(2);
      setProgress(50);
      await new Promise(resolve => setTimeout(resolve, 800));
      const rsaDecrypted = RSACrypto.decrypt(extractedRsaData, sanitizePem(rsaPrivateKey));
      toast.success("RSA-2048 decryption completed");
      
      // Step 3: AES-256 Decryption
      setCurrentStep(3);
      setProgress(75);
      await new Promise(resolve => setTimeout(resolve, 800));
      const finalDecrypted = AESCrypto.decrypt(rsaDecrypted, password);
      setResult(finalDecrypted);
      setProgress(100);
      toast.success("Multi-layer decryption completed successfully!");
      
    } catch (error) {
      toast.error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold gradient-cyber bg-clip-text text-transparent">
          Multi-Layer Cryptographic Security
        </h1>
        <p className="text-muted-foreground text-lg">
          Advanced encryption combining AES-256, RSA-2048, and Steganography
        </p>
      </div>

      {!mode && (
        <Card className="cyber-glow border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              Choose Security Operation
            </CardTitle>
            <CardDescription>
              Select whether you want to encrypt or decrypt data
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4 justify-center">
            <Button
              onClick={() => setMode('encrypt')}
              size="lg"
              className="gradient-cyber text-white hover:opacity-90 transition-smooth"
            >
              <Lock className="w-5 h-5 mr-2" />
              Multi-Layer Encryption
            </Button>
            <Button
              onClick={() => setMode('decrypt')}
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-smooth"
            >
              <Unlock className="w-5 h-5 mr-2" />
              Multi-Layer Decryption
            </Button>
          </CardContent>
        </Card>
      )}

      {mode && (
        <>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => {
                setMode(null);
                resetState();
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              ← Back to Selection
            </Button>
            <StepIndicator 
              steps={mode === 'encrypt' ? encryptionSteps : decryptionSteps}
              currentStep={currentStep}
              processing={processing}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-primary/20">
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
                      className="min-h-[100px] font-mono"
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
                    <div className="flex gap-2">
                      <Button variant="outline" type="button" onClick={() => pemInputRef.current?.click()}>
                        Upload .pem
                      </Button>
                      <input
                        ref={pemInputRef}
                        type="file"
                        accept=".pem,.key,.txt"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const text = await file.text();
                            setRsaPrivateKey(text);
                          }
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">AES Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter a strong password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="font-mono"
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
                    <>
                      <ImageClickSequenceOverlay
                        imageFile={selectedImage}
                        sequence={clickSequence}
                        onSequenceChange={setClickSequence}
                      />
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Select an image first to perform the 4-click sequence on it.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
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
                    <Progress value={progress} className="animate-pulse-cyber" />
                  </div>
                )}

                {mode === 'encrypt' && rsaPrivateKey && (
                  <div className="p-4 bg-muted rounded-lg">
                    <Label className="text-xs font-semibold text-warning">
                      ⚠️ IMPORTANT: Save your RSA Private Key
                    </Label>
                    <Textarea
                      value={rsaPrivateKey}
                      readOnly
                      className="mt-2 font-mono text-xs h-32 bg-background"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      You'll need this key for decryption. Keep it safe!
                    </p>
                    <div className="mt-2">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => {
                          const blob = new Blob([rsaPrivateKey], { type: 'application/x-pem-file' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'private_key.pem';
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                      >
                        Download .pem
                      </Button>
                    </div>
                  </div>
                )}

                {result && (
                  <div className="space-y-2">
                    <Label>Decrypted Text</Label>
                    <Textarea
                      value={result}
                      readOnly
                      className="min-h-[150px] font-mono bg-success/10 border-success"
                    />
                  </div>
                )}

                {resultImage && (
                  <div className="space-y-2">
                    <Label>Encrypted Image Ready</Label>
                    <Button
                      onClick={downloadImage}
                      className="w-full gradient-cyber text-white"
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
                  className="w-full gradient-cyber text-white disabled:opacity-50"
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
};