<template>
  <div class="add-song">
    <h1 class="title">
      <span class="text">添加歌曲到列表</span>
      <span class="back" @click="back">
        <i class="icon icon-close"></i>
      </span>
    </h1>
    <div class="searchbox-wrapper">
      <search-box :placeholder="placeholder" @query="queryChange" ref="searchBox"></search-box>
    </div>
    <div class="refer">
      <div class="switch">
        <span class="switch-latest" :class="{'current':!isCurrent}" @click="toggleCurrent">最近播放</span>
        <span class="switch-history" :class="{'current':isCurrent}" @click="toggleCurrent">搜索历史</span>
      </div>
      <div class="refer-content">
        <scroll class="latest-wrapper" v-show="!isCurrent" :data="playHistory">
          <song-list :songs="playHistory" @select="selectSong"></song-list>
        </scroll>
        <scroll class="search-wrapper" v-show="isCurrent" :data="searchHistory">
          <search-list :searchList="searchHistory" @deleteOne="deleteOneSearch" @addQuery="addQuery"></search-list>
        </scroll>
      </div>
    </div>
    <div class="suggest-wrapper">
      <suggest v-show="query" :query="query" @scrollSuggest="onBlur" @selectSuggest="selectSong" :hideZhida="hideZhida"></suggest>
    </div>
  </div>
</template>

<script type="ecmascript-6">
  import SearchBox from 'base/search-box/search-box';
  import SearchList from 'base/search-list/search-list';
  import {mapGetters, mapActions} from 'vuex';
  import Scroll from 'base/scroll/scroll';
  import SongList from 'base/songlist/songlist';
  import Suggest from 'components/suggest/suggest';
  import Song from 'common/js/song';
  export default {
    data () {
      return {
        placeholder: '搜索歌曲',
        isCurrent: false,
        query: '',
        hideZhida: true
      };
    },
    props: {
      showAdd: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      referList () {
        return this.searchHistory.concat(this.playHistory);
      },
      ...mapGetters([
        'searchHistory',
        'playHistory'
      ])
    },
    methods: {
      toggleCurrent () {
        this.isCurrent = !this.isCurrent;
      },
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
      },
      back () {
        this.$emit('closeAdd');
      },
      deleteOneSearch (item) {
        this.deleteOneHistory(item);
      },
      selectSong (item, index) {
        this.insertSong(new Song(item));
        // this.savePlayHistory(item);
        this.saveSearchHistory(item.name);
      },
      ...mapActions([
        'deleteOneHistory',
        'savePlayHistory',
        'selectPlay',
        'insertSong',
        'saveSearchHistory'
      ])
    },
    components: {
      SearchBox,
      SearchList,
      Scroll,
      SongList,
      Suggest
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/style/variable.styl';
  .add-song
    position: fixed
    z-index: 250
    width: 100%
    top: 0
    bottom: 0
    background: $color-background
    .title
      position: relative
      top: 10px
      height: 40px
      line-height: 40px
      text-align: center
      .text
        display: inline-block
        line-height: 40px
        vertical-align: top
        color: $color-text
        font-size: $font-size-large
      .back
        display: inline-block
        position: absolute
        right: 16px
        color: $color-text
        font-size: $font-size-medium-x
    .searchbox-wrapper
      width: 80%
      margin: 30px auto
    .refer
      .switch
        margin: 10px auto
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
          top: 180px
          bottom: 0
          overflow: hidden
        .search-wrapper
          position: fixed
          width: 100%
          top: 180px
          bottom: 0
          overflow: hidden
    .suggest-wrapper
      margin-top: 20px
</style>