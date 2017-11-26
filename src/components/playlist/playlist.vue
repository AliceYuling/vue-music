<template>
  <div class="playlist">
    <scroll class="songlist-wrapper" :data="playList">
      <song-list :songs="playList"></song-list>
    </scroll>
    <div class="btnWrapper">
      <div class="addBtn">
        <span class="icon">
          <i class="icon-add"></i>
        </span>
        <span class="text">添加歌曲到播放列表</span>
      </div>
      <div class="close">
        <div class="close-wrapper">
          <i class="icon icon-close"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="ecmascript-6">
  import SongList from 'base/songlist/songlist';
  import {mapGetters} from 'vuex';
  import Scroll from 'base/scroll/scroll';
  export default{
    components: {
      SongList,
      Scroll
    },
    computed: {
      ...mapGetters([
        'playList'
      ])
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/style/variable.styl'
  .playlist
    position: fixed
    overflow: hidden
    width: 100%
    height: 500px
    z-index: 200
    bottom: 63px
    background: $color-background
    .songlist-wrapper
      position: relative
      height: 400px
      margin-bottom: 100px
      overflow: hidden
    .btnWrapper
      height: 0
      padding-top: 100px
      margin-top: -100px
      .addBtn
        width: 200px
        height: 36px
        line-height: 36px
        margin: -80px auto
        border: 1px solid $color-theme
        border-radius: 8px
        .icon
          $font-size: $font-size-medium-x
          color: $color-text-l
        .text
          color: $color-text-l
          font-size: $font-size-medium-x
      .close
        position: absolute
        bottom: 0
</style>