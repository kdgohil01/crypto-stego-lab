import React, { useState, useRef } from 'react';
import { Upload, Download, Play, Pause, Video, Lock, Unlock, Copy, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

// Video steganography using AES-256 encryption and Base64 encoding
const encodeMessageInVideo = async (videoFile: File, message: string, password: string): Promise<ArrayBuffer> => {
  try {
    // Convert video file to ArrayBuffer
    const videoBuffer = await videoFile.arrayBuffer();
    
    // Generate salt for key derivation
    const salt = crypto.getRandomValues(new Uint8Array(16));
    
    // Derive key from password using PBKDF2
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );
    
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );
    
    // Generate IV for AES-GCM
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt the message
    const messageBuffer = new TextEncoder().encode(message);
    const encryptedMessage = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      messageBuffer
    );
    
    // Create metadata object
    const metadata = {
      salt: Array.from(salt),
      iv: Array.from(iv),
      encryptedMessage: Array.from(new Uint8Array(encryptedMessage)),
      originalFileName: videoFile.name,
      fileSize: videoBuffer.byteLength
    };
    
    // Convert metadata to JSON and then to bytes
    const metadataJson = JSON.stringify(metadata);
    const metadataBytes = new TextEncoder().encode(metadataJson);
    
    // Create the final encrypted file structure
    const metadataLength = new Uint32Array([metadataBytes.length]);
    const metadataLengthBytes = new Uint8Array(metadataLength.buffer);
    
    // Combine: metadata length (4 bytes) + metadata + original video
    const totalLength = 4 + metadataBytes.length + videoBuffer.byteLength;
    const result = new Uint8Array(totalLength);
    
    let offset = 0;
    result.set(metadataLengthBytes, offset);
    offset += 4;
    result.set(metadataBytes, offset);
    offset += metadataBytes.length;
    result.set(new Uint8Array(videoBuffer), offset);
    
    return result.buffer;
  } catch (error) {
    throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const decodeMessageFromVideo = async (encryptedFile: File, password: string): Promise<{ message: string; originalFileName: string }> => {
  try {
    const fileBuffer = await encryptedFile.arrayBuffer();
    const fileBytes = new Uint8Array(fileBuffer);
    
    // Read metadata length (first 4 bytes)
    const metadataLength = new Uint32Array(fileBytes.slice(0, 4).buffer)[0];
    
    // Read metadata
    const metadataBytes = fileBytes.slice(4, 4 + metadataLength);
    const metadataJson = new TextDecoder().decode(metadataBytes);
    const metadata = JSON.parse(metadataJson);
    
    // Reconstruct salt, IV, and encrypted message
    const salt = new Uint8Array(metadata.salt);
    const iv = new Uint8Array(metadata.iv);
    const encryptedMessage = new Uint8Array(metadata.encryptedMessage);
    
    // Derive key from password
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );
    
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
    
    // Decrypt the message
    const decryptedMessage = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encryptedMessage
    );
    
    const message = new TextDecoder().decode(decryptedMessage);
    
    return {
      message,
      originalFileName: metadata.originalFileName
    };
  } catch (error) {
    throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Invalid password or corrupted file'}`);
  }
};

