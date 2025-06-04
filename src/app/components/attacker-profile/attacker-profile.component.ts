import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'; // Import MatMenuTrigger

import {
  AttackerProfile,
  AttackerProfileData,
  DEFAULT_ATTACKER_PROFILE_DATA,
} from '../../models/attacker-profile.model';
import { AttackerProfileService } from '../../services/attacker-profile.service';
import { ThemeService } from '../../services/theme.service'; // Import ThemeService
import { Subscription } from 'rxjs'; // Import Subscription

@Component({
  selector: 'app-attacker-profile',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatExpansionModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatCardModule,
    MatToolbarModule,
    MatTabsModule, // Add MatTabsModule here
    MatMenuModule, // Add MatMenuModule here
  ],
  templateUrl: './attacker-profile.component.html',
  styleUrls: ['./attacker-profile.component.scss'],
})
export class AttackerProfileComponent implements OnInit, OnDestroy {
  @Input() profile!: AttackerProfile;
  @Input() profileIndex!: number;
  @Input() isOnlyProfile!: boolean;

  @Output() removeProfile = new EventEmitter<number>();
  @Output() duplicateProfile = new EventEmitter<number>();
  @Output() profileChange = new EventEmitter<AttackerProfile>();

  profileData!: AttackerProfileData;
  isEditingName = false;
  activeField: string | null = null;
  showAdvancedCritHits: boolean = false; // Declare showAdvancedCritHits
  showAdvancedCritWounds: boolean = false; // Declare showAdvancedCritWounds
  showAttacksIndicator: boolean = false; // Declare showAttacksIndicator

  currentTheme: string = ''; // Add currentTheme property
  private themeSubscription!: Subscription; // Add themeSubscription property

  // Reference to MatMenuTrigger for programmatic control (optional, if needed beyond template)
  // @ViewChild('attacksMenuTrigger') attacksMenuTrigger!: MatMenuTrigger;
  // @ViewChild('skillMenuTrigger') skillMenuTrigger!: MatMenuTrigger;
  // etc. for all triggers if direct access from TS is needed for other purposes

  constructor(
    private cdr: ChangeDetectorRef,
    private themeService: ThemeService, // Inject ThemeService
    private attackerProfileService: AttackerProfileService // Inject AttackerProfileService
  ) {}

  ngOnInit(): void {
    this.profileData = this.profile
      ? { ...this.profile.data }
      : { ...DEFAULT_ATTACKER_PROFILE_DATA };
    // Subscribe to theme changes
    this.themeSubscription = this.themeService.currentTheme$.subscribe(
      (theme) => {
        this.currentTheme = theme;
        this.cdr.markForCheck(); // Trigger change detection if needed
      }
    );
  }

