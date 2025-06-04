import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  DefenderProfile,
  DEFAULT_DEFENDER_PROFILE,
} from '../models/defender-profile.model';

@Injectable({
  providedIn: 'root',
})
export class DefenderProfileService {
  private defenderProfileSubject = new BehaviorSubject<DefenderProfile>(
    DEFAULT_DEFENDER_PROFILE
  );
  public defenderProfile$ = this.defenderProfileSubject.asObservable();

  constructor() {}

  getProfile(): DefenderProfile {
    return this.defenderProfileSubject.value;
  }

  updateProfile(profileData: Partial<DefenderProfile>): void {
    const currentProfile = this.defenderProfileSubject.value;
    const updatedProfile = { ...currentProfile, ...profileData };
    this.defenderProfileSubject.next(updatedProfile);
  }

  resetProfile(): void {
    this.defenderProfileSubject.next(DEFAULT_DEFENDER_PROFILE);
  }
}
