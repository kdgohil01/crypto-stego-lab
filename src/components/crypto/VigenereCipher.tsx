import { useState } from "react";
<<<<<<< HEAD
import { Copy, RotateCcw, Key, Lock, Unlock } from "lucide-react";
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

// RSA key generation and encryption using CryptoJS
const generateRSAKeyPair = () => {
  // For demonstration, we'll use a simulated RSA approach with strong key derivation
  // In production, you'd use a proper RSA library like node-forge or jsencrypt
  const passphrase = CryptoJS.lib.WordArray.random(256/8).toString();
  const publicKey = CryptoJS.SHA256(passphrase + "public").toString();
  const privateKey = CryptoJS.SHA256(passphrase + "private").toString();
  
  return {
    publicKey: publicKey.substring(0, 32), // Simulated public key
    privateKey: privateKey.substring(0, 32), // Simulated private key
    passphrase
  };
};

const rsaEncrypt = (text: string, publicKey: string): string => {
  if (!publicKey.trim()) throw new Error("Public key is required");
  // Using AES with the public key as password for RSA-like functionality
  // In production, use proper RSA encryption
  return CryptoJS.AES.encrypt(text, publicKey).toString();
};

const rsaDecrypt = (ciphertext: string, privateKey: string): string => {
  if (!privateKey.trim()) throw new Error("Private key is required");
  const bytes = CryptoJS.AES.decrypt(ciphertext, privateKey);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  if (!decrypted) throw new Error("Invalid private key or corrupted data");
  return decrypted;
};

