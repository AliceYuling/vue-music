<template>
  <div class="player" v-show="playList.length>0">
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img width="100%" height="100%" :src="currentSong.image">
      </div>
      <div class="top">
        <div class="back" @click="back">
          <i class="icon-back"></i>
        </div>
        <h1 class="song-name" v-html="currentSong.name"></h1>
        <h2 class="singer" v-html="currentSong.singer"></h2>
      </div>
      <div class="middle" @touchstart="middleTouchStart" @touchmove.prevent="middleTouchMove" @touchend="middleTouchEnd">
        <div class="middle-left" ref="middlel">
          <div class="cd-wrapper">
            <div class="cd" :class="{'cd-rotate': playing, 'rotate-pause': !playing}">
              <img class="cd-image" :src="currentSong.image">
            </div>
          </div>
          <div class="playing-lyric-wrapper">
            <div class="playing-lyric">{{playingLyric}}</div>
          </div>
        </div>
        <scroll class="middle-right" :data="currentLyric && currentLyric.lines" ref="lyricList">
          <div class="lyric-wrapper">
            <div class="lyric" v-if="currentLyric">
              <p class="text" :class="{'current':currentLine===index}" ref="lyricLine" v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
            </div>
          </div>
        </scroll>
      </div>
      <div class="bottom">
        <div class="dot-wrapper">
          <span class="dot" :class="{'current':currentShow==='cd'}"></span>
          <span class="dot" :class="{'current':currentShow==='lyric'}"></span>
        </div>
        <div class="progress-wrapper">
          <span class="time time-l">{{formatTime(currentTime)}}</span>
          <div class="progress-bar-wrapper">
            <progress-bar :percent="percent" @updatePercent="updatePercent"></progress-bar>
          </div>
          <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
        </div>
        <div class="operator">
          <div class="icon" @click="changeMode">
            <i :class="iconMode"></i>
          </div>
          <div class="icon" :class="disableCls">
            <i class="icon-prev" @click="prev"></i>
          </div>
          <div class="icon" :class="disableCls">
            <i @click="togglePlaying" :class="iconControl"></i>
          </div>
          <div class="icon" :class="disableCls">
            <i class="icon-next" @click="next"></i>
          </div>
          <div class="icon">
            <i class="icon-favorite"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="playlist-wrapper" v-show="showList">
      <playlist @closePlayList="closePlayList"></playlist>
    </div>
    <div class="mini-player" v-show="!fullScreen" @click="open">
      <div class="mini-image">
        <img class="image" :src="currentSong.image">
      </div>
      <div class="song-desc">
        <p class="name" v-html="currentSong.name"></p>
        <p class="singer" v-html="currentSong.singer"></p>
      </div>
      <div class="control">
        <progress-circle :radius="radius">
          <i :class="miniIconControl" @click.stop.prevent="togglePlaying"></i>
        </progress-circle>
      </div>
      <div class="control" @click.stop.prevent="showPlayList">
        <i class="icon-playlist"></i>
      </div>
    </div>
    <audio ref="audio" :src="currentSong.url" @canplay="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>

