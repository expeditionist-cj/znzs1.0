<template>
  <div class="security">
    <BgWrap>
      <div class="wrap">
          <span class="day">{{num}} <span style="fontSize:0.18rem">天</span></span>
          <div class="text">
            <span>{{text}}</span>
            <span>生产天数</span>
          </div>
      </div>
    </BgWrap>
  </div>
</template>

<script>
import BgWrap from "../BgWrapSmall";
export default {
  props: {
    num:{
      type: Number,
      default: 0
    },
    text:{
      type: String,
      default: '年度安全'
    }
  },
  data() {
    return {};
  },
  components: { BgWrap },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {}
};
</script>

<style scoped lang="scss">
.security {
  width: 100%;
  height: 100%;
  .bg-wrap {
    width: 100%;
    height: 100%;
  }
  .wrap {
    padding: 0.16rem 0.2rem;
    display: flex;
    justify-content: space-between;
    align-content: center;
    .day {
      font-size: 0.3rem;
      font-weight: 800;
      color: rgba(44, 255, 155, 1);
    }
    .text {
      display: flex;
      align-content: center;
      flex-direction: column;
      font-size: 0.18rem;
      color: #809eac;
      font-weight: 500;
    }
  }
}
</style>
