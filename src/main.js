import {getDataFromObj, getRandomArray} from './utils.js';
import getFilmObj from './film-obj.js';
import Filter from './filter';
import Film from './film';
import FilmPopup from './film-popup';
import {removeChildElements} from "./utils";
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';


const renderFilters = (data, mainNavigationElement, filmListElement) => {
  const filterData = [`All`, `Watchlist`, `History`, `Favorites`];
  const fragment = document.createDocumentFragment();
  filterData.forEach((title) => {
    const filterComponent = new Filter(title, title === `All`);
    filterComponent.onClick = () => {
      hideStatictic();
      renderFilms(getFilterFilmsData(data), filmListElement, {isControls: true});
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
  if (!document.querySelector(`.statistic`).classList.contains(`visually-hidden`)) {
    console.log(`renderChart`);
    const staticticContainer = document.querySelector(`.statistic__chart-wrap`);
    staticticContainer.innerHTML = ``;
    staticticContainer.innerHTML = `<canvas class="statistic__chart" width="1000"></canvas>`;

    const statisticCtx = document.querySelector(`.statistic__chart`);

    // Обязательно рассчитайте высоту canvas, она зависит от количества элементов диаграммы
    const BAR_HEIGHT = 50;
    statisticCtx.height = BAR_HEIGHT * 5;
    const myChart = new Chart(statisticCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: [`Sci-Fi`, `Animation`, `Fantasy`, `Comedy`, `TV Series`],
        datasets: [{
          data: [11, 8, 7, 4, 3],
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
            anchor: 'start',
            align: 'start',
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


  }
};

const onStaticticClick = (data) => {
  toggleStatictic();
  renderStatistic(data);
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

  const statisticMenuItemElement = mainNavigationElement.querySelector(`.main-navigation__item--additional`);
  statisticMenuItemElement.addEventListener(`click`, () => {
    toggleStatictic();
    renderStatistic(filmsData);

  });
  hideStatictic();
};

main();
