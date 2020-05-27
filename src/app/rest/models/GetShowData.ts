import {FilterChange} from "../../lego/filters/FilterChange";

export class GetShowData {
  constructor(public count: number,
              public selectedPage: number,
              public filter: FilterChange,
              public sortField: string,
              public sortDirection: number) {
  }
}
