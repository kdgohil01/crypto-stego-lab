import { Construction, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function HashGenerator() {
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

      <Card className="card-glow border-blue-200/20">
        <CardHeader className="text-center pb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-6">
            <Construction className="h-10 w-10 text-blue-600" />
          </div>
          <CardTitle className="text-3xl mb-4">Hash Generator</CardTitle>
          <CardDescription className="text-lg">
            This feature is currently under development
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="max-w-2xl mx-auto">
            <p className="text-muted-foreground mb-6">
              We're building a comprehensive hash generation tool that will support multiple algorithms. 
              Upcoming features include:
            </p>
            <div className="grid gap-4 md:grid-cols-2 text-left">
              <div className="space-y-2">
                <h4 className="font-semibold">🔐 MD5 & SHA Family</h4>
                <p className="text-sm text-muted-foreground">Generate MD5, SHA-1, SHA-256, SHA-512 hashes</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">⚡ Real-time Generation</h4>
                <p className="text-sm text-muted-foreground">Instant hash computation as you type</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">📁 File Hashing</h4>
                <p className="text-sm text-muted-foreground">Generate hashes for uploaded files</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">🔍 Hash Comparison</h4>
                <p className="text-sm text-muted-foreground">Compare hashes for integrity verification</p>
              </div>
            </div>
          </div>
          <div className="pt-6">
            <p className="text-sm text-muted-foreground">
              Coming soon! Check back for powerful hash generation capabilities.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
