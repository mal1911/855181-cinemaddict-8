import {MAX_TOP_COUNT} from "./constants";
import Filters from './filters';
import Films from './films';
import Page from './page';
import Message from './message';
import API from './api';
import Store from './store';
import Provider from './provider';
import Statistics from "./statistics";

export default class App {
  constructor(authorization, endPoint, storeKey) {
    this._api = new API({endPoint, authorization});
    this._store = new Store({key: storeKey, storage: localStorage});
    this._provider = new Provider({api: this._api, store: this._store});
    this.bind();
  }

  _showRatings(data, topRatingFilmsComponents, topCommentsFilmsComponents) {

    topRatingFilmsComponents.render(data.sort((objA, objB) => {
      return objB.filmInfo.totalRating - objA.filmInfo.totalRating;
    }).slice(0, MAX_TOP_COUNT));

    topCommentsFilmsComponents.render(data.sort((objA, objB) => {
      return objB.comments.length - objA.comments.length;
    }).slice(0, MAX_TOP_COUNT));
  }

  _showFooterStatistics(data) {
    document.querySelector(`.footer__statistics`).textContent = `${data.length} movies inside`;
  }

  run() {
    const filmListElement = document.querySelector(`.films-list .films-list__container`);
    const filmExtraElements = document.querySelectorAll(`.films-list--extra .films-list__container`);
    const statisticsComponent = new Statistics();
    const messageLoadComponent = new Message(`Loading moovies…`, {isLoad: true});
    messageLoadComponent.render();
    filmListElement.appendChild(messageLoadComponent.element);

    let filmsData = [];
    this._provider.getFilms().then((films) => {
      filmsData = films;
      statisticsComponent.data = filmsData;

      const filmsComponent = new Films(this._provider, filmsData, filmListElement, {isControls: true});
      const topRatingFilmsComponents = new Films(this._provider, filmsData, filmExtraElements[0]);
      const topCommentsFilmsComponents = new Films(this._provider, filmsData, filmExtraElements[1]);

      filmsComponent.onUpdateSuccess = () => {
        this._showRatings(filmsData, topRatingFilmsComponents, topCommentsFilmsComponents);
        filtersComponent.updateStatistics();
      };

      filmsComponent.onUpdateError = (err) => {
        const messageErrorComponent = new Message(`Error: ${err.message}`, {isError: true});
        messageErrorComponent.render();
        filmListElement.appendChild(messageErrorComponent.element);
      };

      const pageComponent = new Page(filmsComponent);
      pageComponent.filteredData = filmsData;
      pageComponent.showFirst();

      const filtersComponent = new Filters();
      filtersComponent.data = filmsData;
      filtersComponent.onFilterChange = (filteredData) => {
        statisticsComponent.hideStatictic();
        pageComponent.filteredData = filteredData;
        pageComponent.showFirst();
      };
      filtersComponent.render();
      filmsComponent.filtersComponent = filtersComponent;
      this._showRatings(filmsData, topRatingFilmsComponents, topCommentsFilmsComponents);
      this._showFooterStatistics(filmsData);
      messageLoadComponent.unrender();
    }).catch(() => {
      const messageErrorComponent = new Message(`Check your connection or try again later.`, {isError: true});
      messageErrorComponent.render();
      filmListElement.appendChild(messageErrorComponent.element);
    }).finally();

    statisticsComponent.hideStatictic();
  }

  bind() {
    window.addEventListener(`offline`, () => {
      document.title = `${document.title} [OFFLINE]`;
    });
    window.addEventListener(`online`, () => {
      document.title = document.title.split(`[OFFLINE]`)[0];
      this._provider.syncFilms();
    });
  }
}
