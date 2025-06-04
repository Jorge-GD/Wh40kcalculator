export interface CalculationResult {
  profileName: string; // Attacker profile name
  defenderProfileName?: string; // Optional: Defender profile name
  expectedHits: number;
  expectedWounds: number;
  failedSaves: number;
  mortalWoundsByAbility: number;
  mortalWoundsByDevastating: number;
  modelsKilled: number;
  finalDamage: number;
}

export interface HitProbabilities {
  probNormal: number;
  probCrit: number;
  probTotalSuccess: number;
}

export interface TotalResults {
  totalDamage: number;
  totalModelsKilled: number;
  profileResults: CalculationResult[];
}
