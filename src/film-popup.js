import {EMOTION, ENTER_KEYCODE, ESC_KEYCODE} from "./constants";
import Component from './component';
import moment from 'moment';

export default class FilmPopup extends Component {
  constructor(data) {
    super();
    this._title = data.filmInfo.title;
    this._poster = data.filmInfo.poster;
    this._description = data.filmInfo.description;
    this._alternativeTitle = data.filmInfo.alternativeTitle;
    this._dateRelease = data.filmInfo.release.date;
    this._duration = data.filmInfo.runtime;
    this._director = data.filmInfo.director;
    this._writers = data.filmInfo.writers.slice();
    this._actors = data.filmInfo.actors.slice();
    this._genre = data.filmInfo.genre.slice();
    this._ageRating = data.filmInfo.ageRating;
    this._rating = data.filmInfo.totalRating;
    this._country = data.filmInfo.release.releaseCountry;
    this.update(data);

    this._onSave = null;
    this._onClose = null;
    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
    this._onEscPress = this._onEscPress.bind(this);
    this._onAddComments = this._onAddComments.bind(this);
    this._onChangeUserRating = this._onChangeUserRating.bind(this);
    this._onEmojiClick = this._onEmojiClick.bind(this);
    this._onDeleteLastCommentClick = this._onDeleteLastCommentClick.bind(this);
    this._onControlsClick = this._onControlsClick.bind(this);
  }

  _processForm(formData, entry) {
    const filmEditMapper = FilmPopup.createMapper(entry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (filmEditMapper[property]) {
        filmEditMapper[property](value);
      }
    }
    return entry;
  }

  static createMapper(target) {
    return {
      score: (value) => {
        target.userDetails.personalRating = Number(value);
        return target.userDetails.personalRating;
      },
      watchlist: (value) => {
        target.userDetails.watchlist = Boolean(value);
        return target.userDetails.watchlist;
      },
      watched: (value) => {
        target.userDetails.alreadyWatched = Boolean(value);
        return target.userDetails.alreadyWatched;
      },
      favorite: (value) => {
        target.userDetails.favorite = Boolean(value);
        return target.userDetails.favorite;
      },
    };
  }

  set onSave(fn) {
    this._onSave = fn;
  }

  set onClose(fn) {
    this._onClose = fn;
  }

  _onCloseButtonClick(evt) {
    evt.preventDefault();
    this._close();
  }

