/* Einkommenssteuer Rechner (vereinfachte Modellierung für 2024) */
// Hinweise:
// - Stark vereinfachte Umsetzung des progressiven Tarifs (§32a EStG) für Grundtarif.
// - Kinderfreibetrag und Werbungskosten / Sonderausgaben / außergewöhnliche Belastungen werden direkt abgezogen (vereinfachte Annahme).
// - Solidaritätszuschlag-Freigrenze berücksichtigt.
// - Keine Gewähr für Richtigkeit – pädagogisches Tool.

const YEAR = 2024;

// Parameter (vereinfachte Eckwerte 2024 Grundtarif)
const TARIFF_2024 = {
  basicAllowance: 11604, // Grundfreibetrag
  zone2Start: 11605,
  zone3Start: 66867,
  zone4Start: 277825,
  zone5Start: 0, // n/a hier
};

// Kinderfreibetrag (beide Elternteile zusammen) 2024: 9.408 € je Kind (Kinderfreibetrag+BEA). Für Einzelveranlagung wäre Hälfte – vereinfachung volle Anrechnung.
const CHILD_ALLOWANCE = 9408;
// Werbungskostenpauschale 2024
const WK_PAUSCHALE = 1230;

// Entfernungspauschale: 0,30 € für die ersten 20 km, 0,38 € ab 21. km (einfach) pro Arbeitstag.
function calcEntfernungspauschale(km, days) {
  if (km <= 0 || days <= 0) return 0;
  const first = Math.min(km, 20) * 0.30;
  const rest = km > 20 ? (km - 20) * 0.38 : 0;
  return (first + rest) * days;
}

// Einkommensteuer Grundtarif 2024 nach §32a, vereinfachte Implementierung
function calcIncomeTax(taxable) {
  const z = taxable;
  const { basicAllowance, zone2Start, zone3Start, zone4Start } = TARIFF_2024;
  if (z <= basicAllowance) return 0;
  // Formeln gemäß veröffentlichten Werten (vereinfachte Nachbildung 2024; Parameter können abweichen, illustrative Annäherung)
  // Quelle (vereinfacht, kein amtlicher Rechenweg): BMF Werte adaptiert.
  if (z <= 11604) {
    return 0;
  } else if (z <= 27726) { // Zone 2
    const y = (z - 11604) / 10000;
    return (922.98 * y + 1400) * y;
  } else if (z <= 66748) { // Zone 3
    const y = (z - 27725) / 10000;
    return (181.18 * y + 2397) * y + 1025.38;
  } else if (z <= 277825) { // Zone 4
    return 0.42 * z - 10602.13;
  } else { // Zone 5
    return 0.45 * z - 18836.03;
  }
}

function calcSolidaritySurcharge(incomeTax) {
  // Vereinfachte Freigrenze: bis ca. 17.543 € ESt (2024) kein Soli; Milderungszone nicht voll implementiert – linearer Übergang.
  const free = 17543;
  if (incomeTax <= free) return 0;
  const fullRate = 0.055;
  // Linear approximation of phase-in until e.g. 31k tax
  const capStart = free;
  const capEnd = 31000;
  if (incomeTax >= capEnd) return incomeTax * fullRate;
  const factor = (incomeTax - capStart) / (capEnd - capStart);
  return incomeTax * fullRate * factor;
}

function calcChurchTax(incomeTax, ratePercent) {
  if (!ratePercent) return 0;
  return incomeTax * (ratePercent / 100);
}

function formatEuro(value) {
  return value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 });
}

function clampNumber(v, min, max) {
  if (isNaN(v)) return min;
  return Math.min(Math.max(v, min), max);
}

function getInputs() {
  const grossIncome = Number(document.getElementById('grossIncome').value);
  const taxClass = document.getElementById('taxClass').value; // informational
  const children = Number(document.getElementById('children').value) || 0;
  const distance = Number(document.getElementById('distance').value) || 0;
  const workdays = Number(document.getElementById('workdays').value) || 0;
  const churchTax = Number((document.querySelector('input[name="churchTax"]:checked') || {}).value || 0);
  const werbungskostenUser = document.getElementById('werbungskosten').value;
  const sonderausgaben = Number(document.getElementById('sonderausgaben').value) || 0;
  const ausser = Number(document.getElementById('aussergewoehnlich').value) || 0;

  return {
    grossIncome,
    taxClass,
    children,
    distance,
    workdays,
    churchTax,
    werbungskostenUser: werbungskostenUser === '' ? null : Number(werbungskostenUser),
    sonderausgaben,
    ausser,
  };
}

