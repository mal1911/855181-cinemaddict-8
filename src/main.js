import {FILTER_DATA} from "./constants";
import {getDataFromObj, getRandomArray} from './utils.js';
import getFilmObj from './film-obj.js';
import Filter from './filter';
import Film from './film';
import FilmPopup from './film-popup';
import API from './api';
import {removeChildElements} from "./utils";
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const BAR_HEIGHT = 50;
const AUTHORIZATION = `Basic eo0w590ik29889a=${Math.random()}`;
const END_POINT = `https://es8-demo-srv.appspot.com/moowle/`;
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const MAX_FILMS = 5;
let pageIndex = 1;

const renderFilters = (data, mainNavigationElement, filmListElement, showMoreElement) => {
  const filterData = FILTER_DATA;
  const fragment = document.createDocumentFragment();
  filterData.forEach((title) => {
    const filterComponent = new Filter(title, title === `All`);
    filterComponent.onClick = () => {
      hideStatictic();
      document.querySelector(`.search__field`).value = ``;
      showFirstFilms(getFilterFilmsData(data), filmListElement, showMoreElement);
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


const getActiveFilter = () =>
  document.querySelector(`.main-navigation__item--active`).textContent.trim();

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

const renderFilms = (data, filmListElement, param) => {
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

      filmComponent.onAddWatchlist = (value) => {
        filmObj.userDetails.watchlist = value;
        api.updateFilm({id: filmObj.id, data: filmObj.toRAW()})
          .then((newObj1) => {
            filmPopupComponent.changeAddWatchlist(newObj1.userDetails.watchlist);
            if (!isVisibleFilm(newObj1)) {
              filmListElement.removeChild(filmComponent.element);
            }
          });
      };

      filmComponent.onMarkWatchlist = (value) => {
        filmPopupComponent.changeMarkWatchlist(value);
      };

      filmComponent.onAddFavorite = (value) => {
        filmPopupComponent.changeAddFavorite(value);
      };

      filmPopupComponent.onSave = (newObj) => {
        //console.log(newObj);
        //const updatedFilmObj = updateFilm(data, filmObj, newObj);
        //console.log(updatedFilmObj);
        //console.log(filmObj);
        //console.log(updatedFilmObj);
        //console.log(updatedFilmObj);
        //console.log(filmObj);
        //console.log(filmObj);

        filmObj = updateFilmData(data, filmObj, newObj);
        api.updateFilm({id: filmObj.id, data: filmObj.toRAW()})
          .then((newObj1) => {
            filmComponent.update(newObj1);
            filmComponent.refresh();
            bodyElement.removeChild(filmPopupComponent.element);
            filmPopupComponent.unrender();

            //console.log(newObj1);


            /*taskComponent.update(newTask);
            taskComponent.render();
            tasksContainer.replaceChild(taskComponent.element, editTaskComponent.element);
            editTaskComponent.unrender();*/

          });


      };
      fragment.appendChild(filmComponent.render());
    }
  });
  filmListElement.appendChild(fragment);
};

const toggleStatictic = () => {
  document.querySelector(`.statistic`).classList.toggle(`visually-hidden`);
  document.querySelector(`.films`).classList.toggle(`visually-hidden`);
};

const hideStatictic = () => {
  document.querySelector(`.statistic`).classList.add(`visually-hidden`);
  document.querySelector(`.films`).classList.remove(`visually-hidden`);
};

const renderStatistic = (filmsData) => {
  const statisticElement = document.querySelector(`.statistic`);
  if (!statisticElement.classList.contains(`visually-hidden`)) {
    const staticticContainer = statisticElement.querySelector(`.statistic__chart-wrap`);
    removeChildElements(staticticContainer);
    staticticContainer.innerHTML = `<canvas class="statistic__chart" width="1000"></canvas>`;
    const statisticCtx = statisticElement.querySelector(`.statistic__chart`);

    let genreData = [];
    let watched = 0;
    let duration = 0;

    const historyData = getFilterFilmsData(filmsData, `History`);

    historyData.forEach((filmObj) => {
      genreData.push(...filmObj.genre);
      watched++;
      duration += filmObj.duration;
    });

    let labels = [];
    let data = [];

    genreData.forEach((genreObj) => {
      let i = labels.indexOf(genreObj);
      if (i === -1) {
        labels.push(genreObj);
        data.push(1);
      } else {
        data[i] += 1;
      }
    });

    const statisticItemElements = statisticElement.querySelectorAll(`.statistic__item-text`);
    statisticItemElements[0].innerHTML = `${watched} <span class="statistic__item-description">movies</span>`;
    statisticItemElements[1].innerHTML = `${parseInt(duration / 60, 10)} <span class="statistic__item-description">h</span> 
                                          ${parseInt(duration % 60, 10)} <span class="statistic__item-description">m</span>`;
    statisticItemElements[2].textContent = labels[data.indexOf(Math.max(...data))];


    statisticCtx.height = BAR_HEIGHT * 5;
    const myChart = new Chart(statisticCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: `#ffe800`,
          hoverBackgroundColor: `#ffe800`,
          anchor: `start`,
        }],
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 20,
            },
            color: `#ffffff`,
            anchor: `start`,
            align: `start`,
            offset: 40,
          },
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#ffffff`,
              padding: 100,
              fontSize: 20,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
            barThickness: 24,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          }],
        },
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
      },
    });
    return myChart;
  }
  return false;
};

const showNextFilms = (filmsData, filmListElement, showMoreElement) => {
  renderFilms(filmsData, filmListElement, {isControls: true});
  if (pageIndex < filmsData.length / MAX_FILMS) {
    pageIndex++;
    showMoreElement.classList.remove(`visually-hidden`);
  } else {
    showMoreElement.classList.add(`visually-hidden`);
  }
};

const showFirstFilms = (filmsData, filmListElement, showMoreElement) => {
  pageIndex = 1;
  showNextFilms(filmsData, filmListElement, showMoreElement);
};


const main = () => {
  const mainNavigationElement = document.querySelector(`.main-navigation`);
  const filmListElement = document.querySelector(`.films-list .films-list__container`);
  const filmExtraElements = document.querySelectorAll(`.films-list--extra .films-list__container`);
  const showMoreElement = document.querySelector(`.films-list__show-more`);

  document.querySelector(`.popup-message--load`).style.display = `flex`;

  let filmsData = [];// = getDataFromObj(MAX_FILMS, getFilmObj);
  api.getFilms().then((films) => {
    filmsData = films;
    renderFilters(filmsData, mainNavigationElement, filmListElement, showMoreElement);
    renderFilms(getRandomArray(filmsData, 2), filmExtraElements[0]);
    renderFilms(getRandomArray(filmsData, 2), filmExtraElements[1]);
    showFirstFilms(filmsData, filmListElement, showMoreElement);
    document.querySelector(`.popup-message--load`).style.display = `none`;
  });


  const statisticMenuItemElement = mainNavigationElement.querySelector(`.main-navigation__item--additional`);
  statisticMenuItemElement.addEventListener(`click`, () => {
    toggleStatictic();
    renderStatistic(filmsData);
  });

  showMoreElement.addEventListener(`click`, () => {
    showNextFilms(getFilterFilmsData(filmsData), filmListElement, showMoreElement);
  });

  const searchElement = document.querySelector(`.search__field`);
  searchElement.addEventListener(`input`, (evt) => {
    evt.preventDefault();
    setDefaultMenuItem();
    showFirstFilms(getFilterFilmsData(filmsData, ``, evt.target.value), filmListElement, showMoreElement);
  });

  hideStatictic();
};

main();
