import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./lib/db-init.ts"; // Initialize database on app startup

createRoot(document.getElementById("root")!).render(<App />);
