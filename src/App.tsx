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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
