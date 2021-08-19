<template>
  <div class="ModelHeader">
    <div class="ModelHeader-head">
      <div class="ModelHeader-head-left">
        <div class="div-btn">
          <div
            v-for="(item,idx) in units"
            :key="idx"
            class="div-btn-child"
            :style="'background-color:'+(item.runStatus > 0 ? 'rgba(33, 211, 84, 1);' : 'red')"
            @click="checkUnit(item,idx)"
          >
            <img v-show="active == idx" class="div-btn-img" src="@/assets/trailg.png" alt>
            <span class="div-btn-span">{{ item.deviceName.slice(0,2) }}</span>
          </div>
        </div>
        <div>
          <slot name="suggestion" />
        </div>
      </div>
      <div>
        <slot name="ModelHeaderRight" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    suggestion: {
      type: String,
      default: () => {
        return ''
      }
    },
    units: {
      type: Array,
      default: () => {
        return []
      }
    },
    analysisTime: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  data() {
    return {
      active: 0
    }
  },
  watch: {
    units(value) {
      this.active = 0
    }
  },
  methods: {
    checkUnit(item, idx) {
      this.active = idx
      this.$emit('checkUnit', item)
    }
  }
}
</script>
<style lang="scss" scoped>
.ModelHeader {
  height: 100%;
  .ModelHeader-head {
    display: flex;
    justify-content: space-between;
    padding: 0.2rem 0 0.2rem 0.5rem;

    .ModelHeader-head-left {
      // min-width: 60%;
      .div-btn {
        display: flex;
        margin-top: 0.13rem;
        .div-btn-child {
          margin-right: 0.1rem;
          width: 0.6rem;
          height: 0.36rem;
          text-align: center;
          border: 0;
          border-radius: 0.05rem;
          cursor: pointer;
          position: relative;

          .div-btn-img {
            width: 0.16rem;
            height: 0.12rem;
            margin-bottom: 0.02rem;
            position: absolute;
            left: 0.22rem;
            top: -0.16rem;
          }
          .div-btn-span {
            // font-family: PingFang-SC-Heavy;
            font-size: 0.19rem;
            // font-weight: 800;
            color: rgba(255, 255, 255, 1);
            line-height: 0.35rem;
          }
        }
      }
    }
  }
}
</style>
