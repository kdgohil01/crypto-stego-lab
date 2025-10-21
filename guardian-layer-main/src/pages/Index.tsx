import { MultiLayerCrypto } from "@/components/MultiLayerCrypto";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-dark opacity-50" />
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="text-center space-y-6 animate-fade-in">
            <div className="inline-block">
              <div className="w-20 h-20 mx-auto mb-6 gradient-cyber rounded-full flex items-center justify-center cyber-glow">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold">
              <span className="gradient-cyber bg-clip-text text-transparent">
                CyberVault
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Military-grade multi-layer encryption combining{" "}
              <span className="text-primary font-semibold">AES-256</span>,{" "}
              <span className="text-secondary font-semibold">RSA-2048</span>, and{" "}
              <span className="text-accent font-semibold">Steganography</span>
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/20 border border-primary/20">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                256-bit Encryption
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/20 border border-primary/20">
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                2048-bit RSA Keys
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/20 border border-primary/20">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                Image Steganography
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Application */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background" />
        <div className="relative z-10">
          <MultiLayerCrypto />
        </div>
      </div>

      {/* Security Features Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Triple-Layer Protection</h2>
          <p className="text-muted-foreground text-lg">
            Your data is protected by three independent layers of encryption
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-lg border border-primary/20 hover:border-primary/40 transition-smooth cyber-glow">
            <div className="w-16 h-16 mx-auto mb-4 gradient-cyber rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">AES</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">AES-256 Encryption</h3>
            <p className="text-muted-foreground">
              Advanced Encryption Standard with 256-bit keys, the gold standard for data protection
            </p>
          </div>
          
          <div className="text-center p-6 rounded-lg border border-secondary/20 hover:border-secondary/40 transition-smooth">
            <div className="w-16 h-16 mx-auto mb-4 bg-secondary rounded-lg flex items-center justify-center">
              <span className="text-secondary-foreground font-bold text-xl">RSA</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">RSA-2048 Keys</h3>
            <p className="text-muted-foreground">
              Public-key cryptography with 2048-bit keys for secure key exchange and digital signatures
            </p>
          </div>
          
          <div className="text-center p-6 rounded-lg border border-accent/20 hover:border-accent/40 transition-smooth">
            <div className="w-16 h-16 mx-auto mb-4 bg-accent rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-accent-foreground" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Steganography</h3>
            <p className="text-muted-foreground">
              Hide encrypted data within images using advanced steganographic techniques
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
