import {EmittedOBject} from './emitted-object';
import {UserService} from '../../services/api/configuration/user.service';
import {AuthenticationService} from '../../services/api/authentication.service';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {User} from '../../models/configuration/user';
import {MenuItem} from 'primeng/api';
import {Columns} from '../../models/columns';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Organization} from '../../models/configuration/organization';
import {ColumnsService} from '../../services/api/columns.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
})

export class DataTableComponent implements OnInit {
  @Input() permissionCreate: string[] = [];
  @Input() permissionEdit: string[] = [];
  @Input() permissionDelete: string[] = [];
  @Input() page = 0;
  @Input() size = 0;
  @Input() collectionSize: number;
  @Input() objectList: Array<any> = [];
  @Input() objectExportList: Array<any> = [];
  @Input() cols: any[];
  @Input() className: String;
  @Input() listName: String;
  @Input() addBtnVisible = false;
  @Input() viewBtnVisible = false;
  @Input() updateBtnVisible = false;
  @Input() deleteBtnVisible = false;
  @Input() generateBtnVisible = false;
  @Output() lazyLoadData = new EventEmitter<any>();
  @Output() objectEdited = new EventEmitter<EmittedOBject>();
  @Output() exportBtnExcelGlobal = new EventEmitter<any[]>();
  @Output() exportBtnExcelVue = new EventEmitter<any[]>();
  @Output() exportBtnPdf = new EventEmitter<any[]>();
  exportColumns: Array<any> = [];
  columnsAdded: Array<any> = [];
  columnsMapped: Array<any> = [];
  exportBtnItems: MenuItem[] = [];
  selectedObjects: Array<any> = [];
  currentUser = new User();
  currentOrganization = new Organization();
  updateBtnDisable = false;
  deleteBtnDisable = false;
  generateBtnDisable = false;
  items: MenuItem[];
  subscriptions = new Subscription();

  constructor(private spinner: NgxSpinnerService,
              private toastr: ToastrService,
              private authenticationService: AuthenticationService,
              private userservice: UserService,
              private columnsService: ColumnsService) {
  }

