<template>
  <div class="search-list">
    <ul class="list">
      <li class="search-item" v-for="item in searchList" @click="addQuery(item)">
        <span class="text">{{item}}</span>
        <span class="icon-wrapper" @click="deleteOne(item)">
          <i class="icon icon-delete"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script type="ecmascript-6">
  export default {
    props: {
      searchList: {
        type: Array,
        default: () => {
          return [];
        }
      }
    },
    methods: {
      deleteOne (item) {
        this.$emit('deleteOne', item);
      },
      addQuery (item) {
        this.$emit('addQuery', item);
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/style/variable.styl';
  .search-list
    .list
      padding: 10px 30px
      .search-item
        display: flex
        height: 32px
        line-height: 32px
        list-style: none
        font-size: $font-size-medium
        color: $color-text-l
        .text
          flex: 1
        .icon-wrapper
          flex: 0 0 20px
          line-height: 32px
          width: 20px
</style>