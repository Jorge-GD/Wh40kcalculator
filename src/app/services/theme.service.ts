import {
  Injectable,
  Renderer2,
  RendererFactory2,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;
  private currentThemeClassName = 'theme-imperium-light';
  private currentThemeSubject = new BehaviorSubject<string>(
    this.currentThemeClassName
  );
  private readonly THEME_STORAGE_KEY = 'selected-theme';

  public currentTheme$ = this.currentThemeSubject.asObservable();

  public readonly availableThemes: { name: string; value: string }[] = [
    { name: 'Light Imperial', value: 'theme-imperium-light' },
    { name: 'Dark Chaos', value: 'theme-chaos-dark' },
  ];

  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    if (isPlatformBrowser(this.platformId)) {
      const storedTheme = localStorage.getItem(this.THEME_STORAGE_KEY);
      if (
        storedTheme &&
        this.availableThemes.some((t) => t.value === storedTheme)
      ) {
        this.setThemeInternal(storedTheme, false);
      } else {
        this.setThemeInternal(this.currentThemeClassName);
      }
    } else {
      this.applyThemeClass(this.currentThemeClassName);
    }
  }

  private setThemeInternal(
    themeClassName: string,
    savePreference: boolean = true
  ): void {
    const oldTheme = this.currentThemeClassName;
    this.currentThemeClassName = themeClassName;
    this.currentThemeSubject.next(themeClassName);

    if (isPlatformBrowser(this.platformId)) {
      if (oldTheme) {
        this.renderer.removeClass(this.document.body, oldTheme);
      }
      this.renderer.addClass(this.document.body, themeClassName);

      if (savePreference) {
        localStorage.setItem(this.THEME_STORAGE_KEY, themeClassName);
      }
    } else {
      this.applyThemeClass(themeClassName);
    }
  }

  private applyThemeClass(themeClassName: string): void {
    this.renderer.addClass(this.document.body, themeClassName);
  }

  public setTheme(themeClassName: string): void {
    this.setThemeInternal(themeClassName);
  }

  public getCurrentTheme(): string {
    return this.currentThemeClassName;
  }

  public getAvailableThemes(): { name: string; value: string }[] {
    return this.availableThemes;
  }
}
