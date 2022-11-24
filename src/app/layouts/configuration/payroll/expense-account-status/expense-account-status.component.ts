import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {ExpenseAccountStatus} from '../../../../shared/models/configuration/employee/expense-account-status';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {ExpenseAccountStatusService} from '../../../../shared/services/api/payroll/expense-account-status.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {GlobalService} from '../../../../shared/services/api/global.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {Organization} from '../../../../shared/models/configuration/organization';
import {AuthenticationService} from '../../../../shared/services/api/authentication.service';

@Component({
  selector: 'app-expense-account-status',
  templateUrl: './expense-account-status.component.html',
  styleUrls: ['./expense-account-status.component.css']
})
export class ExpenseAccountStatusComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedExpenseAccountStatuses: Array<ExpenseAccountStatus> = [];
  loading: boolean;
  expenseAccountStatusList: Array<ExpenseAccountStatus> = [];
  className: string;
  cols: any[];
  editMode: number;
  expenseAccountStatusExportList: Array<ExpenseAccountStatus> = [];
  listTitle = 'Liste des Expense Account Statuses';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;

  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  currentOrganization: Organization;
  expenseAccountStatus: ExpenseAccountStatus;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: string;
  // Component Attributes // Update
  updateCode: string;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: string;

  constructor(private expenseAccountStatusService: ExpenseAccountStatusService,
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
      {label: ' ExpenseAccountStatus'},
      {label: 'Lister', routerLink: '/core/expenseAccountStatus'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = ExpenseAccountStatus.name;
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
    this.subscriptions.add(this.expenseAccountStatusService.sizeSearch(this.searchSentence).subscribe(
      data => {
        this.collectionSize = data;
      }
    ));
    this.subscriptions.add(this.expenseAccountStatusService.findPagination(this.page, this.size, this.searchSentence).subscribe(
      data => {
        this.expenseAccountStatusList = data;
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
    this.subscriptions.add(this.expenseAccountStatusService.findAll().subscribe(
      data => {
        this.expenseAccountStatusExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.expenseAccountStatusExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.expenseAccountStatusExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.expenseAccountStatusService.findAll().subscribe(
      data => {
        this.expenseAccountStatusExportList = data;
        this.globalService.generatePdf(event, this.expenseAccountStatusExportList, this.className, this.listTitle);
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

    this.subscriptions.add(this.expenseAccountStatusService.find(this.searchSentence).subscribe(
      (data) => {
        this.expenseAccountStatusList = data;
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
    this.selectedExpenseAccountStatuses = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedExpenseAccountStatuses[0].code.toString();
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.expenseAccountStatus = new ExpenseAccountStatus();
    this.expenseAccountStatus.code = this.addCode;
    this.expenseAccountStatus.organization = this.currentOrganization;

    this.subscriptions.add(this.expenseAccountStatusService.set(this.expenseAccountStatus).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.expenseAccountStatus = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedExpenseAccountStatuses = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.expenseAccountStatus = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedExpenseAccountStatuses = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.expenseAccountStatus = null;
    this.subscriptions.add(this.expenseAccountStatusService.find('code:' + this.selectedExpenseAccountStatuses[0].code).subscribe(
      (data) => {
        this.expenseAccountStatus = data.length !== 1 ? null : data[0];
        this.expenseAccountStatus.code = this.updateCode;

        if (null !== this.expenseAccountStatus) {
          this.subscriptions.add(this.expenseAccountStatusService.set(this.expenseAccountStatus).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.expenseAccountStatus = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedExpenseAccountStatuses = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.expenseAccountStatus = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedExpenseAccountStatuses = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedExpenseAccountStatuses.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected expenseAccountStatus?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.expenseAccountStatusService.deleteListByIds(ids).subscribe(
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
