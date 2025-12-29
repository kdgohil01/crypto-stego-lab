import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Key, Lock, Unlock, Copy, Download, Upload, RefreshCw } from "lucide-react";
import { CryptoUtils } from "@/lib/crypto";
import { useToast } from "@/hooks/use-toast";

export const RSAEncryption = () => {
  const [inputText, setInputText] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [result, setResult] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const { toast } = useToast();

  const generateKeyPair = async () => {
    setIsProcessing(true);
    try {
      const keys = await CryptoUtils.generateRSAKeyPair();
      setPublicKey(keys.publicKey);
      setPrivateKey(keys.privateKey);
      toast({
        title: "Key Pair Generated",
        description: "New RSA-2048 key pair has been generated successfully.",
      });
    } catch (error) {
      toast({
        title: "Key Generation Failed",
        description: "An error occurred while generating keys.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEncrypt = async () => {
    if (!inputText || !publicKey) {
      toast({
        title: "Missing Information",
        description: "Please provide both text and public key.",
        variant: "destructive",
      });
      return;
    }

    if (inputText.length > 200) {
      toast({
        title: "Text Too Long",
        description: "RSA can only encrypt up to 200 characters. Use AES for larger texts.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const encrypted = await CryptoUtils.encryptRSA(inputText, publicKey);
      setResult(encrypted);
      toast({
        title: "Encryption Successful",
        description: "Your text has been encrypted with RSA-2048.",
      });
    } catch (error) {
      toast({
        title: "Encryption Failed",
        description: "An error occurred during encryption.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecrypt = async () => {
    if (!inputText || !privateKey) {
      toast({
        title: "Missing Information",
        description: "Please provide both encrypted text and private key.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const decrypted = await CryptoUtils.decryptRSA(inputText, privateKey);
      setResult(decrypted);
      toast({
        title: "Decryption Successful",
        description: "Your text has been decrypted successfully.",
      });
    } catch (error) {
      toast({
        title: "Decryption Failed",
        description: "Invalid private key or corrupted data.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Content has been copied to your clipboard.",
    });
  };

  const downloadKey = (key: string, filename: string) => {
    const blob = new Blob([key], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Key Management */}
      <Card className="bg-card/80 border-border/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5 text-cyber-primary" />
            <span>Key Management</span>
            <Badge variant="secondary">RSA-2048</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={generateKeyPair}
            disabled={isProcessing}
            className="w-full bg-gradient-cyber hover:shadow-glow-cyber"
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                <span>Generating...</span>
              </div>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate New Key Pair
              </>
            )}
          </Button>

          {/* Public Key */}
          {publicKey && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Public Key</Label>
                <div className="space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(publicKey)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadKey(publicKey, 'public_key.pem')}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <Textarea
                value={publicKey}
                readOnly
                rows={6}
                className="bg-input/50 font-mono text-xs"
              />
            </div>
          )}

          {/* Private Key */}
          {privateKey && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-destructive">Private Key (Keep Secret!)</Label>
                <div className="space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(privateKey)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadKey(privateKey, 'private_key.pem')}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <Textarea
                value={privateKey}
                readOnly
                rows={6}
                className="bg-destructive/10 border-destructive/20 font-mono text-xs"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Encryption/Decryption */}
      <Card className="bg-card/80 border-border/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5 text-cyber-primary" />
            <span>RSA Operations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode Toggle */}
          <div className="flex space-x-2">
            <Button
              variant={mode === "encrypt" ? "default" : "outline"}
              onClick={() => setMode("encrypt")}
              className={mode === "encrypt" ? "bg-gradient-cyber" : ""}
            >
              <Lock className="h-4 w-4 mr-2" />
              Encrypt
            </Button>
            <Button
              variant={mode === "decrypt" ? "default" : "outline"}
              onClick={() => setMode("decrypt")}
              className={mode === "decrypt" ? "bg-gradient-cyber" : ""}
            >
              <Unlock className="h-4 w-4 mr-2" />
              Decrypt
            </Button>
          </div>

          {/* Text Input */}
          <div className="space-y-2">
            <Label>
              {mode === "encrypt" ? "Text to Encrypt" : "Encrypted Text"}
            </Label>
            <Textarea
              placeholder={mode === "encrypt" ? "Enter text (max 200 chars)..." : "Paste encrypted data..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={6}
              className="bg-input/50"
              maxLength={mode === "encrypt" ? 200 : undefined}
            />
            {mode === "encrypt" && (
              <div className="text-xs text-muted-foreground text-right">
                {inputText.length}/200 characters
              </div>
            )}
          </div>

          {/* Key Input */}
          <div className="space-y-2">
            <Label>
              {mode === "encrypt" ? "Public Key" : "Private Key"}
            </Label>
            <Textarea
              placeholder={mode === "encrypt" ? "Paste public key..." : "Paste private key..."}
              value={mode === "encrypt" ? publicKey : privateKey}
              onChange={(e) => mode === "encrypt" ? setPublicKey(e.target.value) : setPrivateKey(e.target.value)}
              rows={4}
              className="bg-input/50 font-mono text-xs"
            />
          </div>

          {/* Action Button */}
          <Button
            onClick={mode === "encrypt" ? handleEncrypt : handleDecrypt}
            disabled={isProcessing || !inputText || (mode === "encrypt" ? !publicKey : !privateKey)}
            className="w-full bg-gradient-cyber hover:shadow-glow-cyber"
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                <span>Processing...</span>
              </div>
            ) : (
              <>
                {mode === "encrypt" ? <Lock className="h-4 w-4 mr-2" /> : <Unlock className="h-4 w-4 mr-2" />}
                {mode === "encrypt" ? "Encrypt with RSA" : "Decrypt with RSA"}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Result */}
      <Card className="bg-card/80 border-border/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Result</span>
            {result && (
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(result)}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-4">
              <Textarea
                value={result}
                readOnly
                rows={16}
                className="bg-input/50 font-mono text-sm"
              />
              <Badge variant="secondary" className="bg-cyber-secondary/20 text-cyber-secondary">
                {mode === "encrypt" ? "Encrypted with RSA-2048" : "Decrypted Successfully"}
              </Badge>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-lg">
              <div className="text-center">
                <Key className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Result will appear here</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};