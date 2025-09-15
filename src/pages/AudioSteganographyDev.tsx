import { ArrowLeft, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function AudioSteganographyDev() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/steganography")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Steganography
          </Button>
        </div>

        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md text-center border-2 border-dashed border-blue-300 dark:border-blue-700">
            <CardHeader className="pb-4">
              <div className="mx-auto mb-4 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full w-fit">
                <Construction className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                Audio Steganography
              </CardTitle>
              <CardDescription className="text-lg">
                Converting audio files to text format
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <strong>Coming Soon:</strong>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  This feature will allow you to convert audio files into secure text format for storage and transmission, with the ability to reconstruct the original audio from the text data.
                </p>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                This feature is currently under development
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
