import {getDataFromObj, getRandomArray} from './utils.js';

import getFilmObj from './film-obj.js';
import Filter from './filter';
import Film from './film';
import FilmPopup from './film-popup';
import {removeChildElements} from "./utils";

const getActiveFilterTitle = (mainNavigationElement) => {
  return mainNavigationElement.querySelector(`.main-navigation__item--active`).innerText;
};

const renderFilters = (data, mainNavigationElement, filmListElement) => {
  const filterData = [`All`, `Watchlist`, `History`, `Favorites`];
  const fragment = document.createDocumentFragment();
  removeChildElements(mainNavigationElement);
  filterData.forEach((title) => {
    const filterComponent = new Filter(title, title === `All`);
    filterComponent.onClick = () => {
      renderFilms(filterFilms(data, title), filmListElement, mainNavigationElement, {isControls: true});
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

const filterFilms = (data, title = ``) => {
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

const renderFilms = (data, filmListElement, mainNavigationElement, param) => {
  const bodyElement = document.querySelector(`body`);
  const fragment = document.createDocumentFragment();
  removeChildElements(filmListElement);
  data.forEach((film) => {
    const filmComponent = new Film(film, param);
    const filmPopupComponent = new FilmPopup(film);

    filmComponent.onComments = () => {
      filmPopupComponent.render();
      bodyElement.insertAdjacentElement(`beforeend`, filmPopupComponent.element);
    };

    filmComponent.onAddWatchlist = (AddWatchlist) => {
      filmPopupComponent.changeAddWatchlist();
      data[data.indexOf(film)].isAddWatchlist = AddWatchlist;
      renderFilms(filterFilms(data, getActiveFilterTitle(mainNavigationElement)), filmListElement, mainNavigationElement, {isControls: true});
    };

    filmComponent.onMarkWatchlist = (MarkWatchlist) => {
      filmPopupComponent.changeMarkWatchlist();
      data[data.indexOf(film)].isMarkWatchlist = MarkWatchlist;
      renderFilms(filterFilms(data, getActiveFilterTitle(mainNavigationElement)), filmListElement, mainNavigationElement, {isControls: true});
    };

    filmComponent.onAddFavorite = (AddFavorite) => {
      console.log(`favorite ` + AddFavorite);
      filmPopupComponent.changeAddFavorite();
      data[data.indexOf(film)].isAddFavorite = AddFavorite;
      renderFilms(filterFilms(data, getActiveFilterTitle(mainNavigationElement)), filmListElement, mainNavigationElement, {isControls: true});
    };

    filmPopupComponent.onClose = (newObject) => {
      /*film.title = newObject.title;
      film.poster = newObject.poster;
      film.description = newObject.description;
      film.year = newObject.year;
      film.duration = newObject.duration;
      film.genre = newObject.genre;
      film.rating = newObject.rating;*/

      /*film.comments = newObject.comments;
      film.userRating = newObject.userRating;
      film.isAddWatchlist = newObject.isAddWatchlist;
      film.isMarkWatchlist = newObject.isMarkWatchlist;
      film.isAddFavorite = newObject.isAddFavorite;*/

      const updatedFilm = updateFilm(data, film, newObject);
      filmComponent.update(updatedFilm);
      filmComponent.refresh();
      bodyElement.removeChild(filmPopupComponent.element);
      filmPopupComponent.unrender();
      renderFilms(filterFilms(data, getActiveFilterTitle(mainNavigationElement)), filmListElement, {isControls: true});
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
  renderFilms(filmsData, filmListElement, mainNavigationElement, {isControls: true});


  const filmExtraElements = document.querySelectorAll(`.films-list--extra .films-list__container`);
  renderFilms(getRandomArray(filmsData, 2), filmExtraElements[0]);
  renderFilms(getRandomArray(filmsData, 2), filmExtraElements[1]);

};

main();
