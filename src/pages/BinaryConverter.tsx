import { Construction, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function BinaryConverter() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <Button asChild variant="ghost" className="mb-4">
          <Link to="/data-processing" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Data Processing
          </Link>
        </Button>
      </div>

      <Card className="card-glow border-purple-200/20">
        <CardHeader className="text-center pb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900/20 mb-6">
            <Construction className="h-10 w-10 text-purple-600" />
          </div>
          <CardTitle className="text-3xl mb-4">Binary Converter</CardTitle>
          <CardDescription className="text-lg">
            This feature is currently under development
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="max-w-2xl mx-auto">
            <p className="text-muted-foreground mb-6">
              We're creating a comprehensive binary conversion tool with support for multiple number systems. 
              Planned features include:
            </p>
            <div className="grid gap-4 md:grid-cols-2 text-left">
              <div className="space-y-2">
                <h4 className="font-semibold">🔢 Multiple Bases</h4>
                <p className="text-sm text-muted-foreground">Binary, decimal, hexadecimal, and octal</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">📝 Text Conversion</h4>
                <p className="text-sm text-muted-foreground">Convert text to binary and vice versa</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">⚡ Real-time Updates</h4>
                <p className="text-sm text-muted-foreground">Instant conversion as you type</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">🧮 Math Operations</h4>
                <p className="text-sm text-muted-foreground">Binary arithmetic and bitwise operations</p>
              </div>
            </div>
          </div>
          <div className="pt-6">
            <p className="text-sm text-muted-foreground">
              Binary conversion tools are on the way! Meanwhile, check out our other data processing features.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
