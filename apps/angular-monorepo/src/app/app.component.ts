import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@li-ps/language';

@Component({
  standalone: true,
  imports: [ RouterModule, TranslateModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'angular-monorepo';

  constructor(
    private readonly translate: TranslateService,
    private readonly languageService: LanguageService
  ) {
    // Set mặc định ngôn ngữ
    this.translate.setDefaultLang('en');

    // Đọc ngôn ngữ từ URL hoặc bộ nhớ và đặt ngôn ngữ hiện tại
    const lang = localStorage.getItem('lang') || 'en';
    this.translate.use(lang);
  }

  // Phương thức thay đổi ngôn ngữ
  switchLanguage(lang: string): void {
    this.languageService.setLanguage(lang); // Sử dụng dịch vụ để thay đổi ngôn ngữ
  }

  // Lấy ngôn ngữ hiện tại
  get currentLanguage(): string {
    return this.languageService.getCurrentLanguage();
  }
}
