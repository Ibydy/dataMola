import {Injectable} from '@angular/core';
import * as _ from 'lodash';
import {EnviromentService} from './env.service';
import {HttpClient} from '@angular/common/http';
import {IConfigService} from './core';

@Injectable()
export class AppConfig implements IConfigService {
  protected config: any[] = null;
  protected env: object = null;
  protected envPath = './assets/env';
  protected loaded = false;

  constructor(private http: HttpClient, private envService: EnviromentService) {
  }

  /**
   * Получить параметр из конфиг.файла
   * @key Ключ объекта в конфиг.файле
   * @defaultValue Значение по умолчанию, которое вернется если значение по ключу отсутствует
   * @subKey Дополнительный ключ для поиска в коллекции values обьекта с ключом key
   * @return Значение св-ва
   */
  public getConfig<T>(key: string, defaultValue: T, subKey?: string): T {
    if (!this.checkLoaded()) {
      return;
    }
    const conf = this.config.filter(c => c.key === key)[0];
    if (!conf) {
      return defaultValue;
    }

    if (conf.ref) {
      return this.getConfig<T>(conf.ref, defaultValue);
    }

    if (subKey) {
      const subObj = conf.values.filter(
        c => c.key.toString() === subKey
      )[0];
      if (!subObj) {
        return defaultValue;
      }

      return subObj.value;
    }

    return !_.isNil(conf.value) ? conf.value : conf.values;
  }

  /**
   * Чтение свойства из env файла
   * @key Ключ объекта в env файле
   * @return Значение св-ва
   */
  public getEnv(key: any) {
    if (!this.checkLoaded()) {
      return;
    }
    const envVar = this.env[key];
    if (!envVar) {
      console.warn(`В файле env.json не найден обьект с ключом ${key}`);
    }
    return envVar;
  }

  /**
   * Инициализация настроек приложения. Должен вызываться в APP_INITIALIZER.
   * @envPath: Путь к папке с настройками окружения
   * Читает env/env.json и env/config.[env].json
   */
  public load(envPath?: string): Promise<boolean> {
    if (envPath) {
      this.envPath = envPath;
    }
    return new Promise((resolve, reject) => {
      this.envService.getEnv(envPath).subscribe(
        (envResponse: any) => {
          this.env = envResponse;
          let request: any = null;
          if (envResponse.env) {
            const url = `${this.envPath}/data.${envResponse.env}.json`;
            request = this.http.get(url);
          }
          if (request) {
            request
              .subscribe(responseData => {
                this.config = responseData;
                this.loaded = true;
                resolve(true);
              });
          } else {
            console.error(
              'Env config file "env.json" is not valid'
            );
            this.loaded = true;
            resolve(true);
          }
        },
        () => {
          resolve(true);
        }
      );
    });
  }

  private checkLoaded(): boolean {
    if (!this.loaded) {
      console.error(
        `You can't use AppConfig without call 'load()' method before.`
      );
    }

    return this.loaded;
  }
}
