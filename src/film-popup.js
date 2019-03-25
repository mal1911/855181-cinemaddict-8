import {getHTMLFromData} from './utils';
import Component from './component';
import moment from 'moment';

const ENTER_KEY = 13;

export default class FilmPopup extends Component {
  constructor(data) {
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
    this._releaseDate = data.releaseDate;
    this._country = data.country;

    this._isAddWatchlist = data.isAddWatchlist;
    this._isMarkWatchlist = data.isMarkWatchlist;
    this._isAddFavorite = data.isAddFavorite;


    this._onClose = null;
    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
/*
    this._onAddWatchlist = null;
    this._onAddWatchlistButtonClick = this._onAddWatchlistButtonClick.bind(this);
    this._onMarkWatchlist = null;
    this._onMarkWatchlistButtonClick = this._onMarkWatchlistButtonClick.bind(this);
    this._onAddFavorite = null;
    this._onAddFavoriteButtonClick = this._onAddFavoriteButtonClick.bind(this);
*/
    this._onAddComments = this._onAddComments.bind(this);
    this._onChangeUserRating = this._onChangeUserRating.bind(this);
    this._onEmojiClick = this._onEmojiClick.bind(this);
  }

  _processForm(formData) {
    const entry = {
      /*      title: `new title`,
            poster: ``,
            description: ``,
            year: ``,
            duration: ``,
            genre: [],
            rating: ``,*/

      comments: [],
      userRating: 0,
      isAddWatchlist: false,
      isMarkWatchlist: false,
      isAddFavorite: false,
    };

    const filmEditMapper = FilmPopup.createMapper(entry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (filmEditMapper[property]) {
        filmEditMapper[property](value);
      }
    }
    entry.comments = this._comments;
    //console.log(entry);
    return entry;
  }

  static createMapper(target) {
    return {
      score: (value) => {
        target.userRating = Number(value);
        return target.userRating;
      },
      watchlist: (value) => {
        target.isAddWatchlist = Boolean(value);
        return target.isAddWatchlist;
      },
      watched: (value) => {
        target.isMarkWatchlist = Boolean(value);
        return target.isMarkWatchlist;
      },
      favorite: (value) => {
        target.isAddFavorite = Boolean(value);
        return target.isAddFavorite;
      },
    };
  }

  set onClose(fn) {
    this._onClose = fn;
  }

  _onCloseButtonClick(evt) {
    evt.preventDefault();
    const formData = new FormData(this._element.querySelector(`.film-details__inner`));
    const newData = this._processForm(formData);
    if (typeof this._onClose === `function`) {
      this._onClose(newData);
    }
    this.update(newData);
  }

  changeAddWatchlist() {
    this._isAddWatchlist = !this._isAddWatchlist;
  }

  changeMarkWatchlist() {
    this._isMarkWatchlist = !this._isMarkWatchlist;
  }

  changeAddFavorite() {
    this._isAddFavorite = !this._isAddFavorite;
  }


/*

  set onAddWatchlist(fn) {
    this._onAddWatchlist = fn;
  }

  _onAddWatchlistButtonClick(evt) {
    //evt.preventDefault();
    this._changeAddWatchlist();
    if (typeof this._onAddWatchlist === `function`) {
      this._onAddWatchlist();
    }
  }

  set onMarkWatchlist(fn) {
    this._onMarkWatchlist = fn;
  }

  _onMarkWatchlistButtonClick(evt) {
    //evt.preventDefault();
    this._changeMarkWatchlist();
    if (typeof this._onMarkWatchlist === `function`) {
      this._onMarkWatchlist();
    }
  }


  set onAddFavorite(fn) {
    this._onAddFavorite = fn;
  }

  _onAddFavoriteButtonClick(evt) {
    //evt.preventDefault();
    this._changeAddFavorite();
    if (typeof this._onAddFavorite === `function`) {
      this._onAddFavorite();
    }
  }
*/
  _onAddComments(evt) {
    if (evt.ctrlKey && evt.keyCode === ENTER_KEY) {
      const element = evt.target;
      const emoji = this._element.querySelector(`.film-details__add-emoji-label`).innerText;
      const text = element.value;
      if (text) {
        this._comments.push({
          emoji,
          text,
          author: ``,
          date: new Date(),
        });
        element.value = ``;
        this._refreshComments();
      }
    }
  }

  _onChangeUserRating(evt) {
    if (evt.target.tagName === `LABEL`) {
      this._element.querySelector(`.film-details__user-rating`).innerText = `Your rate ${evt.target.innerText}`;
    }
  }

