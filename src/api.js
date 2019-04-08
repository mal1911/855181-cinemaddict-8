import {HTML_STATUS} from "./constants";
import FilmModel from "./film-model";


const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`,
};

const checkStatus = (response) => {
  if (response.status >= HTML_STATUS.OK && response.status < HTML_STATUS.MULTIPLE_CHOICES) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const toJSON = (response) => {
  return response.json();
};

export default class API {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  syncFilms({films}) {
    return this._load({
      url: `movies/sync`,
      method: `POST`,
      body: JSON.stringify(films),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON);
  }


  getFilms() {
    return this._load({url: `movies`})
      .then(toJSON)
      .then(FilmModel.parseFilms);
  }

  createFilm({film}) {
    return this._load({
      url: `movies`,
      method: Method.POST,
      body: JSON.stringify(film),
      headers: new Headers({'Content-Type': `application/json`}),
    })
      .then(toJSON)
      .then(FilmModel.parseFilm)
      .catch((err) => {
        throw err;
      });
  }

  updateFilm({id, data}) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`}),
    })
      .then(toJSON)
      .then(FilmModel.parseFilm)
      .catch((err) => {
        throw err;
      });
  }

  deleteFilm({id}) {
    return this._load({url: `movies/${id}`, method: Method.DELETE});
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
