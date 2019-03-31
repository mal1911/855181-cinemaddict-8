import {getHTMLFromData} from './utils';
import Component from './component';
import moment from 'moment';

const ENTER_KEY = 13;

export default class FilmPopup extends Component {
  constructor(data) {
    super();

    this._title = data.filimInfo.title;
    this._poster = data.filimInfo.poster;
    this._description = data.filimInfo.description;
    this._alternativeTitle = data.filimInfo.alternativeTitle;

    this._dateRelease = data.filimInfo.release.date; // год правильно поставить
    this._duration = data.filimInfo.runtime;
    this._director = data.filimInfo.director;
    this._writers = data.filimInfo.writers.slice();
    this._actors = data.filimInfo.actors.slice();


    this._genre = data.filimInfo.genre.slice();
    this._comments = data.comments.slice();
    this._ageRating = data.filimInfo.ageRating;
    this._rating = data.filimInfo.totalRating;
    this._userRating = parseInt(data.userDetails.personalRating, 10);
    this._country = data.filimInfo.release.releaseCountry;

    this._isAddWatchlist = data.userDetails.watchlist;
    this._isMarkWatchlist = data.userDetails.alreadyWatched;
    this._isAddFavorite = data.userDetails.favorite;

    this._onSave = null;
    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
    this._onAddComments = this._onAddComments.bind(this);
    this._onChangeUserRating = this._onChangeUserRating.bind(this);
    this._onEmojiClick = this._onEmojiClick.bind(this);
  }

  _processForm(formData) {
    const entry = {
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

  set onSave(fn) {
    this._onSave = fn;
  }

  _onCloseButtonClick(evt) {
    evt.preventDefault();
    this._save();
  }

  _save() {
    const formData = new FormData(this._element.querySelector(`.film-details__inner`));
    const newData = this._processForm(formData);
    if (typeof this._onSave === `function`) {
      this._onSave(newData);
    }
    this.update(newData);
  }

  changeAddWatchlist(value) {
    this._isAddWatchlist = value;
  }

  changeMarkWatchlist(value) {
    this._isMarkWatchlist = value;
  }

  changeAddFavorite(value) {
    this._isAddFavorite = value;
  }

  _onAddComments(evt) {
    const getEmotion = (emotion) => {
      switch (emotion) {
        case `😴`:
          return `sleeping`;
        case `😐`:
          return `neutral-face`;
        case `😀`:
          return `grinning`;
      }
      return ``;
    };
    if (evt.ctrlKey && evt.keyCode === ENTER_KEY) {
      const element = evt.target;
      const emotion = getEmotion(this._element.querySelector(`.film-details__add-emoji-label`).textContent);
      const comment = element.value;
      if (comment) {
        this._comments.push({
          emotion,
          comment,
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
      this._element.querySelector(`.film-details__user-rating`).textContent = `Your rate ${evt.target.textContent.trim()}`;
    }
  }

  _onEmojiClick(evt) {
    if (evt.target.tagName === `LABEL`) {
      this._element.querySelector(`.film-details__add-emoji-label`).textContent = evt.target.textContent;
    }
  }

  _getCommentHTML(comment) {
    const getEmotion = (emotion) => {
      switch (emotion) {
        case `sleeping`:
          return `😴`;
        case `neutral-face`:
          return `😐`;
        case `grinning`:
          return `😀`;
      }
      return ``;
    };
    return `<li class="film-details__comment">
              <span class="film-details__comment-emoji">${getEmotion(comment.emotion)}</span>
                <div>
                  <p class="film-details__comment-text">${comment.comment}</p>
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
                    <img class="film-details__poster-img" src="./${this._poster}" alt="${this._title}">
            
                    <p class="film-details__age">${this._ageRating}+</p>
                  </div>
            
                  <div class="film-details__info">
                    <div class="film-details__info-head">
                      <div class="film-details__title-wrap">
                        <h3 class="film-details__title">${this._title}</h3>
                        <p class="film-details__title-original">Original: ${this._alternativeTitle}</p>
                      </div>
            
                      <div class="film-details__rating">
                        <p class="film-details__total-rating">${this._rating}</p>
                        <p class="film-details__user-rating">Your rate ${this._userRating}</p>
                      </div>
                    </div>
            
                    <table class="film-details__table">
                      <tr class="film-details__row">
                        <td class="film-details__term">Director</td>
                        <td class="film-details__cell">${this._director}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Writers</td>
                        <td class="film-details__cell">${this._writers.join(`,`)}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Actors</td>
                        <td class="film-details__cell">${this._actors.join(`,`)}</td>
                        </tr>
                        <tr class="film-details__row">
                          <td class="film-details__term">Release Date</td>
                          <td class="film-details__cell">${moment(this._releaseDate).format(`DD MMMM YYYY`)} (${this._country})</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Runtime</td>
                        <td class="film-details__cell">${this._duration} min</td>
                        </tr>
                        <tr class="film-details__row">
                          <td class="film-details__term">Country</td>
                          <td class="film-details__cell">${this._country}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Genres</td>
                        <td class="film-details__cell">
                          ${this._genre.map((obj, i, arr) => `<span class="film-details__genre">${obj}${i !== arr.length - 1 ? `,` : ``}</span>`).join(``).slice(0, -1)}
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
