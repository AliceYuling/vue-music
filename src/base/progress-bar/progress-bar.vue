<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper">
        <div class="progress-btn" ref="btn" 
             @touchstart.prevent="progressTouchStart"
             @touchmove.prevent="progressTouchMove"
             @touchend="progressTouchEnd"
        ></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {prefixStyle} from 'common/js/dom';
  const transform = prefixStyle('transform');
  const BTN_WIDTH = 16;
  export default {
    props: {
      percent: {
        Type: Number,
        default: 0
      }
    },
    created () {
      this.touch = {};
    },
    watch: {
      percent (newPercent) {
        if (newPercent >= 0 && !this.touch.initiated) {
          const barWidth = this.$refs.progressBar.clientWidth - BTN_WIDTH;
          const offsetWidth = newPercent * barWidth;
          this._setOffset(offsetWidth);
        }
      }
    },
    methods: {
      _setOffset (offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px`;
        this.$refs.btn.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
      },
      progressTouchStart (e) {
        this.touch.initiated = true;
        this.touch.startX = e.touches[0].pageX;
        this.touch.left = this.$refs.progress.clientWidth;
      },
      progressTouchMove (e) {
        if (!this.touch.initiated) {
          return;
        }
        this.touch.deltaX = e.touches[0].pageX - this.touch.startX;
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - BTN_WIDTH, Math.max(0, this.touch.left + this.touch.deltaX));
        this._setOffset(offsetWidth);
      },
      progressTouchEnd () {
        this.touch.initiated = false;
        this._triggerPercent();
      },
      _triggerPercent () {
        const barWidth = this.$refs.progressBar.clientWidth - BTN_WIDTH;
        const percent = this.$refs.progress.clientWidth / barWidth;
        this.$emit('updatePercent', percent);
      },
      progressClick (e) {
        const rect = this.$refs.progressBar.getBoundingClientRect();
        const offsetWidth = e.pageX - rect.left;
        this._setOffset(offsetWidth);
        this._triggerPercent();
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/style/variable.styl"
  .progress-bar
    height: 30px
    .bar
      position: relative
      top: 13px
      height: 4px
      background: $color-background-d
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 8px
          width: 16px
          height: 16px
          background: $color-theme
          border-radius: 50%
</style>