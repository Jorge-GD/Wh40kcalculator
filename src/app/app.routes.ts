import { Routes } from '@angular/router';
import { CalculatorComponent } from './components/calculator/calculator.component';

export const routes: Routes = [
    { path: '', redirectTo: '/calculator', pathMatch: 'full' },
    { path: 'calculator', component: CalculatorComponent }
];
