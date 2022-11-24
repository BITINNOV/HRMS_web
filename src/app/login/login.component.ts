import {AfterViewInit, Component} from '@angular/core';
import {Helpers} from '../helpers';
import {AuthenticationService} from '../shared/services/api/authentication.service';
import {Router} from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements AfterViewInit {

  constructor(private router: Router,
              private authenticationService: AuthenticationService) {
  }

  ngAfterViewInit() {
    // initialize layout: handlers, menu ...
    Helpers.initLayout();
  }

}
