import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss'],
})
export class ThemeToggleComponent implements OnInit {
  isDarkMode = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.isDarkMode =
      this.themeService.getCurrentTheme() !== 'theme-imperium-light';
  }

  toggleTheme(checked: boolean): void {
    this.isDarkMode = checked;
    const newTheme = checked ? 'theme-chaos-dark' : 'theme-imperium-light';
    this.themeService.setTheme(newTheme);
  }
}