function validateInputs(values) {
  const errors = {};
  if (values.grossIncome < 0) errors.grossIncome = 'Darf nicht negativ sein';
  if (values.distance < 0) errors.distance = 'Darf nicht negativ sein';
  if (values.workdays < 0 || values.workdays > 260) errors.workdays = '0–260';
  if (values.children < 0 || values.children > 12) errors.children = '0–12';
  if (values.sonderausgaben < 0) errors.sonderausgaben = '>= 0';
  if (values.ausser < 0) errors.aussergewoehnlich = '>= 0';
  if (values.werbungskostenUser !== null && values.werbungskostenUser < 0) errors.werbungskosten = '>= 0';
  return errors;
}

function applyErrors(errors) {
  const map = ['grossIncome','children','distance','workdays','werbungskosten','sonderausgaben','aussergewoehnlich'];
  map.forEach(id => {
    const el = document.getElementById(id);
    const err = document.getElementById(id + 'Error');
    if (!el || !err) return;
    const key = id; // errors keys align with id names now
    if (errors[key]) {
      err.textContent = errors[key];
      el.setAttribute('aria-invalid', 'true');
    } else {
      err.textContent = '';
      el.removeAttribute('aria-invalid');
    }
  });
}

function compute() {
  const inputs = getInputs();
  const errors = validateInputs(inputs);
  applyErrors(errors);
  if (Object.keys(errors).length) return null;

  const entfern = calcEntfernungspauschale(inputs.distance, inputs.workdays);
  const werbungskosten = inputs.werbungskostenUser === null ? Math.max(WK_PAUSCHALE, entfern) : Math.max(inputs.werbungskostenUser, entfern, WK_PAUSCHALE);
  const kinderFreib = inputs.children * CHILD_ALLOWANCE;
  const sonder = inputs.sonderausgaben;
  const ausser = inputs.ausser;

  // Vereinfachte Summe abzugsfähiger Kosten
  const totalAbzuege = werbungskosten + kinderFreib + sonder + ausser;
  const zvE = Math.max(0, inputs.grossIncome - totalAbzuege);

  const est = calcIncomeTax(zvE);
  const soli = calcSolidaritySurcharge(est);
  const kirche = calcChurchTax(est, inputs.churchTax);

  const totalTax = est + soli + kirche;
  const netIncome = inputs.grossIncome - totalTax; // Abzüge nur steuerlich, hier vereinfachte Darstellung
  const effectiveRate = inputs.grossIncome > 0 ? totalTax / inputs.grossIncome : 0;

  return {
    inputs,
    entfern,
    werbungskosten,
    kinderFreib,
    sonder,
    ausser,
    totalAbzuege,
    zvE,
    est,
    soli,
    kirche,
    totalTax,
    netIncome,
    effectiveRate,
  };
}

function renderResults(r) {
  const container = document.getElementById('results');
  if (!r) { container.innerHTML = '<p>Eingaben prüfen.</p>'; return; }
  container.innerHTML = `
    <div class="summary-grid">
      <div class="row"><span>Brutto</span><span>${formatEuro(r.inputs.grossIncome)}</span></div>
      <div class="row"><span>Werbungskosten</span><span>− ${formatEuro(r.werbungskosten)}</span></div>
      <div class="row"><span>Kinderfreibeträge</span><span>− ${formatEuro(r.kinderFreib)}</span></div>
      <div class="row"><span>Sonderausgaben</span><span>− ${formatEuro(r.sonder)}</span></div>
      <div class="row"><span>Außergew. Belastungen</span><span>− ${formatEuro(r.ausser)}</span></div>
      <div class="row total"><span>Zu versteuerndes Einkommen</span><span>${formatEuro(r.zvE)}</span></div>
      <div class="row tax"><span>Einkommensteuer</span><span>${formatEuro(r.est)}</span></div>
      <div class="row tax"><span>Solidaritätszuschlag</span><span>${formatEuro(r.soli)}</span></div>
      <div class="row tax"><span>Kirchensteuer</span><span>${formatEuro(r.kirche)}</span></div>
      <div class="row total"><span>Gesamtsteuerlast</span><span>${formatEuro(r.totalTax)}</span></div>
      <div class="row net"><span>Netto (vereinfacht)</span><span>${formatEuro(r.netIncome)}</span></div>
      <div class="row effective"><span>Effektiver Steuersatz</span><span>${(r.effectiveRate*100).toFixed(2)} %</span></div>
    </div>
  `;
  drawChart(r);
}

