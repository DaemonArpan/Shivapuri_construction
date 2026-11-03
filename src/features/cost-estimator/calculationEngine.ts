export type AreaUnit = 'sqft' | 'sqm';
export const SQM_TO_SQFT = 10.7639104167;
export const CFT_TO_CUM = 0.0283168466;
export const CUM_TO_CFT = 35.3147;
export const NPR_RATE_LOW = 3500;
export const NPR_RATE_HIGH = 4600;

function nonNegative(value: number, label: string): number {
  if (!Number.isFinite(value) || value < 0) throw new RangeError(`${label} must be a non-negative number.`);
  return value;
}

/** Converts the entered floor area to square feet. */
export function toSquareFeet(area: number, unit: AreaUnit): number {
  nonNegative(area, 'Area');
  return unit === 'sqm' ? area * SQM_TO_SQFT : area;
}

export function formatNpr(value: number): string {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value);
}

export function calculatePlinthEstimate(areaSqft: number, ratePerSqft: number): number {
  nonNegative(areaSqft, 'Area');
  nonNegative(ratePerSqft, 'Rate');
  return areaSqft * ratePerSqft;
}

export function calculateExcavationVolume(count: number, lengthM: number, widthM: number, depthM: number): number {
  return nonNegative(count, 'Excavation count') * nonNegative(lengthM, 'Excavation length') * nonNegative(widthM, 'Excavation width') * nonNegative(depthM, 'Excavation depth');
}

export function calculateColumnVolume(count: number, widthM: number, depthM: number, heightM: number): number {
  return nonNegative(count, 'Column count') * nonNegative(widthM, 'Column width') * nonNegative(depthM, 'Column depth') * nonNegative(heightM, 'Column height');
}

export function calculateBeamVolume(totalLengthM: number, widthM: number, depthM: number): number {
  return nonNegative(totalLengthM, 'Beam length') * nonNegative(widthM, 'Beam width') * nonNegative(depthM, 'Beam depth');
}

export function calculateSlabVolume(areaSqft: number, thicknessMm: number): number {
  nonNegative(areaSqft, 'Slab area');
  nonNegative(thicknessMm, 'Slab thickness');
  return areaSqft * 0.092903 * thicknessMm / 1000;
}

/** Nominal concrete quantity illustration; use an approved mix design for structural RCC. */
export function calculateNominalConcreteMix(wetVolumeM3: number, sandParts = 1.5, aggregateParts = 3) {
  nonNegative(wetVolumeM3, 'Concrete volume');
  if (!Number.isFinite(sandParts) || sandParts < 0 || !Number.isFinite(aggregateParts) || aggregateParts < 0) {
    throw new RangeError('Mix proportions must be non-negative numbers.');
  }
  const dryVolumeM3 = wetVolumeM3 * 1.54;
  const totalParts = 1 + sandParts + aggregateParts;
  const cementM3 = dryVolumeM3 / totalParts;
  return {
    dryVolumeM3,
    cementM3,
    cementBags: cementM3 / 0.0347,
    sandM3: dryVolumeM3 * sandParts / totalParts,
    aggregateM3: dryVolumeM3 * aggregateParts / totalParts,
  };
}

export function calculateSteelWeightKg(lengthM: number, diameterMm: number): number {
  nonNegative(lengthM, 'Bar length');
  if (!Number.isFinite(diameterMm) || diameterMm <= 0) throw new RangeError('Bar diameter must be greater than zero.');
  return lengthM * diameterMm ** 2 / 162;
}

export function calculateBrickCount(masonryVolumeM3: number): number {
  return nonNegative(masonryVolumeM3, 'Masonry volume') * 500;
}

export function calculatePaintLitres(areaSqft: number, coats: number, coverageSqftPerLitre: number): number {
  nonNegative(areaSqft, 'Paintable area');
  if (!Number.isInteger(coats) || coats < 1) throw new RangeError('Coats must be a positive whole number.');
  if (!Number.isFinite(coverageSqftPerLitre) || coverageSqftPerLitre <= 0) throw new RangeError('Coverage must be greater than zero.');
  return areaSqft * coats / coverageSqftPerLitre;
}

export function calculateBoqAmount(quantity: number, unitRate: number): number {
  nonNegative(quantity, 'Quantity');
  nonNegative(unitRate, 'Unit rate');
  return quantity * unitRate;
}
