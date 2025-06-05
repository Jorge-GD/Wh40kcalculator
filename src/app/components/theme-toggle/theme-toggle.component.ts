import { Component, OnInit, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss'],
})
export class ThemeToggleComponent implements OnInit {
  isDarkMode = false;

  @HostBinding('class.dark-mode')
  get darkModeClass() {
    return this.isDarkMode;
  }

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.isDarkMode =
      this.themeService.getCurrentTheme() !== 'theme-imperium-light';
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.themeService.setDarkTheme();
    } else {
      this.themeService.setLightTheme();
    }
  }
}
