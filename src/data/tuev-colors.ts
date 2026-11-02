export interface TuevColorInfo {
  year: number;
  colorName: string;
  colorHex: string;
  textColor: string;
}

const TUEV_CYCLE: { name: string; hex: string; text: string }[] = [
  { name: 'Green (Grün)', hex: '#27ae60', text: '#ffffff' },      // 2024, 2030, 2036...
  { name: 'Orange (Orange)', hex: '#e67e22', text: '#ffffff' },   // 2025, 2031, 2037...
  { name: 'Blue (Blau)', hex: '#2980b9', text: '#ffffff' },       // 2026, 2032, 2038...
  { name: 'Yellow (Gelb)', hex: '#f1c40f', text: '#111111' },     // 2027, 2033, 2039...
  { name: 'Brown (Braun)', hex: '#795548', text: '#ffffff' },     // 2028, 2034, 2040...
  { name: 'Pink (Rosa)', hex: '#e91e63', text: '#ffffff' },       // 2029, 2035, 2041...
];

export function getTuevColor(year: number): TuevColorInfo {
  const baseYear = 2024;
  const cycleIndex = ((year - baseYear) % 6 + 6) % 6;
  const item = TUEV_CYCLE[cycleIndex];
  return {
    year,
    colorName: item.name,
    colorHex: item.hex,
    textColor: item.text,
  };
}

export function getMonthRotationDeg(month: number): number {
  // In the German HU sticker, month numbers 1-12 run counter-clockwise around the edge,
  // and the due month is positioned at the top (12 o'clock / 0 deg).
  // The black arc marking spans months 11, 12, 1 (a 60-degree segment).
  // Rotating the sticker puts the due month at 12 o'clock.
  return ((month - 12) * 30);
}
