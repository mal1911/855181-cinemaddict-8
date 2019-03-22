import Component from './component';
import {createElement} from "./utils";
import moment from 'moment';


export default class extends Component {
  constructor(data, param) {
    super();
    this._title = data.title;
    this._poster = data.poster;
    this._description = data.description;
    this._year = data.year;
    this._duration = data.duration;
    this._genre = data.genre;
    this._comments = data.comments;
    this._rating = data.rating;
    this._userRating = data.userRating;
    this._param = param;
    this._onComments = null;
    this._onCommentsButtonClick = this._onCommentsButtonClick.bind(this);
  }

  _onCommentsButtonClick() {
    return typeof this._onComments === `function` && this._onComments();
  }

  set onComments(fn) {
    this._onComments = fn;
  }

  _isControls() {
    return this._param && this._param.isControls;
  }

  _getControlsHTML() {
    return `<form class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist"><!--Add to watchlist--> WL</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched"><!--Mark as watched-->WTCHD</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite"><!--Mark as favorite-->FAV</button>
    </form>`;
  }

  get template() {
    return `<article class="film-card ${this._isControls() ? `` : `film-card--no-controls`}">
      <h3 class="film-card__title">${this._title}</h3>
      <p class="film-card__rating">${this._rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${moment(`${this._year}-01-01`).format(`YYYY`)}</span>
        <span class="film-card__duration">${moment().startOf(`day`).add(this._duration * 60 * 1000).format(`h:mm`)}</span>
          <span class="film-card__genre">${this._genre}</span>
      </p>
      <img src="./images/posters/${this._poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${this._description}</p>
     <button class="film-card__comments">${this._comments.length} comments</button>
      ${this._isControls() ? this._getControlsHTML() : ``}
    </article>`;
  }

  refresh() {
    this.unbind();
    this._partialUpdate();
    this.bind();
  }

  _partialUpdate() {
    this._element.innerHTML = createElement(this.template).innerHTML;
  }

  bind() {
    this._element.querySelector(`.film-card__comments`)
      .addEventListener(`click`, this._onCommentsButtonClick);
  }

  unbind() {
    this._element.querySelector(`.film-card__comments`)
      .removeEventListener(`click`, this._onCommentsButtonClick);
  }

  update(data) {
    this._comments = data.comments;
    this._userRating = data.userRating;
  }
}
