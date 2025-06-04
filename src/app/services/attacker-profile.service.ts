import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  AttackerProfile,
  AttackerProfileData,
  DEFAULT_ATTACKER_PROFILE_DATA,
} from '../models/attacker-profile.model';

@Injectable({
  providedIn: 'root',
})
export class AttackerProfileService {
  private readonly MAX_PROFILES = 4;
  private nextProfileId = 1;

  private attackerProfilesSubject = new BehaviorSubject<AttackerProfile[]>([]);
  public attackerProfiles$ = this.attackerProfilesSubject.asObservable();

  private currentFocusedProfileIdSubject = new BehaviorSubject<number>(1);
  public currentFocusedProfileId$ =
    this.currentFocusedProfileIdSubject.asObservable();

  constructor() {
    // Inicializar con un perfil por defecto
    this.addProfile();
  }

  getProfiles(): AttackerProfile[] {
    return this.attackerProfilesSubject.value;
  }

  addProfile(): AttackerProfile | null {
    const currentProfiles = this.attackerProfilesSubject.value;

    if (currentProfiles.length >= this.MAX_PROFILES) {
      return null;
    }

    const newProfile: AttackerProfile = {
      id: this.nextProfileId,
      name: `Perfil de Atacante ${currentProfiles.length + 1}`,
      data: { ...DEFAULT_ATTACKER_PROFILE_DATA },
    };

    const updatedProfiles = [...currentProfiles, newProfile];
    this.attackerProfilesSubject.next(updatedProfiles);
    this.currentFocusedProfileIdSubject.next(this.nextProfileId);
    this.nextProfileId++;

    return newProfile;
  }

  duplicateProfile(profileId: number): AttackerProfile | null {
    const currentProfiles = this.attackerProfilesSubject.value;

    if (currentProfiles.length >= this.MAX_PROFILES) {
      return null;
    }

    const originalProfile = currentProfiles.find((p) => p.id === profileId);
    if (!originalProfile) {
      return null;
    }

    const duplicatedProfile: AttackerProfile = {
      id: this.nextProfileId,
      name: `Perfil de Atacante ${currentProfiles.length + 1}`,
      data: { ...originalProfile.data },
    };

    const updatedProfiles = [...currentProfiles, duplicatedProfile];
    this.attackerProfilesSubject.next(updatedProfiles);
    this.currentFocusedProfileIdSubject.next(this.nextProfileId);
    this.nextProfileId++;

    return duplicatedProfile;
  }

  removeProfile(profileId: number): boolean {
    const currentProfiles = this.attackerProfilesSubject.value;

    if (currentProfiles.length <= 1) {
      return false; // No se puede eliminar el último perfil
    }

    const profileIndex = currentProfiles.findIndex((p) => p.id === profileId);
    if (profileIndex === -1) {
      return false;
    }

    const updatedProfiles = currentProfiles.filter((p) => p.id !== profileId);

    // Renumerar los nombres de los perfiles
    updatedProfiles.forEach((profile, index) => {
      profile.name = `Perfil de Atacante ${index + 1}`;
    });

    this.attackerProfilesSubject.next(updatedProfiles);

    // Actualizar el perfil enfocado si es necesario
    const currentFocusedId = this.currentFocusedProfileIdSubject.value;
    if (currentFocusedId === profileId) {
      const newFocusedId =
        profileIndex > 0 && profileIndex <= updatedProfiles.length
          ? updatedProfiles[profileIndex - 1].id
          : updatedProfiles[0].id;
      this.currentFocusedProfileIdSubject.next(newFocusedId);
    }

    return true;
  }

  updateProfile(
    profileId: number,
    data: Partial<AttackerProfileData>
  ): boolean {
    const currentProfiles = this.attackerProfilesSubject.value;
    const profileIndex = currentProfiles.findIndex((p) => p.id === profileId);

    if (profileIndex === -1) {
      return false;
    }

    const updatedProfiles = [...currentProfiles];
    updatedProfiles[profileIndex] = {
      ...updatedProfiles[profileIndex],
      data: { ...updatedProfiles[profileIndex].data, ...data },
    };

    this.attackerProfilesSubject.next(updatedProfiles);
    return true;
  }

  resetProfile(profileId: number): boolean {
    const currentProfiles = this.attackerProfilesSubject.value;
    const profileIndex = currentProfiles.findIndex((p) => p.id === profileId);

    if (profileIndex === -1) {
      return false;
    }

    const updatedProfiles = [...currentProfiles];
    updatedProfiles[profileIndex] = {
      ...updatedProfiles[profileIndex],
      data: { ...DEFAULT_ATTACKER_PROFILE_DATA },
    };

    this.attackerProfilesSubject.next(updatedProfiles);
    return true;
  }

  resetAllProfiles(): void {
    const currentProfiles = this.attackerProfilesSubject.value;
    const resetProfiles = currentProfiles.map((profile) => ({
      ...profile,
      data: { ...DEFAULT_ATTACKER_PROFILE_DATA },
    }));

    this.attackerProfilesSubject.next(resetProfiles);
  }

  setFocusedProfile(profileId: number): void {
    this.currentFocusedProfileIdSubject.next(profileId);
  }

  canAddMoreProfiles(): boolean {
    return this.attackerProfilesSubject.value.length < this.MAX_PROFILES;
  }

  getMaxProfiles(): number {
    return this.MAX_PROFILES;
  }

  getProfileById(id: number): AttackerProfile | undefined {
    return this.attackerProfilesSubject.value.find((p) => p.id === id);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setFocusOnField(..._args: [number, keyof AttackerProfileData]): void {
    // Placeholder for focusing logic. For now, it can simply log or be a no-op.
    // console.log(`Focus requested for profile ${profileId}, field ${String(fieldName)}`);
    // You could potentially emit an event here if other components need to react to field focus.
  }
}
