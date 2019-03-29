import {getRamdomStringOfArray, getRandomArray, getRandomBool, getRandomElementOfArray, getRandomInt} from "./utils";

const titlesArr = `Обратите внимание Чтобы понять, что должно оказаться в данных, а что нет,
задайте себе вопрос: «Есть ли смысл скачивать эту информацию с сервера отдельно, 
может ли она измениться?». Не стоит заводить в данных структуру, которая описывает 
размеры логотипа или статический текст, в структурах должны храниться только те 
данные, которыми мы будем оперировать в проекте: получать их с сервера отдельно, 
изменять, отправлять на сервер`.split(` `);

const postersArr = [`three-friends.jpg`,
  `moonrise.jpg`,
  `fuga-da-new-york.jpg`,
  `blue-blazes.jpg`,
  `blackmail.jpg`,
  `accused.jpg`,
];

const descriptionArr = ` Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet 
varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum
pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed 
finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh 
vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex 
euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit 
in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. 
In rutrum ac purus sit amet tempus.`.split(`.`).map((obj) => obj + `.`);

const genresArr = [
  `Comedy`,
  `Melodrama`,
  `Thriller`,
  `Fantasy`,
];

const countryArr = [
  `USA`,
  `Russia`,
];

const commentsArr = [
  {
    emoji: `😀`,
    text: `So long-long story, boring!`,
    author: `Tim Macoveev`,
    date: new Date(),
  },
];

export default () => (
  {
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
  }
)
;

