import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilePanelComponent } from './profile-panel.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ProfilePanelComponent', () => {
  let component: ProfilePanelComponent;
  let fixture: ComponentFixture<ProfilePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePanelComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle expanded state', () => {
    component.expanded = true;
    component.toggle();
    expect(component.expanded).toBeFalse();
  });
});
