
<template>
  <div ref="progressbg" class="touch-container" :style="{...touchBoxStyle}">
    <div ref="dotEl" class="dot transformY" :style="{...dotStyle, left: pcocessNumber + '%'}"></div>
    <div class="process" :style="{...processStyle, width: pcocessNumber + '%'}"></div>
  </div>
</template>

<script>
export default {
  name: 'TouchProgress',
  props: {
    pcocessNumber: {
      type: Number,
      default: 0
    },
    touchBoxStyle: {
      type: Object,
      default: () => {}
    },
    dotStyle: {
      type: Object,
      default: () => {}
    },
    processStyle: {
      type: Object,
      default: () => {}
    }
  },
  components: {},
  data() {
    return {
      processWith: 0,
      dotWidth: 0,
      isTouch: "ontouchstart" in window,
      touchStatus: {
        isTouchStart: false,
        isTouchMove: false,
        isTouchEnd: false,
        isTouchCancel: false
      },
      processRect: null
    };
  },
  computed: {},
  created() {},
  mounted() {
    this._registerLisenter();
    this._getProcessW();
    this._getBoundingClientRect();
  },
  methods: {
    _getProcessW() {
      this.processWith = this.$refs.progressbg.offsetWidth;
      this.dotWidth = this.$refs.dotEl.offsetWidth;
    },
    _getBoundingClientRect() {
      this.processRect = this.$refs.progressbg.getBoundingClientRect();
    },
    _registerLisenter() {
      let dotEl = this.$refs.progressbg;
      if (this.isTouch) {
        dotEl.addEventListener("touchstart", this._touchStart, false);
        dotEl.addEventListener("touchmove", this._touchMove, false);
        dotEl.addEventListener("touchend", this._touchEnd, false);
        dotEl.addEventListener("touchcancel", this._touchCancel, false);
      }
    },
    _preventDefaultEnent(e) {
      if (e.cancelable) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    _touchStart(e) {
      this._preventDefaultEnent(e);
      this.touchStatus.isTouchStart = true;
    },
    _touchMove(e) {
      this._preventDefaultEnent(e);
      this.touchStatus.isTouchMove = true;
      let endx = e.changedTouches[0].pageX;
      endx = Math.max(0, endx - this.processRect.x);
      this._calDotPos(endx);
      this.$emit("change", this._calDotPos(endx));
    },
    _touchEnd(e) {
      this._preventDefaultEnent(e);
      this.touchStatus.isTouchEnd = true;
      this.touchStatus.isTouchStart = false;
      this.touchStatus.isTouchMove = false;
      let endx = e.changedTouches[0].pageX;
      endx = Math.max(0, endx - this.processRect.x);
      this.$emit("change", this._calDotPos(endx));
    },
    _calDotPos(endx, type) {
      let val =
        (
          Math.min(endx, this.processWith - this.dotWidth) / this.processWith
        ).toFixed(2) * 100;
      type && console.log(val);
      return val;
    },
    _touchCancel(e) {
      this._preventDefaultEnent(e);
      this.touchStatus.isTouchCancel = true;
      this.touchStatus.isTouchStart = false;
      this.touchStatus.isTouchMove = false;
    }
  }
};
</script>

<style scoped lang="scss">
.touch-container {
  padding: 0;
  margin: 0;
  position: relative;
  width: 100%;
  background: rgba(0, 0, 0, 1);
  height: 4px;
  border-radius: 2px;
}
.dot {
  position: absolute;
  left: 0;
  bottom: 50%;
  width: 14px;
  height: 14px;
  border-radius: 7px;
  background: rgba(54, 146, 245, 1);
}
.transformY {
  transform: translateY(50%);
  -ms-transform: translateY(50%);
  -webkit-transform: translateY(50%);
  -o-transform: translateY(50%);
  -moz-transform: translateY(50%);
}
.process {
  position: absolute;
  left: 0;
  height: 100%;
  background: rgba(54, 146, 245, 1);
}
</style>
