import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/calculator', pathMatch: 'full' },
  {
    path: 'calculator',
    loadComponent: () =>
      import('./components/calculator/calculator.component').then(
        (m) => m.CalculatorComponent
      ),
    data: { animation: 'CalculatorPage' },
  },
  {
    path: 'attacker-profile',
    loadComponent: () =>
      import('./components/attacker-profile/attacker-profile.component').then(
        (m) => m.AttackerProfileComponent
      ),
    data: { animation: 'AttackerProfilePage' },
  },
  {
    path: 'defender-profile',
    loadComponent: () =>
      import('./components/defender-profile/defender-profile.component').then(
        (m) => m.DefenderProfileComponent
      ),
    data: { animation: 'DefenderProfilePage' },
  },
];
