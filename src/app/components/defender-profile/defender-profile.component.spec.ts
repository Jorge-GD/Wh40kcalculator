import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DefenderProfileComponent } from './defender-profile.component';
import { DefenderProfile } from '../../models/defender-profile.model';
import { DefenderProfileService } from '../../services/defender-profile.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { of } from 'rxjs';

describe('DefenderProfileComponent', () => {
  let component: DefenderProfileComponent;
  let fixture: ComponentFixture<DefenderProfileComponent>;  const initialProfileData: DefenderProfile = {
    numModels: 10,
    woundsPerModel: 1,
    toughness: 4,
    saveSv: 4,
    invulnSave: 0,
    cover: false,
    modToBeHit: false,
    modToBeWounded: false,
    reduceAP: false,
    damageReductionHalved: false,
    damageReductionFlat: 0,
    saveModifier: 0,
    feelNoPain: { active: false, value: 0 },
    fnpVsMortals: { active: false, value: 0 }
  };

  const mockDefenderProfileService = {
    defenderProfile$: of(initialProfileData),
    updateProfile: jasmine.createSpy('updateProfile')
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSlideToggleModule,
        MatExpansionModule,
        MatTooltipModule,
        DefenderProfileComponent // Import standalone component
      ],
      providers: [
        { provide: DefenderProfileService, useValue: mockDefenderProfileService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefenderProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render basic input fields with initial values', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    // Verificar que los campos numéricos básicos están presentes
    const inputs = compiled.querySelectorAll('input[type="number"]');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('advanced defensive protocols panel should be collapsed by default', () => {
    // Verificar que el panel existe y está colapsado
    expect(component.showAdvancedDefensiveProtocols).toBeFalse();
  });

  it('should toggle advanced defensive protocols', () => {
    const initialState = component.showAdvancedDefensiveProtocols;
    component.toggleAdvancedDefensiveProtocols();
    expect(component.showAdvancedDefensiveProtocols).toBe(!initialState);
  });

  it('should call updateProfile when profile data changes', () => {
    component.onProfileDataChange();
    expect(mockDefenderProfileService.updateProfile).toHaveBeenCalledWith(component.profile);
  });
});
