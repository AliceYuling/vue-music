<template>
  <div class="user" ref="user">
    <div class="back" @click="back">
      <i class="icon icon-back"></i>
    </div>
    <div class="switch">
      <span class="switch-latest" :class="{'current':!isCurrent}" @click="toggleCurrent">最近播放</span>
      <span class="switch-history" :class="{'current':isCurrent}" @click="toggleCurrent">收藏列表</span>
    </div>
    <div class="random" @click="random">
      <div class="random-wrapper">
        <span class="icon">
          <i class="icon-random"></i>
        </span>
        <span class="text">
          随机播放全部
        </span>
      </div>
    </div>
    <div class="refer-content" ref="refer">
      <scroll class="latest-wrapper" v-show="!isCurrent" :data="playHistory" ref="latest">
        <song-list :songs="playHistory" @select="selectSong"></song-list>
      </scroll>
      <scroll class="favorite-wrapper" v-show="isCurrent" :data="favoriteList" ref="favorite">
        <song-list :songs="favoriteList" @select="selectSong"></song-list>
      </scroll>
    </div>
  </div>
</template>

<script type="ecmascript=6">
  import SongList from 'base/songlist/songlist';
  import Scroll from 'base/scroll/scroll';
  import Song from 'common/js/song';
  import {mapGetters, mapActions} from 'vuex';
  import {playListMixin} from 'common/js/mixin';
  export default {
    mixins: [playListMixin],
    data () {
      return {
        isCurrent: false
      }
    },
    computed: {
      ...mapGetters([
        'playList',
        'playHistory',
        'favoriteList'
      ])
    },
    methods: {
      back () {
        this.$router.push('/recommend');
      },
      toggleCurrent () {
        this.isCurrent = !this.isCurrent;
      },
      selectSong (item, index) {
        this.insertSong(new Song(item));
      },
      handlePlayList (playList) {
        const bottom = playList.length > 0 ? '63px' : '';
        this.$refs.refer.style.bottom = bottom;
        this.$refs.latest.refresh();
        this.$refs.favorite.refresh();
      },
      random () {
        console.log('randomplay in user');
        let list = this.isCurrent ? this.favoriteList : this.playHistory;
        if (list.length === 0) {
          return;
        }
        list = list.map((song) => {
          return new Song(song);
        });
        this.randomPlay({
          list
        });
        // console.log('randomPlay');
      },
      ...mapActions([
        'insertSong',
        'randomPlay'
      ])
    },
    components: {
      SongList,
      Scroll
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/style/variable.styl'
  .user
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 101
    background: $color-background
    color: $color-text
    overflow: hidden
    .back
      position: absolute
      left: 10px
      top: 10px
    .switch
      margin: 20px auto
      width: 200px
      height: 32px
      line-height: 32px
      border-radius: 6px
      border: 1px solid $color-highlight-background
      text-align: center
      box-sizing: content-box
      font-size: 0
      background: $color-background
      color: $color-text-l
      .switch-latest
        display: inline-block
        width: 50%
        font-size: $font-size-medium
        &.current
          background: $color-highlight-background
          color: $color-text
      .switch-history
        display: inline-block
        width: 50%
        font-size: $font-size-medium
        &.current
          background: $color-highlight-background
          color: $color-text
    .random
      width: 100%
      .random-wrapper
        margin: 16px auto 16px auto
        width: 140px
        height: 32px
        line-height: 32px
        border: 1px solid $color-theme
        border-radius: 6px
        text-align: center
        .icon
          color: $color-theme
        .text
          color: $color-theme
          font-size: $font-size-medium
    .refer-content
      position: fixed
      width: 100%
      top: 120px
      bottom: 0
      .latest-wrapper
        height: 100%
        overflow: hidden
      .favorite-wrapper
        height: 100%
        overflow: hidden
</style>