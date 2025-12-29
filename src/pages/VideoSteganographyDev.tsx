import { Construction, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function VideoSteganographyDev() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <Button asChild variant="ghost" className="mb-4">
          <Link to="/steganography" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Steganography
          </Link>
        </Button>
      </div>

      <Card className="card-glow border-red-200/20">
        <CardHeader className="text-center pb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
            <Construction className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-3xl mb-4">Video Steganography</CardTitle>
          <CardDescription className="text-lg">
            This feature is currently under development
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="max-w-2xl mx-auto">
            <p className="text-muted-foreground mb-6">
              We're developing an advanced video steganography tool that converts video files into text data format. 
              This revolutionary feature will include:
            </p>
            <div className="grid gap-4 md:grid-cols-2 text-left">
              <div className="space-y-2">
                <h4 className="font-semibold">🎥 Video-to-Text Conversion</h4>
                <p className="text-sm text-muted-foreground">Transform entire video files into readable text format</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">🔄 Lossless Conversion</h4>
                <p className="text-sm text-muted-foreground">Perfect reconstruction of original video from text</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">📊 Multiple Formats</h4>
                <p className="text-sm text-muted-foreground">Support for MP4, AVI, MOV, and other video formats</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">🔐 Secure Processing</h4>
                <p className="text-sm text-muted-foreground">Optional encryption for converted text data</p>
              </div>
            </div>
          </div>
          <div className="pt-6">
            <p className="text-sm text-muted-foreground">
              This advanced video steganography feature is coming soon! Meanwhile, try our "Text in Video" tool for hiding messages inside videos.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
