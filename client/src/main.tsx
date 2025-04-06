import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add custom CSS for chat bubbles and smooth scrolling
const style = document.createElement('style');
style.textContent = `
  html {
    scroll-behavior: smooth;
  }
  
  .chat-bubble {
    position: relative;
  }
  
  .chat-bubble.text-white:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 10px;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-top-color: currentColor;
    border-bottom: 0;
    margin-left: -10px;
    margin-bottom: -10px;
  }
  
  .chat-bubble.ml-auto:after {
    left: auto;
    right: 10px;
    margin-left: 0;
    margin-right: -10px;
  }
  
  .gallery-item {
    transition: all 0.3s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.6s ease forwards;
  }
`;
document.head.appendChild(style);

createRoot(document.getElementById("root")!).render(<App />);