  _onEmojiClick(evt) {
    if (evt.target.tagName === `LABEL`) {
      this._element.querySelector(`.film-details__add-emoji-label`).innerText = evt.target.innerText;
    }
  }

  _getCommentHTML(comment) {
    return `<li class="film-details__comment">
              <span class="film-details__comment-emoji">${comment.emoji}</span>
                <div>
                  <p class="film-details__comment-text">${comment.text}</p>
                  <p class="film-details__comment-info">
                    <span class="film-details__comment-author">${comment.author}</span>
                    <span class="film-details__comment-day">${moment(comment.date).format(`DD.MM.YYYY`)}</span>
                    </p>
                  </div>
               </li>`;
  }

  _getCommentsHTML() {
    return getHTMLFromData(this._comments, this._getCommentHTML);
  }

  _refreshComments() {
    let parentElement = this._element.querySelector(`.film-details__comments-count`);
    parentElement.innerHTML = this._comments.length;
    parentElement = this._element.querySelector(`.film-details__comments-list`);
    parentElement.innerHTML = this._getCommentsHTML();
  }

  get template() {
    return `<section class="film-details">
              <form class="film-details__inner" action="" method="get">
                <div class="film-details__close">
                  <button class="film-details__close-btn" type="button">close</button>
                </div>
                <div class="film-details__info-wrap">
                  <div class="film-details__poster">
                    <img class="film-details__poster-img" src="./images/posters/${this._poster}" alt="incredables-2">
            
                    <p class="film-details__age">18+</p>
                  </div>
            
                  <div class="film-details__info">
                    <div class="film-details__info-head">
                      <div class="film-details__title-wrap">
                        <h3 class="film-details__title">${this._title}</h3>
                        <p class="film-details__title-original">Original: Невероятная семейка</p>
                      </div>
            
                      <div class="film-details__rating">
                        <p class="film-details__total-rating">${this._rating}</p>
                        <p class="film-details__user-rating">Your rate ${this._userRating}</p>
                      </div>
                    </div>
            
                    <table class="film-details__table">
                      <tr class="film-details__row">
                        <td class="film-details__term">Director</td>
                        <td class="film-details__cell">Brad Bird</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Writers</td>
                        <td class="film-details__cell">Brad Bird</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Actors</td>
                        <td class="film-details__cell">Samuel L. Jackson, Catherine Keener, Sophia Bush</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Release Date</td>
                        <td class="film-details__cell">${moment(this._releaseDate).format(`DD MMMM YYYY`)} (${this._country})</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Runtime</td>
                        <td class="film-details__cell">${moment().startOf(`day`).add(this._duration * 60 * 1000).format(`h:mm`)}</td>
                        </tr>
                        <tr class="film-details__row">
                          <td class="film-details__term">Country</td>
                          <td class="film-details__cell">${this._country}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Genres</td>
                        <td class="film-details__cell">
                          <span class="film-details__genre">Animation</span>
                          <span class="film-details__genre">Action</span>
                          <span class="film-details__genre">Adventure</span></td>
                      </tr>
                    </table>
            
                    <p class="film-details__film-description">
                      ${this._description}
                    </p>
                  </div>
                </div>
            
                <section class="film-details__controls">
                  <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${this._isAddWatchlist && ` checked`}>
                    <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>
              
                    <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${this._isMarkWatchlist && ` checked`}>
                      <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>
                
                      <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${this._isAddFavorite && ` checked`}>
                        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
                      </section>
                  
                      <section class="film-details__comments-wrap">
                        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._comments.length}</span></h3>
            
                  <ul class="film-details__comments-list">
                    ${this._getCommentsHTML()}
                  </ul>
            
                  <div class="film-details__new-comment">
                    <div>
                      <label for="add-emoji" class="film-details__add-emoji-label">😐</label>
                      <input type="checkbox" class="film-details__add-emoji visually-hidden" id="add-emoji">
            
                      <div class="film-details__emoji-list">
                        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                        <label class="film-details__emoji-label" for="emoji-sleeping">😴</label>
            
                        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-neutral-face" value="neutral-face" checked>
                        <label class="film-details__emoji-label" for="emoji-neutral-face">😐</label>
            
                        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-grinning" value="grinning">
                        <label class="film-details__emoji-label" for="emoji-grinning">😀</label>
                      </div>
                    </div>
                    <label class="film-details__comment-label">
                      <textarea class="film-details__comment-input" placeholder="← Select reaction, add comment here" name="comment"></textarea>
                    </label>
                  </div>
                </section>
            
                <section class="film-details__user-rating-wrap">
                  <div class="film-details__user-rating-controls">
                    <span class="film-details__watched-status film-details__watched-status--active">Already watched</span>
                    <button class="film-details__watched-reset" type="button">undo</button>
                  </div>
            
                  <div class="film-details__user-score">
                    <div class="film-details__user-rating-poster">
                      <img src="./images/posters/${this._poster}" alt="film-poster" class="film-details__user-rating-img">
                    </div>
            
                    <section class="film-details__user-rating-inner">
                      <h3 class="film-details__user-rating-title">Incredibles 2</h3>
            
                      <p class="film-details__user-rating-feelings">How you feel it?</p>
            
                      <div class="film-details__user-rating-score">
                        <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="1" id="rating-1" ${this._userRating === 1 && ` checked`}>
                          <label class="film-details__user-rating-label" for="rating-1">1</label>
              
                          <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="2" id="rating-2" ${this._userRating === 2 && ` checked`}>
                            <label class="film-details__user-rating-label" for="rating-2">2</label>
                
                            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="3" id="rating-3" ${this._userRating === 3 && ` checked`}>
                              <label class="film-details__user-rating-label" for="rating-3">3</label>
                  
                              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="4" id="rating-4" ${this._userRating === 4 && ` checked`}>
                                <label class="film-details__user-rating-label" for="rating-4">4</label>
                    
                                <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="5" id="rating-5" ${this._userRating === 5 && ` checked`}>
                        <label class="film-details__user-rating-label" for="rating-5">5</label>
            
                        <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="6" id="rating-6" ${this._userRating === 6 && ` checked`}>
                          <label class="film-details__user-rating-label" for="rating-6">6</label>
              
                          <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="7" id="rating-7" ${this._userRating === 7 && ` checked`}>
                            <label class="film-details__user-rating-label" for="rating-7">7</label>
                
                            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="8" id="rating-8" ${this._userRating === 8 && ` checked`}>
                              <label class="film-details__user-rating-label" for="rating-8">8</label>
                  
                              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="9" id="rating-9" ${this._userRating === 9 && ` checked`}>
                                <label class="film-details__user-rating-label" for="rating-9">9</label>
                    
                              </div>
                            </section>
                          </div>
                        </section>
                      </form>
                    </section>`;
  }

