import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UploadFileService {
  downloadErrorLog(errorLog: {line: number, column: string, desc: string}[]): void {
    const csvContent = errorLog
      .map((error) => `${String(error.line)},${error.column},${error.desc}`)
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/plain;charset=utf-8;' });
    this.emulatorDownload(blob, 'error-log.txt')

  }

  emulatorDownload(blob: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  formatFileSize(size: number): string {
    if (size < 1024) {
      return size + ' bytes';
    } else if (size < 1048576) {
      return (size / 1024).toFixed(2) + ' KB';
    } else {
      return (size / 1048576).toFixed(2) + ' MB';
    }
  }
}
