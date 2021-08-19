<template>
  <div style="height: 100%">
    <div
      v-if="hasModel"
      class="PowerConsum"
      :class="{ showFullScreen: showFullScreen }"
    >
      <div class="PowerConsum-head">
        <!-- 头部组件 -->
        <ModelHeader :units="units" @checkUnit="checkUnit">
          <div class="suggest" slot="suggestion">
            <span class="suggest-txt">数据分析时间：</span>
            <span class="suggest-txt">{{ analysisTime }}</span>
          </div>
          <!-- 插槽：单选框及全屏按钮 -->
          <div class="ModelHeader-head-right" slot="ModelHeaderRight">
            <!-- 单选框 -->
            <div class="radio-box">
              <label
                for="radio1"
                class="radio-box-label"
                :class="{
                  active: radio == 'scene',
                  blur: radio == 'scene' ? 0 : 1,
                }"
              >
                <input
                  class="radio-box-input"
                  type="radio"
                  id="radio1"
                  style="display: none"
                  name="radioPicture"
                  value="scene"
                  v-model="radio"
                />
                场景图
              </label>
              <label
                for="radio2"
                class="radio-box-label"
                :class="{
                  active: radio == 'curve',
                  blur: radio == 'curve' ? 0 : 1,
                }"
              >
                <input
                  class="radio-box-input"
                  type="radio"
                  id="radio2"
                  style="display: none"
                  name="radioPicture"
                  value="curve"
                  v-model="radio"
                />
                曲线图
              </label>
            </div>
            <!-- 显示全屏图标 -->
            <div class="fullScreen">
              <img
                class="fullScreen-img"
                src="@/assets/images/fullScreen.png"
                alt
                @click="changeFullScreen"
                v-show="!showFullScreen"
              />
              <img
                class="fullScreen-img"
                src="@/assets/images/back.png"
                alt
                @click="changeFullScreen"
                v-show="showFullScreen"
              />
            </div>
          </div>
        </ModelHeader>
      </div>
      <!-- 组件内容-场景图 -->
      <div
        v-show="showModel"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        class="PowerConsum-model"
      >
        <div class="div-elec" v-if="electricity.length > 0">
          <div class="div-elec-txt">循环泵耗电量(wkWh)</div>
          <div class="div-elec-box">
            <MyBox
              v-for="item in electricity"
              :key="item.unit"
              :value="item.value"
              :unit="item.unit"
              :width="elecBoxWidth"
            />
          </div>
        </div>
        <div class="div-box">
          <MyBox
            v-for="item in list"
            :key="item.value"
            :value="item.value"
            :unit="item.unit"
          />
        </div>
      </div>
      <!-- 组件内容-曲线图 -->
      <div
        v-show="!showModel"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        class="PowerConsum-diagram"
      >
        <div class="div-elec" v-if="electricity.length > 0" ref="elecBox">
          <div class="div-elec-txt">循环泵耗电量(wkWh)</div>
          <div class="div-elec-box">
            <MyBox
              v-for="item in electricity"
              :key="item.unit"
              :value="item.value"
              :unit="item.unit"
              :width="elecBoxWidth"
            />
          </div>
        </div>
        <div class="div-box">
          <MyBox
            v-for="item in list"
            :key="item.value"
            :value="item.value"
            :unit="item.unit"
          />
        </div>
        <div class="div-diagram" :style="{ height: canvasHeight }">
          <v-chart autoresize :options="options" />
        </div>
      </div>
    </div>
    <div v-else class="developing-container">
      <div class="developing-div">
        <img src="@/assets/images/developing.png" alt />
        <span class="developing-span">该电厂暂无此模型</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import MyBox from "@/components/MyBox/index.vue";
