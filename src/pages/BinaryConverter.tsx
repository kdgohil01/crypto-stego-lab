import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { BinaryConverter as BinaryConverterComponent } from "@/components/data/binary-converter";

export default function BinaryConverter() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-6">
        <Button asChild variant="ghost" className="mb-4">
          <Link to="/data-processing" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Data Processing
          </Link>
        </Button>
      </div>

      <Card className="card-glow border-blue-200/20">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-3xl mb-4">Binary Converter</CardTitle>
          <CardDescription className="text-lg">
            Convert between binary, text, and other number systems
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <BinaryConverterComponent/>
        </CardContent>
      </Card>
    </div>
  );
}
