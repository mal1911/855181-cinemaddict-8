import FilmModel from "./film-model";

const objectToArray = (object) => {
  return Object.keys(object).map((id) => object[id]);
};

export default class Provider {
  constructor({api, store}) {
    this._api = api;
    this._store = store;
    this._needSync = false;
  }

  updateFilm({id, data}) {
    if (this._isOnline()) {
      return this._api.updateFilm({id, data})
        .then((film) => {
          this._store.setItem({key: film.id, item: film.toRAW()});
          return film;
        });
    } else {
      const film = data;
      this._needSync = true;
      this._store.setItem({key: film.id, item: film});
      return Promise.resolve(FilmModel.parseFilm(film));
    }
  }

  getFilms() {
    if (this._isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          films.map((it) => this._store.setItem({key: it.id, item: it.toRAW()}));
          return films;
        });
    } else {
      const rawFilmsMap = this._store.getAll();
      const rawFilms = objectToArray(rawFilmsMap);
      const films = FilmModel.parseFilms(rawFilms);
      return Promise.resolve(films);
    }
  }

  syncFilms() {
    return this._api.syncFilms({films: objectToArray(this._store.getAll())});
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}
