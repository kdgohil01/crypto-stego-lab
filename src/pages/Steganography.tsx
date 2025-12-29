import { Link } from "react-router-dom";
import { Eye, Image, FileImage, Layers, Volume2, MousePointer, Video, File } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const tools = [
  {
    title: "Text in Image",
    description: "Hide secret messages inside images using LSB (Least Significant Bit) manipulation technique.",
    icon: Image,
    path: "/steganography/text-image",
    difficulty: "Beginner",
    color: "text-white",
    bgColor: "bg-blue-500",
  },
  {
    title: "File in Image",
    description: "Hide any file type (PDF, ZIP, EXE, etc.) inside images using AES-256 encryption and LSB steganography.",
    icon: File,
    path: "/steganography/file-image",
    difficulty: "Advanced",
    color: "text-white",
    bgColor: "bg-purple-500",
  },
  {
    title: "Click Sequence Authentication",
    description: "Hide messages in images using click-based authentication. Secure your data with pixel coordinates.",
    icon: MousePointer,
    path: "/steganography/click-sequence",
    difficulty: "Intermediate",
    color: "text-white",
    bgColor: "bg-green-500",
  },
  {
    title: "Text in Audio",
    description: "Hide text messages in audio files using LSB manipulation. Changes are inaudible to human ears.",
    icon: Volume2,
    path: "/steganography/audio",
    difficulty: "Intermediate",
    color: "text-white",
    bgColor: "bg-green-500",
  },
  {
    title: "Text in Video",
    description: "Hide secret text messages inside video files using military-grade AES-256 encryption and advanced techniques.",
    icon: Video,
    path: "/steganography/video",
    difficulty: "Advanced",
    color: "text-white",
    bgColor: "bg-red-500",
  },
];

export default function Steganography() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-secondary mb-6 float-animation">
          <Eye className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-5xl font-bold text-gradient mb-6 leading-tight pb-2">Steganography Lab</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Master the art of hiding information in plain sight. Conceal secret messages within innocent-looking files without anyone knowing they exist.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
        {tools.map((tool) => (
          <Card key={tool.title} className="card-glow group hover:scale-105 transition-transform duration-300 h-full flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${tool.bgColor}`}>
                  <tool.icon className={`h-6 w-6 ${tool.color}`} />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${tool.color} ${tool.bgColor}`}>
                  {tool.difficulty}
                </span>
              </div>
              <CardTitle className="text-2xl">{tool.title}</CardTitle>
              <CardDescription className="text-base">{tool.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col flex-1">
              <div className="flex-1"></div>
              <Button asChild className="w-full bg-secondary hover:bg-secondary/90 h-10 mt-auto">
                <Link to={tool.path}>Try {tool.title}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Coming Soon */}
      <Card className="bg-muted/20 border-border/30 mb-12">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-muted-foreground">Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 max-w-lg mx-auto">
            <div className="text-center p-4 rounded-lg bg-muted/10">
              <Volume2 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <h3 className="font-semibold mb-1 text-muted-foreground">Audio Steganography</h3>
              <p className="text-xs text-muted-foreground">Convert audio files into text data</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/10">
              <Layers className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <h3 className="font-semibold mb-1 text-muted-foreground">Video Steganography</h3>
              <p className="text-xs text-muted-foreground">Convert video files into text data</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Section */}
      <div className="grid gap-8 md:grid-cols-3 mb-12">
        <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-secondary" />
              Invisibility
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Unlike cryptography, steganography hides the very existence of the message, making it undetectable to casual observers.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5 text-accent" />
              Carrier Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Secret data is embedded within innocent-looking carrier files like images, audio, or video without altering their appearance.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              LSB Technique
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Least Significant Bit manipulation modifies the last bit of pixel data, creating changes too small for human perception.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <Card className="card-glow">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">How Steganography Works</CardTitle>
          <CardDescription className="text-base">
            The science of hiding information within other data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-secondary-foreground font-bold mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Select Carrier</h3>
              <p className="text-sm text-muted-foreground">Choose an innocent-looking file to hide data in</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-secondary-foreground font-bold mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">Prepare Message</h3>
              <p className="text-sm text-muted-foreground">Convert secret text into binary format</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-secondary-foreground font-bold mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Embed Data</h3>
              <p className="text-sm text-muted-foreground">Replace least significant bits with message data</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-secondary-foreground font-bold mb-4">
                4
              </div>
              <h3 className="font-semibold mb-2">Extract Later</h3>
              <p className="text-sm text-muted-foreground">Retrieve hidden message using the same algorithm</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}