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
import CaesarCipher from "./components/crypto/CaesarCipher";
import VigenereCipher from "./components/crypto/VigenereCipher";
import TextInImage from "./components/stego/TextInImage";
import AudioSteganography from "./components/stego/AudioSteganography";
import NotFound from "./pages/NotFound";
import { useAuth } from "./contexts/AuthContext";

// ✅ Import the new landing page
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
            <Route path="/steganography" element={<AppLayout><Steganography /></AppLayout>} />
            <Route path="/steganography/text-image" element={<AppLayout><TextInImage /></AppLayout>} />
            <Route path="/steganography/audio" element={<AppLayout><AudioSteganography /></AppLayout>} />
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
