<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="queryChange"></search-box>
      <scroll class="shortcut" :data="shortcutList" ref="shortcut">
        <div class="shortcut-wrapper">
          <div class="hotkey-wrapper" v-show="!query">
            <div class="hot-key">
              <h3 class="title">热门搜索</h3>
              <ul class="hotkey-list">
                <li class="hotkey-item" v-for="item in hotKey" @click="addQuery(item.k)">
                  <span class="tag">{{item.k}}</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h2 class="title">
              <span class="text">搜索历史</span>
              <span class="icon-wrapper" @click="clearHistory">
                <i class="icon icon-clear"></i>
              </span>
            </h2>
            <search-list :searchList="searchHistory" @deleteOne="deleteOneHistory" @addQuery="addQuery"></search-list>
          </div>
        </div>
      </scroll>
      <suggest v-show="query" :query="query" @scrollSuggest="onBlur" @select="saveSearch"></suggest>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="cmascript-6">
  import SearchBox from 'base/search-box/search-box.vue';
  import {getHotKey} from 'api/search.js';
  import {ERR_OK} from 'api/config.js';
  import Suggest from 'components/suggest/suggest';
  import {mapActions} from 'vuex';
  import {mapGetters} from 'vuex'
  import searchList from 'base/search-list/search-list';
  import Scroll from 'base/scroll/scroll';
  import {playListMixin} from 'common/js/mixin';
  const TYPE_SINGER = 2;
  export default {
    mixins: [playListMixin],
    components: {
      SearchBox,
      Suggest,
      searchList,
      Scroll
    },
    data () {
      return {
        hotKey: [],
        query: ''
      };
    },
    computed: {
      shortcutList () {
        return this.hotKey.concat(this.searchHistory);
      },
      ...mapGetters([
        'searchHistory'
      ])
    },
    created () {
      this._getHotKey();
    },
    methods: {
      _getHotKey () {
        getHotKey().then((res) => {
          if (res.code === ERR_OK) {
            this.hotKey = res.data.hotkey.slice(0, 10);
          }
          console.log(this.hotKey);
        })
      },
      addQuery (item) {
        this.setQuery(item);
      },
      setQuery (query) {
        this.$refs.searchBox.setQuery(query);
      },
      queryChange (query) {
        this.query = query;
      },
      onBlur () {
        this.$refs.searchBox.blur();
      },
      saveSearch (item) {
        if (item.type === TYPE_SINGER){
          this.saveSearchHistory(item.singername);
        } else {
          this.saveSearchHistory(item.name);
        } 
      },
      handlePlayList (playList) {
        const bottom = playList.length > 0 ? '63px' : '';
        this.$refs.shortcut.$el.style.bottom = bottom;
        this.$refs.shortcut.refresh();
      },
      ...mapActions([
        'saveSearchHistory',
        'deleteOneHistory',
        'clearHistory'
      ])
    },
    watch: {
      query (newQuery) {
        setTimeout(() => {
          this.$nextTick(() => {
            this.$refs.shortcut.refresh();
          });
        }, 20);
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/style/variable.styl'
  @import '~common/style/mixin.styl'
  .search
    .search-box-wrapper
      margin: 20px
      background: $color-background
    .shortcut
      position: fixed
      width: 100%
      top: 178px
      left: 0
      bottom: 0
      overflow: hidden
      .shortcut-wrapper
        padding-left: 20px
        padding-right: 16px
        .hotkey-wrapper
          margin-top: 24px
          .title
            color: $color-text-d
            font-size: $font-size-medium-x
          .hotkey-list
            .hotkey-item
              display: inline-block
              margin-right: 16px
              margin-top: 12px
              height: 24px
              line-height: 24px
              list-style: none
              border-radius: 4px
              background: $color-highlight-background
              .tag
                font-size: $font-size-medium
                color: $color-text-l
        .search-history
          margin-top: 32px
          .title
            display: flex
            height: 40px
            line-height: 40px
            color: $color-text-d
            font-size: $font-size-medium-x
            .text
              flex: 1
            .icon-wrapper
              flex: 0 0 20px
              width: 20px
              line-height: 40px
</style>