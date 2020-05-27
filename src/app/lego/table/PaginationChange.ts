export class PaginationChange {
  constructor(public selectedItemsByPage: number,
              public currentPage: number,
              public sortField: string,
              public sortDirection: number) {
  }

}
