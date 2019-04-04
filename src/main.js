import {FILTER_DATA} from "./constants";
import Filter from './filter';
import Film from './film';
import FilmPopup from './film-popup';
import Message from './message';
import API from './api';
import Store from './store';
import Provider from './provider';

import {removeChildElements} from "./utils";
import Statistics from "./statistics";

const AUTHORIZATION = `Basic eo0w590ik29889a=${Math.random()}`;
const END_POINT = `https://es8-demo-srv.appspot.com/moowle/`;
const FILMS_STORE_KEY = `films-store-key`;
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const store = new Store({key: FILMS_STORE_KEY, storage: localStorage});
const provider = new Provider({api, store});

const MAX_FILMS = 5;
let pageIndex = 1;

const renderFilters = (data, mainNavigationElement, filmListElement, showMoreElement, statisticComponent) => {
  const filterData = FILTER_DATA;
  const fragment = document.createDocumentFragment();
  filterData.forEach((title) => {
    const filterComponent = new Filter(title, title === `All`);
    filterComponent.onClick = () => {
      document.querySelector(`.search__field`).value = ``;
      statisticComponent.hideStatictic();
      showFirstFilms(getFilterFilmsData(data), data, filmListElement, showMoreElement);
    };
    fragment.appendChild(filterComponent.render());
  });
  mainNavigationElement.prepend(fragment);
};

const updateFilmData = (data, oldObj, newObj) => {
  const i = data.indexOf(oldObj);
  data[i].userDetails = newObj.userDetails;
  data[i].comments = newObj.comments;
  return data[i];
};

const getActiveFilter = () => {
  const title = document.querySelector(`.main-navigation__item--active`).textContent.trim();
  return title.substring(0, title.indexOf(` `));
};

const getFilterFilmsData = (data, filter = ``, findValue = ``) => {
  if (!filter) {
    filter = getActiveFilter();
  }
  switch (filter) {
    case `Watchlist`:
      return data.filter((it) => it.userDetails.watchlist);
    case `History`:
      return data.filter((it) => it.userDetails.alreadyWatched);
    case `Favorites`:
      return data.filter((it) => it.userDetails.favorite);
  }
  if (!findValue) {
    findValue = document.querySelector(`.search__field`).value;
  }
  return findValue ? data.filter((it) => it.filmInfo.title.indexOf(findValue) > -1) : data;
};

const setDefaultMenuItem = () => {
  document.querySelector(`.main-navigation__item--active`).classList.remove(`main-navigation__item--active`);
  document.querySelector(`.main-navigation__item`).classList.add(`main-navigation__item--active`);
};

const isVisibleFilm = (filmObj) => {
  const filter = getActiveFilter();
  switch (filter) {
    case `Watchlist`:
      return filmObj.userDetails.watchlist;
    case `History`:
      return filmObj.userDetails.alreadyWatched;
    case `Favorites`:
      return filmObj.userDetails.favorite;
  }
  return true;
};

const renderFilms = (data, fullData, filmListElement, param) => {
  const bodyElement = document.querySelector(`body`);
  const fragment = document.createDocumentFragment();
  removeChildElements(filmListElement);
  data.forEach((filmObj, i) => {
    if (i < pageIndex * MAX_FILMS) {
      const filmComponent = new Film(filmObj, param);
      const filmPopupComponent = new FilmPopup(filmObj);

      filmComponent.onComments = () => {
        filmPopupComponent.render();
        bodyElement.append(filmPopupComponent.element);
      };

      filmComponent.onChangeStatus = (obj) => {
        filmObj.userDetails = obj;
        filmComponent.block();
        provider.updateFilm({id: filmObj.id, data: filmObj.toRAW()})
          .then((newObj1) => {
            filmPopupComponent.changeUserDetails(newObj1.userDetails);
            if (!isVisibleFilm(newObj1)) {
              filmComponent.unrender();
            }
            showCounts(fullData);
          }).catch((err) => {
            const messageErrorComponent = new Message(`Error: ${err.message}`, {isError: true});
            messageErrorComponent.render();
            filmListElement.appendChild(messageErrorComponent.element);
          }).finally(() => filmComponent.unblock());
      };

      filmPopupComponent.onSave = (newObj) => {
        const formPopupElement = document.querySelector(`.film-details__inner`);
        if (formPopupElement.classList.contains(`shake`)) {
          formPopupElement.classList.remove(`shake`);
        }
        filmPopupComponent.block();
        filmObj = updateFilmData(data, filmObj, newObj);

        provider.updateFilm({id: filmObj.id, data: filmObj.toRAW()})
          .then((newObj1) => {
            if (isVisibleFilm(newObj1)) {
              filmComponent.update(newObj1);
              filmComponent.refresh();
            } else {
              filmComponent.unrender();
            }
            filmPopupComponent.unrender();
            showCounts(fullData);
            showRatings(fullData);
          }).catch(() => {
            formPopupElement.classList.add(`shake`);
          }).finally(() => filmPopupComponent.unblock());
      };

      fragment.appendChild(filmComponent.render());
    }
  });
  filmListElement.appendChild(fragment);
};

