<template>
  <div class="team-build">
    <Block>
      <div slot="title">小指标竞赛 <span class="dev">(开发中…)</span></div>
      <div slot="content" class="content">
        <img src="../../../../assets/dashboard/race.png" alt="" />
      </div>
    </Block>
  </div>
</template>

<script>
import Block from "../Block";
export default {
  props: {},
  data() {
    return {};
  },
  components: { Block },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {}
};
</script>

<style scoped lang="scss">
.team-build {
  width: 100%;
  @media screen and (max-height: 960px) {
    height: 2.67rem;
  }
  @media screen and (min-height: 960px) {
    height: calc(100% - 6.76rem);
  }
  
  
  margin-top: 0.1rem;
  .block {
    height: 100%;
    .detail {
      height: 100%;
    }
  }
  .content {
    height: calc(100% - 0.2rem);
    padding-top: 0.26rem;
    padding-left: 0.42rem;
    padding-right: 0.26rem;
    padding-bottom: 0.22rem;
    .dev {
      color: #4a90e2;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
<style lang="scss">
.team-build {
  .block {
    height: 100%;
    .detail {
      height: 100%;
    }
  }
}
</style>
