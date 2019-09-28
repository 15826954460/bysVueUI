<template>
  <div class="touch-progress-container vw100 vh100 ">
    <p class="intro-text">手动撸一个移动端进度条 <br> 支持点击和拖拽</p>
    <div class="touch-com-wrapper flex ccc">
       <TouchProgress @change="getTouchProgress" :pcocessNumber="pcocessNumber"></TouchProgress>
    </div>
  </div>
</template>

<script>
import TouchProgress from "@/components/TouchProgress/index.vue";
export default {
  components: { TouchProgress },
  data() {
    return {
      pcocessNumber: 0,
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    getTouchProgress(val) {
      this.pcocessNumber = val;
      console.log(val)
    }
  }
};
</script>

<style scoped lang="scss">
.touch-progress-container {
  padding: 30px 50px;
  .touch-com-wrapper {
    height: 100%;
    width: 100%;
  }
  .intro-text {
    left: 50%;
    color: blueviolet;
    text-align: center;
  }
}
</style>
