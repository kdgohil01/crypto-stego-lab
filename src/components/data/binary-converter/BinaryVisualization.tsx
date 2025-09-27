import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy, RotateCcw, Binary, ArrowLeft, Eye, EyeOff, Info, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

type DataType = 'text' | 'number' | 'binary' | 'float';
type Endianness = 'big' | 'little';

export default function BinaryVisualization() {
  const [dataType, setDataType] = useState<DataType>('text');
  const [inputValue, setInputValue] = useState("");
  const [endianness, setEndianness] = useState<Endianness>('big');
  const [bitView, setBitView] = useState<number[]>([]);
  interface ByteData {
    bits: string[];
    value: number;
    char: string;
  }
  const [byteView, setByteView] = useState<ByteData[]>([]);
  const [showBits, setShowBits] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const updateVisualization = () => {
    if (!inputValue) {
      setBitView([]);
      setByteView([] as ByteData[]);
      setError(null);
      return;
    }

    try {
      let binaryString = "";
      
      switch (dataType) {
        case 'text':
          // Convert each character to 8-bit binary
          for (let i = 0; i < inputValue.length; i++) {
            const charCode = inputValue.charCodeAt(i);
            if (charCode > 255) {
              throw new Error("Only ASCII characters (0-255) are supported for text input");
            }
            binaryString += charCode.toString(2).padStart(8, '0');
          }
          break;
          
        case 'number':
          const num = parseInt(inputValue, 10);
          if (isNaN(num)) throw new Error("Invalid number");
          binaryString = Math.abs(num).toString(2);
          break;
          
        case 'binary':
          // Clean the binary string (remove spaces and non-binary digits)
          const cleanBinary = inputValue.replace(/[^01]/g, '');
          if (!cleanBinary) throw new Error("Invalid binary input");
          binaryString = cleanBinary;
          break;
          
        case 'float':
          const float = parseFloat(inputValue);
          if (isNaN(float)) throw new Error("Invalid floating point number");
          
          // Create a buffer to hold the float
          const buffer = new ArrayBuffer(4);
          const view = new DataView(buffer);
          view.setFloat32(0, float);
          
          // Convert to binary string
          for (let i = 0; i < 4; i++) {
            binaryString += view.getUint8(i).toString(2).padStart(8, '0');
          }
          break;
      }
      
      // Handle endianness for multi-byte data
      if (dataType === 'float' || (dataType === 'number' && binaryString.length > 8)) {
        if (endianness === 'little') {
          // Reverse the bytes for little endian
          const bytes = binaryString.match(/.{1,8}/g) || [];
          binaryString = bytes.reverse().join('');
        }
      }
      
      // Update bit view
      setBitView(binaryString.split('').map(bit => parseInt(bit, 10)));
      
      // Update byte view
      const bytes = binaryString.match(/.{1,8}/g) || [];
      setByteView(
        bytes.map(byte => ({
          bits: byte.split('').map(bit => parseInt(bit, 10)),
          value: parseInt(byte, 2),
          char: dataType === 'text' ? String.fromCharCode(parseInt(byte, 2)) : ''
        }))
      );
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error processing input");
      setBitView([]);
      setByteView([] as ByteData[]);
    }
  };

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    toast({
      title: "Copied to clipboard!",
      description: "The binary has been copied to your clipboard.",
    });
  };

  const reset = () => {
    setInputValue("");
    setBitView([]);
    setByteView([]);
    setError(null);
  };

  useEffect(() => {
    updateVisualization();
  }, [inputValue, dataType, endianness]);

  const getPlaceholder = (): string => {
    switch (dataType) {
      case 'text': return "Enter text (e.g., Hello)";
      case 'number': return "Enter a number (e.g., 42)";
      case 'binary': return "Enter binary (e.g., 01001000 01100101 01101100 01101100 01101111)";
      case 'float': return "Enter a floating point number (e.g., 3.14)";
      default: return "Enter input";
    }
  };

  const renderBitGrid = () => {
    if (!bitView.length) return null;
    
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-1">
          {bitView.map((bit, index) => (
            <div 
              key={index} 
              className={`w-8 h-8 flex items-center justify-center border rounded font-mono text-sm ${bit ? 'bg-blue-500 text-white' : 'bg-muted'}`}
            >
              {bit}
            </div>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
          {bitView.map((_, index) => (
            <div key={index} className="w-8 text-center">
              {index}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderByteGrid = () => {
    if (!byteView.length) return null;
    
    return (
      <div className="space-y-6">
        {byteView.map((byte, byteIndex) => (
          <div key={byteIndex} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Byte {byteIndex + 1}
                {dataType === 'text' && (
                  <span className="ml-2 text-muted-foreground">
                    (Char: {byte.char.charCodeAt(0) < 32 ? '␣' : byte.char})
                  </span>
                )}
              </span>
              <span className="text-sm font-mono">
                {showBits ? (
                  <span className="text-muted-foreground">
                    {byte.bits.join('')} = {byte.value} (0x{byte.value.toString(16).toUpperCase()})
                  </span>
                ) : (
                  <span className="text-muted-foreground">
                    {byte.value} (0x{byte.value.toString(16).toUpperCase()})
                  </span>
                )}
              </span>
            </div>
            
            {showBits && (
              <div className="flex flex-wrap gap-1">
                {byte.bits.map((bit, bitIndex) => (
                  <div 
                    key={`${byteIndex}-${bitIndex}`} 
                    className={`w-8 h-8 flex items-center justify-center border rounded font-mono text-sm ${
                      bit ? 'bg-blue-500 text-white' : 'bg-muted'
                    }`}
                  >
                    {bit}
                  </div>
                ))}
                
                <div className="w-8 h-8 flex items-center justify-center">
                  <span className="text-muted-foreground">=</span>
                </div>
                
                <div className="w-16 h-8 flex items-center justify-center border rounded bg-muted font-mono text-sm">
                  {byte.value}
                </div>
                
                <div className="w-8 h-8 flex items-center justify-center">
                  <span className="text-muted-foreground">=</span>
                </div>
                
                <div className="w-12 h-8 flex items-center justify-center border rounded bg-muted font-mono text-sm">
                  0x{byte.value.toString(16).toUpperCase()}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="data-type">Data Type</Label>
            <Select 
              value={dataType} 
              onValueChange={(value) => {
                setDataType(value as DataType);
                setInputValue("");
              }}
            >
              <SelectTrigger id="data-type">
                <SelectValue placeholder="Select data type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text (ASCII/Unicode)</SelectItem>
                <SelectItem value="number">Integer Number</SelectItem>
                <SelectItem value="float">Floating Point</SelectItem>
                <SelectItem value="binary">Raw Binary</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {(dataType === 'number' || dataType === 'float') && (
            <div className="space-y-2">
              <Label htmlFor="endianness">Endianness</Label>
              <Select 
                value={endianness} 
                onValueChange={(value) => setEndianness(value as Endianness)}
              >
                <SelectTrigger id="endianness">
                  <SelectValue placeholder="Select endianness" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="big">Big Endian (Most Significant Byte First)</SelectItem>
                  <SelectItem value="little">Little Endian (Least Significant Byte First)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="input-value">Input</Label>
            <Button variant="outline" size="sm" onClick={reset} className="gap-1 h-8">
              <RotateCcw className="h-3.5 w-3.5" />
              Clear
            </Button>
          </div>
          <Input
            id="input-value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={getPlaceholder()}
          />
        </div>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md flex items-start gap-2 text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Input Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}
      </div>
      
      {inputValue && !error && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Binary Visualization</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowBits(!showBits)}
              className="gap-1 h-8"
            >
              {showBits ? (
                <>
                  <EyeOff className="h-3.5 w-3.5" />
                  Hide Bits
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5" />
                  Show Bits
                </>
              )}
            </Button>
          </div>
          
          <Tabs defaultValue="bit-view" className="w-full">
            <TabsList>
              <TabsTrigger value="bit-view">Bit View</TabsTrigger>
              <TabsTrigger value="byte-view">Byte View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bit-view" className="pt-4">
              {renderBitGrid()}
            </TabsContent>
            
            <TabsContent value="byte-view" className="pt-4">
              {renderByteGrid()}
            </TabsContent>
          </Tabs>
          
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label>Raw Binary</Label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleCopy(bitView.join(''))}
                className="gap-1 h-8"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </Button>
            </div>
            <div className="mt-2 p-3 bg-muted/50 rounded-md font-mono text-sm overflow-x-auto">
              {bitView.join('')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
