import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculationResult, TotalResults } from '../../models/calculation-result.model';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent {
  @Input() calculationResults: CalculationResult[] = [];
  @Input() totalResults: TotalResults | null = null;

  // Helper to prevent NaN or Infinity in template, defaulting to 0
  formatNumber(value: number | undefined | null): number {
    if (value === undefined || value === null || isNaN(value) || !isFinite(value)) {
      return 0;
    }
    return parseFloat(value.toFixed(2)); // Or any other precision you need
  }

  get overallTotalDamage(): number {
    return this.totalResults ? this.formatNumber(this.totalResults.totalDamage) : 0;
  }

  get overallModelsDestroyed(): number {
    return this.totalResults ? this.formatNumber(this.totalResults.totalModelsKilled) : 0;
  }
}
