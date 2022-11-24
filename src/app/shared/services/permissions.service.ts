import { Injectable } from '@angular/core';
import { $ } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  private _permissions: string[] = [];
  constructor() {
    
   }

  loadPermissions(permissions: string[]): void{
    this._permissions=permissions;
  }

  addPermission(permission: string | string[]): void {
    this._permissions.push(...permission)
  }

  getPermissions(): string[] {
    return this._permissions.map(p => p.toUpperCase());
  }

  hasPermissions(permissions: string[]) {
  
   // console.log(permissions);
    
    // TODO: To be refactored
    let permissionExist = false;
    permissions.forEach(p => {
     if(this._permissions.map(pr => pr.toUpperCase()).includes(p.toUpperCase())) {
       permissionExist = true;
     }
    })
    return permissionExist;
  }

  flushPermissions(): void {
    this._permissions = [];
  }

  removePermission(permissionName: string): void {
   this._permissions = this._permissions.filter(p => p !== permissionName)
  }
  

}
