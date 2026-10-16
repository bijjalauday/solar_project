import { createContext, useContext } from 'react';

// Shared between sections: the calculator inputs (so EMI can reuse the estimate)
// and a lead prefill (so "Get this quote" buttons can pre-fill the contact form).
export const QuoteContext = createContext(null);

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error('useQuote must be used inside <QuoteProvider>');
  return ctx;
}
