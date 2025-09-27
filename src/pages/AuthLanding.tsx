import { useAuth } from "../contexts/AuthContext";
import { Shield, Eye, Lock } from "lucide-react";

const AuthLanding = () => {
  const { signInWithGoogle } = useAuth();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google Sign-In error:", error);
      alert("Failed to sign in. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background matrix effect */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/matrix.png')] opacity-20" />

      {/* Team Name */}
      <div className="relative z-10 text-center mb-8">
        <h1 className="text-4xl font-bold text-green-400">NeoByte</h1>
      </div>

      {/* Title */}
      <div className="relative z-10 text-center max-w-2xl px-6">
        <span className="px-4 py-1 text-xs rounded-full border border-green-500 text-green-400 mb-4 inline-block">
          ⚡ Hackathon Project
        </span>
        <h1 className="text-5xl font-extrabold text-green-400">SecureAuth</h1>
        <h2 className="text-3xl font-bold text-white mt-2">Hub</h2>
        <p className="text-gray-300 mt-4">
          Advanced cybersecurity authentication platform built for the modern
          web. Secure, fast, and intelligent protection for your digital assets.
        </p>
      </div>

      {/* Buttons */}
      <div className="relative z-10 mt-8 flex gap-4">
        <button
          onClick={handleSignIn}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-black font-semibold transition-all shadow-lg"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google Logo"
            className="w-5 h-5"
          />
          Continue with Google
        </button>
      </div>

      {/* Features */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 px-6 max-w-4xl">
        <div className="bg-gray-900/40 rounded-xl p-6 border border-gray-700">
          <Shield className="w-8 h-8 text-green-400 mb-3" />
          <h3 className="text-lg font-bold">Advanced Encryption</h3>
          <p className="text-sm text-gray-400">
            Military-grade encryption protocols protect your data.
          </p>
        </div>
        <div className="bg-gray-900/40 rounded-xl p-6 border border-gray-700">
          <Lock className="w-8 h-8 text-blue-400 mb-3" />
          <h3 className="text-lg font-bold">Zero-Trust Security</h3>
          <p className="text-sm text-gray-400">
            Never trust, always verify every access request.
          </p>
        </div>
        <div className="bg-gray-900/40 rounded-xl p-6 border border-gray-700">
          <Eye className="w-8 h-8 text-green-300 mb-3" />
          <h3 className="text-lg font-bold">Real-time Monitoring</h3>
          <p className="text-sm text-gray-400">
            24/7 threat detection and response systems.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLanding;
