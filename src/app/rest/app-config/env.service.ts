import { Observable, ReplaySubject, throwError as observableThrowError} from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';



@Injectable()
export class EnviromentService {
  protected envPath = './src/assets/env';
  private _envSubject: ReplaySubject<any>;

  constructor(private http: HttpClient) {}

  public getEnv(envPath?: string): ReplaySubject<any> {
    if (envPath) {
      this.envPath = envPath;
    }

    return this._fillEnvSubject();
  }

  private _fillEnvSubject(): ReplaySubject<any> {
    if (!_.isNil(this._envSubject)) {
      return this._envSubject;
    }
    this._envSubject = new ReplaySubject<any>(1);
    this.http
      .get(`./assets/env/env.json`)
      .subscribe((res) => { this._envSubject.next(res); }, (error: any): any => this._processError(error));

    return this._envSubject;
  }

  private _processError(error: any): Observable<any> {
    console.error(`Configuration file ${this.envPath}/env.json could not be read`);
    this._envSubject.next('');
    return observableThrowError(error.json().error || 'Server error');
  }
}
