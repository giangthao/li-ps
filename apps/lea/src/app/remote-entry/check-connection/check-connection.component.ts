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
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-check-connection',
  templateUrl: './check-connection.component.html',
  styleUrls: ['./check-connection.component.scss'],
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, FormsModule, ReactiveFormsModule],
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
  errorLog: any[] = [];
  linesPerChunk = 100;
  isUploading = false;
  isUploadSucess = false;

  data: {liid: string, leaid: string}[] = [
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
    private readonly uploadFileService: UploadFileService
  ) {
    this.formGroup = new FormGroup({
      file: new FormControl(null)
    })
  }

  ngOnInit(): void {
      this.formGroup.valueChanges.subscribe(value => {
        this.fileChange = true
      })
  }
  ngOnDestroy(): void {
    this.removeFileUpload();
  }

  downloadFiles(): void {
    const zip = new JSZip();

    // Tạo file TXT
    const txtContent = this.data.map(item => `${item.liid},${item.leaid}`).join('\n');
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
      this.uploadFileService.emulatorDownload(content, 'templates.zip')
    });
  }

  convertToCSV(data: any[]): string {
    const header = Object.keys(data[0]).join(',');
    const rows = data.map(item => Object.values(item).join(',')); // Chuyển dữ liệu thành chuỗi CSV
    return [header, ...rows].join('\n'); // Kết hợp tiêu đề và dữ liệu
  }

  closeDialog() {
    if(this.fileChange) {
      const confirmDialogRef = this.dialog.open(ConfirmExitDialogComponent, {
        panelClass: 'custom-dialog-container',
      });
  
      confirmDialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.dialogRef.close();
        }
      });
    }
    else{
      this.dialogRef.close()
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

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      this.readExcelFile(file);
    } else {
      this.readFile(file);
    }
  }

  readExcelFile(file: File): void {
    const reader = new FileReader();
    this.isUploading = true;

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      try {
        let jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        });
        jsonData.shift();

        jsonData = jsonData.map((row) => row.slice(0, 2));
        jsonData = jsonData.filter((row) =>
          row.some((cell) => cell !== undefined && cell !== null && cell !== '')
        );

        if (jsonData.length === 0) {
          console.error('File Excel không có dữ liệu.');
          return;
        }
        this.processExcelData(jsonData);
      } catch (error) {
        console.error('Lỗi khi xử lý file Excel:', error);
      }
    };

    reader.readAsArrayBuffer(file);
  }

  processExcelData(data: any[][]): void {
    this.isUploading = true;
    const totalLines = data.length;
    this.errorLog = [];
    let numberOfErrors = 0;
    const transformedData: { liId: string; leaId: string }[] = [];

    const processChunk = (startLine: number) => {
      let chunkEnd = startLine + this.linesPerChunk;
      if (chunkEnd > totalLines) chunkEnd = totalLines;

      for (let index = startLine; index < chunkEnd; index++) {
        const line = data[index];

        if (!line || line.length < 2) {
          this.errorLog.push({
            line: line ? line.join(',') : 'EMPTY LINE',
            error: 'Yes',
            desc: 'Không đủ cột (Cần 2 cột LIID và LEAID)',
          });
          numberOfErrors++;
          continue;
        }

        const liid = line[0]?.toString().trim() || '';
        const leaid = line[1]?.toString().trim() || '';
        const validRegex = /^[a-zA-Z0-9-_]+$/;

        let errorDesc = '';

        if (!validRegex.test(liid)) {
          errorDesc += 'LIID không hợp lệ. ';
        }

        if (!validRegex.test(leaid)) {
          errorDesc += 'LEAID không hợp lệ. ';
        }

        if (
          liid.length < 1 ||
          liid.length > 255 ||
          leaid.length < 1 ||
          leaid.length > 255
        ) {
          errorDesc += 'LIID và LEAID phải có độ dài từ 1 đến 255 ký tự.';
        }

        if (errorDesc) {
          this.errorLog.push({
            line: line.join(','),
            error: 'Yes',
            desc: errorDesc.trim(),
          });
          numberOfErrors++;
        } else {
          this.errorLog.push({
            line: line.join(','),
            error: 'No',
            desc: '',
          });
        }

        transformedData.push({ liId: liid, leaId: leaid });
      }

      if (chunkEnd < totalLines) {
        setTimeout(() => processChunk(chunkEnd), 0);
      } else {
        if (numberOfErrors > 0) {
          this.errorMessage = 'File sai định dạng';
          this.uploadFileService.downloadErrorLog(this.errorLog);
        } else {
          this.isUploadSucess = true;
          console.log(transformedData);
        }
        this.isUploading = false;
      }
    };

    processChunk(0);
  }

  readFile(file: File): void {
    this.isUploading = true;
    console.log(this.isUploading);
    const reader = new FileReader();
    let lines: string[] = [];

    reader.onload = (e: any) => {
      const fileContent = e.target.result;

      if (
        file.type === 'text/csv' ||
        file.name.endsWith('.csv') ||
        file.name.endsWith('.txt')
      ) {
        lines = fileContent.split('\n').map((line: string) => line.trim());
        lines = lines.filter((l: string) => l !== '');
        const data: any[][] = lines.map((line) => {
          return line.split(',').map((cell) => cell.trim());
        });

        this.processExcelData(data);
      }
    };

    reader.readAsText(file, 'UTF-8');
  }

  removeFileUpload(): void {
    this.isUploadSucess = false;
    this.isUploading = false;
    this.files = [];
    this.errorMessage = '';
    this.errorLog = [];
  }

  get fileSize(): string {
    return this.uploadFileService.formatFileSize(this.files[0].size);
  }
}
