<template>
  <BgWrap custormClass="timer">
    <div class="content">
      <div class="left">{{time.split(":")[0]}}<span style="margin:0 0.06rem">:</span>{{time.split(":")[1]}}<span style="margin:0 0.06rem">:</span>{{time.split(":")[2]}}
      </div>
      <div class="right">
        {{day}}
      </div>
    </div>
  </BgWrap>
</template>

<script>
import BgWrap from "./BgWrapSmall";
import moment from "moment";
moment.locale("zh-cn");
export default {
  props: {},
  components: { BgWrap },
  data() {
    return {
      time:"",
      day:"",
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.getTime();
    this.timer = setInterval(() => {
      this.getTime();
    }, 1000);
  },
  watch: {},
  methods: {
    getTime() {
      let day = moment().format("YYYY-MM-DD");

      let week = moment().format("dddd");
      this.time = moment().format("HH:mm:ss");
      this.day = day + "  " + week ;
    }
  },
  destroyed() {
    clearInterval(this.timer);
    this.timer = null;
  }
};
</script>

<style scoped lang="scss">
.timer {
  width: 100%;
  height: 1rem;
  display: flex;
  align-items: center;
  // height: 8%;
  .content {
    display: flex;
    padding: 0.16rem 0.27rem;
    align-items: center;
    justify-content: space-between;
    .left {
      width: 3.65rem;
      font-size: 0.3rem;
      font-weight: 800;
      color: rgba(44, 255, 155, 1);
    }
    .right {
      font-size: 0.22rem;
      font-weight: 500;
      color: rgba(128, 158, 172, 1);
    }
  }
}
</style>
