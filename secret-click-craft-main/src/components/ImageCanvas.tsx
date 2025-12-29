import { useRef, useEffect, useState } from 'react';
import { ClickPoint, denormalizeClickPoint, isClickNearPoint } from '@/utils/steganography';
import { cn } from '@/lib/utils';

interface ImageCanvasProps {
  image: HTMLImageElement | null;
  clickSequence: ClickPoint[];
  onCanvasClick?: (x: number, y: number) => void;
  showClickPoints?: boolean;
  isVerifying?: boolean;
  onVerificationComplete?: (success: boolean) => void;
  className?: string;
}

export const ImageCanvas = ({
  image,
  clickSequence,
  onCanvasClick,
  showClickPoints = false,
  isVerifying = false,
  onVerificationComplete,
  className
}: ImageCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [verificationAttempts, setVerificationAttempts] = useState<ClickPoint[]>([]);

  useEffect(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate dimensions to maintain aspect ratio
    const maxWidth = 600;
    const maxHeight = 400;
    
    const ratio = Math.min(maxWidth / image.width, maxHeight / image.height);
    canvas.width = image.width * ratio;
    canvas.height = image.height * ratio;

    // Draw the image
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Draw click points if needed
    if (showClickPoints && clickSequence.length > 0) {
      drawClickPoints(ctx, canvas.width, canvas.height);
    }

    // Draw verification attempts
    if (isVerifying && verificationAttempts.length > 0) {
      drawVerificationAttempts(ctx, canvas.width, canvas.height);
    }
  }, [image, clickSequence, showClickPoints, isVerifying, verificationAttempts]);

  const drawClickPoints = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    clickSequence.forEach((point, index) => {
      const pos = denormalizeClickPoint(point, width, height);
      
      // Draw circle
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 15, 0, 2 * Math.PI);
      ctx.fillStyle = `hsl(${263 + index * 20}, 85%, 65%)`;
      ctx.fill();
      ctx.strokeStyle = 'hsl(220, 15%, 95%)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw number
      ctx.fillStyle = 'hsl(220, 27%, 5%)';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText((index + 1).toString(), pos.x, pos.y + 5);
    });
  };

  const drawVerificationAttempts = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    verificationAttempts.forEach((attempt, index) => {
      const pos = denormalizeClickPoint(attempt, width, height);
      const isCorrect = index < currentStep;
      
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 12, 0, 2 * Math.PI);
      ctx.fillStyle = isCorrect ? 'hsl(142, 76%, 55%)' : 'hsl(0, 84%, 60%)';
      ctx.fill();
    });
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Scale coordinates to canvas dimensions
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const canvasX = x * scaleX;
    const canvasY = y * scaleY;

    if (isVerifying && clickSequence.length > 0) {
      handleVerificationClick(canvasX, canvasY);
    } else if (onCanvasClick) {
      onCanvasClick(canvasX, canvasY);
    }
  };

  const handleVerificationClick = (x: number, y: number) => {
    if (currentStep >= clickSequence.length) return;

    const targetPoint = clickSequence[currentStep];
    const targetPos = denormalizeClickPoint(targetPoint, canvasRef.current!.width, canvasRef.current!.height);
    
    const isCorrect = isClickNearPoint(x, y, targetPos.x, targetPos.y, 25);
    
    const newAttempt: ClickPoint = {
      x: x / canvasRef.current!.width,
      y: y / canvasRef.current!.height,
      order: currentStep
    };

    setVerificationAttempts(prev => [...prev, newAttempt]);

    if (isCorrect) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      
      if (newStep >= clickSequence.length) {
        setTimeout(() => onVerificationComplete?.(true), 500);
      }
    } else {
      setTimeout(() => {
        setCurrentStep(0);
        setVerificationAttempts([]);
        onVerificationComplete?.(false);
      }, 1000);
    }
  };

  const resetVerification = () => {
    setCurrentStep(0);
    setVerificationAttempts([]);
  };

  useEffect(() => {
    if (!isVerifying) {
      resetVerification();
    }
  }, [isVerifying]);

  return (
    <div className={cn("relative", className)}>
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className={cn(
          "border border-border rounded-lg shadow-card cursor-pointer transition-smooth",
          "hover:shadow-glow"
        )}
      />
      {isVerifying && (
        <div className="absolute top-2 left-2 bg-card px-3 py-1 rounded-md">
          <span className="text-sm text-foreground">
            Step {currentStep + 1} of {clickSequence.length}
          </span>
        </div>
      )}
    </div>
  );
};