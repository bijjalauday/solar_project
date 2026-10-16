import {
  Award,
  BadgeIndianRupee,
  Battery,
  Building2,
  Calculator,
  CalendarCheck,
  ChartLine,
  CircleCheck,
  ClipboardCheck,
  Factory,
  FileCheck,
  HardHat,
  Headset,
  House,
  Landmark,
  Leaf,
  Ruler,
  ShieldCheck,
  Smartphone,
  Sprout,
  Sun,
  Tractor,
  Wallet,
  Wrench,
  Zap,
} from 'lucide-react';

// Icons that site.json can refer to by name (kebab-case, as on lucide.dev).
// To use another lucide icon in the JSON, import it above and add it here.
const ICONS = {
  award: Award,
  'badge-indian-rupee': BadgeIndianRupee,
  battery: Battery,
  'building-2': Building2,
  calculator: Calculator,
  'calendar-check': CalendarCheck,
  'chart-line': ChartLine,
  'circle-check': CircleCheck,
  'clipboard-check': ClipboardCheck,
  factory: Factory,
  'file-check': FileCheck,
  'hard-hat': HardHat,
  headset: Headset,
  house: House,
  landmark: Landmark,
  leaf: Leaf,
  ruler: Ruler,
  'shield-check': ShieldCheck,
  smartphone: Smartphone,
  sprout: Sprout,
  sun: Sun,
  tractor: Tractor,
  wallet: Wallet,
  wrench: Wrench,
  zap: Zap,
};

export default function Icon({ name, ...props }) {
  const Component = ICONS[name] ?? Sun;
  return <Component aria-hidden="true" {...props} />;
}
