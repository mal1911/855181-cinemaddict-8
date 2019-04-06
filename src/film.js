import Component from './component';
import moment from 'moment';


export default class extends Component {
  constructor(data, param) {
    super();
    this._title = data.filmInfo.title;
    this._poster = data.filmInfo.poster;
    this._description = data.filmInfo.description;
    this._dateRelease = data.filmInfo.release.date; // год правильно поставить
    this._duration = data.filmInfo.runtime;
    this._genre = data.filmInfo.genre.slice();
    this._rating = data.filmInfo.totalRating;
    this.update(data);
    this._param = param;
    this._onEdit = null;
    this._onChangeStatus = null;
    this._onCommentsButtonClick = this._onCommentsButtonClick.bind(this);
    this._onAddWatchlistButtonClick = this._onAddWatchlistButtonClick.bind(this);
    this._onMarkWatchlistButtonClick = this._onMarkWatchlistButtonClick.bind(this);
    this._onAddFavoriteButtonClick = this._onAddFavoriteButtonClick.bind(this);
  }

  set onEdit(fn) {
    this._onEdit = fn;
  }

  _onCommentsButtonClick() {
    if (typeof this._onEdit === `function`) {
      this._onEdit();
    }
  }

  set onChangeStatus(fn) {
    this._onChangeStatus = fn;
  }

  _onAddWatchlistButtonClick(evt) {
    evt.preventDefault();
    this._changeAddWatchlist();
    this._callChangeStatus();
  }

  _onMarkWatchlistButtonClick(evt) {
    evt.preventDefault();
    this._changeMarkWatchlist();
    this._callChangeStatus();
  }

  _onAddFavoriteButtonClick(evt) {
    evt.preventDefault();
    this._changeAddFavorite();
    this._callChangeStatus();
  }

  _changeAddWatchlist() {
    this._userDetails.watchlist = !this._userDetails.watchlist;
  }

  _changeMarkWatchlist() {
    this._userDetails.alreadyWatched = !this._userDetails.alreadyWatched;
  }

  _changeAddFavorite() {
    this._userDetails.favorite = !this._userDetails.favorite;
  }

  _callChangeStatus() {
    if (typeof this._onChangeStatus === `function`) {
      this._onChangeStatus(Object.assign({}, this._userDetails));
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
      <h3 class="film-card__title">${this._title.substring(0, 139)}</h3>
      <p class="film-card__rating">${this._rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${moment(this._dateRelease).format(`YYYY`)}</span>
        <span class="film-card__duration">${moment().startOf(`day`).add(this._duration * 60 * 1000).format(`hh:mm`)}</span>
            <span class="film-card__genre">${this._genre.join(`, `)}</span>
        </p>
        <img src="./${this._poster}" alt="" class="film-card__poster">
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

  block() {
    if (this._element) {
      this._element.querySelector(`.film-card__controls`).disabled = true;
    }
  }

  unblock() {
    if (this._element) {
      this._element.querySelector(`.film-card__controls`).disabled = false;
    }
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
    this._comments = data.comments.slice();
    this._userDetails = {
      personalRating: parseInt(data.userDetails.personalRating, 10),
      watchlist: data.userDetails.watchlist,
      alreadyWatched: data.userDetails.alreadyWatched,
      favorite: data.userDetails.favorite,
    };
  }
}
