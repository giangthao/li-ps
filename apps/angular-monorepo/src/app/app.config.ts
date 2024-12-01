import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LanguageService } from '@li-ps/language';
import { DOCUMENT } from '@angular/common';


export function HttpLoaderFactory(http: HttpClient, document: Document) {
  const baseHref = document.querySelector('base')?.getAttribute('href') || '/';
  return new TranslateHttpLoader(http, `${baseHref}assets/i18n/`, '.json');
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    importProvidersFrom(
      HttpClientModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient, DOCUMENT],
        },
        isolate: false
      })
    ),
    LanguageService,
    { provide: DOCUMENT, useValue: document }
  ],
};
