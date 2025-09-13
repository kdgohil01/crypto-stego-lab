import { useState } from "react";
<<<<<<< HEAD
import { Copy, RotateCcw, Key, Shield } from "lucide-react";
=======
import { Copy, RotateCcw } from "lucide-react";
>>>>>>> d64b4070899631fbf5bb91604a71646099c3fbb1
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
<<<<<<< HEAD
import CryptoJS from "crypto-js";

const aesEncrypt = (text: string, password: string): string => {
  if (!password.trim()) throw new Error("Password is required");
  return CryptoJS.AES.encrypt(text, password).toString();
};

const aesDecrypt = (ciphertext: string, password: string): string => {
  if (!password.trim()) throw new Error("Password is required");
  const bytes = CryptoJS.AES.decrypt(ciphertext, password);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  if (!decrypted) throw new Error("Invalid password or corrupted data");
  return decrypted;
};

export default function AESCipher() {
  const [plaintext, setPlaintext] = useState("");
  const [ciphertext, setCiphertext] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleEncrypt = () => {
    try {
      const result = aesEncrypt(plaintext, password);
      setCiphertext(result);
      toast({
        title: "Success!",
        description: "Text encrypted successfully",
      });
    } catch (error) {
      toast({
        title: "Encryption failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleDecrypt = () => {
    try {
      const result = aesDecrypt(ciphertext, password);
      setPlaintext(result);
      toast({
        title: "Success!",
        description: "Text decrypted successfully",
      });
    } catch (error) {
      toast({
        title: "Decryption failed",
        description: error instanceof Error ? error.message : "Invalid password or corrupted data",
        variant: "destructive",
      });
    }
=======

const caesarEncrypt = (text: string, shift: number): string => {
  return text
    .split('')
    .map(char => {
      if (char.match(/[a-zA-Z]/)) {
        const code = char.charCodeAt(0);
        const base = code >= 65 && code <= 90 ? 65 : 97;
        return String.fromCharCode(((code - base + shift) % 26) + base);
      }
      return char;
    })
    .join('');
};

const caesarDecrypt = (text: string, shift: number): string => {
  return caesarEncrypt(text, 26 - shift);
};

export default function CaesarCipher() {
  const [plaintext, setPlaintext] = useState("");
  const [ciphertext, setCiphertext] = useState("");
  const [shift, setShift] = useState(3);
  const { toast } = useToast();

  const handleEncrypt = () => {
    const result = caesarEncrypt(plaintext, shift);
    setCiphertext(result);
  };

  const handleDecrypt = () => {
    const result = caesarDecrypt(ciphertext, shift);
    setPlaintext(result);
>>>>>>> d64b4070899631fbf5bb91604a71646099c3fbb1
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  const reset = () => {
    setPlaintext("");
    setCiphertext("");
<<<<<<< HEAD
    setPassword("");
  };

  const generateSecurePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 32; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(password);
    toast({
      title: "Secure password generated",
      description: "A 32-character random password has been generated",
    });
=======
    setShift(3);
>>>>>>> d64b4070899631fbf5bb91604a71646099c3fbb1
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8 text-center">
<<<<<<< HEAD
        <h1 className="text-4xl font-bold text-gradient mb-4">AES-256 Encryption</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Advanced Encryption Standard with 256-bit keys. Industry-standard symmetric encryption used worldwide for secure data protection.
=======
        <h1 className="text-4xl font-bold text-gradient mb-4">Caesar Cipher</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          One of the simplest encryption techniques. Each letter is shifted by a fixed number of positions in the alphabet.
>>>>>>> d64b4070899631fbf5bb91604a71646099c3fbb1
        </p>
      </div>

      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
<<<<<<< HEAD
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              AES-256 Encryption Tool
            </div>
=======
            Caesar Cipher Tool
>>>>>>> d64b4070899631fbf5bb91604a71646099c3fbb1
            <Button variant="outline" size="sm" onClick={reset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </CardTitle>
          <CardDescription>
<<<<<<< HEAD
            Enter text and a secure password to encrypt or decrypt using AES-256 encryption
=======
            Enter text and a shift value to encrypt or decrypt using the Caesar cipher
>>>>>>> d64b4070899631fbf5bb91604a71646099c3fbb1
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Controls */}
            <div className="space-y-4">
              <div>
<<<<<<< HEAD
                <Label htmlFor="password">Encryption Password</Label>
                <div className="flex gap-2">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter a strong password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-cyber flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateSecurePassword}
                    className="gap-2 whitespace-nowrap"
                  >
                    <Key className="h-4 w-4" />
                    Generate
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Use a strong password for maximum security
                </p>
=======
                <Label htmlFor="shift">Shift Value</Label>
                <Input
                  id="shift"
                  type="number"
                  min="1"
                  max="25"
                  value={shift}
                  onChange={(e) => setShift(Number(e.target.value))}
                  className="input-cyber"
                />
>>>>>>> d64b4070899631fbf5bb91604a71646099c3fbb1
              </div>
            </div>

            {/* Info Panel */}
            <Card className="bg-muted/20 border-border/30">
              <CardContent className="pt-6">
<<<<<<< HEAD
                <h3 className="font-semibold mb-2">AES-256 Security:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 256-bit key length (2^256 possible keys)</li>
                  <li>• Used by governments and military worldwide</li>
                  <li>• Resistant to all known cryptographic attacks</li>
                  <li>• NIST approved encryption standard</li>
                  <li>• Quantum-resistant for practical purposes</li>
=======
                <h3 className="font-semibold mb-2">How it works:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Each letter is shifted by {shift} positions</li>
                  <li>• A → {String.fromCharCode(65 + shift)}, B → {String.fromCharCode(66 + shift)}, etc.</li>
                  <li>• Wraps around: Z + 1 = A</li>
                  <li>• Case and punctuation preserved</li>
>>>>>>> d64b4070899631fbf5bb91604a71646099c3fbb1
                </ul>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="encrypt" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
              <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
            </TabsList>

            <TabsContent value="encrypt" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="plaintext">Plaintext</Label>
                  <Textarea
                    id="plaintext"
                    placeholder="Enter text to encrypt..."
                    value={plaintext}
                    onChange={(e) => setPlaintext(e.target.value)}
                    className="input-cyber min-h-[120px]"
                  />
<<<<<<< HEAD
                  <Button onClick={handleEncrypt} disabled={!password.trim() || !plaintext.trim()} className="w-full btn-hero">
                    Encrypt with AES-256
=======
                  <Button onClick={handleEncrypt} className="w-full btn-hero">
                    Encrypt
>>>>>>> d64b4070899631fbf5bb91604a71646099c3fbb1
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="encrypted">Encrypted Text</Label>
                  <Textarea
                    id="encrypted"
                    value={ciphertext}
                    readOnly
                    placeholder="Encrypted text will appear here..."
                    className="input-cyber min-h-[120px] font-mono"
                  />
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(ciphertext)}
                    disabled={!ciphertext}
                    className="w-full gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="decrypt" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ciphertext-input">Ciphertext</Label>
                  <Textarea
                    id="ciphertext-input"
                    placeholder="Enter text to decrypt..."
                    value={ciphertext}
                    onChange={(e) => setCiphertext(e.target.value)}
                    className="input-cyber min-h-[120px] font-mono"
                  />
<<<<<<< HEAD
                  <Button onClick={handleDecrypt} disabled={!password.trim() || !ciphertext.trim()} className="w-full btn-hero">
                    Decrypt with AES-256
=======
                  <Button onClick={handleDecrypt} className="w-full btn-hero">
                    Decrypt
>>>>>>> d64b4070899631fbf5bb91604a71646099c3fbb1
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="decrypted">Decrypted Text</Label>
                  <Textarea
                    id="decrypted"
                    value={plaintext}
                    readOnly
                    placeholder="Decrypted text will appear here..."
                    className="input-cyber min-h-[120px]"
                  />
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(plaintext)}
                    disabled={!plaintext}
                    className="w-full gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}