import ModelHeader from "@/components/ModelHeader/index.vue";
import {
  getOption,
  formatterCurveData,
  getElectricity,
} from "@/js/powerConsum.js";
import { getPowerConsum, getDiagram } from "@/api/powerConsum.js";
import moment from "moment";
let stime = moment().subtract(1, "days").format("YYYY-MM-DD 00:00:00");
let etime = moment().format("YYYY-MM-DD 00:00:00");
export default {
  data() {
    return {
      hasModel: true,
      loading: false,
      list: [],
      units: [], //机组信息
      plant: "", //电厂Code
      unit: "", //选中机组Code
      electricity: [],
      radio: "scene",
      suggestion: "",
      showModel: true,
      options: {},
      showFullScreen: false,
      diagramData: [],
      canvasHeight: "calc(100% - 1.3rem)",
      analysisTime: stime + "~" + etime,
      elecBoxWidth: "1rem",
      query: {
        stime: stime,
        etime: etime,
      },
      instanceId: "",
      hasInstanceId: false,
      enable: 0,
    };
  },
  computed: {
    ...mapState({
      plantCode: (state) => state.user.plantCode,
      unitList: (state) => state.dashboard.unitList,
      insList: (state) => state.user.instanceIdList,
      activeModel: (state) => state.app.activeModel,
    }),
  },
  // keep-alive 钩子函数
  activated() {},
  created() {},
  mounted() {
    if (this.insList.length <= 0) {
      this.list = [];
      this.electricity = [];
      this.options = {};
      this.hasModel = false;
      return this.$message.error("该电厂暂无此模型");
    } else {
      this.hasModel = true;
      // 放入机组信息一起
      this.units = this.getUnitList(
        this.activeModel,
        this.insList,
        this.unitList
      );
      //初始化instanceId为默认第一个机组的instanceId
      this.query.instanceId = this.units[0].instanceId;
      this.enable = this.units[0].enable;
      if (!this.query.instanceId) {
        this.list = [];
        this.electricity = [];
        this.options = {};
        return this.$message.error("该机组暂无此模型！");
      } else if (!this.enable) {
        this.list = [];
        this.electricity = [];
        this.options = {};
        return this.$message.error("该机组此模型未启用！");
      } else {
        this.init();
        //获取曲线图数据
        this.getDiagramData();
      }
    }
  },
  updated() {
    try {
      this.canvasHeight =
        "calc(100% - " + (this.$refs.elecBox.offsetHeight / 100 + 1.3) + "rem)";
    } catch (err) {}
  },
  watch: {
    // 切换视图/曲线
    radio(value) {
      if (value == "scene") {
        this.showModel = true;
      } else {
        this.showModel = false;
      }
    },
    units(value) {
      if (value.length) {
        this.deviceCode = value[0].deviceCode;
      }
    },
    // 监听电厂是否改变，电厂改变则instanceId集合改变
    insList(val) {
      if (val.length <= 0) {
        this.list = [];
        this.electricity = [];
        this.options = {};
        this.hasModel = false;
        return this.$message.error("该电厂暂无此模型");
      } else {
        this.hasModel = true;
        // 放入机组信息一起
        this.units = this.getUnitList(this.activeModel, val, this.unitList);
        //初始化instanceId为默认第一个机组的instanceId
        this.query.instanceId = this.units[0].instanceId;
        this.enable = this.units[0].enable;
        if (!this.query.instanceId) {
          this.list = [];
          this.electricity = [];
          this.options = {};
          return this.$message.error("该机组暂无此模型！");
        } else if (!this.enable) {
          this.list = [];
          this.electricity = [];
          this.options = {};
          return this.$message.error("该机组此模型未启用！");
        } else {
          this.init();
          //获取曲线图数据
          this.getDiagramData();
        }
      }
    },
  },
  components: {
    MyBox,
    ModelHeader,
  },
  methods: {
    // 获取含instanceId的机组list
    getUnitList(activeModel, list, units) {
      units.forEach((ele) => {
        delete ele.instanceId;
      });
      //循环对比出当前模型实例下所有机组和instanceId
      list.forEach((ele) => {
        if (ele.model_code == activeModel) {
          units.forEach((item) => {
            if (ele.fix_code == item.deviceCode && ele.plant_code == item.orgCode) {
              // 对应放入机组信息中
              item.instanceId = ele.id;
              item.enable = ele.enable;
            }
          });
        }
      });
      return units;
    },
    // 切换全屏
    changeFullScreen() {
      this.showFullScreen = !this.showFullScreen;
    },
    // 获取曲线数据
    async getDiagramData() {
      try {
        await getDiagram(this.query).then((res) => {
          if (res.data) {
            let obj = formatterCurveData(res.data);
            this.options = getOption(obj);
          } else {
            this.options = {};
          }
        });
      } catch (error) {
        this.options = {};
        console.log(error);
      }
    },
    // 查询电耗分析基本数据
    init() {
      this.loading = true;
      getPowerConsum(this.query).then((res) => {
        let obj = res.data;
        this.loading = false;
        if (obj) {
          this.list = [
            {
              value: obj.sumPower,
              unit: "发电量(wkWh)",
            },
            {
              value: obj.devicePowerPop,
              unit: "占比电耗(%)",
            },
            {
              value: obj.so2Jp,
              unit: "二氧化硫减排量(t)",
            },
            {
              value: obj.so2Hdh,
              unit: "耗电量(wkWh)/减排量(t)",
            },
          ];
          let arry = [];
          let obj1 = JSON.parse(JSON.stringify(obj));
          this.electricity = getElectricity(obj1);
        } else {
          this.list = [];
          this.electricity = [];
          this.options = {};
          return;
        }
      });
    },
    //切换机组
    checkUnit(value) {
      this.query.instanceId = value.instanceId;
      this.enable = value.enable;
      if (value.status <= 0) {
        this.list = [];
        this.electricity = [];
        this.options = {};
        return this.$message.error("当前机组运行状态：停机！");
      } else if (!this.query.instanceId) {
        this.list = [];
        this.electricity = [];
        this.options = {};
        return this.$message.error("该机组暂无此模型！");
      } else if (!this.enable) {
        this.list = [];
        this.electricity = [];
        this.options = {};
        return this.$message.error("该机组此模型未启用！");
      } else {
        this.init();
        //获取曲线图数据
        this.getDiagramData();
      }
    },
  },
  destroyed() {},
};
</script>
<style lang="scss" scoped>
.PowerConsum {
  // font-family: PingFang-SC-Medium;
  height: 100%;
  background: url("../../assets/images/border.png") no-repeat center;
  background-size: 100% 100%;
  .PowerConsum-head {
    height: 1.2rem;
  }
  .PowerConsum-model {
    height: calc(100% - 1.2rem);
    background: url("../../assets/images/pulp.png") no-repeat center;
    background-size: 99% 98%;
    .div-elec {
      width: 7.35rem;
      display: flex;
      border: 0.01rem solid transparent;
      border-radius: 0.05rem;
      flex-direction: column;
      position: relative;
      left: 0.2rem;
      top: 0.2rem;
      padding: 0.2rem;
      background-color: rgba(0, 34, 70, 0.5);
      margin-bottom: 0.1rem;
      .div-elec-box {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
      }
      .div-elec-txt {
        text-align: center;
        color: rgba(176, 213, 220, 1);
        font-size: 0.1rem;
        // font-family: PingFang-SC-Medium;
        font-weight: 500;
        margin-bottom: 0.1rem;
      }
    }
    .div-box {
      // width: 30%;
      display: flex;
      flex-wrap: wrap;
      position: relative;
      left: 0.2rem;
      top: 0.2rem;
    }
  }
  .PowerConsum-diagram {
    width: 100%;
    height: calc(100% - 1.2rem);
    .div-elec {
      width: 7.35rem;
      display: flex;
      border: 0.01rem solid transparent;
      border-radius: 0.05rem;
      flex-direction: column;
      position: relative;
      left: 0.2rem;
      top: 0.2rem;
      padding: 0.2rem;
      background-color: rgba(0, 34, 70, 0.5);
      margin-bottom: 0.05rem;
      .div-elec-box {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
      }
      .div-elec-txt {
        text-align: center;
        color: rgba(176, 213, 220, 1);
        font-size: 0.1rem;
        // font-family: PingFang-SC-Medium;
        font-weight: 500;
        margin-bottom: 0.1rem;
      }
    }
    .div-box {
      display: flex;
      flex-wrap: wrap;
      position: relative;
      left: 0.2rem;
      top: 0.2rem;
      margin-bottom: 0.5rem;
    }
    .div-diagram {
      width: 100%;
      // height: calc(100% - 1rem);
    }
  }
}
.showFullScreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background-color: #253553;
}
.ModelHeader-head-right {
  min-width: 2.5rem;
  display: flex;
  align-items: center;
  margin-top: 0.15rem;

  .radio-box {
    font-size: 0.1rem;
    margin-right: 20px;
    background-color: transparent;
    .radio-box-label {
      text-align: center;
      padding: 0.05rem 0.1rem;
      border: 0.01rem solid rgba(105, 255, 249, 1);
      color: rgba(0, 43, 41, 1);
      cursor: pointer;
    }
    .radio-box-label:first-child {
      border-radius: 0.05rem 0 0 0.05rem;
    }
    .radio-box-label:last-child {
      border-radius: 0 0.05rem 0.05rem 0;
    }
    .active {
      background-color: rgba(105, 255, 249, 1) !important;
      color: rgba(0, 43, 41, 1) !important;
    }
    .blur {
      background-color: transparent !important;
      color: rgba(105, 255, 249, 1) !important;
    }
  }
  .fullScreen {
    width: 0.3rem;
    height: 0.3rem;
    background: rgba(241, 241, 241, 0.1);
    border-radius: 0.05rem;
    display: flex;
    align-items: center;
    .fullScreen-img {
      width: 0.18rem;
      margin: 0 auto;
      cursor: pointer;
    }
  }
}
.suggest {
  margin-top: 0.1rem;
  font-size: 0.19rem;
  font-weight: 500;
  line-height: 0.19rem;
  .suggest-txt {
    color: rgba(168, 205, 212, 1);
  }
}
.echarts {
  width: 100%;
  height: 100%;
}
</style>
<style lang="scss" scoped>
.developing-container {
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  background: url("../../assets/images/border.png") no-repeat center;
  background-size: 100% 100%;
  .developing-div {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
    img {
      width: 1.13rem;
      margin: 0.2rem auto;
    }
    .developing-span {
      display: block;
      font-size: 0.2rem;
      // font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(105, 255, 249, 1);
      line-height: 0.22rem;
    }
  }
}
</style>