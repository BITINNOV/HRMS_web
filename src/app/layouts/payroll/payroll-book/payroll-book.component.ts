import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {PayrollBook} from '../../../shared/models/payroll/payroll-book';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem} from 'primeng/api';
import {Employee} from '../../../shared/models/employee/employee';
import {Organization} from '../../../shared/models/configuration/organization';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {AuthenticationService} from '../../../shared/services/api/authentication.service';
import {EmployeeService} from '../../../shared/services/api/employee/employee.service';
import {GlobalService} from '../../../shared/services/api/global.service';
import {PayrollBookService} from '../../../shared/services/api/payroll/payroll-book.service';

@Component({
  selector: 'app-payroll-book',
  templateUrl: './payroll-book.component.html',
  styleUrls: ['./payroll-book.component.css']
})
export class PayrollBookComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedPayrollBooks: Array<PayrollBook> = [];
  loading: boolean;
  payrollBookList: Array<PayrollBook> = [];
  className: string;
  cols: any[];
  editMode: number;
  payrollBookExportList: Array<PayrollBook> = [];
  listTitle = 'Liste des PayrollBooks';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;
  selectedColumns: Array<any> = [];

  // Drop Down
  employeeList: Array<Employee> = [];
  dropDownSearchSentence_Employee: string;

  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  currentOrganization: Organization;
  payrollBook: PayrollBook;
  ids: Array<number>;
  // Component Attributes // Add
  addInputDate: Date;
  // Component Attributes // Update
  updateInputDate: Date;
  // Component Attributes // Search
  searchSentence: string;
  searchInputDate: Date;

  constructor(private router: Router,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private authenticationService: AuthenticationService,
              private employeeService: EmployeeService,
              private globalService: GlobalService,
              private payrollBookService: PayrollBookService,
              private confirmationService: ConfirmationService,
              @Inject(LOCALE_ID) private locale: string) {
  }

  ngOnInit() {
    this.items = [
      {label: ' PayrollBook'},
      {label: 'Lister', routerLink: '/core/payrollBook'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = PayrollBook.name;
    this.cols = [
      {field: 'inputDate', header: 'Input Date', type: 'date'},
    ];
    this.selectedColumns = this.cols;
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
    // Set Current Organization
    this.currentOrganization = this.authenticationService.getCurrentOrganization();
    // List search sentence
    this.searchSentence = '';
    this.searchSentence = 'organization.id:' + this.currentOrganization.id;
    // Drop Down search For Employee
    this.dropDownSearchSentence_Employee = '';
    this.dropDownSearchSentence_Employee += 'organization.id:' + this.currentOrganization.id;

    this.subscriptions.add(this.payrollBookService.sizeSearch(this.searchSentence).subscribe(
      data => {
        this.collectionSize = data;
      },
      error => {
        this.toastr.error(error.message);
      }
    ));
    this.subscriptions.add(this.payrollBookService.findPagination(this.page, this.size, this.searchSentence).subscribe(
      data => {
        this.payrollBookList = data;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.toastr.error(error.message);
      },
      () => this.spinner.hide()
    ));
    this.subscriptions.add(this.employeeService.find(this.dropDownSearchSentence_Employee).subscribe(
      (data) => {
        this.employeeList = data;
      },
      (error) => {
        this.spinner.hide();
        this.toastr.error(error.message);
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
    this.subscriptions.add(this.payrollBookService.findAll().subscribe(
      data => {
        this.payrollBookExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.payrollBookExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.payrollBookExportList, this.className, this.listTitle);
        }
        this.spinner.hide();
      },
      error => {
        this.toastr.error(error.message);
        this.spinner.hide();
      },
      () => this.spinner.hide()
    ));
  }

  onExportPdf(event) {
    this.subscriptions.add(this.payrollBookService.findAll().subscribe(
      data => {
        this.payrollBookExportList = data;
        this.globalService.generatePdf(event, this.payrollBookExportList, this.className, this.listTitle);
        this.spinner.hide();
      },
      error => {
        this.toastr.error(error.message);
        this.spinner.hide();
      },
      () => this.spinner.hide()
    ));
  }

  search() {
    this.searchSentence = '';
    let index = 0;

    // Check the Input Date
    if (this.searchInputDate) {
      this.searchSentence += 'inputDate:' + this.searchInputDate + ',';
      index = index + 1;
    }
    if (index > 0 && index === 1) {
      this.searchSentence = this.searchSentence.slice(0, -1);
    } else {
      this.searchSentence = '.' + this.searchSentence.slice(0, -1);
    }

    this.subscriptions.add(this.payrollBookService.find(this.searchSentence).subscribe(
      (data) => {
        this.payrollBookList = data;
      },
      (error) => {
        this.toastr.error(error.message);
      }
    ));
  }

  reset() {
    this.searchSentence = null;
    this.searchInputDate = null;

    this.loadData();
  }

  onObjectEdited(event) {
    this.editMode = event.operationMode;
    this.selectedPayrollBooks = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateInputDate = this.selectedPayrollBooks[0].inputDate;
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    } else if (this.editMode === 4) { // GENERATE
      this.spinner.show();
      this.payrollBook = this.selectedPayrollBooks[0];
      this.subscriptions.add(this.payrollBookService.generatePayrollBook(this.payrollBook).subscribe(
        (data) => {
          const blob = new Blob([data], {type: 'application/pdf'});
          const downloadURL = window.URL.createObjectURL(data);
          const link = document.createElement('a');
          link.href = downloadURL;
          link.download = 'PayrollBook' + this.payrollBook.inputDate + '.pdf';
          link.click();
          this.spinner.hide();
        },
        (error) => {
          this.toastr.error(error.message);
          this.spinner.hide();
        },
      ));
    }
  }

  onSave() {
    this.payrollBook = new PayrollBook();
    this.payrollBook.inputDate = this.addInputDate;
    this.payrollBook.organization = this.currentOrganization;
    console.log(this.payrollBook);
    this.subscriptions.add(this.payrollBookService.set(this.payrollBook).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.payrollBook = null;
        this.addInputDate = null;
        this.editMode = null;
        this.selectedPayrollBooks = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.payrollBook = null;
        this.addInputDate = null;
        this.editMode = null;
        this.selectedPayrollBooks = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.payrollBook = null;
    this.subscriptions.add(this.payrollBookService.findById(this.selectedPayrollBooks[0].id).subscribe(
      (data) => {
        this.payrollBook = data;
        this.payrollBook.inputDate = this.updateInputDate;

        if (null !== this.payrollBook) {
          this.subscriptions.add(this.payrollBookService.set(this.payrollBook).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.payrollBook = null;
              this.updateInputDate = null;
              this.selectedPayrollBooks = null;
              this.dialogDisplayEdit = false;
              this.editMode = null;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.payrollBook = null;
              this.updateInputDate = null;
              this.selectedPayrollBooks = null;
              this.dialogDisplayEdit = false;
              this.editMode = null;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedPayrollBooks.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected payrollBook?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.payrollBookService.deleteListByIds(ids).subscribe(
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

  filterEmployee(event) {
    // in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    const filtered: any[] = [];
    const firstOrLastName = event.query;

    if (firstOrLastName) {
      for (let i = 0; i < this.employeeList.length; i++) {
        const employee = this.employeeList[i];
        // tslint:disable-next-line:max-line-length
        if ((employee.firstName.toLowerCase().indexOf(firstOrLastName.toLowerCase()) === 0) || (employee.lastName.toLowerCase().indexOf(firstOrLastName.toLowerCase()) === 0)) {
          filtered.push(employee);
        }
      }
      this.employeeList = filtered;
    } else {
      this.subscriptions.add(this.employeeService.find(this.dropDownSearchSentence_Employee).subscribe(
        (data) => {
          this.employeeList = data;
        },
        (error) => {
          this.spinner.hide();
          this.toastr.error(error.message);
        },
        () => this.spinner.hide()
      ));
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
