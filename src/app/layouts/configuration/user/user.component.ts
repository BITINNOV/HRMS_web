import {ToastrService} from 'ngx-toastr';
import {GlobalService} from '../../../shared/services/api/global.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {Subscription} from 'rxjs';
import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {User} from '../../../shared/models/configuration/user';
import {UserService} from '../../../shared/services/api/configuration/user.service';
import {Columns} from '../../../shared/models/columns';
import {Country} from '../../../shared/models/configuration/country';
import {Md5} from 'ts-md5';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedUsers: Array<User> = [];
  loading: boolean;
  userList: Array<User> = [];
  className: string;
  cols: any[];
  editMode: number;
  userExportList: Array<User> = [];
  listTitle = 'Liste des users';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;
  selectedColumns: Array<any> = [];


  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  user: User;
  ids: Array<number>;

  // Component Attributes // Add
  addCode: string;
  addName: string;
  addComment: string;
  addActive: boolean;
  addCreationDate: Date;
  addUpdateDate: Date;
  addSurname: string;
  addEmail: string;
  addPassword: string;
  addTel: string;
  addPassport: string;
  addDateOfBirth: Date;
  addType: number;

  // Component Attributes // Update
  updateCode: string;
  updateName: string;
  updateComment: string;
  updateActive: boolean;
  updateCreationDate: Date;
  updateUpdateDate: Date;
  updateSurname: string;
  updateEmail: string;
  updatePassword: string;
  updateTel: string;
  updatePassport: string;
  updateDateOfBirth: Date;
  updateType: number;
  updateColumns: Columns;

  // Component Attributes // Search
  searchSentence: string;
  searchCode: string;
  searchName: string;
  searchComment: string;
  searchActive: boolean;
  searchCreationDate: Date;
  searchUpdateDate: Date;
  searchSurname: string;
  searchEmail: string;
  searchPassword: string;
  searchTel: string;
  searchPassport: string;
  searchDateOfBirth: Date;
  searchType: number;
  searchColumns: Columns;

  constructor(private userService: UserService,
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
      {label: ' Country'},
      {label: 'Lister', routerLink: '/core/country'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = Country.name;
    this.cols = [
      {field: 'code', header: 'Code', type: 'string'},
      {field: 'name', header: 'Nom', type: 'string'},
      {field: 'surname', header: 'Nom de Famille', type: 'string'},
      {field: 'comment', header: 'Commentaire', type: 'string'},
      {field: 'creationDate', header: 'Date Création  ', type: 'date'},
      {field: 'active', header: 'Active', type: 'boolean'},
      {field: 'email', header: 'Email', type: 'string'},
      {field: 'updateDate', header: 'Date de Modification  ', type: 'date'},
      {field: 'tel', header: 'Téléphone', type: 'string'},
      {field: 'passport', header: 'passport', type: 'string'},
      {field: 'dateOfBirth', header: 'Date de naissance ', type: 'date'},
    ];
    this.selectedColumns = this.cols;
    this.loadData();
  }

  loadData() {
    this.spinner.show();
    this.subscriptions.add(this.userService.size().subscribe(
      data => {
        this.collectionSize = data;
      }
    ));
    this.subscriptions.add(this.userService.findAllPagination(this.page, this.size).subscribe(
      data => {
        this.userList = data;
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
    this.subscriptions.add(this.userService.findAll().subscribe(
      data => {
        this.userExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.userExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.userExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.userService.findAll().subscribe(
      data => {
        this.userExportList = data;
        this.globalService.generatePdf(event, this.userExportList, this.className, this.listTitle);
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
    this.searchSentence = 'code:' + this.searchCode;

    this.subscriptions.add(this.userService.find(this.searchSentence).subscribe(
      (data) => {
        this.userList = data;
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
    this.selectedUsers = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedUsers[0].code.toString();
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
    // Creating the new User
    this.user = new User();
    this.user.code = this.addCode;
    this.user.name = this.addName;
    this.user.comment = this.addComment;
    this.user.active = true;
    this.user.creationDate = new Date();
    this.user.updateDate = new Date();
    this.user.surname = this.addSurname;
    this.user.email = this.addEmail;
    this.user.password = Md5.hashStr(this.addPassword).toString();
    this.user.tel = this.addTel;
    this.user.passport = this.addPassport;
    this.user.dateOfBirth = new Date();
    this.user.type = 1;

    this.subscriptions.add(this.userService.set(this.user).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.user = null;
        this.user.code = null;
        this.user.name = null;
        this.user.comment = null;
        this.user.active = null;
        this.user.creationDate = null;
        this.user.updateDate = null;
        this.user.surname = null;
        this.user.email = null;
        this.user.password = null;
        this.user.tel = null;
        this.user.passport = null;
        this.user.dateOfBirth = null;
        this.user.type = null;
        this.editMode = null;
        this.selectedUsers = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.user = null;
        this.user.code = null;
        this.user.name = null;
        this.user.comment = null;
        this.user.active = null;
        this.user.creationDate = null;
        this.user.updateDate = null;
        this.user.surname = null;
        this.user.email = null;
        this.user.password = null;
        this.user.tel = null;
        this.user.passport = null;
        this.user.dateOfBirth = null;
        this.user.type = null;
        this.editMode = null;
        this.selectedUsers = null;
        this.loadData();
      }
    ));
  }

  onEdit() {
    // Check Email
    const emailPattern = new RegExp('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$');
    if (!emailPattern.test(this.updateEmail.toString())) {
      this.toastr.error('Veuillez Saisir un email correct', 'Error');
      return;
    }
    // Updating the User
    this.user = null;
    this.subscriptions.add(this.userService.find('code:' + this.selectedUsers[0].code).subscribe(
      (data) => {
        this.user = data.length !== 1 ? null : data[0];
        this.user.code = this.updateCode;

        if (null !== this.user) {
          this.subscriptions.add(this.userService.set(this.user).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.user = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedUsers = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.user = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedUsers = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedUsers.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected user?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.userService.deleteListByIds(ids).subscribe(
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
