import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Observable, Subscription} from 'rxjs';
import {ConfirmationService, MenuItem} from 'primeng/api';
import {Organization} from '../../../shared/models/configuration/organization';
import {Employee} from '../../../shared/models/employee/employee';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {AuthenticationService} from '../../../shared/services/api/authentication.service';
import {GlobalService} from '../../../shared/services/api/global.service';
import {EmployeeService} from '../../../shared/services/api/employee/employee.service';
import {EmployeeStatus} from '../../../shared//models/configuration/employee/employee-status';
import {Position} from '../../../shared//models/configuration/employee/position';
import {EmployeeStatusService} from '../../../shared/services/api/configuration/employee/employee-status.service';
import {PositionService} from '../../../shared/services/api/configuration/employee/position.service';
import {Salary} from '../../../shared/models/employee/salary';
import {SalaryService} from '../../../shared/services/api/employee/salary.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedEmployees: Array<Employee> = [];
  loading: boolean;
  employeeList: Array<Employee> = [];
  className: string;
  cols: any[];
  editMode: number;
  employeeExportList: Array<Employee> = [];
  listTitle = 'Liste des Employees';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;
  selectedColumns: Array<any> = [];

  // Drop Down
  employeeStatusList: Array<EmployeeStatus> = [];
  employeeManagerList: Array<Employee> = [];
  employeePositionList: Array<Position> = [];
  dropDownSearchSentence: string;

  // Picture Upload
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  preview = '';
  imageInfos?: Observable<any>;

  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  currentOrganization: Organization;
  employee: Employee;
  oldSalary: Salary;
  newSalary: Salary;
  ids: Array<number>;
  // Component Attributes // Add
  // addResume: Resume;
  addPicture: String;
  addEmployeeStatus: EmployeeStatus;
  addRegistrationNumber: number;
  addPosition: Position;
  addFirstName: String;
  addLastName: String;
  addCin: String;
  addEmail: String;
  addPhoneNumber: String;
  addAddress: String;
  addBirthDate: Date;
  addRib: String;
  addCnssNumber: String;
  addKidsNumber: number;
  addFamilySituation: String;
  addHiringDate: Date;
  addSalaryAmount: number;
  addIsActive: boolean;
  addGender: String;
  addManager: Employee;
  // Component Attributes // Update
  // updateResume: Resume;
  updatePicture: String;
  updateEmployeeStatus: EmployeeStatus;
  updateRegistrationNumber: number;
  updatePosition: Position;
  updateFirstName: String;
  updateLastName: String;
  updateCin: String;
  updateEmail: String;
  updatePhoneNumber: String;
  updateAddress: String;
  updateBirthDate: Date;
  updateRib: String;
  updateCnssNumber: String;
  updateKidsNumber: number;
  updateFamilySituation: String;
  updateHiringDate: Date;
  updateOldSalaryAmount: number;
  updateNewSalaryAmount: number;
  updateIsActive: boolean;
  updateGender: String;
  updateManager: Employee;
  // Component Attributes // Search
  searchSentence: string;
  // searchResume: Resume;
  searchEmployeeStatus: EmployeeStatus;
  searchRegistrationNumber: number;
  searchPosition: Position;
  searchFirstName: String;
  searchLastName: String;
  searchCin: String;
  searchEmail: String;
  searchPhoneNumber: String;
  searchAddress: String;
  searchBirthDate: Date;
  searchRib: String;
  searchCnssNumber: String;
  searchKidsNumber: number;
  searchFamilySituation: String;
  searchHiringDate: Date;
  searchSalaryAmount: number;
  searchIsActive: boolean;
  searchGender: String;
  searchManager: Employee;

  constructor(private router: Router,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private authenticationService: AuthenticationService,
              private employeeStatusService: EmployeeStatusService,
              private positionService: PositionService,
              private globalService: GlobalService,
              private employeeService: EmployeeService,
              private salaryService: SalaryService,
              private confirmationService: ConfirmationService,
              @Inject(LOCALE_ID) private locale: string) {
  }

  ngOnInit() {
    this.items = [
      {label: ' Employee'},
      {label: 'Lister', routerLink: '/core/employee'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = Employee.name;
    this.cols = [
      {field: 'firstName', header: 'First Name', type: 'string'},
      {field: 'lastName', header: 'Last Name', type: 'string'},
      {field: 'isActive', header: 'Active', type: 'boolean'},
      {field: 'hiringDate', header: 'Hiring Date', type: 'date'},
      {field: 'salaryAmount', header: ' Salary Amount', type: 'number'},
      {field: 'registrationNumber', header: ' Registration Number', type: 'number'},
      {field: 'position', child: 'code', header: 'Position', type: 'object'},
      {field: 'employeeStatus', child: 'code', header: 'Status', type: 'object'},
      {field: 'cin', header: 'Cin', type: 'string'},
      {field: 'email', header: 'Email', type: 'string'},
      {field: 'phoneNumber', header: 'Phone Number', type: 'string'},
      {field: 'address', header: 'Address', type: 'string'},
      {field: 'birthDate', header: 'Birth Date', type: 'date'},
      {field: 'rib', header: 'RIB', type: 'string'},
      {field: 'cnssNumber', header: 'CNSS Number', type: 'string'},
      {field: 'gender', header: 'Gender', type: 'string'},
      {field: 'familySituation', header: 'Family Situation', type: 'string'},
      {field: 'kidsNumber', header: 'Kids Number', type: 'number'},
      {field: 'manager', child: 'firstName', header: 'Manager First name', type: 'object'},
      {field: 'manager', child: 'lastName', header: 'Manager Last name', type: 'object'},
      // {field: 'resume', child: 'xxxx', header: 'Resume', type: 'object'},
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
    // Set fields value
    this.addIsActive = true;
    this.updateIsActive = true;
    // Set Current Organization
    this.currentOrganization = this.authenticationService.getCurrentOrganization();
    // List search sentence
    this.searchSentence = '';
    this.searchSentence = 'organization.code:' + this.currentOrganization.code;
    // Drop Down search For Drop Down [Status, Manager and Position]
    this.dropDownSearchSentence = '';
    this.dropDownSearchSentence += 'organization.code:' + this.currentOrganization.code;

    this.subscriptions.add(this.employeeService.sizeSearch(this.searchSentence).subscribe(
      data => {
        this.collectionSize = data;
      },
      error => {
        this.toastr.error(error.message);
      }
    ));
    this.subscriptions.add(this.employeeService.findPagination(this.page, this.size, this.searchSentence).subscribe(
      data => {
        this.employeeList = data;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.toastr.error(error.message);
      },
      () => this.spinner.hide()
    ));
    // Employee status Drop Down
    this.subscriptions.add(this.employeeStatusService.find(this.dropDownSearchSentence).subscribe(
      (data) => {
        this.employeeStatusList = data;
      },
      (error) => {
        this.toastr.error(error.message);
      },
    ));
    // Manager Drop Down
    this.subscriptions.add(this.employeeService.find(this.dropDownSearchSentence).subscribe(
      (data) => {
        this.employeeManagerList = data;
      },
      (error) => {
        this.toastr.error(error.message);
      },
    ));
    // Position Drop Down
    this.subscriptions.add(this.positionService.find(this.dropDownSearchSentence).subscribe(
      (data) => {
        this.employeePositionList = data;
      },
      (error) => {
        this.toastr.error(error.message);
      },
    ));
  }

  loadDataLazy(event) {
    this.size = event.rows;
    this.page = event.first / this.size;
    this.loadData();
  }

  onExportExcel(event) {
    this.subscriptions.add(this.employeeService.findAll().subscribe(
      data => {
        this.employeeExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.employeeExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.employeeExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.employeeService.findAll().subscribe(
      data => {
        this.employeeExportList = data;
        this.globalService.generatePdf(event, this.employeeExportList, this.className, this.listTitle);
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

    // Check the First Name
    if (this.searchFirstName) {
      this.searchSentence += 'firstName:' + this.searchFirstName + ',';
      index = index + 1;
    }
    // Check the Last Name
    if (this.searchLastName) {
      this.searchSentence += 'lastName:' + this.searchLastName + ',';
      index = index + 1;
    }
    // Check the Registration Number
    if (this.searchRegistrationNumber) {
      this.searchSentence += 'registrationNumber:' + this.searchRegistrationNumber + ',';
      index = index + 1;
    }
    // Check the Position
    if (this.searchPosition) {
      this.searchSentence += 'position.id:' + this.searchPosition.id + ',';
      index = index + 1;
    }
    // Check the Employee Status
    if (this.searchEmployeeStatus) {
      this.searchSentence += 'employeeStatus:' + this.searchEmployeeStatus + ',';
      index = index + 1;
    }
    // Check the CIN
    if (this.searchCin) {
      this.searchSentence += 'cin:' + this.searchCin + ',';
      index = index + 1;
    }
    // Check the Email
    if (this.searchEmail) {
      this.searchSentence += 'email:' + this.searchEmail + ',';
      index = index + 1;
    }
    // Check the Phone Number
    if (this.searchPhoneNumber) {
      this.searchSentence += 'phoneNumber:' + this.searchPhoneNumber + ',';
      index = index + 1;
    }
    // Check the Address
    if (this.searchAddress) {
      this.searchSentence += 'address:' + this.searchAddress + ',';
      index = index + 1;
    }
    // Check the Birth Date
    if (this.searchBirthDate) {
      this.searchSentence += 'birthDate:' + this.searchBirthDate + ',';
      index = index + 1;
    }
    // Check the RIB
    if (this.searchRib) {
      this.searchSentence += 'rib:' + this.searchRib + ',';
      index = index + 1;
    }
    // Check the CNSS Number
    if (this.searchCnssNumber) {
      this.searchSentence += 'cnssNumber:' + this.searchCnssNumber + ',';
      index = index + 1;
    }
    // Check the Gender
    if (this.searchGender) {
      this.searchSentence += 'gender:' + this.searchGender + ',';
      index = index + 1;
    }
    // Check the Family Situation
    if (this.searchFamilySituation) {
      this.searchSentence += 'familySituation:' + this.searchFamilySituation + ',';
      index = index + 1;
    }
    // Check the Kids Number
    if (this.searchKidsNumber) {
      this.searchSentence += 'kidsNumber:' + this.searchKidsNumber + ',';
      index = index + 1;
    }
    // Check the Manager
    if (this.searchManager) {
      this.searchSentence += 'manager.id:' + this.searchManager.id + ',';
      index = index + 1;
    }
    // Check the Hiring Date
    if (this.searchHiringDate) {
      this.searchSentence += 'hiringDate:' + this.searchHiringDate + ',';
      index = index + 1;
    }
    // Check the Is Active
    if (this.searchIsActive) {
      this.searchSentence += 'isActive:' + this.searchIsActive + ',';
      index = index + 1;
    } else {
      this.searchSentence += 'isActive:' + false + ',';
      index = index + 1;
    }
    // Check the Salary
    if (this.searchSalaryAmount) {
      this.searchSentence += 'salaryAmount:' + this.searchSalaryAmount + ',';
      index = index + 1;
    }
    if (index > 0 && index === 1) {
      this.searchSentence = this.searchSentence.slice(0, -1);
    } else {
      this.searchSentence = '.' + this.searchSentence.slice(0, -1);
    }

    this.subscriptions.add(this.employeeService.find(this.searchSentence).subscribe(
      (data) => {
        this.employeeList = data;
      },
      (error) => {
        this.toastr.error(error.message);
      }
    ));
  }

  reset() {
    this.searchSentence = null;
    this.searchEmployeeStatus = null;
    this.searchRegistrationNumber = null;
    this.searchPosition = null;
    this.searchFirstName = null;
    this.searchLastName = null;
    this.searchCin = null;
    this.searchEmail = null;
    this.searchPhoneNumber = null;
    this.searchAddress = null;
    this.searchBirthDate = null;
    this.searchRib = null;
    this.searchCnssNumber = null;
    this.searchKidsNumber = null;
    this.searchFamilySituation = null;
    this.searchIsActive = null;
    this.searchSalaryAmount = null;
    this.searchHiringDate = null;
    this.searchGender = null;
    this.searchManager = null;

    this.loadData();
  }

  onObjectEdited(event) {
    this.editMode = event.operationMode;
    this.selectedEmployees = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updatePicture = '../../../../assets/img/employees/' + this.selectedEmployees[0].id + '.png';
      this.updateEmployeeStatus = this.selectedEmployees[0].employeeStatus;
      this.updateRegistrationNumber = this.selectedEmployees[0].registrationNumber;
      this.updatePosition = this.selectedEmployees[0].position;
      this.updateFirstName = this.selectedEmployees[0].firstName;
      this.updateLastName = this.selectedEmployees[0].lastName;
      this.updateCin = this.selectedEmployees[0].cin;
      this.updateEmail = this.selectedEmployees[0].email;
      this.updatePhoneNumber = this.selectedEmployees[0].phoneNumber;
      this.updateAddress = this.selectedEmployees[0].address;
      this.updateBirthDate = new Date(this.pipe.transform(this.selectedEmployees[0].birthDate, 'dd/MM/yyyy'));
      this.updateRib = this.selectedEmployees[0].rib;
      this.updateCnssNumber = this.selectedEmployees[0].cnssNumber;
      this.updateKidsNumber = this.selectedEmployees[0].kidsNumber;
      this.updateFamilySituation = this.selectedEmployees[0].familySituation;
      this.updateHiringDate = new Date(this.pipe.transform(this.selectedEmployees[0].hiringDate, 'dd/MM/yyyy'));
      this.updateIsActive = this.selectedEmployees[0].isActive;
      this.updateOldSalaryAmount = this.selectedEmployees[0].salaryAmount;
      this.updateNewSalaryAmount = this.selectedEmployees[0].salaryAmount;
      this.updateGender = this.selectedEmployees[0].gender;
      this.updateManager = this.selectedEmployees[0].manager;
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    // Check Email
    const emailPattern = new RegExp('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$');
    if (!emailPattern.test(this.addEmail.toString())) {
      this.toastr.error('Veuillez Saisir un email correct', 'Error');
      return;
    }
    // Creating the new Employee
    this.employee = new Employee();
    this.employee.employeeStatus = this.addEmployeeStatus;
    this.employee.registrationNumber = this.addRegistrationNumber;
    this.employee.position = this.addPosition;
    this.employee.firstName = this.addFirstName;
    this.employee.lastName = this.addLastName;
    this.employee.cin = this.addCin;
    this.employee.email = this.addEmail;
    this.employee.phoneNumber = this.addPhoneNumber;
    this.employee.address = this.addAddress;
    this.employee.birthDate = this.addBirthDate;
    this.employee.rib = this.addRib;
    this.employee.cnssNumber = this.addCnssNumber;
    this.employee.kidsNumber = this.addKidsNumber;
    this.employee.familySituation = this.addFamilySituation;
    this.employee.gender = this.addGender;
    this.employee.hiringDate = this.addHiringDate;
    this.employee.isActive = this.addIsActive;
    this.employee.salaryAmount = this.addSalaryAmount;
    this.employee.manager = this.addManager;
    this.employee.organization = this.currentOrganization;

    this.subscriptions.add(this.employeeService.set(this.employee).subscribe(
      (employeeData) => {
        this.toastr.success('Employé Enregistré Avec Succès', 'Création');
        this.employee = employeeData;
        if (this.employee) {
          // Creating the new Salary
          this.newSalary = new Salary();
          this.newSalary.amount = this.addSalaryAmount;
          this.newSalary.beginDate = new Date();
          this.newSalary.employee = this.employee;
          this.newSalary.isActive = true;
          this.newSalary.organization = this.currentOrganization;

          this.salaryService.set(this.newSalary).subscribe(
            (SalaryData) => {
              this.toastr.success('Elément est supprimer Avec Succès', 'Création');
              this.employee = null;
              this.newSalary = null;
              this.addEmployeeStatus = null;
              this.addRegistrationNumber = null;
              this.addPosition = null;
              this.addFirstName = null;
              this.addLastName = null;
              this.addCin = null;
              this.addEmail = null;
              this.addPhoneNumber = null;
              this.addAddress = null;
              this.addBirthDate = null;
              this.addRib = null;
              this.addCnssNumber = null;
              this.addKidsNumber = null;
              this.addFamilySituation = null;
              this.addGender = null;
              this.addIsActive = true;
              this.addHiringDate = null;
              this.addManager = null;
              this.editMode = null;
              this.selectedEmployees = null;
              this.loadData();
            },
            (salaryError) => {
              this.toastr.error(salaryError.message);
              this.employee = null;
              this.newSalary = null;
              this.addEmployeeStatus = null;
              this.addRegistrationNumber = null;
              this.addPosition = null;
              this.addFirstName = null;
              this.addLastName = null;
              this.addCin = null;
              this.addEmail = null;
              this.addPhoneNumber = null;
              this.addAddress = null;
              this.addBirthDate = null;
              this.addRib = null;
              this.addCnssNumber = null;
              this.addKidsNumber = null;
              this.addFamilySituation = null;
              this.addGender = null;
              this.addIsActive = true;
              this.addHiringDate = null;
              this.addManager = null;
              this.editMode = null;
              this.selectedEmployees = null;
              this.loadData();
            }
          );
        }
      },
      (employeeError) => {
        this.toastr.error(employeeError.message);
        this.employee = null;
        this.addEmployeeStatus = null;
        this.addRegistrationNumber = null;
        this.addPosition = null;
        this.addFirstName = null;
        this.addLastName = null;
        this.addCin = null;
        this.addEmail = null;
        this.addPhoneNumber = null;
        this.addAddress = null;
        this.addBirthDate = null;
        this.addRib = null;
        this.addCnssNumber = null;
        this.addKidsNumber = null;
        this.addFamilySituation = null;
        this.addGender = null;
        this.addManager = null;
        this.addIsActive = true;
        this.addHiringDate = null;
        this.editMode = null;
        this.selectedEmployees = null;
        this.loadData();
      }
    ));
  }

  onEdit() {
    this.employee = null;
    // Check Email
    const emailPattern = new RegExp('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$');
    if (!emailPattern.test(this.updateEmail.toString())) {
      this.toastr.error('Veuillez Saisir un email correct', 'Error');
      return;
    }
    // Updating the Employee
    this.subscriptions.add(this.employeeService.findById(this.selectedEmployees[0].id).subscribe(
      (getEmployeeData) => {
        this.employee = getEmployeeData;

        if (null !== this.employee) {
          if (this.updateOldSalaryAmount !== this.updateNewSalaryAmount) {
            // Getting the old Salary
            let oldSalarySearchSentence = '.';
            oldSalarySearchSentence += 'employee.id:' + this.employee.id + ',';
            oldSalarySearchSentence += 'isActive:' + true;
            this.salaryService.find(oldSalarySearchSentence).subscribe(
              (getOldSalaryData) => {
                this.oldSalary = getOldSalaryData[0];
                this.oldSalary.endDate = new Date();
                this.oldSalary.isActive = false;
                this.salaryService.set(this.oldSalary).subscribe(
                  (setOldSalaryData) => {
                    this.toastr.success('Salaire modifié avec succès', 'Edition');
                    this.oldSalary = null;
                    // Creating the new Salary
                    this.newSalary = new Salary();
                    this.newSalary.amount = this.updateNewSalaryAmount;
                    this.newSalary.beginDate = new Date();
                    this.newSalary.employee = this.employee;
                    this.newSalary.isActive = true;
                    this.newSalary.organization = this.currentOrganization;
                    this.salaryService.set(this.newSalary).subscribe(
                      (setNewSalaryData) => {
                        this.toastr.success('Salaire ajouté avec succès', 'Création');
                        // Updating the selected Employee
                        this.employee.firstName = this.updateFirstName;
                        this.employee.lastName = this.updateLastName;
                        this.employee.registrationNumber = this.updateRegistrationNumber;
                        this.employee.position = this.updatePosition;
                        this.employee.employeeStatus = this.updateEmployeeStatus;
                        this.employee.cin = this.updateCin;
                        this.employee.email = this.updateEmail;
                        this.employee.phoneNumber = this.updatePhoneNumber;
                        this.employee.address = this.updateAddress;
                        this.employee.birthDate = this.updateBirthDate;
                        this.employee.rib = this.updateRib;
                        this.employee.cnssNumber = this.updateCnssNumber;
                        this.employee.gender = this.updateGender;
                        this.employee.familySituation = this.updateFamilySituation;
                        this.employee.kidsNumber = this.updateKidsNumber;
                        this.employee.hiringDate = this.updateHiringDate;
                        this.employee.isActive = this.updateIsActive;
                        this.employee.salaryAmount = this.updateNewSalaryAmount;
                        this.employee.manager = this.updateManager;
                        this.employeeService.set(this.employee).subscribe(
                          (setEmployeeData) => {
                            this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
                            this.employee = null;
                            this.newSalary = null;
                            this.updateEmployeeStatus = null;
                            this.updateRegistrationNumber = null;
                            this.updatePosition = null;
                            this.updateFirstName = null;
                            this.updateLastName = null;
                            this.updateCin = null;
                            this.updateEmail = null;
                            this.updatePhoneNumber = null;
                            this.updateAddress = null;
                            this.updateBirthDate = null;
                            this.updateRib = null;
                            this.updateCnssNumber = null;
                            this.updateKidsNumber = null;
                            this.updateFamilySituation = null;
                            this.updateGender = null;
                            this.updateHiringDate = null;
                            this.updateIsActive = true;
                            this.updateOldSalaryAmount = null;
                            this.updateNewSalaryAmount = null;
                            this.updateManager = null;
                            this.editMode = null;
                            this.selectedEmployees = null;
                            this.dialogDisplayEdit = false;
                            this.loadData();
                          },
                          (setEmployeeError) => {
                            this.toastr.error(setEmployeeError.message);
                            this.employee = null;
                            this.newSalary = null;
                            this.updateEmployeeStatus = null;
                            this.updateRegistrationNumber = null;
                            this.updatePosition = null;
                            this.updateFirstName = null;
                            this.updateLastName = null;
                            this.updateCin = null;
                            this.updateEmail = null;
                            this.updatePhoneNumber = null;
                            this.updateAddress = null;
                            this.updateBirthDate = null;
                            this.updateRib = null;
                            this.updateCnssNumber = null;
                            this.updateKidsNumber = null;
                            this.updateFamilySituation = null;
                            this.updateGender = null;
                            this.updateHiringDate = null;
                            this.updateIsActive = true;
                            this.updateOldSalaryAmount = null;
                            this.updateNewSalaryAmount = null;
                            this.updateManager = null;
                            this.editMode = null;
                            this.selectedEmployees = null;
                            this.dialogDisplayEdit = false;
                            this.loadData();
                          }
                        );
                      },
                      (setNewSalaryError) => {
                        this.toastr.error(setNewSalaryError.message);
                        this.newSalary = null;
                        this.loadData();
                      }
                    );
                    this.loadData();
                  },
                  (setOldSalaryError) => {
                    this.toastr.error(setOldSalaryError.message);
                    this.oldSalary = null;
                    this.loadData();
                  }
                );
              },
              (getOldSalaryError) => {
                this.toastr.error(getOldSalaryError.message);
                this.loadData();
              }
            );
          } else {
            // Updating the selected Employee
            this.employee.firstName = this.updateFirstName;
            this.employee.lastName = this.updateLastName;
            this.employee.registrationNumber = this.updateRegistrationNumber;
            this.employee.position = this.updatePosition;
            this.employee.employeeStatus = this.updateEmployeeStatus;
            this.employee.cin = this.updateCin;
            this.employee.email = this.updateEmail;
            this.employee.phoneNumber = this.updatePhoneNumber;
            this.employee.address = this.updateAddress;
            this.employee.birthDate = this.updateBirthDate;
            this.employee.rib = this.updateRib;
            this.employee.cnssNumber = this.updateCnssNumber;
            this.employee.gender = this.updateGender;
            this.employee.familySituation = this.updateFamilySituation;
            this.employee.kidsNumber = this.updateKidsNumber;
            this.employee.hiringDate = this.updateHiringDate;
            this.employee.isActive = this.updateIsActive;
            this.employee.salaryAmount = this.updateNewSalaryAmount;
            this.employee.manager = this.updateManager;
            this.employeeService.set(this.employee).subscribe(
              (setEmployeeData) => {
                this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
                this.employee = null;
                this.updateEmployeeStatus = null;
                this.updateRegistrationNumber = null;
                this.updatePosition = null;
                this.updateFirstName = null;
                this.updateLastName = null;
                this.updateCin = null;
                this.updateEmail = null;
                this.updatePhoneNumber = null;
                this.updateAddress = null;
                this.updateBirthDate = null;
                this.updateRib = null;
                this.updateCnssNumber = null;
                this.updateKidsNumber = null;
                this.updateFamilySituation = null;
                this.updateGender = null;
                this.updateHiringDate = null;
                this.updateIsActive = true;
                this.updateOldSalaryAmount = null;
                this.updateNewSalaryAmount = null;
                this.updateManager = null;
                this.editMode = null;
                this.selectedEmployees = null;
                this.dialogDisplayEdit = false;
                this.loadData();
              },
              (setEmployeeError) => {
                this.toastr.error(setEmployeeError.message);
                this.employee = null;
                this.updateEmployeeStatus = null;
                this.updateRegistrationNumber = null;
                this.updatePosition = null;
                this.updateFirstName = null;
                this.updateLastName = null;
                this.updateCin = null;
                this.updateEmail = null;
                this.updatePhoneNumber = null;
                this.updateAddress = null;
                this.updateBirthDate = null;
                this.updateRib = null;
                this.updateCnssNumber = null;
                this.updateKidsNumber = null;
                this.updateFamilySituation = null;
                this.updateGender = null;
                this.updateHiringDate = null;
                this.updateIsActive = true;
                this.updateOldSalaryAmount = null;
                this.updateNewSalaryAmount = null;
                this.updateManager = null;
                this.editMode = null;
                this.selectedEmployees = null;
                this.dialogDisplayEdit = false;
                this.loadData();
              }
            );
          }
        }
      },
      (getEmployeeError) => {
        this.toastr.error(getEmployeeError.message);
        this.loadData();
      }
    ));
  }

  onDelete() {
    const ids = this.selectedEmployees.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected employee?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.employeeService.deleteListByIds(ids).subscribe(
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

  selectFile(event: any): void {
    this.message = '';
    this.preview = '';
    this.progress = 0;
    this.selectedFiles = event.target.files;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.preview = '';
        this.currentFile = file;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.preview = e.target.result;
        };

        reader.readAsDataURL(this.currentFile);
      }
    }
  }

  filterEmployeeStatus(event) {
    // in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    const filtered: any[] = [];
    const code = event.query;

    if (code) {
      for (let i = 0; i < this.employeeStatusList.length; i++) {
        const employeeStatus = this.employeeStatusList[i];
        if (employeeStatus.code.toLowerCase().indexOf(code.toLowerCase()) === 0) {
          filtered.push(employeeStatus);
        }
      }
      this.employeeStatusList = filtered;
    } else {
      this.subscriptions.add(this.employeeStatusService.find(this.dropDownSearchSentence).subscribe(
        (data) => {
          this.employeeStatusList = data;
        },
        (error) => {
          this.toastr.error(error.message);
        },
      ));
    }
  }

  filterManager(event) {
    // in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    const filtered: any[] = [];
    const firstOrLastName = event.query;

    if (firstOrLastName) {
      for (let i = 0; i < this.employeeManagerList.length; i++) {
        const employeeManager = this.employeeManagerList[i];
        // tslint:disable-next-line:max-line-length
        if ((employeeManager.firstName.toLowerCase().indexOf(firstOrLastName.toLowerCase()) === 0) || (employeeManager.lastName.toLowerCase().indexOf(firstOrLastName.toLowerCase()) === 0)) {
          filtered.push(employeeManager);
        }
      }
      this.employeeManagerList = filtered;
    } else {
      this.subscriptions.add(this.employeeService.find(this.dropDownSearchSentence).subscribe(
        (data) => {
          this.employeeManagerList = data;
        },
        (error) => {
          this.toastr.error(error.message);
        },
      ));
    }
  }

  filterPosition(event) {
    // in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    const filtered: any[] = [];
    const code = event.query;

    if (code) {
      for (let i = 0; i < this.employeePositionList.length; i++) {
        const employeePosition = this.employeePositionList[i];
        if (employeePosition.code.toLowerCase().indexOf(code.toLowerCase()) === 0) {
          filtered.push(employeePosition);
        }
      }
      this.employeePositionList = filtered;
    } else {
      this.subscriptions.add(this.positionService.find(this.dropDownSearchSentence).subscribe(
        (data) => {
          this.employeePositionList = data;
        },
        (error) => {
          this.toastr.error(error.message);
        },
      ));
    }
  }


  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
