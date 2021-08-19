<template>
  <div class="catalyzer" :class="{ overFlow: !value2 }">
    <div class="dashboard-right fr">
      <div class="right-top">
        <div style="margin-bottom: 0.1rem; display: flex">
          <div v-for="(item, idx) in unitList" :key="idx" style="display: flex">
            <div
              class="div-btn"
              :style="
                'background-color:' +
                (item.status > 0 ? 'rgba(33, 211, 84, 1);' : 'red')
              "
            >
              <div
                class="div-btn-child"
                @click="onMenu(0, item.deviceCode + '_A')"
              >
                {{ item.deviceName.slice(0, 2) }}-A侧
              </div>
              <div class=".div-btn-i" @click="onParame(item.deviceCode + '_A')">
                <i style="margin-left: 0.1rem" class="el-icon-setting"></i>
              </div>
            </div>

            <div
              class="div-btn"
              :style="
                'background-color:' +
                (item.status > 0 ? 'rgba(33, 211, 84, 1);' : 'red')
              "
            >
              <div
                class="div-btn-child"
                @click="onMenu(1, item.deviceCode + '_B')"
              >
                {{ item.deviceName.slice(0, 2) }}-B侧
              </div>
              <div class=".div-btn-i" @click="onParame(item.deviceCode + '_B')">
                <i style="margin-left: 0.1rem" class="el-icon-setting"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="tilte">
          <span>基本参数</span>
          <span style="color: #6180c5">采样时间：{{ time }}</span>
        </div>
        <div class="content">
          <div class="content-div">
            <span class="num">{{ basicInfo.outSmkFlow || '--'}}</span>
            <span>烟气量(nm3/h)</span>
          </div>
          <div class="content-div">
            <span class="num">{{ basicInfo.inNoxCv || '--'}}</span>
            <span>入口Nox浓度(mg/Nm3)</span>
          </div>
          <div class="content-div">
            <span class="num">{{ basicInfo.outNOxCv || '--'}}</span>
            <span>出口Nox浓度(mg/Nm3)</span>
          </div>
          <div class="content-div">
            <span class="num">{{ basicInfo.noxRate || '--'}}</span>
            <span>脱硝效率(%)</span>
          </div>
          <div class="content-div">
            <span class="num">{{ basicInfo.nh3Amount || '--'}}</span>
            <span>喷氨量(kg/h)</span>
          </div>
          <div class="content-div">
            <span class="num">{{ basicInfo.naRate || '--'}}</span>
            <span>氨空比</span>
          </div>
          <div class="content-div">
            <span class="num">{{ basicInfo.smkTmpr || '--'}}</span>
            <span>烟气温度(°C)</span>
          </div>
          <!-- <div class="content-div">
            <span class="num">{{basicInfo.time}}</span>
            <span>预计寿命(h)</span>
          </div> -->
        </div>
      </div>
      <div class="right-center">
        <div class="title">优化建议</div>
        <div class="content">{{ suggestData }}</div>
      </div>
      <div class="right-bottom">
        <div class="title">
          <span>活性衰减趋势</span>
          <el-switch
            style="display: block"
            v-model="value2"
            active-color="#69FFF9"
            inactive-color="rgb(97, 128, 197)"
            active-text="曲线图"
            inactive-text="列表"
            @change="changeSwitch"
          >
          </el-switch>
        </div>
        <div style="height: calc(100vh - 4.5rem)">
          <transition name="fade-transform" mode="out-in">
            <component
              :options="options"
              v-bind:is="which_to_show"
              :tableData="lineData"
            ></component>
          </transition>
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
import myTable1 from "./components/myTable.vue";
import { params, basicInfo, getoption, dict } from "./data";
import moment from "moment";
import $ from "jquery";
import { getExcelReader } from "@/api/catalyzer.js";
import { mapState } from "vuex";
export default {
  components: { curve, myTable1 },
  data() {
    return {
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
      // activeModel: "out-idx123",
      query: {
        // date: moment().format("YYYYMMDD"),
        date: "20201117",
        orgCode: "",
        fix: "11",
        side: "A",
      },
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
  computed: {
    ...mapState({
      msg: (state) => state.socket.message,
      orgCode: (state) => state.user.plantCode,
      unitList: (state) => state.dashboard.unitList,
      insList: (state) => state.user.instanceIdList,
      activeModel: (state) => state.app.activeModel,
      dict: (state) => state.dashboard.dictionary,
    }),
  },
  watch: {
    // 监听电厂是否改变，电厂改变则instanceId集合改变
    insList(val) {
      if (val.length <= 0) {
        return this.$message.error("该电厂暂无此模型");
      } else {
        let { plant_code, fix_code } = val[0];
        this.query.orgCode = plant_code;
        console.log(val,222);
        this.onMenu(0, fix_code + "_A");
      }
    },
  },
  mounted() {
    this.onMenu(0, this.unitList[0].deviceCode + "_A");
  },
  methods: {
    onMenu(index, key) {
      this.query.orgCode = this.orgCode;
      this.query.fix = key.split("_")[0];
      this.query.side = key.split("_")[1];
      this.getTableData(key);
    },
    getTableData(key) {
      getExcelReader({ ...this.query }).then((res) => {
        if (res.data == "empty" || res.code != 0) {
          this.lineData = [];
          this.suggestData = "";
          this.options = {};
          this.paramTable = [];
          this.basicInfo = [];
          return this.$message.error("该机组暂无数据");
        } else {
          let { data, suggest } = res.data;
          this.lineData = data;
          this.suggestData =
            suggest.suggest + "；剩余可用时间：" + suggest.lifeSpan;
          let obj = {
            legend: [
              "烟气量(nm3/h)",
              "入口Nox浓度(mg/Nm3)",
              "出口Nox浓度(mg/Nm3)",
              "脱硝效率(%)",
              "喷氨量(kg/h)",
              "氨空比",
              "烟气温度(°C)",
              "活性",
            ],
            x: [],
            y: [],
          };
          let opt = JSON.parse(JSON.stringify(data));
          let s = opt[0];
          let ss = {};
          Object.keys(s).map((k) => {
            ss[k] = [];
            opt.forEach((ele) => {
              ss[k].push(ele[k]);
            });
          });
          opt.forEach((ele) => {
            obj.x.push(ele.taskServiceTime);
          });
          for (let k in ss) {
            let o = {
              name: dict[k],
              type: "line",
              data: ss[k],
            };
            obj.y.push(o);
          }
          this.options = getoption(obj);
          let now = moment().format("YYYY-MM-DD");
          this.basicInfo = basicInfo[key + "@" + now];
        }
      });
    },
    changeSwitch(bool) {
      if (bool) {
        this.which_to_show = "curve";
      } else {
        this.which_to_show = "myTable1";
      }
    },
    onParame(key) {
      this.drawer = true;
      this.tilte = key;
      this.paramTable = params[key];
      //   console.log(this.paramTable);
    },
  },
};
</script>
<style lang="scss" scoped>
.catalyzer {
  height: 100%;
  // background: url("../../assets/images/border.png") no-repeat center;
  background-size: 100% 100%;
  .dashboard-right {
    // width: calc(100% - 3.48rem);
    width: 100%;
    height: 100%;
    padding: 0.2rem;
    // background: #253453 url("../../assets/bg.png") no-repeat fixed center;
    .right-top {
      .tilte {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 0.2rem;
        font-family: PingFang-SC-Medium, PingFang-SC;
        font-weight: 500;
        color: #69fff9;
        margin-bottom: 0.2rem;
      }
      .content {
        display: flex;
        flex-wrap: wrap;
        .content-div {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          // justify-content: center;
          width: 1.94rem;
          height: 0.82rem;
          background: #57595a75;
          border-radius: 0.08rem;
          // opacity: 0.5;

          font-size: 0.18rem;
          font-family: PingFang-SC-Medium, PingFang-SC;
          font-weight: 500;
          color: #a8cdd4;
          margin-right: 0.12rem;
          margin-top: 0.12rem;
          text-align: center;
          .num {
            font-size: 0.2rem;
            font-family: PingFang-SC-Bold, PingFang-SC;
            font-weight: bold;
            color: #2cff76;
          }
        }
      }
      .div-btn {
        display: flex;
        margin-right: 0.1rem;
        align-items: center;
        padding: 0.05rem 0.1rem;
        justify-content: center;
        border-radius: 0.05rem;
        .div-btn-child {
          width: 0.6rem;
          height: 0.36rem;
          text-align: center;
          border: 0;
          border-radius: 0.05rem;
          cursor: pointer;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .div-btn-i {
          // font-family: PingFang-SC-Heavy;
          font-size: 0.19rem;
          // font-weight: 800;
          color: rgba(255, 255, 255, 1);
          line-height: 0.35rem;
        }
      }
    }
    .right-center {
      margin-top: 0.26rem;
      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 0.2rem;
        font-family: PingFang-SC-Medium, PingFang-SC;
        font-weight: 500;
        color: #69fff9;
        margin-bottom: 0.2rem;
      }
      .content {
        height: 1.08rem;
        background: rgba(255, 218, 218, 0.09);
        border-radius: 8px;
        border: 1px solid #f75858;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 0.2rem;
        font-family: PingFang-SC-Medium, PingFang-SC;
        font-weight: 500;
        color: #f75858;
        padding-left: 0.3rem;
      }
    }
    .right-bottom {
      margin-top: 0.26rem;
      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 0.2rem;
        font-family: PingFang-SC-Medium, PingFang-SC;
        font-weight: 500;
        color: #69fff9;
        margin-bottom: 0.2rem;
      }
    }
  }
}
.overFlow {
  overflow: auto;
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
