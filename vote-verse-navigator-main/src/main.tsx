
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Always use light mode - remove any dark mode classes
document.documentElement.classList.remove('dark');
document.documentElement.classList.add('light');
document.body.style.backgroundColor = '#FFFFFF'; // UDOM white background

createRoot(document.getElementById("root")!).render(<App />);
