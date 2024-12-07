import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NotFoundComponent, TestComponent } from '@lea/components';

@Component({
  imports: [CommonModule, TranslateModule, NotFoundComponent, TestComponent],
  selector: 'app-list-lea',
  templateUrl: './list-lea.component.html',
  styleUrls: ['./list-lea.component.scss'],
  standalone: true,
})
export class ListLeaComponent {}
