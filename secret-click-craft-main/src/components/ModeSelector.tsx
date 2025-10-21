import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Lock, Unlock } from 'lucide-react';

export type AppMode = 'encode' | 'decode';

interface ModeSelectorProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export const ModeSelector = ({ mode, onModeChange }: ModeSelectorProps) => {
  return (
    <Card className="p-6 bg-gradient-card border-border">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
          StegoGuard
        </h1>
        <p className="text-muted-foreground">
          Secure message hiding with click-sequence authentication
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant={mode === 'encode' ? 'default' : 'secondary'}
          onClick={() => onModeChange('encode')}
          className="h-24 flex-col space-y-2"
        >
          <Lock className="w-8 h-8" />
          <div>
            <div className="font-semibold">Encode</div>
            <div className="text-xs opacity-80">Hide a message</div>
          </div>
        </Button>
        
        <Button
          variant={mode === 'decode' ? 'default' : 'secondary'}
          onClick={() => onModeChange('decode')}
          className="h-24 flex-col space-y-2"
        >
          <Unlock className="w-8 h-8" />
          <div>
            <div className="font-semibold">Decode</div>
            <div className="text-xs opacity-80">Reveal a message</div>
          </div>
        </Button>
      </div>
    </Card>
  );
};