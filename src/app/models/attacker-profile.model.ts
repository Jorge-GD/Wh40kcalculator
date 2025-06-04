export interface AttackerProfile {
  id: number;
  name: string;
  data: AttackerProfileData;
}

export interface AttackerProfileData {
  // Estadísticas base
  attacks: string; // Changed to string to support dice values like "D6", "2D3", etc.
  skill: number;
  strength: number;
  ap: number;
  damage: string;
  // Protocolos de Impacto Avanzados
  hitRerollType: 'none' | 'ones' | 'all';
  shootingModifier: {
    active: boolean;
    value: -1 | 0 | 1; // -1, 0, or +1 modifier to hit rolls
  };
  critHitMod?: {
    active: boolean;
    value: number;
  };
  sustainedHits: {
    active: boolean;
    value: number;
  };
  lethalHits: {
    active: boolean;
  };
  rapidFire?: {
    active: boolean;
    value: number;
  };
  torrent?: boolean;
  blast?: boolean;

  // Protocolos de Herida Avanzados
  woundModifiers: 'none' | 'lance' | 'plus_one_general';
  lance?: {
    active: boolean;
    charged: boolean;
  };
  plusOneToWoundGeneral?: boolean;
  woundRerollType: 'none' | 'failures' | 'ones' | 'all';
  devastatingWounds: {
    active: boolean;
  };
  anti?: {
    active: boolean;
    keyword?: string; // Added for Anti-X [Y+]
    value: number;
  };
  melta?: {
    active: boolean;
    value: string;
    inRange: boolean;
  };
  
  // Twin-linked (moved here for better organization)
  twinLinked: {
    active: boolean;
  };

  // Habilidades de Daño Adicional / Mortales
  extraMortals?: {
    active: boolean;
    on: number;
    amount: string;
  };
  // Legacy properties for backward compatibility
  hitModifier?: number;
  woundModifier?: number;
  extraMortalsActive?: boolean;
  extraMortalsOn?: number;
  extraMortalsAmount?: string;
  // Template compatibility properties (flat versions of nested objects)
  critHitModActive?: boolean;
  critHitValue?: number;
  shootingModifierActive?: boolean;
  shootingModifierValue?: -1 | 0 | 1;
  rapidFireActive?: boolean;
  rapidFireValue?: number;
  torrentActive?: boolean;
  blastActive?: boolean;
  lanceCharged?: boolean;
  antiActive?: boolean;
  antiKeyword?: string; // Ensured this matches the main anti object structure
  antiThreshold?: number;
  meltaActive?: boolean;
  meltaDamage?: string;
  meltaInRange?: boolean;
}

export const DEFAULT_ATTACKER_PROFILE_DATA: AttackerProfileData = {
  attacks: "10",
  skill: 3,
  strength: 5,
  ap: 1,
  damage: "1",
  // Protocolos de Impacto Avanzados
  hitRerollType: "none",
  shootingModifier: { active: false, value: 0 },
  critHitMod: { active: false, value: 5 },
  sustainedHits: { active: false, value: 1 },
  lethalHits: { active: false },
  rapidFire: { active: false, value: 1 },
  torrent: false,
  blast: false,

  // Protocolos de Herida Avanzados
  woundModifiers: "none",
  lance: { active: false, charged: false },
  plusOneToWoundGeneral: false,
  woundRerollType: "none",
  devastatingWounds: { active: false },
  anti: { active: false, keyword: 'INFANTRY', value: 4 },
  melta: { active: false, value: "D3", inRange: false },
  twinLinked: { active: false },
  // Habilidades de Daño Adicional / Mortales
  extraMortals: { active: false, on: 6, amount: "D3" },
  // Legacy properties
  hitModifier: 0,
  woundModifier: 0,
  extraMortalsActive: false,
  extraMortalsOn: 6,
  extraMortalsAmount: "D3",
  // Template compatibility properties
  critHitModActive: false,
  critHitValue: 5,
  shootingModifierActive: false,
  shootingModifierValue: 0,
  rapidFireActive: false,
  rapidFireValue: 1,
  torrentActive: false,
  blastActive: false,
  lanceCharged: false,
  antiActive: false,
  antiKeyword: "INFANTRY", // Ensured this matches the main anti object structure
  antiThreshold: 4,
  meltaActive: false,
  meltaDamage: "D3",
  meltaInRange: false
};
