<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input class="box" v-model="query" :placeholder="placeholder" ref="query">
    <i v-show="query" @click="clear" class="icon-dismiss"></i>
  </div>
</template>

<script type="ecmascript-6">
  import {debounce} from 'common/js/utils.js';
  export default {
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌单、专辑'
      }
    },
    data () {
      return {
        query: ''
      };
    },
    methods: {
      clear () {
        this.query = '';
      },
      blur () {
        this.$refs.query.blur();
      },
      setQuery (query) {
        this.query = query;
      }
    },
    created () {
      this.$watch('query', debounce((newQuery) => {
        this.$emit('query', newQuery);
      },500));
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/style/variable.styl'
  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    height: 40px
    padding: 0 6px
    border-radius: 6px
    background: $color-highlight-background
    .icon-search
      flex: 0 0 20px
      font-size: $font-size-large-x
      color: $color-background
    .box
      display: block
      margin-left: 3px
      flex: 1
      line-height: 24px
      border: none
      background: $color-highlight-background
      color: $color-text-l
      font-family: 'Microsoft YaHei', 'PingFang SC', 'STHeitiSC-Light', 'Helvetica-Light', arial, sans-serif, 'Droid Sans Fallback'
    .icon-dismiss
      flex: 0 0 20px
      width: 20px
      text-align: center
      font-size: $font-size-medium
      color: $color-background
</style>