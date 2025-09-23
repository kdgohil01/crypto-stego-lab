import { Construction, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function QRGenerator() {
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

      <Card className="card-glow border-green-200/20">
        <CardHeader className="text-center pb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 mb-6">
            <Construction className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-3xl mb-4">QR Code Generator</CardTitle>
          <CardDescription className="text-lg">
            This feature is currently under development
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="max-w-2xl mx-auto">
            <p className="text-muted-foreground mb-6">
              We're developing a versatile QR code generation tool with advanced customization options. 
              Features in development:
            </p>
            <div className="grid gap-4 md:grid-cols-2 text-left">
              <div className="space-y-2">
                <h4 className="font-semibold">📱 Multiple Data Types</h4>
                <p className="text-sm text-muted-foreground">URLs, text, WiFi, contact info, and more</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">🎨 Custom Styling</h4>
                <p className="text-sm text-muted-foreground">Colors, logos, and design customization</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">📏 Size Options</h4>
                <p className="text-sm text-muted-foreground">Various sizes and resolution settings</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">💾 Export Formats</h4>
                <p className="text-sm text-muted-foreground">PNG, SVG, and PDF download options</p>
              </div>
            </div>
          </div>
          <div className="pt-6">
            <p className="text-sm text-muted-foreground">
              QR code generation capabilities coming soon! Explore other tools while we build this feature.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
