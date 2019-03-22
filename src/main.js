import {getRandomInt, getDataFromObj, getRandomArray} from './utils.js';
import getFilterHTML from './filter-html.js';
import getFilmObj from './film-obj.js';
import Film from './film';
import FilmPopup from './film-popup';
import {removeChildElements} from "./utils";

const renderFilms = (data, parentElement, param) => {
  const bodyElement = document.querySelector(`body`);

  const fragment = document.createDocumentFragment();
  removeChildElements(parentElement);
  data.forEach((film) => {
    const filmComponent = new Film(film, param);
    const filmPopupComponent = new FilmPopup(film);

    filmComponent._onComments = () => {
      filmPopupComponent.render();
      bodyElement.insertAdjacentElement(`beforeend`, filmPopupComponent.element);
    };

    filmPopupComponent.onClose = (newObject) => {
      film.title = newObject.title;
      film.poster = newObject.poster;
      film.description = newObject.description;
      film.year = newObject.year;
      film.duration = newObject.duration;
      film.genre = newObject.genre;
      film.rating = newObject.rating;
      film.comments = newObject.comments;
      film.userRating = newObject.userRating;

      filmComponent.update(film);
      filmComponent.refresh();
      bodyElement.removeChild(filmPopupComponent.element);
      filmPopupComponent.unrender();
    };
    fragment.appendChild(filmComponent.render());
  });
  parentElement.appendChild(fragment);
};

const main = () => {
  const MAX_FILMS = 7;
  const filmsData = getDataFromObj(MAX_FILMS, getFilmObj);

  const mainNavigationElement = document.querySelector(`.main-navigation`);
  let filterHTML = getFilterHTML(`All`, false, true);
  filterHTML += getFilterHTML(`Watchlist`, getRandomInt(0, 20));
  filterHTML += getFilterHTML(`History`, getRandomInt(0, 20));
  filterHTML += getFilterHTML(`Favorites`, getRandomInt(0, 20));
  mainNavigationElement.insertAdjacentHTML(`afterbegin`, filterHTML);

  const filmListElement = document.querySelector(`.films-list .films-list__container`);
  renderFilms(filmsData, filmListElement, {isControls: true});

  const filmExtraElements = document.querySelectorAll(`.films-list--extra .films-list__container`);
  renderFilms(getRandomArray(filmsData, 2), filmExtraElements[0]);
  renderFilms(getRandomArray(filmsData, 2), filmExtraElements[1]);

  const onFilterElementClick = () => {
    renderFilms(getRandomArray(filmsData, getRandomInt(1, MAX_FILMS)), filmListElement, {isControls: true});
  };

  mainNavigationElement.addEventListener(`click`, onFilterElementClick);
};

main();
