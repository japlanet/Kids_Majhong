import { createRoot } from "react-dom/client";
import App from "./App";
// Fonts ship inside the game so nothing is fetched from Google and they work offline.
import "@fontsource/nunito/latin-700.css";
import "@fontsource/nunito/latin-800.css";
import "@fontsource/nunito/latin-900.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Offline play: register the service worker on production builds only, so the
// Replit dev server never serves stale files.
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`)
      .catch(() => {
        // Offline support is an enhancement; the game works without it.
      });
  });
}
