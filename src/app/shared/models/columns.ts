import {User} from './configuration/user';
import {Organization} from './configuration/organization';

export class Columns {
  id: number;
  position: number;
  field: String;
  header: String;
  classe: String;
  type: String;
  child: String;
  user: User;
  organization: Organization;
}
