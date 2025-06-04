import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DefenderProfileComponent } from './defender-profile.component';
import {
  DefenderProfile,
  DEFAULT_DEFENDER_PROFILE,
} from '../../models/defender-profile.model';
import { DefenderProfileService } from '../../services/defender-profile.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProfilePanelComponent } from '../profile-panel/profile-panel.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

describe('DefenderProfileComponent', () => {
  let component: DefenderProfileComponent;
  let fixture: ComponentFixture<DefenderProfileComponent>;
  const initialProfileData: DefenderProfile = {
    ...DEFAULT_DEFENDER_PROFILE,
  };

  const mockDefenderProfileService = {
    defenderProfile$: of(initialProfileData),
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
        ProfilePanelComponent,
        DefenderProfileComponent, // Import standalone component
      ],
      providers: [
        {
          provide: DefenderProfileService,
          useValue: mockDefenderProfileService,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DefenderProfileComponent);
    component = fixture.componentInstance;
    component.profile = initialProfileData;
    component.profileIndex = 0;
    component.isOnlyProfile = false;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render the defender profile card', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const card = compiled.querySelector('.profile-card') as HTMLElement;
    expect(card).toBeTruthy();
  });

  it('should report active defensive abilities summary', () => {
    component.profile.defenderInCover = true;
    component.profile.defenderReduceAp = true;
    fixture.detectChanges();
    expect(component.activeDefensiveAbilities).toContain('En Cobertura');
    expect(component.activeDefensiveAbilities).toContain('Reduce PA -1');
  });

  it('should emit profileChange when data updates', () => {
    spyOn(component.profileChange, 'emit');
    component.onProfileDataChange();
    expect(component.profileChange.emit).toHaveBeenCalledWith(
      component.profile
    );
  });
});
