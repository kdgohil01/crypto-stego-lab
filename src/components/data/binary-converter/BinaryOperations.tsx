import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy, RotateCcw, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

type BitwiseOperation = 'AND' | 'OR' | 'XOR' | 'NOT' | 'LEFT_SHIFT' | 'RIGHT_SHIFT' | 'ADD' | 'SUBTRACT' | 'MULTIPLY';

export default function BinaryOperations() {
  const [operation, setOperation] = useState<BitwiseOperation>('AND');
  const [binary1, setBinary1] = useState("");
  const [binary2, setBinary2] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const validateBinary = (value: string): boolean => {
    if (!value) return false;
    return /^[01]+$/.test(value);
  };

  const performOperation = () => {
    if (!binary1 || (operation !== 'NOT' && !binary2)) {
      setError("Please enter valid binary numbers");
      return;
    }

    try {
      let res: string;
      const num1 = parseInt(binary1, 2);
      const num2 = binary2 ? parseInt(binary2, 2) : 0;
      
      switch (operation) {
        case 'AND':
          res = (num1 & num2).toString(2);
          break;
        case 'OR':
          res = (num1 | num2).toString(2);
          break;
        case 'XOR':
          res = (num1 ^ num2).toString(2);
          break;
        case 'NOT':
          // For NOT, we need to handle the bit length properly
          const bitLength = binary1.length;
          const mask = (1 << bitLength) - 1;
          res = ((~num1) & mask).toString(2).padStart(bitLength, '0');
          break;
        case 'LEFT_SHIFT':
          res = (num1 << num2).toString(2);
          break;
        case 'RIGHT_SHIFT':
          res = (num1 >> num2).toString(2);
          break;
        case 'ADD':
          res = (num1 + num2).toString(2);
          break;
        case 'SUBTRACT':
          res = (num1 - num2).toString(2);
          break;
        case 'MULTIPLY':
          res = (num1 * num2).toString(2);
          break;
        default:
          throw new Error("Unsupported operation");
      }
      
      setResult(res);
      setError(null);
    } catch (err) {
      setError("Error performing operation. Please check your input.");
      setResult("");
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    toast({
      title: "Copied to clipboard!",
      description: "The result has been copied to your clipboard.",
    });
  };

  const reset = () => {
    setBinary1("");
    setBinary2("");
    setResult("");
    setError(null);
  };

  useEffect(() => {
    if (binary1 && (operation === 'NOT' || binary2)) {
      performOperation();
    } else {
      setResult("");
    }
  }, [binary1, binary2, operation]);

  const getOperationSymbol = (op: BitwiseOperation): string => {
    const symbols = {
      'AND': '&',
      'OR': '|',
      'XOR': '^',
      'NOT': '~',
      'LEFT_SHIFT': '<<',
      'RIGHT_SHIFT': '>>',
      'ADD': '+',
      'SUBTRACT': '-',
      'MULTIPLY': '×'
    };
    return symbols[op];
  };

  const showSecondOperand = operation !== 'NOT';

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="space-y-2 flex-1">
            <Label htmlFor="operation">Operation</Label>
            <Select 
              value={operation} 
              onValueChange={(value) => setOperation(value as BitwiseOperation)}
            >
              <SelectTrigger id="operation">
                <SelectValue placeholder="Select operation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AND">AND (&)</SelectItem>
                <SelectItem value="OR">OR (|)</SelectItem>
                <SelectItem value="XOR">XOR (^)</SelectItem>
                <SelectItem value="NOT">NOT (~)</SelectItem>
                <SelectItem value="LEFT_SHIFT">Left Shift ({'<<'})</SelectItem>
                <SelectItem value="RIGHT_SHIFT">Right Shift ({'>>'})</SelectItem>
                <SelectItem value="ADD">Add (+)</SelectItem>
                <SelectItem value="SUBTRACT">Subtract (-)</SelectItem>
                <SelectItem value="MULTIPLY">Multiply (×)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={reset} className="gap-1 h-10">
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="binary1">First Binary Number</Label>
            <Input
              id="binary1"
              value={binary1}
              onChange={(e) => {
                const value = e.target.value.replace(/[^01]/g, '');
                setBinary1(value);
              }}
              placeholder="e.g., 1010"
              className="font-mono"
            />
          </div>

          {showSecondOperand && (
            <div className="space-y-2">
              <Label htmlFor="binary2">Second Binary Number</Label>
              <Input
                id="binary2"
                value={binary2}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^01]/g, '');
                  setBinary2(value);
                }}
                placeholder="e.g., 1100"
                className="font-mono"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-center py-2">
          <div className="bg-muted px-4 py-2 rounded-md font-mono text-lg">
            {operation === 'NOT' ? (
              <span>~{binary1 || '?'}</span>
            ) : (
              <span>{binary1 || '?'} {getOperationSymbol(operation)} {binary2 || '?'}</span>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md flex items-start gap-2 text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Operation Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Result</Label>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopy} 
              disabled={!result}
              className="gap-1 h-8"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy
            </Button>
          </div>
          <div className="bg-muted/50 p-3 rounded-md font-mono break-all min-h-[42px]">
            {result || (binary1 ? "Enter valid input to see result" : "")}
          </div>
        </div>
      </div>

      <div className="text-xs text-muted-foreground pt-4 border-t">
        <p className="font-medium mb-1">Operation Descriptions:</p>
        <ul className="space-y-1">
          <li><span className="font-mono font-bold">AND (&)</span>: Returns 1 if both bits are 1</li>
          <li><span className="font-mono font-bold">OR (|)</span>: Returns 1 if at least one bit is 1</li>
          <li><span className="font-mono font-bold">XOR (^)</span>: Returns 1 if bits are different</li>
          <li><span className="font-mono font-bold">NOT (~)</span>: Inverts all bits</li>
          <li><span className="font-mono font-bold">Left Shift ({'<<'})</span>: Shifts bits to the left, filling with 0</li>
          <li><span className="font-mono font-bold">Right Shift ({'>>'})</span>: Shifts bits to the right, preserving sign</li>
        </ul>
      </div>
    </div>
  );
}
