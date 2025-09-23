import { Link } from "react-router-dom";
import { Shield, Lock, Unlock, Key, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const tools = [
  {
    title: "Caesar Cipher",
    description: "The classic substitution cipher used by Julius Caesar. Each letter is shifted by a fixed number of positions.",
    icon: Lock,
    path: "/cryptography/caesar",
    difficulty: "Beginner",
    color: "text-white",
    bgColor: "bg-blue-500",
  },
  {
    title: "Vigenère Cipher",
    description: "A polyalphabetic cipher using a keyword. Much more secure than simple substitution ciphers.",
    icon: Unlock,
    path: "/cryptography/vigenere",
    difficulty: "Beginner",
    color: "text-white",
    bgColor: "bg-blue-500",
  },
  {
    title: "AES-256",
    description: "Advanced Encryption Standard with 256-bit keys. Military-grade symmetric encryption with PBKDF2 key derivation.",
    icon: Shield,
    path: "/cryptography/aes",
    difficulty: "Intermediate",
    color: "text-white",
    bgColor: "bg-green-500",
  },
  {
    title: "RSA-2048",
    description: "Asymmetric encryption with 2048-bit keys. Generate key pairs for secure public-key cryptography.",
    icon: Key,
    path: "/cryptography/rsa",
    difficulty: "Advanced",
    color: "text-white",
    bgColor: "bg-red-500",
  },
];

export default function Cryptography() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-primary mb-6 float-animation">
          <Shield className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-5xl font-bold text-gradient mb-6 leading-tight pb-2">Cryptography Playground</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Explore the world of encryption and decryption. Transform readable text into secret codes using classic and modern cryptographic techniques.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 mb-12">
        {tools.map((tool) => (
          <Card key={tool.title} className="card-glow group hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${tool.bgColor}`}>
                  <tool.icon className={`h-6 w-6 ${tool.color}`} />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${tool.color} ${tool.bgColor}`}>
                  {tool.difficulty}
                </span>
              </div>
              <CardTitle className="text-2xl">{tool.title}</CardTitle>
              <CardDescription className="text-base">{tool.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full btn-hero">
                <Link to={tool.path}>Try {tool.title}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Section */}
      <div className="grid gap-8 md:grid-cols-3 mb-12">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              Encryption
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Convert plaintext into ciphertext using mathematical algorithms and secret keys to protect information from unauthorized access.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Unlock className="h-5 w-5 text-secondary" />
              Decryption
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Reverse the encryption process to convert ciphertext back to plaintext using the correct key and algorithm.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              The strength of cryptography relies on the secrecy of keys and the computational difficulty of breaking the algorithm.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      <Card className="card-glow">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Getting Started</CardTitle>
          <CardDescription className="text-base">
            New to cryptography? Start with these simple steps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold mb-2">
                1
              </div>
              <h3 className="font-semibold mb-2">Choose a Cipher</h3>
              <p className="text-sm text-muted-foreground">Start with Caesar cipher for simplicity</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold mb-2">
                2
              </div>
              <h3 className="font-semibold mb-2">Enter Your Text</h3>
              <p className="text-sm text-muted-foreground">Type the message you want to encrypt</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold mb-2">
                3
              </div>
              <h3 className="font-semibold mb-2">Set Parameters</h3>
              <p className="text-sm text-muted-foreground">Configure shift value or keyword</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}