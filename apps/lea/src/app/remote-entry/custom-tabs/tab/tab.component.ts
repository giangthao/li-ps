import { CommonModule } from "@angular/common";
import { Component, ContentChild, Input, TemplateRef } from "@angular/core";


@Component({
    selector: 'app-tab',
    templateUrl: './tab.component.html',
    // styleUrls: ['../custom-tabs.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class TabComponent{
    @Input() tabTitle = '';  // Tiêu đề tab
    @Input() active = false;  // Trạng thái của tab, mặc định là không hoạt động
    @ContentChild(TemplateRef) content!: TemplateRef<any> | null;
}