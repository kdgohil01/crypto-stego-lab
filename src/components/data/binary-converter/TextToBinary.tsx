import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy, RotateCcw, ClipboardPaste } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

export default function TextToBinary() {
  const [text, setText] = useState("");
  const [binary, setBinary] = useState("");
  const [use7Bit, setUse7Bit] = useState(false);
  const [addSpaces, setAddSpaces] = useState(true);
  const { toast } = useToast();

  const convertToBinary = () => {
    if (!text) {
      setBinary("");
      return;
    }

    let result = "";
    const bits = use7Bit ? 7 : 8;
    
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      let binaryChar = charCode.toString(2);
      
      // Pad with leading zeros
      while (binaryChar.length < bits) {
        binaryChar = "0" + binaryChar;
      }
      
      result += binaryChar;
      
      // Add space between bytes if enabled and not the last character
      if (addSpaces && i < text.length - 1) {
        result += " ";
      }
    }
    
    setBinary(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(binary);
    toast({
      title: "Copied to clipboard!",
      description: "The binary has been copied to your clipboard.",
    });
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to read from clipboard. Please make sure you've granted clipboard permissions.",
        variant: "destructive",
      });
    }
  };

  const reset = () => {
    setText("");
    setBinary("");
  };

  useEffect(() => {
    convertToBinary();
  }, [text, use7Bit, addSpaces]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="text-input">Text Input</Label>
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
          id="text-input"
          placeholder="Enter text to convert to binary..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[100px] font-mono"
          spellCheck={false}
        />
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-2">
          <Switch
            id="bit-mode"
            checked={use7Bit}
            onCheckedChange={setUse7Bit}
          />
          <Label htmlFor="bit-mode">7-bit ASCII</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="add-spaces"
            checked={addSpaces}
            onCheckedChange={setAddSpaces}
          />
          <Label htmlFor="add-spaces">Add spaces between bytes</Label>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="binary-output">Binary Output</Label>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopy} 
            disabled={!binary}
            className="gap-1 h-8"
          >
            <Copy className="h-3.5 w-3.5" />
            Copy
          </Button>
        </div>
        <div className="relative">
          <Textarea
            id="binary-output"
            value={binary}
            readOnly
            className="min-h-[100px] font-mono bg-muted/50"
            placeholder="Binary output will appear here..."
          />
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        <p>Characters: {text.length} | Binary length: {binary.length} bits</p>
        <p className="mt-1">
          <span className="font-medium">Note:</span> {use7Bit ? '7-bit' : '8-bit'} {addSpaces ? 'spaced ' : ''}binary representation. 
          {use7Bit ? 'Supports standard ASCII (0-127).' : 'Supports extended ASCII (0-255).'}
        </p>
      </div>
    </div>
  );
}
