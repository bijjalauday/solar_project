import { useId, useState } from 'react';
import { BatteryCharging, Moon, PlugZap, Sun, ZapOff } from 'lucide-react';
import site from '../config';
import { simulate } from '../lib/simulate';
import SectionHeader from '../components/SectionHeader';
import Reveal from '../components/Reveal';
import './Simulator.css';

const SCENARIOS = [
  { id: 'day', label: 'Sunny day', Icon: Sun },
  { id: 'night', label: 'Night', Icon: Moon },
  { id: 'powercut', label: 'Power cut', Icon: ZapOff },
];

const STATUS_ICON = { solar: Sun, battery: BatteryCharging, grid: PlugZap, warn: ZapOff, idle: Moon };

function Flow({ d, active, kind, reverse = false }) {
  return (
    <g className={`flow flow--${kind}${active ? ' is-active' : ''}${reverse ? ' is-reverse' : ''}`}>
      <path className="flow__track" d={d} />
      <path className="flow__dots" d={d} />
    </g>
  );
}

function Diagram({ s, battery, load }) {
  const { flows } = s;
  const cells = [];
  for (let c = 0; c < 4; c++) for (let r = 0; r < 2; r++) cells.push([c, r]);
  return (
    <svg className={`sim__svg${s.sunUp ? '' : ' is-night'}`} viewBox="0 0 640 440" role="img" aria-label={s.status}>
      <defs>
        <linearGradient id="sim-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className="sim__sky-top" />
          <stop offset="1" className="sim__sky-bottom" />
        </linearGradient>
      </defs>
      <rect className="sim__sky" width="640" height="440" fill="url(#sim-sky)" />
      <rect x="0" y="400" width="640" height="40" className="sim__ground" />

      {/* sun or moon */}
      {s.sunUp ? (
        <g className="sim__sun" transform="translate(70 66)">
          <g className="sim__rays">
            {Array.from({ length: 12 }, (_, i) => (
              <rect key={i} x="-3" y="-46" width="6" height="14" rx="3" transform={`rotate(${i * 30})`} />
            ))}
          </g>
          <circle r="24" />
        </g>
      ) : (
        <g className="sim__moon" transform="translate(74 66)">
          <circle r="22" />
          <circle r="20" cx="10" cy="-6" className="sim__moon-cut" />
          {[
            [120, -20],
            [200, 10],
            [300, -30],
            [420, -10],
            [90, 60],
          ].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r="1.8" className="sim__star" />
          ))}
        </g>
      )}

      {/* flows (under the nodes) */}
      <Flow d="M246 200 V245 H290" active={flows.solar} kind="solar" />
      <Flow d="M370 262 V352 H448" active={flows.toHome} kind={flows.discharge ? 'battery' : 'solar'} />
      {s.hasGrid && <Flow d="M370 228 H515 V214" active={flows.export} kind="solar" />}
      {s.hasGrid && <Flow d="M540 214 V292" active={flows.import} kind="grid" />}
      {s.hasBattery && (
        <Flow d="M330 282 V352 H212" active={flows.charge || flows.discharge} kind="battery" reverse={flows.discharge} />
      )}

      {/* solar panels */}
      <g className="sim__panel">
        <path d="M150 196 L150 214 M210 196 L210 214" className="sim__stand" />
        <polygon points="128,128 236,128 256,196 108,196" className="sim__pv" />
        {cells.map(([c, r]) => {
          const t0 = c / 4;
          const t1 = (c + 1) / 4;
          const y0 = 128 + r * 34;
          const y1 = y0 + 34;
          const x = (t, y) => 128 - ((y - 128) / 68) * 20 + t * (108 + ((y - 128) / 68) * 40);
          return (
            <polygon
              key={`${c}${r}`}
              className="sim__cell"
              points={`${x(t0, y0)},${y0} ${x(t1, y0)},${y0} ${x(t1, y1)},${y1} ${x(t0, y1)},${y1}`}
            />
          );
        })}
        <text x="182" y="232" className="sim__label">
          Solar panels
        </text>
      </g>

      {/* inverter */}
      <g className="sim__inverter">
        <rect x="290" y="210" width="80" height="72" rx="12" />
        <path d="M306 250 q 8 -14 16 0 t 16 0 t 16 0" className="sim__wave" />
        <circle cx="354" cy="226" r="5" className={flows.solar || flows.discharge ? 'sim__led is-on' : 'sim__led'} />
        <text x="330" y="304" className="sim__label">
          Inverter
        </text>
      </g>

      {/* grid */}
      {s.hasGrid && (
        <g className={`sim__grid${s.gridUp ? '' : ' is-down'}`}>
          <path d="M540 70 V214 M512 92 H568 M518 118 H562 M540 214 L528 226 M540 214 L552 226" className="sim__pole" />
          <path d="M512 92 Q 470 110 430 92 M568 92 Q 600 106 640 96" className="sim__wire" />
          {!s.gridUp && (
            <g transform="translate(572 152)">
              <circle r="15" className="sim__down" />
              <path d="M-6 -6 L6 6 M6 -6 L-6 6" className="sim__down-x" />
            </g>
          )}
          <text x="540" y="56" className="sim__label">
            Grid
          </text>
        </g>
      )}

      {/* home */}
      <g className={`sim__home${s.homeOn && load ? ' is-on' : ''}`}>
        <polygon points="440,320 520,268 600,320" className="sim__roof" />
        <rect x="452" y="318" width="136" height="82" className="sim__wall" />
        <rect x="468" y="336" width="30" height="24" rx="3" className="sim__window" />
        <rect x="542" y="336" width="30" height="24" rx="3" className="sim__window" />
        <rect x="505" y="356" width="28" height="44" rx="3" className="sim__door" />
        <text x="520" y="428" className="sim__label">
          Home
        </text>
      </g>

      {/* battery */}
      {s.hasBattery && (
        <g className="sim__battery">
          <rect x="120" y="332" width="92" height="44" rx="9" className="sim__batt-body" />
          <rect x="212" y="345" width="7" height="18" rx="2" className="sim__batt-tip" />
          <rect x="126" y="338" width={Math.max(0, (80 * battery) / 100)} height="32" rx="5" className="sim__batt-fill" />
          <text x="166" y="359" className="sim__batt-text">
            {battery}%
          </text>
          <text x="166" y="400" className="sim__label">
            Battery
          </text>
        </g>
      )}
    </svg>
  );
}

