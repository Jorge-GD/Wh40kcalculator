import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ThemeService } from './services/theme.service';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true, // Added standalone: true
  imports: [
    RouterOutlet,
    MatSelectModule,
    MatFormFieldModule,
    CommonModule,
    HeaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'mathhammer-ng';
  availableThemes: { name: string; value: string }[] = [];
  currentTheme: string = '';

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.availableThemes = this.themeService.getAvailableThemes();
    this.themeService.currentTheme$.subscribe((theme: string) => {
      // Explicitly type theme
      this.currentTheme = theme;
    });
  }

  onThemeChange(themeValue: string): void {
    this.themeService.setTheme(themeValue);
  }
}
