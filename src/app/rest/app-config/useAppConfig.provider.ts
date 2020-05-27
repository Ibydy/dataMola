import { APP_INITIALIZER } from '@angular/core';
import {IConfigService} from './core';
import {AppConfig} from './app-config.service';


export const ConfigServiceFactory = (config: IConfigService) => () => {
  return Promise.all([config.load()]);
};

export let useAppConfigProvider = {
  provide: APP_INITIALIZER,
  useFactory: ConfigServiceFactory,
  deps: [AppConfig],
  multi: true
};
