import { useId } from 'react';
import { ArrowRight, Info, Leaf, TreePine } from 'lucide-react';
import site from '../config';
import { useQuote } from '../context/quote';
import { inr, inrShort, kw, number, years } from '../lib/format';
import { scrollToSection } from '../lib/scroll';
import Icon from '../components/Icon';
import SectionHeader from '../components/SectionHeader';
import Reveal from '../components/Reveal';
import './Calculator.css';

export default function Calculator({ id }) {
  const { calculator } = site;
  const { segment, setSegmentId, bill, setBill, estimate: e, prefillLead } = useQuote();
  const billId = useId();
  const { min, max, step } = segment.bill;
  const fill = `${((bill - min) / (max - min)) * 100}%`;

  const onBillInput = (raw) => {
    const value = Number(String(raw).replace(/\D/g, ''));
    if (Number.isFinite(value)) setBill(Math.min(max, Math.max(0, value)));
  };

  const requestQuote = () => {
    const interest = site.solutions.items.find((s) => s.id === segment.id)?.interest;
    prefillLead({
      interest,
      bill: String(bill),
      message: `Calculator estimate: ${kw(e.systemKw)} system for a ₹${number(bill)} monthly bill.`,
    });
    scrollToSection('contact');
  };

  const metrics = [
    { label: 'System cost', value: inrShort(e.cost) },
    e.subsidy > 0 && { label: segment.subsidy?.label ?? 'Subsidy', value: `− ${inrShort(e.subsidy)}`, tone: 'good' },
    { label: 'Your net cost', value: inrShort(e.netCost), tone: 'strong' },
    { label: 'Monthly savings', value: inr(e.monthlySavings), tone: 'good' },
    { label: 'Payback period', value: years(e.paybackYears) },
    { label: `${calculator.lifetimeYears}-year savings`, value: inrShort(e.lifetimeSavings), tone: 'good' },
  ].filter(Boolean);

  const afterPct = bill > 0 ? Math.max(3, (e.billAfter / bill) * 100) : 0;

  return (
    <section id={id} className="section section--tint" aria-labelledby={`${id}-title`}>
      <div className="container">
        <SectionHeader id={`${id}-title`} eyebrow={calculator.eyebrow} title={calculator.title} subtitle={calculator.subtitle} />

        <Reveal className="calc card">
          <div className="calc__inputs">
            <div className="field">
              <span className="label" id={`${billId}-type`}>
                I want solar for my
              </span>
              <div className="segmented" role="radiogroup" aria-labelledby={`${billId}-type`}>
                {calculator.segments.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    role="radio"
                    aria-checked={s.id === segment.id}
                    onClick={() => setSegmentId(s.id)}
                  >
                    <Icon name={s.icon} />
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="field calc__bill">
              <label htmlFor={billId}>Average monthly electricity bill</label>
              <div className="calc__bill-value">
                <span aria-hidden="true">₹</span>
                <input
                  className="calc__bill-input"
                  inputMode="numeric"
                  aria-label="Monthly bill in rupees"
                  value={number(bill)}
                  style={{ width: `${number(bill).length + 0.5}ch` }}
                  onChange={(ev) => onBillInput(ev.target.value)}
                />
                <span className="calc__per">/ month</span>
              </div>
              <input
                id={billId}
                className="range"
                type="range"
                min={min}
                max={max}
                step={step}
                value={Math.min(max, Math.max(min, bill))}
                style={{ '--fill': fill }}
                onChange={(ev) => setBill(Number(ev.target.value))}
              />
              <div className="calc__range-labels" aria-hidden="true">
                <span>{inrShort(min)}</span>
                <span>{inrShort(max)}+</span>
              </div>
            </div>

            <dl className="calc__facts">
              <div>
                <dt>Units used</dt>
                <dd>≈ {number(e.monthlyUnits)} / month</dd>
              </div>
              <div>
                <dt>Tariff assumed</dt>
                <dd>₹{segment.tariffPerUnit} / unit</dd>
              </div>
              <div>
                <dt>Solar generation</dt>
                <dd>{calculator.unitsPerKwPerMonth} units / kW / month</dd>
              </div>
            </dl>

            {segment.note && (
              <p className="calc__note">
                <Info aria-hidden="true" />
                {segment.note}
              </p>
            )}
            <p className="calc__disclaimer">{calculator.disclaimer}</p>
          </div>

          <div className="calc__results" aria-live="polite">
            <div className="calc__system">
              <span className="calc__kicker">Recommended system</span>
              <strong className="calc__kw">{kw(e.systemKw)}</strong>
              <span className="calc__system-detail">
                {e.panels} panels × {site.calculator.panelWattage} W · ~{number(e.roofAreaSqft)} sq ft shadow-free roof
              </span>
              {e.cappedBySize && (
                <span className="calc__warn">
                  Your usage needs more than {kw(segment.maxKw)}. We'll design a custom plant for you.
                </span>
              )}
            </div>

            <dl className="calc__metrics">
              {metrics.map((m) => (
                <div key={m.label} className={m.tone ? `is-${m.tone}` : undefined}>
                  <dt>{m.label}</dt>
                  <dd>{m.value}</dd>
                </div>
              ))}
            </dl>

            <div className="calc__bars" aria-label="Monthly bill before and after solar">
              <div className="calc__bar">
                <span>Bill today</span>
                <div>
                  <i style={{ width: '100%' }} />
                </div>
                <strong>{inr(bill)}</strong>
              </div>
              <div className="calc__bar calc__bar--after">
                <span>With solar</span>
                <div>
                  <i style={{ width: `${afterPct}%` }} />
                </div>
                <strong>{inr(e.billAfter)}</strong>
              </div>
            </div>

            <ul className="calc__eco">
              <li>
                <Leaf aria-hidden="true" />
                {number(e.annualCo2Tonnes, 1)} t CO₂ avoided / year
              </li>
              <li>
                <TreePine aria-hidden="true" />= {number(e.treesEquivalent)} trees planted
              </li>
            </ul>

            <div className="calc__actions">
              <button type="button" className="btn btn--primary" onClick={requestQuote}>
                Get this exact quote <ArrowRight aria-hidden="true" />
              </button>
              <a className="btn btn--ghost-light" href="#financing">
                See EMI options
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
