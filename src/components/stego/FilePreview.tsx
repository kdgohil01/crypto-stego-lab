import { File, Image, X, FileText, Archive, Music, Video, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatBytes } from '@/lib/stego/steganography';
import { getFileExtension } from '@/lib/stego/file-processor';

interface FilePreviewProps {
  file: File;
  imagePreview?: string;
  onRemove: () => void;
}

function getFileIcon(mimeType: string, filename: string) {
  const ext = getFileExtension(filename);
  
  if (mimeType.startsWith('image/')) return Image;
  if (mimeType.startsWith('audio/')) return Music;
  if (mimeType.startsWith('video/')) return Video;
  if (mimeType === 'application/pdf') return FileText;
  if (mimeType.includes('spreadsheet') || ext === 'xls' || ext === 'xlsx') return FileSpreadsheet;
  if (mimeType.includes('zip') || mimeType.includes('archive') || ext === 'zip' || ext === 'rar') return Archive;
  if (mimeType.includes('word') || ext === 'doc' || ext === 'docx') return FileText;
  
  return File;
}

export function FilePreview({ file, imagePreview, onRemove }: FilePreviewProps) {
  const Icon = getFileIcon(file.type, file.name);
  const isImage = file.type.startsWith('image/');

  return (
    <div className="relative rounded-lg border border-border bg-card overflow-hidden">
      {isImage && imagePreview ? (
        <div className="aspect-video bg-muted flex items-center justify-center">
          <img
            src={imagePreview}
            alt="Preview"
            className="max-h-48 max-w-full object-contain"
          />
        </div>
      ) : (
        <div className="aspect-video bg-muted flex items-center justify-center">
          <Icon className="w-16 h-16 text-muted-foreground" />
        </div>
      )}
      
      <div className="p-3 bg-card">
        <p className="font-medium text-sm truncate text-foreground" title={file.name}>
          {file.name}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatBytes(file.size)}
        </p>
      </div>

      <Button
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2 h-7 w-7 rounded-full"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

