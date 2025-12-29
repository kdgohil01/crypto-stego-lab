import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy, RotateCcw, ClipboardPaste, AlertCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

export default function BinaryToText() {
  const [binary, setBinary] = useState("");
  const [text, setText] = useState("");
  const [autoDetect, setAutoDetect] = useState(true);
  const [bitLength, setBitLength] = useState<7 | 8>(8);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const cleanBinaryString = (str: string): string => {
    // Remove all whitespace and non-binary characters
    return str.replace(/[^01]/g, '');
  };

  const binaryToText = () => {
    if (!binary) {
      setText("");
      setError(null);
      return;
    }

    try {
      let binaryStr = cleanBinaryString(binary);
      let result = "";
      let currentBitLength = bitLength;
      
      // Auto-detect bit length if enabled
      if (autoDetect) {
        const length = binaryStr.length;
        if (length % 8 === 0) {
          currentBitLength = 8;
        } else if (length % 7 === 0) {
          currentBitLength = 7;
        } else {
          // Default to 8-bit if not divisible by 7 or 8
          currentBitLength = 8;
        }
      }

      // Process binary string in chunks of currentBitLength
      for (let i = 0; i < binaryStr.length; i += currentBitLength) {
        const chunk = binaryStr.substr(i, currentBitLength);
        if (chunk.length < currentBitLength) {
          // Skip incomplete chunks
          continue;
        }
        
        const charCode = parseInt(chunk, 2);
        
        // Validate character code range
        if (charCode > 0x10FFFF) {
          throw new Error(`Invalid character code: ${charCode}`);
        }
        
        result += String.fromCharCode(charCode);
      }
      
      setText(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid binary input");
      setText("");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: "The text has been copied to your clipboard.",
    });
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setBinary(clipboardText);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to read from clipboard. Please make sure you've granted clipboard permissions.",
        variant: "destructive",
      });
    }
  };

  const reset = () => {
    setBinary("");
    setText("");
    setError(null);
  };

  const formatBinary = (value: string): string => {
    if (!value) return "";
    // Remove all non-binary characters
    const clean = value.replace(/[^01\s]/g, '');
    // Add space every 8 characters for better readability
    return clean.replace(/([01]{8})(?=.)/g, '$1 ').trim();
  };

  useEffect(() => {
    binaryToText();
  }, [binary, bitLength, autoDetect]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="binary-input">Binary Input</Label>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePaste} className="gap-1 h-8">
              <ClipboardPaste className="h-3.5 w-3.5" />
              Paste
            </Button>
            <Button variant="outline" size="sm" onClick={reset} className="gap-1 h-8">
              <RotateCcw className="h-3.5 w-3.5" />
              Clear
            </Button>
          </div>
        </div>
        <Textarea
          id="binary-input"
          placeholder="Enter binary to convert to text (e.g., 01001000 01100101 01101100 01101100 01101111)"
          value={formatBinary(binary)}
          onChange={(e) => setBinary(e.target.value.replace(/\s/g, ''))}
          className="min-h-[100px] font-mono"
          spellCheck={false}
        />
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-2">
          <Switch
            id="auto-detect"
            checked={autoDetect}
            onCheckedChange={(checked) => {
              setAutoDetect(checked);
              if (checked) {
                // Recalculate when enabling auto-detect
                binaryToText();
              }
            }}
          />
          <Label htmlFor="auto-detect">Auto-detect bit length</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="bit-length"
            checked={bitLength === 8}
            onCheckedChange={(checked) => {
              setBitLength(checked ? 8 : 7);
              setAutoDetect(false);
            }}
            disabled={autoDetect}
          />
          <Label htmlFor="bit-length" className={autoDetect ? "text-muted-foreground" : ""}>
            {bitLength}-bit characters
          </Label>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md flex items-start gap-2 text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Conversion Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="text-output">Text Output</Label>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopy} 
            disabled={!text}
            className="gap-1 h-8"
          >
            <Copy className="h-3.5 w-3.5" />
            Copy
          </Button>
        </div>
        <div className="relative">
          <Textarea
            id="text-output"
            value={text}
            readOnly
            className={`min-h-[100px] font-mono ${error ? 'border-red-300 dark:border-red-900' : 'bg-muted/50'}`}
            placeholder="Converted text will appear here..."
          />
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        <p>Binary length: {cleanBinaryString(binary).length} bits | Characters: {text.length}</p>
        <p className="mt-1">
          <span className="font-medium">Note:</span> {autoDetect ? 'Auto-detecting' : `Using ${bitLength}-bit`} character encoding. 
          {autoDetect ? ' Will try to determine if input is 7-bit or 8-bit.' : ''}
        </p>
      </div>
    </div>
  );
}
