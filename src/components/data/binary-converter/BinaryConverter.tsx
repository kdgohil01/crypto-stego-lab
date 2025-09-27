import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import TextToBinary from "./TextToBinary";
import BinaryToText from "./BinaryToText";
import BinaryVisualization from "./BinaryVisualization";
import BinaryAnalysis from "./BinaryAnalysis";

export default function BinaryConverter() {
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    // Increment the key to force remount of child components
    setResetKey(prevKey => prevKey + 1);
  };
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mb-6 mx-auto">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="40" 
            height="40" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="text-white"
          >
            <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
            <path d="M8 8h8v8H8z" />
            <path d="M8 2v4" />
            <path d="M8 18v4" />
            <path d="M2 8h4" />
            <path d="M2 16h4" />
            <path d="M16 2v4" />
            <path d="M16 18v4" />
            <path d="M18 8h4" />
            <path d="M18 16h4" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gradient mb-2">Binary Converter</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Convert between binary, text, and number systems with advanced binary operations and visualization.
        </p>
      </div>

      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Binary Converter Tool
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Info className="h-4 w-4" />
                    Learn
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>About Binary Conversion</DialogTitle>
                    <DialogDescription>
                      Understanding binary representation and conversion methods
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-blue-500">Binary Basics</h3>
                      <p className="text-sm text-muted-foreground">
                        Binary is a base-2 number system that uses only two digits: 0 and 1. Each digit in a binary number is called a bit.
                        Computers use binary to represent and process all data.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-green-500">Number Systems</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                        <div className="bg-muted p-3 rounded">
                          <h4 className="font-medium">Binary (Base-2)</h4>
                          <p className="text-xs mt-1">Uses digits 0-1</p>
                          <p className="text-xs">Example: 1010<sub>2</sub></p>
                        </div>
                        <div className="bg-muted p-3 rounded">
                          <h4 className="font-medium">Decimal (Base-10)</h4>
                          <p className="text-xs mt-1">Uses digits 0-9</p>
                          <p className="text-xs">Example: 10<sub>10</sub></p>
                        </div>
                        <div className="bg-muted p-3 rounded">
                          <h4 className="font-medium">Hexadecimal (Base-16)</h4>
                          <p className="text-xs mt-1">Uses digits 0-9 and A-F</p>
                          <p className="text-xs">Example: A<sub>16</sub></p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-purple-500">Common Data Types</h3>
                      <div className="overflow-x-auto mt-2">
                        <table className="min-w-full text-xs border">
                          <thead>
                            <tr className="bg-muted">
                              <th className="p-2 border text-left">Type</th>
                              <th className="p-2 border text-left">Size (bits)</th>
                              <th className="p-2 border text-left">Range</th>
                              <th className="p-2 border text-left">Example</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="p-2 border">Byte</td>
                              <td className="p-2 border">8</td>
                              <td className="p-2 border">0 to 255</td>
                              <td className="p-2 border font-mono">01100001</td>
                            </tr>
                            <tr className="bg-muted/50">
                              <td className="p-2 border">16-bit Integer</td>
                              <td className="p-2 border">16</td>
                              <td className="p-2 border">-32,768 to 32,767</td>
                              <td className="p-2 border font-mono">00000000 01100001</td>
                            </tr>
                            <tr>
                              <td className="p-2 border">32-bit Float</td>
                              <td className="p-2 border">32</td>
                              <td className="p-2 border">±1.18×10<sup>-38</sup> to ±3.4×10<sup>38</sup></td>
                              <td className="p-2 border font-mono">0 10000100 10010000000000000000000</td>
                            </tr>
                            <tr className="bg-muted/50">
                              <td className="p-2 border">ASCII Character</td>
                              <td className="p-2 border">7-8</td>
                              <td className="p-2 border">0-127 (7-bit)</td>
                              <td className="p-2 border font-mono">01000001 (A)</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                      <h4 className="font-medium text-blue-700 dark:text-blue-300 flex items-center">
                        <Info className="h-4 w-4 mr-2" />
                        Quick Reference
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2 text-xs">
                        <div>
                          <h5 className="font-medium">Binary to Hex</h5>
                          <p className="text-muted-foreground">0000 = 0</p>
                          <p className="text-muted-foreground">0001 = 1</p>
                          <p className="text-muted-foreground">0010 = 2</p>
                          <p className="text-muted-foreground">0011 = 3</p>
                        </div>
                        <div>
                          <h5 className="font-medium">Hex to Binary</h5>
                          <p className="text-muted-foreground">4 = 0100</p>
                          <p className="text-muted-foreground">5 = 0101</p>
                          <p className="text-muted-foreground">6 = 0110</p>
                          <p className="text-muted-foreground">7 = 0111</p>
                        </div>
                        <div>
                          <h5 className="font-medium">Common ASCII</h5>
                          <p className="text-muted-foreground">A = 65 (01000001)</p>
                          <p className="text-muted-foreground">a = 97 (01100001)</p>
                          <p className="text-muted-foreground">0 = 48 (00110000)</p>
                          <p className="text-muted-foreground">Space = 32 (00100000)</p>
                        </div>
                        <div>
                          <h5 className="font-medium">Bitwise Ops</h5>
                          <p className="text-muted-foreground">AND: 1010 & 1100 = 1000</p>
                          <p className="text-muted-foreground">OR: 1010 | 1100 = 1110</p>
                          <p className="text-muted-foreground">XOR: 1010 ^ 1100 = 0110</p>
                          <p className="text-muted-foreground">NOT: ~1010 = 0101</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardTitle>
          <CardDescription>
            Convert between different number systems and perform binary operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="text-binary" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-2 lg:grid-cols-4 mb-6">
              <TabsTrigger value="text-binary">Text → Binary</TabsTrigger>
              <TabsTrigger value="binary-text">Binary → Text</TabsTrigger>
              <TabsTrigger value="visualization">Visualization</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="text-binary">
              <TextToBinary key={`text-binary-${resetKey}`} />
            </TabsContent>
            
            <TabsContent value="binary-text">
              <BinaryToText key={`binary-text-${resetKey}`} />
            </TabsContent>
            
            <TabsContent value="visualization">
              <BinaryVisualization key={`visualization-${resetKey}`} />
            </TabsContent>
            
            <TabsContent value="analysis">
              <BinaryAnalysis key={`analysis-${resetKey}`} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
