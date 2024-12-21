import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CheckConnectionComponent } from '../check-connection/check-connection.component';

@Component({
  imports: [CommonModule, TranslateModule, MatDialogModule],
  selector: 'app-list-lea',
  templateUrl: './list-lea.component.html',
  styleUrls: ['./list-lea.component.scss'],
  standalone: true,
})
export class ListLeaComponent {
  isDialogOpen = false;

  constructor(private readonly dialog: MatDialog) {}

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
}
