<template>
  <transition name="wheelselect">
    <div class="wheel-select-wrapper">
      <p class="wheel-title flex rsbc">
        <span class="btn-cancel btn" @click.stop="cancel">cacel</span>
         <span class="btn-done btn" @click.stop="done">done</span>
      </p>
      <DataPicker ref="smoothPicker" :arrList="initWheelList()" :change="change"></DataPicker>
    </div>
  </transition>
</template>

<script>
import DataPicker from "@/components/WheelPicker/picker.vue";
const MouthList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const CurrentYear = new Date().getFullYear();
const CurrnetMonth = new Date().getMonth();
const CurrentDay = new Date().getDate();
export default {
  name: "Picker",
  props: {
    startYear: {
      type: [ Number, String ],
      default: 1950,
    },
    type: {
      type: String,
      default: 'day'
    }
  },
  components: {
    DataPicker
  },
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
          list: this.cearteYearList() // 创建年 
        },
        {
          boxStyle: {},
          itemStyle: {},
          currentIndex: new Date().getMonth(),
          list: this.createMouth() // 创建月份  
        },
        {
          boxStyle: {},
          itemStyle: {},
          currentIndex: new Date().getDate() - 1,
          list: this.createDay() // 根据月份创建天 
        }
      ]
    };
  },
  computed: {
    wheelListLen() {
      let _len = 3;
      if (this.type === 'month') {
        _len = 2;
      }
      return _len;
    },
  },
  mounted() {
    this.initDate();
  },
  methods: {
    initWheelList() {
      let _wheelList = [];
      if (this.type === 'month') {
        _wheelList = this.wheelList.slice(0, this.wheelList.length - 1);
      } else {
        _wheelList = this.wheelList;
      }
      return _wheelList;
    },
    initDate() {
      this.yearValue = CurrentYear;
      this.monthValue = MouthList[CurrnetMonth];
      this.dayValue = CurrentDay;
      if (this.wheelListLen === 2) {
        this.date = `${this.yearValue} / ${this.monthValue}`
      } else {
        this.date = `${this.yearValue} / ${this.monthValue} / ${this.dayValue}`;
      }
      this.$emit('change', this.date);
    },
    cancel() {
      this.initDate();
    },
    done() {
      if (this.wheelListLen === 2) {
        this.date = `${this.yearValue} / ${this.monthValue}`
      } else {
        this.date = `${this.yearValue} / ${this.monthValue} / ${this.dayValue}`;
      }
      this.$emit('change', this.date);
    },
    change(gIndex, iIndex) {
      if (gIndex === 0) {
        this.yearValue = this.wheelList[gIndex].list[iIndex].value;
        (this.wheelListLen === 3) && this.cualDaysChange(gIndex, iIndex, this.createDay(this.yearValue, this.monthValue));
      } else if (gIndex === 1){
        this.monthValue = this.wheelList[gIndex].list[iIndex].value;
        // 跟据选择的年份和月份来显示对应的月的天数
        (this.wheelListLen === 3) && this.cualDaysChange(gIndex, iIndex, this.createDay(this.yearValue, this.monthValue));
      } else {
        this.dayValue = this.wheelList[gIndex].list[iIndex].value;
      }
    },
    cualDaysChange(gIndex, iIndex, daysList) {
      let newDayList = this.wheelList;
      newDayList[gIndex].currentIndex = iIndex; // 设置当前手动选择的index
      newDayList[2].list = daysList; // 跟新
      if (daysList.length >= new Date().getDate()) {
        // 如果当前选择的月份有当前天数就默认选择当前天数
        newDayList[2].currentIndex = new Date().getDate() - 1;
      } else {
        // 否则选择当月的最后天
        newDayList[2].currentIndex = daysList.length - 1;
      }
      this.wheelList = newDayList;
      this.$refs.smoothPicker.getInitialCurrentIndexList();
      this.$refs.smoothPicker.setGroupData(2, newDayList[2]);
      this.$refs.smoothPicker.getGroupsRectList();
    },
    cearteYearList() {
      let _yearList = [];
      let _startYear = 1950;
      let _currentYear = CurrentYear;
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
    createDay(year, mouth) {
      let _currentYear = year || CurrentYear;
      let _currnetMonth = mouth || (CurrnetMonth + 1);
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
