import { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, File } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  accept: string;
  label: string;
  description: string;
  icon?: 'image' | 'file';
  maxSize?: number;
  className?: string;
}

export function DropZone({
  onFileSelect,
  accept,
  label,
  description,
  icon = 'file',
  maxSize,
  className,
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateAndSelectFile = useCallback((file: File) => {
    setError(null);

    if (maxSize && file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      const maxSizeGB = maxSize / (1024 * 1024 * 1024);
      const sizeText = maxSizeGB >= 1 
        ? `${maxSizeGB.toFixed(1)}GB` 
        : `${maxSizeMB.toFixed(0)}MB`;
      setError(`File too large. Maximum size is ${sizeText}`);
      return;
    }

    onFileSelect(file);
  }, [maxSize, onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndSelectFile(files[0]);
    }
  }, [validateAndSelectFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndSelectFile(files[0]);
    }
    // Reset input
    e.target.value = '';
  }, [validateAndSelectFile]);

  const Icon = icon === 'image' ? ImageIcon : File;

  return (
    <div
      className={cn(
        'relative border-2 border-dashed rounded-lg p-8 transition-all duration-200 cursor-pointer',
        'hover:border-primary/60 hover:bg-accent/30',
        isDragging && 'border-primary bg-accent/50 scale-[1.02]',
        !isDragging && 'border-border',
        error && 'border-destructive/50',
        className
      )}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => document.getElementById(`file-input-${label}`)?.click()}
    >
      <input
        type="file"
        id={`file-input-${label}`}
        accept={accept}
        onChange={handleFileInput}
        className="hidden"
      />
      
      <div className="flex flex-col items-center gap-3 text-center">
        <div className={cn(
          'p-3 rounded-full transition-colors',
          isDragging ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
        )}>
          {isDragging ? (
            <Upload className="w-8 h-8" />
          ) : (
            <Icon className="w-8 h-8" />
          )}
        </div>
        
        <div>
          <p className="font-medium text-foreground">{label}</p>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>

        {error && (
          <p className="text-sm text-destructive font-medium">{error}</p>
        )}
      </div>
    </div>
  );
}