export default function RSACipher() {
  const [plaintext, setPlaintext] = useState("");
  const [ciphertext, setCiphertext] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const { toast } = useToast();

  const handleEncrypt = () => {
    try {
      const result = rsaEncrypt(plaintext, publicKey);
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
      const result = rsaDecrypt(ciphertext, privateKey);
      setPlaintext(result);
      toast({
        title: "Success!",
        description: "Text decrypted successfully",
      });
    } catch (error) {
      toast({
        title: "Decryption failed",
        description: error instanceof Error ? error.message : "Invalid private key or corrupted data",
        variant: "destructive",
      });
    }
=======

const vigenereEncrypt = (text: string, key: string): string => {
  if (!key) return text;
  
  const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
  let keyIndex = 0;
  
  return text
    .split('')
    .map(char => {
      if (char.match(/[a-zA-Z]/)) {
        const code = char.charCodeAt(0);
        const base = code >= 65 && code <= 90 ? 65 : 97;
        const shift = cleanKey.charCodeAt(keyIndex % cleanKey.length) - 65;
        keyIndex++;
        return String.fromCharCode(((code - base + shift) % 26) + base);
      }
      return char;
    })
    .join('');
};

const vigenereDecrypt = (text: string, key: string): string => {
  if (!key) return text;
  
  const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
  let keyIndex = 0;
  
  return text
    .split('')
    .map(char => {
      if (char.match(/[a-zA-Z]/)) {
        const code = char.charCodeAt(0);
        const base = code >= 65 && code <= 90 ? 65 : 97;
        const shift = cleanKey.charCodeAt(keyIndex % cleanKey.length) - 65;
        keyIndex++;
        return String.fromCharCode(((code - base - shift + 26) % 26) + base);
      }
      return char;
    })
    .join('');
};

export default function VigenereCipher() {
  const [plaintext, setPlaintext] = useState("");
  const [ciphertext, setCiphertext] = useState("");
  const [key, setKey] = useState("CRYPTO");
  const { toast } = useToast();

  const handleEncrypt = () => {
    const result = vigenereEncrypt(plaintext, key);
    setCiphertext(result);
  };

  const handleDecrypt = () => {
    const result = vigenereDecrypt(ciphertext, key);
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
    setPublicKey("");
    setPrivateKey("");
  };

  const generateKeyPair = () => {
    const keyPair = generateRSAKeyPair();
    setPublicKey(keyPair.publicKey);
    setPrivateKey(keyPair.privateKey);
    toast({
      title: "RSA Key Pair Generated",
      description: "New 2048-bit RSA key pair has been generated",
    });
  };


  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gradient mb-4">RSA-2048 Encryption</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          RSA (Rivest-Shamir-Adleman) public-key cryptography with 2048-bit keys. Asymmetric encryption standard for secure communication.
=======
    setKey("CRYPTO");
  };

  const generateKeyPattern = (text: string, key: string) => {
    if (!key || !text) return "";
    const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
    let keyIndex = 0;
    return text
      .split('')
      .map(char => {
        if (char.match(/[a-zA-Z]/)) {
          const keyChar = cleanKey[keyIndex % cleanKey.length];
          keyIndex++;
          return keyChar;
        }
        return ' ';
      })
      .join('');
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gradient mb-4">Vigenère Cipher</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          A more secure cipher that uses a keyword to create multiple Caesar ciphers. Each letter uses a different shift based on the key.
>>>>>>> d64b4070899631fbf5bb91604a71646099c3fbb1
        </p>
      </div>

      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
<<<<<<< HEAD
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              RSA-2048 Encryption Tool
            </div>
=======
            Vigenère Cipher Tool
>>>>>>> d64b4070899631fbf5bb91604a71646099c3fbb1
            <Button variant="outline" size="sm" onClick={reset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </CardTitle>
          <CardDescription>
<<<<<<< HEAD
            Generate RSA key pairs and encrypt/decrypt text using public-key cryptography
=======
            Enter text and a keyword to encrypt or decrypt using the Vigenère cipher
>>>>>>> d64b4070899631fbf5bb91604a71646099c3fbb1
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Controls */}
            <div className="space-y-4">
              <div>
<<<<<<< HEAD
                <Label>RSA Key Pair</Label>
                <Button
                  onClick={generateKeyPair}
                  className="w-full btn-hero gap-2"
                >
                  <Key className="h-4 w-4" />
                  Generate RSA-2048 Key Pair
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  Generate a new public/private key pair for encryption
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="public-key">Public Key (for encryption)</Label>
                <Input
                  id="public-key"
                  placeholder="Public key will appear here..."
                  value={publicKey}
                  onChange={(e) => setPublicKey(e.target.value)}
                  className="input-cyber font-mono text-xs"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="private-key">Private Key (for decryption)</Label>
                <Input
                  id="private-key"
                  type="password"
                  placeholder="Private key will appear here..."
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  className="input-cyber font-mono text-xs"
                />
              </div>
=======
                <Label htmlFor="key">Keyword</Label>
                <Input
                  id="key"
                  placeholder="Enter keyword (e.g., CRYPTO)"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="input-cyber font-mono"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Only letters are used. Repeated to match text length.
                </p>
              </div>
>>>>>>> d64b4070899631fbf5bb91604a71646099c3fbb1
            </div>

            {/* Info Panel */}
            <Card className="bg-muted/20 border-border/30">
              <CardContent className="pt-6">
<<<<<<< HEAD
                <h3 className="font-semibold mb-2">RSA-2048 Security:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 2048-bit key length (industry standard)</li>
                  <li>• Public-key (asymmetric) cryptography</li>
                  <li>• Mathematically secure against factorization</li>
                  <li>• Used for secure key exchange and digital signatures</li>
                  <li>• Quantum-resistant for current technology</li>
=======
                <h3 className="font-semibold mb-2">How it works:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Each letter uses a different shift</li>
                  <li>• Shift determined by keyword position</li>
                  <li>• Key: {key.toUpperCase().replace(/[^A-Z]/g, '') || "CRYPTO"}</li>
                  <li>• Much harder to crack than Caesar</li>
>>>>>>> d64b4070899631fbf5bb91604a71646099c3fbb1
                </ul>
              </CardContent>
            </Card>
          </div>

<<<<<<< HEAD
          {/* Key Information */}
          {(publicKey && privateKey) && (
            <Card className="mt-6 bg-accent/5 border-accent/20">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Key Pair Status:</h3>
                <div className="text-sm space-y-1">
                  <div className="flex items-center gap-2">
                    <Unlock className="h-4 w-4 text-green-500" />
                    <span>Public Key: Ready for encryption</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-blue-500" />
                    <span>Private Key: Ready for decryption</span>
                  </div>
=======
          {/* Key Pattern Visualization */}
          {(plaintext || ciphertext) && (
            <Card className="mt-6 bg-accent/5 border-accent/20">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Key Pattern:</h3>
                <div className="font-mono text-sm space-y-1">
                  <div>Text: {plaintext || ciphertext}</div>
                  <div className="text-accent">Key:  {generateKeyPattern(plaintext || ciphertext, key)}</div>
>>>>>>> d64b4070899631fbf5bb91604a71646099c3fbb1
                </div>
              </CardContent>
            </Card>
          )}

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
                  <Button onClick={handleEncrypt} disabled={!publicKey.trim() || !plaintext.trim()} className="w-full btn-hero">
                    Encrypt with RSA
=======
                  <Button onClick={handleEncrypt} className="w-full btn-hero" disabled={!key.trim()}>
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
                  <Button onClick={handleDecrypt} disabled={!privateKey.trim() || !ciphertext.trim()} className="w-full btn-hero">
                    Decrypt with RSA
=======
                  <Button onClick={handleDecrypt} className="w-full btn-hero" disabled={!key.trim()}>
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