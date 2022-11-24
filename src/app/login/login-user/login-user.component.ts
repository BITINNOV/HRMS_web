import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {AuthenticationService} from '../../shared/services/api/authentication.service';


declare var $: any;

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.css']
})
export class LoginUserComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private authentification: AuthenticationService,
              private spinner: NgxSpinnerService,
              private router: Router) {
  }

  ngOnInit() {
    $('body').addClass('empty-layout bg-silver-300');
  }

  ngAfterViewInit() {
    $('#login-form').validate({
      errorClass: 'help-block',
      rules: {
        email: {
          required: true,
          email: true
        },
        password: {
          required: true
        }
      },
      highlight: function (e) {
        $(e).closest('.form-group').addClass('has-error');
      },
      unhighlight: function (e) {
        $(e).closest('.form-group').removeClass('has-error');
      },
    });
  }

  ngOnDestroy() {
    $('body').removeClass('empty-layout bg-silver-300');
  }

  onSubmit(f: NgForm) {
    this.spinner.show();
    const email = f.controls['email'].value;
    const password = f.controls['password'].value;
    this.authentification.login_byUser(email, password);
  }
}
