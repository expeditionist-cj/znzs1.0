<template>
  <div
    class="MyBox"
    :class="{ showBgColor: showBgColor, indexBgColor: indexBgColor }"
    :style="{ width: width }"
  >
    <div class="MyBox-value">
      <div class="value">
        <svg-icon
          v-if="ds > 1"
          title="坏点"
          icon-class="tips"
          class-name="custom-tips"
        />
        <span :class="{ gray: ds != 0 }">{{
          value == null || value == "-1" ? "--" : value
        }}</span>
      </div>
    </div>
    <div class="MyBox-unit">{{ unit }}</div>
  </div>
</template>
<script>
export default {
  props: {
    value: "",
    unit: {
      type: String,
      default: () => {
        return "";
      },
    },
    ds: {
      type: Number,
      default: () => {
        return 0;
      },
    },
    width: {
      type: String,
      default: () => {
        return "1.8rem";
      },
    },
    showBgColor: {
      type: Boolean,
      default: true,
    },
    indexBgColor: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style lang="scss" scoped>
.showBgColor {
  height: 0.6rem;
  background: rgba(0, 34, 70, 0.5);
}
.indexBgColor {
  height: 0.6rem;
  background: rgba(132, 151, 172, 0.2);
}
.MyBox {
  // min-width: 1.2rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  margin: 0 0.05rem 0.05rem 0;
  border-radius: 0.05rem;
  .MyBox-value {
    color: #2cff76;
    font-size: 0.19rem;
    font-weight: bold;
    // font-family: PingFang-SC-Bold;
    .value {
      width: auto;
      height: 0.33rem;
      font-size: 0.24rem;
      font-weight: bold;
      color: rgba(44, 255, 118, 1);
      line-height: 0.33rem;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      .custom-tips {
        width: 0.16rem;
        height: 0.16rem;
        cursor: pointer;
        margin-right: 0.05rem;
      }
      .arrow {
        position: absolute;
        right: 12%;
        transform: translateY(-10%);
        img {
          width: 0.08rem;
          height: 0.12rem;
        }
      }
    }
  }
  .MyBox-unit {
    color: #a8cdd4;
    font-size: 0.14rem;
  }
}
.gray {
  color: #788294 !important;
}
</style>