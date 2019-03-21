import {getHTMLFromData} from './utils';
import Component from './component';

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
    this._onClose = null;
    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
    this._onAddComments = this._onAddComments.bind(this);
    this._onAddUserRating = this._onAddUserRating.bind(this);
    this._onEmojiClick = this._onEmojiClick.bind(this);
  }

  _processForm(formData) {
    const entry = {
      title: ``,
      poster: ``,
      description: ``,
      year: ``,
      duration: ``,
      genre: [],
      comments: [],
      rating: ``,
    };

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
      /*      title: (value) => {
              target.title = value;
              return target.title;
            },
            poster: (value) => {
              target.poster = value;
              return target.poster;
            },*/

      comment: (value) => target.comments.push(value),

      /*rating: (value) => {
        target.repeatingDays[value] = true;
        return target.repeatingDays[value];
      },*/

    };
  }


  _onCloseButtonClick() {
    return typeof this._onClose === `function` && this._onClose();
  }

  set onClose(fn) {
    this._onClose = fn;
  }

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
        this._refreshComments();
      }
    }
  }

  _onAddUserRating() {
    console.log(`addUserRating`);
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
                    <span class="film-details__comment-day">3 days ago</span>
                  </p>
                </div>
             </li>`;
  }

  _getCommentsHTML() {
    return getHTMLFromData(Array.from(this._comments), this._getCommentHTML);
  }

  _refreshComments() {
    const parentElement = this._element.querySelector(`film-details__comments-list`);
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
                        <p class="film-details__user-rating">Your rate 8</p>
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
                        <td class="film-details__cell">15 June 2018 (USA)</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Runtime</td>
                        <td class="film-details__cell">118 min</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Country</td>
                        <td class="film-details__cell">USA</td>
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
                  <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist">
                  <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>
            
                  <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" checked>
                  <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>
            
                  <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite">
                  <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
                </section>
            
                <section class="film-details__comments-wrap">
                  <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">1</span></h3>
            
                  <ul class="film-details__comments-list">
                    ${this._getCommentsHTML}
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
                        <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="1" id="rating-1">
                        <label class="film-details__user-rating-label" for="rating-1">1</label>
            
                        <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="2" id="rating-2">
                        <label class="film-details__user-rating-label" for="rating-2">2</label>
            
                        <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="3" id="rating-3">
                        <label class="film-details__user-rating-label" for="rating-3">3</label>
            
                        <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="4" id="rating-4">
                        <label class="film-details__user-rating-label" for="rating-4">4</label>
            
                        <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="5" id="rating-5" checked>
                        <label class="film-details__user-rating-label" for="rating-5">5</label>
            
                        <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="6" id="rating-6">
                        <label class="film-details__user-rating-label" for="rating-6">6</label>
            
                        <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="7" id="rating-7">
                        <label class="film-details__user-rating-label" for="rating-7">7</label>
            
                        <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="8" id="rating-8">
                        <label class="film-details__user-rating-label" for="rating-8">8</label>
            
                        <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="9" id="rating-9">
                        <label class="film-details__user-rating-label" for="rating-9">9</label>
            
                      </div>
                    </section>
                  </div>
                </section>
              </form>
            </section>`;
  }

  refresh() {
    this.unbind();
    this._partialUpdate();
    this.bind();
  }

  _partialUpdate() {
    this._element.innerHTML = this.template;
  }


  bind() {
    this._element.querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, this._onCloseButtonClick);

    this._element.querySelector(`.film-details__emoji-list`)
      .addEventListener(`click`, this._onEmojiClick);

    this._element.querySelector(`.film-details__comment-input`)
      .addEventListener(`keydown`, this._onAddComments);
  }

  unbind() {
    this._element.querySelector(`.film-details__close-btn`)
      .removeEventListener(`click`, this._onCloseButtonClick);

    this._element.querySelector(`.film-details__emoji-list`)
      .removeEventListener(`click`, this._onEmojiClick);

    this._element.querySelector(`.film-details__comment-input`)
      .removeEventListener(`keydown`, this._onAddComments);
  }

  update(data) {
    this._title = data.title;
    this._poster = data.poster;
    this._description = data.description;
    this._year = data.year;
    this._duration = data.duration;
    this._genre = data.genre;
    this._comments = data.comments;
    this._rating = data.rating;
  }
}
