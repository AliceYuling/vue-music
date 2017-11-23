<template>
  <div class="rank" ref="rank">
    <scroll class="rank-content" :data="topList" ref="rankContent">
      <ul class="rank-list">
        <li class="rank-item" v-for="item in topList" @click="selectRank(item)">
          <div class="image-wrapper">
            <img v-lazy="item.picUrl" width="100" height="100">
          </div>
          <ul class="song-list">
            <li class="song-item" v-for="(song,index) in item.songList">
              <span class="index">{{index+1}}</span>
              <span class="name">{{song.songname}}-{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-wrapper">
        <loading></loading>
      </div>
      <router-view></router-view>
    </scroll>
  </div>
</template>

<script type="ecmascript-6">
  import {getTopList} from 'api/rank';
  import {ERR_OK} from 'api/config';
  import Scroll from 'base/scroll/scroll';
  import {playListMixin} from 'common/js/mixin';
  import {mapMutations} from 'vuex';
  import Loading from 'base/loading/loading';
  export default {
    mixins: [playListMixin],
    data () {
      return {
        topList: []
      };
    },
    created () {
      this._getTopList();
    },
    methods: {
      _getTopList () {
        getTopList().then((res) => {
          if (res.code === ERR_OK) {
            this.topList = res.data.topList;
            console.log(res.data.topList);
          }
        });
      },
      selectRank (item) {
        console.log('select rank');
        this.$router.push({
          path: `/rank/${item.id}`
        });
        this.setTop(item);
      },
      handlePlayList (playList) {
        const bottom = playList.length > 0 ? '63px' : '';
        this.$refs.rank.style.bottom = bottom;
        this.$refs.rankContent.refresh();
      },
      ...mapMutations({
        'setTop': 'SET_TOP'
      })
    },
    components: {
      Scroll,
      Loading
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/style/variable.styl';
  .rank
    position: fixed
    top: 88px
    left: 0
    bottom: 0
    width: 100%
    background: $color-background
    .rank-content
      width: 100%
      height: 100%
      overflow: hidden
      .rank-list
        padding-left: 18px
        padding-right: 18px
        .rank-item
          display: flex
          height: 100px
          padding-top: 18px
          &.last-child
            padding-bottom: 18px
          .image-wrapper
            flex: 0 0 100px
            width: 100px
            height: 100px
          .song-list
            padding: 10px 4px 10px 4px
            flex: 1
            display: flex
            flex-direction: column
            justify-content: center
            padding-left: 20px
            background: $color-background-d
            .song-item
              flex: 1
              list-style: none
              color: $color-text-l
              font-size: $font-size-small
</style>