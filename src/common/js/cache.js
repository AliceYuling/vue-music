import storage from 'good-storage';

const SEARCH_KEY = '__search__';
const MAX_SEARCH = 15;

const PLAY_KEY = '__play__';
const MAX_PLAY = 100;

const FAV_KEY = '__fav__';
const MAX_FAV = 200;

const insertArray = function (list, val, compare, maxLen) {
  let index = list.findIndex(compare);
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
  return list;
};

export function saveSearch (query) {
  let list = storage.get(SEARCH_KEY, []);
  /*
  let sIndex = list.findIndex((item) => {
    return item === query;
  });

  // console.log('sIndex=' + sIndex);
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
  */
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
  // storage.set(PLAY_KEY, []);
  let latest = storage.get(PLAY_KEY, []);
  /*
  let sIndex = latest.findIndex((item) => {
    return song.id === item.id;
  });

  // 若歌曲不存在于当前播放列表中， 则插入到队列头部
  // 否则删除原本的位置并插入到队列头部
  if (sIndex > 0) {
    latest.splice(sIndex, 1);
  }

  latest.unshift(song);
  if (latest.length > MAX_PLAY) {
    latest.pop();
  }
  */
  latest = insertArray(latest, song, (item) => {
    return item.id === song.id;
  }, MAX_PLAY);
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
