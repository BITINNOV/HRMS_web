import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';

import {ProxyService} from './proxy.service';


@Injectable()
export class HrService<T> {

  controller: string;

  constructor(private proxy: ProxyService, controller: string) {
    this.controller = controller;
  }

  findAll(): Observable<T[]> {
    return this.proxy.findAll(this.controller);
  }

  find(search: string) {
    return this.proxy.find(this.controller, search);
  }

  findById(id: number): Observable<T> {
    return this.proxy.findById(this.controller, id);
  }

  size() {
    return this.proxy.size(this.controller);
  }

  findAllPagination(page: number, size: number) {
    return this.proxy.findAllPagination(this.controller, page, size);
  }

  findPagination(page: number, size: number, search: string) {
    return this.proxy.findPagination(this.controller, search, page, size);
  }

  sizeSearch(search: string) {
    return this.proxy.sizeSearch(this.controller, search);
  }

  set(t: T): Observable<T> {
    return this.proxy.set(this.controller, t);
  }

  setAll(t: T[]): Observable<T[]> {
    return this.proxy.setAll(this.controller, t);
  }

  add(t: T): Observable<T> {
    return this.proxy.add(this.controller, t);
  }

  saveAll(t: T[]): Observable<T[]> {
    return this.proxy.addAll(this.controller, t);
  }

  delete(id: number) {
    return this.proxy.delete(this.controller, id);
  }

  deleteListByIds(ids: Array<number>) {
    return this.proxy.deleteListByIds(this.controller, ids);
  }

  deleteAllByIds(ids: number[]) {
    return this.proxy.deleteAllByIds(this.controller, ids);
  }

  generateCode(): Observable<string> {
    return this.proxy.generateCode(this.controller);
  }
}
