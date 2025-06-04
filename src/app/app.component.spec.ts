import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ThemeService } from './services/theme.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

// Mock del ThemeService
const mockThemeService = {
  getAvailableThemes: jasmine.createSpy('getAvailableThemes').and.returnValue([
    { name: 'Dark Theme', value: 'dark' },
    { name: 'Light Theme', value: 'light' }
  ]),
  currentTheme$: of('dark'),
  setTheme: jasmine.createSpy('setTheme')
};

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        NoopAnimationsModule,
        MatSelectModule,
        MatFormFieldModule,
        RouterTestingModule
      ],
      providers: [
        { provide: ThemeService, useValue: mockThemeService }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'mathhammer-ng' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('mathhammer-ng');
  });
  it('should render theme selector', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-select')).toBeTruthy();
    expect(compiled.querySelector('mat-label')?.textContent).toContain('Select Theme');
  });

  it('should initialize with available themes', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();
    expect(app.availableThemes).toEqual([
      { name: 'Dark Theme', value: 'dark' },
      { name: 'Light Theme', value: 'light' }
    ]);
    expect(app.currentTheme).toBe('dark');
  });
});
