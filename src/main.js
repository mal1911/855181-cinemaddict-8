import getFilterHTML from './make-filter.js';
import getCardHTML from './make-film.js';

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min;

const main = () => {
  const getCardsHTML = (count = 1, isControls = true) => {
    let cardsHTML = ``;
    for (let i = 0; i < count; i++) {
      cardsHTML += getCardHTML(isControls);
    }
    return cardsHTML;
  };

  const mainNavigationElement = document.querySelector(`.main-navigation`);
  let filterHTML = getFilterHTML(`All`, false, true);
  filterHTML += getFilterHTML(`Watchlist`, getRandomInt(0, 20));
  filterHTML += getFilterHTML(`History`, getRandomInt(0, 20));
  filterHTML += getFilterHTML(`Favorites`, getRandomInt(0, 20));
  mainNavigationElement.insertAdjacentHTML(`afterbegin`, filterHTML);

  const filmListElement = document.querySelector(`.films-list .films-list__container`);
  filmListElement.innerHTML = getCardsHTML(7);

  const filmExtraElements = document.querySelectorAll(`.films-list--extra .films-list__container`);
  filmExtraElements[0].innerHTML = getCardsHTML(2, false);
  filmExtraElements[1].innerHTML = getCardsHTML(2, false);

  const onFilterElementClick = () => {
    filmListElement.innerHTML = getCardsHTML(getRandomInt(0, 20));
  };
  mainNavigationElement.addEventListener(`click`, onFilterElementClick);
};
main();
