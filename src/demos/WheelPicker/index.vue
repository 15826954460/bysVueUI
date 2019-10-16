<template>
  <transition name="wheelselect">
    <div class="container">
      <p class="intro-text">
        手动撸一个移动端滚动日期选择器
        <br />支持年月日
      </p>
      <p class="text">当日期为： {{ date }}</p>
      <div class="wheel-select-wrapper">
        <p class="wheel-title flex rsbc">
          <span class="btn-cancel btn" @click.stop="cancel">cacel</span>
          <span class="btn-done btn" @click.stop="done">done</span>
        </p>
        <DataPicker ref="smoothPicker" :data="wheelList" :change="change"></DataPicker>
      </div>
    </div>
  </transition>
</template>

<script>
import DataPicker from "@/components/WheelPicker/index.vue";
const MouthList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
export default {
  name: "DateWheel",
  data() {
    return {
      yearValue: "",
      monthValue: "",
      dayValue: "",
      date: "",
      wheelList: [
        {
          boxStyle: {},
          itemStyle: {},
          currentIndex: this.cearteYearList().length - 1,
          list: this.cearteYearList()
        },
        {
          boxStyle: {},
          itemStyle: {},
          currentIndex: new Date().getMonth(),
          list: this.createMouth()
        },
        {
          boxStyle: {},
          itemStyle: {},
          currentIndex: new Date().getDate() - 1,
          list: this.createDay()
        }
      ]
    };
  },
  computed: {},
  components: {
    DataPicker
  },
  mounted() {
    this.initDate();
    console.log(this.createDay());
  },
  methods: {
    initDate() {
      this.yearValue = new Date().getFullYear();
      this.monthValue = MouthList[new Date().getMonth()];
      this.dayValue = new Date().getDate();
      this.date = `${this.yearValue} / ${this.monthValue} / ${this.dayValue}`;
    },
    cancel() {
      this.initDate();
    },
    done() {
      this.date = `${this.yearValue} / ${this.monthValue} / ${this.dayValue}`;
    },
    change(gIndex, iIndex) {
      if (gIndex === 0) {
        this.yearValue = this.wheelList[gIndex].list[iIndex].value;
      } else if (gIndex === 1){
        this.monthValue = this.wheelList[gIndex].list[iIndex].value;
      } else {
        this.dayValue = this.wheelList[gIndex].list[iIndex].value;
      }
    },
    cearteYearList() {
      let _yearList = [];
      let _startYear = 1950;
      let _currentYear = new Date().getFullYear();
      while (_startYear <= _currentYear) {
        _yearList.push({ value: _startYear });
        _startYear += 1;
      }
      return _yearList;
    },
    createMouth() {
      let _mouthList = [];
      let _i = 1;
      while (_i <= 12) {
        _mouthList.push({ value: _i });
        _i += 1;
      }
      return _mouthList;
    },
    createDay() {
      let _currentYear = new Date().getFullYear();
      let _currnetMonth = new Date().getMonth() + 1;
      let _arr31 = [1,3,5,7,8,10,12];
      let _arr30 = [4,6,9,11];
      let _days = [];
      if (_arr31.includes(_currnetMonth)) {
        _days = this.cerateDayList(31);
      }
      if (_arr30.includes(_currnetMonth)) {
        _days = this.cerateDayList(30);
      }
      if (_currentYear % 4 === 0 && _currnetMonth === 2) {
        _days = this.cerateDayList(29);
      }
      if (_currentYear % 4 !== 0 && _currnetMonth === 2) {
        _days = this.cerateDayList(28);
      }
      return _days;
    },
    cerateDayList(num) {
      let _dayList = [];
      let _i = 1;
      while (_i <= num) {
        _dayList.push({ value: _i });
        _i += 1;
      }
      return _dayList;
    }
  }
};
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100vh;
}
.intro-text {
  left: 50%;
  color: blueviolet;
  text-align: center;
}
.text {
  text-align: center;
}
.wheel-select-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 15;
  height: 194px;
  background: #fff;
  .wheel-title {
    height: 44px;
    line-height: 44px;
    padding: 0 16px;
    border-bottom: 1px solid rgba(245, 245, 245, 1);
  }
  .btn {
    font-size: 14px;
    font-family: Roboto-Regular, Roboto;
    font-weight: 400;
  }
  .btn-cancel {
    color: rgba(191, 191, 191, 1);
  }
  .btn-done {
    color: rgba(54, 146, 245, 1);
  }
}

.wheelselect-enter-active {
  animation: wheelselect-in-bottom-left 0.1s;
}
.wheelselect-leave-active {
  animation: wheelselect-out-bottom-left 0.1s;
}
@keyframes wheelselect-in-bottom-left {
  0% {
    bottom: -180px;
  }
  50% {
    bottom: -90px;
  }
  100% {
    bottom: 0;
  }
}
@keyframes wheelselect-out-bottom-left {
  0% {
    bottom: 0;
  }
  50% {
    bottom: -9px;
  }
  100% {
    bottom: -180px;
  }
}
</style>
