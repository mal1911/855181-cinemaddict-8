export const getMixArray = (arr) =>
  arr.slice().sort(() => 0.5 - Math.random());

export const getClipArray = (arr, count) => {
  return arr.slice(0, count);
};

export const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (1 + max - min)) + min;

export const getRandomBool = () =>
  getRandomInt(0, 1) === 1;

export const getRandomArray = (arr, count) =>
  getClipArray(getMixArray(arr), count);

export const getRandomElementOfArray = (arrArg) => (arrArg[getRandomInt(0, arrArg.length - 1)]);

export const getRamdomStringOfArray = (count, arrArg) => {
  const arrOut = [];
  for (let i = 0; i < count; i++) {
    arrOut.push(getRandomElementOfArray(arrArg));
  }
  return arrOut.join(` `);
};

export const getDataFromObj = (count, getObj) => {
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push(getObj());
  }
  return arr;
};

export const getHTMLFromData = (arrArg, getElementHTML, param = null) =>
  arrArg.map((obj) => getElementHTML(obj, param)).join(``);

export const removeChildElements = (parentElement) => {
  parentElement.innerHTML = ``;
};

