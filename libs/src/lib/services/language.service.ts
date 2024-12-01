import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root', // Đảm bảo dịch vụ này được cung cấp cho toàn bộ ứng dụng
})
export class LanguageService {
  constructor(private readonly translate: TranslateService) {
    // Thiết lập ngôn ngữ mặc định
    this.translate.setDefaultLang('en');

    // Lấy ngôn ngữ từ bộ nhớ trình duyệt (localStorage) hoặc mặc định là 'en'
    const lang = localStorage.getItem('lang') ?? 'vi';
    this.translate.use(lang); // Sử dụng ngôn ngữ đã chọn
  }

  // Phương thức thay đổi ngôn ngữ
  setLanguage(language: string): void {
    this.translate.use(language);
    localStorage.setItem('lang', language); // Lưu ngôn ngữ vào bộ nhớ
  }

  // Phương thức lấy ngôn ngữ hiện tại
  getCurrentLanguage(): string {
    return this.translate.currentLang || 'en'; // Nếu không có ngôn ngữ nào được chọn, mặc định là 'en'
  }
}
