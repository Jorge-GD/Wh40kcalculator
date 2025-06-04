import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-profile-panel',
  standalone: true,
  templateUrl: './profile-panel.component.html',
  styleUrls: ['./profile-panel.component.scss'],
})
export class ProfilePanelComponent {
  /** Controls whether the panel is expanded. */
  @Input() expanded = true;

  toggle(): void {
    this.expanded = !this.expanded;
  }
}
