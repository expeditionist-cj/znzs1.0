<template>
  <div ref="tlxl" style="height:100%;">
    <div :class="{ showFullScreen: showFullScreen }">
      <div class="title">
        <span>{{ title }}</span>
        <!-- 显示全屏图标 -->
        <div class="fullScreen">
          <img
            class="fullScreen-img"
            src="@/assets/images/fullScreen.png"
            alt
            @click="changeFullScreen"
            v-show="!showFullScreen"
          />
          <img
            class="fullScreen-img"
            src="@/assets/images/back.png"
            alt
            @click="changeFullScreen"
            v-show="showFullScreen"
          />
        </div>
      </div>
      <div class="diagram" ref="diagram">
        <div :style="{ height: canvasHeight }">
          <v-chart autoresize :options="options" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Tlxl",
  props: {
    title: {
      type: String,
      default: "",
    },
    options: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      showFullScreen: false,
      canvasHeight: "2rem",
    };
  },
  mounted() {
    this.canvasHeight = this.$refs.tlxl.offsetHeight / 100 + 0.5 + "rem";
     
  },
  watch: {
    showFullScreen(value) {
      if (value) {
        var h =
          window.innerHeight ||
          document.documentElement.clientHeight ||
          document.body.clientHeight;
        this.canvasHeight = "calc(" + (h / 100 -1) + "rem)";
      } else {
        this.canvasHeight = this.$refs.tlxl.offsetHeight / 100 + 0.5 + "rem";
      }
    },
  },
  methods: {
    changeFullScreen() {
      this.showFullScreen = !this.showFullScreen;
    },
  },
};
</script>
<style lang="scss" scoped>
.title {
  display: flex;
  justify-content: space-between;

  .fullScreen {
    width: 0.3rem;
    height: 0.3rem;
    background: rgba(241, 241, 241, 0.1);
    border-radius: 0.05rem;
    display: flex;
    align-items: center;
    .fullScreen-img {
      width: 0.18rem;
      margin: 0 auto;
      cursor: pointer;
    }
  }
}
.diagram {
  width: 100%;
  height: 100%;
}
.showFullScreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  padding: 2% 1%;
  background-color: #253553;
}
</style>
<style>
.echarts {
  width: 100%;
  height: 100%;
}
</style>