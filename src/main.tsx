import {createRoot} from 'react-dom/client';
import App from './App';
import './index.css';

window.onerror = function(message, source, lineno, colno, error) {
  console.error('Global Error:', message, 'at', source, ':', lineno, ':', colno, error);
};

window.onunhandledrejection = function(event) {
  console.error('Unhandled Rejection:', event.reason);
};

console.log('main.tsx: Starting render...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('main.tsx: Root element not found!');
} else {
  createRoot(rootElement).render(<App />);
}

