import storage from 'good-storage';

const SEARCH_KEY = '__search__';
const MAX_SEARCH = 15;

const PLAY_KEY = '__play__';
const MAX_PLAY = 15;

export function saveSearch (query) {
  let list = storage.get(SEARCH_KEY, []);
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
  console.log('cache add play');
  console.log(song);
  // storage.set(PLAY_KEY, []);
  let latest = storage.get(PLAY_KEY, []);
  console.log('before latest');
  console.log(latest);
  let sIndex = latest.findIndex((item) => {
    return song.id === item.id;
  });

  console.log('sIndex=' + sIndex);
  console.log(latest[sIndex]);
  // 若歌曲不存在于当前播放列表中， 则插入到队列头部
  // 否则删除原本的位置并插入到队列头部
  if (sIndex > 0) {
    latest.splice(sIndex, 1);
  }

  latest.unshift(song);
  if (latest.length > MAX_PLAY) {
    latest.pop();
  }

  console.log('after latest');
  console.log(latest);
  storage.set(PLAY_KEY, latest);
  return latest;
};
