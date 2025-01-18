import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmExitDialogComponent } from '../confirm-exit-dialog/confirm-exit-dialog.component';
import * as XLSX from 'xlsx';
import { UploadFileService } from '../../services/upload-file.service';
import * as JSZip from 'jszip';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, throwError, timeout } from 'rxjs';

@Component({
  selector: 'app-check-connection',
  templateUrl: './check-connection.component.html',
  styleUrls: ['./check-connection.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
})
export class CheckConnectionComponent implements OnDestroy, OnInit {
  files: File[] = [];
  allowedFileTypes = [
    'text/plain',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv',
  ];
  errorMessage = '';
  maxFileSize = 3 * 1024 * 1024;
  fileChunks: string[][] = [];
  errorLog: { line: number; column: string; desc: string }[] = [];
  linesPerChunk = 100;
  isUploading = false;
  isUploadSucess = false;

  data: { liid: string; leaid: string }[] = [
    { liid: 'LIID1', leaid: 'LEAID1' },
    { liid: 'LIID2', leaid: 'LEAID2' },
    { liid: 'LIID3', leaid: 'LEAID3' },
    { liid: 'LIID4', leaid: 'LEAID4' },
    { liid: 'LIID5', leaid: 'LEAID5' },
  ];

  formGroup: FormGroup;
  fileChange = false;

  constructor(
    private readonly dialog: MatDialog,
    private readonly dialogRef: MatDialogRef<CheckConnectionComponent>,
    private readonly uploadFileService: UploadFileService,
    private readonly http: HttpClient
  ) {
    this.formGroup = new FormGroup({
      file: new FormControl(null),
    });
  }

  ngOnInit(): void {
    this.formGroup.valueChanges.subscribe((value) => {
      this.fileChange = true;
    });
  }
  ngOnDestroy(): void {
    this.removeFileUpload();
  }

  downloadFiles(): void {
    const zip = new JSZip();

    // Tạo file TXT
    const txtContent = this.data
      .map((item) => `${item.liid},${item.leaid}`)
      .join('\n');
    zip.file('template.txt', txtContent); // Thêm vào file ZIP

    // Tạo file CSV
    const csvContent = this.convertToCSV(this.data);
    zip.file('template.csv', csvContent); // Thêm vào file ZIP

    // Tạo file Excel
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const excelData = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    zip.file('template.xlsx', excelData);

    zip.generateAsync({ type: 'blob' }).then((content) => {
      this.uploadFileService.emulatorDownload(content, 'templates.zip');
    });
  }

  convertToCSV(data: any[]): string {
    const header = Object.keys(data[0]).join(',');
    const rows = data.map((item) => Object.values(item).join(',')); // Chuyển dữ liệu thành chuỗi CSV
    return [header, ...rows].join('\n'); // Kết hợp tiêu đề và dữ liệu
  }

  closeDialog() {
    if (this.fileChange) {
      const confirmDialogRef = this.dialog.open(ConfirmExitDialogComponent, {
        panelClass: 'custom-dialog-container',
      });

      confirmDialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.dialogRef.close();
        }
      });
    } else {
      this.dialogRef.close();
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();

    if (this.isUploading) {
      this.errorMessage = 'File đang upload. Vui long chờ';
      return;
    }

    if (event.dataTransfer?.files) {
      const file = event.dataTransfer.files[0];
      this.handleFile(file);
    }
  }

  onFileSelect(event: any): void {
    if (this.isUploading) {
      event.preventDefault();
      this.errorMessage = 'File đang upload. Vui long chờ';
      return;
    }
    const file = event.target.files[0];

    if (file) {
      this.handleFile(file);
      event.target.value = null;
    }
  }

  handleFile(file: File): void {
    if (this.isUploading) {
      this.errorMessage = 'Đang upload file, vui lòng đợi';
      return;
    }
    this.isUploading = true;
    console.log('file upload: ', file);
    this.errorMessage = '';

    if (file.size > this.maxFileSize) {
      this.errorMessage = 'Dung lượng file không được vượt quá 2MB.';
      this.files = [];
      this.isUploading = false;
      return;
    }

    if (this.files.length > 0) {
      this.files[0] = file;
    } else {
      this.files.push(file);
    }

    if (!this.allowedFileTypes.includes(file.type)) {
      this.errorMessage =
        'Chỉ được upload file có định dạng .txt, .xlsx, .xls hoặc .csv';
      this.files = [];
      this.isUploading = false;
      return;
    }

    // const fileExtension = file.name.split('.').pop()?.toLowerCase();
    // if (fileExtension === 'xlsx' || fileExtension === 'xls') {
    //   this.readExcelFile(file);
    // } else {
    //   this.readFile(file);
    // }

    // send file to Server node js
    const formData = new FormData();
    formData.append('file', file);
    this.http
      .post('http://localhost:3000/upload', formData)
      .pipe(
        timeout(100), // Hủy request nếu quá 120 giây
        catchError((error) => {
          if (error.name === 'TimeoutError') {
            this.errorMessage =
              'Quá trình tải file đã bị timeout. Vui lòng thử lại.';
          } else {
            this.errorMessage = 'Đã xảy ra lỗi khi tải file. Vui lòng thử lại.';
          }
          return throwError(() => error); // Ném lỗi ra để xử lý thêm nếu cần
        })
      )
      .subscribe({
        next: (response: any) => {
          console.log('File uploaded successfully', response);
          this.isUploading = false;
          if (response.file) {
            this.isUploadSucess = true;
          } else {
            this.isUploadSucess = false;
            this.errorMessage =
              'Quá trình xử lí đã xảy ra lỗi. Vui lòng thử lại';
          }
        },
        error: (err) => {
          console.error('Upload failed:', err);
          this.isUploadSucess = false;
          this.isUploading = false;
        },
      });
  }

  downloadFile(requestId: string) {
    if (!requestId) {
      this.errorMessage = 'Request ID is required!';
      return;
    }

    this.errorMessage = 'Đang kiểm tra đấu nối vui lòng chờ';

    const apiUrl = `http://localhost:3000/generate-file?requestId=${encodeURIComponent(
      requestId
    )}`;

    this.http.get(apiUrl, { responseType: 'blob' }).subscribe({
      next: (response) => {
        this.dialogRef.close();
        // Tạo link để tải file
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = ''; // Sử dụng tên file từ header Content-Disposition
        a.click();
        window.URL.revokeObjectURL(url); // Dọn dẹp URL tạm sau khi tải xong
        this.errorMessage = '';

        alert('Kiểm tra đấu nối thành công');
      },
      error: (err) => {
        this.dialogRef.close();
        console.error('Error downloading file:', err);
        this.errorMessage = '';

        alert('Kiểm tra đấu nối thất bại');
      },
    });
  }

  downloadFileCsv() {
    this.errorMessage = 'Đang tải file Danh sách kết quả, vui lòng chờ';

    const apiUrl = `http://localhost:3000/generate-csv`;

    this.http.get(apiUrl, { responseType: 'blob' }).subscribe({
      next: (response) => {
        this.dialogRef.close();
        // Tạo link để tải file
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = ''; // Sử dụng tên file từ header Content-Disposition
        a.click();
        window.URL.revokeObjectURL(url); // Dọn dẹp URL tạm sau khi tải xong
        this.errorMessage = '';

        alert('Tải file danh sách kết quả thành công');
      },
      error: (err) => {
        this.dialogRef.close();
        console.error('Error downloading file:', err);
        this.errorMessage = '';

        alert('Tải file danh sách kết quả thất bại');
      },
    });
  }


  removeFileUpload(): void {
    this.isUploadSucess = false;
    this.isUploading = false;
    this.files = [];
    this.errorMessage = '';
    this.errorLog = [];
    this.formGroup.setValue({
      file: null,
    });
  }

  get fileSize(): string {
    return this.uploadFileService.formatFileSize(this.files[0].size);
  }
}
