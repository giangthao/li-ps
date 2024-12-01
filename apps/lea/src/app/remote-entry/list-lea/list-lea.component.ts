import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    imports: [CommonModule, TranslateModule ],
    selector: 'app-list-lea',
    templateUrl: './list-lea.component.html',
    styleUrls: ['./list-lea.component.scss'],
    standalone: true
})
export class ListLeaComponent{

}