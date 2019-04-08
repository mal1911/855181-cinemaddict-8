import {FILTER_DATA, USER_STATUS} from "./constants";
import Filter from './filter';

export default class Filters {
  constructor() {
    this._currTitle = `All`;
    this._mainNavigationElement = document.querySelector(`.main-navigation`);
    this._data = null;
    this._onFilterChange = null;
    this._onSearchChange = this._onSearchChange.bind(this);
    this.bind();
  }

  set data(data) {
    this._data = data;
  }

  set onFilterChange(fn) {
    this._onFilterChange = fn;
  }

  get currFilter() {
    return this._currTitle;
  }

  render() {
    const filterData = FILTER_DATA;
    const fragment = document.createDocumentFragment();
    filterData.forEach((title) => {
      const filterComponent = new Filter(title, title === `All`);
      filterComponent.onFilterClick = (newTitle) => {
        this._currTitle = newTitle;
        document.querySelector(`.search__field`).value = ``;
        if (typeof this._onFilterChange === `function`) {
          this._onFilterChange(this._getFilteredData(this._data, newTitle));
        }
      };
      fragment.appendChild(filterComponent.render());
    });
    this._mainNavigationElement.prepend(fragment);
    this.updateStatistics();
  }

  _onSearchChange(evt) {
    evt.preventDefault();
    this._setDefaultFilter();
    if (typeof this._onFilterChange === `function`) {
      this._onFilterChange(this._getFilteredData(this._data, `All`, evt.target.value));
    }
  }

  _setDefaultFilter() {
    this._mainNavigationElement.querySelector(`.main-navigation__item--active`).classList.remove(`main-navigation__item--active`);
    this._mainNavigationElement.querySelector(`.main-navigation__item`).classList.add(`main-navigation__item--active`);
  }

  _getFilteredData(data, title = ``, findValue = ``) {
    if (!title) {
      title = this._currTitle;
    }
    if (!findValue) {
      findValue = document.querySelector(`.search__field`).value;
    }

    switch (title) {
      case `Watchlist`:
        return data.filter((it) => it.userDetails.watchlist);
      case `History`:
        return data.filter((it) => it.userDetails.alreadyWatched);
      case `Favorites`:
        return data.filter((it) => it.userDetails.favorite);
    }
    return findValue ? data.filter((it) => it.filmInfo.title.indexOf(findValue) > -1) : data;
  }

  updateStatistics() {
    const menuCountElements = document.querySelectorAll(`.main-navigation__item .main-navigation__item-count`);
    menuCountElements[0].textContent = this._data.filter((it) => it.userDetails.watchlist).length;
    const alreadyWatchedCount = this._data.filter((it) => it.userDetails.alreadyWatched).length;
    menuCountElements[1].textContent = alreadyWatchedCount;
    menuCountElements[2].textContent = this._data.filter((it) => it.userDetails.favorite).length;

    let userStatus = `none`;
    if (alreadyWatchedCount >= USER_STATUS.NOVICE_START && alreadyWatchedCount <= USER_STATUS.NOVICE_END) {
      userStatus = `novice`;
    } else if (alreadyWatchedCount >= USER_STATUS.FAN_START && alreadyWatchedCount <= USER_STATUS.FAN_END) {
      userStatus = `fan`;
    } else if (alreadyWatchedCount > USER_STATUS.FAN_END) {
      userStatus = `movie buff`;
    }
    document.querySelector(`.profile__rating`).textContent = userStatus;
  }

  bind() {
    document.querySelector(`.search__field`)
      .addEventListener(`input`, this._onSearchChange);
  }
}
