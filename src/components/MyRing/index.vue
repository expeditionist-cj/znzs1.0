<template>
  <div class="myring">
    <div
      class="myring-ring"
      :style="{ backgroundImage: 'url(' + backgroundImageUrl + ')' }"
    >
      {{ ringData.limit }}
      <!-- 33.00 -->
    </div>
    <div class="value">
      <svg-icon
        v-if="ringData.ds > 1"
        title="坏点"
        icon-class="tips"
        class-name="custom-tips"
      />
      <span class="myring-value" :class="{ gray: ringData.ds != 0 }">
        {{ ringData.value }}
      </span>
    </div>
    <div class="myring-name">{{ ringData.cn }}</div>
  </div>
</template>
<script>
export default {
  props: {
    ringData: {
      type: Object,
      default: () => {
        return {
          value: "",
          cn: "",
          limit: "",
          ds: "",
        };
      },
    },
  },
  data() {
    return {};
  },
  computed: {
    backgroundImageUrl() {
      let a = this.ringData.value ? Number(this.ringData.value) : 0;
      let b = this.ringData.limit ? Number(this.ringData.limit) : 0;

      return a < b
        ? require("../../assets/images/greenRing.png")
        : require("../../assets/images/redRing.png");
    },
  },
};
</script>
<style lang="scss">
.myring {
  width: 1.8rem;
  height: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  background: rgba(0, 34, 70, 0.5);
  margin: 0 0.05rem 0.05rem 0;
  border-radius: 0.05rem;
  .myring-ring {
    width: 0.6rem;
    height: 0.6rem;
    // background: url("../../assets/images/redRing.png");
    background-size: 100% 100%;
    color: #2cff76;
    font-size: 0.2rem;
    font-weight: bold;
    text-align: center;
    line-height: 0.6rem;
  }
  .value {
    display: flex;
    align-items: center;
    justify-content: center;
    .custom-tips {
      width: 0.16rem;
      height: 0.16rem;
      cursor: pointer;
      margin-right: 0.05rem;
    }
  }
  .myring-value {
    color: #2cff76;
    font-size: 0.24rem;
    font-weight: bold;
    text-align: center;
  }
  .myring-name {
    color: #a8cdd4;
    font-size: 0.14rem;
  }
}
.gray {
  color: #788294 !important;
}
</style>