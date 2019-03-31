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
const MAX_FILMS = 5;
let pageIndex = 1;

const renderFilters = (data, mainNavigationElement, filmListElement, showMoreElement) => {
  const filterData = FILTER_DATA;
  const fragment = document.createDocumentFragment();
  filterData.forEach((title) => {
    const filterComponent = new Filter(title, title === `All`);
    filterComponent.onClick = () => {
      hideStatictic();
      showPrevFilms(getFilterFilmsData(data), filmListElement, showMoreElement);
    };
    fragment.appendChild(filterComponent.render());
  });
  mainNavigationElement.prepend(fragment);
};

const updateFilm = (data, oldFilm, newFilm) => {
  const i = data.indexOf(oldFilm);
  data[i] = Object.assign({}, data[i], newFilm);
  return data[i];
};

const getFilterFilmsData = (data, title = ``) => {
  if (!title) {
    title = document.querySelector(`.main-navigation__item--active`).textContent.trim();
  }
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
  data.forEach((filmObj, i) => {
    if (i >= pageIndex - 1 * MAX_FILMS && i < pageIndex * MAX_FILMS) {
      const filmComponent = new Film(filmObj, param);
      const filmPopupComponent = new FilmPopup(filmObj);

      filmComponent.onComments = () => {
        filmPopupComponent.render();
        bodyElement.append(filmPopupComponent.element);
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
  const maxPageIndex = filmsData.length / MAX_FILMS;
  if (pageIndex < maxPageIndex) {
    pageIndex++;
    showMoreElement.classList.remove(`visually-hidden`);
  } else {
    showMoreElement.classList.add(`visually-hidden`);
  }
};

const showPrevFilms = (filmsData, filmListElement, showMoreElement) => {
  pageIndex = 1;
  showNextFilms(filmsData, filmListElement, showMoreElement);
};


const main = () => {
  const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

  const mainNavigationElement = document.querySelector(`.main-navigation`);
  const filmListElement = document.querySelector(`.films-list .films-list__container`);
  const filmExtraElements = document.querySelectorAll(`.films-list--extra .films-list__container`);
  const showMoreElement = document.querySelector(`.films-list__show-more`);


  let filmsData = [];// = getDataFromObj(MAX_FILMS, getFilmObj);
  api.getFilms().then((films) => {
    filmsData = films;
    renderFilters(filmsData, mainNavigationElement, filmListElement, showMoreElement);
    showPrevFilms(filmsData, filmListElement, showMoreElement);
    renderFilms(getRandomArray(filmsData, 2), filmExtraElements[0]);
    renderFilms(getRandomArray(filmsData, 2), filmExtraElements[1]);
  });


  const statisticMenuItemElement = mainNavigationElement.querySelector(`.main-navigation__item--additional`);
  statisticMenuItemElement.addEventListener(`click`, () => {
    toggleStatictic();
    renderStatistic(filmsData);
  });

  showMoreElement.addEventListener(`click`, () => {
    showNextFilms(getFilterFilmsData(filmsData), filmListElement, showMoreElement);
  });
  hideStatictic();
};

main();
