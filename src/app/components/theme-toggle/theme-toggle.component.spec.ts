import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ThemeToggleComponent } from './theme-toggle.component';
import { ThemeService } from '../../services/theme.service';

class MockThemeService {
  theme = 'theme-imperium-light';
  getCurrentTheme() {
    return this.theme;
  }
  setTheme(theme: string) {
    this.theme = theme;
    localStorage.setItem('mathhammer-theme', theme);
  }
  setLightTheme() {
    this.setTheme('theme-imperium-light');
  }
  setDarkTheme() {
    this.setTheme('theme-chaos-dark');
  }
}

describe('ThemeToggleComponent', () => {
  let component: ThemeToggleComponent;
  let fixture: ComponentFixture<ThemeToggleComponent>;
  let service: MockThemeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeToggleComponent, NoopAnimationsModule],
      providers: [{ provide: ThemeService, useClass: MockThemeService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeToggleComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ThemeService) as unknown as MockThemeService;
    localStorage.clear();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with light mode', () => {
    expect(component.isDarkMode).toBeFalse();
  });

  it('should toggle to dark mode and persist', () => {
    component.toggleTheme(true);
    expect(service.theme).toBe('theme-chaos-dark');
    expect(localStorage.getItem('mathhammer-theme')).toBe('theme-chaos-dark');
  });

  it('should toggle to light mode and persist', () => {
    component.toggleTheme(false);
    expect(service.theme).toBe('theme-imperium-light');
    expect(localStorage.getItem('mathhammer-theme')).toBe(
      'theme-imperium-light'
    );
  });
});
