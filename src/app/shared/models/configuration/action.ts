import {Organization} from './organization';
import {ActionType} from './action-type';

export class Action {
  id: number;
  code: String;
  actionType: ActionType;
  dateHeureDebut: Date;
  dateHeureFin: Date;
  duration: number;
  manager: String;
  organization: Organization;
}
