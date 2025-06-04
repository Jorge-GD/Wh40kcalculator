import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DefenderProfile } from '../../models/defender-profile.model';
import { Subscription } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs'; // Provides tab functionality
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'; // Menu support
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-defender-profile',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatCardModule,
    MatChipsModule,
    MatTabsModule, // Provides tab functionality
    MatMenuModule, // Menu support
  ],
  templateUrl: './defender-profile.component.html',
  styleUrls: ['./defender-profile.component.scss'],
})
export class DefenderProfileComponent implements OnInit {
  @Input() profile!: DefenderProfile;
  @Input() profileIndex!: number;
  @Input() isOnlyProfile!: boolean;

  @Output() profileChange = new EventEmitter<DefenderProfile>();
  @Output() removeProfile = new EventEmitter<number>();
  @Output() duplicateProfile = new EventEmitter<number>();

  isEditingName = false;
  private profileSubscription!: Subscription;

  currentTheme: string = '';
  private themeSubscription!: Subscription;

  constructor(
    private themeService: ThemeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!this.profile) {
      console.error(
        'Defender profile not provided to app-defender-profile component'
      );
    }

    this.themeSubscription = this.themeService.currentTheme$.subscribe(
      (theme) => {
        this.currentTheme = theme;
        this.cdr.markForCheck();
      }
    );
  }

  ngOnDestroy(): void {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  onProfileDataChange(): void {
    this.profileChange.emit(this.profile);
  }

  emitRemoveProfile(): void {
    this.removeProfile.emit(this.profileIndex);
  }

  emitDuplicateProfile(): void {
    this.duplicateProfile.emit(this.profileIndex);
  }

  startEditingName(): void {
    this.isEditingName = true;
  }

  stopEditingName(): void {
    this.isEditingName = false;
    this.onProfileDataChange();
  }

  updateProfileName(event: Event): void {
    const newName = (event.target as HTMLInputElement).value;
    if (this.profile) {
      this.profile.name = newName;
    }
  }

  // New getter methods for defensive ability summaries
  get coverSummary(): string | null {
    return this.profile.defenderInCover ? 'En Cobertura' : null;
  }

  get modToBeHitSummary(): string | null {
    return this.profile.defenderModToBeHit ? '-1 a ser Impactado' : null;
  }

  get modToBeWoundedSummary(): string | null {
    return this.profile.defenderModToBeWounded ? '-1 a Herir' : null;
  }

  get reduceApSummary(): string | null {
    return this.profile.defenderReduceAp ? 'Reduce PA -1' : null;
  }

  get halveDamageSummary(): string | null {
    return this.profile.defenderHalveDamage ? 'Daño /2' : null;
  }

  get reduceDamageFlatSummary(): string | null {
    return this.profile.defenderReduceDamageFlat ? 'Daño -1' : null;
  }

  get fnpSummary(): string | null {
    if (!this.profile.feelNoPain.active) return null;
    let summary = `FNP ${this.profile.feelNoPain.value}+`;
    if (this.profile.feelNoPain.vsMortalsActive) {
      summary += ` (Mortales ${this.profile.feelNoPain.vsMortalsValue}+)`;
    }
    return summary;
  }

  get activeDefensiveAbilities(): string[] {
    const abilities: (string | null)[] = [
      this.coverSummary,
      this.modToBeHitSummary,
      this.modToBeWoundedSummary,
      this.reduceApSummary,
      this.halveDamageSummary,
      this.reduceDamageFlatSummary,
      this.fnpSummary,
    ];
    return abilities.filter((ability) => ability !== null) as string[];
  }

  // Method to close mat-menu when Enter is pressed on an input inside it
  public handleInputEnterKey(menuTrigger: MatMenuTrigger): void {
    if (menuTrigger) {
      menuTrigger.closeMenu();
    }
  }
}
