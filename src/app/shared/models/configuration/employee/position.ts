import {Organization} from '../organization';
import {ContractType} from '../hiring/contract-type';
import {PositionType} from './position-type';
import {Service} from './service';

export class Position {
  id: number;
  code: String;
  contractType: ContractType;
  positionType: PositionType;
  service: Service;
  organization: Organization;
}
