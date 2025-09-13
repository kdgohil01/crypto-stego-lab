// src/components/SplashScreen.tsx
import { useEffect } from "react";
import Lottie from "lottie-react";
import lockAnimation from "../assets/lock.json";
import { motion } from "framer-motion"; // Add this import

interface SplashProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashProps) {
  useEffect(() => {
    // Finish after 3s (adjust if animation length differs)
    const timer = setTimeout(onFinish, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <Lottie
        animationData={lockAnimation}
        loop={false}
        style={{ width: 500, height: 500 }}
      />
      <motion.p
        className="mt-8 text-xl md:text-2xl font-semibold text-white text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
      >
        Where Data Hides and Codes Speak.
      </motion.p>
    </div>
  );
}