  bind() {
    this._element.querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, this._onCloseButtonClick);

    /*this._element.querySelector(`.film-details__control-label--watchlist`)
      .addEventListener(`click`, this._onAddWatchlistButtonClick);
    this._element.querySelector(`.film-details__control-label--watched`)
      .addEventListener(`click`, this._onMarkWatchlistButtonClick);
    this._element.querySelector(`.film-details__control-label--favorite`)
      .addEventListener(`click`, this._onAddFavoriteButtonClick);*/

    this._element.querySelector(`.film-details__emoji-list`)
      .addEventListener(`click`, this._onEmojiClick);
    this._element.querySelector(`.film-details__comment-input`)
      .addEventListener(`keydown`, this._onAddComments);
    this._element.querySelector(`.film-details__user-rating-score`)
      .addEventListener(`click`, this._onChangeUserRating);
  }

  unbind() {
    this._element.querySelector(`.film-details__close-btn`)
      .removeEventListener(`click`, this._onCloseButtonClick);

    /*this._element.querySelector(`.film-details__control-label--watchlist`)
      .removeEventListener(`click`, this._onAddWatchlistButtonClick);
    this._element.querySelector(`.film-details__control-label--watched`)
      .removeEventListener(`click`, this._onMarkWatchlistButtonClick);
    this._element.querySelector(`.film-details__control-label--favorite`)
      .removeEventListener(`click`, this._onAddFavoriteButtonClick);*/

    this._element.querySelector(`.film-details__emoji-list`)
      .removeEventListener(`click`, this._onEmojiClick);

    this._element.querySelector(`.film-details__comment-input`)
      .removeEventListener(`keydown`, this._onAddComments);

    this._element.querySelector(`.film-details__user-rating-score`)
      .removeEventListener(`click`, this._onChangeUserRating);
  }

  update(data) {
    this._comments = data.comments;
    this._userRating = data.userRating;
    this._isAddWatchlist = data.isAddWatchlist;
    this._isMarkWatchlist = data.isMarkWatchlist;
    this._isAddFavorite = data.isAddFavorite;
  }
}