  @Input() _selectedColumns: Array<any> = [];

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    // restore original order
    this._selectedColumns = this.cols.filter((col) => val.includes(col));
  }

  ngOnInit() {
    this.loadColumns();

    this.items = [
      {
        label: 'En PDF', icon: 'pi pi-file-pdf', command: () => {
          this.exportPdf();
        },
      },
      {
        label: 'En EXCEL Vue', icon: 'pi pi-file-excel', command: () => {
          this.exportExcelVue();
        },
      },
      {
        label: 'En EXCEL Globale', icon: 'pi pi-file-excel', command: () => {
          this.exportExcelGlobal();
        },
      },
    ];
  }

  loadColumns() {
    this.currentUser = this.authenticationService.getCurrentUser();
    this.currentOrganization = this.authenticationService.getCurrentOrganization();

    let searchSentense_Columns = '.';
    searchSentense_Columns += 'classe:' + this.className + ',';
    searchSentense_Columns += 'user.id:' + this.currentUser.id + ',';
    searchSentense_Columns += 'organization.id:' + this.currentOrganization.id;

    this.subscriptions.add(this.columnsService.find(searchSentense_Columns).subscribe(
      (data) => {
        this.columnsAdded = data;

        if (this.columnsAdded && this.columnsAdded.length > 0) {
          this.columnsMapped = this.columnsAdded.filter(
            (tab) => tab.classe === this.className
          );
          if (this.columnsMapped.length >= 1) {
            for (let i = 0; i < this.cols.length; i++) {
              for (let j = 0; j < this.columnsMapped.length; j++) {
                if (this.cols[i].field === this.columnsMapped[j].field) {
                  if (this.cols[i].child) {
                    if (this.cols[i].child === this.columnsMapped[j].child) {
                      this.selectedColumns.push(this.cols[i]);
                    }
                  } else {
                    this.selectedColumns.push(this.cols[i]);
                  }
                }
              }
            }
          } else {
            this.selectedColumns = this.cols;
          }
        } else {
          this.selectedColumns = this.cols;
        }

        this.exportColumns = this.selectedColumns.map((col) => ({
          title: col.header,
          dataKey: col.field,
        }));
      },
      (error) => {
        this.toastr.error(error.message);
      }
    ));
  }

  typeOf(event) {
    let res: number;

    if (event === 'object') {
      res = 1;
    } else if (event === 'number' || event === 'string') {
      res = 2;
    } else if (event === 'date') {
      res = 3;
    } else if (event === 'boolean') {
      res = 4;
    } else if (event === 'object2') {
      res = 5;
    }

    return res;
  }

  exportExcelVue(): void {
    this.exportBtnExcelVue.emit(this.selectedColumns);
  }

  exportPdf(): void {
    this.exportBtnPdf.emit(this.selectedColumns);
  }

  exportExcelGlobal(): void {
    this.exportBtnExcelGlobal.emit(null);
  }

  onEdit(event) {
    this.objectEdited.emit({
      object: this.selectedObjects,
      operationMode: event,
    });
    this.selectedObjects = [];
    this.updateBtnDisable = false;
    this.deleteBtnDisable = false;
    this.generateBtnDisable = false;
  }

  loadDataLazy(event) {
    // this.size = event.rows;
    // this.page = event.first / this.size;
    this.lazyLoadData.emit(event);
  }

  onRowSelect(event) {
    if (this.selectedObjects.length === 1) {
      this.updateBtnDisable = true;
      this.deleteBtnDisable = true;
      this.generateBtnDisable = true;
    } else {
      this.updateBtnDisable = false;
      this.generateBtnDisable = false;
    }
  }

  onRowUnselect(event) {
    if (this.selectedObjects.length === 1) {
      this.updateBtnDisable = true;
      this.generateBtnDisable = true;
    } else if (this.selectedObjects.length < 1) {
      this.updateBtnDisable = false;
      this.deleteBtnDisable = false;
      this.generateBtnDisable = false;
    }
  }

  onSaveView() {
    this.spinner.show();
    for (let ca = 0; ca < this.columnsAdded.length; ca++) {
      let found = false;
      for (let sc = 0; sc < this.selectedColumns.length; sc++) {
        if (this.columnsAdded[ca].field === this.selectedColumns[sc].field) {
          if (this.columnsAdded[ca].child && this.selectedColumns[sc].child) {
            if (this.columnsAdded[ca].child === this.selectedColumns[sc].child) {
              found = true;
            }
          } else {
            found = true;
          }
        }
      }
      if (!found) {
        alert('found : field = ' + this.columnsAdded[ca].field + ' && child = ' + this.columnsAdded[ca].child);
        // Get Columns in order to UPSERT them
        this.subscriptions.add(this.columnsService.delete(this.columnsAdded[ca].id).subscribe(
          (id) => {
            this.toastr.success('La colonne a été supprimer avec succès', 'Edition');
          },
          (error) => {
            this.toastr.error(error.message);
          },
        ));
      }
    }
    // Prepare the search sentence
    for (let i = 0; i < this.selectedColumns.length; i++) {
      // Prepare Search Sentence
      let searchSentence = '';
      let index = 0;

      // Check the Field
      if (this.selectedColumns[i].field) {
        searchSentence += 'field:' + this.selectedColumns[i].field + ',';
        index = index + 1;
      }
      // Check the Header
      if (this.selectedColumns[i].header) {
        searchSentence += 'header:' + this.selectedColumns[i].header + ',';
        index = index + 1;
      }
      // Check the class Name
      if (this.className) {
        searchSentence += 'classe:' + this.className + ',';
        index = index + 1;
      }
      // Check the Child
      if (this.selectedColumns[i].child) {
        searchSentence += 'child:' + this.selectedColumns[i].child + ',';
        index = index + 1;
      }
      // Check the User
      if (this.currentUser) {
        searchSentence += 'user.id:' + this.currentUser.id + ',';
        index = index + 1;
      }
      // Check the Organization
      if (this.currentOrganization) {
        searchSentence += 'organization.id:' + this.currentOrganization.id + ',';
        index = index + 1;
      }

      if (index === 1) {
        searchSentence = searchSentence.slice(0, -1);
      } else if (index > 1) {
        searchSentence = '.' + searchSentence.slice(0, -1);
      }

      // Get Columns in order to UPSERT them
      this.subscriptions.add(this.columnsService.find(searchSentence).subscribe(
        (columns) => {
          let column = new Columns();
          if (columns.length > 0) {
            column = columns[0];
            column.position = i;
            column.field = this.selectedColumns[i].field;
            column.header = this.selectedColumns[i].header;
            column.classe = this.className;
            column.type = this.selectedColumns[i].type;
            column.child = this.selectedColumns[i].child;
            column.user = this.currentUser;
            column.organization = this.currentOrganization;
          } else {
            column.position = i;
            column.field = this.selectedColumns[i].field;
            column.header = this.selectedColumns[i].header;
            column.classe = this.className;
            column.type = this.selectedColumns[i].type;
            column.child = this.selectedColumns[i].child;
            column.user = this.currentUser;
            column.organization = this.currentOrganization;
          }

          this.columnsService.set(column).subscribe(
            (data) => {
              this.spinner.hide();
              this.toastr.success('La vue a été enregistrée avec Succés', 'Edition');
            },
            (error) => {
              this.spinner.hide();
              this.toastr.error(error.error.message, 'Erreur');
            },
            () => this.spinner.hide()
          );
        },
        (error) => {
          this.spinner.hide();
          this.toastr.error(error.message);
        },
        () => this.spinner.hide()
      ));
    }
  }
}
