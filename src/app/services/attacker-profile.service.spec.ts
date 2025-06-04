import { AttackerProfileService } from './attacker-profile.service';
import { DEFAULT_ATTACKER_PROFILE_DATA } from '../models/attacker-profile.model';

describe('AttackerProfileService', () => {
  let service: AttackerProfileService;

  beforeEach(() => {
    service = new AttackerProfileService();
  });

  it('should start with one profile', () => {
    expect(service.getProfiles().length).toBe(1);
  });

  it('should add profiles up to the max', () => {
    for (let i = 0; i < service.getMaxProfiles(); i++) {
      service.addProfile();
    }
    expect(service.getProfiles().length).toBe(service.getMaxProfiles());
    expect(service.addProfile()).toBeNull();
  });

  it('should duplicate an existing profile', () => {
    const original = service.getProfiles()[0];
    const dup = service.duplicateProfile(original.id);
    expect(dup).toBeTruthy();
    expect(service.getProfiles().length).toBe(2);
    expect(dup?.data).toEqual(original.data);
  });

  it('should remove a profile when more than one exists', () => {
    service.addProfile();
    const id = service.getProfiles()[0].id;
    const result = service.removeProfile(id);
    expect(result).toBeTrue();
    expect(service.getProfiles().length).toBe(1);
  });

  it('should not remove the last profile', () => {
    const id = service.getProfiles()[0].id;
    expect(service.removeProfile(id)).toBeFalse();
    expect(service.getProfiles().length).toBe(1);
  });

  it('should reset all profiles to defaults', () => {
    service.addProfile();
    service.updateProfile(service.getProfiles()[0].id, { attacks: '20' });
    service.resetAllProfiles();
    service.getProfiles().forEach((p) => {
      expect(p.data).toEqual(DEFAULT_ATTACKER_PROFILE_DATA);
    });
  });
});
