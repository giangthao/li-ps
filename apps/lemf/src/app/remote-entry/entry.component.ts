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
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

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
    FormsModule,
    MatTableModule
  ],
  selector: 'app-lemf-entry',
  templateUrl: './entry.component.html',
})
export class RemoteEntryComponent implements OnInit {
  formGroup: FormGroup;
  data: {name: string, email: string}[] = [
    {
      name: 'faf',
      email: 'ưerw'
    },
    {
      name: 'test',
      email: 'test'
    },
    {
      name: 'ssdf',
      email: '334524'
    }
  ];
  displayedColumns: string[] = ['name', 'email']; // Columns to display
  dataFilter = this.data;

  constructor(
    private readonly translate: TranslateService,
    private readonly languageService: LanguageService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.translate.setDefaultLang(this.languageService.getCurrentLanguage());
    this.formGroup = new FormGroup({
      name: new FormControl(null),
      email: new FormControl(null)
    })
  }

  ngOnInit(): void {
      this.formGroup.valueChanges.subscribe(value => {
       this.dataFilter = this.filterData(value.name, value.email)
      });

      this.route.queryParams.subscribe(params => {
        console.log(params['filterName'] || '')
        this.formGroup.patchValue({
          name: params['filterName'] || ''
        })
      });
  }

  clearFilter(): void {
    this.formGroup.setValue({
      name: null,
      email: null
    })
  }

  filterData(nameValue: string, emailValue: string): any[] {
    // Lọc dữ liệu theo các giá trị name và email
    return this.data.filter(item => {
      const nameMatch = nameValue ? item.name.toLowerCase().includes(nameValue.toLowerCase()) : true;
      const emailMatch = emailValue ? item.email.toLowerCase().includes(emailValue.toLowerCase()) : true;
  
      // Nếu không có giá trị nameValue thì bỏ qua điều kiện lọc tên
      // Nếu không có giá trị emailValue thì bỏ qua điều kiện lọc email
      return nameMatch && emailMatch;
    });
  }
  
}
