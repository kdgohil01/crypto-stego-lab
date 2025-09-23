import { useState } from "react";
import { Copy, RotateCcw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

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
    setShift(3);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gradient mb-4">Caesar Cipher</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          One of the simplest encryption techniques. Each letter is shifted by a fixed number of positions in the alphabet.
        </p>
      </div>

      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Caesar Cipher Tool
            <Button variant="outline" size="sm" onClick={reset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </CardTitle>
          <CardDescription>
            Enter text and a shift value to encrypt or decrypt using the Caesar cipher
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Controls */}
            <div className="space-y-4">
              <div>
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
              </div>
            </div>

            {/* Info Panel */}
            <Card className="bg-muted/20 border-border/30">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">How it works:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Each letter is shifted by {shift} positions</li>
                  <li>• A → {String.fromCharCode(65 + shift)}, B → {String.fromCharCode(66 + shift)}, etc.</li>
                  <li>• Wraps around: Z + 1 = A</li>
                  <li>• Case and punctuation preserved</li>
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
                  <Button onClick={handleEncrypt} className="w-full btn-hero">
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
                  <Button onClick={handleDecrypt} className="w-full btn-hero">
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
