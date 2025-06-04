import { Injectable } from '@angular/core';
import { AttackerProfile } from '../models/attacker-profile.model';
import { DefenderProfile } from '../models/defender-profile.model';
import {
  CalculationResult,
  HitProbabilities,
  TotalResults,
} from '../models/calculation-result.model';

// Helper interface for internal damage component tracking
interface ProfileDamagePotential {
  normalDamagePostFNP: number;
  mortalWoundsDevastatingPostFNP: number;
  mortalWoundsAbilityPreFNP: number; // Pre-FNP, as these are pooled
  expectedHits: number;
  expectedWounds: number; // Before saves
  failedSaves: number;
  mortalWoundsByDevastatingPreFNP: number; // For reporting consistency
}

@Injectable({
  providedIn: 'root',
})
export class CalculationService {
  private readonly DICE_SIDES = 6;

  constructor() {}

  /**
   * Interpreta valores de dados como "D6", "2D3", "D3+1", etc.
   */
  interpretDiceValue(diceString: string): number {
    if (!diceString || typeof diceString !== 'string') return 0;

    diceString = diceString.trim().toUpperCase();

    // Formato DX (ej: D6)
    if (diceString.match(/^D\d+$/) && diceString.includes('D')) {
      const numSides = parseInt(diceString.substring(1));
      if (numSides > 0) return (numSides + 1) / 2;
    }

    // Formato XDY (ej: 2D6)
    if (diceString.match(/^\d+D\d+$/)) {
      const parts = diceString.split('D');
      const numDice = parseInt(parts[0]);
      const numSides = parseInt(parts[1]);
      if (numDice > 0 && numSides > 0) return (numDice * (numSides + 1)) / 2;
    }

    // Formato DX+Y o DX-Y (ej: D6+1)
    if (diceString.match(/^D\d+[+-]\d+$/)) {
      const match = diceString.match(/D(\d+)([+-])(\d+)/);
      if (match) {
        const numSides = parseInt(match[1]);
        const operator = match[2];
        const modifier = parseInt(match[3]);
        const expected = (numSides + 1) / 2;
        return operator === '+' ? expected + modifier : expected - modifier;
      }
    }

    // Formato XDXY+Z o XDY-Z (ej: 2D6+1)
    if (diceString.match(/^\d+D\d+[+-]\d+$/)) {
      const match = diceString.match(/(\d+)D(\d+)([+-])(\d+)/);
      if (match) {
        const numDice = parseInt(match[1]);
        const numSides = parseInt(match[2]);
        const operator = match[3];
        const modifier = parseInt(match[4]);
        const expected = (numDice * (numSides + 1)) / 2;
        return operator === '+' ? expected + modifier : expected - modifier;
      }
    }

    // Número fijo
    if (!isNaN(parseFloat(diceString))) {
      return parseFloat(diceString);
    }

    console.warn(`Formato de dado no reconocido: ${diceString}`);
    return 0;
  }

  /**
   * Calcula la probabilidad básica de éxito en un dado
   */
  private getRawProb(
    targetRoll: number,
    diceSides: number = this.DICE_SIDES
  ): number {
    if (targetRoll <= 1) return 1.0;
    if (targetRoll > diceSides) return 0.0;
    return (diceSides - targetRoll + 1) / diceSides;
  }

