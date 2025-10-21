import React, { useEffect, useMemo, useRef } from "react";

interface Props {
  imageFile: File;
  sequence: number[];
  onSequenceChange: (sequence: number[]) => void;
}

// 3x3 overlay on the selected image. Users must click 4 unique cells (1-9) in order.
export const ImageClickSequenceOverlay: React.FC<Props> = ({ imageFile, sequence, onSequenceChange }) => {
  const imgUrl = useMemo(() => URL.createObjectURL(imageFile), [imageFile]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => URL.revokeObjectURL(imgUrl);
  }, [imgUrl]);

  const toggleCell = (cell: number) => {
    const isSelected = sequence.includes(cell);
    if (isSelected) {
      const next = sequence.filter((n) => n !== cell);
      onSequenceChange(next);
    } else if (sequence.length < 4) {
      onSequenceChange([...sequence, cell]);
    }
  };

  const reset = () => onSequenceChange([]);

  return (
    <div className="space-y-2">
      <div ref={containerRef} className="relative w-full max-h-[360px] overflow-hidden rounded-lg border">
        <img
          src={imgUrl}
          alt="Selected image for steganography with 3x3 security overlay"
          className="w-full h-auto object-contain block"
        />
        {/* Overlay grid */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 select-none">
          {Array.from({ length: 9 }, (_, i) => i + 1).map((cell) => {
            const idx = sequence.indexOf(cell);
            const selected = idx !== -1;
            return (
              <button
                key={cell}
                type="button"
                onClick={() => toggleCell(cell)}
                className={[
                  "relative border border-border/50 transition-colors",
                  selected ? "bg-primary/15" : "hover:bg-muted/40",
                ].join(" ")}
                aria-label={`Grid cell ${cell}${selected ? ` selected at position ${idx + 1}` : ""}`}
              >
                {/* Cell number bottom-left */}
                <span className="absolute left-2 bottom-2 text-xs text-muted-foreground">{cell}</span>
                {/* Order badge top-right when selected */}
                {selected && (
                  <span className="absolute right-2 top-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs shadow">
                    {idx + 1}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Click 4 different cells on the image in order (1-9). Click again to remove.
        </span>
        {sequence.length > 0 && (
          <button type="button" onClick={reset} className="underline hover:text-foreground">
            Reset
          </button>
        )}
      </div>
    </div>
  );
};
