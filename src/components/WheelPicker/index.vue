<template>
  <div class="smooth-picker flex">
    <div
      ref="smoothGroup"
      v-for="(group, gIndex) in data"
      :key="gIndex"
      class="smooth-group"
      :style="{flex: 1, ...group.boxStyle}"
    >
      <div class="smooth-list">
        <div
          v-if="group.divider"
          class="smooth-item divider"
          :style="{...group.itemStyle}"
        >{{ group.text }}</div>

        <div
          v-else
          v-for="(item, iIndex) in group.list"
          :key="iIndex"
          class="smooth-item"
          :style="{...group.itemStyle, ..._getItemStyle(gIndex, iIndex)}"
        >{{ item.value || item }}</div>
      </div>
    </div>

    <!-- 透明层 -->
    <div ref="smoothHandleLayer" class="smooth-handle-layer">
      <div data-type="top" class="smooth-top flex-1"></div>
      <div data-type="middle" class="smooth-middle"></div>
      <div data-type="bottom" class="smooth-bottom flex-1"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WheelPicker",
  props: {
    data: {
      type: Array,
      default: () => []
    },
    change: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      gIndex: 0,
      iIndex: 0,
      currentIndexList: this._getInitialCurrentIndexList(),
      lastCurrentIndexList: [],
      groupsRectList: new Array(this.data.length), // 保存元素相关位置信息列表
      dragInfo: {
        isTouchable: "ontouchstart" in window,
        isMouseDown: false,
        isDragging: false,
        groupIndex: null,
        startPageY: null
      },
      supInfo: {
        getRectTimeoutId: null,
        lastStyleDisplay: null,
        watchDomObserver: null
      }
    };
  },
  mounted() {
    this._eventsRegister();
    this.$nextTick(this.getGroupsRectList());
    this.supInfo.watchDomObserver = this._createDomObserver();
    this.supInfo.watchDomObserver.observe(this.$el, { attributes: true });
    window.addEventListener("resize", this._safeGetGroupRectList);
  },
  destroyed() {
    this.supInfo.watchDomObserver.disconnect();
    window.removeEventListener("resize", this._safeGetGroupRectList);
  },
  methods: {
    // 对外暴露的方法
    getCurrentIndexList() {
      return this.currentIndexList;
    },
    // 对外暴露的方法
    setGroupData(gIndex, groupData) {
      const iCI = groupData.currentIndex;
      let movedIndex = 0;
      if (
        typeof iCI === "number" &&
        iCI >= 0 &&
        groupData.list &&
        groupData.list.length &&
        iCI <= groupData.list.length - 1
      ) {
        movedIndex = Math.round(iCI);
      }
      this.currentIndexList[gIndex] = movedIndex;
      this.lastCurrentIndexList = [].concat(this.currentIndexList);
      this._safeGetGroupRectList();
      this.$set(this.data, gIndex, groupData);
    },
    // 对外暴露的方法
    getGroupsRectList() {
      if (this.$refs.smoothGroup) {
        this.$refs.smoothGroup.forEach((item, index) => {
          this.groupsRectList[index] = item.getBoundingClientRect();
        });
      }
    },
    // 初始化当前下标的列表
    _getInitialCurrentIndexList() {
      return this.data.map((item, index) => {
        const iCI = item.currentIndex;
        if (
          typeof iCI === "number" &&
          iCI >= 0 &&
          item.list &&
          item.list.length &&
          iCI <= item.list.length - 1
        ) {
          return Math.round(iCI);
        }
        return 0;
      });
    },
    // 创建dom变化监听
    _createDomObserver() {
      return new window.MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.type === "attributes") {
            const elDisplay = this.$el.style.display;
            if (
              elDisplay !== "none" &&
              this.supInfo.lastStyleDisplay !== elDisplay
            ) {
              this.supInfo.lastStyleDisplay = elDisplay;
              this.$nextTick(this.getGroupsRectList());
            }
          }
        });
      });
    },
    _safeGetGroupRectList() {
      this.supInfo.getRectTimeoutId &&
        clearTimeout(this.supInfo.getRectTimeoutId);
      this.supInfo.getRectTimeoutId = setTimeout(() => {
        this.getGroupsRectList();
      }, 200);
    },
    // 注册相关事件
    _eventsRegister() {
      const handleEventLayer = this.$refs.smoothHandleLayer;
      if (handleEventLayer) {
        this._addEventsForElement(handleEventLayer);
      }
    },
    // 添加手势事件
    _addEventsForElement(el) {
      const _ = this.dragInfo.isTouchable;
      const eventHandlerList = [
        { name: _ ? "touchstart" : "mousedown", handler: this._handleStart },
        { name: _ ? "touchmove" : "mousemove", handler: this._handleMove },
        { name: _ ? "touchend" : "mouseup", handler: this._handleEnd },
        { name: _ ? "touchcancel" : "mouseleave", handler: this._handleCancel }
      ];
      // 给遮罩层添加事件监听
      eventHandlerList.forEach((item, index) => {
        el.removeEventListener(item.name, item.handler, false);
        el.addEventListener(item.name, item.handler, false);
      });
    },
    _triggerMiddleLayerGroupClick(gIndex) {
      const data = this.data;
      if (
        typeof gIndex === "number" &&
        typeof data[gIndex].onClick === "function"
      ) {
        data[gIndex].onClick(gIndex, this.currentIndexList[gIndex]);
      }
    },
    _handleEventClick(ev) {
      const gIndex = this._getGroupIndexBelongsEvent(ev);
      switch (ev.target.dataset.type) {
        case "top":
          this._triggerAboveLayerClick(ev, gIndex);
          break;
        case "middle":
          this._triggerMiddleLayerClick(ev, gIndex);
          break;
        case "bottom":
          this._triggerBelowLayerClick(ev, gIndex);
          break;
        default:
      }
    },
    _triggerAboveLayerClick(ev, gIndex) {
      const movedIndex = this.currentIndexList[gIndex] + 1;
      this.$set(this.currentIndexList, gIndex, movedIndex);
      this._correctionCurrentIndex(ev, gIndex);
    },
    _triggerMiddleLayerClick(ev, gIndex) {
      this._triggerMiddleLayerGroupClick(gIndex);
    },
    _triggerBelowLayerClick(ev, gIndex) {
      const movedIndex = this.currentIndexList[gIndex] - 1;
      this.$set(this.currentIndexList, gIndex, movedIndex);
      this._correctionCurrentIndex(ev, gIndex);
    },
    _getGroupIndexBelongsEvent(ev) {
      const touchInfo = this._getTouchInfo(ev);
      for (let i = 0; i < this.groupsRectList.length; i++) {
        const item = this.groupsRectList[i];
        if (item.left < touchInfo.pageX && touchInfo.pageX < item.right) {
          return i;
        }
      }
      return null;
    },
    _getTouchInfo(ev) {
      return this.dragInfo.isTouchable
        ? ev.changedTouches[0] || ev.touches[0]
        : ev;
    },
    _handleStart(ev) {
      if (ev.cancelable) {
        ev.preventDefault();
        ev.stopPropagation();
      }
      const touchInfo = this._getTouchInfo(ev);
      this.dragInfo.startPageY = touchInfo.pageY;
      if (!this.dragInfo.isTouchable) {
        this.dragInfo.isMouseDown = true;
      }
    },
    _handleMove(ev) {
      if (ev.cancelable) {
        ev.preventDefault();
        ev.stopPropagation();
      }
      if (this.dragInfo.isTouchable || this.dragInfo.isMouseDown) {
        this.dragInfo.isDragging = true;
        this._setCurrentIndexOnMove(ev);
      }
    },
    _handleEnd(ev) {
      if (ev.cancelable) {
        ev.preventDefault();
        ev.stopPropagation();
      }
      if (!this.dragInfo.isDragging) {
        this._handleEventClick(ev);
      }
      this.dragInfo.isDragging = false;
      this.dragInfo.isMouseDown = false;
      this._correctionAfterDragging(ev);
    },
    _handleCancel(ev) {
      if (ev.cancelable) {
        ev.preventDefault();
        ev.stopPropagation();
      }
      if (this.dragInfo.isTouchable || this.dragInfo.isMouseDown) {
        this._correctionAfterDragging(ev);
        this.dragInfo.isMouseDown = false;
        this.dragInfo.isDragging = false;
      }
    },
    _setCurrentIndexOnMove(ev) {
      const touchInfo = this._getTouchInfo(ev);
      if (this.dragInfo.groupIndex === null) {
        this.dragInfo.groupIndex = this._getGroupIndexBelongsEvent(ev);
      }
      const gIndex = this.dragInfo.groupIndex;
      if (
        typeof gIndex === "number" &&
        (this.data[gIndex].divider || !this.data[gIndex].list)
      ) {
        return;
      }
      const moveCount = (this.dragInfo.startPageY - touchInfo.pageY) / 30;
      const movedIndex = this.currentIndexList[gIndex] + moveCount;
      this.$set(this.currentIndexList, gIndex, movedIndex);
      this.dragInfo.startPageY = touchInfo.pageY;
    },
    _correctionAfterDragging(ev) {
      const gIndex = this.dragInfo.groupIndex;
      this._correctionCurrentIndex(ev, gIndex);
      this.dragInfo.groupIndex = null;
      this.dragInfo.startPageY = null;
    },
    _correctionCurrentIndex(ev, gIndex) {
      let timer = setTimeout(() => {
        if (
          typeof gIndex === "number" &&
          this.data[gIndex].divider !== true &&
          this.data[gIndex].list.length > 0
        ) {
          const unsafeGroupIndex = this.currentIndexList[gIndex];
          let movedIndex = unsafeGroupIndex;
          if (unsafeGroupIndex > this.data[gIndex].list.length - 1) {
            movedIndex = this.data[gIndex].list.length - 1;
          } else if (unsafeGroupIndex < 0) {
            movedIndex = 0;
          }
          movedIndex = Math.round(movedIndex);
          this.$set(this.currentIndexList, gIndex, movedIndex);
          if (movedIndex !== this.lastCurrentIndexList[gIndex]) {
            this.change(gIndex, movedIndex);
          }
          this.lastCurrentIndexList = [].concat(this.currentIndexList);
        }
        clearInterval(timer);
        timer = null;
      }, 100);
    },
    _isCurrentItem(gIndex, iIndex) {
      return this.currentIndexList[gIndex] === iIndex;
    },
    _getItemStyle(gIndex, iIndex) {
      // 一下滚动的角度根据实际情况可以进行调整
      const gapCount = this.currentIndexList[gIndex] - iIndex;
      if (Math.abs(gapCount) < 3) {
        let rotateStyle = {
          transform: `rotateX(${gapCount * 23}deg) translate3d(0, 0, 90px)`
        };
        if (!this.dragInfo.isDragging) {
          rotateStyle = {
            ...rotateStyle,
            transition: `transform 150ms ease-out`
          };
        }
        return rotateStyle;
      }
      // 一下逻辑时不会执行 后期根据实际需求进行调整
      if (gapCount > 0) {
        return { transform: "rotateX(100deg) translate3d(0, 0, 90px)" };
      } else {
        return { transform: "rotateX(-100deg) translate3d(0, 0, 90px)" };
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.smooth-picker {
  font-size: 16px;
  height: 150px;
  position: relative;
  background-color: #fff;
  overflow: hidden;
}
.smooth-group {
  text-align: center;
}
.smooth-list {
  position: relative;
  top: 60px;
  height: 100px;
  width: 100%;
  .smooth-item {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    text-align: center;
    will-change: transform; // 告知浏览器元的的变化
    contain: strict; // 将规则应用于当前元素
  }
}

.smooth-handle-layer {
  position: absolute;
  width: 100%;
  height: 150px;
  left: 0;
  right: 0;
  top: -1px;
  bottom: -1px;
  display: flex;
  flex-direction: column;
  z-index: 100;
  .smooth-top {
    border-bottom: 1px solid #c8c7cc;
    background: linear-gradient(180deg, #fff 0%, hsla(0, 0%, 100%, 0.2));
    -webkit-transform: translateZ(90px);
    transform: translateZ(90px);
  }

  .smooth-middle {
    height: 30px;
  }

  .smooth-bottom {
    border-top: 1px solid #c8c7cc;
    background: linear-gradient(0deg, #fff 0%, hsla(0, 0%, 100%, 0.1));
    -webkit-transform: translateZ(90px);
    transform: translateZ(90px);
  }
}

.flex {
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}

.direction-column {
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
}

.direction-row {
  -webkit-flex-direction: row;
  -ms-flex-direction: row;
  flex-direction: row;
}

.flex-1 {
  flex: 1;
}
</style>
