 <template>
  <transition name="slide">
    <music-list class="rank-detail" :bgImage="bgImage" :title="title" :songs="songList" :rank="rank"></music-list>
  </transition>
</template>

<script type="ecmascript-6">
  import {mapGetters} from 'vuex';
  import {getRankDetail} from  'api/rank.js';
  import {ERR_OK} from 'api/config.js';
  import {createSong} from 'common/js/song.js';
  import musicList from 'components/music-list/music-list';
  export default {
    data () {
      return {
        songList: [],
        date: '',
        day: 0,
        rank: true
      };
    },
    computed: {
      title () {
        return this.top.topTitle;
      },
      bgImage () {
        if (this.songList.length) {
          return this.songList[0].image;
        }
      },
      ...mapGetters([
        'top'
      ])
    },
    created () {
      this._getRankDetail();
    },
    methods: {
      _getRankDetail () {
        if (!this.top.id) {
          this.$router.push('/rank');
          return;
        }
        getRankDetail(this.top.id).then((res) => {
          console.log(res.code);
          if (res.code === ERR_OK) {
            this.day = res.day_of_year;
            this.date = res.date;
            this.songList = this._normalizeList(res.songlist);
            console.log(this.songList);
          }
        })
      },
      _normalizeList (list) {
        let ret = [];
        list.forEach((song) => {
          if (song.data.songid && song.data.albumid) {
            ret.push(createSong(song.data));
          }
        });
        return ret;
      }
    },
    components: {
      musicList
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/style/variable.styl';
  .rank-detail
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    background: $color-background
    z-index: 200
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s linear
</style>