import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";


@Component({
    selector: 'app-confirm-exit-dialog',
    templateUrl: './confirm-exit-dialog.component.html',
    styleUrls: ['./confirm-exit-dialog.component.scss', '../check-connection/check-connection.component.scss'],
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatIconModule]
})
export class ConfirmExitDialogComponent{
    constructor(private readonly dialogRef: MatDialogRef<ConfirmExitDialogComponent>) {}

    closeDialog(confirm: boolean) {
      this.dialogRef.close(confirm); // Trả về giá trị true/false
    }
}