// Simple chart without external libs
function drawChart(r) {
  const canvas = document.getElementById('chart');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  if (!r) return;
  const items = [
    { label: 'ESt', value: r.est, color: '#e3b341' },
    { label: 'Soli', value: r.soli, color: '#ffa657' },
    { label: 'Kirche', value: r.kirche, color: '#d29922' },
    { label: 'Netto', value: r.netIncome, color: '#3fb950' },
  ];
  const total = items.reduce((s,i)=>s+i.value,0);
  const cx = canvas.width/2;
  const cy = canvas.height/2;
  const radius = Math.min(canvas.width, canvas.height) / 2 - 20;
  let start = -Math.PI/2;
  ctx.font = '12px system-ui';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  items.forEach(it => {
    const angle = (it.value / total) * Math.PI*2;
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.fillStyle = it.color;
    ctx.arc(cx,cy,radius,start,start+angle);
    ctx.closePath();
    ctx.fill();
    // label
    const mid = start + angle/2;
    const lx = cx + Math.cos(mid)*radius*0.6;
    const ly = cy + Math.sin(mid)*radius*0.6;
    const percent = total ? (it.value/total*100).toFixed(1) : '0.0';
    ctx.fillStyle = '#fff';
    ctx.fillText(it.label+"\n"+percent+'%', lx, ly);
    start += angle;
  });

  // Legend
  const legendX = 10; let legendY = 10;
  items.forEach(it => {
    ctx.fillStyle = it.color; ctx.fillRect(legendX, legendY, 14,14);
    ctx.fillStyle = '#fff'; ctx.textAlign='left'; ctx.fillText(`${it.label}: ${formatEuro(it.value)}`, legendX+20, legendY+9);
    legendY += 18;
  });
}

function exportCSV(r) {
  if (!r) return;
  const lines = [
    'Feld;Wert',
    `Brutto;${r.inputs.grossIncome}`,
    `Werbungskosten;${r.werbungskosten}`,
    `Kinderfreibetrag;${r.kinderFreib}`,
    `Sonderausgaben;${r.sonder}`,
    `Aussergewoehnliche Belastungen;${r.ausser}`,
    `Zu versteuerndes Einkommen;${r.zvE}`,
    `Einkommensteuer;${r.est}`,
    `Solidaritaetszuschlag;${r.soli}`,
    `Kirchensteuer;${r.kirche}`,
    `Gesamtsteuerlast;${r.totalTax}`,
    `Netto;${r.netIncome}`,
    `Effektiver Steuersatz (%);${(r.effectiveRate*100).toFixed(2)}`,
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'steuer_ergebnis.csv';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function printPDF() {
  window.print();
}

// Tooltips
function setupTooltips() {
  const template = document.getElementById('tooltipTemplate');
  if (!template) return;
  const tooltipEl = template.content.firstElementChild.cloneNode(true);
  document.body.appendChild(tooltipEl);
  let currentBtn = null;
  function show(btn) {
    tooltipEl.textContent = btn.getAttribute('data-tooltip');
    const rect = btn.getBoundingClientRect();
    tooltipEl.style.left = rect.left + window.scrollX + 'px';
    tooltipEl.style.top = rect.bottom + window.scrollY + 6 + 'px';
    tooltipEl.classList.add('visible');
  }
  function hide() { tooltipEl.classList.remove('visible'); }
  document.addEventListener('focusin', e => {
    if (e.target.matches('button.info')) { currentBtn = e.target; show(currentBtn); }
  });
  document.addEventListener('focusout', e => {
    if (e.target === currentBtn) hide();
  });
  document.addEventListener('mouseover', e => {
    if (e.target.matches('button.info')) { show(e.target); }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.matches('button.info')) hide();
  });
}

function init() {
  document.getElementById('taxYear').textContent = YEAR;
  document.getElementById('taxYearLabel').textContent = YEAR;
  document.getElementById('lastUpdated').textContent = new Date().toLocaleDateString('de-DE');
  setupTooltips();

  const form = document.getElementById('taxForm');
  const calcBtn = document.getElementById('calculateBtn');
  let lastResult = null;
  calcBtn.addEventListener('click', () => {
    const r = compute();
    lastResult = r;
    renderResults(r);
  });

  form.addEventListener('input', (e) => {
    // live validation for non heavy fields
    if (e.target.id === 'grossIncome') {
      const r = compute();
      lastResult = r;
      renderResults(r);
    }
  });

  document.getElementById('resetBtn').addEventListener('click', () => {
    setTimeout(() => { document.getElementById('results').innerHTML = '<p>Noch keine Berechnung.</p>'; drawChart(null); }, 0);
  });

  document.getElementById('exportCsvBtn').addEventListener('click', () => exportCSV(lastResult));
  document.getElementById('printBtn').addEventListener('click', printPDF);
}

document.addEventListener('DOMContentLoaded', init);
