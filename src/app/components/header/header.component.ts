import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ThemeService } from '../../services/theme.service';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatFormFieldModule, ThemeToggleComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  availableThemes: { name: string; value: string }[] = [];
  currentTheme = '';

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.availableThemes = this.themeService.getAvailableThemes();
    this.themeService.currentTheme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  onThemeChange(themeValue: string): void {
    this.themeService.setTheme(themeValue);
  }
}
