import {getRandomInt, getHTMLFromData, getDataFromObj, getRandomArray} from './utils.js';
import getFilterHTML from './filter-html.js';
import getFilmHTML from './film-html.js';
import getFilmObj from './film-obj.js';


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

  filmListElement.innerHTML = getHTMLFromData(filmsData, getFilmHTML, {isControls: true});

  const filmExtraElements = document.querySelectorAll(`.films-list--extra .films-list__container`);

  filmExtraElements[0].innerHTML = getHTMLFromData(getRandomArray(filmsData, 2), getFilmHTML);
  filmExtraElements[1].innerHTML = getHTMLFromData(getRandomArray(filmsData, 2), getFilmHTML);

  const onFilterElementClick = () => {
    filmListElement.innerHTML = getHTMLFromData(getRandomArray(filmsData, getRandomInt(1, MAX_FILMS), getFilmHTML, {isControls: true}));
  };
  mainNavigationElement.addEventListener(`click`, onFilterElementClick);
};

main();
