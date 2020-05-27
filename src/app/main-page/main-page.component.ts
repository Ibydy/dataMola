import {Component, OnInit} from '@angular/core';
import {RestService} from "../rest/rest.service";
import {Show} from "../rest/models/Show";
import {TableItemsByPage} from "../lego/table/TableItemsByPage";
import {PaginationChange} from "../lego/table/PaginationChange";
import {FilterChange} from "../lego/filters/FilterChange";
import {GetShowData} from "../rest/models/GetShowData";
import {GetShowDataAnsw} from "../rest/models/GetShowDataAnsw";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  public shows: Show[] = [];
  public totalShowLength;
  public currentItemsByPage = TableItemsByPage.itemsByPage[0];
  public selectedPage = 1;
  public filter = new FilterChange();
  public currentSortField: string;
  public currentSortDirection: number;

  constructor(
    private restService: RestService
  ) {
  }

  ngOnInit(): void {
    this.getShows();
  }

  public onPaginationChange(paginationChange: PaginationChange): void {
    this.currentItemsByPage = paginationChange.selectedItemsByPage;
    this.selectedPage = paginationChange.currentPage;
    this.currentSortField = paginationChange.sortField;
    this.currentSortDirection = paginationChange.sortDirection;
    this.getShows();
  }

  public onFilterChange(filterChange: FilterChange): void {
    this.filter = filterChange;
    this.getShows();
  }

  private getShows(): void {
    this.restService.getShows(new GetShowData(this.currentItemsByPage,
      this.selectedPage,
      this.filter,
      this.currentSortField,
      this.currentSortDirection))
      .subscribe((getShowDataAnsw: GetShowDataAnsw) => {
        this.shows = getShowDataAnsw.show;
        this.totalShowLength = getShowDataAnsw.showLength;
      })
  }

}
