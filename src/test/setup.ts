import '@testing-library/jest-dom';

// Polyfill window.scrollTo if not present in jsdom
if (typeof window !== 'undefined') {
  window.scrollTo = () => {};
}
