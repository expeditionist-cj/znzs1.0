<template>
  <div class="indicator">
    <Block>
      <div slot="title" class="title">
        <div class="title-wrap">
          <div>关键指标看板</div>
          <div class="unit">
            <div
              v-for="(item, index) in unitList"
              :key="index"
              :class="{ stop: !Number(item.status) }"
              @click="onUnit(index, item.deviceName, item.deviceCode)"
            >
              <img
                v-show="active == index"
                src="../../../../assets/dashboard/trangle.png"
                alt=""
              />
              <span>{{ item.deviceName.split("机组")[0] }}</span>
            </div>
          </div>
          <!-- <div class="icon">
            <div>
              <svg-icon icon-class="curve" class-name="custom-curve" />
            </div>
            <div>
              <svg-icon icon-class="menu" class-name="custom-menu" />
            </div>
          </div> -->
        </div>
      </div>
      <div slot="content" class="content clearfix">
        <Quota
          v-for="item in unitData"
          :key="item.an"
          :data="item"
          :status="status"
        />
      </div>
    </Block>
  </div>
</template>

<script>
import Block from "../Block";
import Quota from "./Quota";
import { selectIndicators, selectImportantIndicator } from "@/api/dashboard";
import { mapState } from "vuex";
import { socketUrl } from "@/global";
export default {
  props: {},
  data() {
    return {
      websock: null,
      active: 0,
      bfData: [],
      unitData: [],
      status: "",
      deviceCode: "",
      path: "",
    };
  },
  components: { Block, Quota },
  computed: {
    ...mapState({
      plantCode: (state) => state.user.plantCode,
      unitList: (state) => state.dashboard.unitList,
      msg: (state) => state.socket.message,
    }),
  },
  created() {},
  mounted() {
    this.init();
  },
  watch: {
    msg(value) {
      if (value) {
        value = JSON.parse(value);
        // 更新机组状态
        if (value.type == "webImportantIndicator") {
          this.data = value.data;
        }
      }
    },
    plantCode(val) {
      this.$nextTick(() => {
        this.init();
        this.active = 0;
      });
    },
  },
  methods: {
    async init() {
      // 获取机组信息
      await this.$store.dispatch("dashboard/getUnitList", this.plantCode);
      // 获取关键指标信息
      // await selectImportantIndicator({
      //   plant: this.plantCode,
      // }).then((res) => {
      //   let unitStatus = res.data.unitStatus[0];
      //   // this.bfData = res.data["#1机组"];
      //   this.data = res.data; // 保存数据
      //   this.status = res.data["unitStatus"][0]["#1机组"];
      //   this.deviceCode = this.unitList[0].deviceCode;
      //   let copy = JSON.parse(JSON.stringify(this.unitList));
      //   copy.forEach((item) => {
      //     item.status = unitStatus[item.deviceName];
      //   });
      //   this.$store.commit("dashboard/SET_UNITLIST", copy);
      // });
      await this.getIndiData();
      this.initWebSocket();
    },
    async getIndiData() {
      // 初始化关键指标数据
      selectIndicators({
        ssCode: "home_index",
        plant: this.plantCode,
        unit: this.deviceCode,
      }).then((res) => {
        let data = res.data.data;
        data.forEach((ele) => {
          ele.val = "";
          ele.ds = 0;
          ele.con = "";
        });
        this.bfData = data;
        this.unitData = data;
      });
    },
    // 选择机组
    onUnit(index, deviceName, deviceCode) {
      this.deviceCode = deviceCode;
      this.active = index;
      this.status = this.data["unitStatus"][0][deviceName];

      // this.unitData = this.data[deviceName];
      this.getIndiData();
      this.initWebSocket();
    },
    //初始化weosocket
    initWebSocket() {
      this.unitData = [];
      let now = Date.now();
      this.path = `/assistant/real_time_data_websocket/home_index/${this.plantCode}/${
        this.deviceCode || ""
      }//${now}`;
      if (this.websock) {
        this.websock.close();
      }
      const wsuri = socketUrl + this.path;
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    //连接建立之后执行send方法发送数据
    websocketonopen() {
      // let actions = { test: "12345" };
      // this.websocketsend();
    },
    //连接建立失败重连
    websocketonerror() {
      this.initWebSocket();
    },
    //数据接收
    websocketonmessage(e) {
      let hisData = JSON.parse(JSON.stringify(this.bfData));
      let redata = JSON.parse(e.data);
      hisData.forEach((ele) => {
        redata.forEach((k) => {
          if (ele.an == k.an) {
            let old = Number(ele.val);
            ele.val = k.value;
            ele.ds = k.ds;
            // ele.con =
            //   k.value - old == 0 ? "" : k.value - old > 0 ? 1 : -1;
          }
        });
      });
      this.bfData = hisData;
      this.unitData = hisData;
      // // 处理曲线数据
      // let curveData = redata.curveData;
      // let length = curveData.length;
      // this.initialLineData = this.initialLineData.map((item) => {
      //   for (var i = 0; i < length; i++) {
      //     if (curveData[i].cnName == item.cnName) {
      //       item.dataList.shift();
      //       item.dataList.push(curveData[i].dataList[0]);
      //     } else {
      //       continue;
      //     }
      //   }
      //   return item;
      // });
      // let obj = formatterCurveData(this.initialLineData);
      // this.options = getOption(obj);
      // //处理参数数据
      // let data = redata.currentInfo;
      // if (data) {
      //   this.list = this.transData(data).arr2;
      //   this.electricity = this.transData(data).arr1;
      // } else {
      //   this.list = [];
      //   this.suggestion = "无";
      //   return;
      // }
    },
    //数据发送
    websocketsend(Data) {
      // this.websock.send(Data);
    },
    //关闭连接
    websocketclose(e) {
      // console.log("断开连接", e);
    },
  },
  destroyed() {
    if (this.websock) {
      this.websock.close();
    } //离开路由之后断开websocket连接
  },
};
</script>

<style scoped lang="scss">
.indicator {
  width: 100%;
  height: 3.64rem;
  // height: 33%;
  margin-top: 0.1rem;
  .block {
    // height: 3.14rem;
    height: 100%;
  }
  .title {
    padding-right: 0.24rem;
    .title-wrap {
      display: flex;
      // align-items: center;
      justify-content: space-between;
    }
    .unit {
      display: flex;
      flex-direction: row;
      padding-top: 0.02rem;
      & > div {
        width: 0.36rem;
        height: 0.22rem;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        font-size: 0.16rem;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        background: rgba(33, 211, 84, 1);
        margin-right: 0.14rem;
        cursor: pointer;
        & > img {
          width: 0.14rem;
          height: 0.1rem;
          position: absolute;
          top: -0.1rem;
        }
      }
    }
    .run {
      background: rgba(33, 211, 84, 1);
    }
    .stop {
      background: rgba(247, 88, 88, 1) !important;
    }
    .icon {
      display: flex;
      // align-items: center;
      // padding-top: .08rem;
      & > div {
        width: 0.24rem;
        height: 0.24rem;
        background: rgba(53, 72, 112, 1);
        border-radius: 0.04rem;
        text-align: center;
        line-height: 0.24rem;
      }
      & > div:first-child {
        margin-right: 0.1rem;
      }
      .custom-curve {
        width: 0.16rem;
        height: 0.16rem;

        position: relative;
        top: -0.02rem;
      }
      .custom-menu {
        width: 0.16rem;
        height: 0.16rem;
      }
    }
  }
  .content {
    padding-top: 0.32rem;
    padding-left: 0.72rem;
    padding-right: 0.22rem;
    & > .quota:nth-child(2n) {
      padding-left: 0.6rem;
    }
    .quota {
      width: 50%;
      float: left;
      margin-bottom: 0.3rem;
    }
  }
}
</style>
