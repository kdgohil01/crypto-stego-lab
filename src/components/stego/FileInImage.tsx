import { EmbedPanel } from './EmbedPanel';
import { ExtractPanel } from './ExtractPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lock, Unlock, Shield, Binary, Zap, Eye } from 'lucide-react';

export default function FileInImage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Shield className="h-4 w-4" />
          AES-256 Encrypted • LSB Steganography
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Hide Any File Inside an Image
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Securely embed documents, archives, audio, and any other file type within 
          ordinary images using military-grade encryption and invisible steganography.
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 pt-4">
          {[
            { icon: Lock, label: 'AES-256-GCM' },
            { icon: Binary, label: 'LSB Embedding' },
            { icon: Zap, label: 'Compression' },
            { icon: Eye, label: 'Visually Identical' },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-sm"
            >
              <Icon className="h-3.5 w-3.5 text-primary" />
              <span className="text-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Tool Tabs */}
      <Tabs defaultValue="embed" className="max-w-2xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="embed" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Embed File
          </TabsTrigger>
          <TabsTrigger value="extract" className="flex items-center gap-2">
            <Unlock className="h-4 w-4" />
            Extract File
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="embed">
          <EmbedPanel />
        </TabsContent>
        
        <TabsContent value="extract">
          <ExtractPanel />
        </TabsContent>
      </Tabs>

      {/* Footer Info */}
      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>
          All processing happens locally in your browser. No data is ever uploaded to any server.
        </p>
      </div>
    </div>
  );
}

