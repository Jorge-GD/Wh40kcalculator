import { Injectable, Renderer2, RendererFactory2, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { setTheme } from '../state/theme.actions';
import { selectCurrentTheme } from '../state/theme.reducer';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private currentThemeClassName: string = 'imperium-dark'; // Default theme

  // Observable for the current theme
  private currentThemeSubject = new BehaviorSubject<string>(this.currentThemeClassName);
  public currentTheme$ = this.currentThemeSubject.asObservable();

  public readonly availableThemes: { name: string, value: string }[] = [
    { name: 'Imperium Dark', value: 'theme-imperium-dark' },
    { name: 'Ork Rust', value: 'theme-ork-rust' },
    { name: 'Necrontyr Green', value: 'theme-necrontyr-green' },
    { name: 'Light Theme', value: 'light-theme' },
    { name: 'Imperium Light', value: 'theme-imperium-light' }
  ];

  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object,
    private store: Store
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    if (isPlatformBrowser(this.platformId)) {
      this.store.select(selectCurrentTheme).subscribe(theme => {
        this.setThemeInternal(theme);
      });
    }
  }


  private setThemeInternal(themeClassName: string): void {
    const oldTheme = this.currentThemeClassName;
    this.currentThemeClassName = themeClassName;
    this.currentThemeSubject.next(themeClassName); // Notify subscribers

    if (isPlatformBrowser(this.platformId)) {
      if (oldTheme) {
        this.renderer.removeClass(this.document.body, oldTheme);
      }
      this.renderer.addClass(this.document.body, themeClassName);
    } else {
      this.applyThemeClass(themeClassName);
    }
  }

  setTheme(themeClassName: string): void {
    this.store.dispatch(setTheme({ theme: themeClassName }));
  }

  private applyThemeClass(themeClassName: string): void {
    if (!this.document.body.classList.contains(themeClassName)) {
      this.availableThemes.forEach(theme => {
        if (theme.value !== themeClassName) {
          this.renderer.removeClass(this.document.body, theme.value);
        }
      });
      this.renderer.addClass(this.document.body, themeClassName);
    }
  }

  getCurrentTheme(): string {
    return this.currentThemeClassName;
  }

  getAvailableThemes(): { name: string, value: string }[] {
    return this.availableThemes;
  }

  getThemeByClassName(className: string): { name: string, value: string } | undefined {
    return this.availableThemes.find(t => t.value === className);
  }
}
