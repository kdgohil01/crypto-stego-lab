import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Lock, Unlock, Copy, Shield, AlertCircle } from "lucide-react";
import { CryptoUtils } from "@/lib/crypto-utils";
import { useToast } from "@/hooks/use-toast";

export const AESEncryption = () => {
  const [inputText, setInputText] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState("");
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");

  const resetForm = () => {
    setInputText("");
    setPassword("");
    setResult("");
  };
  const { toast } = useToast();

  const handleEncrypt = async () => {
    if (!inputText || !password) {
      toast({
        title: "Missing Information",
        description: "Please provide both text and password.",
        variant: "destructive",
      });
      return;
    }

    setIsEncrypting(true);
    try {
      const encrypted = await CryptoUtils.encryptAES(inputText, password);
      setResult(encrypted);
      toast({
        title: "Encryption Successful",
        description: "Your text has been encrypted with AES-256.",
      });
    } catch (error) {
      toast({
        title: "Encryption Failed",
        description: "An error occurred during encryption.",
        variant: "destructive",
      });
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleDecrypt = async () => {
    if (!inputText || !password) {
      toast({
        title: "Missing Information",
        description: "Please provide both encrypted text and password.",
        variant: "destructive",
      });
      return;
    }

    setIsEncrypting(true);
    try {
      const decrypted = await CryptoUtils.decryptAES(inputText, password);
      setResult(decrypted);
      toast({
        title: "Decryption Successful",
        description: "Your text has been decrypted successfully.",
      });
    } catch (error) {
      toast({
        title: "Decryption Failed",
        description: "Invalid password or corrupted data.",
        variant: "destructive",
      });
    } finally {
      setIsEncrypting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast({
      title: "Copied to Clipboard",
      description: "Result has been copied to your clipboard.",
    });
  };

  const getPasswordStrength = () => {
    if (password.length < 8) return { level: "weak", score: 25 };
    if (password.length < 12) return { level: "medium", score: 60 };
    if (password.length >= 16 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      return { level: "strong", score: 100 };
    }
    return { level: "good", score: 80 };
  };

  const strengthInfo = getPasswordStrength();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <span>AES-256 Encryption</span>
            <Badge variant="secondary">Intermediate</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode Toggle */}
          <div className="flex space-x-2">
            <Button
              variant={mode === "encrypt" ? "default" : "outline"}
              onClick={() => {
                setMode("encrypt");
                resetForm();
              }}
              className={mode === "encrypt" ? "btn-hero" : ""}
            >
              <Lock className="h-4 w-4 mr-2" />
              Encrypt
            </Button>
            <Button
              variant={mode === "decrypt" ? "default" : "outline"}
              onClick={() => {
                setMode("decrypt");
                resetForm();
              }}
              className={mode === "decrypt" ? "btn-hero" : ""}
            >
              <Unlock className="h-4 w-4 mr-2" />
              Decrypt
            </Button>
          </div>

          {/* Text Input */}
          <div className="space-y-2">
            <Label htmlFor="text-input">
              {mode === "encrypt" ? "Text to Encrypt" : "Encrypted Text"}
            </Label>
            <Textarea
              id="text-input"
              placeholder={mode === "encrypt" ? "Enter your secret message..." : "Paste encrypted data..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={6}
              className="bg-muted border-border"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <Label htmlFor="password-input">Encryption Password</Label>
            <Input
              id="password-input"
              type="password"
              placeholder={mode === "encrypt" ? "Enter a strong password..." : "Enter your password..."}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-muted border-border"
            />
            {password && mode === "encrypt" && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Password Strength</span>
                  <span className={`font-medium ${
                    strengthInfo.level === "strong" ? "text-green-500" :
                    strengthInfo.level === "good" ? "text-yellow-500" :
                    strengthInfo.level === "medium" ? "text-orange-500" : "text-red-500"
                  }`}>
                    {strengthInfo.level.toUpperCase()}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      strengthInfo.level === "strong" ? "bg-green-500" :
                      strengthInfo.level === "good" ? "bg-yellow-500" :
                      strengthInfo.level === "medium" ? "bg-orange-500" : "bg-red-500"
                    }`}
                    style={{ width: `${strengthInfo.score}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <Button
            onClick={mode === "encrypt" ? handleEncrypt : handleDecrypt}
            disabled={isEncrypting || !inputText || !password}
            className="w-full btn-hero"
          >
            {isEncrypting ? (
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                <span>Processing...</span>
              </div>
            ) : (
              <>
                {mode === "encrypt" ? <Lock className="h-4 w-4 mr-2" /> : <Unlock className="h-4 w-4 mr-2" />}
                {mode === "encrypt" ? "Encrypt with AES-256" : "Decrypt with AES-256"}
              </>
            )}
          </Button>

          {/* Security Notice */}
          <div className="flex items-start space-x-2 p-3 bg-muted/50 rounded-lg">
            <AlertCircle className="h-4 w-4 text-primary mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium">Security Note:</p>
              <p>AES-256 uses a 256-bit key with PBKDF2 key derivation and 100,000 iterations for maximum security.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Result Section */}
      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Result</span>
            {result && (
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
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
                rows={12}
                className="bg-muted border-border font-mono text-sm"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Length: {result.length} characters</span>
                <Badge variant="secondary" className="bg-secondary/20 text-secondary">
                  {mode === "encrypt" ? "Encrypted" : "Decrypted"}
                </Badge>
              </div>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-lg">
              <div className="text-center">
                <Lock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Result will appear here after {mode === "encrypt" ? "encryption" : "decryption"}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
