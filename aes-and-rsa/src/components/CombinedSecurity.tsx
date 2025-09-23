import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Zap, Shield, Lock, Key, Check, ArrowRight, Download } from "lucide-react";
import { CryptoUtils } from "@/lib/crypto";
import { useToast } from "@/hooks/use-toast";

interface SecurityLayer {
  id: string;
  name: string;
  icon: any;
  status: "pending" | "processing" | "completed";
  description: string;
}

export const CombinedSecurity = () => {
  const [inputText, setInputText] = useState("");
  const [aesPassword, setAesPassword] = useState("");
  const [rsaPublicKey, setRsaPublicKey] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [results, setResults] = useState<{ [key: string]: string }>({});
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const securityLayers: SecurityLayer[] = [
    {
      id: "aes",
      name: "AES-256 Encryption",
      icon: Lock,
      status: "pending",
      description: "Encrypt with military-grade symmetric encryption"
    },
    {
      id: "rsa",
      name: "RSA-2048 Wrapper",
      icon: Key,
      status: "pending", 
      description: "Wrap with asymmetric public key encryption"
    },
    {
      id: "complete",
      name: "Dual-Layer Protection",
      icon: Shield,
      status: "pending",
      description: "High security achieved"
    }
  ];

  const [layers, setLayers] = useState(securityLayers);

  const updateLayerStatus = (layerId: string, status: "pending" | "processing" | "completed") => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, status } : layer
    ));
  };

  const applyCombinedSecurity = async () => {
    if (!inputText || !aesPassword) {
      toast({
        title: "Missing Information",
        description: "Please provide text and AES password at minimum.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    
    try {
      // Step 1: AES-256 Encryption
      updateLayerStatus("aes", "processing");
      setCurrentStep(1);
      setProgress(33);
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
      const aesEncrypted = await CryptoUtils.encryptAES(inputText, aesPassword);
      setResults(prev => ({ ...prev, aes: aesEncrypted }));
      updateLayerStatus("aes", "completed");
      
      // Step 2: RSA-2048 Encryption (if public key provided)
      let currentData = aesEncrypted;
      if (rsaPublicKey) {
        updateLayerStatus("rsa", "processing");
        setCurrentStep(2);
        setProgress(66);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For large data, we'll encrypt the AES password instead
        const rsaEncrypted = await CryptoUtils.encryptRSA(aesPassword, rsaPublicKey);
        setResults(prev => ({ ...prev, rsa: rsaEncrypted }));
        updateLayerStatus("rsa", "completed");
        currentData = `RSA_WRAPPED:${rsaEncrypted}|AES_DATA:${aesEncrypted}`;
      }
      
      // Step 3: Complete
      updateLayerStatus("complete", "completed");
      setCurrentStep(3);
      setProgress(100);
      
      setResults(prev => ({ 
        ...prev, 
        final: currentData,
        summary: `Security layers applied: ${rsaPublicKey ? 'AES-256 + RSA-2048' : 'AES-256 only'}`
      }));
      
      toast({
        title: "Dual-Layer Security Completed",
        description: `Data successfully encrypted with ${rsaPublicKey ? 'AES-256 + RSA-2048' : 'AES-256'}`,
      });
      
    } catch (error) {
      toast({
        title: "Security Process Failed",
        description: "An error occurred during the security process.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const generateRSAKeys = async () => {
    try {
      const keys = await CryptoUtils.generateRSAKeyPair();
      setRsaPublicKey(keys.publicKey);
      toast({
        title: "RSA Keys Generated",
        description: "Public key has been set for RSA layer.",
      });
    } catch (error) {
      toast({
        title: "Key Generation Failed",
        description: "Failed to generate RSA keys.",
        variant: "destructive",
      });
    }
  };

  const downloadResults = () => {
    const data = JSON.stringify(results, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dual_layer_security_results.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Configuration Panel */}
      <div className="space-y-6">
        <Card className="bg-card/80 border-border/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-cyber-primary" />
              <span>Dual-Layer Security Suite</span>
              <Badge variant="secondary" className="bg-gradient-cyber text-primary-foreground">
                High Protection
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Input Text */}
            <div className="space-y-2">
              <Label>Data to Protect</Label>
              <Textarea
                placeholder="Enter your sensitive data..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={4}
                className="bg-input/50"
              />
            </div>

            {/* AES Configuration */}
            <div className="space-y-2">
              <Label>AES-256 Password *</Label>
              <Input
                type="password"
                placeholder="Strong encryption password..."
                value={aesPassword}
                onChange={(e) => setAesPassword(e.target.value)}
                className="bg-input/50"
                required
              />
            </div>

            {/* RSA Configuration */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>RSA-2048 Public Key (Optional)</Label>
                <Button variant="outline" size="sm" onClick={generateRSAKeys}>
                  Generate Keys
                </Button>
              </div>
              <Textarea
                placeholder="Paste RSA public key for additional layer..."
                value={rsaPublicKey}
                onChange={(e) => setRsaPublicKey(e.target.value)}
                rows={3}
                className="bg-input/50 font-mono text-xs"
              />
            </div>

            {/* Progress */}
            {isProcessing && (
              <div className="space-y-2">
                <Label>Security Progress</Label>
                <Progress value={progress} className="w-full" />
                <div className="text-sm text-muted-foreground">
                  Step {currentStep} of 3: {layers.find(l => l.status === "processing")?.description}
                </div>
              </div>
            )}

            {/* Apply Security Button */}
            <Button
              onClick={applyCombinedSecurity}
              disabled={isProcessing || !inputText || !aesPassword}
              className="w-full bg-gradient-cyber hover:shadow-glow-cyber"
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  <span>Applying Security Layers...</span>
                </div>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Apply Dual-Layer Security
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Security Layers Visualization */}
      <div className="space-y-6">        
        <Card className="bg-card/80 border-border/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Security Layers Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {layers.map((layer, index) => {
              const IconComponent = layer.icon;
              return (
                <div
                  key={layer.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-300 ${
                    layer.status === "completed" ? "border-cyber-secondary bg-cyber-secondary/10" :
                    layer.status === "processing" ? "border-cyber-primary bg-cyber-primary/10 animate-glow-pulse" :
                    "border-border bg-muted/30"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    layer.status === "completed" ? "bg-cyber-secondary" :
                    layer.status === "processing" ? "bg-cyber-primary animate-pulse" :
                    "bg-muted"
                  }`}>
                    {layer.status === "completed" ? (
                      <Check className="h-4 w-4 text-primary-foreground" />
                    ) : (
                      <IconComponent className={`h-4 w-4 ${
                        layer.status === "processing" ? "text-primary-foreground" : "text-muted-foreground"
                      }`} />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-medium">{layer.name}</div>
                    <div className="text-sm text-muted-foreground">{layer.description}</div>
                  </div>
                  
                  <Badge 
                    variant={
                      layer.status === "completed" ? "default" :
                      layer.status === "processing" ? "secondary" : "outline"
                    }
                    className={
                      layer.status === "completed" ? "bg-cyber-secondary" :
                      layer.status === "processing" ? "bg-cyber-primary animate-pulse" : ""
                    }
                  >
                    {layer.status}
                  </Badge>
                  
                  {index < layers.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Results */}
        {Object.keys(results).length > 0 && (
          <Card className="bg-card/80 border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Protected Data</span>
                <Button variant="outline" size="sm" onClick={downloadResults}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.final && (
                <div className="space-y-2">
                  <Label>Final Secured Package</Label>
                  <Textarea
                    value={results.final}
                    readOnly
                    rows={6}
                    className="bg-input/50 font-mono text-xs"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Size: {results.final.length} characters
                    </span>
                    <Badge variant="secondary" className="bg-cyber-secondary/20 text-cyber-secondary">
                      {results.summary}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};