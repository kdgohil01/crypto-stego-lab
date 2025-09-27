import React, { useState, useRef } from 'react';
import { Upload, Download, Play, Pause, Volume2, FileAudio, Lock, Unlock, Copy, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Audio steganography using LSB technique with proper WAV handling
const encodeMessageInAudio = async (audioBuffer: ArrayBuffer, message: string): Promise<ArrayBuffer> => {
  // Parse WAV file directly
  const view = new DataView(audioBuffer);
  
  // Check if it's a valid WAV file
  const riff = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3));
  const wave = String.fromCharCode(view.getUint8(8), view.getUint8(9), view.getUint8(10), view.getUint8(11));
  
  if (riff !== 'RIFF' || wave !== 'WAVE') {
    throw new Error('Invalid WAV file format');
  }
  
  // Find data chunk
  let dataOffset = 12;
  let dataSize = 0;
  
  while (dataOffset < view.byteLength) {
    const chunkId = String.fromCharCode(
      view.getUint8(dataOffset),
      view.getUint8(dataOffset + 1),
      view.getUint8(dataOffset + 2),
      view.getUint8(dataOffset + 3)
    );
    const chunkSize = view.getUint32(dataOffset + 4, true);
    
    if (chunkId === 'data') {
      dataSize = chunkSize;
      dataOffset += 8;
      break;
    }
    
    dataOffset += 8 + chunkSize;
  }
  
  if (dataSize === 0) {
    throw new Error('No data chunk found in WAV file');
  }
  
  // Prepare message with header and delimiter
  const messageWithHeader = 'STEG' + message + '###END###';
  const messageBinary = messageWithHeader
    .split('')
    .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join('');
  
  const availableBits = Math.floor(dataSize / 2); // 16-bit samples, so dataSize/2 samples
  
  if (messageBinary.length > availableBits) {
    throw new Error(`Message too long. Maximum ${Math.floor(availableBits / 8)} characters allowed.`);
  }
  
  // Create a copy of the audio buffer
  const modifiedBuffer = audioBuffer.slice(0);
  const modifiedView = new DataView(modifiedBuffer);
  
  // Embed message bits into LSB of 16-bit audio samples
  for (let i = 0; i < messageBinary.length; i++) {
    const sampleOffset = dataOffset + (i * 2);
    const sample = modifiedView.getInt16(sampleOffset, true);
    const bit = parseInt(messageBinary[i]);
    
    // Modify LSB
    const modifiedSample = (sample & 0xFFFE) | bit;
    modifiedView.setInt16(sampleOffset, modifiedSample, true);
  }
  
  return modifiedBuffer;
};

const decodeMessageFromAudio = async (audioBuffer: ArrayBuffer): Promise<string> => {
  const view = new DataView(audioBuffer);
  
  // Check if it's a valid WAV file
  const riff = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3));
  const wave = String.fromCharCode(view.getUint8(8), view.getUint8(9), view.getUint8(10), view.getUint8(11));
  
  if (riff !== 'RIFF' || wave !== 'WAVE') {
    throw new Error('Invalid WAV file format');
  }
  
  // Find data chunk
  let dataOffset = 12;
  let dataSize = 0;
  
  while (dataOffset < view.byteLength) {
    const chunkId = String.fromCharCode(
      view.getUint8(dataOffset),
      view.getUint8(dataOffset + 1),
      view.getUint8(dataOffset + 2),
      view.getUint8(dataOffset + 3)
    );
    const chunkSize = view.getUint32(dataOffset + 4, true);
    
    if (chunkId === 'data') {
      dataSize = chunkSize;
      dataOffset += 8;
      break;
    }
    
    dataOffset += 8 + chunkSize;
  }
  
  if (dataSize === 0) {
    throw new Error('No data chunk found in WAV file');
  }
  
  let messageBinary = '';
  const maxSamples = Math.floor(dataSize / 2); // 16-bit samples
  
  // Extract LSB from 16-bit audio samples
  for (let i = 0; i < maxSamples; i++) {
    const sampleOffset = dataOffset + (i * 2);
    if (sampleOffset + 1 >= view.byteLength) break;
    
    const sample = view.getInt16(sampleOffset, true);
    const bit = sample & 1;
    messageBinary += bit.toString();
    
    // Check every 8 bits for potential message
    if (messageBinary.length >= 32 && messageBinary.length % 8 === 0) {
      let currentMessage = '';
      
      // Convert binary to text
      for (let j = 0; j < messageBinary.length; j += 8) {
        const byte = messageBinary.substr(j, 8);
        const charCode = parseInt(byte, 2);
        if (charCode === 0) break; // Null terminator
        currentMessage += String.fromCharCode(charCode);
      }
      
      // Check for header and delimiter
      if (currentMessage.startsWith('STEG') && currentMessage.includes('###END###')) {
        const message = currentMessage.substring(4); // Remove 'STEG' header
        const endIndex = message.indexOf('###END###');
        return message.substring(0, endIndex);
      }
      
      // Stop if we've read too much without finding the pattern
      if (messageBinary.length > 8000) { // Reasonable limit
        break;
      }
    }
  }
  
  throw new Error('No hidden message found or message is corrupted');
};

