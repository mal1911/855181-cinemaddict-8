const getControlsHTML = () =>
  `<form class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist"><!--Add to watchlist--> WL</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched"><!--Mark as watched-->WTCHD</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite"><!--Mark as favorite-->FAV</button>
    </form>`;

const isControls = (param) => {
  if (param !== null) {
    if (param.isControls) {
      return true;
    }
  }
  return false;
};

export default (objArg, param = null) =>
  `<article class="film-card ${isControls(param) ? `` : `film-card--no-controls`}">
    <h3 class="film-card__title">${objArg.title}</h3>
    <p class="film-card__rating">${objArg.rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${objArg.year}</span>
      <span class="film-card__duration">${objArg.duration}</span>
      <span class="film-card__genre">${objArg.genre}</span>
    </p>
    <img src="./images/posters/${objArg.poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${objArg.description}</p>
    <button class="film-card__comments">${objArg.comments} comments</button>
    ${isControls(param) ? getControlsHTML() : ``}
  </article>`;
