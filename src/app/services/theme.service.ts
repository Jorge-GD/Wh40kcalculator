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
        // Set initial color-scheme meta tag based on stored theme
        const isLightTheme = storedTheme.includes('light');
        this.updateColorSchemeMeta(isLightTheme ? 'light' : 'dark');
      } else {
        this.setThemeInternal(this.currentThemeClassName);
        // Set initial color-scheme meta tag for default theme
        const isLightTheme = this.currentThemeClassName.includes('light');
        this.updateColorSchemeMeta(isLightTheme ? 'light' : 'dark');
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

  /**
   * Sets the light theme without causing a dark flash during theme transition.
   * This method adds the theme-light class to the <html> element and uses
   * requestAnimationFrame to ensure smooth theme transitions.
   */
  public setLightTheme(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.setTheme('theme-imperium-light');
      return;
    }

    const htmlElement = this.document.documentElement;
    const lightThemeClass = 'theme-light';
    const imperiumLightTheme = 'theme-imperium-light';

    // First, add the theme-light class to html element to prepare for transition
    this.renderer.addClass(htmlElement, lightThemeClass);

    // Remove any existing dark theme classes immediately
    this.availableThemes.forEach((theme) => {
      if (theme.value !== imperiumLightTheme) {
        this.renderer.removeClass(this.document.body, theme.value);
      }
    });

    // Use requestAnimationFrame to ensure the DOM has been updated
    // This prevents the dark flash by allowing the browser to complete
    // the first paint with the theme-light class applied
    requestAnimationFrame(() => {
      // Apply the full light theme class to body
      this.setThemeInternal(imperiumLightTheme);

      // After the theme is applied, we can safely handle prefers-color-scheme
      // by updating the meta tag or applying additional light theme optimizations
      requestAnimationFrame(() => {
        // Ensure the html element retains the theme-light class for CSS targeting
        this.renderer.addClass(htmlElement, lightThemeClass);

        // Optional: Update any color-scheme meta tag for better browser integration
        this.updateColorSchemeMeta('light');
      });
    });
  }

  /**
   * Updates the color-scheme meta tag to inform the browser about the current theme preference.
   * This helps with browser chrome elements and prevents flash of incorrect theme.
   */
  private updateColorSchemeMeta(scheme: 'light' | 'dark'): void {
    if (!isPlatformBrowser(this.platformId)) return;

    let metaTag = this.document.querySelector('meta[name="color-scheme"]');

    if (!metaTag) {
      metaTag = this.renderer.createElement('meta');
      this.renderer.setAttribute(metaTag, 'name', 'color-scheme');
      this.renderer.appendChild(this.document.head, metaTag);
    }

    this.renderer.setAttribute(metaTag, 'content', scheme);
  }

  /**
   * Sets the dark theme with smooth transition handling.
   * Companion method to setLightTheme() for consistent theme switching.
   */
  public setDarkTheme(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.setTheme('theme-chaos-dark');
      return;
    }

    const htmlElement = this.document.documentElement;
    const lightThemeClass = 'theme-light';
    const darkThemeClass = 'theme-dark';
    const chaosDarkTheme = 'theme-chaos-dark';

    // Remove light theme class and add dark theme class to html element
    this.renderer.removeClass(htmlElement, lightThemeClass);
    this.renderer.addClass(htmlElement, darkThemeClass);

    // Use requestAnimationFrame for smooth transition
    requestAnimationFrame(() => {
      this.setThemeInternal(chaosDarkTheme);

      requestAnimationFrame(() => {
        // Ensure the html element retains the theme-dark class for CSS targeting
        this.renderer.addClass(htmlElement, darkThemeClass);
        this.updateColorSchemeMeta('dark');
      });
    });
  }
}
