import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {EmployeeStatus} from '../../../../shared/models/configuration/employee/employee-status';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {EmployeeStatusService} from '../../../../shared/services/api/configuration/employee/employee-status.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {GlobalService} from '../../../../shared/services/api/global.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {Organization} from '../../../../shared/models/configuration/organization';
import {AuthenticationService} from '../../../../shared/services/api/authentication.service';

@Component({
  selector: 'app-employee-status',
  templateUrl: './employee-status.component.html',
  styleUrls: ['./employee-status.component.css']
})
export class EmployeeStatusComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedEmployeeStatuses: Array<EmployeeStatus> = [];
  loading: boolean;
  employeeStatusList: Array<EmployeeStatus> = [];
  className: string;
  cols: any[];
  editMode: number;
  employeeStatusExportList: Array<EmployeeStatus> = [];
  listTitle = 'Liste des validation cycle statuses';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;

  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  currentOrganization: Organization;
  employeeStatus: EmployeeStatus;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: string;
  // Component Attributes // Update
  updateCode: string;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: string;

  constructor(private employeeStatusService: EmployeeStatusService,
              private authenticationService: AuthenticationService,
              private spinner: NgxSpinnerService,
              private globalService: GlobalService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService,
              private toastr: ToastrService,
              private router: Router,
              @Inject(LOCALE_ID) private locale: string) {
  }

  ngOnInit() {
    this.items = [
      {label: ' EmployeeStatus'},
      {label: 'Lister', routerLink: '/core/employeeStatus'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = EmployeeStatus.name;
    this.cols = [
      {field: 'code', header: 'Code', type: 'string'},
    ];
    /*this.selectedColumns = this.Columns;
    this.items = [
      {label: 'En PDF', icon: 'pi pi-file-pdf', command: () => { this.exportPdf(); }},
      {label: 'En EXCEL Vue', icon: 'pi pi-file-excel', command: () => { this.exportExcelVue(); }},
      {label: 'En EXCEL Globale', icon: 'pi pi-file-excel', command: () => { this.exportExcelGlobal(); }},
    ];*/
    this.loadData();
  }

  loadData() {
    this.spinner.show();
    this.currentOrganization = this.authenticationService.getCurrentOrganization();
    this.searchSentence = 'organization.code:' + this.currentOrganization.code;
    this.subscriptions.add(this.employeeStatusService.sizeSearch(this.searchSentence).subscribe(
      data => {
        this.collectionSize = data;
      }
    ));
    this.subscriptions.add(this.employeeStatusService.findPagination(this.page, this.size, this.searchSentence).subscribe(
      data => {
        this.employeeStatusList = data;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.messageService.add({severity: 'error', summary: 'Erreur', detail: 'Erreur'});
      },
      () => this.spinner.hide()
    ));
  }

  loadDataLazy(event) {
    this.size = event.rows;
    this.page = event.first / this.size;
    this.loadData();
  }

  onExportExcel(event) {
    this.subscriptions.add(this.employeeStatusService.findAll().subscribe(
      data => {
        this.employeeStatusExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.employeeStatusExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.employeeStatusExportList, this.className, this.listTitle);
        }
        this.spinner.hide();
      },
      error => {
        this.messageService.add({severity: 'error', summary: 'Erreur', detail: 'Erreur'});
        this.spinner.hide();
      },
      () => this.spinner.hide()
    ));
  }

  onExportPdf(event) {
    this.subscriptions.add(this.employeeStatusService.findAll().subscribe(
      data => {
        this.employeeStatusExportList = data;
        this.globalService.generatePdf(event, this.employeeStatusExportList, this.className, this.listTitle);
        this.spinner.hide();
      },
      error => {
        this.messageService.add({severity: 'error', summary: 'Erreur', detail: 'Erreur'});
        this.spinner.hide();
        this.spinner.hide();
      },
      () => this.spinner.hide()
    ));
  }

  search() {
    this.searchSentence = '.';
    this.searchSentence = 'code:' + this.searchCode;
    this.searchSentence += 'organization.code:' + this.currentOrganization.code;

    this.subscriptions.add(this.employeeStatusService.find(this.searchSentence).subscribe(
      (data) => {
        this.employeeStatusList = data;
      },
      (error) => {
        this.toastr.error(error.message);
      }
    ));
  }

  reset() {
    this.searchSentence = null;
    this.searchCode = null;

    this.loadData();
  }

  onObjectEdited(event) {
    this.editMode = event.operationMode;
    this.selectedEmployeeStatuses = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedEmployeeStatuses[0].code.toString();
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.employeeStatus = new EmployeeStatus();
    this.employeeStatus.code = this.addCode;

    this.subscriptions.add(this.employeeStatusService.set(this.employeeStatus).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.employeeStatus = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedEmployeeStatuses = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.employeeStatus = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedEmployeeStatuses = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.employeeStatus = null;
    this.subscriptions.add(this.employeeStatusService.find('code:' + this.selectedEmployeeStatuses[0].code).subscribe(
      (data) => {
        this.employeeStatus = data.length !== 1 ? null : data[0];
        this.employeeStatus.code = this.updateCode;

        if (null !== this.employeeStatus) {
          this.subscriptions.add(this.employeeStatusService.set(this.employeeStatus).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.employeeStatus = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedEmployeeStatuses = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.employeeStatus = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedEmployeeStatuses = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedEmployeeStatuses.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected employeeStatus?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.employeeStatusService.deleteListByIds(ids).subscribe(
          (data) => {
            this.toastr.success('Elément Supprimer avec Succés', 'Suppression');
            this.loadData();
          },
          (error) => {
            this.toastr.error(error.message);
            this.loadData();
          }
        ));
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
