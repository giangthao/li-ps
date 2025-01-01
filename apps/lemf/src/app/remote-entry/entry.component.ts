import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '@li-ps/language';
import { NotFoundComponent, TestComponent } from '@lea/components';
import { ReactiveFormsModule, FormControl, FormGroup, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NotFoundComponent,
    TestComponent,
    MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    FormsModule
  ],
  selector: 'app-lemf-entry',
  templateUrl: './entry.component.html',
})
export class RemoteEntryComponent implements OnInit {
  formGroup: FormGroup;

  constructor(
    private readonly translate: TranslateService,
    private readonly languageService: LanguageService
  ) {
    this.translate.setDefaultLang(this.languageService.getCurrentLanguage());
    this.formGroup = new FormGroup({
      name: new FormControl(null),
      email: new FormControl(null)
    })
  }

  ngOnInit(): void {
      this.formGroup.valueChanges.subscribe(value => {
        console.log(value)
      })
  }
}
