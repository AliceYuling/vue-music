<template>
  <div class="m-header">
    <div class="icon">
    </div>
    <h1 class="text">Music</h1>
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
</style>