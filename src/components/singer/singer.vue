<template>
  <div class="singer" ref="singer">
    <listview @select="selectSinger" :data="singers" ref="listview"></listview>
    <router-view></router-view>
  </div>
</template>

<script type="ecmascript-6">
  import {getSingerList} from 'api/singer';
  import {ERR_OK} from 'api/config';
  import Singer from 'common/js/singer';
  import Listview from 'base/listview/listview';
  import {mapMutations} from 'vuex';
  import {playListMixin} from 'common/js/mixin';
  const HOT_NAME = '热门';
  const HOT_LENGTH = 10;
  export default {
    mixins: [playListMixin],
    data () {
      return {
        singers: []
      };
    },
    created () {
      this._getSingerList();
    },
    methods: {
      _getSingerList () {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singers = this._normalizeSinger(res.data.list);
            // console.log(this.singers);
          }
        });
      },
      selectSinger (singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        });
        this.setSinger(singer);
      },
      _normalizeSinger (list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        };

        // 遍历歌手数组，将前十名歌手作为热门歌手
        list.forEach((item, index) => {
          if (index < HOT_LENGTH) {
            map.hot.items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }));
          }

          // 将歌手列表按首字母分组
          const key = item.Findex;

          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            };
          }

          map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }));
        });

        // 提取出歌手数组并按首字母排序
        let hot = [];
        let singer = [];
        for (let key in map) {
          if (map[key].title.match(/[a-zA-Z]/)) {
            singer.push(map[key]);
          } else if (map[key].title === HOT_NAME) {
            hot.push(map[key]);
          }
        }
        singer.sort(function (a, b) {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0);
        });
        // console.log(singer);
        return hot.concat(singer);
      },
      handlePlayList (playList) {
        const bottom = playList.length > 0 ? '63px' : '';
        console.log('bottom:' + bottom);
        this.$refs.singer.style.bottom = bottom;
        this.$refs.listview.refresh();
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    },
    components: {
      Listview
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 87px
    bottom: 0
    width:100%
</style>