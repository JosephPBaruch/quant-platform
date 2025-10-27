import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { makeStyles } from "@mui/styles";
import App from "./App.js";

const useGlobalStyles = makeStyles({
  "@global": {
    ":root": {
      fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
      lineHeight: 1.5,
      fontWeight: 400,
      colorScheme: "light dark",
      color: "rgba(255, 255, 255, 0.87)",
      backgroundColor: "#242424",
      fontSynthesis: "none",
      textRendering: "optimizeLegibility",
      "-webkit-font-smoothing": "antialiased",
      "-moz-osx-font-smoothing": "grayscale",
    },
  },
});

function Root() {
  useGlobalStyles();
  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
}

createRoot(document.getElementById("root")).render(<Root />);

export default Root;
