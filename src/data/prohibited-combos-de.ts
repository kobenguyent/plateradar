export interface ProhibitedRule {
  pattern: RegExp;
  reason: string;
  scope: 'federal' | 'state';
  state?: string;
}

export const PROHIBITED_COMBINATIONS_DE: ProhibitedRule[] = [
  {
    pattern: /\b(HJ|KZ|NS|SA|SS)\b/i,
    reason: 'Nationwide prohibited under § 8 Abs. 1 FZV due to direct connection to Nazi organizations (Hitlerjugend, Konzentrationslager, Nationalsozialismus, Sturmabteilung, Schutzstaffel).',
    scope: 'federal',
  },
  {
    pattern: /\bSD\b/i,
    reason: 'Prohibited in most federal states (Sicherheitsdienst des Reichsführers SS).',
    scope: 'state',
  },
  {
    pattern: /\bAH\s*(18|88|1933)\b/i,
    reason: 'Prohibited in several federal states (e.g., Brandenburg, Bavaria, Hessen) as neo-Nazi numeric codes (Adolf Hitler / 18/88).',
    scope: 'state',
  },
  {
    pattern: /\bHH\s*(18|88|1933)\b/i,
    reason: 'Prohibited in states like Brandenburg and Saxony-Anhalt when used with extremist number codes.',
    scope: 'state',
  },
  {
    pattern: /\bN\s*[- ]*(PD|SU)\b/i,
    reason: 'Prohibited specifically in Nuremberg (N) to prevent combinations referencing banned extremist groups or NSU terror cell.',
    scope: 'state',
    state: 'bayern',
  },
];

export function checkProhibitedGermanPlate(district: string, middle: string, number: string): string | null {
  const full = `${district} ${middle} ${number}`.trim().toUpperCase();
  const middleUpper = middle.toUpperCase();

  // Check middle letters directly
  if (['HJ', 'KZ', 'NS', 'SA', 'SS'].includes(middleUpper)) {
    return `Forbidden combination '${middleUpper}': Banned nationwide in Germany under § 8 Abs. 1 FZV (National Socialist abbreviation).`;
  }
  if (middleUpper === 'SD') {
    return `Restricted combination 'SD': Prohibited in multiple federal states (reference to Nazi Sicherheitsdienst).`;
  }

  for (const rule of PROHIBITED_COMBINATIONS_DE) {
    if (rule.pattern.test(full)) {
      return rule.reason;
    }
  }

  return null;
}
