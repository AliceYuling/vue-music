<template>
  <div class="m-header">
    <h1 class="text">Music</h1>
    <router-link class="mine" tag="div" to="/user">
      <i class="icon-mine"></i>
    </router-link>
  </div> 
</template>

<script type="text/ecmascript-6">
  export default {};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/style/mixin'
  @import '~common/style/variable'
  
  .m-header
    position: relative
    top: 0
    width: 100%
    height: 44px
    line-height: 44px
    text-align: center
    color: $color-theme
    font-size: 0
    .text
      display: inline-block
      vertical-align: top
      line-height: 44px
      color: $color-theme
      font-size: $font-size-large
    .mine
      position: absolute
      top: 10px
      right: 20px
      width: 20px
      height: 20px
      .icon-mine
        display: inline-block
        font-size: $font-size-large
</style>