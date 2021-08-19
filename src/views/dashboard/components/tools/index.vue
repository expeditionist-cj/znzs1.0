<template>
  <div class="tools">
    <Block>
      <div slot="title">实用工具</div>
      <div class="block" slot="content">
        <div class="block-content">
          <div class="child">
            <div class="img">
              <img
                @click="openDrawer('Consume')"
                src="../../../../assets/dashboard/calc.png"
                alt=""
              />
            </div>
            <div class="title">
              <span>石灰石耗用量计算</span>
            </div>
            <div class="text">
              <span
                >填写采集数据和常量，依据规范计算公式，快速计算石灰石消耗量和浆液消耗量。</span
              >
            </div>
          </div>
          <div class="child">
            <div class="img">
              <img
                @click="openDrawer('Volume')"
                src="../../../../assets/dashboard/guanzi.png"
                alt=""
              />
            </div>
            <div class="title">
              <span>储罐标高体积计算</span>
            </div>
            <div class="text">
              <span
                >选择封头形式、填写设备内径、筒体长度、液面高度，自动计算储罐体积。</span
              >
            </div>
          </div>
        </div>
      </div>
    </Block>
  </div>
</template>

<script>
import { getSchedule } from "@/api/dashboard";
import Block from "../Block";
import moment from "moment";
import { mapState } from "vuex";
export default {
  props: {},
  data() {
    return {
      tableData: [],
      today: moment().format("YYYY-MM-DD"),
      yesterday: moment().add(-1, "days").format("YYYY-MM-DD"),
      tomorrow: moment().add(1, "days").format("YYYY-MM-DD"),
    };
  },
  components: { Block },
  computed: {
    ...mapState({
      showDrawer: (state) => state.dashboard.showDrawer,
    }),
  },
  created() {},
  mounted() {
    this.init();
  },
  watch: {},
  methods: {
    init() {
      getSchedule({
        plant: "XCXM",
        date: this.today,
      }).then((res) => {
        let data = res.data;
        data.forEach((ele) => {
          if (ele.arrang.length > 0) {
            let arr = ele.arrang;
            arr.forEach((item) => {
              if (item.day == this.yesterday) {
                ele.yesterday = item.team;
              } else if (item.day == this.today) {
                ele.today = item.team;
              } else if (item.day == this.tomorrow) {
                ele.tomorrow = item.team;
              }
            });
          }
        });
        this.tableData = data;
      });
    },
    openDrawer(data) {
      this.$store.commit("dashboard/SET_SHOWDRAWER", true);
      this.$store.commit("dashboard/SET_WHICHTOSHOW", data);
    },
  },
};
</script>

<style scoped lang="scss">
.tools {
  width: 100%;
  display: flex;
  align-items: center;
  .block {
    height: 100%;
    .block-content {
      display: flex;
      justify-content: space-between;
      padding-bottom: 0.15rem;
      .child {
        width: 50%;
        padding: 0.1rem;
        .img {
          width: 100%;
          text-align: center;
          cursor: pointer;
        }
        .title {
          font-size: 0.16rem;
          color: rgba(255,255,255,0.8);
          text-align: center;
          margin-bottom: 0.1rem;
        }
        .text {
          color: rgba(128,158,172,0.6);
          font-size: 0.12rem;
          line-height: 0.19rem;
          text-align: center;
          padding: 0 0.6rem;
        }
      }
    }
  }
}
</style>
