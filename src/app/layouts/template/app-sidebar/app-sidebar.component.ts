import {Component, OnInit} from '@angular/core';
import {NgxPermissionsService} from 'ngx-permissions';

@Component({
  selector: 'app-sidebar',
  templateUrl: './app-sidebar.component.html',

})
export class AppSidebarComponent implements OnInit {

  constructor(private permissionService: NgxPermissionsService) {
  }

  ngOnInit() {
  }
}
