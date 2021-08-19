<template>
  <section class="app-main">
    <!-- <transition name="fade-transform" mode="out-in"> -->
    <!-- <router-view :key="key" /> -->
    <!-- <keep-alive :include="keepAlive">
        <router-view ></router-view>
      </keep-alive> -->
    <transition name="fade-transform" mode="out-in">
      <keep-alive :max="2">
        <!-- 需要缓存的视图组件 -->
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
    <transition name="fade-transform" mode="out-in">
      <!-- 不需要缓存的视图组件 -->
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition>
    <!-- </transition> -->
  </section>
</template>

<script>
import { mount } from "@vue/test-utils";
export default {
  name: "AppMain",
  computed: {
    key() {
      return this.$route.fullPath;
    },
  }, 
};
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  height: calc(100vh - 1.14rem);
  /* min-height: calc(100vh - 1.14rem); */
  width: 100%;
  position: relative;
  overflow: hidden;
  padding: 0.15rem;
  padding-bottom: 0;
}
.fixed-header + .app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 0.15rem;
  }
}
</style>
