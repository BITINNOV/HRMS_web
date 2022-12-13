import {Country} from './country';

export class Organization {
  id: number;
  code: String;
  description: String;
  logo: String;
  adress: String;
  phoneNumber: String;
  faxNumber: String;
  responsabiliteCivile: String;
  identifiantFiscal: String;
  identifiantCommunEntreprise: String;
  country: Country;
}
