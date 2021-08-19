<template>
  <div class="dashboard-wrap">
    <keep-alive include="['InstanceList','FirstStep','SecendStep']">
      <!-- vue 动态组件 -->
      <transition name="fade-transform" mode="out-in">
        <component v-bind:is="which_to_show"></component>
      </transition>
    </keep-alive>
  </div>
</template>

<script>
import InstanceList from "./instanceList/index";
import FirstStep from "./firstStep/index";
import SecendStep from "./secendStep/index";
import ThirdStep from "./thirdStep/index";
import Eng_sub_consume from "./eng_sub_consume/index"; // 能耗物耗配置页面
import { mapState } from "vuex"; // 引入vuex state
export default {
  props: {},
  data() {
    return {};
  },
  components: { InstanceList, FirstStep, SecendStep, ThirdStep,Eng_sub_consume },
  computed: {
    ...mapState({
      which_to_show: state => state.backend.which_to_show
    })
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {},
  destroyed() {
    this.$store.commit("backend/CHANGE_ADDFIRST", false);
    this.$store.commit("backend/CHANGE_ADDSECEND", false);
    this.$store.commit("backend/CHANGE_ADDTHIRD", false);
    this.$store.commit("backend/CHANGE_ADDINSTANCEID", '');
    this.$store.commit("backend/CHANGE_SHOW", 'InstanceList');
  }
};
</script>

<style scoped lang="scss">
.dashboard-wrap {
  height: 100%;
  overflow: auto;
}
</style>
<style lang="scss">
.dashboard-wrap {
}
</style>
