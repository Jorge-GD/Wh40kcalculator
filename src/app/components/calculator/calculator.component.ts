import { Component, OnInit, OnDestroy, ChangeDetectorRef, HostListener } from '@angular/core';
import { AttackerProfileService } from '../../services/attacker-profile.service';
import { DefenderProfileService } from '../../services/defender-profile.service';
import { CalculationService } from '../../services/calculation.service';
import { AttackerProfile, DEFAULT_ATTACKER_PROFILE_DATA } from '../../models/attacker-profile.model';
import { DefenderProfile, DEFAULT_DEFENDER_PROFILE } from '../../models/defender-profile.model';
import { CalculationResult, TotalResults } from '../../models/calculation-result.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { AttackerProfileComponent } from '../attacker-profile/attacker-profile.component';
import { DefenderProfileComponent } from '../defender-profile/defender-profile.component';
import { ResultsComponent } from '../results/results.component';
import { ThemeService } from '../../services/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatIconModule, 
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    FormsModule,
    AttackerProfileComponent, 
    DefenderProfileComponent, 
    ResultsComponent
  ],
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit, OnDestroy {
  attackerProfiles: AttackerProfile[] = [];
  defenderProfiles: DefenderProfile[] = []; // Changed to an array
  calculationResults: TotalResults | null = null;
  maxAttackerProfiles = 4;
  maxDefenderProfiles = 4; // Added maxDefenderProfiles
  isEditingTitle = false;
  sectionTitle = 'PERFILES DEL ATACANTE';
  currentTheme$: Observable<string>;

  // Custom ripple configuration for subtle feedback
  rippleColor = 'var(--color-accent-glow)';
  rippleAnimation = { enterDuration: 250, exitDuration: 150 };

  private ngUnsubscribe = new Subject<void>();

  @HostListener('window:keydown', ['$event'])
  handleKeyboardShortcuts(event: KeyboardEvent): void {
    if (event.metaKey) {
      const key = event.key.toLowerCase();
      if (key === 'a' && event.shiftKey) {
        event.preventDefault();
        this.addAttackerProfile();
      } else if (key === 'd' && event.shiftKey) {
        event.preventDefault();
        this.addDefenderProfile();
      } else if (key === 'enter') {
        event.preventDefault();
        this.calculate();
      }
    }
  }

  constructor(
    public attackerProfileService: AttackerProfileService,
    private defenderProfileService: DefenderProfileService,
    private calculationService: CalculationService,
    private cdr: ChangeDetectorRef,
    private themeService: ThemeService // Inject ThemeService
  ) {
    this.currentTheme$ = this.themeService.currentTheme$; // Assign to local property
  }

  ngOnInit(): void {
    // Initialize with one attacker profile
    this.addAttackerProfile();
    
    // Initialize with one defender profile
    this.addDefenderProfile();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  addAttackerProfile(): void {
    if (this.attackerProfiles.length < this.maxAttackerProfiles) {
      const newProfile: AttackerProfile = {
        id: Date.now() + Math.random(),
        name: `Perfil de Atacante ${this.attackerProfiles.length + 1}`,
        data: { ...DEFAULT_ATTACKER_PROFILE_DATA }
      };
      this.attackerProfiles.push(newProfile);
    }
  }

  removeAttackerProfile(index: number): void {
    if (this.attackerProfiles.length > 1) {
      this.attackerProfiles.splice(index, 1);
    } else {
      // If only one profile, purge instead of delete
      this.resetAttackerProfile(index);
    }
  }

  resetAttackerProfile(index: number): void {
    this.attackerProfiles[index] = {
      id: Date.now() + Math.random(),
      name: `Perfil de Atacante ${index + 1}`,
      data: { ...DEFAULT_ATTACKER_PROFILE_DATA }
    };
  }

  duplicateAttackerProfile(index: number): void {
    if (this.attackerProfiles.length < this.maxAttackerProfiles) {
      const originalProfile = this.attackerProfiles[index];

      if (!originalProfile) {
        return;
      }

      const duplicatedProfile: AttackerProfile = {
        id: Date.now() + Math.random(),
        name: `${originalProfile.name} (Copia)`,
        data: JSON.parse(JSON.stringify(originalProfile.data))
      };
      
      this.attackerProfiles.splice(index + 1, 0, duplicatedProfile);
    }
  }

  updateAttackerProfile(updatedProfile: AttackerProfile, index: number): void {
    if (index >= 0 && index < this.attackerProfiles.length) {
      this.attackerProfiles[index] = updatedProfile;
    }
  }

  addDefenderProfile(): void {
    if (this.defenderProfiles.length < this.maxDefenderProfiles) {
      const newProfile: DefenderProfile = {
        ...DEFAULT_DEFENDER_PROFILE,
        id: `defender-${Date.now()}-${Math.random()}`,
        name: `Perfil de Defensor ${this.defenderProfiles.length + 1}`,
        saveOrder: this.defenderProfiles.length + 1
      };
      this.defenderProfiles.push(newProfile);
    }
  }

  removeDefenderProfile(index: number): void {
    if (this.defenderProfiles.length > 1) {
      this.defenderProfiles.splice(index, 1);
    } else {
      this.resetDefenderProfile(index);
    }
  }

  resetDefenderProfile(index: number): void {
    this.defenderProfiles[index] = {
      ...DEFAULT_DEFENDER_PROFILE,
      id: `defender-${Date.now()}-${Math.random()}`,
      name: `Perfil de Defensor ${index + 1}`,
      saveOrder: index + 1
    };
  }

  duplicateDefenderProfile(index: number): void {
    if (this.defenderProfiles.length < this.maxDefenderProfiles) {
      const originalProfile = this.defenderProfiles[index];

      if (!originalProfile) {
        return;
      }

      const duplicatedProfile: DefenderProfile = {
        ...JSON.parse(JSON.stringify(originalProfile)), // Deep copy
        id: `defender-${Date.now()}-${Math.random()}`,
        name: `${originalProfile.name} (Copia)`,
        // saveOrder will be copied, might need adjustment based on UI/UX for ordering
      };
      
      this.defenderProfiles.splice(index + 1, 0, duplicatedProfile);
    }
  }

  updateDefenderProfile(updatedProfile: DefenderProfile, index: number): void { // Added index parameter
    if (index >= 0 && index < this.defenderProfiles.length) { // Check bounds
      this.defenderProfiles[index] = updatedProfile;
    }
  }

  trackByProfileId(index: number, profile: AttackerProfile | DefenderProfile): string | number { // Changed return type
    return profile.id;
  }

  // Section title editing methods
  startEditingTitle(): void {
    this.isEditingTitle = true;
  }

  stopEditingTitle(): void {
    this.isEditingTitle = false;
  }

  updateSectionTitle(event: Event): void {
    const newTitle = (event.target as HTMLInputElement).value;
    this.sectionTitle = newTitle;
  }

  // Action methods for section header
  copyAllProfiles(): void {
    // Create copies of all profiles
    const copiesToAdd: AttackerProfile[] = [];
    for (const profile of this.attackerProfiles) {
      if (this.attackerProfiles.length + copiesToAdd.length < this.maxAttackerProfiles) {
        const copy: AttackerProfile = {
          id: Date.now() + Math.random(),
          name: `${profile.name} (Copia)`,
          data: JSON.parse(JSON.stringify(profile.data))
        };
        copiesToAdd.push(copy);
      }
    }
    this.attackerProfiles.push(...copiesToAdd);
  }

  deleteAllProfiles(): void {
    this.attackerProfiles = [];
    this.addAttackerProfile(); // Always keep at least one profile
  }

  calculate(): void {
    if (this.attackerProfiles.length > 0 && this.defenderProfiles.length > 0) { // Check defenderProfiles length
      this.calculationResults = this.calculationService.calculateTotalDamage(
        this.attackerProfiles,
        this.defenderProfiles // Pass the array of defender profiles
      );
    } else {
      this.calculationResults = null;
    }
  }

  resetCalculator(): void {
    this.attackerProfiles = [];
    this.defenderProfiles = []; // Reset defenderProfiles array
    this.calculationResults = null;
    this.addAttackerProfile();
    this.addDefenderProfile(); // Add initial defender profile
  }
}