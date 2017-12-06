<template>
  <div class="user">
    <div class="back" @click="back">
      <i class="icon icon-back"></i>
    </div>
    <div class="switch">
        <span class="switch-latest" :class="{'current':!isCurrent}" @click="toggleCurrent">最近播放</span>
        <span class="switch-history" :class="{'current':isCurrent}" @click="toggleCurrent">收藏歌单</span>
      </div>
      <div class="refer-content">
        <scroll class="latest-wrapper" v-show="!isCurrent" :data="playHistory">
          <song-list :songs="playHistory" @select="selectSong"></song-list>
        </scroll>
        <scroll class="favorite-wrapper" v-show="isCurrent" :data="favoriteList">
          <song-list :songs="favoriteList"></song-list>
        </scroll>
      </div>
  </div>
</template>

<script type="ecmascript=6">
  import SongList from 'base/songlist/songlist';
  import Scroll from 'base/scroll/scroll';
  import {mapGetters} from 'vuex';
  export default {
    data () {
      return {
        isCurrent: false
      }
    },
    computed: {
      ...mapGetters([
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
        // this.savePlayHistory(item);
        this.saveSearchHistory(item.name);
      }
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
    z-index: 200
    background: $color-background
    color: $color-text
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
    .refer-content
      overflow: hidden
      .latest-wrapper
        position: fixed
        width: 100%
        top: 80px
        bottom: 0
        overflow: hidden
      .favorite-wrapper
        position: fixed
        width: 100%
        top: 80px
        bottom: 0
        overflow: hidden
</style>