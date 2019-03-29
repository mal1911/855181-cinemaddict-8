import {getRamdomStringOfArray, getRandomArray, getRandomBool, getRandomElementOfArray, getRandomInt} from "./utils";

export default class FilmModel {
  constructor(data) {
    console.log(data);

    this.id = data.id;
    this.filimInfo.title = data.film_info.title;
    this.filimInfo.alternativeTitle = data.film_info.alternative_title;
    this.filimInfo.totalRating = data.film_info.total_rating;
    this.filimInfo.title = data.film_info.title;
    this.filimInfo.poster = data.film_info.poster;
    this.filimInfo.ageRating = data.film_info.age_rating;
    this.filimInfo.director = data.film_info.director;
    this.filimInfo.writers = data.film_info.writers;
    this.filimInfo.actors = data.film_info.actors;
    this.filimInfo.release.date = new Date(data.film_info.release.date);
    this.filimInfo.release.releaseCountry = data.film_info.release.release_country;
    this.filimInfo.runtime = data.film_info.runtime;
    this.filimInfo.genre = data.film_info.genre;
    this.filimInfo.description = data.film_info.description;
    this.userDetails.personalRating = data.user_details.personal_rating;
    this.userDetails.watchlist = data.user_details.watchlist;
    this.userDetails.watchlist = data.user_details.watchlist;
    this.userDetails.alreadyWatched = data.user_details.already_watched;


    /*

    Object { id: "13", film_info: {…}, user_details: {…}, comments: (3) […] } film-model.js:5
    {
      "id": "12",
      "film_info": {
        "title": "A Shark Who Stole Themselves",
        "alternative_title": "A Little Pony Within Him",
        "total_rating": 7.1,
        "poster": "images/posters/three-friends.jpg",
        "age_rating": 21,
        "director": "Brad Bird",
        "writers": [
          "Stephen Spielberg",
          "Takeshi Kitano",
          "Hayao Miazaki"
        ],
        "actors": [
          "Morgan Freeman ",
          "Brad Pitt",
          "Harrison Ford",
          "Ralph Fiennes"
        ],
        "release": {
          "date": 1159603965635,
          "release_country": "Finland"
        },
        "runtime": 204,
        "genre": [
          "Animation",
          "Sci-Fi"
        ],
        "description": "Oscar-winning film, a war drama about two young people, from the creators of timeless classic \"Nu, Pogodi!\" and \"Alice in Wonderland\", a film about a journey that heroes are about to make in finding themselves, with the best fight scenes since Bruce Lee."
      },
      "user_details": {
        "personal_rating": 9.8,
        "watchlist": true,
        "already_watched": false,
        "favorite": false
      },
      "comments": [
        {
          "author": "Ilya O'Caml",
          "emotion": "grinning",
          "comment": "such a boring piece of..., I fell asleep at the minute two of the film... but later I've woken up... film has nothing to do with it I just felt tired... actually, film is okay... ish, my friend and I went to watch this movie and never made it there so we didn't like it at all.",
          "date": 1552263647624
        },
        {
          "author": "Ilya Ivanov",
          "emotion": "neutral-face",
          "comment": "a film that changed my life, such a boring piece of..., love camera work, have you noticed the director's cameo.",
          "date": 1552405763375
        },
        {
          "author": "Dakota Ivanov",
          "emotion": "sleeping",
          "comment": "I fell asleep at the minute two of the film... but later I've woken up... film has nothing to do with it I just felt tired... actually, film is okay... ish, post-credit scene was just amazing omg.",
          "date": 1553152442691
        }
      ]
    }

        title: getRamdomStringOfArray(3, titlesArr),
          poster: getRandomElementOfArray(postersArr),
          description: getRamdomStringOfArray(getRandomInt(1, 3), descriptionArr),
          year: getRandomInt(1950, 2019),
          duration: getRandomInt(1, 360),
          genre: getRandomArray(genresArr, getRandomInt(1, genresArr.length)),
          comments: commentsArr.slice(),
          rating: getRandomInt(0, 1000) / 100,
          userRating: getRandomInt(1, 9),
          releaseDate: new Date(),
          country: getRandomElementOfArray(countryArr),
          isAddWatchlist: getRandomBool(),
          isMarkWatchlist: getRandomBool(),
          isAddFavorite: getRandomBool(),


        this.id = data[`id`];
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
      /*'title': this.title,
      'due_date': this.dueDate,
      'tags': [...this.tags.values()],
      'picture': this.picture,
      'repeating_days': this.repeatingDays,
      'color': this.color,
      'is_favorite': this.isFavorite,
      'is_done': this.isDone,*/
    }
  }

  static parseFilm(data) {
    return new FilmModel(data);
  }

  static parseFilms(data) {
    return data.map(FilmModel.parseFilm);
  }
};
