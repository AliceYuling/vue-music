import * as types from './mutation-types';
import {playMode} from 'common/js/config';
import {getRandomArray} from 'common/js/utils';
import * as cache from 'common/js/cache';

function findIndex (list, song) {
  return list.findIndex((item) => {
    return item.id === song.id;
  });
}
export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list);
  if (state.mode === playMode.random) {
    let randomList = getRandomArray(list);
    commit(types.SET_PLAY_LIST, randomList);
    index = findIndex(randomList, list[index]);
  } else {
    commit(types.SET_PLAY_LIST, list);
  }
  commit(types.SET_PLAYING_STATE, true);
  commit(types.SET_FULLSCREEN_STATE, true);
  commit(types.SET_CURRENT_INDEX, index);
};

export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_MODE, playMode.random);
  commit(types.SET_SEQUENCE_LIST, list);
  let randomList = getRandomArray(list);
  commit(types.SET_PLAY_LIST, randomList);
  commit(types.SET_PLAYING_STATE, true);
  commit(types.SET_CURRENT_INDEX, 0);
  commit(types.SET_FULLSCREEN_STATE, true);
};

export const insertSong = function ({commit, state}, song) {
  console.log(state.playList);
  let pList = state.playList.slice(0);
  let curIndex = state.currentIndex;
  let seqList = state.sequenceList.slice(0);
  console.log('pList');
  console.log(pList);
  // let curSong = state.playList[curIndex] || {};

  // 判断歌曲是否已存在于播放列表中
  let sIndex = findIndex(pList, song);
  console.log('sIndex:' + sIndex);

  curIndex++;
  pList.splice(curIndex, 0, song);
  console.log('pList after');
  console.log(pList);
  // 若歌曲在播放列表中， 删除该歌曲原本的位置
  if (sIndex > -1) {
    if (sIndex < curIndex) {
      pList.splice(sIndex, 1);
      curIndex--;
    } else {
      pList.splice(sIndex + 1, 1);
    }
  }

  let cIndex = state.currentIndex;
  let fIndex = findIndex(seqList, song);
  seqList.splice(cIndex + 1, 0, song);
  if (fIndex > -1) {
    if (fIndex < cIndex + 1) {
      seqList.splice(fIndex, 1);
    } else {
      seqList.splice(fIndex + 1, 1);
    }
  }

  commit(types.SET_PLAY_LIST, pList);
  commit(types.SET_SEQUENCE_LIST, seqList);
  commit(types.SET_CURRENT_INDEX, curIndex);
  commit(types.SET_PLAYING_STATE, true);
  commit(types.SET_FULLSCREEN_STATE, true);
};

export const saveSearchHistory = function ({commit, state}, query) {
  commit(types.SET_SEARCH_HISTORY, cache.saveSearch(query));
};

export const deleteOneHistory = function ({commit, state}, item) {
  commit(types.SET_SEARCH_HISTORY, cache.deleteOne(item));
};

export const clearHistory = function ({commit, state}) {
  commit(types.SET_SEARCH_HISTORY, cache.clearAll());
};

// 从播放列表中删除一首歌
export const deleteSong = function ({commit, state}, song) {
  let pList = state.playList.slice();
  let seqList = state.sequenceList.slice();
  let curIndex = state.currentIndex;

  let pIndex = findIndex(pList, song);
  let sIndex = findIndex(seqList, song);

  // 从顺序列表中删除
  seqList.splice(sIndex, 1);

  // 从播放列表中删除
  pList.splice(pIndex, 1);

  // 若当前播放曲目在要删除的曲目之后
  if (pIndex === pList.length) {
    curIndex = 0;
  }
  if (pIndex < curIndex) {
    curIndex--;
  }

  commit(types.SET_PLAYING_STATE, state.playing);
  commit(types.SET_PLAY_LIST, pList);
  commit(types.SET_SEQUENCE_LIST, seqList);
  commit(types.SET_CURRENT_INDEX, curIndex);

  if (!state.playList.length) {
    commit(types.SET_PLAYING_STATE, false);
    commit(types.SET_CURRENT_INDEX, -1);
  } else {
    commit(types.SET_PLAYING_STATE, true);
  }
};

// 清空播放列表
export const clearPlayList = function ({commit, state}) {
  commit(types.SET_FULLSCREEN_STATE, false);
  commit(types.SET_PLAYING_STATE, false);
  commit(types.SET_PLAY_LIST, []);
  commit(types.SET_SEQUENCE_LIST, []);
  commit(types.SET_CURRENT_INDEX, -1);
};

// 在最近播放列表中添加一首歌曲
export const savePlayHistory = function ({commit, state}, song) {
  commit(types.SET_PLAY_HISTORY, cache.addPlay(song));
};
