<template>
  <div class="progress-circle">
    <svg :width="64" :height="64" viewbox="-32 -32 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle cx="23.8" cy="34" :r="radius" stroke="rgba(255, 255, 255, 0.3)" stroke-width="3" fill="transparent"/>
      <circle cx="23.8" cy="34" :r="radius" stroke="#ffcd32" stroke-width="3" fill="transparent" stroke-dasharrays="100"/>
    </svg>
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      radius: {
        Type: Number,
        default: 100
      }
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
      top: 0
      left: 0
      stroke-width: 3px
      z-index: 200
</style>