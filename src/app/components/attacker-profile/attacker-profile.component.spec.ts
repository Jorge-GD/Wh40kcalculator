import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
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
    data: { ...DEFAULT_ATTACKER_PROFILE_DATA },
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
    const profileNameText = compiled.querySelector(
      '.profile-name-text'
    ) as HTMLElement;
    expect(profileNameText).toBeTruthy();
    expect(profileNameText.textContent?.trim()).toBe('Test Profile 1');
  });

  it('should render the attacker profile card', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const card = compiled.querySelector(
      '.attacker-profile-card'
    ) as HTMLElement;
    expect(card).toBeTruthy();
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
