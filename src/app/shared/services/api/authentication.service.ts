import {NgxSpinnerService} from 'ngx-spinner';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Md5} from 'ts-md5';

import {CURRENT_ORGANIZATION, CURRENT_USER, LOGGED_IN, REST_URL} from '../../utils/constants';
import {User} from '../../models/configuration/user';
import {ToastrService} from 'ngx-toastr';
import {Organization} from '../../models/configuration/organization';


@Injectable({
  providedIn: 'root',
})

export class AuthenticationService implements OnDestroy {

  token: string;
  private subs: Subscription = new Subscription();
  private currentUser!: User;
  private currentOrganization!: Organization;

  constructor(private http: HttpClient,
              private router: Router,
              private spinner: NgxSpinnerService,
              private toastr: ToastrService) {
    // set token if saved in local storage
    // const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    // tslint:disable-next-line:no-non-null-assertion
    const currentUser = JSON.parse(sessionStorage.getItem(CURRENT_USER)!);
    this.token = currentUser && currentUser.token;
  }

  login_byUser(email: string, password: string) {
    const pass = Md5.hashStr(password);
    this.subs.add(this.http.get<User>(REST_URL + 'authentification?email=' + email + '&password=' + pass).subscribe(
      (user) => {
        this.currentUser = user;
        localStorage.setItem(LOGGED_IN, 'true');
        sessionStorage.setItem(CURRENT_USER, JSON.stringify(user));

        // tslint:disable-next-line:no-non-null-assertion
        const constUser: User = JSON.parse(sessionStorage.getItem(CURRENT_USER)!);

        if (constUser !== undefined && user !== null) {
          this.spinner.hide();
          this.router.navigate(['/login/organization']);
        } else {
          this.spinner.hide();
          this.toastr.error('Error during the login', 'ERROR');
        }
      },
      (error) => {
        this.toastr.error(error.message);
      }
    ));
  }

  login_byOrganization(organization: Organization) {
    this.currentOrganization = organization;
    localStorage.setItem(LOGGED_IN, 'true');
    sessionStorage.setItem(CURRENT_ORGANIZATION, JSON.stringify(organization));

    // tslint:disable-next-line:no-non-null-assertion
    const constOrganization: Organization = JSON.parse(sessionStorage.getItem(CURRENT_ORGANIZATION)!);

    if (constOrganization !== undefined && organization !== null) {
      this.spinner.hide();
      this.router.navigate(['/core/configuration']);
    } else {
      this.spinner.hide();
      this.toastr.error('Error during the login', 'ERROR');
    }
  }

  setUser(user: User) {
    this.currentUser = user;
    localStorage.setItem(LOGGED_IN, 'true');
    sessionStorage.setItem(CURRENT_USER, JSON.stringify(user));
  }

  getCurrentUser() {
    // tslint:disable-next-line:no-non-null-assertion
    const user: User = JSON.parse(sessionStorage.getItem(CURRENT_USER)!);
    if (user !== undefined && user !== null) {
      return user;
    } else {
      this.router.navigate(['/login/user']);
    }
    // return null;
  }

  getCurrentOrganization() {
    // tslint:disable-next-line:no-non-null-assertion
    const organization: Organization = JSON.parse(sessionStorage.getItem(CURRENT_ORGANIZATION)!);
    if (organization !== undefined && organization !== null) {
      return organization;
    } else {
      this.router.navigate(['/login/user']);
    }
    // return null;
  }

  logout(): void {
    this.token = '';
    localStorage.removeItem(LOGGED_IN);
    sessionStorage.removeItem(CURRENT_USER);
    sessionStorage.removeItem(CURRENT_ORGANIZATION);
    // this.permissionService.removePermission(permissions);
    this.router.navigate(['/login/user']);
  }

  IsJsonString(str: any) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  computeToken(): string {
    // tslint:disable-next-line:no-non-null-assertion
    const user: User = this.getCurrentUser();
    if (user) {
      const times: number = Date.now() + 1000 * 60 * 60;
      const str: string = user.name + ':' + times + ':' + user.password + ':obfuscate';
      const token: string = /*'ems@ems.com'*/ user.email + ':' + times + ':' + Md5.hashStr(str);
      return token;
    } else {
      return null; // 'ems@ems.com:1646932274185:b6052f3939f03354b5f5dc6020554baf'
    }
  }

  ngOnDestroy() {
    if (this.subs != null) {
      this.subs.unsubscribe();
    }
  }
}
