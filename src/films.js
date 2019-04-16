import Film from "./film";
import FilmPopup from "./film-popup";

export default class Films {
  constructor(provider, data, parentElement, param) {
    this._data = data;
    this._provider = provider;
    this._parentElement = parentElement;
    this._param = param;
    this._onUpdateSuccess = null;
    this._onUpdateError = null;
  }

  set filtersComponent(component) {
    this._filtersComponent = component;
  }

  set onUpdateSuccess(fn) {
    this._onUpdateSuccess = fn;
  }

  set onUpdateError(fn) {
    this._onUpdateError = fn;
  }

  _isVisibleFilm(obj) {
    return {
      [`All`]: true,
      [`Watchlist`]: obj.userDetails.watchlist,
      [`History`]: obj.userDetails.alreadyWatched,
      [`Favorites`]: obj.userDetails.favorite,
    }[this._filtersComponent.currFilter];
  }

  _updateData(data, newObj) {
    const updatedObj = data.find((it) => it.id === newObj.id);
    if (updatedObj) {
      updatedObj.userDetails = newObj.userDetails;
      updatedObj.comments = newObj.comments;
    }
    return updatedObj;
  }

  _deleteData(data, id) {
    const deletedObj = data.find((it) => it.id === id);
    if (deletedObj) {
      data.splice(data.indexOf(deletedObj));
    }
  }

  render(filteredData, filmCount = null) {
    const bodyElement = document.querySelector(`body`);
    const fragment = document.createDocumentFragment();
    this._parentElement.innerHTML = ``;

    if (!filmCount) {
      filmCount = filteredData.length;
    }

    filteredData.forEach((filmObj, i) => {
      if (i < filmCount) {
        const filmComponent = new Film(filmObj, this._param);
        const filmPopupComponent = new FilmPopup(filmObj);

        filmComponent.onEdit = () => {
          filmPopupComponent.render();
          bodyElement.append(filmPopupComponent.element);
        };

        filmComponent.onChangeStatus = (obj) => {
          filmComponent.block();
          filmPopupComponent.save(obj, null, {isFilmStatistics: true});
          filmComponent.unblock();
        };

        filmPopupComponent.onClose = () => {
          filmPopupComponent.unrender();
        };

        filmPopupComponent.onSave = (obj, param) => {
          const formPopupElement = document.querySelector(`.film-details__inner`);
          if (formPopupElement && formPopupElement.classList.contains(`shake`)) {
            formPopupElement.classList.remove(`shake`);
          }
          filmPopupComponent.block();

          const oldUserDetailsObj = Object.assign({}, filmObj.userDetails);
          const oldCommentsObj = filmObj.comments.slice();

          filmObj.userDetails = obj.userDetails;
          filmObj.comments = obj.comments;

          this._provider.updateFilm({id: filmObj.id, data: filmObj.toRAW()})
            .then((newObj) => {
              filmObj = newObj;
              filmPopupComponent.update(filmObj);
              if (param.isFilmStatistics || param.isPopupClose) {
                this._updateData(this._data, filmObj);
                if (this._isVisibleFilm(filmObj)) {
                  filmComponent.update(filmObj);
                  filmComponent.refresh();
                } else {
                  this._deleteData(filteredData, filmObj.id);
                  filmComponent.unrender();
                }
              }
              if (typeof this._onUpdateSuccess === `function`) {
                this._onUpdateSuccess(filmObj);
              }
            }).catch((err) => {
              filmObj.userDetails = oldUserDetailsObj;
              filmObj.comments = oldCommentsObj;
              param.isError = true;

              if (formPopupElement) {
                formPopupElement.classList.add(`shake`);
              } else {
                if (typeof this._onUpdateError === `function`) {
                  this._onUpdateError(err);
                }
              }
            }).finally(() => {
              filmPopupComponent.refresh(param);
              filmPopupComponent.unblock();
            });
        };
        fragment.appendChild(filmComponent.render());
      }
    });
    this._parentElement.appendChild(fragment);
  }
}
