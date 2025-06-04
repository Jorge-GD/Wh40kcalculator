import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultsComponent } from './results.component';
import { CalculationResult, TotalResults } from '../../models/calculation-result.model';

describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;
  let de: DebugElement;

  const mockCalculationResult1: CalculationResult = {
    profileName: 'Bolter Aggressor',
    expectedHits: 7.5,
    expectedWounds: 5.0,
    failedSaves: 2.5,
    mortalWoundsByAbility: 0.5,
    mortalWoundsByDevastating: 1.0,
    finalDamage: 4.0,
    modelsKilled: 1
  };

  const mockCalculationResult2: CalculationResult = {
    profileName: 'Melta Eradicator',
    expectedHits: 3.2,
    expectedWounds: 2.8,
    failedSaves: 1.4,
    mortalWoundsByAbility: 0.1,
    mortalWoundsByDevastating: 0.5,
    finalDamage: 8.0,
    modelsKilled: 0.8
  };

  const mockTotalResults: TotalResults = {
    totalDamage: 12.0,
    totalModelsKilled: 1.8,
    profileResults: [mockCalculationResult1, mockCalculationResult2]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, ResultsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display total results when provided', () => {
    component.totalResults = mockTotalResults;
    fixture.detectChanges();
    
    expect(component.totalResults).toEqual(mockTotalResults);
    expect(component.totalResults.totalDamage).toBe(12.0);
    expect(component.totalResults.totalModelsKilled).toBe(1.8);
  });

  it('should handle null total results', () => {
    component.totalResults = null;
    fixture.detectChanges();
    
    expect(component.totalResults).toBeNull();
  });

  it('should handle empty profile results', () => {
    const emptyResults: TotalResults = {
      totalDamage: 0,
      totalModelsKilled: 0,
      profileResults: []
    };
    
    component.totalResults = emptyResults;
    fixture.detectChanges();
    
    expect(component.totalResults.profileResults.length).toBe(0);
  });
});