  /**
   * Calcula las probabilidades de impacto considerando críticos y repeticiones
   */
  getHitProbabilities(
    baseTarget: number,
    critThreshold: number,
    rerollType: string
  ): HitProbabilities {
    const effectiveBaseTarget = Math.max(
      2,
      Math.min(this.DICE_SIDES, baseTarget)
    );
    let effectiveCritThreshold = Math.max(
      2,
      Math.min(this.DICE_SIDES, critThreshold)
    );
    effectiveCritThreshold = Math.max(
      effectiveBaseTarget,
      effectiveCritThreshold
    );

    const pCritRaw = this.getRawProb(effectiveCritThreshold);
    const pNormalRaw = Math.max(
      0,
      this.getRawProb(effectiveBaseTarget) - pCritRaw
    );
    const pFailRaw = 1 - (pCritRaw + pNormalRaw);

    let pCritFinal = pCritRaw;
    let pNormalFinal = pNormalRaw;

    if (rerollType === 'ones') {
      const probOfRollingOne = 1 / this.DICE_SIDES;
      if (1 < effectiveBaseTarget) {
        // Rerolling a 1 can only help if 1 is a fail
        pCritFinal += probOfRollingOne * pCritRaw;
        pNormalFinal += probOfRollingOne * pNormalRaw;
      }
    } else if (rerollType === 'all') {
      pCritFinal += pFailRaw * pCritRaw;
      pNormalFinal += pFailRaw * pNormalRaw;
    }

    pCritFinal = Math.max(0, Math.min(1, pCritFinal));
    pNormalFinal = Math.max(0, Math.min(1, pNormalFinal));

    let totalSuccess = pCritFinal + pNormalFinal;
    if (totalSuccess > 1) {
      // Normalize if probabilities exceed 1 due to rerolls
      // This can happen if reroll logic isn't perfectly partitioned.
      // A simple normalization:
      pCritFinal = pCritFinal / totalSuccess;
      pNormalFinal = pNormalFinal / totalSuccess;
      totalSuccess = 1;
    }

    return {
      probNormal: pNormalFinal,
      probCrit: pCritFinal,
      probTotalSuccess: totalSuccess,
    };
  }

  private applyFNP(
    damage: number,
    defenderProfile: DefenderProfile,
    isMortal: boolean
  ): number {
    const generalFnpActive = defenderProfile.feelNoPain?.active || false;
    const generalFnpTarget = generalFnpActive
      ? defenderProfile.feelNoPain?.value || 0
      : 0;
    let probPassFnp = 0;

    let fnpTargetToUse = 0;

    if (isMortal) {
      const fnpVsMortalsActive = defenderProfile.fnpVsMortals?.active || false;
      const fnpVsMortalsTarget = fnpVsMortalsActive
        ? defenderProfile.fnpVsMortals?.value || 0
        : 0;
      if (
        fnpVsMortalsActive &&
        fnpVsMortalsTarget >= 2 &&
        fnpVsMortalsTarget <= this.DICE_SIDES
      ) {
        fnpTargetToUse = fnpVsMortalsTarget;
      } else if (
        generalFnpActive &&
        generalFnpTarget >= 2 &&
        generalFnpTarget <= this.DICE_SIDES
      ) {
        fnpTargetToUse = generalFnpTarget;
      }
    } else {
      // Normal damage
      if (
        generalFnpActive &&
        generalFnpTarget >= 2 &&
        generalFnpTarget <= this.DICE_SIDES
      ) {
        fnpTargetToUse = generalFnpTarget;
      }
    }

    if (fnpTargetToUse > 0) {
      probPassFnp = this.getRawProb(fnpTargetToUse);
    }

    return damage * (1 - probPassFnp);
  }

  private getProbFailFNP(
    defenderProfile: DefenderProfile,
    isMortal: boolean
  ): number {
    const generalFnpActive = defenderProfile.feelNoPain?.active || false;
    const generalFnpTarget = generalFnpActive
      ? defenderProfile.feelNoPain?.value || 0
      : 0;
    let probPassFnp = 0;
    let fnpTargetToUse = 0;

    if (isMortal) {
      const fnpVsMortalsActive = defenderProfile.fnpVsMortals?.active || false;
      const fnpVsMortalsTarget = fnpVsMortalsActive
        ? defenderProfile.fnpVsMortals?.value || 0
        : 0;
      if (
        fnpVsMortalsActive &&
        fnpVsMortalsTarget >= 2 &&
        fnpVsMortalsTarget <= this.DICE_SIDES
      ) {
        fnpTargetToUse = fnpVsMortalsTarget;
      } else if (
        generalFnpActive &&
        generalFnpTarget >= 2 &&
        generalFnpTarget <= this.DICE_SIDES
      ) {
        fnpTargetToUse = generalFnpTarget;
      }
    } else {
      // Normal damage
      if (
        generalFnpActive &&
        generalFnpTarget >= 2 &&
        generalFnpTarget <= this.DICE_SIDES
      ) {
        fnpTargetToUse = generalFnpTarget;
      }
    }

    if (fnpTargetToUse > 0) {
      probPassFnp = this.getRawProb(fnpTargetToUse);
    }
    return 1 - probPassFnp;
  }