export default function Simulator({ id }) {
  const { simulator } = site;
  const [mode, setMode] = useState(simulator.modes[0].id);
  const [scenario, setScenario] = useState('day');
  const [battery, setBattery] = useState(60);
  const [load, setLoad] = useState(true);
  const uid = useId();
  const s = simulate({ mode, scenario, battery, load });
  const StatusIcon = STATUS_ICON[s.tone] ?? Sun;
  const activeMode = simulator.modes.find((m) => m.id === mode);

  return (
    <section id={id} className="section" aria-labelledby={`${id}-title`}>
      <div className="container">
        <SectionHeader id={`${id}-title`} eyebrow={simulator.eyebrow} title={simulator.title} subtitle={simulator.subtitle} />

        <Reveal className="sim card">
          <div className="sim__stage">
            <Diagram s={s} battery={battery} load={load} />
          </div>

          <div className="sim__controls">
            <div className="field">
              <span className="label" id={`${uid}-mode`}>
                System type
              </span>
              <div className="segmented" role="radiogroup" aria-labelledby={`${uid}-mode`}>
                {simulator.modes.map((m) => (
                  <button key={m.id} type="button" role="radio" aria-checked={m.id === mode} onClick={() => setMode(m.id)}>
                    {m.label}
                  </button>
                ))}
              </div>
              <p className="sim__mode-text">{activeMode?.text}</p>
            </div>

            <div className="field">
              <span className="label" id={`${uid}-scenario`}>
                Situation
              </span>
              <div className="sim__scenarios" role="radiogroup" aria-labelledby={`${uid}-scenario`}>
                {SCENARIOS.map(({ id: sid, label, Icon }) => (
                  <button key={sid} type="button" role="radio" aria-checked={scenario === sid} onClick={() => setScenario(sid)}>
                    <Icon aria-hidden="true" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <label className="sim__switch">
              <span>Home appliances running</span>
              <input type="checkbox" role="switch" checked={load} onChange={(e) => setLoad(e.target.checked)} />
              <span className="sim__switch-ui" aria-hidden="true" />
            </label>

            {s.hasBattery && (
              <div className="field">
                <label htmlFor={`${uid}-batt`}>
                  Battery charge <strong>{battery}%</strong>
                </label>
                <input
                  id={`${uid}-batt`}
                  className="range"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={battery}
                  style={{ '--fill': `${battery}%` }}
                  onChange={(e) => setBattery(Number(e.target.value))}
                />
              </div>
            )}

            <div className={`sim__status sim__status--${s.tone}`} role="status" aria-live="polite">
              <StatusIcon aria-hidden="true" />
              <p>{s.status}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
