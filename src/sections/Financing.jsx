import { useId, useState } from 'react';
import { Landmark } from 'lucide-react';
import site from '../config';
import { useQuote } from '../context/quote';
import { loanSummary } from '../lib/solar';
import { inr, inrShort, number } from '../lib/format';
import SectionHeader from '../components/SectionHeader';
import Reveal from '../components/Reveal';
import './Financing.css';

export default function Financing({ id }) {
  const { financing } = site;
  const cfg = financing.emi;
  const { estimate } = useQuote();
  const uid = useId();

  // `null` = follow the calculator's system cost until the user types their own.
  const [customCost, setCustomCost] = useState(null);
  const [downPct, setDownPct] = useState(cfg.defaultDownPaymentPct);
  const [rate, setRate] = useState(cfg.defaultRatePct);
  const [months, setMonths] = useState(cfg.defaultTenureMonths);

  const cost = customCost ?? Math.round(estimate.cost);
  const loan = loanSummary({ cost, downPaymentPct: downPct, ratePct: rate, months, processingFeePct: cfg.processingFeePct });
  const coverage = loan.monthly > 0 ? Math.min(100, (estimate.monthlySavings / loan.monthly) * 100) : 100;

  return (
    <section id={id} className="section" aria-labelledby={`${id}-title`}>
      <div className="container fin">
        <div className="fin__intro">
          <SectionHeader
            id={`${id}-title`}
            eyebrow={financing.eyebrow}
            title={financing.title}
            subtitle={financing.subtitle}
            align="left"
          />
          <ol className="fin__steps">
            {financing.steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 80}>
                <span className="fin__step-num">{i + 1}</span>
                <span>
                  <strong>{s.title}</strong>
                  {s.text}
                </span>
              </Reveal>
            ))}
          </ol>
          {financing.lenders?.length > 0 && (
            <div className="fin__lenders">
              <span>
                <Landmark aria-hidden="true" /> Loans available through
              </span>
              <ul>
                {financing.lenders.map((l) => (
                  <li key={l} className="chip">
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <Reveal className="emi card">
          <h3>EMI calculator</h3>

          <div className="field">
            <label htmlFor={`${uid}-cost`}>System cost (₹)</label>
            <input
              id={`${uid}-cost`}
              className="input"
              inputMode="numeric"
              value={number(cost)}
              onChange={(e) => setCustomCost(Number(e.target.value.replace(/\D/g, '')) || 0)}
            />
            <small className="emi__hint">
              {customCost == null ? (
                'Pre-filled from your savings estimate above.'
              ) : (
                <button type="button" className="emi__reset" onClick={() => setCustomCost(null)}>
                  Use my calculator estimate ({inrShort(estimate.cost)})
                </button>
              )}
            </small>
          </div>

          <div className="field">
            <label htmlFor={`${uid}-down`}>
              Down payment <strong>{downPct}%</strong> <span className="emi__muted">({inr(loan.downPayment)})</span>
            </label>
            <input
              id={`${uid}-down`}
              className="range"
              type="range"
              min="0"
              max="50"
              step="5"
              value={downPct}
              style={{ '--fill': `${(downPct / 50) * 100}%` }}
              onChange={(e) => setDownPct(Number(e.target.value))}
            />
          </div>

          <div className="field">
            <label htmlFor={`${uid}-rate`}>
              Interest rate <strong>{rate}% p.a.</strong>
            </label>
            <input
              id={`${uid}-rate`}
              className="range"
              type="range"
              min={cfg.minRatePct}
              max={cfg.maxRatePct}
              step="0.25"
              value={rate}
              style={{ '--fill': `${((rate - cfg.minRatePct) / (cfg.maxRatePct - cfg.minRatePct)) * 100}%` }}
              onChange={(e) => setRate(Number(e.target.value))}
            />
          </div>

          <div className="field">
            <span className="label" id={`${uid}-tenure`}>
              Tenure
            </span>
            <div className="emi__tenures" role="radiogroup" aria-labelledby={`${uid}-tenure`}>
              {cfg.tenuresMonths.map((m) => (
                <button key={m} type="button" role="radio" aria-checked={m === months} onClick={() => setMonths(m)}>
                  {m / 12} yr
                </button>
              ))}
            </div>
          </div>

          <div className="emi__result" aria-live="polite">
            <div className="emi__monthly">
              <span>Monthly EMI</span>
              <strong>{inr(loan.monthly)}</strong>
            </div>
            <dl>
              <div>
                <dt>Loan amount</dt>
                <dd>{inr(loan.principal)}</dd>
              </div>
              <div>
                <dt>Total interest</dt>
                <dd>{inr(loan.totalInterest)}</dd>
              </div>
              <div>
                <dt>Processing fee (~{cfg.processingFeePct}%)</dt>
                <dd>{inr(loan.processingFee)}</dd>
              </div>
            </dl>
            <div className="emi__coverage">
              <div className="emi__coverage-bar">
                <i style={{ width: `${coverage}%` }} />
              </div>
              <p>
                Your estimated solar savings of <strong>{inr(estimate.monthlySavings)}/month</strong> cover{' '}
                <strong>{Math.round(coverage)}%</strong> of this EMI.
              </p>
            </div>
          </div>
          <p className="emi__note">{cfg.note}</p>
        </Reveal>
      </div>
    </section>
  );
}
