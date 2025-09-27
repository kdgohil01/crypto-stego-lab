import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
        <CardContent className="p-6">
          <BinaryConverterComponent/>
        </CardContent>
      </Card>
    </div>
  );
}
