import { Component, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [CommonModule],
  template: '<ng-template><ng-content></ng-content></ng-template>',
})
export class TabComponent {
  @Input() label = '';
  @Input() active = false;
  @ContentChild(TemplateRef, { static: true }) content!: TemplateRef<unknown>;
}
