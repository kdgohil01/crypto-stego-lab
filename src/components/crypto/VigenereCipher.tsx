import { useState } from "react";
import { Copy, RotateCcw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

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

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow letters (a-z, A-Z), filter out numbers and special characters
    const filteredValue = e.target.value.replace(/[^a-zA-Z]/g, '');
    setKey(filteredValue);
  };
  const { toast } = useToast();

  const handleEncrypt = () => {
    const result = vigenereEncrypt(plaintext, key);
    setCiphertext(result);
    toast({
      title: "Success!",
      description: "Text encrypted successfully",
    });
  };

  const handleDecrypt = () => {
    const result = vigenereDecrypt(ciphertext, key);
    setPlaintext(result);
    toast({
      title: "Success!",
      description: "Text decrypted successfully",
    });
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
        </p>
      </div>

      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Vigenère Cipher Tool
            <Button variant="outline" size="sm" onClick={reset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </CardTitle>
          <CardDescription>
            Enter text and a keyword to encrypt or decrypt using the Vigenère cipher
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Controls */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="key">Keyword</Label>
                <Input
                  id="key"
                  placeholder="Enter keyword (e.g., CRYPTO)"
                  value={key}
                  onChange={handleKeyChange}
                  className="input-cyber font-mono"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Only letters allowed. Numbers and special characters are automatically filtered out.
                </p>
              </div>
            </div>

            {/* Info Panel */}
            <Card className="bg-muted/20 border-border/30">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">How it works:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Each letter uses a different shift</li>
                  <li>• Shift determined by keyword position</li>
                  <li>• Key: {key.toUpperCase().replace(/[^A-Z]/g, '') || "CRYPTO"}</li>
                  <li>• Much harder to crack than Caesar</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Key Pattern Visualization */}
          {(plaintext || ciphertext) && (
            <Card className="mt-6 bg-accent/5 border-accent/20">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Key Pattern:</h3>
                <div className="font-mono text-sm space-y-1">
                  <div>Text: {plaintext || ciphertext}</div>
                  <div className="text-accent">Key:  {generateKeyPattern(plaintext || ciphertext, key)}</div>
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
                  <Button onClick={handleEncrypt} className="w-full btn-hero" disabled={!key.trim()}>
                    Encrypt
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
                  <Button onClick={handleDecrypt} className="w-full btn-hero" disabled={!key.trim()}>
                    Decrypt
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
