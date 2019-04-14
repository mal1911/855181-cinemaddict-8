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

  _deleteData(data, deletedObj) {
    const index = data.indexOf(deletedObj);
    if (index !== -1) {
      data.splice(index);
    }
  }

  _updateObj(data, filteredData, newObj, filmComponent) {
    this._updateData(data, newObj);
    if (this._isVisibleFilm(newObj)) {
      filmComponent.update(newObj);
      filmComponent.refresh();
    } else {
      this._deleteData(filteredData, newObj);
      filmComponent.unrender();
    }
    return newObj;
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
          filmPopupComponent.save(obj);

          /*
          const newObj = Object.assign(filmObj);
          newObj.userDetails = obj;
          this._provider.updateFilm({id: newObj.id, data: newObj.toRAW()})
            .then((newObj1) => {
              filmObj = updateObj(newObj1, filmComponent);

              //save
              //filmPopupComponent.changeUserDetails(filmObj.userDetails);





              if (typeof this._onUpdateSuccess === `function`) {
                this._onUpdateSuccess(filmObj);
              }
            }).catch((err) => {
              if (typeof this._onUpdateError === `function`) {
                this._onUpdateError(err);
              }
            });

          */
          filmComponent.unblock();
        };

        filmPopupComponent.onClose = (newObj) => {
          //console.log(newObj);
          filmPopupComponent.unrender();
          //updateObj(newObj, filmComponent);
        };

        filmPopupComponent.onSave = (obj) => {
          const formPopupElement = document.querySelector(`.film-details__inner`);
          if (formPopupElement && formPopupElement.classList.contains(`shake`)) {
            formPopupElement.classList.remove(`shake`);
          }
          filmPopupComponent.block();
          const newObj = Object.assign(filmObj);
          newObj.userDetails = obj.userDetails;
          newObj.comments = obj.comments;

          this._provider.updateFilm({id: newObj.id, data: newObj.toRAW()})
            .then((newObj1) => {
              filmObj = this._updateObj(this._data, filteredData, newObj1, filmComponent);

//              filmPopupComponent.unrender();
              if (typeof this._onUpdateSuccess === `function`) {
                this._onUpdateSuccess(filmObj);
              }
            }).catch((err) => {
            if (formPopupElement) {
              formPopupElement.classList.add(`shake`);
            } else {
              if (typeof this._onUpdateError === `function`) {
                this._onUpdateError(err);
              }
            }
          });

          filmPopupComponent.unblock();
        };
        fragment.appendChild(filmComponent.render());
      }
    });
    this._parentElement.appendChild(fragment);
  }
}
