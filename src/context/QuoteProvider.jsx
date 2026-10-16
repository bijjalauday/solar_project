import { useCallback, useMemo, useState } from 'react';
import site from '../config';
import { estimateSolar } from '../lib/solar';
import { QuoteContext } from './quote';

export function QuoteProvider({ children }) {
  const segments = site.calculator.segments;
  const [segmentId, setSegmentId] = useState(segments[0].id);
  const segment = segments.find((s) => s.id === segmentId) ?? segments[0];
  const [bills, setBills] = useState(() => Object.fromEntries(segments.map((s) => [s.id, s.bill.default])));
  const bill = bills[segment.id] ?? segment.bill.default;
  const setBill = useCallback((value) => setBills((prev) => ({ ...prev, [segmentId]: value })), [segmentId]);

  const estimate = useMemo(() => estimateSolar(bill, segment, site.calculator), [bill, segment]);

  const [lead, setLeadState] = useState({ version: 0 });
  const prefillLead = useCallback((fields) => setLeadState((prev) => ({ ...fields, version: prev.version + 1 })), []);

  const value = useMemo(
    () => ({ segment, setSegmentId, bill, setBill, estimate, lead, prefillLead }),
    [segment, bill, setBill, estimate, lead, prefillLead],
  );
  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}
