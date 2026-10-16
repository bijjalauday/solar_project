/**
 * Decides which way energy flows for the "How solar works" simulator.
 * mode: 'ongrid' | 'hybrid' | 'offgrid'; scenario: 'day' | 'night' | 'powercut'
 */
export function simulate({ mode, scenario, battery, load }) {
  const sunUp = scenario !== 'night';
  const hasGrid = mode !== 'offgrid';
  const hasBattery = mode !== 'ongrid';
  const gridUp = hasGrid && scenario !== 'powercut';
  const flows = { solar: false, toHome: false, export: false, import: false, charge: false, discharge: false };
  let homeOn = false;
  let tone;
  let status;

  if (mode === 'ongrid' && !gridUp) {
    tone = 'warn';
    status =
      'Power cut: on-grid inverters switch off for safety (anti-islanding), so the home has no power even in sunlight. Choose a hybrid system for backup.';
  } else if (sunUp) {
    flows.solar = true;
    if (load) {
      flows.toHome = true;
      homeOn = true;
    }
    if (hasBattery && battery < 100) flows.charge = true;
    else if (gridUp) flows.export = true;

    const parts = [load ? 'Solar is powering your home' : 'Appliances are off'];
    if (flows.charge) parts.push('charging the battery');
    else if (flows.export) parts.push('extra units are exported to the grid for net-metering credit');
    else if (hasBattery) parts.push('the battery is full');
    status = parts.join(load ? ' and ' : ', ') + '.';
    if (scenario === 'powercut')
      status = `${hasGrid ? 'Power cut? No problem.' : 'Power cuts don’t affect off-grid homes.'} ${status}`;
    tone = 'solar';
  } else if (!load) {
    tone = 'idle';
    status = 'Night time with appliances off, so nothing is being drawn.';
  } else if (hasBattery && battery > 0) {
    flows.discharge = true;
    flows.toHome = true;
    homeOn = true;
    tone = 'battery';
    status = `Night: the battery is powering your home${gridUp ? ', with the grid as backup.' : '.'}`;
  } else if (gridUp) {
    flows.import = true;
    homeOn = true;
    tone = 'grid';
    status =
      mode === 'ongrid'
        ? 'Night: your home draws from the grid, offset by the units you exported during the day.'
        : 'Battery is empty, so the home runs on grid power.';
  } else {
    tone = 'warn';
    status = 'Battery is empty and there is no grid, so the home has no power.';
  }

  return { sunUp, hasGrid, hasBattery, gridUp, flows, homeOn, tone, status };
}
