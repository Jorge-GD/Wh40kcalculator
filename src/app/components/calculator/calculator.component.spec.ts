import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalculatorComponent } from './calculator.component';
import { AttackerProfileService } from '../../services/attacker-profile.service';
import { DefenderProfileService } from '../../services/defender-profile.service';
import { CalculationService } from '../../services/calculation.service';
import { AttackerProfile, DEFAULT_ATTACKER_PROFILE_DATA } from '../../models/attacker-profile.model';
import { DefenderProfile, DEFAULT_DEFENDER_PROFILE } from '../../models/defender-profile.model';
import { TotalResults } from '../../models/calculation-result.model';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CalculatorComponent', () => {
  let component: CalculatorComponent;
  let fixture: ComponentFixture<CalculatorComponent>;

  const mockAttackerProfile: AttackerProfile = {
    id: 1,
    name: 'Test Profile',
    data: { ...DEFAULT_ATTACKER_PROFILE_DATA }
  };

  const mockDefenderProfile: DefenderProfile = { ...DEFAULT_DEFENDER_PROFILE };

  const mockTotalResults: TotalResults = {
    profileResults: [],
    totalDamage: 10,
    totalModelsKilled: 2
  };

  const mockAttackerProfileService = {
    attackerProfiles$: of([mockAttackerProfile]),
    getProfiles: jasmine.createSpy('getProfiles').and.returnValue([mockAttackerProfile]),
    addProfile: jasmine.createSpy('addProfile'),
    removeProfile: jasmine.createSpy('removeProfile'),
    resetAllProfiles: jasmine.createSpy('resetAllProfiles')
  };

  const mockDefenderProfileService = {
    defenderProfile$: of(mockDefenderProfile),
    resetProfile: jasmine.createSpy('resetProfile')
  };

  const mockCalculationService = {
    calculateTotalDamage: jasmine.createSpy('calculateTotalDamage').and.returnValue(mockTotalResults)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CalculatorComponent,
        NoopAnimationsModule
      ],
      providers: [
        { provide: AttackerProfileService, useValue: mockAttackerProfileService },
        { provide: DefenderProfileService, useValue: mockDefenderProfileService },
        { provide: CalculationService, useValue: mockCalculationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with attacker profiles', () => {
    expect(component.attackerProfiles).toEqual([mockAttackerProfile]);
  });

  it('should initialize with defender profile', () => {
    expect(component.defenderProfile).toEqual(mockDefenderProfile);
  });

  it('should add attacker profile', () => {
    component.addAttackerProfile();
    expect(mockAttackerProfileService.addProfile).toHaveBeenCalled();
  });

  it('should remove attacker profile', () => {
    component.removeAttackerProfile(1);
    expect(mockAttackerProfileService.removeProfile).toHaveBeenCalledWith(1);
  });

  it('should calculate results', () => {
    component.calculate();
    expect(mockCalculationService.calculateTotalDamage).toHaveBeenCalledWith([mockAttackerProfile], mockDefenderProfile);
    expect(component.calculationResults).toEqual(mockTotalResults);
    expect(component.showResults).toBe(true);
  });

  it('should reset calculator', () => {
    component.resetCalculator();
    expect(mockAttackerProfileService.resetAllProfiles).toHaveBeenCalled();
    expect(mockDefenderProfileService.resetProfile).toHaveBeenCalled();
    expect(component.calculationResults).toBeNull();
    expect(component.showResults).toBe(false);
  });
  it('should track profiles by id', () => {
    const result = component.trackByProfileId(0, mockAttackerProfile);
    expect(result).toBe(mockAttackerProfile.id);
  });
});