  private calculateDamageComponents(
    attackerProfile: AttackerProfile,
    defenderProfile: DefenderProfile
  ): ProfileDamagePotential {
    const data = attackerProfile.data;
    // Calcular número de ataques base
    let numAtaquesBase: number = this.interpretDiceValue(data.attacks || '0');
    if (data.rapidFire?.active) {
      numAtaquesBase += data.rapidFire?.value || 0;
    }
    if (data.blast) {
      numAtaquesBase += Math.floor((defenderProfile.numModels || 0) / 5);
    }

    // Calcular modificadores de impacto
    const habilidadObjetivo = data.skill || 7;
    let modImpactoNeto = data.hitModifier || 0;
    if (data.heavy && data.attackerStationary) modImpactoNeto += 1;
    if (defenderProfile.modToBeHit) modImpactoNeto -= 1;
    modImpactoNeto = Math.max(-1, Math.min(1, modImpactoNeto));
    const habilidadModificada = Math.max(
      2,
      Math.min(this.DICE_SIDES + 1, habilidadObjetivo - modImpactoNeto)
    );

    // Calcular umbral crítico de impacto
    let umbralCriticoImpacto = 6;
    if (data.critHitMod?.active)
      umbralCriticoImpacto = data.critHitMod?.value || 5;
    umbralCriticoImpacto = Math.max(
      2,
      Math.min(this.DICE_SIDES, umbralCriticoImpacto)
    );
    umbralCriticoImpacto = Math.max(habilidadModificada, umbralCriticoImpacto);

    // Calcular impactos
    let eImpactosCriticos = 0;
    let eImpactosNormales = 0;
    if (data.torrent) {
      eImpactosNormales = numAtaquesBase;
      eImpactosCriticos = 0;
    } else {
      const hitProbs = this.getHitProbabilities(
        habilidadModificada,
        umbralCriticoImpacto,
        data.hitRerollType || 'none'
      );
      eImpactosCriticos = numAtaquesBase * hitProbs.probCrit;
      eImpactosNormales = numAtaquesBase * hitProbs.probNormal;
    }
    const eImpactosTotales = eImpactosCriticos + eImpactosNormales;

    // Heridas automáticas por letales y Sustained Hits
    let eAutoHeridasPorLetales = 0;
    let impactosQueHieren = eImpactosNormales;
    if (data.lethalHits?.active && !data.torrent) {
      eAutoHeridasPorLetales = eImpactosCriticos;
    } else {
      impactosQueHieren += eImpactosCriticos;
    }
    if (data.sustainedHits?.active && !data.torrent) {
      impactosQueHieren += eImpactosCriticos * (data.sustainedHits?.value || 1);
    }

    // Calcular probabilidad de herir
    const fuerzaAtacante = data.strength || 0;
    const resistenciaDefensor = defenderProfile.toughness || 0;
    let heridaObjetivoBase: number;
    if (fuerzaAtacante >= resistenciaDefensor * 2) heridaObjetivoBase = 2;
    else if (fuerzaAtacante > resistenciaDefensor) heridaObjetivoBase = 3;
    else if (fuerzaAtacante === resistenciaDefensor) heridaObjetivoBase = 4;
    else if (fuerzaAtacante * 2 <= resistenciaDefensor) heridaObjetivoBase = 6;
    else heridaObjetivoBase = 5;

    let modHerirNeto = data.woundModifier || 0;
    if (data.lance?.active && data.lance?.charged) modHerirNeto += 1;
    else if (data.plusOneToWoundGeneral) modHerirNeto += 1;
    if (defenderProfile.modToBeWounded) modHerirNeto -= 1;
    modHerirNeto = Math.max(-1, Math.min(1, modHerirNeto));
    const heridaModificada = Math.max(
      2,
      Math.min(this.DICE_SIDES + 1, heridaObjetivoBase - modHerirNeto)
    );

    let umbralCriticoHerida = this.DICE_SIDES;
    if (data.anti?.active)
      umbralCriticoHerida = Math.min(
        umbralCriticoHerida,
        data.anti?.value || this.DICE_SIDES
      );
    umbralCriticoHerida = Math.max(
      2,
      Math.min(this.DICE_SIDES, umbralCriticoHerida)
    );
    umbralCriticoHerida = Math.max(heridaModificada, umbralCriticoHerida);

    const actualWoundRerollType = data.twinLinked?.active
      ? 'all'
      : data.woundRerollType || 'none';
    const woundProbs = this.getHitProbabilities(
      heridaModificada,
      umbralCriticoHerida,
      actualWoundRerollType
    );
    const eHeridasCriticasWoundRoll = impactosQueHieren * woundProbs.probCrit;
    const eHeridasNormalesWoundRoll = impactosQueHieren * woundProbs.probNormal;
    const totalWoundsInflictedPreDevastating =
      eAutoHeridasPorLetales +
      eHeridasNormalesWoundRoll +
      eHeridasCriticasWoundRoll;

    // Damage values and reductions
    const flatReduction = defenderProfile.damageReductionFlat || 0;
    const reduceDamageHalved = defenderProfile.damageReductionHalved || false;

    let dañoArmaBase = this.interpretDiceValue(data.damage || '1');
    if (data.melta?.active && data.melta?.inRange) {
      dañoArmaBase += this.interpretDiceValue(data.melta?.value || '0');
    }
    let dañoNormalPorInstancia = dañoArmaBase;
    if (reduceDamageHalved)
      dañoNormalPorInstancia = Math.ceil(dañoNormalPorInstancia / 2);
    if (flatReduction > 0)
      dañoNormalPorInstancia = Math.max(
        1,
        dañoNormalPorInstancia - flatReduction
      );

    // Heridas devastadoras (pre-FNP)
    let eHeridasMortalesDevastadoras_PreFNP = 0;
    let heridasQueRequierenSalvacion =
      eAutoHeridasPorLetales + eHeridasNormalesWoundRoll; // Start with auto-wounds and normal wounds from roll

    if (data.devastatingWounds?.active) {
      let dañoPorDevastadora = dañoArmaBase; // Devastating uses weapon's base damage
      // Note: Rules debate if Devastating Wounds damage is reduced by model abilities. Assuming yes for now.
      if (reduceDamageHalved)
        dañoPorDevastadora = Math.ceil(dañoPorDevastadora / 2);
      if (flatReduction > 0)
        dañoPorDevastadora = Math.max(1, dañoPorDevastadora - flatReduction);

      eHeridasMortalesDevastadoras_PreFNP =
        eHeridasCriticasWoundRoll * dañoPorDevastadora;
    } else {
      heridasQueRequierenSalvacion += eHeridasCriticasWoundRoll; // Crit wounds from roll also need save if no Devastating
    }

    // Heridas mortales por habilidad especial (pre-FNP)
    let eHeridasMortalesPorHabilidad_PreFNP = 0;
    if (
      data.extraMortals?.active &&
      data.extraMortals.on &&
      data.extraMortals.amount
    ) {
      let cantidadMortalesHabilidad = this.interpretDiceValue(
        data.extraMortals.amount || '0'
      );
      // Assuming MW from abilities are also subject to damage reduction rules if they are "damage"
      // This is a grey area; for now, let\'s assume they are like other damage instances for reduction.
      if (reduceDamageHalved)
        cantidadMortalesHabilidad = Math.ceil(cantidadMortalesHabilidad / 2);
      if (flatReduction > 0)
        cantidadMortalesHabilidad = Math.max(
          1,
          cantidadMortalesHabilidad - flatReduction
        );

      if (!data.torrent) {
        // Assuming trigger on hit roll
        const probTriggerMortal = this.getRawProb(data.extraMortals.on);
        eHeridasMortalesPorHabilidad_PreFNP =
          numAtaquesBase * probTriggerMortal * cantidadMortalesHabilidad;
      }
    }

    // Calcular salvaciones
    let paAplicado = data.ap || 0;
    if (defenderProfile.reduceAP) paAplicado = Math.max(0, paAplicado - 1);
    const salvacionBase = defenderProfile.saveSv || 7;
    let salvacionModificadaPA = salvacionBase + paAplicado;
    if (defenderProfile.cover) salvacionModificadaPA -= 1;
    salvacionModificadaPA += defenderProfile.saveModifier || 0;
    let salvacionFinalObjetivo = salvacionModificadaPA;
    const invulnSaveDefensor = defenderProfile.invulnSave || 0;
    if (invulnSaveDefensor > 0 && invulnSaveDefensor < salvacionFinalObjetivo) {
      salvacionFinalObjetivo = invulnSaveDefensor;
    }
    salvacionFinalObjetivo = Math.max(
      2,
      Math.min(this.DICE_SIDES + 1, salvacionFinalObjetivo)
    );
    const eSalvacionesFalladas =
      heridasQueRequierenSalvacion *
      (1 - this.getRawProb(salvacionFinalObjetivo));

    const eDañoNormalTotal_PreFNP =
      eSalvacionesFalladas * dañoNormalPorInstancia;

    // Aplicar Feel No Pain
    const normalDamagePostFNP = this.applyFNP(
      eDañoNormalTotal_PreFNP,
      defenderProfile,
      false
    );
    const mortalWoundsDevastatingPostFNP = this.applyFNP(
      eHeridasMortalesDevastadoras_PreFNP,
      defenderProfile,
      true
    );

    return {
      normalDamagePostFNP,
      mortalWoundsDevastatingPostFNP,
      mortalWoundsAbilityPreFNP: eHeridasMortalesPorHabilidad_PreFNP,
      expectedHits: eImpactosTotales,
      expectedWounds: totalWoundsInflictedPreDevastating, // total wounds before saves & devastating conversion
      failedSaves: eSalvacionesFalladas,
      mortalWoundsByDevastatingPreFNP: eHeridasMortalesDevastadoras_PreFNP,
    };
  }

