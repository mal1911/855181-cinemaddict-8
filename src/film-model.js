export default class FilmModel {
  constructor(data) {
    console.log(data);

    this.id = data.id;
    this.filimInfo = {
      title: data.film_info.title,
      alternativeTitle: data.film_info.alternative_title,
      totalRating: data.film_info.total_rating,
      poster: data.film_info.poster,
      ageRating: data.film_info.age_rating,
      director: data.film_info.director,
      writers: data.film_info.writers.slice(),
      actors: data.film_info.actors.slice(),
      release: {
        date: new Date(data.film_info.release.date),
        releaseCountry: data.film_info.release.release_country,
      },
      runtime: data.film_info.runtime,
      genre: data.film_info.genre.slice(),
      description: data.film_info.description,
    };
    this.userDetails = {
      personalRating: data.user_details.personal_rating,
      watchlist: data.user_details.watchlist,
      alreadyWatched: data.user_details.already_watched,
      favorite: data.user_details.favorite,
    };
    this.comments = data.comments.map((obj) => {
      obj.date = new Date(obj.date);
      return obj;
    });
    /*console.log(this.filimInfo);
    console.log(this.userDetails);
    console.log(this.comments);*/


    /*  this.id = data[`id`];
      this.title = data[`title`] || ``;
      this.dueDate = new Date(data[`due_date`]);
      this.tags = new Set(data[`tags`] || []);
      this.picture = data[`picture`] || ``;
      this.repeatingDays = data[`repeating_days`];
      this.color = data[`color`];
      this.isFavorite = Boolean(data[`is_favorite`]);
      this.isDone = Boolean(data[`is_done`]);*/
  }

  toRAW() {
    return {
      'id': this.id,
      'filim_info': {
        'title': this.filimInfo.title,
        'alternative_title': this.filimInfo.alternativeTitle,
        'total_rating': this.filimInfo.totalRating,
        'poster': this.filimInfo.poster,
        'age_rating': this.filimInfo.ageRating,
        'director': this.filimInfo.director,
        'writers': this.filimInfo.writers.slice(),
        'actors': this.filimInfo.actors.slice(),
        'release': {
          'date': this.filimInfo.release.date,
          'release_country': this.filimInfo.release.releaseCountry,
        },
        'runtime': this.filimInfo.runtime,
        'genre': this.filimInfo.genre.slice(),
        'description': this.filimInfo.description,
      },
      'user_details': {
        'personal_rating': this.userDetails.personalRating,
        'watchlist': this.userDetails.watchlist,
        'already_watched': this.userDetails.alreadyWatched,
        'favorite': this.userDetails.favorite,
      },
      'comments': this.comments.slice(),
    };

    /*'title': this.title,
    'due_date': this.dueDate,
    'tags': [...this.tags.values()],
    'picture': this.picture,
    'repeating_days': this.repeatingDays,
    'color': this.color,
    'is_favorite': this.isFavorite,
    'is_done': this.isDone,*/

  }

  static parseFilm(data) {
    return new FilmModel(data);
  }

  static parseFilms(data) {
    return data.map(FilmModel.parseFilm);
  }
}
