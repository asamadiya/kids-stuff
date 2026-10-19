import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LearningCenter } from './learn/LearningCenter';
import './styles/lc/tokens.css';
import './styles/lc/base.css';
import './styles/lc/play.css';
import './styles/lc/book.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <StrictMode>
    <LearningCenter />
  </StrictMode>,
);
