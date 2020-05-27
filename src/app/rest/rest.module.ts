import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppConfig} from "./app-config/app-config.service";
import {EnviromentService} from "./app-config/env.service";
import {useAppConfigProvider} from "./app-config/useAppConfig.provider";
import {HttpClientModule} from "@angular/common/http";
import {RestService} from "./rest.service";



@NgModule({
  declarations: [],

  imports: [
    CommonModule,
    HttpClientModule
  ]
})
export class RestModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RestModule,
      providers: [AppConfig,
        EnviromentService,
        useAppConfigProvider,
        RestService
      ]
    };
  }
}