// Convert AudioBuffer to WAV format
const audioBufferToWav = (buffer: AudioBuffer): ArrayBuffer => {
  const length = buffer.length;
  const numberOfChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
  const view = new DataView(arrayBuffer);
  
  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length * numberOfChannels * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numberOfChannels * 2, true);
  view.setUint16(32, numberOfChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, length * numberOfChannels * 2, true);
  
  // Convert float samples to 16-bit PCM
  let offset = 44;
  for (let i = 0; i < length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const sample = buffer.getChannelData(channel)[i];
      const intSample = Math.max(-1, Math.min(1, sample));
      view.setInt16(offset, intSample * 0x7FFF, true);
      offset += 2;
    }
  }
  
  return arrayBuffer;
};

export default function AudioSteganography() {
  const [message, setMessage] = useState('');
  const [extractedMessage, setExtractedMessage] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [encodedAudio, setEncodedAudio] = useState<ArrayBuffer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('encode');
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      setEncodedAudio(null);
      setExtractedMessage('');
      toast({
        title: "Audio file loaded",
        description: `${file.name} is ready for steganography.`,
      });
    } else {
      toast({
        title: "Invalid file",
        description: "Please select a valid audio file.",
        variant: "destructive",
      });
    }
  };

  const encodeMessage = async () => {
    if (!audioFile || !message.trim()) {
      toast({
        title: "Missing requirements",
        description: "Please select an audio file and enter a message.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Convert audio file to WAV if it's not already
      let audioBuffer: ArrayBuffer;
      
      if (audioFile.type === 'audio/wav' || audioFile.name.toLowerCase().endsWith('.wav')) {
        audioBuffer = await audioFile.arrayBuffer();
      } else {
        // Convert other audio formats to WAV using Web Audio API
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const originalBuffer = await audioFile.arrayBuffer();
        const decodedData = await audioContext.decodeAudioData(originalBuffer.slice(0));
        audioBuffer = audioBufferToWav(decodedData);
      }
      
      const encodedBuffer = await encodeMessageInAudio(audioBuffer, message.trim());
      setEncodedAudio(encodedBuffer);
      
      toast({
        title: "Message encoded successfully!",
        description: "Your secret message has been hidden in the audio file.",
      });
    } catch (error) {
      console.error('Encoding error:', error);
      toast({
        title: "Encoding failed",
        description: error instanceof Error ? error.message : "Failed to encode message.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const decodeMessage = async () => {
    if (!audioFile) {
      toast({
        title: "No audio file",
        description: "Please select an audio file to decode.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Convert audio file to WAV if it's not already
      let audioBuffer: ArrayBuffer;
      
      if (audioFile.type === 'audio/wav' || audioFile.name.toLowerCase().endsWith('.wav')) {
        audioBuffer = await audioFile.arrayBuffer();
      } else {
        // Convert other audio formats to WAV using Web Audio API
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const originalBuffer = await audioFile.arrayBuffer();
        const decodedData = await audioContext.decodeAudioData(originalBuffer.slice(0));
        audioBuffer = audioBufferToWav(decodedData);
      }
      
      const decoded = await decodeMessageFromAudio(audioBuffer);
      setExtractedMessage(decoded);
      
      toast({
        title: "Message decoded successfully!",
        description: "Hidden message has been extracted from the audio file.",
      });
    } catch (error) {
      console.error('Decoding error:', error);
      toast({
        title: "Decoding failed",
        description: error instanceof Error ? error.message : "No hidden message found.",
        variant: "destructive",
      });
      setExtractedMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadEncodedAudio = () => {
    if (!encodedAudio) return;
    
    const blob = new Blob([encodedAudio], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'encoded_audio.wav';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Your encoded audio file is being downloaded.",
    });
  };

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Message has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy message to clipboard.",
        variant: "destructive",
      });
    }
  };

  const reset = () => {
    setMessage('');
    setExtractedMessage('');
    setAudioFile(null);
    setEncodedAudio(null);
    setIsPlaying(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTabChange = (value: string) => {
    if (activeTab === 'encode' && value === 'decode') {
      // Reset everything when switching from encode to decode
      reset();
    }
    setActiveTab(value);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gradient mb-4 leading-tight pb-2">Text in Audio</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Hide secret text messages inside audio files using LSB (Least Significant Bit) manipulation. The changes are inaudible to human ears.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Audio Upload Section */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileAudio className="h-5 w-5" />
              Audio File
            </CardTitle>
            <CardDescription>
              Upload an audio file to hide or extract messages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
                id="audio-upload"
              />
              <label htmlFor="audio-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Click to upload an audio file
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports WAV, MP3, and other audio formats
                </p>
              </label>
            </div>
            
            {audioFile && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileAudio className="h-4 w-4" />
                    <span className="text-sm font-medium">{audioFile.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={playAudio}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </div>
                
                <audio
                  ref={audioRef}
                  src={audioFile ? URL.createObjectURL(audioFile) : ''}
                  onEnded={() => setIsPlaying(false)}
                  className="w-full"
                  controls
                />
              </div>
            )}
            
            <Button
              onClick={reset}
              variant="outline"
              className="w-full"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </CardContent>
        </Card>

        {/* Steganography Operations */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle>Steganography Operations</CardTitle>
            <CardDescription>
              Encode messages into audio or decode hidden messages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="encode" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Encode
                </TabsTrigger>
                <TabsTrigger value="decode" className="flex items-center gap-2">
                  <Unlock className="h-4 w-4" />
                  Decode
                </TabsTrigger>
              </TabsList>

              <TabsContent value="encode" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="message">Secret Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Enter your secret message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[100px] input-cyber"
                  />
                  <p className="text-xs text-muted-foreground">
                    Message length: {message.length} characters
                  </p>
                </div>

                <Button
                  onClick={encodeMessage}
                  disabled={!audioFile || !message.trim() || isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Volume2 className="h-4 w-4 mr-2 animate-pulse" />
                      Encoding...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Encode Message
                    </>
                  )}
                </Button>

                {encodedAudio && (
                  <Button
                    onClick={downloadEncodedAudio}
                    variant="secondary"
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Encoded Audio
                  </Button>
                )}
              </TabsContent>

              <TabsContent value="decode" className="space-y-4">
                <Button
                  onClick={decodeMessage}
                  disabled={!audioFile || isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Volume2 className="h-4 w-4 mr-2 animate-pulse" />
                      Decoding...
                    </>
                  ) : (
                    <>
                      <Unlock className="h-4 w-4 mr-2" />
                      Decode Message
                    </>
                  )}
                </Button>

                {extractedMessage && (
                  <div className="space-y-2">
                    <Label>Extracted Message</Label>
                    <div className="relative">
                      <Textarea
                        value={extractedMessage}
                        readOnly
                        className="min-h-[100px] input-cyber"
                      />
                      <Button
                        onClick={() => copyToClipboard(extractedMessage)}
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <Card className="card-glow mt-8">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">How Text in Audio Works</CardTitle>
          <CardDescription className="text-base">
            Understanding text-in-audio steganography with LSB manipulation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-secondary-foreground font-bold mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Load Audio</h3>
              <p className="text-sm text-muted-foreground">Upload an audio file that will serve as the carrier</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-secondary-foreground font-bold mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">Convert Message</h3>
              <p className="text-sm text-muted-foreground">Transform your secret text into binary format</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-secondary-foreground font-bold mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Modify LSB</h3>
              <p className="text-sm text-muted-foreground">Replace least significant bits of audio samples</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-secondary-foreground font-bold mb-4">
                4
              </div>
              <h3 className="font-semibold mb-2">Extract Data</h3>
              <p className="text-sm text-muted-foreground">Retrieve hidden message by reading modified bits</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
