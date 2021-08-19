<template>
  <div class="quota">
    <div class="value">
      <svg-icon
        v-if="data.ds == 3 || data.ds == 4"
        title="坏点"
        icon-class="tips"
        class-name="custom-tips"
      />
      <span :class="{ gray: data.ds == 1 || data.ds == 4 }">{{
        (data.val !== 0 && !data.val) || status == "0" ?   "---" : data.val
      }}</span>
      <span class="arrow">
        <img
          v-if="data.con == 1 && status != '0'"
          src="../../../../assets/dashboard/arrow-up-red.png"
          alt=""
        />
        <img
          v-if="data.con == -1 && status != '0'"
          src="../../../../assets/dashboard/arrow-down.png"
          alt=""
        />
      </span>
    </div>
    <div class="name">
      {{ data.cn || "" }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          val: "",
          cn: "",
          con: 0,
        };
      },
    },
    status: {
      type: String,
      default: "1",
    },
  },
  data() {
    return {};
  },
  components: {},
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {},
};
</script>

<style scoped lang="scss">
.quota {
  .value {
    width: auto;
    height: 0.33rem;
    font-size: 0.24rem;
    font-weight: bold;
    color: rgba(44, 255, 118, 1);
    line-height: 0.33rem;
    position: relative;
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
  .name {
    width: auto;
    height: 0.25rem;
    font-size: 0.18rem;
    font-weight: 500;
    color: rgba(128, 158, 172, 1);
    line-height: 0.25rem;
  }
  .gray {
    color: #788294 !important;
  }
  .custom-tips {
    width: 0.16rem;
    height: 0.16rem;
    cursor: pointer;
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    left: -10%;
  }
}
</style>
