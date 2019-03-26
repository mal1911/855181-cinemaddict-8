import {getDataFromObj, getRandomArray} from './utils.js';

import getFilmObj from './film-obj.js';
import Filter from './filter';
import Film from './film';
import FilmPopup from './film-popup';
import {removeChildElements} from "./utils";

const renderFilters = (data, mainNavigationElement, filmListElement) => {
  const filterData = [`All`, `Watchlist`, `History`, `Favorites`];
  const fragment = document.createDocumentFragment();
  removeChildElements(mainNavigationElement);
  filterData.forEach((title) => {
    const filterComponent = new Filter(title, title === `All`);
    filterComponent.onClick = () => {
      renderFilms(getFilterFilmsData(data), filmListElement, {isControls: true});
    };
    fragment.appendChild(filterComponent.render());
  });
  mainNavigationElement.appendChild(fragment);
};

const updateFilm = (data, oldFilm, newFilm) => {
  const i = data.indexOf(oldFilm);
  data[i] = Object.assign({}, data[i], newFilm);
  return data[i];
};

const getFilterFilmsData = (data) => {
  const title = document.querySelector(`.main-navigation__item--active`).textContent.trim();
  switch (title) {
    case `Watchlist`:
      return data.filter((it) => it.isAddWatchlist);
    case `History`:
      return data.filter((it) => it.isMarkWatchlist);
    case `Favorites`:
      return data.filter((it) => it.isAddFavorite);
  }
  return data;
};

const renderFilms = (data, filmListElement, param) => {
  const bodyElement = document.querySelector(`body`);
  const fragment = document.createDocumentFragment();
  removeChildElements(filmListElement);
  data.forEach((filmObj) => {
    const filmComponent = new Film(filmObj, param);
    const filmPopupComponent = new FilmPopup(filmObj);

    filmComponent.onComments = () => {
      filmPopupComponent.render();
      bodyElement.insertAdjacentElement(`beforeend`, filmPopupComponent.element);
    };

    filmComponent.onAddWatchlist = (value) => {
      filmPopupComponent.changeAddWatchlist(value);
    };

    filmComponent.onMarkWatchlist = (value) => {
      filmPopupComponent.changeMarkWatchlist(value);
    };

    filmComponent.onAddFavorite = (value) => {
      filmPopupComponent.changeAddFavorite(value);
    };

    filmPopupComponent.onSave = (newObj) => {
      const updatedFilmObj = updateFilm(data, filmObj, newObj);
      filmComponent.update(updatedFilmObj);
      filmComponent.refresh();
      bodyElement.removeChild(filmPopupComponent.element);
      filmPopupComponent.unrender();
    };
    fragment.appendChild(filmComponent.render());
  });
  filmListElement.appendChild(fragment);
};

const main = () => {
  const MAX_FILMS = 7;
  const filmsData = getDataFromObj(MAX_FILMS, getFilmObj);

  const mainNavigationElement = document.querySelector(`.main-navigation`);
  const filmListElement = document.querySelector(`.films-list .films-list__container`);

  renderFilters(filmsData, mainNavigationElement, filmListElement);
  renderFilms(filmsData, filmListElement, {isControls: true});


  const filmExtraElements = document.querySelectorAll(`.films-list--extra .films-list__container`);
  renderFilms(getRandomArray(filmsData, 2), filmExtraElements[0]);
  renderFilms(getRandomArray(filmsData, 2), filmExtraElements[1]);

};

main();
