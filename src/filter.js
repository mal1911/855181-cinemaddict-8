import Component from './component';

export default class extends Component {
  constructor(title, isActive = false) {
    super();
    this._title = title;
    this._isActive = isActive;
    this._count = 0;

    this._onClick = null;
    this._onMenuClick = this._onMenuClick.bind(this);
  }

  set onClick(fn) {
    this._onClick = fn;
  }

  _onMenuClick() {
    document.querySelector(`.main-navigation__item--active`).classList.remove(`main-navigation__item--active`);
    this._element.classList.add(`main-navigation__item--active`);
    if (typeof this._onClick === `function`) {
      this._onClick();
    }
  }

  get template() {
    return `<a href="#${this._title.toLowerCase()}" class="main-navigation__item ${this._isActive ? ` main-navigation__item--active` : ``}">
              ${this._title} <span class="main-navigation__item-count"></span> 
            </a>`;
  }

  refresh() {
    this.unbind();
    this._partialUpdate();
    this.bind();
  }

  _partialUpdate() {
    this._element.innerHTML = this.createElement(this.template).innerHTML;
  }

  bind() {
    this._element.addEventListener(`click`, this._onMenuClick);
  }

  unbind() {
    this._element.removeEventListener(`click`, this._onMenuClick);
  }
}
