export interface DefenderProfile {
  id: string; // Added id
  name: string; // Added name
  saveOrder: number; // Added saveOrder

  // Estadísticas base
  numModels: number;
  woundsPerModel: number;
  toughness: number;
  saveSv: number;
  invulnSave: number;

  // Protocolos defensivos avanzados
  defenderInCover: boolean;
  defenderModToBeHit: boolean;
  defenderModToBeWounded: boolean;
  defenderReduceAp: boolean;
  defenderHalveDamage: boolean;
  defenderReduceDamageFlat: boolean;
  // Feel No Pain con sub-opciones
  feelNoPain: {
    active: boolean;
    value: number;
    vsMortalsActive: boolean;
    vsMortalsValue: number;
  };
  
  // Shorthand alias for Feel No Pain vs Mortals
  fnpVsMortals?: {
    active: boolean;
    value: number;
  };

  // Legacy properties for backward compatibility
  cover?: boolean;
  modToBeHit?: boolean;
  modToBeWounded?: boolean;
  reduceAP?: boolean;
  damageReductionHalved?: boolean;
  damageReductionFlat?: number;
  saveModifier?: number;
}

export const DEFAULT_DEFENDER_PROFILE: DefenderProfile = {
  id: 'default-defender', // Added id
  name: 'Default Defender', // Added name
  saveOrder: 1, // Added saveOrder
  numModels: 10,
  woundsPerModel: 1,
  toughness: 4,
  saveSv: 4,
  invulnSave: 0,
  
  defenderInCover: false,
  defenderModToBeHit: false,
  defenderModToBeWounded: false,
  defenderReduceAp: false,
  defenderHalveDamage: false,
  defenderReduceDamageFlat: false,
  
  feelNoPain: {
    active: false,
    value: 0,
    vsMortalsActive: false,
    vsMortalsValue: 0
  },

  // Legacy properties
  cover: false,
  modToBeHit: false,
  modToBeWounded: false,
  reduceAP: false,
  damageReductionHalved: false,
  damageReductionFlat: 0,
  saveModifier: 0
};
