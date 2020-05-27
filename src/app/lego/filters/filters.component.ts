import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {RestService} from "../../rest/rest.service";
import {Genre} from "../../rest/models/Genre";
import {FilterChange} from "./FilterChange";

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  public genres: Genre[] = [];
  public nameFilter = '';
  public years: number[] = [];
  private selectedGenre: Genre | undefined;
  private selectedYear: number | undefined;

  @Output() public filterChange = new EventEmitter();

  constructor(
    private restService: RestService
  ) {
  }

  ngOnInit(): void {
    this.restService.getGenres()
      .subscribe((genres: Genre[]) => {
        this.genres = genres;
      })

    this.restService.getYears()
      .subscribe((years: number[]) => {
        this.years = years;
      })
  }

  public selectGenre(genre: Genre): void {
    this.selectedGenre = genre;
    this.emitFilter();
  }

  public onNameChange(): void {
    this.emitFilter();
  }

  public selectYear(year: number): void {
    this.selectedYear = year;
    this.emitFilter();
  }


  public emitFilter() {
    this.filterChange.emit(new FilterChange(this.selectedYear, this.selectedGenre, this.nameFilter));
  }

}
