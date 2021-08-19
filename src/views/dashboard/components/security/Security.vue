<template>
  <div class="security">
    <BgWrap>
      <div class="wrap">
        <span class="day"
          >{{ num }} <span style="fontsize: 0.18rem">天</span></span
        >
        <div class="text">
          <span>{{ text }}</span>
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
    num: {
      type: Number,
      default: 0,
    },
    text: {
      type: String,
      default: "年度安全",
    },
  },
  data() {
    return {};
  },
  components: { BgWrap },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {},
};
</script>

<style scoped lang="scss">
.security {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .bg-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .wrap {
      width: 100%;
      padding: 0.16rem 0.4rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .day {
        font-size: 0.2rem;
        font-weight: 500;
        color: rgba(44, 255, 155, 1);
      }
      .text {
        display: flex;
        align-items: center;
        flex-direction: column;
        font-size: 0.16rem;
        color: #809eac;
        font-weight: 400;
      }
    }
  }
}
</style>
