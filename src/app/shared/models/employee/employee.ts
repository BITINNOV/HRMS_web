import {EmployeeStatus} from '../configuration/employee/employee-status';
import {Position} from '../configuration/employee/position';
import {Organization} from '../configuration/organization';

export class Employee {
  id: number;
  // resume: Resume;
  employeeStatus: EmployeeStatus;
  registrationNumber: number;
  position: Position;
  firstName: String;
  lastName: String;
  cin: String;
  email: String;
  phoneNumber: String;
  address: String;
  birthDate: Date;
  rib: String;
  cnssNumber: String;
  kidsNumber: number;
  familySituation: String;
  gender: String;
  hiringDate: Date;
  salaryAmount: number;
  isActive: boolean;
  manager: Employee;
  organization: Organization;
}
