// src/components/GoogleSignIn.tsx
import { useAuth } from "@/contexts/AuthContext";

export default function GoogleSignIn() {
  const { signInWithGoogle, isLoading } = useAuth();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <button
        onClick={signInWithGoogle}
        disabled={isLoading}
        className="flex items-center gap-3 px-6 py-3 bg-white border rounded-lg shadow hover:bg-gray-100 transition"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-6 h-6"
        />
        {isLoading ? "Signing in..." : "Continue with Google"}
      </button>
    </div>
  );
}
