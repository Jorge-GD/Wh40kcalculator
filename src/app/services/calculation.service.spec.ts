import { CalculationService } from './calculation.service';

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
});