  /**
   * Calcula el daño total de todos los perfiles de atacante contra todos los perfiles de defensor
   */
  calculateTotalDamage(
    attackerProfiles: AttackerProfile[],
    defenderProfiles: DefenderProfile[]
  ): TotalResults {
    const aggregatedResultsMap = new Map<string, CalculationResult>(); // Key: attackerId-defenderId
    let grandTotalDamage = 0;

    const defenderStates = new Map<
      string,
      {
        id: string;
        name: string;
        hp: number;
        models: number;
        initialModels: number;
        woundsPerModel: number;
        saveOrder: number;
        // Store the full profile for FNP rules etc.
        profile: DefenderProfile;
      }
    >();

    defenderProfiles.forEach((dp) => {
      const initialHP = (dp.numModels || 0) * (dp.woundsPerModel || 1);
      defenderStates.set(dp.id, {
        id: dp.id,
        name: dp.name,
        hp: initialHP,
        models: dp.numModels || 0,
        initialModels: dp.numModels || 0,
        woundsPerModel: dp.woundsPerModel || 1,
        saveOrder: dp.saveOrder,
        profile: dp,
      });
    });

    const sortedDefenderStatesList = Array.from(defenderStates.values()).sort(
      (a, b) => a.saveOrder - b.saveOrder
    );

    for (const attackerProfile of attackerProfiles) {
      let attackerAbilityMortalsPoolPreFNP = 0;

      const firstDefenderForBlastState =
        sortedDefenderStatesList.find((ds) => ds.models > 0) ||
        sortedDefenderStatesList[0];
      if (firstDefenderForBlastState) {
        const potential = this.calculateDamageComponents(
          attackerProfile,
          firstDefenderForBlastState.profile
        );
        attackerAbilityMortalsPoolPreFNP = potential.mortalWoundsAbilityPreFNP;
      }

      // Phase 1: Non-spillover damage (Normal + Devastating)
      for (const defState of sortedDefenderStatesList) {
        if (defState.models <= 0) continue;

        const components = this.calculateDamageComponents(
          attackerProfile,
          defState.profile
        );
        const nonSpillDamageThisPair =
          components.normalDamagePostFNP +
          components.mortalWoundsDevastatingPostFNP;

        const damageAppliedToThisDefender = Math.min(
          nonSpillDamageThisPair,
          defState.hp
        );
        defState.hp -= damageAppliedToThisDefender;
        grandTotalDamage += damageAppliedToThisDefender;

        const oldModels = defState.models;
        defState.models =
          defState.hp > 0
            ? Math.ceil(defState.hp / defState.woundsPerModel)
            : 0;
        const modelsKilledThisDamageStep = oldModels - defState.models;

        const resultKey = `${attackerProfile.id}-${defState.id}`;
        let pairResult = aggregatedResultsMap.get(resultKey);
        if (!pairResult) {
          pairResult = {
            profileName: attackerProfile.name,
            defenderProfileName: defState.name,
            expectedHits: components.expectedHits,
            expectedWounds: components.expectedWounds,
            failedSaves: components.failedSaves,
            mortalWoundsByDevastating: 0,
            mortalWoundsByAbility: 0,
            finalDamage: 0,
            modelsKilled: 0,
          };
          aggregatedResultsMap.set(resultKey, pairResult);
        }
        pairResult.finalDamage += damageAppliedToThisDefender;
        pairResult.modelsKilled += modelsKilledThisDamageStep;
        if (damageAppliedToThisDefender > 0 && nonSpillDamageThisPair > 0) {
          pairResult.mortalWoundsByDevastating +=
            (components.mortalWoundsDevastatingPostFNP /
              nonSpillDamageThisPair) *
            damageAppliedToThisDefender;
        }

        if (defState.models <= 0) {
          break;
        }
      }

      // Phase 2: Spillover damage (Ability Mortals)
      let remainingAbilityMortalsPreFNP = attackerAbilityMortalsPoolPreFNP;
      for (const defState of sortedDefenderStatesList) {
        if (remainingAbilityMortalsPreFNP <= 0) break;
        if (defState.models <= 0) continue;

        // Determine how much pre-FNP damage to attempt on this defender
        // This is the complex part: relating pre-FNP pool to post-FNP damage cap by HP
        const probFailFNPForMortals = this.getProbFailFNP(
          defState.profile,
          true
        );
        let maxPreFNPMortalsToKill = Infinity;
        if (probFailFNPForMortals > 0) {
          // Avoid division by zero if FNP always passes
          maxPreFNPMortalsToKill = defState.hp / probFailFNPForMortals;
        } else if (defState.hp > 0) {
          // FNP always passes, can\'t kill with mortals unless 0 HP
          continue; // Cannot deal damage if FNP always passes and HP > 0
        }

        let mortalsToAttemptOnThisDefenderPreFNP = Math.min(
          remainingAbilityMortalsPreFNP,
          maxPreFNPMortalsToKill
        );
        mortalsToAttemptOnThisDefenderPreFNP = Math.max(
          0,
          mortalsToAttemptOnThisDefenderPreFNP
        ); // Ensure non-negative

        const mortalsPostFNPForThisDefender = this.applyFNP(
          mortalsToAttemptOnThisDefenderPreFNP,
          defState.profile,
          true
        );
        const damageAppliedFromAbilityMW = Math.min(
          mortalsPostFNPForThisDefender,
          defState.hp
        );

        defState.hp -= damageAppliedFromAbilityMW;
        grandTotalDamage += damageAppliedFromAbilityMW;
        remainingAbilityMortalsPreFNP -= mortalsToAttemptOnThisDefenderPreFNP; // Reduce pool by what was attempted
        if (remainingAbilityMortalsPreFNP < 0)
          remainingAbilityMortalsPreFNP = 0;

        const oldModels = defState.models;
        defState.models =
          defState.hp > 0
            ? Math.ceil(defState.hp / defState.woundsPerModel)
            : 0;
        const modelsKilledThisDamageStep = oldModels - defState.models;

        const resultKey = `${attackerProfile.id}-${defState.id}`;
        let pairResult = aggregatedResultsMap.get(resultKey);
        if (!pairResult) {
          // Should exist if attacker could target this defender at all
          pairResult = {
            /* ... initialize ... */ profileName: attackerProfile.name,
            defenderProfileName: defState.name,
            finalDamage: 0,
            modelsKilled: 0,
            mortalWoundsByAbility: 0,
            expectedHits: 0,
            expectedWounds: 0,
            failedSaves: 0,
            mortalWoundsByDevastating: 0,
          };
          aggregatedResultsMap.set(resultKey, pairResult);
        }
        pairResult.finalDamage += damageAppliedFromAbilityMW;
        pairResult.modelsKilled += modelsKilledThisDamageStep;
        pairResult.mortalWoundsByAbility += damageAppliedFromAbilityMW;
      }
    }

    let grandTotalModelsKilled = 0;
    defenderStates.forEach((s) => {
      grandTotalModelsKilled += s.initialModels - s.models;
    });

    return {
      totalDamage: grandTotalDamage,
      totalModelsKilled: grandTotalModelsKilled,
      profileResults: Array.from(aggregatedResultsMap.values()),
    };
  }
}
