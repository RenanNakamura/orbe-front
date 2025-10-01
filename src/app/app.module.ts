import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule
} from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { provideVex } from '@vex/vex.provider';
import { mergeDeep } from '@vex/utils/merge-deep';
import deepClone from '@vex/utils/deep-clone';
import { VexConfigName } from '@vex/config/vex-config.interface';
import baseConfig from '@vex/config/vex-configs';
import { provideIcons } from './core/icons/icons.provider';
import { InterceptorService } from './interceptor/interceptor.service';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginatorService } from './service/sk/custom-paginator.service';
import { TitlePageStrategy } from './service/sk/titlePageStrategy';
import { TitleStrategy } from '@angular/router';
// import { HomeModule } from './module/home/home.module';
// import { CustomPaginatorService } from './service/sk/custom-paginator.service';
// import { TitlePageStrategy } from './service/sk/TitlePageStrategy';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSnackBarModule,

    // Vex
    // HomeModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    {
      provide: MatPaginatorIntl,
      useClass: CustomPaginatorService
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: getLocaleId()
    },
    provideVex({
      availableThemes: [],
      config: mergeDeep(deepClone(baseConfig), {
        id: VexConfigName.poseidon,
        name: 'Poseidon',
        bodyClass: 'vex-layout-poseidon',
        imgSrc: '',
        sidenav: {
          user: {
            visible: true
          },
          search: {
            visible: false
          }
        },
        toolbar: {
          fixed: true,
          user: {
            visible: false
          }
        },
        footer: {
          visible: false
        }
      })}),
    provideIcons(),
    { provide: TitleStrategy, useClass: TitlePageStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

export function getLocaleId() {
  return navigator.language || 'pt-BR';
}
