import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ClickSequenceGridProps {
  sequence: number[];
  onSequenceChange: (sequence: number[]) => void;
}

export const ClickSequenceGrid = ({ sequence, onSequenceChange }: ClickSequenceGridProps) => {
  const [clickOrder, setClickOrder] = useState<{ [key: number]: number }>({});

  const handleClick = (number: number) => {
    if (sequence.includes(number)) {
      // Remove from sequence
      const newSequence = sequence.filter(n => n !== number);
      const newClickOrder = { ...clickOrder };
      delete newClickOrder[number];
      
      // Reorder the remaining numbers
      const remainingNumbers = Object.entries(newClickOrder)
        .sort(([, a], [, b]) => a - b)
        .map(([num]) => parseInt(num));
      
      const updatedClickOrder: { [key: number]: number } = {};
      remainingNumbers.forEach((num, index) => {
        updatedClickOrder[num] = index + 1;
      });
      
      setClickOrder(updatedClickOrder);
      onSequenceChange(remainingNumbers);
    } else if (sequence.length < 4) {
      // Add to sequence
      const newSequence = [...sequence, number];
      const newClickOrder = { ...clickOrder, [number]: sequence.length + 1 };
      
      setClickOrder(newClickOrder);
      onSequenceChange(newSequence);
    }
  };

  const resetSequence = () => {
    setClickOrder({});
    onSequenceChange([]);
  };

  const grid = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2 max-w-48">
        {grid.map((number) => {
          const isSelected = sequence.includes(number);
          const clickIndex = clickOrder[number];
          
          return (
            <Button
              key={number}
              variant={isSelected ? "default" : "outline"}
              size="lg"
              onClick={() => handleClick(number)}
              className={cn(
                "aspect-square relative font-mono text-lg font-bold transition-smooth",
                isSelected 
                  ? "gradient-cyber text-white animate-pulse-cyber" 
                  : "border-primary/30 hover:border-primary hover:bg-primary/10"
              )}
            >
              {number}
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground rounded-full text-xs flex items-center justify-center font-bold">
                  {clickIndex}
                </div>
              )}
            </Button>
          );
        })}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Sequence: {sequence.length > 0 ? sequence.join(' → ') : 'None selected'}
        </div>
        {sequence.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetSequence}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  );
};