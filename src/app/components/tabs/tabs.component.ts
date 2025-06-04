import { Component, AfterContentInit, ContentChildren, QueryList, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabComponent } from './tab.component';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule, TabComponent],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs!: QueryList<TabComponent>;
  activeIndex = 0;

  @HostBinding('style.--tab-count') get tabCount(): number {
    return this.tabs?.length || 0;
  }

  ngAfterContentInit(): void {
    const active = this.tabs.toArray().findIndex(tab => tab.active);
    this.activeIndex = active >= 0 ? active : 0;
  }

  selectTab(index: number): void {
    this.activeIndex = index;
  }

  onKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      const next = index + 1 >= this.tabs.length ? 0 : index + 1;
      this.selectTab(next);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      const prev = index === 0 ? this.tabs.length - 1 : index - 1;
      this.selectTab(prev);
    }
  }
}
