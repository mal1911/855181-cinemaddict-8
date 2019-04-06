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
    switch (this._filtersComponent.currFilter) {
      case `Watchlist`:
        return obj.userDetails.watchlist;
      case `History`:
        return obj.userDetails.alreadyWatched;
      case `Favorites`:
        return obj.userDetails.favorite;
    }
    return true;
  }

  _updateData(data, newObj) {
    const updatedObj = data.find((it) => it.id === newObj.id);
    updatedObj.userDetails = newObj.userDetails;
    updatedObj.comments = newObj.comments;
    return updatedObj;
  }

  _deleteData(data, deletedObj) {
    data.splice(data.indexOf(deletedObj));
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

          const newObj = Object.assign(filmObj);
          newObj.userDetails = obj;
          filmComponent.block();
          this._provider.updateFilm({id: newObj.id, data: newObj.toRAW()})
            .then((newObj1) => {
              filmObj = newObj1;
              this._updateData(this._data, filmObj);
              filmPopupComponent.changeUserDetails(newObj1.userDetails);
              if (!this._isVisibleFilm(filmObj)) {
                this._deleteData(filteredData, filmObj);
                filmComponent.unrender();
              }
              if (typeof this._onUpdateSuccess === `function`) {
                this._onUpdateSuccess(filmObj);
              }
            }).catch((err) => {
              if (typeof this._onUpdateError === `function`) {
                this._onUpdateError(err);
              }
            });
          filmComponent.unblock();
        };
        filmPopupComponent.onSave = (obj) => {
          const formPopupElement = document.querySelector(`.film-details__inner`);
          if (formPopupElement.classList.contains(`shake`)) {
            formPopupElement.classList.remove(`shake`);
          }
          filmPopupComponent.block();

          const newObj = Object.assign(filmObj);
          newObj.userDetails = obj.userDetails;
          newObj.comments = obj.comments;

          this._provider.updateFilm({id: newObj.id, data: newObj.toRAW()})
            .then((newObj1) => {
              filmObj = newObj1;
              this._updateData(this._data, filmObj);
              if (this._isVisibleFilm(filmObj)) {
                filmComponent.update(filmObj);
                filmComponent.refresh();
              } else {
                this._deleteData(filteredData, filmObj);
                filmComponent.unrender();
              }
              filmPopupComponent.unrender();
              if (typeof this._onUpdateSuccess === `function`) {
                this._onUpdateSuccess(filmObj);
              }
            }).catch(() => formPopupElement.classList.add(`shake`));

          filmPopupComponent.unblock();
        };
        fragment.appendChild(filmComponent.render());
      }
    });
    this._parentElement.appendChild(fragment);
  }
}
