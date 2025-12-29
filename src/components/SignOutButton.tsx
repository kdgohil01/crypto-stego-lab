import { useAuth } from "../contexts/AuthContext";

export default function SignOutButton() {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <button
      onClick={signOut} // Use signOut, not logout
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
    >
      Sign Out
    </button>
  );
}
