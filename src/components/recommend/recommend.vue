<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div v-if="recommends.length" class="slider-wrapper">
          <slider>
            <div v-for="item in recommends">
              <a :href="item.linkUrl">
                <img class="needsclick" :src="item.picUrl" @load="loadImage"/>
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="(item,index) in discList" @click="selectDisc(item)">
              <div class="icon">
                <img width="56" height= "60" v-lazy="item.imgurl" />
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading>
        </loading>
      </div>
      <router-view></router-view>
    </scroll>
  </div>
</template>

<script type="ecmascript-6">
  import Slider from 'base/slider/slider';
  import {getRecommend, getDiscList} from 'api/recommend';
  import {ERR_OK} from 'api/config';
  import Scroll from 'base/scroll/scroll';
  import Loading from 'base/loading/loading';
  import {playListMixin} from 'common/js/mixin';
  import {mapMutations} from 'vuex';
  export default {
    mixins: [playListMixin],
    data () {
      return {
        recommends: [],
        discList: []
      };
    },
    created () {
      this._getRecommend();
      this._getDiscList();
    },
    methods: {
      _getRecommend: function () {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider;
          }
        });
      },
      _getDiscList: function () {
        getDiscList().then((res) => {
          if (res.code === ERR_OK) {
            this.discList = res.data.list;
          }
          // console.log(this.discList);
        });
      },
      loadImage () {
        if (!this.checkLoaded) {
          this.$refs.scroll.refresh();
          this.checkLoaded = true;
        }
      },
      handlePlayList (playList) {
        const bottom = playList.length > 0 ? '63px' : '';
        this.$refs.recommend.style.bottom = bottom;
        this.$refs.scroll.refresh();
      },
      selectDisc (disc) {
        this.$router.push({
          path: `/recommend/${disc.dissid}`
        });
        this.setDisc(disc);
      },
      ...mapMutations({
        setDisc: 'SET_DISC'
      })
    },
    watch: {
      discList (newList) {
        setTimeout(() => {
          this.$nextTick(() => {
            this.$refs.scroll.refresh();
          });
        }, 20);
      }
    },
    components: {
      Slider,
      Scroll,
      Loading
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '~common/style/variable.styl'
  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom:0
    .recommend-content
      height: 100%
      overflow: hidden
      .recommend-list
        .list-title
          margin: 18px 0 18px
          text-align: center
          font-size: $font-size-medium-x
          color: $color-theme
        ul 
          li
            display: flex
            justify-content: center
            margin: 8px 0 8px 0
            .icon
              flex: 0 0 80px
              text-align: center
            .text
              display: flex
              flex: 1
              flex-direction: column
              .name
                flex: 0 0 20px
                line-height: 20px
                font-size: $font-size-medium
                color: $color-text
              .desc
                flex: 1
                margin-top: 8px
                font-size: $font-size-medium
                color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        // transform: translateY(-50%)
</style>