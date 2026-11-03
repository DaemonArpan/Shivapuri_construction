import { useMemo, useState } from 'react';
import { Download, Printer, RotateCcw, MessageCircle, Plus, Trash2 } from 'lucide-react';
import { calculateBeamVolume, calculateBoqAmount, calculateBrickCount, calculateColumnVolume, calculateExcavationVolume, calculateNominalConcreteMix, calculatePaintLitres, calculatePlinthEstimate, calculateSlabVolume, calculateSteelWeightKg, NPR_RATE_HIGH, NPR_RATE_LOW, toSquareFeet, type AreaUnit } from './calculationEngine';

type BoqRow = { id: number; item: string; quantity: string; unit: string; rate: string };
const steelDiameters = [8, 10, 12, 16, 20, 25];
const currency = (amount: number) => `NPR ${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount)}`;
const safeNumber = (value: string) => { const number = Number(value); return Number.isFinite(number) && number > 0 ? number : 0; };

export function CostEstimator() {
  const [location, setLocation] = useState('Kathmandu');
  const [kind, setKind] = useState('Residential');
  const [floors, setFloors] = useState('1');
  const [floorArea, setFloorArea] = useState(1000);
  const [unit, setUnit] = useState<AreaUnit>('sqft');
  const [finish, setFinish] = useState('Standard');
  const [structure, setStructure] = useState('RCC frame');
  const [concrete, setConcrete] = useState('');
  const [masonry, setMasonry] = useState('');
  const [paintArea, setPaintArea] = useState('');
  const [paintCoats, setPaintCoats] = useState(2);
  const [paintCoverage, setPaintCoverage] = useState(100);
  const [barLengths, setBarLengths] = useState<Record<number, string>>({});
  const [dimensions, setDimensions] = useState<Record<string, string>>({});
  const [rows, setRows] = useState<BoqRow[]>([]);
  const [nextRow, setNextRow] = useState(1);

  const floorCount = Math.min(60, Math.max(1, Math.floor(Number(floors) || 1)));
  const sqftPerFloor = useMemo(() => floorArea > 0 ? toSquareFeet(floorArea, unit) : 0, [floorArea, unit]);
  const totalAreaSqft = sqftPerFloor * floorCount;
  const lowTotal = calculatePlinthEstimate(totalAreaSqft, NPR_RATE_LOW);
  const highTotal = calculatePlinthEstimate(totalAreaSqft, NPR_RATE_HIGH);
  const lowPerFloor = calculatePlinthEstimate(sqftPerFloor, NPR_RATE_LOW);
  const highPerFloor = calculatePlinthEstimate(sqftPerFloor, NPR_RATE_HIGH);
  const boqTotal = rows.reduce((sum, row) => sum + calculateBoqAmount(safeNumber(row.quantity.toString()), safeNumber(row.rate)), 0);
  const mix = concrete && Number(concrete) > 0 ? calculateNominalConcreteMix(Number(concrete)) : null;
  const steelWeight = Object.entries(barLengths).reduce((sum, [diameter, length]) => sum + (Number(length) > 0 ? calculateSteelWeightKg(Number(length), Number(diameter)) : 0), 0);
  const bricks = masonry && Number(masonry) > 0 ? calculateBrickCount(Number(masonry)) : 0;
  const paintLitres = paintArea && Number(paintArea) > 0 ? calculatePaintLitres(Number(paintArea), paintCoats, paintCoverage) : 0;
  const dim = (key: string) => safeNumber(dimensions[key] || '');
  const excavation = calculateExcavationVolume(dim('excCount'), dim('excLength'), dim('excWidth'), dim('excDepth'));
  const footing = calculateExcavationVolume(dim('footCount'), dim('footLength'), dim('footWidth'), dim('footThickness'));
  const columns = calculateColumnVolume(dim('columnCount'), dim('columnWidth'), dim('columnDepth'), dim('columnHeight'));
  const beams = calculateBeamVolume(dim('beamLength'), dim('beamWidth'), dim('beamDepth'));
  const slabs = calculateSlabVolume(totalAreaSqft, dim('slabThickness'));
  const totalRcc = footing + columns + beams + slabs;
  const backfill = Math.max(0, excavation - dim('permanentVolume'));
  const soilDisposal = Math.max(0, excavation - dim('reusedSoil'));
  const whatsapp = `https://wa.me/9779851189079?text=${encodeURIComponent(`Hello Shivapuri Group, please review my preliminary estimate. Location: ${location}; type: ${kind}; floors: ${floorCount}; area per floor: ${floorArea} ${unit}; total built-up area: ${Math.round(totalAreaSqft).toLocaleString()} sq ft; finish: ${finish}; structure: ${structure}. Indicative plinth-area range: ${currency(lowTotal)}–${currency(highTotal)}. BOQ rows entered: ${rows.filter(row => row.item.trim()).length}.`)}`;

  const reset = () => {
    setLocation('Kathmandu'); setKind('Residential'); setFloors('1'); setFloorArea(1000); setUnit('sqft'); setFinish('Standard'); setStructure('RCC frame');
    setConcrete(''); setMasonry(''); setPaintArea(''); setPaintCoats(2); setPaintCoverage(100); setBarLengths({}); setDimensions({}); setRows([]); setNextRow(1);
  };
  const addRow = () => { setRows(current => [...current, { id: nextRow, item: '', quantity: '', unit: 'm³', rate: '' }]); setNextRow(n => n + 1); };
  const updateRow = (id: number, key: keyof Omit<BoqRow, 'id'>, value: string) => setRows(current => current.map(row => row.id === id ? { ...row, [key]: value } : row));
  const downloadReport = () => {
    const lines = [
      ['Shivapuri Group preliminary construction estimate'], ['Location', location], ['Building type', kind], ['Floors', floorCount], ['Area per floor', `${floorArea} ${unit}`], ['Total built-up area', `${Math.round(totalAreaSqft)} sq ft`],
      ['Indicative rate range', `NPR ${NPR_RATE_LOW}–${NPR_RATE_HIGH} per sq ft`], ['Plinth estimate low', lowTotal], ['Plinth estimate high', highTotal], ['Detailed BOQ direct subtotal', boqTotal], [], ['BOQ Item', 'Quantity', 'Unit', 'Rate (NPR)', 'Amount (NPR)'],
      ...rows.map(row => [row.item, row.quantity, row.unit, row.rate, calculateBoqAmount(safeNumber(row.quantity), safeNumber(row.rate))]), [], ['Measured structural quantities (m³)', `Excavation ${excavation}`, `Footings ${footing}`, `Columns ${columns}`, `Beams ${beams}`, `Slabs ${slabs}`, `RCC total ${totalRcc}`], ['Nominal concrete mix results', mix ? `Cement bags ${mix.cementBags.toFixed(1)}` : 'Not entered', mix ? `Sand m³ ${mix.sandM3.toFixed(2)}` : '', mix ? `Aggregate m³ ${mix.aggregateM3.toFixed(2)}` : ''], ['Steel weight (kg)', steelWeight.toFixed(1)], ['Approximate bricks', bricks.toFixed(0)], ['Paint (litres)', paintLitres.toFixed(1)], [], ['Materials are based only on the optional measured inputs and stated formulas.'], ['This is a preliminary estimate, not a measured or engineer-certified BOQ.'],
    ].map(row => row.map(value => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([lines], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'shivapuri-preliminary-estimate.csv'; link.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const measureInput = (key: string, label: string, unitLabel: string) => <label key={key}>{label}<input type="number" min="0" step={unitLabel === 'count' ? '1' : 'any'} value={dimensions[key] || ''} onChange={e => setDimensions(current => ({ ...current, [key]: unitLabel === 'count' ? String(Math.max(0,Math.floor(Number(e.target.value)||0))) : e.target.value }))} placeholder={unitLabel}/></label>;

  return <section className="estimator" id="estimator">
    <div className="estimator-heading"><span className="eyebrow">PRELIMINARY COST ESTIMATOR</span><h2>Start with a clearer estimate.</h2><p>Use the supplied illustrative Kathmandu plinth-area rate for a rough range, or enter measured quantities and rates for a direct BOQ subtotal.</p></div>
    <div className="estimator-grid">
      <div className="estimate-form">
        <label>Building location<input value={location} onChange={e => setLocation(e.target.value)} /></label>
        <label>Building type<select value={kind} onChange={e => setKind(e.target.value)}><option>Residential</option><option>Commercial</option><option>Hotel / resort</option><option>Apartment</option></select></label>
        <label>Number of floors<input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={2} value={floors} onChange={e => setFloors(e.target.value.replace(/\D/g, ''))} onBlur={() => setFloors(String(floorCount))} /></label>
        <label>Area per floor<div className="unit-input"><input type="number" min="1" value={floorArea} onChange={e => setFloorArea(Number(e.target.value))} /><select value={unit} onChange={e => setUnit(e.target.value as AreaUnit)}><option value="sqft">sq ft</option><option value="sqm">sq m</option></select></div></label>
        <label>Finishing level<select value={finish} onChange={e => setFinish(e.target.value)}><option>Standard</option><option>Premium</option><option>Luxury</option></select></label>
        <label>Structural type<select value={structure} onChange={e => setStructure(e.target.value)}><option>RCC frame</option><option>Other / to be advised</option></select></label>
        <p className="estimator-rate-note">Rate basis: NPR 3,500–4,600 per sq ft (illustrative range supplied for Kathmandu). Finish, structure and location do not change this range; obtain current project-specific rates before budgeting.</p>
        <div className="estimate-actions"><button className="button button-outline" type="button" onClick={reset}><RotateCcw size={15}/> Reset</button><button className="button button-dark" type="button" onClick={() => window.print()}><Printer size={15}/> Print report</button><button className="button button-outline" type="button" onClick={downloadReport}><Download size={15}/> Download CSV</button></div>
      </div>
      <div className="estimate-report">
        <span className="report-tag">YOUR PRELIMINARY ESTIMATE</span><h3>{currency(lowTotal)}–{currency(highTotal)}</h3>
        <div className="report-line"><span>Area per floor</span><strong>{Math.round(sqftPerFloor).toLocaleString()} sq ft</strong></div>
        <div className="report-line"><span>Total built-up area</span><strong>{Math.round(totalAreaSqft).toLocaleString()} sq ft</strong></div>
        <div className="report-line"><span>Indicative rate</span><strong>NPR 3,500–4,600 / sq ft</strong></div>
        <div className="report-line"><span>Estimated per floor</span><strong>{currency(lowPerFloor)}–{currency(highPerFloor)}</strong></div>
        <div className="report-line"><span>Measured BOQ direct subtotal</span><strong>{currency(boqTotal)}</strong></div>
        <div className="estimate-note"><strong>Budgetary allowance only</strong><p>The plinth-area range is illustrative, not a measured BOQ or quotation. Current local rates, site conditions, specifications, structural design, labor, taxes and exclusions affect actual costs. The BOQ subtotal includes only the line items and rates you enter.</p></div>
        <a className="button button-gold report-contact" href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={16}/> Ask Shivapuri Group to review</a>
      </div>
    </div>

    <section className="boq-editor"><div className="subsection-heading"><div><span className="eyebrow">DETAILED BOQ</span><h3>Quantity × unit rate</h3><p>Add measured drawing quantities and current quoted unit rates. Amounts recalculate as you type.</p></div><button className="button button-dark" type="button" onClick={addRow}><Plus size={15}/> Add BOQ item</button></div>
      {rows.length === 0 ? <div className="boq-empty">No measured BOQ rows yet. Add an item to calculate its quantity × rate amount. Examples: excavation (m³), concrete (m³), steel (kg), masonry (m³) or plaster (m²).</div> : <div className="boq-table-wrap"><table className="boq-table"><thead><tr><th>Item</th><th>Quantity</th><th>Unit</th><th>Unit rate (NPR)</th><th>Amount (NPR)</th><th></th></tr></thead><tbody>{rows.map(row => <tr key={row.id}><td><input aria-label="BOQ item" placeholder="e.g. RCC concrete" value={row.item} onChange={e => updateRow(row.id, 'item', e.target.value)} /></td><td><input aria-label="Quantity" type="number" min="0" step="any" value={row.quantity} onChange={e => updateRow(row.id, 'quantity', e.target.value)} /></td><td><input aria-label="Unit" value={row.unit} onChange={e => updateRow(row.id, 'unit', e.target.value)} /></td><td><input aria-label="Unit rate in NPR" type="number" min="0" step="any" value={row.rate} onChange={e => updateRow(row.id, 'rate', e.target.value)} /></td><td className="boq-amount">{currency(calculateBoqAmount(safeNumber(row.quantity), safeNumber(row.rate)))}</td><td><button type="button" className="row-remove" aria-label={`Remove ${row.item || 'BOQ'} row`} onClick={() => setRows(current => current.filter(item => item.id !== row.id))}><Trash2 size={15}/></button></td></tr>)}</tbody><tfoot><tr><td colSpan={4}>Direct BOQ subtotal</td><td colSpan={2}>{currency(boqTotal)}</td></tr></tfoot></table></div>}
    </section>

    <details className="quantity-tools"><summary>Optional measured quantities and material formulas</summary><p className="quantity-disclaimer">Enter quantities measured from drawings or schedules. These formulas do not infer a full building take-off from floor area.</p>
      <div className="quantity-grid">
        <div className="quantity-card structural-quantity"><h4>Structural and earthwork quantities</h4><p className="quantity-help">Dimensions in metres; use values from the drawings. Slab thickness is entered in millimetres.</p><div className="measure-group"><b>Excavation · count × L × B × D</b><div>{measureInput('excCount','Number of pits','count')}{measureInput('excLength','Length','m')}{measureInput('excWidth','Width','m')}{measureInput('excDepth','Depth','m')}</div><span>Excavation volume <strong>{excavation.toFixed(2)} m³</strong></span>{measureInput('permanentVolume','Permanent works within excavation','m³')}<span>Backfill = excavation − permanent works <strong>{backfill.toFixed(2)} m³</strong></span>{measureInput('reusedSoil','Excavated soil reused','m³')}<span>Disposal = excavation − reused soil <strong>{soilDisposal.toFixed(2)} m³</strong></span></div><div className="measure-group"><b>Footings · count × L × B × thickness</b><div>{measureInput('footCount','Number of footings','count')}{measureInput('footLength','Length','m')}{measureInput('footWidth','Width','m')}{measureInput('footThickness','Thickness','m')}</div><span>Footing concrete <strong>{footing.toFixed(2)} m³</strong></span></div><div className="measure-group"><b>Columns · count × b × d × H</b><div>{measureInput('columnCount','Number of columns','count')}{measureInput('columnWidth','Width','m')}{measureInput('columnDepth','Depth','m')}{measureInput('columnHeight','Height','m')}</div><span>Column concrete <strong>{columns.toFixed(2)} m³</strong></span></div><div className="measure-group"><b>Beams · total L × b × d</b><div>{measureInput('beamLength','Total beam length','m')}{measureInput('beamWidth','Width','m')}{measureInput('beamDepth','Depth','m')}</div><span>Beam concrete <strong>{beams.toFixed(2)} m³</strong></span></div><div className="measure-group"><b>Slabs · total floor area × thickness</b>{measureInput('slabThickness','Design slab thickness','mm')}<span>Slab concrete for {floorCount} floor(s) <strong>{slabs.toFixed(2)} m³</strong></span></div><div className="quantity-total">RCC concrete total <b>{totalRcc.toFixed(2)} m³</b></div><small>Beam-column intersections must not be double-counted. Slab thickness must come from the structural design.</small></div>
        <div className="quantity-card"><h4>Nominal concrete mix · 1:1.5:3</h4><label>Measured wet concrete volume<input type="number" min="0" step="any" value={concrete} onChange={e=>setConcrete(e.target.value)} placeholder="m³"/></label>{mix&&<div className="quantity-result"><span>Dry volume</span><b>{mix.dryVolumeM3.toFixed(2)} m³</b><span>Cement</span><b>{mix.cementBags.toFixed(1)} bags ({mix.cementM3.toFixed(2)} m³)</b><span>Sand</span><b>{mix.sandM3.toFixed(2)} m³</b><span>Coarse aggregate</span><b>{mix.aggregateM3.toFixed(2)} m³</b></div>}<small>Dry volume = wet volume × 1.54. Approximate nominal mix illustration only; do not use it instead of the specified structural mix design.</small></div>
        <div className="quantity-card"><h4>Reinforcement steel</h4><p className="quantity-help">Enter total measured bar lengths from the approved bar-bending schedule.</p>{steelDiameters.map(d=><label key={d}>{d} mm bar length (m)<input type="number" min="0" step="any" value={barLengths[d] || ''} onChange={e=>setBarLengths(current=>({...current,[d]:e.target.value}))} placeholder="Optional"/></label>)}<div className="quantity-total">Calculated theoretical weight <b>{steelWeight.toFixed(1)} kg</b></div><small>Weight = length × diameter² ÷ 162. Laps, bends, hooks and wastage must follow the approved schedule.</small></div>
        <div className="quantity-card"><h4>Brick masonry</h4><label>Net masonry volume<input type="number" min="0" step="any" value={masonry} onChange={e=>setMasonry(e.target.value)} placeholder="m³"/></label>{masonry&&Number(masonry)>0&&<div className="quantity-total">Approximate bricks <b>{Math.round(bricks).toLocaleString()}</b></div>}<small>Approx. bricks = net wall volume × 500. Confirm actual brick size and local specification.</small></div>
        <div className="quantity-card"><h4>Paint</h4><label>Paintable area<input type="number" min="0" step="any" value={paintArea} onChange={e=>setPaintArea(e.target.value)} placeholder="sq ft"/></label><label>Number of coats<input type="number" min="1" step="1" value={paintCoats} onChange={e=>setPaintCoats(Math.max(1,Math.floor(Number(e.target.value)||1)))}/></label><label>Coverage per litre<input type="number" min="0.1" step="any" value={paintCoverage} onChange={e=>setPaintCoverage(Math.max(.1,Number(e.target.value)||100))}/>sq ft / litre / coat</label>{paintArea&&<div className="quantity-total">Paint quantity <b>{paintLitres.toFixed(1)} litres</b></div>}<small>Area × coats ÷ product coverage. The 100 sq ft coverage is the supplied example; check the selected paint product.</small></div>
      </div>
    </details>
    <p className="estimator-footnote">A professional estimate should use architectural and structural drawings, a measured BOQ and current Kathmandu supplier and labor rates. Overheads, contingency, contractor profit and applicable taxes are not automatically added, to avoid double counting.</p>
  </section>;
}
