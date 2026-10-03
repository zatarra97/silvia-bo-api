// Gruppi di resistenza definitivi (variabile resistance_group_final).
// Calcolati al volo dai dati del paziente: non sono salvati sul DB.
// Valgono solo per gli episodi mono-microbial; i poli-microbial non hanno gruppo.

export const RESISTANCE_GROUPS = [
  {code: 1, name: 'ESBL/AmpC carbapenem-susceptible'},
  {code: 2, name: 'CRE/CPE'},
  {code: 3, name: 'CRAB'},
  {code: 4, name: 'CRPA'},
  {code: 5, name: 'Other MDR Enterobacterales'},
] as const;

export type ResistanceGroupCode = 1 | 2 | 3 | 4 | 5;

// Gerarchia di assegnazione concordata: CRAB > CRPA > CRE/CPE > ESBL/AmpC > Other MDR.
// Serve solo se un episodio ha più patogeni in gruppi diversi.
const GROUP_PRIORITY: ResistanceGroupCode[] = [3, 4, 2, 1, 5];

// Valori AST (vedi Data dictionary): 1 = Resistant, 2 = Susceptible
const AST_RESISTANT = 1;
const AST_SUSCEPTIBLE = 2;

const ENTEROBACTERALES = /^(klebsiella|escherichia|proteus|providencia|morganella|hafnia|citrobacter|enterobacter|serratia|salmonella|shigella)\b/i;
const A_BAUMANNII = /^acinetobacter baumannii/i;
const P_AERUGINOSA = /^pseudomonas aeruginosa/i;
// Solo imipenem e meropenem: la resistenza isolata all'ertapenem non basta
// per definire un ceppo carbapenem-resistente. Le associazioni
// (es. imipenem-relebactam) sono escluse dal match esatto.
const CARBAPENEM = /^(imipenem|meropenem)$/i;

const CPE_PROFILE = /\b(kpc|oxa-?48|ndm|vim|kre)\b/i;
const ESBL_AMPC_PROFILE = /\b(esbl|ampc)\b/i;
const CRAB_PROFILE = /\bcrab\b/i;
const MDR_PROFILE = /\bmdr\b/i;

export interface ResistanceLookups {
  pathogens: Map<number, string>;
  profiles: Map<number, string>;
  antibiotics: Map<number, string>;
}

export function resistanceGroupName(code: number | null | undefined): string | null {
  return RESISTANCE_GROUPS.find(g => g.code === code)?.name ?? null;
}

// Gruppo associato direttamente a un resistance profile (colonna "Group").
// MDR non ha un gruppo univoco: dipende dal patogeno e dall'antibiogramma.
export function profileGroupLabel(profileName: string): string | null {
  if (CPE_PROFILE.test(profileName)) return resistanceGroupName(2);
  if (CRAB_PROFILE.test(profileName)) return resistanceGroupName(3);
  if (ESBL_AMPC_PROFILE.test(profileName)) return resistanceGroupName(1);
  if (MDR_PROFILE.test(profileName)) return 'Depends on pathogen (Other MDR Enterobacterales / CRPA)';
  return null;
}

function pathogenGroup(bp: any, lookups: ResistanceLookups): ResistanceGroupCode | null {
  const pathogen = lookups.pathogens.get(bp.bsiPathogenId) ?? '';
  const profiles: string[] = (bp.resistanceProfiles ?? [])
    .map((rp: any) => lookups.profiles.get(rp.resistanceProfileId) ?? '');
  const carbapenemResults: number[] = (bp.astResults ?? [])
    .filter((ar: any) => CARBAPENEM.test(lookups.antibiotics.get(ar.astAntibioticId) ?? ''))
    .map((ar: any) => ar.astValue);
  const carbapenemResistant = carbapenemResults.includes(AST_RESISTANT);
  // Sensibilità ai carbapenemi documentata da almeno un AST
  const carbapenemSusceptible = !carbapenemResistant && carbapenemResults.includes(AST_SUSCEPTIBLE);
  const has = (re: RegExp) => profiles.some(p => re.test(p));

  if (ENTEROBACTERALES.test(pathogen)) {
    if (has(CPE_PROFILE) || carbapenemResistant) return 2;
    if (has(ESBL_AMPC_PROFILE) && carbapenemSusceptible) return 1;
    if (has(MDR_PROFILE)) return 5;
    return null;
  }
  if (A_BAUMANNII.test(pathogen)) return has(CRAB_PROFILE) || carbapenemResistant ? 3 : null;
  if (P_AERUGINOSA.test(pathogen)) return carbapenemResistant ? 4 : null;
  return null;
}

export function computeResistanceGroup(patient: any, lookups: ResistanceLookups): ResistanceGroupCode | null {
  if (patient.monoPoliMicrobial !== 0) return null;
  const groups = (patient.bsiPathogens ?? [])
    .map((bp: any) => pathogenGroup(bp, lookups))
    .filter((g: ResistanceGroupCode | null): g is ResistanceGroupCode => g !== null);
  return GROUP_PRIORITY.find(g => groups.includes(g)) ?? null;
}
