import { Shield, Eye, Lock, Key, Image, Zap, Brain, History } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Learn() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gradient mb-6">Learn Cryptography & Steganography</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover the fascinating world of secret communication. From ancient ciphers to modern digital techniques.
        </p>
      </div>

      {/* Main Concepts */}
      <div className="grid gap-8 md:grid-cols-2 mb-12">
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Shield className="h-8 w-8 text-primary" />
              Cryptography
            </CardTitle>
            <CardDescription className="text-base">
              The art and science of protecting information by transforming it into an unreadable format
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold">Encryption</h4>
                  <p className="text-sm text-muted-foreground">Converting readable data into coded form</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Key className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold">Keys & Algorithms</h4>
                  <p className="text-sm text-muted-foreground">Mathematical methods and secret keys used for encryption</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold">Modern Applications</h4>
                  <p className="text-sm text-muted-foreground">HTTPS, banking, messaging apps, and more</p>
                </div>
              </div>
            </div>
            <Button asChild className="w-full btn-hero">
              <Link to="/cryptography">Try Cryptography Tools</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Eye className="h-8 w-8 text-secondary" />
              Steganography
            </CardTitle>
            <CardDescription className="text-base">
              The practice of concealing information within other non-secret text or data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Image className="h-5 w-5 text-secondary mt-1" />
                <div>
                  <h4 className="font-semibold">Hidden in Plain Sight</h4>
                  <p className="text-sm text-muted-foreground">Messages hidden in images, audio, or text</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Brain className="h-5 w-5 text-secondary mt-1" />
                <div>
                  <h4 className="font-semibold">Invisible Changes</h4>
                  <p className="text-sm text-muted-foreground">Modifications undetectable to human senses</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <History className="h-5 w-5 text-secondary mt-1" />
                <div>
                  <h4 className="font-semibold">Ancient to Digital</h4>
                  <p className="text-sm text-muted-foreground">From invisible ink to LSB pixel manipulation</p>
                </div>
              </div>
            </div>
            <Button asChild className="w-full bg-secondary hover:bg-secondary/90">
              <Link to="/steganography">Try Steganography Tools</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Key Differences */}
      <Card className="card-glow mb-12">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Key Differences</CardTitle>
          <CardDescription className="text-center text-base">
            Understanding when to use cryptography vs steganography
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 font-semibold">Aspect</th>
                  <th className="pb-3 font-semibold text-primary">Cryptography</th>
                  <th className="pb-3 font-semibold text-secondary">Steganography</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                <tr className="border-b border-border/30">
                  <td className="py-3 font-medium">Purpose</td>
                  <td className="py-3 text-muted-foreground">Make data unreadable</td>
                  <td className="py-3 text-muted-foreground">Hide data existence</td>
                </tr>
                <tr className="border-b border-border/30">
                  <td className="py-3 font-medium">Visibility</td>
                  <td className="py-3 text-muted-foreground">Obviously encrypted</td>
                  <td className="py-3 text-muted-foreground">Appears normal</td>
                </tr>
                <tr className="border-b border-border/30">
                  <td className="py-3 font-medium">Detection</td>
                  <td className="py-3 text-muted-foreground">Easy to detect</td>
                  <td className="py-3 text-muted-foreground">Hard to detect</td>
                </tr>
                <tr className="border-b border-border/30">
                  <td className="py-3 font-medium">Strength</td>
                  <td className="py-3 text-muted-foreground">Mathematical security</td>
                  <td className="py-3 text-muted-foreground">Security through obscurity</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium">Best Use</td>
                  <td className="py-3 text-muted-foreground">Secure communication</td>
                  <td className="py-3 text-muted-foreground">Covert communication</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Historical Examples */}
      <div className="grid gap-6 md:grid-cols-3 mb-12">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Caesar Cipher</CardTitle>
            <CardDescription>50 BC</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Used by Julius Caesar to communicate with his generals. Each letter was shifted by 3 positions in the alphabet.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
          <CardHeader>
            <CardTitle className="text-lg">Invisible Ink</CardTitle>
            <CardDescription>Ancient Times</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Messages written with substances like lemon juice that become visible when heated - early steganography.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardHeader>
            <CardTitle className="text-lg">Enigma Machine</CardTitle>
            <CardDescription>WWII</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Complex mechanical cipher machine used by Germans. Breaking it helped shorten WWII by years.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Methods for Cryptography and Steganography */}
      <Card className="card-glow mb-12">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Methods for Cryptography and Steganography</CardTitle>
          <CardDescription className="text-center text-base">
            Modern algorithms and techniques used in our tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 md:grid-cols-2">
            {/* AES-256 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-bold text-primary">AES-256 Encryption</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">What is AES-256?</h4>
                  <p className="text-sm text-muted-foreground">
                    Advanced Encryption Standard (AES) with 256-bit keys is a symmetric encryption algorithm adopted by the U.S. government and used worldwide. It's considered unbreakable with current technology.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">How it Works</h4>
                  <p className="text-sm text-muted-foreground">
                    AES uses the same key for both encryption and decryption. It processes data in 128-bit blocks through multiple rounds of substitution, permutation, and mixing operations.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Security Strength</h4>
                  <p className="text-sm text-muted-foreground">
                    With 2^256 possible keys, it would take billions of years for the world's fastest computers to crack through brute force. Used by banks, governments, and military.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Real-World Use</h4>
                  <p className="text-sm text-muted-foreground">
                    WiFi WPA3, file encryption, secure messaging apps, cloud storage encryption, and protecting sensitive data at rest and in transit.
                  </p>
                </div>
              </div>
            </div>

            {/* RSA-2048 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Key className="h-8 w-8 text-secondary" />
                <h3 className="text-xl font-bold text-secondary">RSA-2048 Encryption</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">What is RSA-2048?</h4>
                  <p className="text-sm text-muted-foreground">
                    RSA (Rivest-Shamir-Adleman) with 2048-bit keys is an asymmetric encryption algorithm using public-key cryptography. It uses two different keys: one public, one private.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">How it Works</h4>
                  <p className="text-sm text-muted-foreground">
                    Based on the mathematical difficulty of factoring large prime numbers. Anyone can encrypt with your public key, but only you can decrypt with your private key.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Security Strength</h4>
                  <p className="text-sm text-muted-foreground">
                    2048-bit RSA is currently considered secure against classical computers. The security relies on the computational difficulty of factoring very large numbers.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Real-World Use</h4>
                  <p className="text-sm text-muted-foreground">
                    HTTPS certificates, email encryption (PGP), digital signatures, secure key exchange, and establishing secure connections between parties.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison */}
          <div className="mt-8 p-6 bg-muted/20 rounded-lg">
            <h4 className="font-semibold mb-3 text-center">Key Differences</h4>
            <div className="grid gap-4 md:grid-cols-2 text-sm">
              <div>
                <span className="font-medium text-primary">AES-256 (Symmetric):</span>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  <li>• Same key for encryption/decryption</li>
                  <li>• Very fast processing</li>
                  <li>• Perfect for large amounts of data</li>
                  <li>• Key sharing challenge</li>
                </ul>
              </div>
              <div>
                <span className="font-medium text-secondary">RSA-2048 (Asymmetric):</span>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  <li>• Different keys for encryption/decryption</li>
                  <li>• Slower processing</li>
                  <li>• Perfect for key exchange</li>
                  <li>• No key sharing needed</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modern Applications */}
      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Modern Applications</CardTitle>
          <CardDescription className="text-center text-base">
            How these techniques protect you today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Cryptography Today</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• <strong>HTTPS:</strong> Secures web browsing and online shopping</li>
                <li>• <strong>Banking:</strong> Protects financial transactions</li>
                <li>• <strong>Messaging:</strong> End-to-end encryption in WhatsApp, Signal</li>
                <li>• <strong>Passwords:</strong> Hashed storage in databases</li>
                <li>• <strong>Cryptocurrencies:</strong> Blockchain and digital signatures</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary">Steganography Today</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• <strong>Digital Watermarks:</strong> Copyright protection in media</li>
                <li>• <strong>Anti-Counterfeiting:</strong> Hidden marks in currency</li>
                <li>• <strong>Covert Channels:</strong> Bypass censorship and surveillance</li>
                <li>• <strong>Data Exfiltration:</strong> Both legitimate and malicious uses</li>
                <li>• <strong>Privacy:</strong> Hide sensitive information in plain sight</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}