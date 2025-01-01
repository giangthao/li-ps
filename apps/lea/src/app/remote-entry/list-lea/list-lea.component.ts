import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CheckConnectionComponent } from '../check-connection/check-connection.component';
import { Router } from '@angular/router';
import { CustomTabsComponent } from '../custom-tabs/custom-tabs.component';
import { TabComponent } from '../custom-tabs/tab/tab.component';
import {MatTabsModule} from '@angular/material/tabs';


@Component({
  imports: [CommonModule, TranslateModule, MatDialogModule, CustomTabsComponent, TabComponent, MatTabsModule],
  selector: 'app-list-lea',
  templateUrl: './list-lea.component.html',
  styleUrls: ['./list-lea.component.scss'],
  standalone: true,
})
export class ListLeaComponent {
  isDialogOpen = false;

  constructor(private readonly dialog: MatDialog, private readonly router: Router) {}

  openDialog() {
    this.isDialogOpen = true
    const dialogRef = this.dialog.open(CheckConnectionComponent, {
      width: '400px',
      panelClass: 'custom-dialog-container', // Thêm CSS tùy chỉnh nếu cần
    });

    // Khi dialog đóng, cập nhật lại trạng thái
    dialogRef.afterClosed().subscribe(() => {
      this.isDialogOpen = false;  // Đánh dấu là dialog đã đóng
    });
  }

  goToLemf() {
    // Chuyển hướng sang app lemf với query parameter 'filterName=test'
    //this.router.navigate(['lemf'], { queryParams: { filterName: 'test' } });
    const queryParams = { filterName: 'test' };
    const urlTree = this.router.createUrlTree(['lemf'], { queryParams });
    const fullUrl = this.router.serializeUrl(urlTree);
    window.open(fullUrl, '_blank');
  }
}
