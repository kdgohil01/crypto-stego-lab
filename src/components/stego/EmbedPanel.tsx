import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropZone } from './DropZone';
import { FilePreview } from './FilePreview';
import { PasswordInput } from './PasswordInput';
import { CapacityIndicator } from './CapacityIndicator';
import { Lock, Download, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { encrypt } from '@/lib/stego/crypto';
import { compress } from '@/lib/stego/compression';
import { embedData, calculateCapacity } from '@/lib/stego/steganography';
import { readFile, packFileWithMetadata } from '@/lib/stego/file-processor';
import { loadImageAsData, createImagePreview, downloadImageAsPng } from '@/lib/stego/image-utils';

export function EmbedPanel() {
  const { toast } = useToast();
  
  const [carrierImage, setCarrierImage] = useState<File | null>(null);
  const [carrierPreview, setCarrierPreview] = useState<string>('');
  const [carrierDimensions, setCarrierDimensions] = useState({ width: 0, height: 0 });
  
  const [payloadFile, setPayloadFile] = useState<File | null>(null);
  const [payloadPreview, setPayloadPreview] = useState<string>('');
  
  const [password, setPassword] = useState('');
  const [processing, setProcessing] = useState(false);
  const [processedSize, setProcessedSize] = useState(0);

  // Load carrier image preview and dimensions
  useEffect(() => {
    if (carrierImage) {
      createImagePreview(carrierImage).then(setCarrierPreview);
      const img = new Image();
      img.onload = () => {
        setCarrierDimensions({ width: img.width, height: img.height });
      };
      img.src = URL.createObjectURL(carrierImage);
    } else {
      setCarrierPreview('');
      setCarrierDimensions({ width: 0, height: 0 });
    }
  }, [carrierImage]);

  // Load payload preview if it's an image
  useEffect(() => {
    if (payloadFile && payloadFile.type.startsWith('image/')) {
      createImagePreview(payloadFile).then(setPayloadPreview);
    } else {
      setPayloadPreview('');
    }
  }, [payloadFile]);

  // Estimate processed size (compressed + encrypted + metadata)
  useEffect(() => {
    if (payloadFile) {
      // Rough estimate: file size * compression ratio + encryption overhead + metadata
      const estimatedSize = Math.ceil(payloadFile.size * 0.7) + 50 + payloadFile.name.length;
      setProcessedSize(estimatedSize);
    } else {
      setProcessedSize(0);
    }
  }, [payloadFile]);

  const canEmbed = () => {
    if (!carrierImage || !payloadFile || password.length < 8) return false;
    const capacity = calculateCapacity(carrierDimensions.width, carrierDimensions.height);
    return processedSize <= capacity;
  };

  const handleEmbed = async () => {
    if (!carrierImage || !payloadFile || password.length < 8) return;

    setProcessing(true);

    try {
      // Step 1: Read and prepare the file
      toast({ title: 'Reading file...', description: 'Preparing payload data' });
      const processedFile = await readFile(payloadFile);
      const packedData = packFileWithMetadata(processedFile);

      // Step 2: Compress
      toast({ title: 'Compressing...', description: 'Reducing payload size' });
      const compressed = compress(packedData);

      // Step 3: Encrypt
      toast({ title: 'Encrypting...', description: 'Securing data with AES-256-GCM' });
      const encrypted = await encrypt(compressed, password);

      // Step 4: Load carrier image
      toast({ title: 'Loading image...', description: 'Preparing carrier image' });
      const imageData = await loadImageAsData(carrierImage);

      // Step 5: Embed
      toast({ title: 'Embedding...', description: 'Hiding data in image pixels' });
      const result = embedData(imageData, encrypted);

      // Step 6: Download
      const outputFilename = carrierImage.name.replace(/\.[^/.]+$/, '') + '_stego.png';
      await downloadImageAsPng(result.imageData, outputFilename);

      toast({
        title: 'Success!',
        description: `Hidden ${processedFile.filename} in ${outputFilename}`,
      });

      // Reset form
      setCarrierImage(null);
      setPayloadFile(null);
      setPassword('');

    } catch (error) {
      toast({
        title: 'Embedding failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          Embed File in Image
        </CardTitle>
        <CardDescription>
          Hide any file inside an image using LSB steganography with AES-256 encryption
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Carrier Image Section */}
        <div>
          <h3 className="text-sm font-medium mb-2 text-foreground">1. Select Carrier Image</h3>
          {carrierImage ? (
            <FilePreview
              file={carrierImage}
              imagePreview={carrierPreview}
              onRemove={() => setCarrierImage(null)}
            />
          ) : (
            <DropZone
              onFileSelect={setCarrierImage}
              accept="image/*"
              label="Drop carrier image here"
              description="PNG, BMP, JPEG, or WebP (output will be PNG)"
              icon="image"
              maxSize={2 * 1024 * 1024 * 1024} // 2GB
            />
          )}
        </div>

        {/* Payload File Section */}
        <div>
          <h3 className="text-sm font-medium mb-2 text-foreground">2. Select File to Hide</h3>
          {payloadFile ? (
            <FilePreview
              file={payloadFile}
              imagePreview={payloadPreview}
              onRemove={() => setPayloadFile(null)}
            />
          ) : (
            <DropZone
              onFileSelect={setPayloadFile}
              accept="*/*"
              label="Drop any file here"
              description="PDF, DOCX, ZIP, EXE, MP3, or any other file type"
              icon="file"
              maxSize={2 * 1024 * 1024 * 1024} // 2GB
            />
          )}
        </div>

        {/* Capacity Indicator */}
        {carrierImage && payloadFile && carrierDimensions.width > 0 && (
          <CapacityIndicator
            imageWidth={carrierDimensions.width}
            imageHeight={carrierDimensions.height}
            dataSize={processedSize}
          />
        )}

        {/* Password Input */}
        <PasswordInput
          value={password}
          onChange={setPassword}
          showStrength
        />

        {/* Warning */}
        <Alert variant="default" className="border-yellow-500/50 bg-yellow-500/10">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-sm">
            <strong>Important:</strong> Never upload stego-images to social media or services 
            that re-compress images (JPEG). This will destroy the hidden data. Always share 
            as PNG file directly.
          </AlertDescription>
        </Alert>

        {/* Embed Button */}
        <Button
          onClick={handleEmbed}
          disabled={!canEmbed() || processing}
          className="w-full"
          size="lg"
        >
          {processing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Embed & Download Stego-Image
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

