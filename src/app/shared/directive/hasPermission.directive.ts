import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { PermissionsService } from '../services/permissions.service';

@Directive({
  selector: '[hasPermission]'
})
export class HasPermissionDirective implements OnInit {


  private permissions : string[]=[];

  // private isHidden = true;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    //private authentificationService: AuthenticationService,
    private permissionService :PermissionsService ) { }




    ngOnInit() {
      // this.currentUser=this.authentificationService.getCurrentUser();
      // this.currentUserPermission=this.authentificationService.loadPermissions(this.currentUser)
      // console.log(this.currentUserPermission);

      //this.updateView();
    }

    @Input()
     set hasPermission(val) {
    this.permissions = val;
    this.updateView();
  }

  // @Input()
  // set hasPermissionOp(permop) {
  //   this.operation = permop;
  //   this.updateView();
  // }

  private updateView() {

   //console.log(this.permissions);


    this.viewContainer.clear();
    if (this.permissionService.hasPermissions(this.permissions)) {
        this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }


  // private existePermission (permission): boolean{
  //   return this.currentUserPermission.find(x => x === permission);
  // }


  // private verifyPermissionn() {

  //   if (this.currentUser && this.currentUserPermission) {

  //       if (this.operation === 'OR') {
  //         return this.permissions.some((permission)=>this.existePermission(permission))
  //       } else {
  //         return this.permissions.every((permission)=>this.existePermission(permission))

  //       }

  //   }

  // }






}
