import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { AttackerProfileComponent } from './attacker-profile.component';
import {
  AttackerProfile,
  DEFAULT_ATTACKER_PROFILE_DATA,
} from '../../models/attacker-profile.model';
import { AttackerProfileService } from '../../services/attacker-profile.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

describe('AttackerProfileComponent', () => {
  let component: AttackerProfileComponent;
  let fixture: ComponentFixture<AttackerProfileComponent>;
  // Datos iniciales para el perfil del atacante
  const initialProfileData: AttackerProfile = {
    id: 1,
    name: 'Test Profile 1',
    data: {
      attacks: 10,
      skill: 3,
      strength: 5,
      ap: 1,
      damage: '1',
      hitRerollType: 'none',
      critHitMod: { active: false, value: 5 },
      sustainedHits: { active: false, value: 1 },
      lethalHits: { active: false },
      rapidFire: { active: false, value: 1 },
      heavy: false,
      attackerStationary: false,
      torrent: false,
      blast: false,
      twinLinked: { active: false },
      hitModifier: 0,
      woundRerollType: 'none',
      devastatingWounds: { active: false },
      anti: { active: false, keyword: 'INFANTRY', value: 4 },
      melta: { active: false, value: 'D3', inRange: false },
      lance: { active: false, charged: false },
      plusOneToWoundGeneral: false,
      woundModifier: 0,
      extraMortals: { active: false, on: 6, amount: 'D3' },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatExpansionModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        AttackerProfileComponent, // Importar el componente standalone
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AttackerProfileComponent);
    component = fixture.componentInstance;
    component.profile = initialProfileData;
    component.profileIndex = 0;
    component.isOnlyProfile = false;

    fixture.detectChanges(); // Esto llamará a ngOnInit y otras inicializaciones
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should display the profile name', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    // Verificar que se muestra el nombre del perfil en el input correspondiente
    const profileNameInput = compiled.querySelector(
      '.profile-name-input input'
    ) as HTMLInputElement;
    expect(profileNameInput).toBeTruthy();
    expect(profileNameInput.value).toBe('Test Profile 1');
  });

  it('should render basic input fields with initial values from profile', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    // Verificar que los campos numéricos aparecen en el template
    const attacksInput = compiled.querySelector(
      'input[type="number"]'
    ) as HTMLInputElement;
    expect(attacksInput).toBeTruthy();
  });

  it('should enable remove button when not only profile', () => {
    component.isOnlyProfile = false;
    fixture.detectChanges();
    const removeButton = fixture.nativeElement.querySelector(
      '.remove-button'
    ) as HTMLButtonElement;
    expect(removeButton.disabled).toBeFalse();
  });

  it('should disable remove button when only profile', () => {
    component.isOnlyProfile = true;
    fixture.detectChanges();
    const removeButton = fixture.nativeElement.querySelector(
      '.remove-button'
    ) as HTMLButtonElement;
    expect(removeButton.disabled).toBeTrue();
  });

  it('should emit removeProfile event when Remove button is clicked', () => {
    spyOn(component.removeProfile, 'emit');
    component.onRemoveProfile();
    expect(component.removeProfile.emit).toHaveBeenCalledWith(0);
  });

  it('should emit duplicateProfile event when Duplicate button is clicked', () => {
    spyOn(component.duplicateProfile, 'emit');
    component.onDuplicateProfile();
    expect(component.duplicateProfile.emit).toHaveBeenCalledWith(0);
  });

  it('should emit profileChange when profile data changes', () => {
    spyOn(component.profileChange, 'emit');
    component.onProfileDataChange();
    expect(component.profileChange.emit).toHaveBeenCalled();
  });

  it('should reset profile data to defaults', () => {
    component.profileData.attacks = '99';
    component.onResetProfile();
    expect(component.profileData).toEqual(DEFAULT_ATTACKER_PROFILE_DATA);
  });

  it('should toggle lethal hits protocol', () => {
    component.toggleProtocol('lethalHits');
    expect(component.profileData.lethalHits.active).toBeTrue();
  });

  it('should cycle shooting modifier with openProtocolModal', () => {
    component.openProtocolModal('shootingModifier');
    expect(component.profileData.shootingModifier).toEqual({
      active: true,
      value: 1,
    });
    component.openProtocolModal('shootingModifier');
    expect(component.profileData.shootingModifier).toEqual({
      active: true,
      value: -1,
    });
    component.openProtocolModal('shootingModifier');
    expect(component.profileData.shootingModifier).toEqual({
      active: false,
      value: 0,
    });
  });

  it('should delegate focus request to service', () => {
    const service = TestBed.inject(AttackerProfileService);
    spyOn(service, 'setFocusOnField');
    component.onFocusField('attacks');
    expect(service.setFocusOnField).toHaveBeenCalledWith(
      component.profile.id,
      'attacks'
    );
  });
});
