import {Genre} from "./Genre";
import * as moment from "moment";
import {Network} from "./Network";

export class Show {
  public networkView = '';
  public premeireDateView = '';


  constructor(public name: string,
              public season: number,
              public networks: Array<Network>,
              public genres: Array<Genre>,
              public premiere: moment.Moment,
              public id: string) {
    this.networkView = networks.reduce((accumulator: string, network: Network) => {
      if (accumulator) {
        return `${accumulator}, ${network.name}`
      }
      return network.name;
    }, '')
    this.premeireDateView = premiere.format('DD.MM.YYYY');
  }

}
