import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';

export interface ProtocolModalData {
  title: string;
  description: string;
  icon: string;
  fields: ProtocolField[];
  currentValues: { [key: string]: any };
}

export interface ProtocolField {
  key: string;
  label: string;
  type: 'number' | 'text' | 'select';
  placeholder?: string;
  min?: number;
  max?: number;
  options?: { value: any; label: string }[];
  tooltip?: string;
}

@Component({
  selector: 'app-protocol-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatRippleModule
  ],
  template: `
    <div class="protocol-modal">
      <div class="modal-header">
        <div class="modal-title-container">
          <mat-icon class="modal-icon">{{ data.icon }}</mat-icon>
          <h2 class="modal-title">{{ data.title }}</h2>
        </div>
        <button mat-icon-button (click)="onCancel()" class="close-button">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      
      <div class="modal-content">
        <p class="modal-description">{{ data.description }}</p>
        
        <div class="fields-container">
          <div *ngFor="let field of data.fields" class="field-container">
            
            <!-- Number Field -->
            <mat-form-field *ngIf="field.type === 'number'" appearance="outline" class="full-width">
              <mat-label>{{ field.label }}</mat-label>
              <input matInput
                     type="number"
                     [(ngModel)]="values[field.key]"
                     [placeholder]="field.placeholder || ''"
                     [min]="field.min"
                     [max]="field.max">
              <mat-icon *ngIf="field.tooltip" matSuffix [matTooltip]="field.tooltip">help_outline</mat-icon>
            </mat-form-field>
            
            <!-- Text Field -->
            <mat-form-field *ngIf="field.type === 'text'" appearance="outline" class="full-width">
              <mat-label>{{ field.label }}</mat-label>
              <input matInput
                     type="text"
                     [(ngModel)]="values[field.key]"
                     [placeholder]="field.placeholder || ''">
              <mat-icon *ngIf="field.tooltip" matSuffix [matTooltip]="field.tooltip">help_outline</mat-icon>
            </mat-form-field>
            
            <!-- Select Field -->
            <mat-form-field *ngIf="field.type === 'select'" appearance="outline" class="full-width">
              <mat-label>{{ field.label }}</mat-label>
              <mat-select [(ngModel)]="values[field.key]">
                <mat-option *ngFor="let option of field.options" [value]="option.value">
                  {{ option.label }}
                </mat-option>
              </mat-select>
              <mat-icon *ngIf="field.tooltip" matSuffix [matTooltip]="field.tooltip">help_outline</mat-icon>
            </mat-form-field>
            
          </div>
        </div>
      </div>
      
      <div class="modal-actions">
        <button mat-button (click)="onCancel()" class="cancel-button">
          Cancelar
        </button>
        <button mat-raised-button color="primary" (click)="onSave()" class="save-button"
                [matRippleColor]="rippleColor" [matRippleAnimation]="rippleAnimation">
          Guardar
        </button>
      </div>
    </div>
  `,
  styles: [`
    .protocol-modal {
      min-width: 400px;
      max-width: 600px;
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid var(--color-border-light);
    }
    
    .modal-title-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .modal-icon {
      color: var(--color-primary);
    }
    
    .modal-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 500;
      color: var(--color-text-primary);
    }
    
    .close-button {
      color: var(--color-text-secondary);
    }
    
    .modal-content {
      padding: 24px;
    }
    
    .modal-description {
      margin: 0 0 24px 0;
      color: var(--color-text-secondary);
      line-height: 1.5;
    }
    
    .fields-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .field-container {
      width: 100%;
    }
    
    .full-width {
      width: 100%;
    }
    
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px;
      border-top: 1px solid var(--color-border-light);
      background-color: var(--color-background-secondary);
    }
    
    .cancel-button {
      color: var(--color-text-secondary);
    }
    
    .save-button {
      background-color: var(--color-primary);
      color: var(--color-text-on-primary);
    }
  `]
})
export class ProtocolModalComponent {
  values: { [key: string]: any } = {};

  // Custom ripple configuration reused in buttons
  rippleColor = 'var(--color-accent-glow)';
  rippleAnimation = { enterDuration: 250, exitDuration: 150 };

  constructor(
    public dialogRef: MatDialogRef<ProtocolModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProtocolModalData
  ) {
    // Initialize values with current data
    this.values = { ...data.currentValues };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.values);
  }
}
