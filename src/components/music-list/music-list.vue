<template>
  <div class="music-list">
    <h1 class="title" v-html="title"></h1>
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <div class="background-img" :style="bgstyle" ref="bgimage">
      <div class="filter" ref="filter"></div>
      <div class="play-wrapper">
        <div class="play" v-show="songs.length>0" ref="play" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll :data="songs" @scroll="scroll" :probeType="probeType" :listenScroll="listenScroll" class="list" ref="list">
      <div class="song-list-wrapper" >
        <songlist :songs="songs" @select="selectSong" :rank="rank"></songlist>
      </div>
      <div class="loading-container">
        <loading v-show="!songs.length"></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="ecmascript-6">
  import Loading from 'base/loading/loading';
  import Scroll from 'base/scroll/scroll';
  import Songlist from 'base/songlist/songlist';
  import {prefixStyle} from 'common/js/dom.js';
  import {mapActions} from 'vuex';
  import {playListMixin} from 'common/js/mixin';
  const RESERVE_HEIGHT = 40;
  const transform = prefixStyle('transform');
  const backdropFilter = prefixStyle('backdrop-filter');
  export default {
    mixins: [playListMixin],
    props: {
      songs: {
        type: Array,
        default: function () {
          return [];
        }
      },
      title: {
        type: String,
        default: ''
      },
      bgImage: {
        type: String,
        default: ''
      }, 
      rank: {
        type: Boolean,
        default: false
      }
    },
    mounted () {
      this.imageHeight = this.$refs.bgimage.clientHeight;
      this.minTranslateY = -this.imageHeight + RESERVE_HEIGHT;
      this.$refs.list.$el.style.top = `${this.$refs.bgimage.clientHeight}px`;
    },
    components: {
      Songlist,
      Scroll,
      Loading
    },
    computed: {
      bgstyle () {
         return `background-image: url(${this.bgImage})`;
      }
    },
    created () {
      this.probeType = 3;
      this.listenScroll = true;
    },
    data () {
      return {
        posY: 0
      };
    },
    methods: {
      back () {
        this.$router.back();
      },
      scroll (pos) {
        this.posY = pos.y; 
      },
      selectSong (item, index) {
        this.selectPlay({
          list: this.songs, 
          index
        });
      },
      random () {
        this.randomPlay({
          list: this.songs
        })
      },
      handlePlayList (playList) {
        const bottom = playList.length > 0 ? '63px' : '';
        this.$refs.list.$el.style.bottom = bottom;
      },
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ])
    },
    watch: {
      posY (newY) {
        let zIndex = 0;
        let scale =1;
        let blur = 0;
        let translateHeight = Math.max(newY, this.minTranslateY);
        let scalePercent = Math.abs(newY / this.imageHeight);
        this.$refs.layer.style[transform] = `translate3d(0,${translateHeight}px,0)`;
        // console.log(this.tranform);
        if (newY > 0) {
          scale = 1 + scalePercent;
          zIndex = 10;
        } else {
          blur = Math.min(20 * scalePercent, 20);
        }
        if (newY < this.minTranslateY) {
          zIndex = 10;
          this.$refs.bgimage.style.paddingTop = 0;
          this.$refs.bgimage.style.height = `${RESERVE_HEIGHT}px`;
          this.$refs.play.style.display = 'none';
        } else {
          this.$refs.bgimage.style.paddingTop = '70%';
          this.$refs.bgimage.style.height = 0;
          this.$refs.play.style.display = '';
        }
        this.$refs.filter.style[backdropFilter] = `blur(${blur})`;
        this.$refs.bgimage.style.zIndex = zIndex;
        this.$refs.bgimage.style[transform] = `scale(${scale})`;
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/style/mixin.styl'
  @import '~common/style/variable.styl'
  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    width: 100%
    background: $color-background-d
    .title
      position: absolute
      top: 10px
      z-index: 50
      width: 100%
      text-align: center
      color: $color-text
      font-size: $font-size-large
    .back
      position: absolute
      top: 10px
      left: 8px
      z-index: 50
      .icon-back
        color: $color-theme
        font-size: $font-size-large
    .background-img
      position: relative
      top: 0
      left: 0
      width: 100%
      height: 0
      padding-top: 70%
      background-size: cover
      background: $color-background
      .play-wrapper
        position: absolute
        z-index: 199
        bottom: 16px 
        margin-left: 50%
        left: -58px
        .play
          width: 116px
          height: 32px
          line-height: 32px
          padding-left: 10px
          border: 1px solid $color-theme
          border-radius: 8px
          color: $color-theme
          font-size: $font-size-medium
          .icon
            display: inline-block
          .text
            display: inline-block
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      left: 0
      right: 0
      bottom: 0
      background: $color-background
      // overflow: hidden
      // .song-list-wrapper
       // padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
</style>