<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="queryChange"></search-box>
      <div class="hotkey-wrapper" v-show="!query">
        <div class="hot-key">
          <h3 class="title">热门搜索</h3>
          <ul class="hotkey-list">
            <li class="hotkey-item" v-for="item in hotKey" @click="addQuery(item)">
              <span class="tag">{{item.k}}</span>
            </li>
          </ul>
        </div>
      </div>
      <suggest v-show="query" :query="query"></suggest>
    </div>
  </div>
</template>

<script type="cmascript-6">
  import SearchBox from 'base/search-box/search-box.vue';
  import {getHotKey} from 'api/search.js';
  import {ERR_OK} from 'api/config.js';
  import Suggest from 'components/suggest/suggest';
  export default {
    components: {
      SearchBox,
      Suggest
    },
    data () {
      return {
        hotKey: [],
        query: ''
      };
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
        this.setQuery(item.k);
      },
      setQuery (query) {
        this.$refs.searchBox.query = query;
      },
      queryChange (query) {
        this.query = query;
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
    .hotkey-wrapper
      position: fixed
      top: 178px
      bottom: 0
      .title
        color: $color-text-d
        font-size: $font-size-medium-x
      .hotkey-list
        margin-top: 8px
        .hotkey-item
          display: inline-block
          margin-right: 16px
          margin-top: 12px
          height: 24px
          line-height: 24px
          padding-left: 4px
          padding-right: 4px
          list-style: none
          border-radius: 4px
          background: $color-highlight-background
          .tag
            font-size: $font-size-medium
            color: $color-text-l
</style>