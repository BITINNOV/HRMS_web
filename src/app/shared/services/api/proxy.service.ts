import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Md5} from 'ts-md5';
import {AuthenticationService} from './authentication.service';
import {REST_URL} from './../../utils/constants';

const httpJsonHeaders = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})

export class ProxyService {

  private readonly url = REST_URL;

  constructor(private http: HttpClient, private authService: AuthenticationService) {
  }

  findAll(controller: string): Observable<any[]> {
    const fullUrl = this.url + controller + '/list?token=' + this.getToken();
    return this.http.get<any[]>(fullUrl);
  }

  findById(controller: string, id: number): Observable<any> {
    const fullUrl = this.url + controller + '/' + id + '?token=' + this.getToken();
    return this.http.get<any>(fullUrl);
  }

  findByCode(controller: string, code: string): Observable<any> {
    const fullUrl = this.url + controller + '/findByCode?code=' + code + '&token=' + this.getToken();
    return this.http.get<any>(fullUrl);
  }

  find(controller: string, search: string): Observable<any[]> {
    const fullUrl = this.url + controller + '/search?search=' + search + '&token=' + this.getToken();
    return this.http.get<any[]>(fullUrl);
  }

  findPagination(controller: string, search: string, page: number, size: number): Observable<any[]> {
    let httpParameters = new HttpParams();
    httpParameters = httpParameters.append('search', search);
    httpParameters = httpParameters.append('page', page.toString());
    httpParameters = httpParameters.append('size', size.toString());
    httpParameters = httpParameters.append('token', this.getToken());
    const fullUrl = this.url + controller + '/searchPage';
    return this.http.get<any[]>(fullUrl, {params: httpParameters});
  }

  findPaginationAccounted(controller: string, search: string, page: number, size: number, accounted: number): Observable<any[]> {
    // tslint:disable-next-line:max-line-length
    const fullUrl = this.url + controller + '/searchPage?search=' + search + '&page=' + page + '&size=' + size + '&token=' + this.getToken() + '&accounted=' + accounted;
    return this.http.get<any[]>(fullUrl);
  }

  findAllPagination(controller: string, page: number, size: number): Observable<any[]> {
    const fullUrl = this.url + controller + '/listPage?page=' + page + '&size=' + size + '&token=' + this.getToken();
    return this.http.get<any[]>(fullUrl);
  }

  findAllPaginationAccounted(controller: string, page: number, size: number, accounted: number): Observable<any[]> {
    // tslint:disable-next-line:max-line-length
    const fullUrl = this.url + controller + '/listPage?page=' + page + '&size=' + size + '&token=' + this.getToken() + '&accounted=' + accounted;
    return this.http.get<any[]>(fullUrl);
  }

  findAvailable(controller: String): Observable<any[]> {
    const fullUrl = this.url + controller + '/findAvailable?token=' + this.getToken();
    return this.http.get<any[]>(fullUrl);
  }

  set(controller: string, object: any): Observable<any> {
    const fullUrl = this.url + controller + '/save?token=' + this.getToken();
    return this.http.put(fullUrl, object);
  }

  add(controller: string, object: any): Observable<any> {
    const fullUrl = this.url + controller + '/save?token=' + this.getToken();
    return this.http.post(fullUrl, object);
  }

  setAll(controller: string, object: any): Observable<any> {
    const fullUrl = this.url + controller + '/saveAll?token=' + this.getToken();
    return this.http.put(fullUrl, object);
  }

  addAll(controller: string, object: any): Observable<any> {
    const fullUrl = this.url + controller + '/saveAll?token=' + this.getToken();
    return this.http.post(fullUrl, object);
  }

  size(controller: string): Observable<number> {
    const fullUrl = this.url + controller + '/size?token=' + this.getToken();
    return this.http.get<number>(fullUrl);
  }

  sizeSearch(controller: string, search: string): Observable<number> {
    const fullUrl = this.url + controller + '/sizeSearch?search=' + search + '&token=' + this.getToken();
    return this.http.get<number>(fullUrl);
  }

  delete(controller: string, id: number) {
    const fullUrl = this.url + controller + '/delete/' + id + '?token=' + this.getToken();
    return this.http.delete<number>(fullUrl);
  }

  deleteListByIds(controller: string, ids: Array<number>): Observable<any> {
    const fullUrl = this.url + controller + '/deleteAll?ids=' + ids + '&token=' + this.getToken();
    return this.http.delete(fullUrl);
  }

  deleteAllByIds(controller: string, ids: number[]) {
    const fullUrl = this.url + controller + '/deleteAll?ids=' + ids.join(',') + '&token=' + this.getToken();
    return this.http.delete(fullUrl);
  }

  login(controller: string, code: string, password: string) {
    password = Md5.hashStr(password).toString();
    return this.http.get(this.url + controller + '/login?code=' + code + '&password=' + password);
  }

  generateCode(controller: string) {
    const fullUrl = this.url + controller + '/nextval?token=' + this.getToken();
    return this.http.get<string>(fullUrl, {responseType: 'text' as 'json'});
  }

  generatePayrollStatement(controller: string, object: any): Observable<any> {
    const httpOptions = {
      responseType: 'blob' as 'json'
    };
    const fullUrl = this.url + controller + '/generatePayrollStatement?token=' + this.getToken();
    // return this.http.post(fullUrl, object);
    return this.http.post<any>(fullUrl, object, httpOptions);
  }

  getToken(): string {
    return this.authService.computeToken();
  }
}
