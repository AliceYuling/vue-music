<template>
  <div class="suggest">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in searchResult">
        <div class="icon">
          <i :class="getClsByType(item)"></i>
        </div>
        <div class="content">
          <p class="text" v-html="getText(item)"></p>
          <p class="tag" v-html="getName(item)"></p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="ecmascript-6">
  import {ERR_OK} from 'api/config.js';
  import {getSearchResult} from 'api/search.js';
  import {singerFilter} from 'common/js/song.js';
  const TYPE_SINGER = 2;
  export default {
    data () {
      return {
        page: 1,
        searchResult: []
      }
    },
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      search (query, page, zhida) {
        getSearchResult (this.query, this.page, this.showSinger).then((res) => {
          if (res.code === ERR_OK) {
            this.searchResult = this.getResult(res.data);
          }
        })
      },
      getResult (data) {
        let ret = [];
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}});
        }
        if (data.song.list) {
          ret = ret.concat(data.song.list);
        }
        return ret;
      },
      getClsByType (item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine';
        } else {
          return 'icon-music';
        }
      },
      getText (item) {
        if (item.type === TYPE_SINGER) {
          return item.singername;
        } else {
          return item.songname;
        }
      },
      getName (item) {
        if (item.type === TYPE_SINGER) {
          return `单曲: ${item.songnum} 专辑: ${item.albumnum}`;
        } else {
          return singerFilter(item.singer);
        }
      }
    },
    watch: {
      query (newQuery) {
        this.search(newQuery);
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/style/variable.styl'
  .suggest
    margin-top: 10px
    .suggest-list
      .suggest-item
        height: 40px
        list-style: none
        .icon
          display: inline-block
          color: $color-text-l
        .content
          display: inline-block
          .text
            color: $color-text-l
            font-size: $font-size-medium
          .tag
            color: $color-text-d
            font-size: $font-size-small
</style>