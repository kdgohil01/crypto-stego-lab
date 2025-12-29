import { useAuth } from "../contexts/AuthContext";
import { Shield, Eye, Lock } from "lucide-react";
import { isFirebaseConfigured } from "@/firebase";
import LetterGlitch from "@/components/LetterGlitch";

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
    <div className="min-h-screen text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background LetterGlitch effect */}
      <div className="absolute inset-0">
        <LetterGlitch
          glitchSpeed={50}
          centerVignette={true}
          outerVignette={false}
          smooth={true}
        />
      </div>

      {/* Title */}
      <div className="relative z-10 text-center max-w-2xl px-6">
        <h1 className="text-6xl font-extrabold" style={{ color: '#52CBD1' }}>CRYPTO STEGO LAB</h1>
        <br /><br />
        <h3 className="mt-4 text-2xl font-medium drop-shadow-lg" style={{ color: '#CFC6C6' }}>
          Prevents data leakage with multi-layered security to ensure that sensitive data remains encrypted, hidden, and inaccessible without authorized sequential access.
        </h3>
        <br />
        <br />
      </div>

      {/* Buttons */}
      <div className="relative z-10 mt-8 flex gap-4">
        <button
          onClick={handleSignIn}
          disabled={!isFirebaseConfigured}
          title={!isFirebaseConfigured ? "Firebase not configured" : undefined}
          className="flex items-center gap-2 px-8 py-4 rounded-lg hover:opacity-90 text-gray-900 font-semibold transition-all shadow-xl border-2 border-cyan-400/50 disabled:opacity-60 disabled:cursor-not-allowed backdrop-blur-sm"
          style={{ backgroundColor: '#CFC6C6' }}
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google Logo"
            className="w-5 h-5"
          />
          {isFirebaseConfigured ? "Continue with Google" : "Firebase not configured"}
        </button>
      </div>

      {/* Features */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 px-6 max-w-7xl">
        <div className="bg-gray-900/40 rounded-xl p-8 border border-gray-700">
          <Shield className="w-10 h-10 text-green-400 mb-4" />
          <h3 className="text-xl font-bold">Advanced Encryption</h3>
          <p className="text-base" style={{ color: '#CFC6C6' }}>
            Military-grade encryption protocols protect your data.
          </p>
        </div>
        <div className="bg-gray-900/40 rounded-xl p-8 border border-gray-700">
          <Lock className="w-10 h-10 text-blue-400 mb-4" />
          <h3 className="text-xl font-bold">Zero-Trust Security</h3>
          <p className="text-base" style={{ color: '#CFC6C6' }}>
            Never trust, always verify every access request.
          </p>
        </div>
        <div className="bg-gray-900/40 rounded-xl p-8 border border-gray-700">
          <Eye className="w-10 h-10 text-green-300 mb-4" />
          <h3 className="text-xl font-bold">Real-time Monitoring</h3>
          <p className="text-base" style={{ color: '#CFC6C6' }}>
            24/7 threat detection and response systems.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLanding;