  ngOnDestroy(): void {
    // Implement ngOnDestroy
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  onProfileDataChange(): void {
    // Synchronize profile data before emitting changes
    this.profile.data = { ...this.profileData };
    // Emit changes to the parent component
    this.profileChange.emit({ ...this.profile, data: { ...this.profileData } });
  }

  onRemoveProfile(): void {
    this.removeProfile.emit(this.profileIndex);
  }
  onDuplicateProfile(): void {
    // Ensure profile data is synchronized before duplication
    this.profile.data = { ...this.profileData };
    this.duplicateProfile.emit(this.profileIndex);
  }

  toggleAdvancedCritHits(): void {
    this.showAdvancedCritHits = !this.showAdvancedCritHits;
  }

  toggleAdvancedCritWounds(): void {
    this.showAdvancedCritWounds = !this.showAdvancedCritWounds;
  }

  onFocusField(field: keyof AttackerProfileData): void {
    if (this.profile && this.profile.id) {
      this.attackerProfileService.setFocusOnField(this.profile.id, field);
    }
  }

  updateProfileName(event: Event): void {
    const newName = (event.target as HTMLInputElement).value;
    if (this.profile) {
      this.profile.name = newName;
      // Ensure profile data is also synchronized
      this.profile.data = { ...this.profileData };
      this.onProfileDataChange(); // Notify parent about the name change as well
    }
  }

  startEditingName(): void {
    this.isEditingName = true;
  }

  stopEditingName(): void {
    this.isEditingName = false;
  }

  onResetProfile(): void {
    this.profileData = { ...DEFAULT_ATTACKER_PROFILE_DATA };
    this.onProfileDataChange();
    // Ensure advanced protocols are hidden when resetting, if desired, or matching default state
    // this.showAdvancedProtocols = false; // Optional: uncomment if reset should always hide advanced
  }

  toggleAttacksVisibility(): void {
    this.showAttacksIndicator = !this.showAttacksIndicator;
  }
  // Getters for active abilities summary
  get activeHitProtocolsSummary(): string[] {
    const summary: string[] = [];
    if (!this.profileData) return summary;

    if (this.profileData.hitRerollType !== 'none') {
      summary.push(
        `Rep. Impacto: ${this.profileData.hitRerollType === 'ones' ? '1s' : 'Todos'}`
      );
    }
    if (
      this.profileData.shootingModifier?.active &&
      this.profileData.shootingModifier.value !== 0
    ) {
      const modValue =
        this.profileData.shootingModifier.value > 0
          ? `+${this.profileData.shootingModifier.value}`
          : `${this.profileData.shootingModifier.value}`;
      summary.push(`Mod. Disparo: ${modValue}`);
    }
    if (
      this.profileData.critHitMod?.active &&
      this.profileData.critHitMod.value
    ) {
      summary.push(`Impacto Crít. ${this.profileData.critHitMod.value}+`);
    }
    if (
      this.profileData.sustainedHits?.active &&
      this.profileData.sustainedHits.value
    ) {
      summary.push(`Sostenidos ${this.profileData.sustainedHits.value}`);
    }
    if (this.profileData.lethalHits?.active) {
      summary.push('Letales');
    }
    if (
      this.profileData.rapidFire?.active &&
      this.profileData.rapidFire.value
    ) {
      summary.push(`Rápido ${this.profileData.rapidFire.value}`);
    }
    if (this.profileData.torrent) {
      summary.push('Torrente');
    }
    if (this.profileData.blast) {
      summary.push('Blast');
    }
    return summary;
  }

  get activeWoundProtocolsSummary(): string[] {
    const summary: string[] = [];
    if (!this.profileData) return summary;

    if (this.profileData.woundModifiers !== 'none') {
      let modText = '+1 Herir';
      if (this.profileData.woundModifiers === 'lance') {
        modText += ` (Lanza${this.profileData.lance?.charged ? ', Cargó' : ''})`;
      }
      summary.push(modText);
    }
    if (
      this.profileData.woundRerollType !== 'none' &&
      !this.profileData.twinLinked?.active
    ) {
      summary.push(
        `Rep. Herir: ${this.profileData.woundRerollType === 'ones' ? '1s' : this.profileData.woundRerollType === 'failures' ? 'Fallos' : 'Todos'}`
      );
    }
    if (this.profileData.twinLinked?.active) {
      summary.push('Emparejado (Rep. Herir Fallos)');
    }
    if (this.profileData.devastatingWounds?.active) {
      summary.push('Devastadoras');
    }
    if (this.profileData.anti?.active && this.profileData.anti.value) {
      summary.push(
        `Anti-${this.profileData.antiKeyword || 'X'} ${this.profileData.anti.value}+`
      );
    }
    if (this.profileData.melta?.active && this.profileData.melta.value) {
      summary.push(
        `Fusión ${this.profileData.melta.value}${this.profileData.melta.inRange ? ' (Corto Alc.)' : ''}`
      );
    }
    return summary;
  }

  get activeDamageProtocolsSummary(): string[] {
    const summary: string[] = [];
    if (!this.profileData) return summary;

    if (
      this.profileData.extraMortals?.active &&
      this.profileData.extraMortals.amount &&
      this.profileData.extraMortals.on
    ) {
      summary.push(
        `Mortales Adic.: ${this.profileData.extraMortals.amount} en ${this.profileData.extraMortals.on}+`
      );
    }
    return summary;
  }

  // Helper to prevent non-numeric input, allowing "d" and "+"
  filterNumericDiceInput(event: KeyboardEvent): void {
    const allowedChars = /[0-9dD+]/;
    if (
      !allowedChars.test(event.key) &&
      !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(
        event.key
      )
    ) {
      event.preventDefault();
    }
  }

  public handleInputEnterKey(menuTrigger: MatMenuTrigger): void {
    if (menuTrigger) {
      menuTrigger.closeMenu();
    }
  }

  // Toggle protocol activation methods
  toggleProtocol(protocolName: string): void {
    switch (protocolName) {
      case 'critHitMod':
        if (!this.profileData.critHitMod) {
          this.profileData.critHitMod = { active: false, value: 5 };
        }
        this.profileData.critHitMod.active =
          !this.profileData.critHitMod.active;
        break;

      case 'sustainedHits':
        this.profileData.sustainedHits.active =
          !this.profileData.sustainedHits.active;
        if (!this.profileData.sustainedHits.value) {
          this.profileData.sustainedHits.value = 1;
        }
        break;

      case 'lethalHits':
        this.profileData.lethalHits.active =
          !this.profileData.lethalHits.active;
        break;

      case 'rapidFire':
        if (!this.profileData.rapidFire) {
          this.profileData.rapidFire = { active: false, value: 1 };
        }
        this.profileData.rapidFire.active = !this.profileData.rapidFire.active;
        if (!this.profileData.rapidFire.value) {
          this.profileData.rapidFire.value = 1;
        }
        break;

      case 'torrent':
        this.profileData.torrent = !this.profileData.torrent;
        break;

      case 'blast':
        this.profileData.blast = !this.profileData.blast;
        break;

      case 'lance':
        if (!this.profileData.lance) {
          this.profileData.lance = { active: false, charged: false };
        }
        this.profileData.lance.charged = !this.profileData.lance.charged;
        break;

      case 'twinLinked':
        this.profileData.twinLinked.active =
          !this.profileData.twinLinked.active;
        break;

      case 'devastatingWounds':
        this.profileData.devastatingWounds.active =
          !this.profileData.devastatingWounds.active;
        break;

      case 'anti':
        if (!this.profileData.anti) {
          this.profileData.anti = { active: false, value: 4 };
        }
        this.profileData.anti.active = !this.profileData.anti.active;
        if (!this.profileData.antiKeyword) {
          this.profileData.antiKeyword = 'INFANTERÍA';
        }
        break;

      case 'melta':
        if (!this.profileData.melta) {
          this.profileData.melta = {
            active: false,
            value: 'D3',
            inRange: false,
          };
        }
        this.profileData.melta.active = !this.profileData.melta.active;
        break;

      case 'meltaRange':
        if (this.profileData.melta) {
          this.profileData.melta.inRange = !this.profileData.melta.inRange;
        }
        break;

      case 'extraMortals':
        if (!this.profileData.extraMortals) {
          this.profileData.extraMortals = {
            active: false,
            on: 6,
            amount: 'D3',
          };
        }
        this.profileData.extraMortals.active =
          !this.profileData.extraMortals.active;
        break;

      default:
        console.warn(`Unknown protocol: ${protocolName}`);
        return;
    }

    this.onProfileDataChange();
  }

  // Open protocol modal for complex configuration
  openProtocolModal(protocolName: string): void {
    switch (protocolName) {
      case 'shootingModifier':
        // For now, cycle through the values: 0 -> +1 -> -1 -> 0
        if (!this.profileData.shootingModifier) {
          this.profileData.shootingModifier = { active: true, value: 1 };
        } else {
          const currentValue = this.profileData.shootingModifier.value;
          if (currentValue === 0) {
            this.profileData.shootingModifier.value = 1;
            this.profileData.shootingModifier.active = true;
          } else if (currentValue === 1) {
            this.profileData.shootingModifier.value = -1;
            this.profileData.shootingModifier.active = true;
          } else {
            this.profileData.shootingModifier.value = 0;
            this.profileData.shootingModifier.active = false;
          }
        }
        break;

      default:
        console.warn(`No modal configuration for protocol: ${protocolName}`);
        return;
    }

    this.onProfileDataChange();
  }
}
