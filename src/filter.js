import Component from './component';

export default class extends Component {
  constructor(title, isActive = false) {
    super();
    this._title = title;
    this._isActive = isActive;
    this._count = 0;

    this._onFilterClick = null;
    this._onClick = this._onClick.bind(this);
  }

  set onFilterClick(fn) {
    this._onFilterClick = fn;
  }

  _onClick(evt) {
    evt.preventDefault();
    document.querySelector(`.main-navigation__item--active`).classList.remove(`main-navigation__item--active`);
    this._element.classList.add(`main-navigation__item--active`);
    let title = this._element.textContent.trim();
    const i = title.indexOf(` `);
    if (i !== -1) {
      title = title.substring(0, i);
    }
    if (typeof this._onFilterClick === `function`) {
      this._onFilterClick(title);
    }
  }

  get template() {
    return `<a href="#${this._title.toLowerCase()}" class="main-navigation__item ${this._isActive ? ` main-navigation__item--active` : ``}">
              ${this._title} ${this._title !== `All` ? `<span class="main-navigation__item-count"></span>` : ``} 
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
    this._element.addEventListener(`click`, this._onClick);
  }

  unbind() {
    this._element.removeEventListener(`click`, this._onClick);
  }
}
