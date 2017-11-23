<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs" class="singer-detail"></music-list>
  </transition>
</template>

<script type="ecmascript-6">
  import {mapGetters} from 'vuex';
  import {getSingerDetail} from 'api/singer';
  import {ERR_OK} from 'api/config';
  import {createSong} from 'common/js/song';
  import MusicList from 'components/music-list/music-list';
  export default {
    computed: {
      title () {
        return this.singer.name;
      },
      bgImage () {
        return `https://y.gtimg.cn/music/photo_new/T001R300x300M000${this.singer.id}.jpg?max_age=2592000`;
      },
      ...mapGetters([
        'singer'
      ])
    },
    data () {
      return {
        songs: []
      };
    },
    created () {
      this._getSingerDetail(this.singer.id);
    },
    methods: {
      _getSingerDetail (singerId) {
        console.log(singerId);
        if (!singerId) {
          this.$router.push('/singer');              // 获取不到id时，回退
          return;
        }
        getSingerDetail(singerId).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeList(res.data.list);
          }
        });
      },
      _normalizeList (list) {
        let ret = [];
        list.forEach((item) => {
          let {musicData} = item;
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData));
          }
        });
        return ret;
      }
    },
    components: {
      MusicList
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/style/variable.styl"
  .singer-detail
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 100
    background: $color-background
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%,0,0)   
</style>