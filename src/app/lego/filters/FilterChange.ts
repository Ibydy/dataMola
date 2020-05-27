import {Genre} from "../../rest/models/Genre";

export class FilterChange {
  constructor(public year?: number | undefined,
              public genre?: Genre | undefined,
              public name?: string | undefined) {
  }
}
