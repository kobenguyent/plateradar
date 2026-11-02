import { describe, it, expect } from 'vitest';
import { GERMAN_DISTRICTS } from '../data/districts-de';
import { findGermanDistrict } from '../core/parser-de';

describe('German Districts Dataset', () => {
  it('contains over 400 districts across all 16 federal states', () => {
    expect(GERMAN_DISTRICTS.length).toBeGreaterThan(400);
  });

  it('correctly maps major German cities', () => {
    expect(findGermanDistrict('B')?.name).toBe('Berlin');
    expect(findGermanDistrict('M')?.name).toBe('München');
    expect(findGermanDistrict('HH')?.name).toBe('Hamburg');
    expect(findGermanDistrict('K')?.name).toBe('Köln');
    expect(findGermanDistrict('F')?.name).toBe('Frankfurt am Main');
    expect(findGermanDistrict('S')?.name).toBe('Stuttgart');
    expect(findGermanDistrict('DD')?.name).toBe('Dresden');
  });

  it('handles German umlauts in district codes correctly', () => {
    expect(findGermanDistrict('AÖ')?.name).toBe('Altötting');
    expect(findGermanDistrict('FÜ')?.name).toBe('Fürth');
    expect(findGermanDistrict('GÖ')?.name).toBe('Göttingen');
    expect(findGermanDistrict('LÖ')?.name).toBe('Lörrach');
    expect(findGermanDistrict('MÜ')?.name).toBe('Mühldorf am Inn');
    expect(findGermanDistrict('TÜ')?.name).toBe('Tübingen');
    expect(findGermanDistrict('WÜ')?.name).toBe('Würzburg');
  });

  it('preserves historical liberalized district codes', () => {
    const wan = findGermanDistrict('WAN');
    expect(wan).toBeDefined();
    expect(wan?.name).toBe('Wanne-Eickel');
    expect(wan?.isHistorical).toBe(true);

    const cas = findGermanDistrict('CAS');
    expect(cas).toBeDefined();
    expect(cas?.name).toBe('Castrop-Rauxel');

    const mo = findGermanDistrict('MO');
    expect(mo).toBeDefined();
    expect(mo?.name).toBe('Moers');
  });
});
