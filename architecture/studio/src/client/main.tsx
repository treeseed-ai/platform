import { createRoot } from "react-dom/client";
import { StudioApp } from "./app.js";
import "./style.css";

class StudioBrowser {
  static start(): void {
    createRoot(document.getElementById("root")!).render(<StudioApp />);
  }
}
StudioBrowser.start();
