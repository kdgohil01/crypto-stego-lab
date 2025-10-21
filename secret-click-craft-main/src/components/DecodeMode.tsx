import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageCanvas } from './ImageCanvas';
import { ClickPoint, decodeMessage } from '@/utils/steganography';
import { Upload, Eye, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export const DecodeMode = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [clickSequence, setClickSequence] = useState<ClickPoint[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [decodedMessage, setDecodedMessage] = useState('');
  const [attempts, setAttempts] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      setImage(img);
      setClickSequence([]);
      setVerificationSuccess(false);
      setDecodedMessage('');
      setAttempts(0);
      
      // Try to decode the message to get click sequence
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const data = decodeMessage(canvas);
      if (data && data.clickSequence) {
        setClickSequence(data.clickSequence);
        toast.success('Image loaded! Authentication required to reveal message.');
      } else {
        toast.error('No hidden message found in this image.');
      }
    };
    img.src = URL.createObjectURL(file);
  };

  const startVerification = () => {
    if (!clickSequence.length) {
      toast.error('No authentication sequence found in image');
      return;
    }
    setIsVerifying(true);
    setVerificationSuccess(false);
    toast.info('Click the authentication points in the correct sequence');
  };

  const handleVerificationComplete = (success: boolean) => {
    setIsVerifying(false);
    
    if (success) {
      setVerificationSuccess(true);
      revealMessage();
      toast.success('Authentication successful! Message revealed.');
    } else {
      setAttempts(prev => prev + 1);
      if (attempts >= 2) {
        toast.error('Too many failed attempts. Please try again later.');
        resetAll();
      } else {
        toast.error(`Authentication failed. ${2 - attempts} attempts remaining.`);
      }
    }
  };

  const revealMessage = () => {
    if (!image) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    const data = decodeMessage(canvas);
    if (data && data.message) {
      setDecodedMessage(data.message);
    } else {
      toast.error('Failed to decode message');
    }
  };

  const resetAll = () => {
    setImage(null);
    setClickSequence([]);
    setIsVerifying(false);
    setVerificationSuccess(false);
    setDecodedMessage('');
    setAttempts(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(decodedMessage);
    toast.success('Message copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-card border-border">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Decode Message</h2>
        
        <div>
          <Label>Upload Encoded Image</Label>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-2 bg-background border-border"
          />
        </div>
      </Card>

      {image && clickSequence.length > 0 && (
        <Card className="p-6 bg-gradient-card border-border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Authentication Required</h3>
            <div className="flex items-center space-x-2">
              {attempts > 0 && (
                <span className="text-sm text-warning">
                  Attempts: {attempts}/3
                </span>
              )}
              {!isVerifying && !verificationSuccess && (
                <Button
                  onClick={startVerification}
                  variant="default"
                  size="sm"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Start Authentication
                </Button>
              )}
              {isVerifying && (
                <Button
                  onClick={() => setIsVerifying(false)}
                  variant="secondary"
                  size="sm"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              )}
            </div>
          </div>

          <ImageCanvas
            image={image}
            clickSequence={clickSequence}
            isVerifying={isVerifying}
            onVerificationComplete={handleVerificationComplete}
            showClickPoints={verificationSuccess}
            className="mx-auto"
          />

          {!verificationSuccess && !isVerifying && (
            <div className="mt-4 p-4 bg-secondary rounded-lg text-center">
              <p className="text-sm text-foreground">
                Click on {clickSequence.length} specific points in the correct sequence to unlock the hidden message.
              </p>
            </div>
          )}
        </Card>
      )}

      {verificationSuccess && decodedMessage && (
        <Card className="p-6 bg-gradient-card border-success/20 border-2">
          <h3 className="text-xl font-semibold text-success mb-4">Message Revealed</h3>
          <div className="bg-background rounded-lg p-4 mb-4">
            <p className="text-foreground whitespace-pre-wrap break-words">
              {decodedMessage}
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <Button onClick={copyToClipboard} variant="secondary">
              Copy to Clipboard
            </Button>
            <Button onClick={resetAll} variant="secondary">
              Decode Another Image
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};