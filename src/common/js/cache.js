import storage from 'good-storage';

const SEARCH_KEY = '__search__';
const MAX_SEARCH = 15;

export function saveSearch (query) {
  let list = storage.get(SEARCH_KEY, []);
  let sIndex = list.findIndex((item) => {
    return item === query;
  });

  console.log('sIndex=' + sIndex);
  // 当前搜索在历史中是第一位，则什么都不做
  if (sIndex === 0) {
    list = list.slice();
  } else {
    list.unshift(query);
    if (sIndex > 0) {
      list.splice(sIndex + 1, 1);
    }
  }
  if (list.length > MAX_SEARCH) {
    list.pop();
  }
  storage.set(SEARCH_KEY, list);
  return list;
};

export function loadSearch () {
  return storage.get(SEARCH_KEY, []);
};

export function deleteOne (item) {
  let list = storage.get(SEARCH_KEY, []);
  let index = list.findIndex((elem) => {
    return elem === item;
  });
  list.splice(index, 1);
  storage.set(SEARCH_KEY, list);
  return list;
};

export function clearAll () {
  storage.set(SEARCH_KEY, []);
  return [];
};
