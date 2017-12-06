import {mapGetters, mapActions} from 'vuex';
import {getRandomArray} from 'common/js/utils';
import {playMode} from 'common/js/config.js';

export const playListMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted () {
    this.handlePlayList(this.playList);
  },
  activated () {
    this.handlePlayList(this.playList);
  },
  watch: {
    playList (newVal) {
      this.handlePlayList(newVal);
    }
  },
  methods: {
    handlePlayList () {
      throw new Error('component must implement handlePlayList method');
    }
  }
};

export const playerMixin = {
  computed: {
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random';
    }
  },
  methods: {
    changeMode () {
      let modeIndex = (this.mode + 1) % 3;
      this.setPlayMode(modeIndex);
      let list = null;
      if (this.mode === playMode.random) {                                      // 随机播放
        list = getRandomArray(this.playList);
      } else {
        list = this.sequenceList;
      }
      this.resetCurrentIndex(list, this.currentSong);
      this.setPlayList(list);
    },
    resetCurrentIndex (list, song) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id;
      });
      this.setCurrentIndex(index);
    }
  }
};

export const searchMixin = {
  methods: {
    queryChange (query) {
      this.query = query;
    },
    addQuery (item) {
      this.setQuery(item);
    },
    setQuery (query) {
      this.$refs.searchBox.setQuery(query);
    },
    onBlur () {
      this.$refs.searchBox.blur();
    }
  }
};

export const favMixin = {
  computed: {
    ...mapGetters([
      'favoriteList'
    ])
  },
  methods: {
    toggleLike (item) {
      if (this.isFavorite(item)) {
        this.deleteFav(item);
      } else {
        this.addFav(item);
      }
    },
    getFavIcon (song) {
      let index = this.favoriteList.findIndex((item) => {
        return item.id === song.id;
      });
      return index < 0 ? 'icon-not-favorite' : 'icon-favorite';
    },
    isFavorite (song) {
      let index = this.favoriteList.findIndex((item) => {
        return item.id === song.id;
      });
      if (index < 0) {
        return false;
      }
      return true;
    },
    ...mapActions([
      'addFav',
      'deleteFav'
    ])
  }
};
