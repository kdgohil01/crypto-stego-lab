import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy, RotateCcw, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

type NumberSystem = 'binary' | 'decimal' | 'hex' | 'octal';

export default function NumberSystemConverter() {
  const [activeTab, setActiveTab] = useState<NumberSystem>('binary');
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState({
    binary: "",
    decimal: "",
    hex: "",
    octal: "",
  });
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const validateInput = (value: string, type: NumberSystem): boolean => {
    if (!value) return true;
    
    const patterns = {
      binary: /^[01]+(\.\d+)?$/,
      decimal: /^\d+(\.\d+)?$/,
      hex: /^[0-9A-Fa-f]+(\.?[0-9A-Fa-f]*)?$/,
      octal: /^[0-7]+(\.\d+)?$/,
    };

    return patterns[type].test(value);
  };

  const convertNumber = (value: string, from: NumberSystem) => {
    if (!value || !validateInput(value, from)) {
      setError(`Invalid ${from} number`);
      return;
    }
    
    try {
      let decimal: number;
      
      // Convert input to decimal first
      switch (from) {
        case 'binary':
          if (value.includes('.')) {
            const [int, frac] = value.split('.');
            const intPart = parseInt(int, 2);
            const fracPart = parseInt(frac, 2) / Math.pow(2, frac.length);
            decimal = intPart + (intPart >= 0 ? fracPart : -fracPart);
          } else {
            decimal = parseInt(value, 2);
          }
          break;
          
        case 'decimal':
          decimal = parseFloat(value);
          break;
          
        case 'hex':
          if (value.includes('.')) {
            const [int, frac] = value.split('.');
            const intPart = parseInt(int, 16);
            const fracPart = parseInt(frac, 16) / Math.pow(16, frac.length);
            decimal = intPart + (intPart >= 0 ? fracPart : -fracPart);
          } else {
            decimal = parseInt(value, 16);
          }
          break;
          
        case 'octal':
          if (value.includes('.')) {
            const [int, frac] = value.split('.');
            const intPart = parseInt(int, 8);
            const fracPart = parseInt(frac, 8) / Math.pow(8, frac.length);
            decimal = intPart + (intPart >= 0 ? fracPart : -fracPart);
          } else {
            decimal = parseInt(value, 8);
          }
          break;
      }
      
      if (isNaN(decimal)) {
        throw new Error("Invalid number");
      }
      
      // Convert decimal to all other formats
      setResults({
        binary: decimal.toString(2),
        decimal: decimal.toString(10),
        hex: decimal.toString(16).toUpperCase(),
        octal: decimal.toString(8),
      });
      
      setError(null);
    } catch (err) {
      setError("Error converting number. Please check your input.");
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (value === "") {
      setResults({ binary: "", decimal: "", hex: "", octal: "" });
      setError(null);
      return;
    }
    convertNumber(value, activeTab);
  };

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    toast({
      title: "Copied to clipboard!",
      description: `The ${value} has been copied to your clipboard.`,
    });
  };

  const reset = () => {
    setInputValue("");
    setResults({ binary: "", decimal: "", hex: "", octal: "" });
    setError(null);
  };

  const getPlaceholder = (type: NumberSystem): string => {
    const placeholders = {
      binary: "e.g., 1010.101",
      decimal: "e.g., 10.625",
      hex: "e.g., A.A",
      octal: "e.g., 12.5",
    };
    return placeholders[type];
  };

  const getInputLabel = (): string => {
    const labels = {
      binary: "Binary (Base-2)",
      decimal: "Decimal (Base-10)",
      hex: "Hexadecimal (Base-16)",
      octal: "Octal (Base-8)",
    };
    return labels[activeTab];
  };

  return (
    <div className="space-y-6">
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => {
          setActiveTab(value as NumberSystem);
          setInputValue("");
          setResults({ binary: "", decimal: "", hex: "", octal: "" });
          setError(null);
        }}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="binary">Binary</TabsTrigger>
          <TabsTrigger value="decimal">Decimal</TabsTrigger>
          <TabsTrigger value="hex">Hex</TabsTrigger>
          <TabsTrigger value="octal">Octal</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="number-input">{getInputLabel()}</Label>
            <Button variant="outline" size="sm" onClick={reset} className="gap-1 h-8">
              <RotateCcw className="h-3.5 w-3.5" />
              Clear
            </Button>
          </div>
          <div className="relative">
            <Input
              id="number-input"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={getPlaceholder(activeTab)}
              className={`font-mono ${error ? 'border-red-500' : ''}`}
            />
          </div>
          {error && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {error}
            </p>
          )}
        </div>

        {inputValue && !error && (
          <div className="space-y-4 mt-6">
            <h3 className="font-medium">Converted Results:</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(results).map(([key, value]) => {
                if (key === activeTab) return null;
                
                const labels = {
                  binary: "Binary",
                  decimal: "Decimal",
                  hex: "Hexadecimal",
                  octal: "Octal",
                };
                
                return (
                  <div key={key} className="border rounded-lg p-4 bg-muted/20">
                    <div className="flex justify-between items-center mb-2">
                      <Label className="font-medium">{labels[key as keyof typeof labels]}</Label>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleCopy(value)}
                        className="h-7 w-7 p-0"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        <span className="sr-only">Copy</span>
                      </Button>
                    </div>
                    <div className="bg-background p-2 rounded font-mono break-all">
                      {value || "-"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
