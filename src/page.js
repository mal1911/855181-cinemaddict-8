import {MAX_FILMS} from "./constants";

export default class Page {
  constructor(filmsComponent) {
    this._pageIndex = 1;
    this._filmsComponent = filmsComponent;
    this._showMoreElement = document.querySelector(`.films-list__show-more`);
    this._onMoreClick = this._onMoreClick.bind(this);
    this.bind();
  }

  set filteredData(data) {
    this._filteredData = data;
  }

  _onMoreClick() {
    this.showNext();
  }

  showNext() {
    this._filmsComponent.render(this._filteredData, this._pageIndex * MAX_FILMS);
    if (this._pageIndex < this._filteredData.length / MAX_FILMS) {
      this._pageIndex++;
      this._showMoreElement.classList.remove(`visually-hidden`);
    } else {
      this._showMoreElement.classList.add(`visually-hidden`);
    }
  }

  showFirst() {
    this._pageIndex = 1;
    this.showNext();
  }

  bind() {
    this._showMoreElement.addEventListener(`click`, this._onMoreClick);
  }
}
