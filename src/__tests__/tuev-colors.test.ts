import { describe, it, expect } from 'vitest';
import { getTuevColor, getMonthRotationDeg } from '../data/tuev-colors';

describe('TÜV / HU Inspection Plakette System', () => {
  it('follows the official 6-year cyclical rotation', () => {
    expect(getTuevColor(2024).colorName).toContain('Green');
    expect(getTuevColor(2025).colorName).toContain('Orange');
    expect(getTuevColor(2026).colorName).toContain('Blue');
    expect(getTuevColor(2027).colorName).toContain('Yellow');
    expect(getTuevColor(2028).colorName).toContain('Brown');
    expect(getTuevColor(2029).colorName).toContain('Pink');
    // Cycle repeats
    expect(getTuevColor(2030).colorName).toContain('Green');
    expect(getTuevColor(2031).colorName).toContain('Orange');
  });

  it('calculates proper rotation angles so the due month sits at 12 o’clock', () => {
    // Month 12: 0 degrees
    expect(getMonthRotationDeg(12)).toBe(0);
    // Month 6: (6 - 12) * 30 = -180 degrees
    expect(getMonthRotationDeg(6)).toBe(-180);
  });
});
