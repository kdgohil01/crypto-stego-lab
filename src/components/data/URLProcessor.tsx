import React, { useState } from 'react';
import { Link, RotateCcw, Copy, Info, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function URLProcessor() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [aesPassword, setAesPassword] = useState('');
  const [activeTab, setActiveTab] = useState('level1');
  const { toast } = useToast();

  // Level 1: URL Encoding/Decoding
  const urlEncode = () => {
    try {
      const encoded = encodeURIComponent(inputText);
      setOutputText(encoded);
      copyToClipboard(encoded);
      showToast('Level 1 encoding completed and copied to clipboard!', 'success');
    } catch (error) {
      showToast('Error encoding text: ' + (error as Error).message, 'error');
    }
  };

  const urlDecode = () => {
    try {
      const decoded = decodeURIComponent(inputText.replace(/\+/g, ' '));
      setOutputText(decoded);
      copyToClipboard(decoded);
      showToast('Level 1 decoding completed and copied to clipboard!', 'success');
    } catch (error) {
      showToast('Error decoding text. Make sure the input is properly encoded.', 'error');
    }
  };

  // Level 2: Base64 Encoding/Decoding
  const base64Encode = () => {
    try {
      const encoded = btoa(inputText);
      setOutputText(encoded);
      copyToClipboard(encoded);
      showToast('Level 2 encoding completed and copied to clipboard!', 'success');
    } catch (error) {
      showToast('Error encoding text: ' + (error as Error).message, 'error');
    }
  };

  const base64Decode = () => {
    try {
      const decoded = atob(inputText);
      setOutputText(decoded);
      copyToClipboard(decoded);
      showToast('Level 2 decoding completed and copied to clipboard!', 'success');
    } catch (error) {
      showToast('Error decoding text. Make sure the input is valid Base64.', 'error');
    }
  };

  // Level 3: AES Encryption/Decryption
  const aesEncrypt = async () => {
    if (!aesPassword) {
      showToast('Password is required for AES encryption.', 'error');
      return;
    }
    
    try {
      const encrypted = await performAESEncrypt(inputText, aesPassword);
      setOutputText(encrypted);
      copyToClipboard(encrypted);
      showToast('Level 3 encryption completed and copied to clipboard!', 'success');
    } catch (error) {
      showToast('Error encrypting text: ' + (error as Error).message, 'error');
    }
  };

  const aesDecrypt = async () => {
    if (!aesPassword) {
      showToast('Password is required for AES decryption.', 'error');
      return;
    }
    
    try {
      const decrypted = await performAESDecrypt(inputText, aesPassword);
      setOutputText(decrypted);
      copyToClipboard(decrypted);
      showToast('Level 3 decryption completed and copied to clipboard!', 'success');
    } catch (error) {
      showToast('Error decrypting text. Check password and input format.', 'error');
    }
  };

  // AES Helper Functions
  const performAESEncrypt = async (text: string, password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    
    const salt = crypto.getRandomValues(new Uint8Array(16));
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
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      data
    );
    
    const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(encrypted), salt.length + iv.length);
    
    return btoa(String.fromCharCode(...combined));
  };
  
  const performAESDecrypt = async (encryptedData: string, password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    const combined = new Uint8Array(atob(encryptedData).split('').map(char => char.charCodeAt(0)));
    
    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const encrypted = combined.slice(28);
    
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
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
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encrypted
    );
    
    return decoder.decode(decrypted);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Could not copy text: ', err);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    toast({
      title: type === 'success' ? 'Success!' : 'Error',
      description: message,
      variant: type === 'error' ? 'destructive' : 'default',
    });
  };

  const reset = () => {
    setInputText('');
    setOutputText('');
    setAesPassword('');
    showToast('Input and output cleared.');
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gradient mb-2 leading-tight pb-2">URL Processor</h1>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Badge className="bg-purple-500 text-white border-transparent">Multi-Level</Badge>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Multi-level security encoding tool with URL encoding, Base64, and AES-256 encryption capabilities.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Input/Output Section */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              Text Processing
            </CardTitle>
            <CardDescription>
              Enter text to encode/decode using various security levels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="input">Input Text</Label>
              <Textarea
                id="input"
                placeholder="Enter your text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[120px] input-cyber"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="output">Result</Label>
              <Textarea
                id="output"
                value={outputText}
                readOnly
                placeholder="Processed text will appear here..."
                className="min-h-[120px] input-cyber font-mono"
              />
              <Button
                variant="outline"
                onClick={() => copyToClipboard(outputText)}
                disabled={!outputText}
                className="w-full gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy Result
              </Button>
            </div>

            <Button onClick={reset} variant="outline" className="w-full gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </CardContent>
        </Card>

        {/* Processing Options */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Security Levels
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Info className="h-4 w-4 mr-2" />
                    Learn
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>About Security Levels</DialogTitle>
                    <DialogDescription>
                      Understanding the three levels of security encoding
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-blue-500">Level 1 Security (URL Encoding)</h3>
                      <p className="text-sm text-muted-foreground">
                        Basic encoding for web transmission. Converts special characters to URL-safe format. 
                        <strong> Low security</strong> - easily reversible.
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Example: "Hello World!" ⇄ <code>Hello%20World%21</code>
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-500">Level 2 Security (Base64)</h3>
                      <p className="text-sm text-muted-foreground">
                        Medium security encoding that converts text to Base64 format. 
                        <strong> Medium security</strong> - requires knowledge of Base64 decoding.
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Example: "Hello" ⇄ <code>SGVsbG8=</code>
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-red-500">Level 3 Security (AES Encryption)</h3>
                      <p className="text-sm text-muted-foreground">
                        High security encryption using AES-256 with password protection. 
                        <strong> High security</strong> - requires correct password to decrypt.
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Example: "Hello" + password ⇄ <code>encrypted_data</code>
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
            <CardDescription>
              Choose your encoding/decoding method
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="level1" className="text-xs">Level 1</TabsTrigger>
                <TabsTrigger value="level2" className="text-xs">Level 2</TabsTrigger>
                <TabsTrigger value="level3" className="text-xs">Level 3</TabsTrigger>
              </TabsList>

              <TabsContent value="level1" className="space-y-4">
                <div className="text-center">
                  <Badge variant="outline" className="mb-4">URL Encoding</Badge>
                  <p className="text-sm text-muted-foreground mb-4">
                    Basic URL encoding for web-safe text transmission
                  </p>
                </div>
                <div className="grid gap-2">
                  <Button onClick={urlEncode} disabled={!inputText} className="w-full">
                    URL Encode
                  </Button>
                  <Button onClick={urlDecode} disabled={!inputText} variant="outline" className="w-full">
                    URL Decode
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="level2" className="space-y-4">
                <div className="text-center">
                  <Badge variant="outline" className="mb-4">Base64 Encoding</Badge>
                  <p className="text-sm text-muted-foreground mb-4">
                    Medium security Base64 encoding/decoding
                  </p>
                </div>
                <div className="grid gap-2">
                  <Button onClick={base64Encode} disabled={!inputText} className="w-full">
                    Base64 Encode
                  </Button>
                  <Button onClick={base64Decode} disabled={!inputText} variant="outline" className="w-full">
                    Base64 Decode
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="level3" className="space-y-4">
                <div className="text-center">
                  <Badge variant="outline" className="mb-4">AES-256 Encryption</Badge>
                  <p className="text-sm text-muted-foreground mb-4">
                    High security AES encryption with password protection
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter encryption password"
                    value={aesPassword}
                    onChange={(e) => setAesPassword(e.target.value)}
                    className="input-cyber"
                  />
                </div>
                <div className="grid gap-2">
                  <Button onClick={aesEncrypt} disabled={!inputText || !aesPassword} className="w-full">
                    AES Encrypt
                  </Button>
                  <Button onClick={aesDecrypt} disabled={!inputText || !aesPassword} variant="outline" className="w-full">
                    AES Decrypt
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <Card className="card-glow mt-8">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">How URL Processing Works</CardTitle>
          <CardDescription className="text-base">
            Understanding multi-level security encoding
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white font-bold mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">URL Encoding</h3>
              <p className="text-sm text-muted-foreground">Convert special characters to web-safe format for URL transmission</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white font-bold mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">Base64 Encoding</h3>
              <p className="text-sm text-muted-foreground">Transform text into Base64 format for data obfuscation and transmission</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500 text-white font-bold mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">AES Encryption</h3>
              <p className="text-sm text-muted-foreground">Secure data with military-grade AES-256 encryption and password protection</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