  _onEscPress(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      evt.preventDefault();
      this._close();
    }
  }

  save(userDetailObj = null, comments = null, param = null) {
    let newData = {
      comments: [],
      userDetails: {
        watchlist: false,
        alreadyWatched: false,
        favorite: false,
        personalRating: 0,
      },
    };
    if (comments) {
      newData.comments = comments;
    } else {
      newData.comments = this._comments;
    }
    if (userDetailObj) {
      newData.userDetails = Object.assign({}, userDetailObj);
    } else {
      const formData = new FormData(this._element.querySelector(`.film-details__inner`));
      newData = this._processForm(formData, newData);
    }
    if (typeof this._onSave === `function`) {
      this._onSave(newData, param);
    }
    return newData;
  }

  _close() {
    if (typeof this._onClose === `function`) {
      this._onClose(this.save(null, null, {isPopupClose: true}));
    }
  }

  block() {
    if (this._element) {
      this._element.querySelector(`.film-details__inner`).disabled = true;
    }
  }

  unblock() {
    if (this._element) {
      this._element.querySelector(`.film-details__inner`).disabled = false;
    }
  }

  _onAddComments(evt) {
    if (evt.ctrlKey && evt.keyCode === ENTER_KEYCODE) {
      const element = evt.target;
      const emotion = this._element.querySelector(`.film-details__add-emoji`).value;
      const comment = element.value;
      if (comment) {
        const newComments = this._comments.slice();
        newComments.push({
          emotion,
          comment,
          author: `Alexey Malyshev`,
          date: new Date(),
        });
        this.save(null, newComments, {isAddComment: true});
      }
    }
  }

  _onDeleteLastCommentClick() {
    if (this._isLastCommentUpdated()) {
      const newComments = this._comments.slice();
      newComments.pop();
      this.save(null, newComments, {isDeleteComment: true});
    }
  }

  _onControlsClick() {
    this.save(null, null, {isChangeStatistic: true});
  }

  _onChangeUserRating(evt) {
    if (evt.target.tagName === `INPUT`) {
      this.save(null, null, {isChangeRating: true});
    }

  }

  _onEmojiClick(evt) {
    if (evt.target.tagName === `LABEL`) {
      this._element.querySelector(`.film-details__add-emoji-label`).textContent = evt.target.textContent;
    }
    if (evt.target.tagName === `INPUT`) {
      this._element.querySelector(`.film-details__add-emoji`).value = evt.target.value;
    }
  }

  _getCommentHTML(comment) {
    const getCommentDateDiff = (date) => {
      const currDate = moment();

      const years = currDate.diff(date, `years`);
      if (years > 0) {
        return `${years} years ago`;
      }
      const months = currDate.diff(date, `months`) % 12;
      if (months > 0) {
        return `${months} months ago`;
      }
      const days = currDate.diff(date, `days`);
      if (days > 0) {
        return `${days} days ago`;
      }
      const hour = currDate.diff(date, `hour`) % 24;
      if (hour > 0) {
        return `${hour} hour ago`;
      }
      const minutes = currDate.diff(date, `minutes`) % 60;
      if (minutes > 0) {
        return `${minutes} minutes ago`;
      }
      const seconds = currDate.diff(date, `seconds`) % 60;
      if (seconds > 0) {
        return `${seconds} seconds ago`;
      }
      return ``;
    };
    return `<li class="film-details__comment">
              <span class="film-details__comment-emoji">${EMOTION[comment.emotion]}</span>
                <div>
                  <p class="film-details__comment-text">${comment.comment}</p>
                  <p class="film-details__comment-info">
                    <span class="film-details__comment-author">${comment.author}</span>
                    <span class="film-details__comment-day">${getCommentDateDiff(comment.date)}</span>
                    </p>
                  </div>
               </li>`;
  }

  _getCommentsHTML() {
    return this._getHTMLFromData(this._comments, this._getCommentHTML);
  }

  _refreshComments() {
    let parentElement = this._element.querySelector(`.film-details__comments-count`);
    parentElement.textContent = this._comments.length;
    parentElement = this._element.querySelector(`.film-details__comments-list`);
    parentElement.innerHTML = this._getCommentsHTML();

    const userRatindElement = this._element.querySelector(`.film-details__user-rating-controls`);
    if (this._isLastCommentUpdated()) {
      userRatindElement.classList.remove(`visually-hidden`);
    } else {
      userRatindElement.classList.add(`visually-hidden`);
    }
    this._element.querySelector(`.film-details__comment-input`).value = ``;
  }

  _isLastCommentUpdated() {
    return this._comments[this._comments.length - 1].author === `Alexey Malyshev`;
  }

  _getWatchedStatus(userDetails) {
    if (userDetails.alreadyWatched) {
      return `Already watched`;
    }
    if (userDetails.watchlist) {
      return `Will watch`;
    }
    return ``;
  }

  _getDetailsControlsHTML() {
    return `<input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${this._userDetails.watchlist && ` checked`}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${this._userDetails.alreadyWatched && ` checked`}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>
            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${this._userDetails.favorite && ` checked`}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>`;
  }

  _refreshDetailsControls() {
    const detailsControlsElement = this.element.querySelector(`.film-details__controls`);
    detailsControlsElement.innerHTML = this._getDetailsControlsHTML();
    this._element.querySelector(`.film-details__watched-status`).textContent = this._getWatchedStatus(this._userDetails);
  }

  _getUserRatingScoreHTML() {
    return `<input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="0" id="rating-0" ${this._userDetails.personalRating === 0 && ` checked`}>
            <label class="film-details__user-rating-label" for="rating-0">0</label>
            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="1" id="rating-1" ${this._userDetails.personalRating === 1 && ` checked`}>
            <label class="film-details__user-rating-label" for="rating-1">1</label>
            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="2" id="rating-2" ${this._userDetails.personalRating === 2 && ` checked`}>
            <label class="film-details__user-rating-label" for="rating-2">2</label>
            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="3" id="rating-3" ${this._userDetails.personalRating === 3 && ` checked`}>
            <label class="film-details__user-rating-label" for="rating-3">3</label>
            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="4" id="rating-4" ${this._userDetails.personalRating === 4 && ` checked`}>
            <label class="film-details__user-rating-label" for="rating-4">4</label>
            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="5" id="rating-5" ${this._userDetails.personalRating === 5 && ` checked`}>
            <label class="film-details__user-rating-label" for="rating-5">5</label>
            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="6" id="rating-6" ${this._userDetails.personalRating === 6 && ` checked`}>
            <label class="film-details__user-rating-label" for="rating-6">6</label>
            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="7" id="rating-7" ${this._userDetails.personalRating === 7 && ` checked`}>
            <label class="film-details__user-rating-label" for="rating-7">7</label>
            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="8" id="rating-8" ${this._userDetails.personalRating === 8 && ` checked`}>
            <label class="film-details__user-rating-label" for="rating-8">8</label>
            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="9" id="rating-9" ${this._userDetails.personalRating === 9 && ` checked`}>
            <label class="film-details__user-rating-label" for="rating-9">9</label>`;
  }

  _refreshUresRatingScore() {
    const userRatingScoreElement = this.element.querySelector(`.film-details__user-rating-score`);
    userRatingScoreElement.innerHTML = this._getUserRatingScoreHTML();
    this._element.querySelector(`.film-details__user-rating`).textContent = `Your rate ${this._userDetails.personalRating}`;
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
                        <p class="film-details__user-rating">Your rate ${this._userDetails.personalRating}</p>
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
                          <td class="film-details__cell">${moment(this._dateRelease).format(`DD MMMM YYYY`)} (${this._country})</td>
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
                  ${this._getDetailsControlsHTML()}
                </section>
                  
                <section class="film-details__comments-wrap">
                  <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._comments.length}</span></h3>
            
                  <ul class="film-details__comments-list">
                    ${this._getCommentsHTML()}
                  </ul>
            
                  <div class="film-details__new-comment">
                    <div>
                      <label for="add-emoji" class="film-details__add-emoji-label">😐</label>
                      <input type="checkbox" class="film-details__add-emoji visually-hidden" id="add-emoji" value="neutral-face">
            
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
                  <div class="film-details__user-rating-controls  ${!this._isLastCommentUpdated() ? `visually-hidden` : ``} ">
                    <span class="film-details__watched-status film-details__watched-status--active">${this._getWatchedStatus(this._userDetails)}</span>
                    <button class="film-details__watched-reset" type="button">undo</button>
                  </div>
            
                  <div class="film-details__user-score">
                    <div class="film-details__user-rating-poster">
                      <img src="./${this._poster}" alt="film-poster" class="film-details__user-rating-img">
                    </div>
            
                    <section class="film-details__user-rating-inner">
                      <h3 class="film-details__user-rating-title">${this._title}</h3>
            
                      <p class="film-details__user-rating-feelings">How you feel it?</p>

                      <div class="film-details__user-rating-score">
                        ${this._getUserRatingScoreHTML()}
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
    document.addEventListener(`keydown`, this._onEscPress);
    this._element.querySelector(`.film-details__emoji-list`)
      .addEventListener(`click`, this._onEmojiClick);
    this._element.querySelector(`.film-details__comment-input`)
      .addEventListener(`keydown`, this._onAddComments);
    this._element.querySelector(`.film-details__user-rating-score`)
      .addEventListener(`click`, this._onChangeUserRating);
    this._element.querySelector(`.film-details__watched-reset`)
      .addEventListener(`click`, this._onDeleteLastCommentClick);
    this._element.querySelector(`.film-details__controls`)
      .addEventListener(`click`, this._onControlsClick);
  }

  unbind() {
    this._element.querySelector(`.film-details__close-btn`)
      .removeEventListener(`click`, this._onCloseButtonClick);
    document.removeEventListener(`keydown`, this._onEscPress);
    this._element.querySelector(`.film-details__emoji-list`)
      .removeEventListener(`click`, this._onEmojiClick);
    this._element.querySelector(`.film-details__comment-input`)
      .removeEventListener(`keydown`, this._onAddComments);
    this._element.querySelector(`.film-details__user-rating-score`)
      .removeEventListener(`click`, this._onChangeUserRating);
    this._element.querySelector(`.film-details__watched-reset`)
      .removeEventListener(`click`, this._onDeleteLastCommentClick);
    this._element.querySelector(`.film-details__controls`)
      .removeEventListener(`click`, this._onControlsClick);
  }

  refresh(param = null) {
    if (this._element) {
      if ((param.isAddComment || param.isDeleteComment) && !param.isError) {
        this._refreshComments();
      } else if (param.isChangeRating) {
        this._refreshUresRatingScore();
      } else if (param.isChangeStatistic) {
        this._refreshDetailsControls();
      }
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
