<template>
  <Scroll class="suggest" ref="suggest" :data="searchResult" :pullup="pullup" @scrollToEnd="searchMore" :beforeScroll="beforeScroll" @onScroll="onScroll">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in searchResult" @click="selectItem(item)" :class="{'hideSinger': hideSinger(item)}">
        <div class="icon">
          <i :class="getClsByType(item)"></i>
        </div>
        <div class="content">
          <p class="text" v-html="getText(item)"></p>
          <p class="tag" v-html="getName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore"></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!searchResult.length && !hasMore">
      <no-result :text="text"></no-result>
    </div>
  </Scroll>
</template>

<script type="ecmascript-6">
  import {ERR_OK} from 'api/config.js';
  import {getSearchResult} from 'api/search.js';
  import {createSong} from 'common/js/song.js';
  import Scroll from 'base/scroll/scroll';
  import NoResult from 'base/no-result/no-result';
  import Loading from 'base/loading/loading';
  import Singer from 'common/js/singer.js';
  import {mapMutations} from 'vuex';
  import {mapActions} from 'vuex';
  const perPage = 20;
  const TYPE_SINGER = 2;
  export default {
    data () {
      return {
        page: 1,
        searchResult: [],
        pullup: true,
        totalNum: 0,
        text: '抱歉，暂无搜索结果',
        hasMore: true,
        beforeScroll: true
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
      },
      hideZhida:{
        type: Boolean,
        default: false
      }
    },
    methods: {
      search (query, page, zhida) {
        this.page = 1;
        this.hasMore = true;
        this.$refs.suggest.scrollTo(0, 0);
        getSearchResult (this.query, this.page, this.showSinger, perPage).then((res) => {
          if (res.code === ERR_OK) {
            this.searchResult = this.getResult(res.data);
            this.totalNum = res.data.song.totalnum;
            this.curNum = res.data.song.curnum;
            // console.log(this.totalNum + ',' + this.curNum);
          }
          if (this.curNum + this.page * perPage >= this.totalNum) {
            this.hasMore = false;
          }
        });
      },
      hideSinger (item) {
        return (item.type === TYPE_SINGER) && this.hideZhida;
      },
      getResult (data) {
        let ret = [];
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}});
        }
        if (data.song.list) {
          ret = ret.concat(this._normalizeSong(data.song.list));
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
          return item.name;
        }
      },
      getName (item) {
        if (item.type === TYPE_SINGER) {
          return `单曲: ${item.songnum} 专辑: ${item.albumnum}`;
        } else {
          return item.singer;
        }
      },
      _normalizeSong (list) {
        let ret = [];
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData));
          }
        });
        return ret;
      },
      searchMore () {
        /*
        let pageNum = Math.ceil(this.totalNum / perPage);
        console.log(pageNum);
        if (this.page >= pageNum) {
          return;
        } else {
          this.page += 1;
          console.log(this.page);
          this.search (this.query, this.page);
        }
        */
        if (this.curNum + this.page * perPage >= this.totalNum) {
          this.hasMore = false;
          return;
        } else {
          this.page ++;
          this.hasMore = true;
          getSearchResult (this.query, this.page, this.showSinger, perPage).then((res) => {
            if (res.code === ERR_OK) {
              this.searchResult = this.searchResult.concat(this.getResult(res.data));
              this.totalNum = res.data.song.totalnum;
              this.curNum = res.data.song.curnum;
              // console.log(this.totalNum + ',' + this.curNum);
            }
          });
        }
      },
      selectItem (item) {
        if (item.type === TYPE_SINGER) {
          const singer = new Singer ({
            id: item.singermid,
            name: item.singername
          });
          this.$router.push(`singer/${singer.id}`);
          this.setSinger(singer);
        } else {
          this.insertSong(item);
        }
        this.$emit('selectSuggest', item);
      },
      onScroll () {
        this.$emit('scrollSuggest');
      },
      ...mapMutations({
        'setSinger': 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    watch: {
      query (newQuery) {
        this.search(newQuery);
      }
    },
    components: {
      Scroll,
      NoResult,
      Loading
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/style/variable.styl'
  .suggest
    position: fixed
    top: 170px
    bottom: 0
    left: 0
    width: 100%
    background: $color-background
    overflow: hidden
    .suggest-list
      margin-left: 16px
      .suggest-item
        display: flex
        height: 40px
        margin-bottom: 8px
        list-style: none
        &.hideSinger
          display: none
        .icon
          display: inline-block
          line-height: 40px
          flex: 0 0 32px
          width: 32px
          color: $color-text-l
        .content
          display: flex
          flex: 1
          flex-direction: column
          justify-content: center
          align-content: center
          overflow： hidden
          .text
            flex: 1
            color: $color-text-l
            font-size: $font-size-medium
          .tag
            flex: 1
            color: $color-text-d
            font-size: $font-size-small
</style>