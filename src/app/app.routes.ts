import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/calculator', pathMatch: 'full' },
  {
    path: 'calculator',
    loadComponent: () =>
      import('./components/calculator/calculator.component').then(
        (m) => m.CalculatorComponent
      ),
  },
  {
    path: 'attacker-profile',
    loadComponent: () =>
      import('./components/attacker-profile/attacker-profile.component').then(
        (m) => m.AttackerProfileComponent
      ),
  },
  {
    path: 'defender-profile',
    loadComponent: () =>
      import('./components/defender-profile/defender-profile.component').then(
        (m) => m.DefenderProfileComponent
      ),
  },
];
