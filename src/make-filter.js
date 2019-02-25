export default (title, count = false, isActive = false) =>
  `<a href="#${title.toLowerCase()}" class="main-navigation__item ${isActive ? `main-navigation__item--active` : ``}">
    ${title}
    ${count ? `<span class="main-navigation__item-count">${count}</span>` : ``}
  </a>`;

