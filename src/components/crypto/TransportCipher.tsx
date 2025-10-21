import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Info, RotateCcw, Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const transportEncrypt = (text: string, key: string): string => {
  if (!key) return text;
  
  const keyNum = parseInt(key, 10);
  if (isNaN(keyNum) || keyNum <= 0) return text;
  
  // Remove all whitespace and convert to uppercase
  const cleanText = text.replace(/\s+/g, '').toUpperCase();
  if (!cleanText) return '';
  
  const keyLength = Math.max(1, Math.min(keyNum, cleanText.length));
  
  // Create rows based on the key length
  const rows: string[] = [];
  for (let i = 0; i < keyLength; i++) {
    rows.push('');
  }
  
  // Fill the grid row by row
  for (let i = 0; i < cleanText.length; i++) {
    const rowIndex = i % keyLength;
    rows[rowIndex] += cleanText[i];
  }
  
  // Read the grid column by column
  let result = '';
  const maxRowLength = Math.max(...rows.map(row => row.length));
  
  for (let col = 0; col < maxRowLength; col++) {
    for (let row = 0; row < keyLength; row++) {
      if (col < rows[row].length) {
        result += rows[row][col];
      }
    }
  }
  
  // Add spaces for better readability (optional)
  return result.match(/.{1,5}/g)?.join(' ') || '';
};

const transportDecrypt = (text: string, key: string): string => {
  if (!key) return text;
  
  const keyNum = parseInt(key, 10);
  if (isNaN(keyNum) || keyNum <= 0) return text;
  
  // Remove all whitespace and convert to uppercase
  const cleanText = text.replace(/\s+/g, '').toUpperCase();
  if (!cleanText) return '';
  
  const keyLength = Math.max(1, Math.min(keyNum, cleanText.length));
  const totalChars = cleanText.length;
  const fullRows = Math.floor(totalChars / keyLength);
  const remainder = totalChars % keyLength;
  
  // Calculate row lengths
  const rowLengths: number[] = [];
  for (let i = 0; i < keyLength; i++) {
    rowLengths.push(i < remainder ? fullRows + 1 : fullRows);
  }
  
  // Reconstruct the grid
  let index = 0;
  const grid: string[][] = [];
  
  for (let i = 0; i < keyLength; i++) {
    const row: string[] = [];
    const rowLength = rowLengths[i];
    
    for (let j = 0; j < rowLength; j++) {
      if (index < cleanText.length) {
        row.push(cleanText[index++]);
      }
    }
    
    grid.push(row);
  }
  
  // Read the grid column by column
  let result = '';
  const maxColLength = Math.max(...grid.map(row => row.length));
  
  for (let col = 0; col < maxColLength; col++) {
    for (let row = 0; row < keyLength; row++) {
      if (col < grid[row].length) {
        result += grid[row][col];
      }
    }
  }
  
  return result;
};

