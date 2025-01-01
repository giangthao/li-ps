import { CommonModule } from "@angular/common";
import { AfterContentInit, Component, ContentChildren, QueryList } from "@angular/core";
import { TabComponent } from "./tab/tab.component";
import { trigger, transition, style, animate, query } from '@angular/animations';

@Component({
    selector: 'app-custom-tabs',
    templateUrl: './custom-tabs.component.html',
    styleUrls: ['./custom-tabs.component.scss'],
    standalone: true,
    imports: [CommonModule],
    animations: [
      trigger('tabAnimation', [
        transition(':enter', [
          style({ transform: 'translateX(100%)' }),
          animate('300ms ease-out', style({ transform: 'translateX(0)' }))
        ]),
        transition(':leave', [
          animate('300ms ease-in', style({ transform: 'translateX(-100%)' }))
        ])
      ])
    ]
})
export class CustomTabsComponent implements AfterContentInit{
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent> = new QueryList<never>();
  selectedTabIndex = 0;

  ngAfterContentInit() : void {
    const activeTabs = this.tabs.toArray().filter(tab => tab.active);
    if (activeTabs.length === 0) {
      this.selectTab(0); // Chọn tab mặc định nếu không có tab nào active
    }
  }

  selectTab(index: number) {
    // const previousTab = this.tabs.toArray()[this.selectedTabIndex];
    // previousTab.active = false; // Ẩn tab cũ

    // const currentTab = this.tabs.toArray()[index];
    // currentTab.active = true; // Hiển thị tab mới
    this.selectedTabIndex = index;
  }

}