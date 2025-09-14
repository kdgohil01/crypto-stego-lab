import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Key } from "lucide-react";
import { AESEncryption } from "./AESEncryption";
import { RSAEncryption } from "./RSAEncryption";

const SecurityDashboard = () => {
  const [activeLayer, setActiveLayer] = useState<string>("overview");

  const securityLayers = [
    {
      id: "aes",
      title: "AES-256 Encryption",
      description: "Advanced symmetric encryption",
      icon: Lock,
      status: "active",
      strength: 98
    },
    {
      id: "rsa",
      title: "RSA-2048 Encryption",
      description: "Asymmetric public key cryptography",
      icon: Key,
      status: "active",
      strength: 96
    }
  ];

  const renderActiveComponent = () => {
    switch (activeLayer) {
      case "aes":
        return <AESEncryption />;
      case "rsa":
        return <RSAEncryption />;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityLayers.map((layer) => {
              const IconComponent = layer.icon;
              return (
                <Card 
                  key={layer.id}
                  className="cursor-pointer transition-all duration-300 hover:shadow-glow-cyber border-border/50 bg-card/80 backdrop-blur-sm"
                  onClick={() => setActiveLayer(layer.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-gradient-cyber">
                          <IconComponent className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{layer.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">{layer.description}</p>
                        </div>
                      </div>
                      <Badge 
                        variant="secondary"
                      >
                        {layer.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Security Strength</span>
                        <span className="text-cyber-primary font-medium">{layer.strength}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-gradient-cyber h-2 rounded-full transition-all duration-500"
                          style={{ width: `${layer.strength}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-mesh p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Shield className="h-10 w-10 text-cyber-primary animate-glow-pulse" />
            <h1 className="text-4xl font-bold bg-gradient-cyber bg-clip-text text-transparent">
              CyberVault Security Suite
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced encryption combining AES-256 and RSA-2048 for secure data protection
          </p>
        </div>

        {/* Navigation */}
        {activeLayer !== "overview" && (
          <div className="flex items-center justify-center">
            <button
              onClick={() => setActiveLayer("overview")}
              className="px-6 py-2 bg-card/80 border border-border rounded-lg hover:bg-card transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-6">
          {renderActiveComponent()}
        </div>

        {/* Security Status Bar */}
        <Card className="bg-card/80 border-border/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-3 w-3 bg-cyber-secondary rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">System Status: Secure</span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>Encryption: Active</span>
                <span>•</span>
                <span>Protection: High</span>
                <span>•</span>
                <span>Threats Detected: 0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecurityDashboard;