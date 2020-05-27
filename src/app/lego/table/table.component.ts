import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Show} from "../../rest/models/Show";
import {TableItemsByPage} from "./TableItemsByPage";
import {PaginationChange} from "./PaginationChange";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  public loading = true;
  public itemsByPage = TableItemsByPage.itemsByPage;
  public selectedItemsByPage = this.itemsByPage[0];
  public pages = [];
  public currentPage;
  public sortField = '';
  public sortDirection = 0;


  @Input()
  public set totalShowLength(totalShowLength: number) {
    this._totalShowLength = totalShowLength;
    this.calculatePages();
  }

  public get totalShowLength() {
    return this._totalShowLength;
  }

  @Input()
  public set shows(shows: Show[]) {
    this._shows = shows;
    this.loading = false;
  }

  public get shows(): Show[] {
    return this._shows
  }

  @Output() public paginationChange = new EventEmitter<PaginationChange>();

  private _shows = [];
  private _totalShowLength: number;


  constructor() {
  }

  ngOnInit(): void {
  }

  public selectItemByPage(itemsByPage: number): void {
    this.selectedItemsByPage = itemsByPage;
    this.calculatePages();
    this.paginationChange.emit(new PaginationChange(this.selectedItemsByPage, this.currentPage, this.sortField, this.sortDirection))
  }

  public selectPage(page: number): void {
    this.currentPage = page;
    this.paginationChange.emit(new PaginationChange(this.selectedItemsByPage, this.currentPage, this.sortField, this.sortDirection))
  }

  public onTableHeaderClick(header: string) {
    this.currentPage = this.pages[0];
    if (this.sortField === header) {
      if (this.sortDirection === 2) {
        this.sortDirection = 0;
      } else {
        this.sortDirection = this.sortDirection + 1;
      }
      this.paginationChange.emit(new PaginationChange(this.selectedItemsByPage, this.currentPage, this.sortField, this.sortDirection))
      return;
    }
    this.sortField = header;
    this.sortDirection = 1;
    this.paginationChange.emit(new PaginationChange(this.selectedItemsByPage, this.currentPage, this.sortField, this.sortDirection))
  }

  private calculatePages(): void {
    const countOfPages = Math.ceil(this.totalShowLength / this.selectedItemsByPage);
    const pages = [];
    for (let i = 1; i <= countOfPages; i++) {
      pages.push(i);
    }
    this.pages = pages;
    this.currentPage = this.pages[0];
  }

}
