import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { CalculatorComponent } from './calculator.component';
import { AttackerProfileService } from '../../services/attacker-profile.service';
import { DefenderProfileService } from '../../services/defender-profile.service';
import { CalculationService } from '../../services/calculation.service';
import {
  AttackerProfile,
  DEFAULT_ATTACKER_PROFILE_DATA,
} from '../../models/attacker-profile.model';
import { TotalResults } from '../../models/calculation-result.model';
import { ThemeService } from '../../services/theme.service';

describe('CalculatorComponent', () => {
  let component: CalculatorComponent;
  let fixture: ComponentFixture<CalculatorComponent>;

  const dummyResults: TotalResults = {
    totalDamage: 5,
    totalModelsKilled: 1,
    profileResults: [],
  };
  const calcServiceStub = {
    calculateTotalDamage: jasmine
      .createSpy('calculateTotalDamage')
      .and.returnValue(dummyResults),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculatorComponent, NoopAnimationsModule],
      providers: [
        { provide: AttackerProfileService, useValue: {} },
        { provide: DefenderProfileService, useValue: {} },
        { provide: ThemeService, useValue: { currentTheme$: of('light') } },
        { provide: CalculationService, useValue: calcServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with one attacker and one defender profile', () => {
    expect(component.attackerProfiles.length).toBe(1);
    expect(component.defenderProfiles.length).toBe(1);
  });

  it('should add attacker profiles up to the limit', () => {
    for (let i = 0; i < 5; i++) {
      component.addAttackerProfile();
    }
    expect(component.attackerProfiles.length).toBe(
      component.maxAttackerProfiles
    );
  });

  it('should duplicate attacker profile', () => {
    const original = component.attackerProfiles[0];
    component.duplicateAttackerProfile(0);
    expect(component.attackerProfiles.length).toBe(2);
    expect(component.attackerProfiles[1].data).toEqual(original.data);
  });

  it('should delete all profiles but keep one', () => {
    component.addAttackerProfile();
    component.deleteAllProfiles();
    expect(component.attackerProfiles.length).toBe(1);
  });

  it('should copy all profiles without exceeding max', () => {
    component.addAttackerProfile();
    component.copyAllProfiles();
    expect(component.attackerProfiles.length).toBe(3);
    component.copyAllProfiles();
    expect(component.attackerProfiles.length).toBe(
      component.maxAttackerProfiles
    );
  });

  it('should calculate results when profiles exist', () => {
    component.calculate();
    expect(calcServiceStub.calculateTotalDamage).toHaveBeenCalled();
    expect(component.calculationResults).toEqual(dummyResults);
  });

  it('should not calculate when no defender profiles', () => {
    component.defenderProfiles = [];
    component.calculate();
    expect(component.calculationResults).toBeNull();
  });

  it('should track profiles by id', () => {
    const profile: AttackerProfile = {
      id: 99,
      name: 'X',
      data: { ...DEFAULT_ATTACKER_PROFILE_DATA },
    };
    expect(component.trackByProfileId(0, profile)).toBe(99);
  });
});
