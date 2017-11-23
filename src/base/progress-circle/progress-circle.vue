<template>
  <div class="progress-circle">
    <svg :width="radius" :height="radius" viewbox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" :r="radius" stroke="(255, 255, 255, 0.3)" stroke-width="2" fill="transparent"/>
      <circle cx="50" cy="50" :r="radius" stroke="#ffcd32" stroke-width="2" fill="transparent" stroke-dasharrays="100"/>
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
    circle
      stroke-width: 2px
</style>