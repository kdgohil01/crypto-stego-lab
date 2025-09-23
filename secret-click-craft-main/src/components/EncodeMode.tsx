import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageCanvas } from './ImageCanvas';
import { ClickPoint, encodeMessage, normalizeClickPoint } from '@/utils/steganography';
import { Upload, Download, MousePointer, Lock } from 'lucide-react';
import { toast } from 'sonner';

export const EncodeMode = () => {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [clickSequence, setClickSequence] = useState<ClickPoint[]>([]);
  const [isSettingSequence, setIsSettingSequence] = useState(false);
  const [encodedImage, setEncodedImage] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      setImage(img);
      setClickSequence([]);
      setEncodedImage(null);
    };
    img.src = URL.createObjectURL(file);
  };

  const handleCanvasClick = (x: number, y: number) => {
    if (!isSettingSequence || !canvasRef.current) return;

    const canvas = canvasRef.current.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) return;

    if (clickSequence.length >= 4) {
      toast.warning('Maximum 4 click points allowed');
      return;
    }

    const newPoint = normalizeClickPoint(x, y, canvas.width, canvas.height, clickSequence.length);
    setClickSequence(prev => [...prev, newPoint]);
    
    toast.success(`Click point ${clickSequence.length + 1} set`);
  };

  const startSettingSequence = () => {
    setClickSequence([]);
    setIsSettingSequence(true);
    toast.info('Click on the image to set authentication points (3-4 points)');
  };

  const finishSettingSequence = () => {
    if (clickSequence.length < 3) {
      toast.error('Please set at least 3 click points');
      return;
    }
    setIsSettingSequence(false);
    toast.success(`Sequence set with ${clickSequence.length} points`);
  };

  const handleEncode = async () => {
    if (!image || !message || clickSequence.length < 3) {
      toast.error('Please provide an image, message, and click sequence');
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not create canvas context');

      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);

      const data = { message, clickSequence };
      const blob = await encodeMessage(canvas, data);
      
      setEncodedImage(blob);
      toast.success('Message encoded successfully!');
    } catch (error) {
      console.error('Encoding error:', error);
      toast.error('Failed to encode message');
    }
  };

  const handleDownload = () => {
    if (!encodedImage) return;

    const url = URL.createObjectURL(encodedImage);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'encoded-image.png';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Encoded image downloaded!');
  };

  const resetAll = () => {
    setMessage('');
    setImage(null);
    setClickSequence([]);
    setIsSettingSequence(false);
    setEncodedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-card border-border">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Encode Message</h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="message">Secret Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your secret message..."
              className="mt-2 bg-background border-border"
            />
          </div>

          <div>
            <Label>Upload Image</Label>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-2 bg-background border-border"
            />
          </div>
        </div>
      </Card>

      {image && (
        <Card className="p-6 bg-gradient-card border-border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Set Authentication Sequence</h3>
            <div className="space-x-2">
              {!isSettingSequence ? (
                <Button
                  onClick={startSettingSequence}
                  variant="secondary"
                  size="sm"
                >
                  <MousePointer className="w-4 h-4 mr-2" />
                  Set Click Points
                </Button>
              ) : (
                <Button
                  onClick={finishSettingSequence}
                  variant="default"
                  size="sm"
                  disabled={clickSequence.length < 3}
                >
                  Finish ({clickSequence.length}/4)
                </Button>
              )}
            </div>
          </div>

          <div ref={canvasRef}>
            <ImageCanvas
              image={image}
              clickSequence={clickSequence}
              onCanvasClick={handleCanvasClick}
              showClickPoints={true}
              className="mx-auto"
            />
          </div>

          {clickSequence.length >= 3 && !isSettingSequence && (
            <div className="mt-6 flex gap-4 justify-center">
              <Button
                onClick={handleEncode}
                disabled={!message || !image || encodedImage !== null}
                className="bg-gradient-primary hover:bg-gradient-hover"
              >
                <Lock className="w-4 h-4 mr-2" />
                Encode Message
              </Button>
              
              {encodedImage && (
                <Button onClick={handleDownload} className="bg-success text-success-foreground hover:bg-success/90">
                  <Download className="w-4 h-4 mr-2" />
                  Download Encoded Image
                </Button>
              )}
            </div>
          )}
        </Card>
      )}

      {encodedImage && (
        <Card className="p-4 bg-gradient-card border-border text-center">
          <p className="text-success mb-2">✓ Message encoded successfully!</p>
          <p className="text-sm text-muted-foreground">
            Share this encoded image with the intended recipient along with the authentication sequence.
          </p>
          <Button onClick={resetAll} variant="secondary" className="mt-4">
            Start New Encoding
          </Button>
        </Card>
      )}
    </div>
  );
};