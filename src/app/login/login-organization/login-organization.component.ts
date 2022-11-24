import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {AuthenticationService} from '../../shared/services/api/authentication.service';
import {Organization} from '../../shared/models/configuration/organization';
import {OrganizationService} from '../../shared/services/api/configuration/organization.service';
import {Subscription} from 'rxjs';
import {ToastrService} from 'ngx-toastr';


declare var $: any;

@Component({
  selector: 'app-login-organization',
  templateUrl: './login-organization.component.html',
  styleUrls: ['./login-organization.component.css']
})
export class LoginOrganizationComponent implements OnInit, OnDestroy {

  subscriptions = new Subscription();
  organizationList: Array<Organization> = [];
  selectedOrganization: Organization;
  showOrganizations: boolean;

  constructor(private authentification: AuthenticationService,
              private organizationService: OrganizationService,
              private spinner: NgxSpinnerService,
              private toastr: ToastrService,
              private router: Router) {
  }

  ngOnInit() {
    this.showOrganizations = false;

    this.subscriptions.add(this.organizationService.findAll().subscribe(
      (data) => {
        this.organizationList = data;
        if (1 === this.organizationList.length) {
          this.selectedOrganization = this.organizationList[0];
          this.authentification.login_byOrganization(this.selectedOrganization);
        }
      },
      (error) => {
        this.spinner.hide();
        this.toastr.error(error.message);
      },
      () => this.spinner.hide()
    ));

    $('body').addClass('empty-layout bg-silver-300');

  }

  ngOnDestroy() {
    $('body').removeClass('empty-layout bg-silver-300');
  }

  onSubmit() {
    this.spinner.show();
    this.authentification.login_byOrganization(this.selectedOrganization);
  }
}
