import App from './app';

const AUTHORIZATION = `Basic eo0w590ik29889a=12345`;
const END_POINT = `https://es8-demo-srv.appspot.com/moowle/`;
const FILMS_STORE_KEY = `films-store-key`;

const app = new App(AUTHORIZATION, END_POINT, FILMS_STORE_KEY);
app.run();
