import {Organization} from '../organization';

export class PublicationPlatform {
  id: number;
  code: String;
  link: String;
  user: String;
  password: String;
  organization: Organization;
}
