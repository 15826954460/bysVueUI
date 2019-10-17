<template>
  <div class="container">
    <p class="intro-text">
      手动撸一个移动端滚动日期选择器
      <br />支持年月日
    </p>
    <p class="text">当日期为： {{ dateVal }}</p>
    <WheelPicker ref="wheelpicker" @change="change" type="month" :startYear="1950"/>
  </div>
</template>
<script>
import WheelPicker from "@/components/WheelPicker/index.vue";
export default {
  name: "Wheel",
  components: {
    WheelPicker
  },
  data() {
    return {
      dateVal: ""
    };
  },
  computed: {},
  mounted() {},
  methods: {
    change(value) {
      this.dateVal = value;
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
</style>
