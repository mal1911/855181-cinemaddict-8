import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';

const BAR_HEIGHT = 80;

export default class Statistics {
  constructor() {
    this._toggleStaticticClick = this._toggleStaticticClick.bind(this);
    this._filterClick = this._filterClick.bind(this);
    this.bind();
  }

  set data(data) {
    this._data = data;
  }

  _toggleStaticticClick(evt) {
    evt.preventDefault();
    const statisticElement = document.querySelector(`.statistic`);
    statisticElement.classList.toggle(`visually-hidden`);
    document.querySelector(`.films`).classList.toggle(`visually-hidden`);
    if (!statisticElement.classList.contains(`visually-hidden`)) {
      this._renderStatistic(this._data);
    }
  }

  _filterClick(evt) {
    if (evt.target.tagName === `INPUT`) {
      this._renderStatistic(this._data);
    }
  }

  hideStatictic() {
    document.querySelector(`.statistic`).classList.add(`visually-hidden`);
    document.querySelector(`.films`).classList.remove(`visually-hidden`);
  }

  _renderStatistic(fullData) {
    const statisticElement = document.querySelector(`.statistic`);

    if (!statisticElement.classList.contains(`visually-hidden`)) {
      const staticticContainer = statisticElement.querySelector(`.statistic__chart-wrap`);

      const filter = statisticElement.querySelector(`.statistic__filters-input:checked`).value;
      let dateBegin;
      let dateEnd;
      switch (filter) {
        case `today`: {
          dateBegin = moment().startOf(`day`);
          dateEnd = moment().endOf(`day`);
          break;
        }
        case `year`: {
          dateBegin = moment().startOf(`year`);
          dateEnd = moment().endOf(`year`);
          break;
        }
        case `month`: {
          dateBegin = moment().startOf(`month`);
          dateEnd = moment().endOf(`month`);
          break;
        }
        case `week`: {
          dateBegin = moment().startOf(`week`);
          dateEnd = moment().endOf(`week`);
          break;
        }
      }

      const historyData = fullData.filter((it) => {
        const dateRelease = moment(it.filmInfo.release.date);
        let inDates = true;
        if (dateBegin && dateEnd) {
          inDates = dateRelease >= dateBegin && dateRelease <= dateEnd;
        }
        return it.userDetails.alreadyWatched && inDates;
      });

      staticticContainer.innerHTML = `<canvas class="statistic__chart" width="1000"></canvas>`;
      const statisticCtx = statisticElement.querySelector(`.statistic__chart`);

      let genreData = [];
      let watched = 0;
      let duration = 0;

      historyData.forEach((filmObj) => {
        genreData.push(...filmObj.filmInfo.genre);
        watched++;
        duration += filmObj.filmInfo.runtime;
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
      statisticElement.querySelector(`.statistic__rank-label`).textContent = statisticItemElements[2].textContent;

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
  }

  bind() {
    document.querySelector(`.main-navigation__item--additional`)
      .addEventListener(`click`, this._toggleStaticticClick);
    document.querySelector(`.statistic__filters`)
      .addEventListener(`click`, this._filterClick);
  }
}
