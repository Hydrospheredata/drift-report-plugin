import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpService {
  constructor(public http: HttpClient) {}

  get<T>(
    url: string,
    options?: {
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      observe?: 'body';
      params?:
        | HttpParams
        | {
            [param: string]: string | string[] | number;
          };
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    }
  ) {
    return this.http.get<T>(url, options);
  }
}
