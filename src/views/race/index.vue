<template>
  <div class="dashboard clearfix">
    <!-- 左侧纵向导航栏 -->
    <!-- <div class="dashboard-left fl">
      <div class="IntelligentModel-left">

        <ul class="ul-outside">
          <li class="li-outside" v-for="item in menuData" :key="item.type_code">
            <span>{{ item.mname }}</span>
            <ul class="ul-inside">
              <li
                class="li-inside"
                v-for="itm in item.children"
                :key="itm.refCode"
              >
                <div
                  class="li-inside-div"
                  @click="onCheck(itm)"
                  :class="{ active: itm.refCode == activeModel }"
                  :style="{
                    color: itm.online ? 'rgba(176, 213, 220, 1)' : '',
                  }"
                >
                  <svg-icon :icon-class="itm.icon" class-name="custom-class" />
                  {{ itm.mname }}
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div> -->
    <div class="dashboard-right fr">
      <div class="right-top" style="display:flex;justify-content:space-between;">
        <div style="margin-bottom: 0.1rem">
          <el-button size="small" type="success" @click="onMenu(0, '11_A')"
            >#4机组<i
              style="margin-left: 0.1rem"
              @click.stop="onParame('11_A')"
            ></i
          ></el-button>
          <!-- <el-button type="success" @click="onMenu(1, '11_B')"
            >#1-B侧<i
              style="margin-left: 0.1rem"
              @click.stop="onParame('11_B')"
              class="el-icon-arrow-right el-icon-setting"
            ></i
          ></el-button> -->
          <el-button size="small" type="danger" @click="onStop"
            >#5机组</el-button
          >
          <el-button size="small" type="danger" @click="onStop"
            >#6机组</el-button
          >
          <!-- <el-button type="danger">#2-B侧</el-button> -->
        </div>
        <div>
          <el-button type="success" size="small">导出体检报告</el-button>
        </div>
      </div>
      <div class="right-content">
        <div class="zoom-box" v-if="zoomShow" style="margin-bottom: 10px">
          <BgWrap custormClass="bg-box-top1 bgBox">
            <div class="title">
              <span>{{ zoomData.title }}</span>
              <div class="fullScreen-img-box">
                <img
                  class="fullScreen-img"
                  src="@/assets/images/back.png"
                  alt
                  @click="zoomShow = !zoomShow"
                />
              </div>
            </div>
            <div class="curve-box">
              <curveZoom :options="zoomData.option"></curveZoom>
            </div>
          </BgWrap>
        </div>
        <div class="top clearfix">
          <BgWrap custormClass="bg-box-top bgBox">
            <div class="title">
              <span>催化剂活性</span>
              <div class="fullScreen-img-box">
                <img
                  class="fullScreen-img"
                  src="@/assets/images/fullScreen.png"
                  alt
                  @click="changeFullScreen('催化剂活性', getActiveOption())"
                />
              </div>
            </div>
            <div class="curve-box">
              <curve :options="getActiveOption()"></curve>
            </div>
          </BgWrap>
          <BgWrap custormClass="bg-box-top bgBox">
            <div class="title">
              <span>喷氨温度</span>
              <div class="fullScreen-img-box">
                <img
                  class="fullScreen-img"
                  src="@/assets/images/fullScreen.png"
                  alt
                  @click="changeFullScreen('喷氨温度', getTempOption())"
                />
              </div>
            </div>
            <div class="curve-box">
              <curve :options="getTempOption()"></curve>
            </div>
          </BgWrap>
        </div>
        <div class="top">
          <BgWrap custormClass="bg-box-top bgBox">
            <div class="title">
              <span>实时运行状态</span>
              <div class="fullScreen-img-box">
                <img
                  class="fullScreen-img"
                  src="@/assets/images/fullScreen.png"
                  alt
                  @click="
                    changeFullScreen('实时运行状态', getRuntimeStateOption())
                  "
                />
              </div>
            </div>
            <div class="curve-box">
              <curve :options="getRuntimeStateOption()"></curve>
            </div>
          </BgWrap>
          <BgWrap custormClass="bg-box-top bgBox">
            <div class="title">
              <span>喷氨偏差</span>
              <div class="fullScreen-img-box">
                <img
                  class="fullScreen-img"
                  src="@/assets/images/fullScreen.png"
                  alt
                  @click="changeFullScreen('喷氨偏差', getDeviatOption())"
                />
              </div>
            </div>
            <div class="curve-box">
              <curve :options="getDeviatOption()"></curve>
            </div>
          </BgWrap>
        </div>
      </div>
    </div>

    <!-- 初始参数弹框 -->
    <el-drawer
      size="60%"
      :title="tilte + '催化剂寿命预测初始参数'"
      :visible.sync="drawer"
      direction="ltr"
    >
      <div style="margin: 0.2rem">
        <el-table size="small" :data="paramTable" border style="width: 100%">
          <el-table-column
            align="center"
            prop="name"
            label="参数名称"
            min-width="180"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="vaule"
            label="参数值"
            min-width="180"
          >
          </el-table-column>
          <el-table-column align="center" prop="unit" label="参数单位">
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { menu } from "@/global/index";
import curve from "./components/curve.vue";
import curveZoom from "./components/curveZoom.vue";
import myTable1 from "./components/myTable.vue";
import {
  params,
  basicInfo,
  suggestData,
  getoption,
  dict,
  getoption1,
} from "./data";
import moment from "moment";
import $ from "jquery";
import BgWrap from "./components/BgWrap.vue";
import {
  runtimeState,
  dict as dictNew,
  dictZoom,
  activeAndTemp,
  newData,
} from "./dataNew.js";
import _ from "lodash";
// import { AniX } from 'anix';
export default {
  components: { curve, myTable1, BgWrap, curveZoom },
  data() {
    return {
      activeIndex: 0,
      value2: true,
      which_to_show: "curve",
      drawer: false,
      tilte: "",
      paramTable: [],
      time: moment().format("YYYY-MM-DD") + " 05:00:00",
      basicInfo: basicInfo["11_A" + "@" + moment().format("YYYY-MM-DD")],
      suggestData: "",
      lineData: [],
      options: undefined,
      menuData: [],
      activeModel: "out-idx123",
      showFullScreen: false,
      zoomData: {
        title: "",
        option: undefined,
      },
      zoomShow: false,
    };
  },
  created() {
    window.$ = $;
    menu.forEach((ele) => {
      if (ele["mname"] == "智能模型") {
        this.menuData = ele["children"];
      }
    });
  },
  mounted() {
    $(".li-outside span").click(function (e) {
      event.stopPropagation(); //  阻止事件冒泡
      event.preventDefault();
      if (
        $(this).next(".ul-inside").children(".li-inside").css("display") ==
        "list-item"
      ) {
        $(this).next(".ul-inside").children(".li-inside").hide(200);
      } else {
        $(this).next(".ul-inside").children(".li-inside").show(200);
      }
    });
    window.moment = moment;
    window._ = _;
  },
  methods: {
    changeSwitch(bool) {
      if (bool) {
        this.which_to_show = "curve";
      } else {
        this.which_to_show = "myTable1";
      }
    },
    onParame(key) {
      return false;
      this.drawer = true;
      this.tilte = key;
      this.paramTable = params[key];
      console.log(this.paramTable);
    },
    onStop() {
      this.$message.error("该机组停机");
    },

    // 运行时状态
    getRuntimeStateOption() {
      let obj = {
        legend: ["烟气流量", "入口nox浓度", "出口nox浓度", "喷氨量"],
        x: [],
        y: [],
      };
      let s = {
        smkFlow: [],
        inNox: [],
        outNox: [],
        Nh3Amt: [],
      };
      // 根据当前时间排序
      let currentMin = moment().minute(); // 数字
      let currentHour = moment().hour();
      let sortRuntimeState = [];
      let last = runtimeState.slice(0, currentMin);
      let before = runtimeState.slice(currentMin);
      sortRuntimeState = [...before, ...last];
      sortRuntimeState.forEach((item, index) => {
        if (item.time >= currentMin) {
          obj.x.push(
            currentHour -
              1 +
              ":" +
              (item.time < 10 ? "0" + item.time : item.time)
          );
        } else {
          obj.x.push(
            currentHour + ":" + (item.time < 10 ? "0" + item.time : item.time)
          );
        }
        // s.smkFlow.push(item.smkFlow);
        // s.inNox.push(item.inNox);
        // s.outNox.push(item.outNox);
        // s.Nh3Amt.push(item.Nh3Amt);
        s.smkFlow.push(item);
        s.inNox.push(item);
        s.outNox.push(item);
        s.Nh3Amt.push(item);
      });
      for (let k in s) {
        console.log(k);
        let o = {
          name: dictNew[k],
          type: "line",
          // data: {
          //   point:s[k],
          //   show:s[k]*dictZoom[k],
          // },
          data: s[k],
          smooth: true,
          symbolSize: 1,
        };
        o.data = o.data.map((o1) => {
          if (k == "inNox" || k == "outNox") {
            return {
              name: dictNew[k],
              value: o1[k] * dictZoom[k],
              pointValue: o1[k].toFixed(2),
              time: o1["time"],
            };
          }
          return {
            name: dictNew[k],
            value: o1[k] * dictZoom[k],
            pointValue: o1[k],
            time: o1["time"],
          };
        });
        obj.y.push(o);
      }
      return getoption(obj);
    },
    // 催化剂活性
    getActiveOption() {
      let obj = {
        legend: ["实际活性", "理论活性", "失活极限"],
        x: [],
        y: [],
      };
      let s = {
        realAct: [],
        cptAct: [],
        actLimit: [],
      };
      this.getFilterData(activeAndTemp).forEach((item, index) => {
        obj.x.push(item.day);
        s.realAct.push(item.realAct);
        s.cptAct.push(item.cptAct);
        s.actLimit.push(item.actLimit);
      });
      for (let k in s) {
        let o = {
          name: dictNew[k],
          type: "line",
          data: s[k],
          smooth: true,
          symbolSize: 1,
        };
        obj.y.push(o);
      }
      return getoption1(obj);
    },
    // 喷氨温度
    getTempOption() {
      let obj = {
        legend: ["实际喷氨温度", "最低喷氨温度"],
        x: [],
        y: [],
      };
      let s = {
        realNh3Tmpr: [],
        lstNh3tmpr: [],
      };
      this.getFilterData(newData).forEach((item, index) => {
        obj.x.push(item.day);
        s.realNh3Tmpr.push(item.realNh3Tmpr);
        s.lstNh3tmpr.push(item.lstNh3tmpr);
      });
      for (let k in s) {
        let o = {
          name: dictNew[k],
          type: "line",
          data: s[k],
          smooth: true,
          symbolSize: 1,
        };
        obj.y.push(o);
      }
      return getoption1(obj);
    },
    // 过滤数据
    getFilterData(data) {
      let currentDay = moment().format("YYYY-MM-DD HH:mm");
      return data.filter((item) => {
        if (moment(currentDay).diff(moment(item.day), "hour") >= 0) {
          item.realAct = Number(item.realAct).toFixed(3);
          item.cptAct = Number(item.cptAct).toFixed(3);
          item.realNh3Tmpr = Number(item.realNh3Tmpr).toFixed(3);
          item.lstNh3tmpr = Number(item.lstNh3tmpr).toFixed(3);
          item.realNh3Amt = Number(item.realNh3Amt).toFixed(3);
          item.cptNh3Amt = Number(item.cptNh3Amt).toFixed(3);
          item.diffNh3Amt = Number(item.diffNh3Amt).toFixed(3);
          return item;
        }
      });
    },
    // 喷氨偏差
    getDeviatOption() {
      let obj = {
        legend: ["实际喷氨量", "理论喷氨量", "喷氨偏差"],
        x: [],
        y: [],
      };
      let s = {
        realNh3Amt: [],
        cptNh3Amt: [],
        diffNh3Amt: [],
      };
      this.getFilterData(newData).forEach((item, index) => {
        obj.x.push(item.day);
        s.realNh3Amt.push(item.realNh3Amt);
        s.cptNh3Amt.push(item.cptNh3Amt);
        s.diffNh3Amt.push(item.diffNh3Amt);
      });
      for (let k in s) {
        let o = {
          name: dictNew[k],
          type: "line",
          data: s[k],
          smooth: true,
          symbolSize: 1,
        };
        obj.y.push(o);
      }
      return getoption1(obj);
    },
    // 切换全屏
    changeFullScreen(title, option) {
      this.zoomShow = true;
      this.zoomData.title = title;
      this.zoomData.option = option;
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  height: 100%;
  display: flex;
  flex-wrap: nowrap;
  font-size: 0.16rem;
  .IntelligentModel-left {
    // width: 17%;
    height: 100%;
    .ul-outside {
      margin: 0 0.1rem 0 0;
      padding: 0;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.05);
      .hide-li {
        height: 0;
        overflow: hidden;
        transition: 0.2s;
      }
      .li-outside span {
        display: block;
        // font-family: PingFang-SC-Heavy;
        font-weight: 800;
        background: linear-gradient(
          90deg,
          rgba(249, 249, 249, 0.1) 0%,
          rgba(241, 241, 241, 0.03) 100%
        );
        color: #b0d5dc;
        padding: 0.1rem;
        cursor: pointer;
      }
    }
    .ul-inside {
      padding: 0;
      transition: 0.2s;
      .li-inside {
        .li-inside-div {
          margin: 0.1rem 0;
          display: block;
          color: rgba(176, 213, 220, 0.4);
          padding: 0.1rem;
          cursor: pointer;
          // font-family: PingFang-SC-Medium;
          // border: 0.01rem solid transparent;
          // border-top: transparent !important;
          // border-bottom: transparent !important;
          .custom-class {
            width: 0.15rem;
            height: 0.14rem;
            margin-right: 0.08rem;
          }
        }
      }
      .active {
        // border: 0.04rem solid rgba(105, 255, 249, 1) !important;
        color: rgba(31, 45, 77, 1) !important;
        background: linear-gradient(
          270deg,
          rgba(87, 255, 255, 0.33) 0%,
          rgba(87, 255, 255, 1) 100%
        );
      }
    }
  }
  .dashboard-left {
    height: 100%;
    width: 3.32rem;
    .active-menu {
      background: linear-gradient(
        270deg,
        rgba(87, 255, 255, 0.33) 0%,
        #57ffff 100%
      );
      color: #333 !important;
    }
    .left-menu {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 0.48rem;
      padding: 0 0.2rem;
      font-size: 0.18rem;
      font-family: PingFang-SC-Medium, PingFang-SC;
      font-weight: 500;
      color: #b0d5dc;
      cursor: pointer;
      .params {
        display: inline-block;
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.36);
        border-radius: 4px;
        font-size: 0.12rem;
      }
    }
  }
  .dashboard-right {
    width: 100%;
    height: 100%;
    margin-left: 0.15rem;
    padding: 0.04rem 0rem;
    background: #253453 url("../../assets/bg.png") no-repeat fixed center;
    .right-top {
      .tilte {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 0.2rem;
        font-family: PingFang-SC-Medium, PingFang-SC;
        font-weight: 500;
        color: #69fff9;
      }
    }
    .right-content {
      height: calc(100% - 40px);
      position: relative;
      .zoom-box {
        width: 100%;
        height: 100%;
        margin-bottom: 0.2rem;
        .bg-box-top1 {
          width: calc(calc(100% - 0.1rem) / 2);
          height: 100%;
          float: left;
          .title {
            display: flex;
            justify-content: space-between;
          }
        }
        .bgBox {
          width: 100%;
          height: 100%;
          &:hover {
            // background: rgba(0,0,0,0)!important;
          }
        }
        .curve-box {
        }
      }
      & > div {
        height: calc(calc(100% - 0.2rem) / 2);
      }
      .top {
        & > .bg-box-top:nth-child(1) {
          margin-right: 0.1rem;
        }
        margin-bottom: 0.1rem;
      }
      .bg-box-top {
        width: calc(calc(100% - 0.1rem) / 2);
        height: 100%;
        padding: 0.2rem;
        float: left;
        &:hover {
          background: #ffffff1c;
        }
        .title {
          display: flex;
          justify-content: space-between;
        }
      }
      .bg-box-bottom {
        height: 100%;
        width: 100%;
      }
      .bgBox {
        padding: 0.2rem;
        .title {
          font-size: 0.18rem;
          font-family: PingFang-SC-Bold, PingFang-SC;
          font-weight: bold;
          color: #69fff9;
        }
      }
    }
    .curve-box {
      padding-bottom: 0.1rem;
    }
    .fullScreen-img-box {
    }
    .fullScreen-img {
      width: 0.18rem;
      margin: 0 auto;
      cursor: pointer;
    }
  }
}
</style>
<style lang="scss">
.el-switch__label.is-active {
  color: #69fff9;
}
.el-switch__label {
  color: rgb(97, 128, 197);
}
ul {
  list-style: none;
}
</style>
