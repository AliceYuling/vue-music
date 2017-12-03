<template>
  <div class="progress-circle">
    <svg :width="64" :height="64" viewbox="-32 -32 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" :r="radius" stroke="rgba(255, 255, 255, 0.3)" stroke-width="4" fill="none"/>
      <circle cx="32" cy="32" :r="radius" stroke="#ffcd32" stroke-width="4" fill="none" transform="matrix(0,-1,1,0,0,64)" :stroke-dasharray="dasharray" />
    </svg>
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        perimeter: 0
      };
    },
    props: {
      radius: {
        Type: Number,
        default: 100
      },
      percent: {
        Type: Number,
        default: 0
      }
    },
    computed: {
      dasharray () {
        return `${this.percent * this.perimeter} ${this.perimeter}`;
      }
    },
    created () {
      this.perimeter = 2 * Math.PI * this.radius;
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/style/variable.styl'
  
  .progress-circle
    position: relative
    svg
      display: block
      position: absolute
      top: 2px
      left: -8px
      stroke-width: 3px
      z-index: 200
</style>