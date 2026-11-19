import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './tailwind.css';
import BertolottiPerez from './BertolottiPerez.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BertolottiPerez />
  </StrictMode>
);
