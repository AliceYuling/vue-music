<template>
  <scroll class="listview" 
          ref="listview" 
          :data="data"
          :listenScroll="listenScroll"
          @scroll="scroll"
          :probeType="probeType">
    <ul class="list-wrapper" ref="listwrapper">
      <li v-for="(group,index) in data" class="list-group" ref="listgroup">
        <h2 class="group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item">
            <img class="avatar" :src="item.avatar" />
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="listview-shortcut" v-on:touchstart="onShortcutTouchStart($event)" v-on:touchmove.stop.prevent="onShortcutTouchMove($event)">
      <ul class="shortcut-list">
        <li class="shortcut-item" v-for="(item,index) in shortcut" :data-index="index" :class="{'current':currentIndex===index}">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixedtitle">
      <h2 class="fixed-title">{{fixedTitle}}</h2>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>
<script type="ecmascript-6">
  import Scroll from 'base/scroll/scroll';
  import {getData} from 'common/js/dom';
  import Loading from 'base/loading/loading';
  const HEIGHT = 18;
  const TITLE_HEIGHT = 28;
  export default {
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    data () {
      return {
        posY: -1,
        currentIndex: 0,
        fixedTop: 0,
        diff: 0
      };
    },
    computed: {
      shortcut () {
        return this.data.map((group) => {
          return group.title.substr(0, 1);
        });
      },
      fixedTitle () {
        if (this.posY > 0) {
          console.log('this.posY > 0');
          return '';
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : '';
      }
    },
    created () {
      this.touch = {};           // 若在data 里设置的话会绑定getter， setter并监听变化
      this.listenScroll = true;
      this.listHeight = [];
      this.probeType = 3;
    },
    components: {
      Scroll,
      Loading
    },
    methods: {
      onShortcutTouchStart (e) {
        let touchIndex = getData(e.target, 'index');
        let firstTouch = e.touches[0];
        this.touch.y1 = firstTouch.pageY;
        this.touch.touchIndex = touchIndex;
        this._scrollTo(touchIndex);
      },
      onShortcutTouchMove (e) {
        let firstTouch = e.touches[0];
        this.touch.y2 = firstTouch.pageY;
        let delta = (this.touch.y2 - this.touch.y1) / HEIGHT | 0;
        let moveIndex = parseInt(this.touch.touchIndex) + delta;
        this._scrollTo(moveIndex);
      },
      _scrollTo (index) {
        if (!index && index !== 0) {
          return;
        }
        if (index < 0) {
          index = 0;
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight - 2;
        }
        this.posY = -this.listHeight[index];
        this.$refs.listview.scrollToElement(this.$refs.listgroup[index], 0);
      },
      scroll (pos) {
        this.posY = pos.y;
        // console.log(this.posY);
      },
      _calHeight () {
        let listgroup = this.$refs.listgroup;
        let height = 0;
        console.log('listgroup:' + this.$refs.listgroup);
        this.listHeight.push(height);
        for (let i = 0; i < listgroup.length; i++) {
          height += listgroup[i].clientHeight;
          this.listHeight.push(height);
        }
        // console.log(this.listHeight);
      },
      selectItem (item) {
        this.$emit('select', item);
      },
      refresh () {
        this.$refs.listview.refresh();
      }
    },
    watch: {
      data () {
        setTimeout(() => {
          this._calHeight();
        });
      },
      posY (newY) {
        // console.log('newY');
        // 滚动到最顶部，newY大于0
        if (newY > 0) {
          this.currentIndex = 0;
          return;
        }
        const listHeight = this.listHeight;

        // 中间部分滚动
        for (let i = 0; i < listHeight.length - 1; i++) {
          if (!listHeight[i + 1] || ((-newY < listHeight[i + 1]) && (-newY >= listHeight[i]))) {
            this.currentIndex = i;
            // console.log(this.currentIndex);
            this.diff = listHeight[i + 1] + newY;
            // console.log(this.diff);
            return;
          }
        }
        // 滚动到底部且newY大于最后一个元素的上限
        this.currentIndex = listHeight.length - 2;
      },
      diff (newDiff) {
        // console.log('newdiff');
        let fixedTop = (newDiff > 0 && newDiff < TITLE_HEIGHT) ? newDiff - TITLE_HEIGHT : 0;
        // console.log('fixedTop:' + this.fixedTop);
        if (this.fixedTop === fixedTop) {
          return;
        }
        this.fixedTop = fixedTop;
        this.$refs.fixedtitle.style.transform = `translate3d(0, ${this.fixedTop}px, 0)`;
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/style/variable.styl'
  .listview
    position: relative
    height: 100%
    width: 100%
    top: 0
    overflow: hidden
    background: $color-background
    .list-wrapper
      .list-group
        padding-bottom: 30px
        .group-title
          width: 100%
          height: 28px
          line-height: 28px
          padding-left: 16px
          background-color: $color-highlight-background
          color: $color-text
          font-size: $font-size-medium
        ul
          .list-group-item
            width: 100%
            height: 80px
            line-height: 80px
            .avatar
              display: inline-block
              margin-left: 32px
              width: 50px
              height: 50px
              border-radius: 50%
              vertical-align: middle
            .name
              display: inline-block
              margin-left: 16px
              vertical-align: top
              color: $color-text
              font-size: $font-size-medium
    .listview-shortcut
      position: absolute
      right: 0
      top: 100px
      .shortcut-list
        .shortcut-item
          width: 30px
          height: 18px
          list-style: none
          text-align: center
          color: $color-text
          font-size: $font-size-small
          &.current
            color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 28px
      .fixed-title
        width: 100%
        height: 28px
        line-height: 28px
        padding-left: 16px
        background-color: $color-highlight-background
        color: $color-text
        font-size: $font-size-medium
    .loading-container
      position: absolute
      left: 100%
</style>