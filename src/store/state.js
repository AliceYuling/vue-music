import {playMode} from 'common/js/config.js';
import {loadSearch} from 'common/js/cache.js';
const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {},
  top: {},
  searchHistory: loadSearch()
};

export default state;