export default function TransportCipher() {
  const [plaintext, setPlaintext] = useState("");
  const [ciphertext, setCiphertext] = useState("");
  const [key, setKey] = useState("5");
  const { toast } = useToast();

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and limit to 2 digits
    const value = e.target.value.replace(/\D/g, '').slice(0, 2);
    setKey(value);
  };

  const handleEncrypt = () => {
    if (!key) {
      toast({
        title: "Error",
        description: "Please enter a valid key (a positive number)",
        variant: "destructive",
      });
      return;
    }
    
    if (!plaintext.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to encrypt",
        variant: "destructive",
      });
      return;
    }
    
    const result = transportEncrypt(plaintext, key);
    setCiphertext(result);
    
    toast({
      title: "Success!",
      description: "Text encrypted successfully",
    });
  };

  const handleDecrypt = () => {
    if (!key) {
      toast({
        title: "Error",
        description: "Please enter a valid key (a positive number)",
        variant: "destructive",
      });
      return;
    }
    
    if (!ciphertext.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to decrypt",
        variant: "destructive",
      });
      return;
    }
    
    const result = transportDecrypt(ciphertext, key);
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
    setKey("5");
  };

  const renderGrid = (text: string, isEncrypted: boolean) => {
    if (!key || !text.trim()) return null;
    
    const keyNum = parseInt(key, 10);
    if (isNaN(keyNum) || keyNum <= 0) return null;
    
    const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
    const numRows = Math.ceil(cleanText.length / keyNum);
    
    // Create grid
    const grid: string[][] = [];
    let index = 0;
    
    if (isEncrypted) {
      // For encrypted text, fill column by column
      for (let row = 0; row < numRows; row++) {
        const rowData: string[] = [];
        for (let col = 0; col < keyNum; col++) {
          const pos = col * numRows + row;
          rowData.push(pos < cleanText.length ? cleanText[pos] : '');
        }
        grid.push(rowData);
      }
    } else {
      // For plaintext, fill row by row
      for (let row = 0; row < numRows; row++) {
        const rowData = [];
        for (let col = 0; col < keyNum; col++) {
          const pos = row * keyNum + col;
          rowData.push(pos < cleanText.length ? cleanText[pos] : '');
        }
        grid.push(rowData);
      }
    }
    
    return (
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">
          {isEncrypted ? 'Encryption' : 'Decryption'} Grid (Key: {key}):
        </h4>
        <div className="border rounded-md p-2 bg-muted/20 overflow-x-auto">
          <table className="border-collapse">
            <tbody>
              {grid.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td 
                      key={`${rowIndex}-${colIndex}`}
                      className="border p-2 text-center min-w-[32px] h-8"
                    >
                      {cell || ' '}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 mb-6 mx-auto">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="40" 
            height="40" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="text-white"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gradient mb-2">Transport Cipher</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          A transposition cipher that rearranges the letters of the plaintext according to a system.
        </p>
      </div>

      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Transport Cipher Tool
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={reset} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Info className="h-4 w-4" />
                    Learn
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>About Transport Cipher</DialogTitle>
                    <DialogDescription>
                      Understanding the Transport Cipher (Columnar Transposition Cipher)
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-blue-500">How It Works</h3>
                      <p className="text-sm text-muted-foreground">
                        The Transport Cipher is a method of encryption that rearranges the positions of the original characters 
                        without changing the characters themselves. It works by writing the plaintext in a grid row-wise and 
                        then reading the ciphertext column-wise.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-500">Encryption Process</h3>
                      <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                        <li>Write the plaintext in a grid row-wise with a specified number of columns (key)</li>
                        <li>If the last row is incomplete, pad it with 'X' characters</li>
                        <li>Read the ciphertext column-wise, top to bottom, left to right</li>
                      </ol>
                    </div>
                    <div>
                      <h3 className="font-semibold text-purple-500">Example</h3>
                      <p className="text-sm text-muted-foreground">
                        With key = 3, plaintext "HELLOWORLD" would be written as:
                      </p>
                      <pre className="bg-muted p-2 rounded text-xs mt-1">
                        H E L L
                        O W O R
                        L D X X
                      </pre>
                      <p className="text-sm text-muted-foreground mt-2">
                        Ciphertext: "HOLELWRDLOX"
                      </p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                      <h4 className="font-medium text-blue-700 dark:text-blue-300 flex items-center">
                        <Info className="h-4 w-4 mr-2" />
                        Security Note
                      </h4>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        While the Transport Cipher provides basic security by rearranging characters, it can be broken 
                        through frequency analysis or by trying different key values. For stronger security, consider 
                        using modern encryption methods like AES-256.
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardTitle>
          <CardDescription>
            Enter text and a numeric key to encrypt or decrypt using the Transport cipher
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Controls */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="key">Key (Number of Columns)</Label>
                <Input
                  id="key"
                  type="number"
                  min="1"
                  max="20"
                  value={key}
                  onChange={handleKeyChange}
                  className="input-cyber"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  The number of columns to use for the grid. Higher values provide more security.
                </p>
              </div>
            </div>

            {/* Info Panel */}
            <Card className="bg-muted/20 border-border/30">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">How it works:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Text is written row-wise into a grid with N columns</li>
                  <li>• The ciphertext is read column-wise</li>
                  <li>• Key: {key || '5'} (number of columns)</li>
                  <li>• More secure than simple substitution ciphers</li>
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
                  <Button 
                    onClick={handleEncrypt} 
                    className="w-full btn-hero"
                    disabled={!key || !plaintext.trim()}
                  >
                    Encrypt
                  </Button>
                  {plaintext && renderGrid(plaintext, false)}
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
                  {ciphertext && renderGrid(ciphertext, true)}
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
                  <Button 
                    onClick={handleDecrypt} 
                    className="w-full btn-hero"
                    disabled={!key || !ciphertext.trim()}
                  >
                    Decrypt
                  </Button>
                  {ciphertext && renderGrid(ciphertext, true)}
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
                  {plaintext && renderGrid(plaintext, false)}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
