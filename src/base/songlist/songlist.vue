<template>
  <div class="song-list">
    <ul class="list">
      <li @click="select(song,index)" v-for="(song,index) in songs" class="song-item">
        <div class="rank" v-show="rank">
          <span :class="getRankCls(index)">{{getRankText(index)}}</span>
        </div>
        <div class="content">
          <h2 class="title">{{song.name}}</h2>
          <p class="desc">{{songDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="ecmascript-6">
  export default {
    props: {
      songs: {
        type: Array,
        default: function () {
          return [];
        }
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      songDesc (song) {
        return `${song.singer} · ${song.album}`;
      },
      select (song, index) {
        console.log('select in songlist');
        this.$emit('select', song, index);
      },
      getRankCls (index) {
        if (index <= 2) {
          return `icon icon${index}`;
        } else {
          return 'text';
        }
      },
      getRankText (index) {
        return index <= 2 ? '' : index + 1;
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/style/mixin.styl'
  @import '~common/style/variable.styl'
  .song-list
    padding: 20px 30px
    .song-item
      width: 100%
      height: 48px
      padding-top: 10px
      list-style: none
      .rank
        display: inline-block
        .icon
          display: inline-block
          width: 25px
          height: 24px
          background-size: 25px 24px
          &.icon0
            bg-image('first')
          &.icon1
            bg-image('second')
          &.icon2
            bg-image('third')
        .text
          color: $color-theme
          font-size: $font-size-large
      .content
        display: inline-block
        margin-left: 10px
        .title
          margin-top: 8px
          color: $color-text
          font-size: $font-size-medium
        .desc
          margin-top: 10px
          color: $color-text-d
          font-size: $font-size-medium
</style>