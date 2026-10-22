import '@testing-library/jest-dom';
import { MotionGlobalConfig } from 'framer-motion';

// Make framer-motion animations resolve instantly under jsdom so AnimatePresence
// exits complete synchronously and DOM assertions stay deterministic.
MotionGlobalConfig.skipAnimations = true;

// jsdom has no layout, so no scrolling; the app restores listing positions with it.
window.scrollTo = (() => {}) as typeof window.scrollTo;