<script type="ecmascript-6">
  import {mapGetters, mapMutations, mapActions} from 'vuex';
  import ProgressBar from 'base/progress-bar/progress-bar';
  import ProgressCircle from 'base/progress-circle/progress-circle';
  import {getRandomArray} from 'common/js/utils';
  import {playMode} from 'common/js/config.js';
  import Lyric from 'lyric-parser';
  import Scroll from 'base/scroll/scroll';
  import {prefixStyle} from 'common/js/dom';
  import Playlist from 'components/playlist/playlist';

  const transform = prefixStyle('transform');
  // const LINE_HIEGHT = 20;
  export default {
    data () {
      return {
        playReady: false,
        currentTime: 0,
        radius: 32,
        currentLyric: null,
        currentLine: 0,
        currentShow: 'cd',
        playingLyric: '',
        showList: false
      };
    },
    computed: {
      miniIconControl () {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini';
      },
      iconControl () {
        return this.playing ? 'icon-pause' : 'icon-play';
      },
      disableCls () {
        return this.playReady ? '' : 'disable';
      },
      percent () {
        return this.currentTime / this.currentSong.duration;
      },
      iconMode () {
        return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random';
      },
      ...mapGetters([
        'fullScreen',
        'playList',
        'currentSong',
        'playing',
        'currentIndex',
        'mode',
        'sequenceList'
      ])
    },
    created () {
      this.touch = {};
    },
    methods: {
      back () {
        this.setFullScreen(false);
      },
      open () {
        this.setFullScreen(true);
      },
      showPlayList () {
        this.showList = true;
      },
      closePlayList () {
        console.log('close play list');
        this.showList = false;
      },
      togglePlaying () {
        this.setPlaying(!this.playing);
        if (this.currentLyric) {
          this.currentLyric.togglePlay();
        }
      },
      prev () {
        if (!this.playReady) {
          return;
        }
        if (this.playList.length === 1) {
          this.loop();
        } else {
          let index = this.currentIndex - 1;
          if (index === -1) {
            index = this.playList.length - 1;
          }
          this.setCurrentIndex(index);
          if (!this.playing) {
            this.togglePlaying();
          }
        }
        this.playReady = false;
      },
      next () {
        if (!this.playReady) {
          return;
        }
        if (this.playList.length === 1) {
          this.loop();
        } else {
          let index = this.currentIndex + 1;
          if (index === this.playList.length) {
            index = 0;
          }
          this.setCurrentIndex(index);
          if (!this.playing) {
            this.togglePlaying();
          }
        }
        this.playReady = false;
      },
      end () {
        if (this.mode === playMode.loop) {
          this.loop();
        } else {
          this.next();
        }
      },
      loop () {
        this.$refs.audio.currentTime = 0;
        this.$refs.audio.play();
        if (this.currentLyric) {
          this.currentLyric.seek();
        }
      },
      changeMode () {
        let modeIndex = (this.mode + 1) % 3;
        this.setPlayMode(modeIndex);
        let list = null;
        if (this.mode === playMode.random) {                                      // 随机播放
          list = getRandomArray(this.playList);
        } else {
          list = this.sequenceList;
        }
        this.setPlayList(list);
        this.resetCurrentIndex(list, this.currentSong);
      },
      resetCurrentIndex (list, song) {
        let index = list.findIndex((item) => {
          return item.id === this.currentSong.id;
        });
        this.setCurrentIndex(index);
      },
      ready () {
        this.playReady = true;
      },
      error () {
        this.playReady = true;
      },
      updateTime (e) {
        this.currentTime = e.target.currentTime;
      },
      updatePercent (percent) {
        const currentTime = percent * this.currentSong.duration;
        this.$refs.audio.currentTime = currentTime;
        if (!this.playing) {
          this.togglePlaying();
        }
        if (this.currentLyric) {
          this.currentLyric.seek(currentTime * 1000);
        }
      },
      _pad (num, n = 2) {
        let len = num.toString().length;
        while (len < n) {
          num = '0' + num;
          len++;
        }
        return num;
      },
      formatTime (time) {
        time = time | 0;
        const min = this._pad(time / 60 | 0);
        const sec = this._pad(time % 60);
        return `${min}:${sec}`;
      },
      getLyric () {
        this.currentSong.getLyric().then((lyric) => {
          this.currentLyric = new Lyric(lyric, this.handleLyric);
          if (this.playing) {
            this.currentLyric.play();
          }
          // console.log(this.currentLyric);
        }).catch(() => {
          this.currentLyric = null;
          this.playingLyric = '';
        });
      },
      handleLyric ({lineNum, txt}) {
        this.currentLine = lineNum;
        // console.log(this.currentLine);
        if (lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5];
          this.$refs.lyricList.scrollToElement(lineEl, 1000);
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000);
        }
        this.playingLyric = txt;
      },
      middleTouchStart (e) {
        this.touch.initiated = true;
        this.touch.startX = e.touches[0].pageX;
        this.touch.startY = e.touches[0].pageY;
      },
      middleTouchMove (e) {
        if (!this.touch.initiated) {
          return;
        }
        const touch = e.touches[0];
        const deltaX = touch.pageX - this.touch.startX;
        const deltaY = touch.pageY - this.touch.startY;
        // console.log('deltaX' + deltaX);
        // console.log('deltaY' + deltaY);
        if (Math.abs(deltaY) > Math.abs(deltaX)) {                // 纵轴偏移大于横轴偏移时，不进行左右移动
          return;
        }
        // console.log('window' + window.innerWidth);
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth;
        const width = Math.min(0, Math.max(-window.innerWidth, left + deltaX));
        this.touch.percent = Math.abs(width / window.innerWidth);
        this.$refs.lyricList.$el.style[transform] = `translate3d(${width}px,0,0)`;
        this.$refs.middlel.style.opacity = 1 - this.touch.percent;
      },
      middleTouchEnd () {
        let width = 0;
        let opacity = 0;
        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.1) {
            width = -window.innerWidth;
            this.currentShow = 'lyric';
            opacity = 0;
          } else {
            width = 0;
            opacity = 1;
          }
        } else {
          if (this.touch.percent < 0.9) {
            width = 0;
            this.currentShow = 'cd';
            opacity = 1;
          } else {
            width = -window.innerWidth;
            opacity = 1;
          }
        }
        this.$refs.lyricList.$el.style[transform] = `translate3d(${width}px,0,0)`;
        this.$refs.middlel.style.opacity = opacity;
      },
      ...mapMutations({
        setFullScreen: 'SET_FULLSCREEN_STATE',
        setPlaying: 'SET_PLAYING_STATE',
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setPlayMode: 'SET_MODE',
        setPlayList: 'SET_PLAY_LIST'
      }),
      ...mapActions([
        'savePlayHistory'
      ])
    },
    watch: {
      currentSong (newSong, oldSong) {
        if (this.playList.length) {
          if (newSong.id === oldSong.id) {
            return;
          }
          if (this.currentLyric) {
            this.currentLyric.stop();
          }
          this.savePlayHistory(newSong);
          this.$nextTick(() => {
            this.$refs.audio.play();
            this.getLyric();
          });
        } 
      },
      playing (newPlaying) {
        const audio = this.$refs.audio;
        this.$nextTick(() => {
          if (newPlaying) {
            audio.play();
          } else {
            audio.pause();
          }
        });
      }
    },
    components: {
      ProgressBar,
      ProgressCircle,
      Scroll,
      Playlist
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/style/variable.styl'
  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 199
      background: $color-background
      .background
        position: absolute
        top: 0
        left: 0
        width:100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        width: 100%
        margin-bottom: 26px
        text-align: center
        .back
          position: absolute
          left: 10px
          top: 16px
          .icon-back
            display: inline-block
            font-size: $font-size-large
            color: $color-theme
            transform: rotate(-90deg)
        .song-name
          width: 75%
          margin: 16px auto
          font-size: $font-size-large
          color: $color-text
        .singer
          margin-top: 12px
          font-size: $font-size-medium-x
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 100px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        overflow: hidden
        .middle-left
          position: relative
          display: inline-block
          vertical-align: top
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            .cd
              border-radius: 50%
              animation: cdRotate 30s linear infinite
              &.cd-rotate
                animation-play-state: play
              &.rotate-pause
                animation-play-state: paused
              .cd-image
                width: 100%
                border-radius: 50%
          .playing-lyric-wrapper
            .playing-lyric
              width: 100%
              height: 40px
              line-height: 40px
              text-align: center
              font-size: $font-size-medium
              color: $color-text
        .middle-right
          display: inline-block
          position: relative
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            .lyric
              .text
                width: 100%
                line-height: 40px
                text-align: center
                color: $color-text-l
                font-size: $font-size-medium
                &.current
                  color: $color-text
      .bottom
        position: fixed
        bottom: 0
        height: 170px
        width: 100%
        .dot-wrapper
          width: 100%
          text-align: center
          .dot
            display: inline-block
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.current
              width: 20px
              border-radius: 5px
              color: $color-text
        .progress-wrapper
          margin-top: 20px
          display: flex
          .time
            display: block
            line-height: 30px
            flex: 0 0 50px
            text-align: center
            color: $color-text-l
            font-size: $font-size-small
            &.time-l
              margin-left: 10px
            &.time-r
              margin-right: 10px
          .progress-bar-wrapper
            display: inline-block
            flex: 1
        .operator
          width: 80%
          margin: 10px auto
          font-size: 0
          .icon
            display: inline-block
            width: 20%
            text-align: center
            color: $color-theme
            font-size: $font-size-large-x
            &.disable
              color: $color-theme-d     
            .icon-random
              display: inline-block
            .icon-prev
              display: inline-block
            .icon-play, .icon-pause
              display: inline-block
            .icon-next
              display: inline-block
            .icon-favorite
              display: inline-block
    .playlist-wrapper
      position: fixed
      width: 100%
      bottom: 63px
      height: 500px
      z-index: 150
      overflow: hidden
    .mini-player
      display: flex
      position: fixed
      bottom: 0
      z-index: 101
      width: 100%
      height: 64px
      background: $color-highlight-background
      .mini-image
        flex: 0 0 48px
        line-height: 64px
        padding-left: 10px
        margin-right: 8px
        vertical-align: middle
        width: 40px
        border-radius: 50%
        .image
          width: 40px
          height: 40px
          border-radius: 50%
          vertical-align: middle
      .song-desc
        flex: 1
        .name
          line-height: 32px
          font-size: $font-size-small-x
          color: $color-text
        .singer
          line-height: 32px
          font-size: $font-size-small
          color: $color-text-l
      .control
        flex: 0 0 48px
        width: 48px
        line-height: 64px
        .icon-playlist, .icon-play-mini, .icon-pause-mini
          color: $color-theme
          font-size: $font-size-large-x
          vertical-align: middle
  @keyframes cdRotate
    0%
      transform: rotate(0deg)
    100%
      transform: rotate(360deg)
</style>