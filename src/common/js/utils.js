function getRandom (m, n) {
  return Math.floor(Math.random() * Math.abs(m - n + 1) + Math.min(m, n));
}

export function getRandomArray (arr) {
  let _arr = arr.slice();
  for (let i = 0; i < arr.length; i++) {
    let j = getRandom(0, i);
    let tmp = _arr[i];
    _arr[i] = _arr[j];
    _arr[j] = tmp;
  }
  return _arr;
};

export function debounce (func, delay) {
  let timer;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};
