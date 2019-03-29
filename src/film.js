import Component from './component';
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

    this._isAddWatchlist = data.isAddWatchlist;
    this._isMarkWatchlist = data.isMarkWatchlist;
    this._isAddFavorite = data.isAddFavorite;

    this._param = param;

    this._onComments = null;
    this._onCommentsButtonClick = this._onCommentsButtonClick.bind(this);
    this._onAddWatchlist = null;
    this._onAddWatchlistButtonClick = this._onAddWatchlistButtonClick.bind(this);
    this._onMarkWatchlist = null;
    this._onMarkWatchlistButtonClick = this._onMarkWatchlistButtonClick.bind(this);
    this._onAddFavorite = null;
    this._onAddFavoriteButtonClick = this._onAddFavoriteButtonClick.bind(this);
  }

  set onComments(fn) {
    this._onComments = fn;
  }

  _onCommentsButtonClick() {
    if (typeof this._onComments === `function`) {
      this._onComments();
    }
  }

  _changeAddWatchlist() {
    this._isAddWatchlist = !this._isAddWatchlist;
  }

  set onAddWatchlist(fn) {
    this._onAddWatchlist = fn;
  }

  _onAddWatchlistButtonClick(evt) {
    evt.preventDefault();
    this._changeAddWatchlist();
    if (typeof this._onAddWatchlist === `function`) {
      this._onAddWatchlist(this._isAddWatchlist);
    }
  }

  _changeMarkWatchlist() {
    this._isMarkWatchlist = !this._isMarkWatchlist;
  }

  set onMarkWatchlist(fn) {
    this._onMarkWatchlist = fn;
  }

  _onMarkWatchlistButtonClick(evt) {
    evt.preventDefault();
    this._changeMarkWatchlist();
    if (typeof this._onMarkWatchlist === `function`) {
      this._onMarkWatchlist(this._isMarkWatchlist);
    }
  }

  _changeAddFavorite() {
    this._isAddFavorite = !this._isAddFavorite;
  }

  set onAddFavorite(fn) {
    this._onAddFavorite = fn;
  }

  _onAddFavoriteButtonClick(evt) {
    evt.preventDefault();
    this._changeAddFavorite();
    if (typeof this._onAddFavorite === `function`) {
      this._onAddFavorite(this._isAddFavorite);
    }
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
    this._element.innerHTML = this.createElement(this.template).innerHTML;
  }

  bind() {
    this._element.querySelector(`.film-card__comments`)
      .addEventListener(`click`, this._onCommentsButtonClick);
    if (this._isControls()) {
      this._element.querySelector(`.film-card__controls-item--add-to-watchlist`)
        .addEventListener(`click`, this._onAddWatchlistButtonClick);
      this._element.querySelector(`.film-card__controls-item--mark-as-watched`)
        .addEventListener(`click`, this._onMarkWatchlistButtonClick);
      this._element.querySelector(`.film-card__controls-item--favorite`)
        .addEventListener(`click`, this._onAddFavoriteButtonClick);
    }
  }

  unbind() {
    this._element.querySelector(`.film-card__comments`)
      .removeEventListener(`click`, this._onCommentsButtonClick);
    if (this._isControls()) {
      this._element.querySelector(`.film-card__controls-item--add-to-watchlist`)
        .removeEventListener(`click`, this._onAddWatchlistButtonClick);
      this._element.querySelector(`.film-card__controls-item--mark-as-watched`)
        .removeEventListener(`click`, this._onMarkWatchlistButtonClick);
      this._element.querySelector(`.film-card__controls-item--favorite`)
        .removeEventListener(`click`, this._onAddFavoriteButtonClick);
    }
  }

  update(data) {
    this._comments = data.comments;
    this._userRating = data.userRating;
    this._isAddWatchlist = data.isAddWatchlist;
    this._isMarkWatchlist = data.isMarkWatchlist;
    this._isAddFavorite = data.isAddFavorite;
  }
}
