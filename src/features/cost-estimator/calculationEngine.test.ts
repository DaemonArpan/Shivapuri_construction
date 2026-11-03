import { describe, expect, it } from 'vitest';
import { calculateBeamVolume, calculateBoqAmount, calculateBrickCount, calculateColumnVolume, calculateExcavationVolume, calculateNominalConcreteMix, calculatePaintLitres, calculatePlinthEstimate, calculateSlabVolume, calculateSteelWeightKg, toSquareFeet } from './calculationEngine';

describe('toSquareFeet', () => {
  it('keeps square feet unchanged', () => expect(toSquareFeet(1200, 'sqft')).toBe(1200));
  it('converts square metres to square feet', () => expect(toSquareFeet(100, 'sqm')).toBeCloseTo(1076.391, 2));
  it('rejects negative area', () => expect(() => toSquareFeet(-1, 'sqft')).toThrow(RangeError));
  it('calculates the illustrative plinth rate range', () => expect(calculatePlinthEstimate(1000, 3500)).toBe(3500000));
  it('calculates excavation, column, beam and slab quantities', () => {
    expect(calculateExcavationVolume(10, 1.5, 1.5, 1.5)).toBeCloseTo(33.75, 6);
    expect(calculateColumnVolume(4, 0.3, 0.3, 3)).toBeCloseTo(1.08, 6);
    expect(calculateBeamVolume(20, 0.25, 0.4)).toBeCloseTo(2, 6);
    expect(calculateSlabVolume(1000, 125)).toBeCloseTo(11.613, 3);
  });
  it('calculates nominal 1:1.5:3 concrete materials from wet volume', () => {
    const mix = calculateNominalConcreteMix(10);
    expect(mix.dryVolumeM3).toBeCloseTo(15.4, 6);
    expect(mix.cementBags).toBeCloseTo(80.69, 1);
    expect(mix.sandM3).toBeCloseTo(4.2, 6);
    expect(mix.aggregateM3).toBeCloseTo(8.4, 6);
  });
  it('uses the standard bar unit-weight equation', () => expect(calculateSteelWeightKg(10, 12)).toBeCloseTo(8.8889, 3));
  it('calculates approximate brick count and paint litres', () => {
    expect(calculateBrickCount(30)).toBe(15000);
    expect(calculatePaintLitres(3000, 2, 100)).toBe(60);
  });
  it('calculates BOQ row amount from quantity and rate', () => expect(calculateBoqAmount(2.5, 15000)).toBe(37500));
});