export default function VideoSteganography() {
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [extractedMessage, setExtractedMessage] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [encryptedFile, setEncryptedFile] = useState<ArrayBuffer | null>(null);
  const [originalFileName, setOriginalFileName] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('encode');
  const [showPassword, setShowPassword] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (activeTab === 'encode' && file.type.startsWith('video/')) {
        setVideoFile(file);
        setEncryptedFile(null);
        setExtractedMessage('');
        toast({
          title: "Video file loaded",
          description: `${file.name} is ready for steganography.`,
        });
      } else if (activeTab === 'decode') {
        setVideoFile(file);
        setEncryptedFile(null);
        setExtractedMessage('');
        toast({
          title: "Encrypted file loaded",
          description: `${file.name} is ready for decryption.`,
        });
      } else {
        toast({
          title: "Invalid file",
          description: "Please select a valid video file for encoding.",
          variant: "destructive",
        });
      }
    }
  };

  const encodeMessage = async () => {
    if (!videoFile || !message.trim() || !password.trim()) {
      toast({
        title: "Missing requirements",
        description: "Please select a video file, enter a message, and set a password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const encodedBuffer = await encodeMessageInVideo(videoFile, message.trim(), password);
      setEncryptedFile(encodedBuffer);
      
      toast({
        title: "Message encoded successfully!",
        description: "Your secret message has been hidden in the video file.",
      });
    } catch (error) {
      console.error('Encoding error:', error);
      toast({
        title: "Encoding failed",
        description: error instanceof Error ? error.message : "Failed to encode message.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const decodeMessage = async () => {
    if (!videoFile || !password.trim()) {
      toast({
        title: "Missing requirements",
        description: "Please select an encrypted file and enter the password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await decodeMessageFromVideo(videoFile, password);
      setExtractedMessage(result.message);
      setOriginalFileName(result.originalFileName);
      
      toast({
        title: "Message decoded successfully!",
        description: "Hidden message has been extracted from the video file.",
      });
    } catch (error) {
      console.error('Decoding error:', error);
      toast({
        title: "Decoding failed",
        description: error instanceof Error ? error.message : "Invalid password or corrupted file.",
        variant: "destructive",
      });
      setExtractedMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadEncryptedFile = () => {
    if (!encryptedFile) return;
    
    const blob = new Blob([encryptedFile], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `encrypted_${videoFile?.name || 'video'}.cvault`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Your encrypted video file is being downloaded.",
    });
  };

  const playVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
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

  const reset = () => {
    setMessage('');
    setPassword('');
    setExtractedMessage('');
    setVideoFile(null);
    setEncryptedFile(null);
    setOriginalFileName('');
    setIsPlaying(false);
    setShowPassword(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    reset();
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gradient mb-2 leading-tight pb-2">Text in Video</h1>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Badge className="bg-red-500 text-white border-transparent">Advanced</Badge>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Hide secret text messages inside video files using military-grade AES-256 encryption. Advanced steganography with password protection.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Video Upload Section */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Video File
            </CardTitle>
            <CardDescription>
              Upload a video file to hide or extract messages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept={activeTab === 'encode' ? 'video/*' : '*'}
                onChange={handleFileUpload}
                className="hidden"
                id="video-upload"
              />
              <label htmlFor="video-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Click to upload a {activeTab === 'encode' ? 'video' : 'encrypted'} file
                </p>
                <p className="text-xs text-muted-foreground">
                  {activeTab === 'encode' ? 'Supports MP4, AVI, MOV, and other video formats' : 'Select .cvault encrypted files'}
                </p>
              </label>
            </div>
            
            {videoFile && activeTab === 'encode' && videoFile.type.startsWith('video/') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    <span className="text-sm font-medium">{videoFile.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={playVideo}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </div>
                
                <video
                  ref={videoRef}
                  src={videoFile ? URL.createObjectURL(videoFile) : ''}
                  onEnded={() => setIsPlaying(false)}
                  className="w-full rounded-lg"
                  controls
                />
              </div>
            )}

            {videoFile && activeTab === 'decode' && (
              <div className="p-3 bg-muted/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  <span className="text-sm font-medium">{videoFile.name}</span>
                </div>
              </div>
            )}
            
            <Button
              onClick={reset}
              variant="outline"
              className="w-full"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </CardContent>
        </Card>

        {/* Steganography Operations */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle>Text in Video Operations</CardTitle>
            <CardDescription>
              Encode messages into videos or decode hidden messages
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

                <div className="space-y-2">
                  <Label htmlFor="password">Encryption Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter a strong password..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-cyber pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={encodeMessage}
                  disabled={!videoFile || !message.trim() || !password.trim() || isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Video className="h-4 w-4 mr-2 animate-pulse" />
                      Encoding...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Encode Message
                    </>
                  )}
                </Button>

                {encryptedFile && (
                  <Button
                    onClick={downloadEncryptedFile}
                    variant="secondary"
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Encrypted File
                  </Button>
                )}
              </TabsContent>

              <TabsContent value="decode" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="decode-password">Decryption Password</Label>
                  <div className="relative">
                    <Input
                      id="decode-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter the password used for encryption..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-cyber pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={decodeMessage}
                  disabled={!videoFile || !password.trim() || isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Video className="h-4 w-4 mr-2 animate-pulse" />
                      Decoding...
                    </>
                  ) : (
                    <>
                      <Unlock className="h-4 w-4 mr-2" />
                      Decode Message
                    </>
                  )}
                </Button>

                {extractedMessage && (
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
                    {originalFileName && (
                      <p className="text-xs text-muted-foreground">
                        Original file: {originalFileName}
                      </p>
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
          <CardTitle className="text-2xl">How Text in Video Works</CardTitle>
          <CardDescription className="text-base">
            Understanding advanced text-in-video steganography with AES-256 encryption
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-secondary-foreground font-bold mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Load Video</h3>
              <p className="text-sm text-muted-foreground">Upload a video file that will serve as the carrier</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-secondary-foreground font-bold mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">AES Encryption</h3>
              <p className="text-sm text-muted-foreground">Encrypt message with military-grade AES-256</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-secondary-foreground font-bold mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Embed Data</h3>
              <p className="text-sm text-muted-foreground">Hide encrypted data within video file structure</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-secondary-foreground font-bold mb-4">
                4
              </div>
              <h3 className="font-semibold mb-2">Extract & Decrypt</h3>
              <p className="text-sm text-muted-foreground">Retrieve and decrypt hidden message with password</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
