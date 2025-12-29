import { formatBytes, calculateCapacity } from '@/lib/stego/steganography';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CapacityIndicatorProps {
  imageWidth: number;
  imageHeight: number;
  dataSize: number;
  className?: string;
}

export function CapacityIndicator({
  imageWidth,
  imageHeight,
  dataSize,
  className,
}: CapacityIndicatorProps) {
  const capacity = calculateCapacity(imageWidth, imageHeight);
  const usagePercent = capacity > 0 ? (dataSize / capacity) * 100 : 0;
  const remaining = capacity - dataSize;
  const canFit = dataSize <= capacity;

  let status: 'success' | 'warning' | 'error';
  if (!canFit) {
    status = 'error';
  } else if (usagePercent > 80) {
    status = 'warning';
  } else {
    status = 'success';
  }

  const StatusIcon = status === 'error' ? XCircle : status === 'warning' ? AlertTriangle : CheckCircle2;

  return (
    <div className={cn('rounded-lg border border-border p-4 bg-card', className)}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-sm text-foreground">Capacity Analysis</h4>
        <StatusIcon
          className={cn(
            'h-5 w-5',
            status === 'success' && 'text-primary',
            status === 'warning' && 'text-yellow-500',
            status === 'error' && 'text-destructive'
          )}
        />
      </div>

      <Progress
        value={Math.min(usagePercent, 100)}
        className={cn(
          'h-2 mb-3',
          status === 'error' && '[&>div]:bg-destructive'
        )}
      />

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <p className="text-muted-foreground">Data Size</p>
          <p className="font-mono font-medium text-foreground">{formatBytes(dataSize)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Capacity</p>
          <p className="font-mono font-medium text-foreground">{formatBytes(capacity)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Remaining</p>
          <p className={cn(
            'font-mono font-medium',
            remaining >= 0 ? 'text-primary' : 'text-destructive'
          )}>
            {remaining >= 0 ? formatBytes(remaining) : `-${formatBytes(Math.abs(remaining))}`}
          </p>
        </div>
      </div>

      {!canFit && (
        <p className="text-xs text-destructive mt-3">
          ⚠️ Data exceeds image capacity. Use a larger image or smaller file.
        </p>
      )}

      <p className="text-xs text-muted-foreground mt-3">
        Image: {imageWidth} × {imageHeight} pixels
      </p>
    </div>
  );
}

