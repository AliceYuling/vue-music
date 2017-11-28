<template>
  <div class="playlist">
    <h1 class="title">
      <span class="mode-control">
        <i class="icon" :class="modeCtrl"></i>
      </span>
      <span class="text">顺序播放</span>
      <span class="clear" @click="clearList">
        <i class="icon icon-clear"></i>
      </span>
    </h1>
    <scroll class="song-list-wrapper" :data="sequenceList">
      <ul class="song-list">
        <li class="song-item" v-for="(item,index) in sequenceList" @click="selectSong(item,index)">
          <i class="current" :class="getCurrentIcon(item)"></i>
          <span class="song-name">{{item.name}}</span>
          <span class="like" @click.stop.prevent="toggleLike(index)">
            <i class="icon" :class="favCtrl(index)"></i>
          </span>
          <span class="delete-song" @click.stop.prevent="deleteOne(item)">
            <i class="icon icon-delete"></i>
          </span>
        </li>
      </ul>
    </scroll>
    <div class="btn">
      <div class="btnWrapper">
        <div class="addBtn" @click="addSong">
          <span class="add">
            <i class="icon-add"></i>
          </span>
          <span class="text">添加歌曲到播放列表</span>
        </div>
        <div class="close" @click="close">
          <span class="text">关闭</span>
        </div>
      </div>
    </div>
    <div class="addsong-wrapper" v-show="showAdd">
      <add-song @closeAdd="closeAdd"></add-song>
    </div>
  </div>
</template>

<script type="ecmascript-6">
  import SongList from 'base/songlist/songlist';
  import Scroll from 'base/scroll/scroll';
  import {playMode} from 'common/js/config';
  import {mapActions, mapGetters} from 'vuex';
  import AddSong from 'components/add-song/add-song';

  export default{
    components: {
      SongList,
      Scroll,
      AddSong
    },
    data () {
      return {
        showList: true,
        likeSong: false,
        currentLike: -1,
        showAdd: false
      };
    },
    computed: {
      modeCtrl () {
        return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.random ? 'icon-random' : 'icon-loop';
      },
      ...mapGetters([
        'sequenceList',
        'mode',
        'currentSong'
      ])
    },
    methods: {
      selectSong (item, index) {
        this.selectPlay({
          list: this.playList, 
          index
        });
        this.$emit('closePlayList');
      },
      toggleLike (index) {
        this.likeSong = !this.likeSong;
        this.currentLike = index;
      },
      getCurrentIcon (item) {
        if (this.currentSong.id === item.id) {
          return 'icon-play'
        } else {
          return '';
        }
      },
      favCtrl (index) {
        return this.likeSong ? 'icon-favorite' : 'icon-not-favorite';
      },
      addSong () {
        console.log('addsong');
        this.showAdd = true;
      },
      close () {
        console.log('close');
        this.$emit('closePlayList');
      },
      addSong () {
        this.showAdd = true;
      },
      closeAdd () {
        this.showAdd = false;
      },
      deleteOne (item) {
        this.deleteSong(item);
      },
      clearList () {
        this.clearPlayList();
        this.$emit('closePlayList');
      },
      selectSong (item, index) {
        console.log('select in playlist');
        this.selectPlay({
          list: this.sequenceList,
          index
        });
      },
      ...mapActions([
        'selectPlay',
        'clearPlayList',
        'deleteSong'
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
    z-index: 150
    bottom: 0
    background: $color-highlight-background
    .title
      display: flex
      padding: 0 20px 0 20px
      height: 64px
      line-height: 64px
      .mode-control
        flex: 0 0 40px
        font-size: $font-size-large-x
        color: $color-theme
      .text
        flex: 1
        font-size: $font-size-medium
        color: $color-text
      .clear
        flex: 0 0 40px
        font-size: $font-size-medium
        color: $color-text-l
    .song-list-wrapper
      position: relative
      height: 306px
      padding: 0 20px 0 20px
      overflow: hidden
      .song-list
        .song-item
          display: flex
          height: 36px
          line-height: 36px
          font-size: $font-size-medium
          color: $color-text-l
          .current
            flex: 0 0 20px
            display: inline-block
            line-height: 36px
            color: $color-theme
          .song-name
            display: block
            flex: 1
          .like
            display: block
            flex: 0 0 40px
            width: 40px
          .delete-song
            display: block
            flex: 0 0 40px
            width: 40px
    .btn
      height: 0
      padding-top: 130px
      .btnWrapper
        margin-top: -130px
        height: 130px
        .addBtn
          width: 200px
          height: 36px
          line-height: 36px
          margin: 20px auto
          border: 1px solid $color-theme
          border-radius: 8px
          text-align: center
          .add
            $font-size: $font-size-medium-x
            color: $color-text-l
          .text
            color: $color-text-l
            font-size: $font-size-medium-x
        .close
          height: 55px
          line-height: 55px
          background: $color-background
          text-align: center
          .text
            color: $color-text
</style>