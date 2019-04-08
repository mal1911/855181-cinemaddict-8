export default class Component {
  constructor() {
    if (new.target === Component) {
      throw new Error(`Can't instantiate BaseComponent, only concrete one.`);
    }

    this._element = null;
  }

  get element() {
    return this._element;
  }

  get template() {
    throw new Error(`You have to define template.`);
  }

  render() {
    this._element = this.createElement(this.template);
    this.bind();
    return this._element;
  }

  bind() {
  }

  unbind() {
  }

  unrender() {
    this.unbind();
    this._element.remove();
    this._element = null;
  }

  createElement(template) {
    const newElement = document.createElement(`div`);
    newElement.innerHTML = template;
    return newElement.firstChild;
  }

  _getHTMLFromData(arrArg, getElementHTML) {
    return arrArg.map((obj) => getElementHTML(obj)).join(``);
  }
}
