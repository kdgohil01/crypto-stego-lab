import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// Import the AuthProvider
import { AuthProvider } from "./contexts/AuthContext"; // Adjust the path if necessary

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);