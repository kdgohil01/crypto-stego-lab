import { Link } from "react-router-dom";
import { Shield, Eye, BookOpen, ArrowRight, Lock, Image, Brain, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SignOutButton from "../components/SignOutButton";


function Navbar() {
  return (
    <nav className="flex justify-between p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
      <div className="relative"></div>
      <div className="relative">
        <SignOutButton />
      </div>
    </nav>
  );
}

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar /> {/* <-- Add this line */}
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 py-20 text-center relative">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl font-bold text-gradient mb-6 leading-tight">
              Master the Art of
              <br />
              Secret Communication
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Explore cryptography, steganography, and data processing with interactive tools. Learn to encrypt messages, hide secrets in images, and process data with multiple security levels.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6">
                <Link to="/cryptography" className="gap-2">
                  <Shield className="h-5 w-5" />
                  Try Cryptography
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-lg px-8 py-6">
                <Link to="/steganography" className="gap-2">
                  <Eye className="h-5 w-5" />
                  Try Steganography
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-red-500 hover:bg-red-600 text-lg px-8 py-6">
                <Link to="/multilayered-security" className="gap-2">
                  <Lock className="h-5 w-5" />
                  Try Multilayered Security
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-purple-500 hover:bg-purple-600 text-lg px-8 py-6">
                <Link to="/data-processing" className="gap-2">
                  <Database className="h-5 w-5" />
                  Data Processing
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Choose Your Path</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Dive into the fascinating worlds of encryption, hidden messages, and data processing
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-4 max-w-7xl mx-auto">
            {/* Cryptography */}
            <Card className="card-glow group hover:scale-105 transition-all duration-300 h-full flex flex-col border-primary/20">
              <CardHeader className="text-center pb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-6 group-hover:shadow-glow-primary transition-all duration-300">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl mb-2">Cryptography</CardTitle>
                <CardDescription className="text-base">
                  Transform readable text into unbreakable codes using mathematical algorithms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3 text-sm">
                    <span>AES-256 & RSA-2048 Encryption</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Lock className="h-4 w-4 text-primary" />
                    <span>Real-time Encryption/Decryption</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Lock className="h-4 w-4 text-primary" />
                    <span>Interactive Learning Tools</span>
                  </div>
                </div>
                <Button asChild className="w-full bg-primary hover:bg-primary/90 mt-auto">
                  <Link to="/cryptography">Explore Cryptography</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="card-glow group hover:scale-105 transition-all duration-300 h-full flex flex-col border-secondary/20">
              <CardHeader className="text-center pb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-secondary mb-6 group-hover:shadow-glow-secondary transition-all duration-300">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl mb-2">Steganography</CardTitle>
                <CardDescription className="text-base">
                  Hide secret messages within innocent-looking files and images
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3 text-sm">
                    <Image className="h-4 w-4 text-secondary" />
                    <span>Text-in-Image Hiding</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Image className="h-4 w-4 text-secondary" />
                    <span>LSB Manipulation</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Image className="h-4 w-4 text-secondary" />
                    <span>Invisible Message Extraction</span>
                  </div>
                </div>
                <Button asChild className="w-full bg-secondary hover:bg-secondary/90 mt-auto">
                  <Link to="/steganography">Explore Steganography</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="card-glow group hover:scale-105 transition-all duration-300 h-full flex flex-col">
              <CardHeader className="text-center pb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 mb-6 group-hover:shadow-[0_0_20px_hsl(270_100%_50%/0.4)] transition-all duration-300">
                  <Database className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl mb-2">Data Processing</CardTitle>
                <CardDescription className="text-base">
                  Transform and encode data with multi-level security processing tools
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3 text-sm">
                    <Database className="h-4 w-4 text-purple-500" />
                    <span>URL Encoding/Decoding</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Database className="h-4 w-4 text-purple-500" />
                    <span>Base64 Processing</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Database className="h-4 w-4 text-purple-500" />
                    <span>AES-256 Encryption</span>
                  </div>
                </div>
                <Button asChild className="w-full bg-purple-500 hover:bg-purple-600 mt-auto">
                  <Link to="/data-processing">Explore Data Processing</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Learn */}
            <Card className="card-glow group hover:scale-105 transition-all duration-300 h-full flex flex-col">
              <CardHeader className="text-center pb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-accent to-primary mb-6 group-hover:shadow-[0_0_20px_hsl(180_100%_50%/0.4)] transition-all duration-300">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl mb-2">Learn & Discover</CardTitle>
                <CardDescription className="text-base">
                  Understand the theory, history, and applications of secret communication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3 text-sm">
                    <Brain className="h-4 w-4 text-accent" />
                    <span>Historical Examples</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Brain className="h-4 w-4 text-accent" />
                    <span>Modern Applications</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Brain className="h-4 w-4 text-accent" />
                    <span>Theory & Concepts</span>
                  </div>
                </div>
                <Button asChild className="w-full btn-hero mt-auto">
                  <Link to="/learn">Start Learning</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Ready to Begin?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of learners exploring the fascinating world of cryptography and steganography
            </p>
            <Button asChild size="lg" className="btn-hero text-lg px-12 py-6">
              <Link to="/learn" className="gap-2">
                Start Your Journey
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
