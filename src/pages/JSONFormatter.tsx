import { Construction, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function JSONFormatter() {
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

      <Card className="card-glow border-orange-200/20">
        <CardHeader className="text-center pb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900/20 mb-6">
            <Construction className="h-10 w-10 text-orange-600" />
          </div>
          <CardTitle className="text-3xl mb-4">JSON Formatter</CardTitle>
          <CardDescription className="text-lg">
            This feature is currently under development
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="max-w-2xl mx-auto">
            <p className="text-muted-foreground mb-6">
              We're working hard to bring you a powerful JSON formatting and validation tool. 
              This will include features like:
            </p>
            <div className="grid gap-4 md:grid-cols-2 text-left">
              <div className="space-y-2">
                <h4 className="font-semibold">✨ Format & Beautify</h4>
                <p className="text-sm text-muted-foreground">Pretty-print JSON with proper indentation</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">🔍 Validate JSON</h4>
                <p className="text-sm text-muted-foreground">Check for syntax errors and validation</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">🗜️ Minify JSON</h4>
                <p className="text-sm text-muted-foreground">Compress JSON by removing whitespace</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">🌳 Tree View</h4>
                <p className="text-sm text-muted-foreground">Visualize JSON structure in tree format</p>
              </div>
            </div>
          </div>
          <div className="pt-6">
            <p className="text-sm text-muted-foreground">
              Stay tuned for updates! In the meantime, explore our other data processing tools.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
