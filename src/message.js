import {ESC_KEYCODE} from "./constants";
import Component from './component';

export default class extends Component {
  constructor(text, param) {
    super();
    this._text = text;
    this._param = param;
    this._close = this._close.bind(this);
    this._onEscPress = this._onEscPress.bind(this);
  }

  _getClassMessage() {
    if (this._param.isLoad) {
      return `popup-message--load`;
    }
    if (this._param.isError) {
      return `popup-message--error`;
    }
    return ``;
  }

  get template() {
    return `<section class="popup-message ${this._getClassMessage()}">
    <p>${this._text}</p>
  </section>`;
  }

  bind() {
    //this._element.addEventListener(`click`, this._close);
    document.addEventListener(`click`, this._close);
    document.addEventListener(`keydown`, this._onEscPress);
  }

  unbind() {
    //this._element.removeEventListener(`click`, this._close);
    document.removeEventListener(`click`, this._close);
    document.removeEventListener(`keydown`, this._onEscPress);
  }

  _onEscPress(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      console.log(evt.target);
      evt.preventDefault();
      this.unrender();
    }
  }

  _close() {
    this.unrender();
  }
}
