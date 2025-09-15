import { useState } from "react";
import SplashScreen from "./components/SplashScreen";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Learn from "./pages/Learn";
import Cryptography from "./pages/Cryptography";
import Steganography from "./pages/Steganography";
import DataProcessing from "./pages/DataProcessing";
import CaesarCipher from "./components/crypto/CaesarCipher";
import VigenereCipher from "./components/crypto/VigenereCipher";
import { AESEncryption } from "./components/crypto/AESEncryption";
import { RSAEncryption } from "./components/crypto/RSAEncryption";
import URLProcessor from "./components/data/URLProcessor";
import JSONFormatter from "./pages/JSONFormatter";
import HashGenerator from "./pages/HashGenerator";
import QRGenerator from "./pages/QRGenerator";
import BinaryConverter from "./pages/BinaryConverter";
import VideoSteganographyDev from "./pages/VideoSteganographyDev";
import AudioSteganographyDev from "./pages/AudioSteganographyDev";
import MultilayeredSecurity from "./pages/MultilayeredSecurity";
import GuardianLayer from "./components/multilayered/GuardianLayer";
import TextInImage from "./components/stego/TextInImage";
import VideoSteganography from "./components/stego/VideoSteganography";
import ClickSequenceAuth from "./components/stego/ClickSequenceAuth";
import AudioSteganography from "./components/stego/AudioSteganography";
import NotFound from "./pages/NotFound";
import { useAuth } from "./contexts/AuthContext";

// Import the new landing page
import AuthLanding from "./pages/AuthLanding";


const queryClient = new QueryClient();

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const { user } = useAuth();

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // If user is not logged in, show new Auth Landing page
  if (!user) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthLanding />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // If user is logged in, show your original app
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/learn" element={<AppLayout><Learn /></AppLayout>} />
            <Route path="/cryptography" element={<AppLayout><Cryptography /></AppLayout>} />
            <Route path="/cryptography/caesar" element={<AppLayout><CaesarCipher /></AppLayout>} />
            <Route path="/cryptography/vigenere" element={<AppLayout><VigenereCipher /></AppLayout>} />
            <Route path="/cryptography/aes" element={<AppLayout><AESEncryption /></AppLayout>} />
            <Route path="/cryptography/rsa" element={<AppLayout><RSAEncryption /></AppLayout>} />
            <Route path="/steganography" element={<AppLayout><Steganography /></AppLayout>} />
            <Route path="/steganography/text-image" element={<AppLayout><TextInImage /></AppLayout>} />
            <Route path="/steganography/video" element={<AppLayout><VideoSteganography /></AppLayout>} />
            <Route path="/steganography/video-steganography" element={<AppLayout><VideoSteganographyDev /></AppLayout>} />
            <Route path="/steganography/click-sequence" element={<AppLayout><ClickSequenceAuth /></AppLayout>} />
            <Route path="/steganography/audio" element={<AppLayout><AudioSteganography /></AppLayout>} />
            <Route path="/steganography/audio-steganography" element={<AppLayout><AudioSteganographyDev /></AppLayout>} />
            <Route path="/multilayered-security" element={<AppLayout><MultilayeredSecurity /></AppLayout>} />
            <Route path="/multilayered-security/guardian-layer" element={<AppLayout><GuardianLayer /></AppLayout>} />
            <Route path="/data-processing" element={<AppLayout><DataProcessing /></AppLayout>} />
            <Route path="/data-processing/url-processor" element={<AppLayout><URLProcessor /></AppLayout>} />
            <Route path="/data-processing/json-formatter" element={<AppLayout><JSONFormatter /></AppLayout>} />
            <Route path="/data-processing/hash-generator" element={<AppLayout><HashGenerator /></AppLayout>} />
            <Route path="/data-processing/qr-generator" element={<AppLayout><QRGenerator /></AppLayout>} />
            <Route path="/data-processing/binary-converter" element={<AppLayout><BinaryConverter /></AppLayout>} />
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
