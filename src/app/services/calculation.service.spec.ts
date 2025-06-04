import { CalculationService } from './calculation.service';
import { AttackerProfile, DEFAULT_ATTACKER_PROFILE_DATA } from '../models/attacker-profile.model';
import { DefenderProfile, DEFAULT_DEFENDER_PROFILE } from '../models/defender-profile.model';

describe('CalculationService', () => {
  let service: CalculationService;

  beforeEach(() => {
    service = new CalculationService();
  });

  it('should interpret simple dice strings', () => {
    expect(service.interpretDiceValue('D6')).toBe(3.5);
    expect(service.interpretDiceValue('2D6')).toBe(7);
    expect(service.interpretDiceValue('D6+1')).toBe(4.5);
    expect(service.interpretDiceValue('2D6+1')).toBe(8);
  });

  it('should return 0 for invalid values', () => {
    expect(service.interpretDiceValue('bad')).toBe(0);
    expect(service.interpretDiceValue('')).toBe(0);
  });

  it('should parse fixed numbers', () => {
    expect(service.interpretDiceValue('5')).toBe(5);
  });

  it('getHitProbabilities should increase with rerolls', () => {
    const noReroll = service.getHitProbabilities(4, 6, 'none');
    const rerollAll = service.getHitProbabilities(4, 6, 'all');
    expect(rerollAll.probTotalSuccess).toBeGreaterThan(noReroll.probTotalSuccess);
  });

  it('calculateTotalDamage should return results for defaults', () => {
    const attacker: AttackerProfile = {
      id: 1,
      name: 'A',
      data: { ...DEFAULT_ATTACKER_PROFILE_DATA },
    };
    const defender: DefenderProfile = { ...DEFAULT_DEFENDER_PROFILE };
    const result = service.calculateTotalDamage([attacker], [defender]);
    expect(result.totalDamage).toBeGreaterThanOrEqual(0);
    expect(result.profileResults.length).toBe(1);
  });
});
