import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { FirebaseProvider } from './context/FirebaseContext.tsx';
import { FocusProvider } from './context/FocusContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FirebaseProvider>
      <FocusProvider>
        <App />
      </FocusProvider>
    </FirebaseProvider>
  </StrictMode>,
);
