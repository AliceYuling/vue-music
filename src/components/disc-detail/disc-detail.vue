<template>
  <transition name="slide">
    <music-list class="disc-detail" :songs="songList" :title="title" :bgImage="bgImage"></music-list>
  </transition>
</template>

<script type="ecmascript-6">
  import musicList from 'components/music-list/music-list';
  import {mapGetters} from 'vuex';
  import {getDiscDetail} from 'api/recommend.js';
  import {ERR_OK} from 'api/config.js';
  import {createSong} from 'common/js/song.js';
  export default {
    data () {
      return {
        songList: []
      };
    },
    components: {
      musicList
    },
    computed: {
      title () {
        return this.disc.dissname;
      },
      bgImage () {
        return this.disc.imgurl;
      },
      songs () {
        return [];
      },
      ...mapGetters([
        'disc'
      ])
    },
    created () {
      console.log('created;' + this.disc.imgurl);
      console.log(this.disc);
      this._getDiscDetail(this.disc.dissid);
    },
    methods: {
      _getDiscDetail (discId) {
        if (!discId) {
          this.$router.push('/recommend');
          return;
        }
        getDiscDetail(discId).then((res) => {
          if (res.code === ERR_OK) {
            this.songList = this._normalizeSongs(res.cdlist[0].songList);
          }
        });
      },
      _normalizeSongs (list) {
        let ret = [];
        list.forEach((musicData) => {
          if(musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData));
          }
        })
        return ret;
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet">
  @import '~common/style/variable.styl'
  .disc-detail
    position: fixed
    z-index: 99
    top: 0
    left: 0
    bottom: 0
    right: 0
    width: 100%
    background: $color-background
  .slide-enter, .slide-leave
    transform: translate3d(100%, 0, 0)
  .slide-enter-active,.slide-leave-active
    transition: all 0.4s linear
</style>