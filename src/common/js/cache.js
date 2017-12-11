import storage from 'good-storage';

const SEARCH_KEY = '__search__';
const MAX_SEARCH = 15;

const PLAY_KEY = '__play__';
const MAX_PLAY = 100;

const FAV_KEY = '__fav__';
const MAX_FAV = 200;

const insertArray = function (list, val, compare, maxLen) {
  console.log('list in insertArray');
  console.log(list);
  let index = list.findIndex(compare);
  console.log(index);
  if (index === 0) {
    return;
  }
  if (index > 0) {
    list.splice(index, 1);
  }
  list.unshift(val);
  if (list.length > MAX_SEARCH) {
    list.pop();
  }
  console.log(list);
  return list;
};

export function saveSearch (query) {
  console.log('savesearch');
  let list = storage.get(SEARCH_KEY, []);

  list = insertArray(list, query, (item) => {
    return item === query;
  }, MAX_SEARCH);
  storage.set(SEARCH_KEY, list);
  return list;
};

export function loadSearch () {
  return storage.get(SEARCH_KEY, []);
};

// 删除一项搜索历史
export function deleteOne (item) {
  let list = storage.get(SEARCH_KEY, []);
  let index = list.findIndex((elem) => {
    return elem === item;
  });
  list.splice(index, 1);
  storage.set(SEARCH_KEY, list);
  return list;
};

// 清除搜索历史
export function clearAll () {
  storage.set(SEARCH_KEY, []);
  return [];
};

// 处理最近播放
export function loadPlay () {
  return storage.get(PLAY_KEY, []);
};

export function addPlay (song) {
  console.log('addplay');
  let latest = storage.get(PLAY_KEY, []);
  console.log('latest');
  console.log(latest);
  latest = insertArray(latest, song, (item) => {
    return item.id === song.id;
  }, MAX_PLAY);
  console.log(latest);
  storage.set(PLAY_KEY, latest);
  return latest;
};

// 对收藏列表的操作
export function loadFav () {
  return storage.get(FAV_KEY, []);
};

export function addFav (song) {
  let favList = storage.get(FAV_KEY, []);

  favList = insertArray(favList, song, (item) => {
    return item.id === song.id;
  }, MAX_FAV);

  storage.set(FAV_KEY, favList);
  return favList;
};

export function deleteFav (song) {
  let favList = storage.get(FAV_KEY, []);

  let fIndex = favList.findIndex((item) => {
    return item.id === song.id;
  });

  favList.splice(fIndex, 1);

  storage.set(FAV_KEY, favList);
  return favList;
};
