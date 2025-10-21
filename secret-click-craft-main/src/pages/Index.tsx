import { useState } from 'react';
import { ModeSelector, AppMode } from '@/components/ModeSelector';
import { EncodeMode } from '@/components/EncodeMode';
import { DecodeMode } from '@/components/DecodeMode';

const Index = () => {
  const [mode, setMode] = useState<AppMode>('encode');

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <ModeSelector mode={mode} onModeChange={setMode} />
        </div>
        
        {mode === 'encode' ? <EncodeMode /> : <DecodeMode />}
      </div>
    </div>
  );
};

export default Index;
