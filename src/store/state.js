import {playMode} from 'common/js/config.js';
import {loadSearch, loadPlay} from 'common/js/cache.js';
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
  searchHistory: loadSearch(),
  playHistory: loadPlay()
};

export default state;
