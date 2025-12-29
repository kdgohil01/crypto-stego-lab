import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropZone } from './DropZone';
import { FilePreview } from './FilePreview';
import { PasswordInput } from './PasswordInput';
import { Unlock, FileDown, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { decrypt } from '@/lib/stego/crypto';
import { decompress } from '@/lib/stego/compression';
import { extractData } from '@/lib/stego/steganography';
import { unpackFileWithMetadata, createDownloadBlob, downloadFile, getFileTypeDescription } from '@/lib/stego/file-processor';
import { loadImageAsData, createImagePreview } from '@/lib/stego/image-utils';
import { formatBytes } from '@/lib/stego/steganography';

interface ExtractedFileInfo {
  filename: string;
  mimeType: string;
  size: number;
  blob: Blob;
}

export function ExtractPanel() {
  const { toast } = useToast();
  
  const [stegoImage, setStegoImage] = useState<File | null>(null);
  const [stegoPreview, setStegoPreview] = useState<string>('');
  
  const [password, setPassword] = useState('');
  const [processing, setProcessing] = useState(false);
  const [extractedFile, setExtractedFile] = useState<ExtractedFileInfo | null>(null);

  const handleImageSelect = async (file: File) => {
    setStegoImage(file);
    setExtractedFile(null);
    const preview = await createImagePreview(file);
    setStegoPreview(preview);
  };

  const handleExtract = async () => {
    if (!stegoImage || password.length < 8) return;

    setProcessing(true);
    setExtractedFile(null);

    try {
      // Step 1: Load stego image
      toast({ title: 'Loading image...', description: 'Reading stego-image data' });
      const imageData = await loadImageAsData(stegoImage);

      // Step 2: Extract embedded data
      toast({ title: 'Extracting...', description: 'Reading hidden data from pixels' });
      const extractedData = extractData(imageData);

      // Step 3: Decrypt
      toast({ title: 'Decrypting...', description: 'Verifying password and decrypting' });
      const decrypted = await decrypt(extractedData, password);

      // Step 4: Decompress
      toast({ title: 'Decompressing...', description: 'Restoring original data' });
      const decompressed = decompress(decrypted);

      // Step 5: Unpack file and metadata
      toast({ title: 'Unpacking...', description: 'Reconstructing file' });
      const processedFile = unpackFileWithMetadata(decompressed);
      const blob = createDownloadBlob(processedFile);

      setExtractedFile({
        filename: processedFile.filename,
        mimeType: processedFile.mimeType,
        size: processedFile.data.length,
        blob,
      });

      toast({
        title: 'Extraction successful!',
        description: `Found: ${processedFile.filename}`,
      });

    } catch (error) {
      toast({
        title: 'Extraction failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadExtracted = () => {
    if (extractedFile) {
      downloadFile(extractedFile.blob, extractedFile.filename);
      toast({
        title: 'Downloaded!',
        description: extractedFile.filename,
      });
    }
  };

  const handleReset = () => {
    setStegoImage(null);
    setStegoPreview('');
    setPassword('');
    setExtractedFile(null);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Unlock className="h-5 w-5 text-primary" />
          Extract Hidden File
        </CardTitle>
        <CardDescription>
          Recover a file hidden in a stego-image using the correct password
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Stego Image Section */}
        <div>
          <h3 className="text-sm font-medium mb-2 text-foreground">1. Select Stego-Image</h3>
          {stegoImage ? (
            <FilePreview
              file={stegoImage}
              imagePreview={stegoPreview}
              onRemove={() => {
                setStegoImage(null);
                setExtractedFile(null);
              }}
            />
          ) : (
            <DropZone
              onFileSelect={handleImageSelect}
              accept="image/png,image/bmp"
              label="Drop stego-image here"
              description="PNG or BMP image containing hidden data"
              icon="image"
              maxSize={2 * 1024 * 1024 * 1024} // 2GB
            />
          )}
        </div>

        {/* Password Input */}
        <PasswordInput
          value={password}
          onChange={setPassword}
          label="Decryption Password"
        />

        {/* Extract Button */}
        {!extractedFile && (
          <Button
            onClick={handleExtract}
            disabled={!stegoImage || password.length < 8 || processing}
            className="w-full"
            size="lg"
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Extracting...
              </>
            ) : (
              <>
                <Unlock className="mr-2 h-4 w-4" />
                Extract Hidden File
              </>
            )}
          </Button>
        )}

        {/* Extracted File Result */}
        {extractedFile && (
          <div className="rounded-lg border border-primary/50 bg-primary/5 p-4 space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <CheckCircle2 className="h-5 w-5" />
              <h3 className="font-medium">File Extracted Successfully!</h3>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Filename:</span>
                <span className="font-mono font-medium text-foreground">{extractedFile.filename}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium text-foreground">
                  {getFileTypeDescription(extractedFile.mimeType, extractedFile.filename)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Size:</span>
                <span className="font-mono font-medium text-foreground">{formatBytes(extractedFile.size)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleDownloadExtracted} className="flex-1">
                <FileDown className="mr-2 h-4 w-4" />
                Download File
              </Button>
              <Button onClick={handleReset} variant="outline">
                Extract Another
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

