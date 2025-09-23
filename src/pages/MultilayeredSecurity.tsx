import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Image, 
  ArrowRight,
  Zap,
  Shield,
  Eye,
  Database
} from "lucide-react";

export default function MultilayeredSecurity() {
  const tools = [
    {
      id: 'guardian-layer',
      title: 'Guardian Layer',
      description: 'Military-grade multi-layer encryption combining AES-256, RSA-2048, and advanced steganography with 4-click authentication.',
      icon: ShieldCheck,
      features: ['AES-256 Encryption', 'RSA-2048 Keys', 'Image Steganography', '4-Click Authentication'],
      status: 'Military Grade',
      path: '/multilayered-security/guardian-layer'
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <ShieldCheck className="h-12 w-12 text-primary" />
          <h1 className="text-5xl font-bold text-gradient">Multilayered Security</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
          Military-grade security solutions combining multiple encryption layers for maximum protection. 
          Advanced cryptographic techniques that go beyond traditional single-layer encryption.
        </p>
      </div>

      {/* Security Levels Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="card-glow text-center border-red-500/20">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-red-500 mb-2">Level 1</div>
            <div className="text-sm text-muted-foreground">AES-256 Encryption</div>
            <div className="text-xs text-muted-foreground mt-1">Advanced Encryption Standard</div>
          </CardContent>
        </Card>
        <Card className="card-glow text-center border-orange-500/20">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-orange-500 mb-2">Level 2</div>
            <div className="text-sm text-muted-foreground">RSA-2048 Keys</div>
            <div className="text-xs text-muted-foreground mt-1">Public Key Cryptography</div>
          </CardContent>
        </Card>
        <Card className="card-glow text-center border-green-500/20">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-green-500 mb-2">Level 3</div>
            <div className="text-sm text-muted-foreground">Steganography</div>
            <div className="text-xs text-muted-foreground mt-1">Hidden in Plain Sight</div>
          </CardContent>
        </Card>
      </div>

      {/* Tools Grid */}
      <div className="grid gap-8 lg:grid-cols-1 xl:grid-cols-1 max-w-4xl mx-auto">
        {tools.map((tool) => {
          const IconComponent = tool.icon;
          return (
            <Card key={tool.id} className="card-glow group hover:shadow-xl transition-all duration-300 border-primary/20">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                        {tool.title}
                      </CardTitle>
                      <Badge variant="outline" className="mt-2 bg-red-500/10 text-red-500 border-red-500/20">
                        {tool.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <CardDescription className="text-base leading-relaxed">
                  {tool.description}
                </CardDescription>
                
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-foreground">Security Layers:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {tool.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Zap className="h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    onClick={() => window.location.href = '/multilayered-security/guardian-layer'}
                    className="w-full"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Access Guardian Layer
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Security Architecture Section */}
      <div className="mt-16 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Security Architecture</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Understanding the multi-layered approach to data protection and how each layer contributes to overall security.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Symmetric Encryption
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                AES-256 provides fast, secure encryption for your actual data using a shared secret key.
              </p>
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">• 256-bit key strength</div>
                <div className="text-xs text-muted-foreground">• Government-approved standard</div>
                <div className="text-xs text-muted-foreground">• High-speed processing</div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                Asymmetric Encryption
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                RSA-2048 secures the AES key itself, eliminating the key distribution problem.
              </p>
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">• 2048-bit key pairs</div>
                <div className="text-xs text-muted-foreground">• Public-private key system</div>
                <div className="text-xs text-muted-foreground">• Secure key exchange</div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5 text-primary" />
                Steganographic Hiding
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Hide encrypted data within images, making it invisible to casual observation.
              </p>
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">• LSB pixel manipulation</div>
                <div className="text-xs text-muted-foreground">• 4-click authentication</div>
                <div className="text-xs text-muted-foreground">• Visual imperceptibility</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Comparison Section */}
      <div className="mt-16">
        <Card className="card-glow bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <h3 className="text-2xl font-bold">Why Multilayered Security?</h3>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                Single-layer encryption can be broken. Multilayered security ensures that even if one layer is compromised, 
                your data remains protected by additional independent security measures.
              </p>
              
              <div className="grid gap-4 md:grid-cols-3 mt-8">
                <div className="text-center p-4 rounded-lg bg-background/50">
                  <Shield className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <h4 className="font-semibold mb-1">Traditional Crypto</h4>
                  <p className="text-xs text-muted-foreground">Single encryption layer</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-background/50">
                  <Eye className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <h4 className="font-semibold mb-1">Basic Steganography</h4>
                  <p className="text-xs text-muted-foreground">Hidden but unencrypted</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-background/50 border-2 border-primary/20">
                  <ShieldCheck className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h4 className="font-semibold mb-1">Multilayered Security</h4>
                  <p className="text-xs text-muted-foreground">Triple-layer protection</p>
                </div>
              </div>
              
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
