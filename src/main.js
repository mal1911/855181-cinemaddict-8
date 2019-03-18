import {getRandomInt, getDataFromObj, getRandomArray} from './utils.js';
import getFilterHTML from './filter-html.js';
import getFilmObj from './film-obj.js';
import Film from './film';
import FilmPopup from './film-popup';
import {removeChildElements} from "./utils";

const renderFilms = (data, parentElement, param) => {
  const bodyElement = document.querySelector(`body`);

  const onComments = (filmPopupComponent) => {
    filmPopupComponent.render();
    bodyElement.insertAdjacentElement(`beforeend`, filmPopupComponent.element);
  };

  const onClose = (filmPopupComponent) => {
    bodyElement.removeChild(filmPopupComponent.element);
    filmPopupComponent.unrender();
  };

  const fragment = document.createDocumentFragment();
  removeChildElements(parentElement);
  data.forEach((obj) => {
    const filmComponent = new Film(obj, param);
    const filmPopupComponent = new FilmPopup(obj);
    filmComponent.onComments = onComments.bind(null, filmPopupComponent);
    filmPopupComponent.onClose = onClose.bind(null, filmPopupComponent);
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
