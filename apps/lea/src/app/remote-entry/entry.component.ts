import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { LanguageService } from '@li-ps/language';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule],
  selector: 'app-lea-entry',
  templateUrl: './entry.component.html'
})
export class RemoteEntryComponent {
  constructor(private readonly translate: TranslateService, private readonly languageService: LanguageService) {
    // Sử dụng dịch vụ dịch thuật được chia sẻ từ app shell
    this.translate.setDefaultLang(this.languageService.getCurrentLanguage());
  }
}