const showCounts = (fullData) => {
  const menuCountElements = document.querySelectorAll(`.main-navigation__item .main-navigation__item-count`);
  menuCountElements[0].textContent = fullData.filter((it) => it.userDetails.watchlist).length;
  const alreadyWatchedCount = fullData.filter((it) => it.userDetails.alreadyWatched).length;
  menuCountElements[1].textContent = alreadyWatchedCount;
  menuCountElements[2].textContent = fullData.filter((it) => it.userDetails.favorite).length;

  let userStatus = `none`;
  if (alreadyWatchedCount >= 1 && alreadyWatchedCount <= 10) {
    userStatus = `novice`;
  } else if (alreadyWatchedCount >= 11 && alreadyWatchedCount <= 20) {
    userStatus = `fan`;
  } else if (alreadyWatchedCount > 20) {
    userStatus = `movie buff`;
  }
  document.querySelector(`.profile__rating`).textContent = userStatus;
};

const showFooterStatistics = (fullData) => {
  document.querySelector(`.footer__statistics`).textContent = `${fullData.length} movies inside`;
};

const showRatings = (fullData) => {
  const filmExtraElements = document.querySelectorAll(`.films-list--extra .films-list__container`);

  renderFilms(fullData.sort((objA, objB) => {
    return objB.filmInfo.totalRating - objA.filmInfo.totalRating;
  }).slice(0, 2), fullData, filmExtraElements[0]);

  renderFilms(fullData.sort((objA, objB) => {
    return objB.comments.length - objA.comments.length;
  }).slice(0, 2), fullData, filmExtraElements[1]);
};

const showNextFilms = (data, fullData, filmListElement, showMoreElement) => {
  renderFilms(data, fullData, filmListElement, {isControls: true});
  if (pageIndex < data.length / MAX_FILMS) {
    pageIndex++;
    showMoreElement.classList.remove(`visually-hidden`);
  } else {
    showMoreElement.classList.add(`visually-hidden`);
  }
};

const showFirstFilms = (data, fullData, filmListElement, showMoreElement) => {
  pageIndex = 1;
  showNextFilms(data, fullData, filmListElement, showMoreElement);
};

const main = () => {
  const mainNavigationElement = document.querySelector(`.main-navigation`);
  const filmListElement = document.querySelector(`.films-list .films-list__container`);
  const showMoreElement = document.querySelector(`.films-list__show-more`);
  const statisticsComponent = new Statistics();
  const messageLoadComponent = new Message(`Loading moovies…`, {isLoad: true});
  messageLoadComponent.render();
  filmListElement.appendChild(messageLoadComponent.element);

  window.addEventListener(`offline`, () => {
    document.title = `${document.title} [OFFLINE]`;
  });
  window.addEventListener(`online`, () => {
    document.title = document.title.split(`[OFFLINE]`)[0];
    provider.syncFilms();
  });

  let filmsData = [];
  provider.getFilms().then((films) => {
    filmsData = films;
    statisticsComponent.data = filmsData;
    renderFilters(filmsData, mainNavigationElement, filmListElement, showMoreElement, statisticsComponent);
    showFirstFilms(filmsData, filmsData, filmListElement, showMoreElement);
    showCounts(filmsData);
    showRatings(filmsData);
    showFooterStatistics(filmsData);

    showMoreElement.addEventListener(`click`, () => {
      showNextFilms(getFilterFilmsData(filmsData), filmsData, filmListElement, showMoreElement);
    });

    const searchElement = document.querySelector(`.search__field`);
    searchElement.addEventListener(`input`, (evt) => {
      evt.preventDefault();
      setDefaultMenuItem();
      statisticsComponent.hideStatictic();
      showFirstFilms(getFilterFilmsData(filmsData, ``, evt.target.value), filmsData, filmListElement, showMoreElement);
    });
  }).catch(() => {
    const messageErrorComponent = new Message(`Check your connection or try again later.`, {isError: true});
    messageErrorComponent.render();
    filmListElement.appendChild(messageErrorComponent.element);
  }).finally(() => {
    messageLoadComponent.unrender();
    statisticsComponent.hideStatictic();
  });
};

main();
