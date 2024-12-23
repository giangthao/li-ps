import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '@li-ps/language';
import {NotFoundComponent, TestComponent} from '@lea/components'

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, NotFoundComponent, TestComponent],
  selector: 'app-lemf-entry',
  templateUrl: './entry.component.html',
})
export class RemoteEntryComponent {
  constructor(private readonly translate: TranslateService, private readonly languageService: LanguageService) {
    // Sử dụng dịch vụ dịch thuật được chia sẻ từ app shell
    this.translate.setDefaultLang(this.languageService.getCurrentLanguage());
  }
}
