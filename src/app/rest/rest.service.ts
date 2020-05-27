import {Injectable} from '@angular/core';
import {AppConfig} from "./app-config/app-config.service";
import {Genre} from "./models/Genre";
import {Show} from "./models/Show";
import * as moment from "moment";
import {Network} from "./models/Network";
import {Observable, Subject} from "rxjs";
import {GetShowData} from "./models/GetShowData";
import {GetShowDataAnsw} from "./models/GetShowDataAnsw";
import * as _ from 'lodash'

/**
 * Используем этот класс как имитацию бэка, сначала читаем все из JSON, потом отдаем данные
 */

@Injectable({
  providedIn: 'root'
})
export class RestService {

  private genres: Genre[] = [];
  private networks: Network[] = [];
  private shows: Show[] = [];

  constructor(private appConfig: AppConfig) {
    this.initData();
  }


  public getShows(getShowData: GetShowData): Subject<GetShowDataAnsw> {
    const subj: Subject<GetShowDataAnsw> = new Subject();
    setTimeout(() => {
      subj.next(this.prepareShowsData(getShowData));
    })
    return subj;
  }

  public getGenres(): Subject<Genre[]> {
    const subj: Subject<Genre[]> = new Subject();
    setTimeout(() => {
      subj.next(this.genres);
    })
    return subj;
  }

  public getYears(): Subject<number[]> {
    const subj: Subject<number[]> = new Subject();
    setTimeout(() => {
      const yearsSet = new Set();
      this.shows.forEach((show: Show) => {
        yearsSet.add(+show.premiere.format('YYYY'));
      })
      let years = [];
      yearsSet.forEach((year) => {
        years.push(year)
      })
      years = years.sort((year1, year2) => year1 - year2)
      subj.next(years);
    })
    return subj;
  }

  private initData(): void {
    this.initGenres();
    this.initNetworks();
    this.initShows();
  }

  private initGenres(): void {
    const genresData = this.appConfig.getConfig('genres', []);
    this.genres = genresData.map((genreData) => new Genre(genreData.name, genreData.backgroundColor, genreData.id));
  }

  private initNetworks(): void {
    const networksData = this.appConfig.getConfig('networks', []);
    this.networks = networksData.map((networkData) => new Network(networkData.name, networkData.id));
  }

  private initShows(): void {
    const showsData = this.appConfig.getConfig('shows', []);
    this.shows = showsData.map((showData) => {
      const premiere = moment(showData.premiere, 'DD.MM.YYYY');
      const genres = this.genres.filter((genre) => showData.genreIds.some((id) => genre.id === id));
      const networks = this.networks.filter((network) => showData.networkIds.some((id) => network.id === id));
      return new Show(showData.name, showData.season, networks, genres, premiere, showData.id);
    })
  }

  private prepareShowsData(getShowData: GetShowData): GetShowDataAnsw {
    let shows = _.cloneDeep(this.shows);
    let sliceFilterFrom = 0;
    if (getShowData.filter) {
      if (getShowData.filter.name) {
        shows = shows.filter((show) => show.name.includes(getShowData.filter.name));
      }
      if (getShowData.filter.genre) {
        shows = shows.filter((show) =>
          show.genres.some((genre) =>
            genre.id === getShowData.filter.genre.id))
      }
      if (getShowData.filter.year) {
        shows = shows.filter((show) => +show.premiere.format('YYYY') === getShowData.filter.year);
      }
    }
    if (getShowData.selectedPage) {
      sliceFilterFrom = getShowData.selectedPage - 1;
    }
    if (getShowData.sortField) {
      if (getShowData.sortDirection !== 0) {
        /**
         * Хорошо бы sortField вынести в генерацию на лету ячеек для уменьшения
         * трудности добавления новых колонок но для данного задания это излишне
         */
        if (getShowData.sortField === 'Name') {
          shows = shows.sort((show1: Show, show2: Show) => {
            if (getShowData.sortDirection === 1) {
              if (show1.name > show2.name) {
                return 1
              }
              if (show1.name < show2.name) {
                return -1;
              }
              return 0;
            } else {
              if (show1.name < show2.name) {
                return 1
              }
              if (show1.name > show2.name) {
                return -1;
              }
              return 0;
            }
          })
        }


        if (getShowData.sortField === 'Season') {
          shows = shows.sort((show1: Show, show2: Show) => {
            if (getShowData.sortDirection === 1) {
              return show1.season - show2.season;
            } else {
              return show2.season - show1.season;
            }
          })
        }

        if (getShowData.sortField === 'Network') {
          shows = shows.sort((show1: Show, show2: Show) => {
            if (getShowData.sortDirection === 1) {
              if (show1.networkView > show2.networkView) {
                return 1
              }
              if (show1.networkView < show2.networkView) {
                return -1;
              }
              return 0;
            } else {
              if (show1.networkView < show2.networkView) {
                return 1
              }
              if (show1.networkView > show2.networkView) {
                return -1;
              }
              return 0;
            }
          })
        }

        if (getShowData.sortField === 'Premiere') {
          shows = shows.sort((show1: Show, show2: Show) => {
            if (getShowData.sortDirection === 1) {
              return +show1.premiere.format('YYYY') - (+show2.premiere.format('YYYY'));
            } else {
              return +show2.premiere.format('YYYY') - (+show1.premiere.format('YYYY'));
            }
          })
        }
      }
    }

    const showsLength = shows.length;

    if (getShowData.count) {
      shows = shows.slice(sliceFilterFrom * getShowData.count, (sliceFilterFrom + 1) * getShowData.count);
    }
    return new GetShowDataAnsw(shows, showsLength)
  }


}
