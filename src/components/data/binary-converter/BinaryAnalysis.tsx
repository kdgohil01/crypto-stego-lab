import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy, RotateCcw, AlertCircle, BarChart2, Binary, Hash, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

type AnalysisResult = {
  totalBits: number;
  setBits: number;
  unsetBits: number;
  setBitPercentage: number;
  bitPatterns: Record<string, number>;
  byteFrequency: Record<string, number>;
  mostCommonBitPattern: string;
  leastCommonBitPattern: string;
  isPowerOfTwo: boolean;
  parity: 'even' | 'odd';
  hammingWeight: number;
  byteCount: number;
};

export default function BinaryAnalysis() {
  const [binaryInput, setBinaryInput] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const analyzeBinary = () => {
    if (!binaryInput.trim()) {
      setError("Please enter a binary string");
      setAnalysis(null);
      return;
    }

    try {
      // Clean the input (remove all non-binary characters)
      const cleanBinary = binaryInput.replace(/[^01]/g, '');
      
      if (!cleanBinary) {
        throw new Error("No valid binary digits found");
      }

      const totalBits = cleanBinary.length;
      const setBits = (cleanBinary.match(/1/g) || []).length;
      const unsetBits = totalBits - setBits;
      const setBitPercentage = (setBits / totalBits) * 100;
      
      // Calculate bit patterns (frequency of each bit pattern)
      const bitPatterns: Record<string, number> = {};
      const byteFrequency: Record<string, number> = {};
      
      // Analyze bit patterns (1-4 bit patterns)
      for (let patternLength = 1; patternLength <= 4; patternLength++) {
        for (let i = 0; i <= cleanBinary.length - patternLength; i++) {
          const pattern = cleanBinary.substr(i, patternLength);
          bitPatterns[pattern] = (bitPatterns[pattern] || 0) + 1;
        }
      }
      
      // Analyze byte frequency (8-bit chunks)
      const bytes = cleanBinary.match(/.{1,8}/g) || [];
      bytes.forEach(byte => {
        byteFrequency[byte] = (byteFrequency[byte] || 0) + 1;
      });
      
      // Find most and least common patterns
      const commonPatterns = Object.entries(bitPatterns)
        .sort((a, b) => b[1] - a[1]);
        
      const mostCommonPattern = commonPatterns[0]?.[0] || 'N/A';
      const leastCommonPattern = commonPatterns[commonPatterns.length - 1]?.[0] || 'N/A';
      
      // Check if the number is a power of two
      const decimalValue = parseInt(cleanBinary, 2);
      const isPowerOfTwo = decimalValue !== 0 && (decimalValue & (decimalValue - 1)) === 0;
      
      // Calculate parity
      const parity = setBits % 2 === 0 ? 'even' : 'odd';
      
      setAnalysis({
        totalBits,
        setBits,
        unsetBits,
        setBitPercentage,
        bitPatterns,
        byteFrequency,
        mostCommonBitPattern: mostCommonPattern,
        leastCommonBitPattern: leastCommonPattern,
        isPowerOfTwo,
        parity,
        hammingWeight: setBits,
        byteCount: bytes.length
      });
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error analyzing binary data");
      setAnalysis(null);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: "The binary has been copied to your clipboard.",
    });
  };

  const reset = () => {
    setBinaryInput("");
    setAnalysis(null);
    setError(null);
  };

  useEffect(() => {
    if (binaryInput) {
      analyzeBinary();
    } else {
      setAnalysis(null);
      setError(null);
    }
  }, [binaryInput]);

  const renderPatternAnalysis = () => {
    if (!analysis) return null;
    
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BarChart2 className="h-4 w-4" />
                Bit Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Bits</span>
                  <span className="font-mono">{analysis.totalBits}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Set Bits (1s)</span>
                  <span className="font-mono">{analysis.setBits}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Unset Bits (0s)</span>
                  <span className="font-mono">{analysis.unsetBits}</span>
                </div>
                <div className="space-y-1 pt-2">
                  <div className="flex justify-between text-xs">
                    <span>Bit Density (1s)</span>
                    <span>{analysis.setBitPercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={analysis.setBitPercentage} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Binary className="h-4 w-4" />
                Bit Patterns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Most Common</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono bg-muted px-2 py-0.5 rounded">
                      {analysis.mostCommonBitPattern}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Least Common</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono bg-muted px-2 py-0.5 rounded">
                      {analysis.leastCommonBitPattern}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Hamming Weight</span>
                  <span className="font-mono">{analysis.hammingWeight}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Parity</span>
                  <span className="font-mono">{analysis.parity}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Byte Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Bytes</span>
                  <span className="font-mono">{analysis.byteCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Complete Bytes</span>
                  <span className="font-mono">
                    {Math.floor(analysis.totalBits / 8)} ({((Math.floor(analysis.totalBits / 8) / analysis.byteCount) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Unique Bytes</span>
                  <span className="font-mono">{Object.keys(analysis.byteFrequency).length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Power of Two</span>
                  <span className="font-mono">
                    {analysis.isPowerOfTwo ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {analysis.byteCount > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Byte Frequency</CardTitle>
              <CardDescription>
                Distribution of byte values in the binary data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="grid grid-cols-8 sm:grid-cols-16 gap-1">
                  {Array.from({ length: 256 }).map((_, i) => {
                    const byte = i.toString(2).padStart(8, '0');
                    const count = analysis.byteFrequency[byte] || 0;
                    const percentage = (count / analysis.byteCount) * 100;
                    
                    return (
                      <div key={i} className="relative group" title={`${byte} (0x${i.toString(16).toUpperCase().padStart(2, '0')}) - ${count} occurrence${count !== 1 ? 's' : ''}`}>
                        <div 
                          className="h-16 bg-blue-100 dark:bg-blue-900/50 rounded-sm flex items-end justify-center text-[8px] text-center p-0.5 overflow-hidden"
                          style={{ height: `${Math.max(5, percentage * 1.5)}%` }}
                        >
                          {count > 0 && (
                            <span className="text-[8px] font-mono opacity-70">
                              {count}
                            </span>
                          )}
                        </div>
                        <div className="text-center text-[8px] mt-1 opacity-70">
                          {i.toString(16).toUpperCase().padStart(2, '0')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Info className="h-3 w-3" />
                <span>Hover over bytes to see their binary representation and frequency</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="binary-input">Binary Input</Label>
            <Button variant="outline" size="sm" onClick={reset} className="gap-1 h-8">
              <RotateCcw className="h-3.5 w-3.5" />
              Clear
            </Button>
          </div>
          <Input
            id="binary-input"
            value={binaryInput}
            onChange={(e) => setBinaryInput(e.target.value.replace(/[^01]/g, ''))}
            placeholder="Enter binary data (e.g., 0100100001100101011011000110110001101111)"
            className="mt-1 font-mono"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Only 0s and 1s are accepted. All other characters will be filtered out.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md flex items-start gap-2 text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Analysis Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}
        
        {analysis && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Analysis Results</h3>
            {renderPatternAnalysis()}
            
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium mb-3">Raw Binary</h4>
              <div className="relative">
                <div className="p-3 bg-muted/50 rounded-md font-mono text-sm overflow-x-auto">
                  {binaryInput.match(/.{1,8}/g)?.join(' ') || binaryInput}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                  onClick={() => handleCopy(binaryInput)}
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span className="sr-only">Copy</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {binaryInput.length} bits
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
