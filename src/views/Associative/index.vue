<template>
  <div style="height: 100%">
    <div
      v-if="hasModel"
      class="Associative"
      :class="{ showFullScreen: showFullScreen }"
    >
      <div class="Associative-head">
        <!-- 头部组件 -->
        <ModelHeader
          :suggestion="suggestion"
          @checkUnit="checkUnit"
          :units="units"
        >
          <div class="suggest" slot="suggestion">
            <span class="suggest-title">优化建议：</span>
            <span class="suggest-content">{{ suggestion }}</span>
          </div>
          <!-- 插槽：头部右边内容 -->
          <div slot="ModelHeaderRight">
            <div class="ModelHeader-head-right">
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
            <!-- <div style="font-size: 0.12rem; color: #a8cdd4; margin-top: 0.2rem">
              刷新时间：
              <span>{{ sysTime }}</span>
            </div> -->
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
        class="Associative-model"
      >
        <div class="div-box">
          <MyBox
            v-for="(item, index) in list"
            :key="index"
            :width="divBoxWidth"
            :value="item.value"
            :unit="item.unit"
            :ds="item.ds"
          />
        </div>
        <div class="div-elec" v-if="electricity.length > 0">
          <div class="div-elec-txt">循环泵电流（A）</div>
          <div class="div-elec-box">
            <MyBox
              v-for="item in electricity"
              :key="item.unit"
              :value="item.value"
              :unit="item.unit"
              :width="elecBoxWidth"
              :ds="item.ds"
            />
          </div>
        </div>
      </div>
      <!-- 组件内容-曲线图 -->
      <div
        v-show="!showModel"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        class="Associative-diagram"
      >
        <div ref="div_box">
          <div class="div-box" v-if="list.length > 0">
            <MyBox
              v-for="(item, index) in list"
              :key="index"
              :width="divBoxWidth"
              :value="item.value"
              :unit="item.unit"
              :ds="item.ds"
            />
          </div>
          <div class="div-elec" v-if="electricity.length > 0">
            <div class="div-elec-txt">循环泵电流（A）</div>
            <div class="div-elec-box">
              <MyBox
                v-for="item in electricity"
                :key="item.unit"
                :value="item.value"
                :unit="item.unit"
                :width="elecBoxWidth"
                :ds="item.ds"
              />
            </div>
          </div>
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
import { formatterCurveData, getOption } from "@/js/associative.js";
import { getAssociate, getAssociateDiagram } from "@/api/associative.js";
import moment from "moment";
import { ass_soc_url } from "@/global/index";

export default {
  data() {
    return {
      websock: null,
      path: "",
      hasModel: true,
      sysTime: "",
      loading: false,
      list: [],
      electricity: [],
      divBoxWidth: "3rem",
      elecBoxWidth: "1.5rem",
      units: [
        {
          deviceName: "#1机组",
          instanceId: 90,
          status: 1,
        },
        {
          deviceName: "#2机组",
          instanceId: 92,
          status: 1,
        },
      ],
      radio: "scene",
      suggestion: "",
      showModel: true,
      options: {},
      showFullScreen: false,
      diagramData: [],
      canvasHeight: "calc(100% - 1rem)",
      instanceId: "",
      query: {
        stime: moment().format("YYYY-MM-DD HH:00:00"),
        etime: moment().format("YYYY-MM-DD HH:59:59"),
      },
      deviceCode: "",
      diagramDataObj: {},
    };
  },
  computed: {
    ...mapState({
      msg: (state) => state.socket.message,
      plantCode: (state) => state.user.plantCode,
      unitList: (state) => state.dashboard.unitList,
      insList: (state) => state.user.instanceIdList,
      activeModel: (state) => state.app.activeModel,
    }),
  },
  created() {},
  mounted() {
    let unitList = this.unitList[0];
    if (unitList && unitList.orgCode == "WSXM") {
      this.unitList[0].instanceId = 74;
      this.unitList[1].instanceId = 75;
      this.hasModel = true;
    } else {
      this.hasModel = false;
      return this.$message.error("该电厂暂无此模型");
    }
    // 放入机组信息一起
    this.units = JSON.parse(JSON.stringify(this.unitList));
    //初始化instanceId为默认第一个机组的instanceId
    this.instanceId = this.units[0].instanceId;
    if (this.instanceId) {
      this.init();
      this.initWebSocket();
    }
  },
  updated() {
    if (this.$refs.div_box) {
      this.canvasHeight =
        "calc(100% - " + (this.$refs.div_box.offsetHeight / 100 + 0.6) + "rem)";
    }
  },
  watch: {
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
    insList(value) {
      if (value.length <= 0) {
        this.hasModel = false;
        return this.$message.error("该电厂暂无此模型");
      }
      let units = JSON.parse(JSON.stringify(this.units));
      if (value[0].plant_code == "WSXM") {
        this.hasModel = true;
        this.units[0].instanceId = 74;
        this.units[1].instanceId = 75;
        this.instanceId = 74;
        this.init();
      } else {
        this.hasModel = false;
        return this.$message.error("该电厂暂无此模型");
      }
    },
  },
  components: {
    MyBox,
    ModelHeader,
  },
  methods: {
    // 获取含instanceId的机组list
    getUnitList(units) {
      //循环对比出当前模型实例下所有机组和instanceId
      units.forEach((item) => {
        if (ele.fix_code == item.deviceCode) {
          // 对应放入机组信息中
          item.instanceId = ele.id;
        }
      });
      return units;
    },
    //切换机组
    checkUnit(value) {
      this.instanceId = value.instanceId;
      this.deviceCode = value.deviceCode;
      if (value.status <= 0) {
        this.list = [];
        this.electricity = [];
        this.options = {};
        return this.$message.error("当前机组运行状态：停机！");
      } else if (!this.instanceId) {
        this.hasModel = false;
        return this.$message.error("该电厂暂无此模型");
      } else {
        this.hasModel = true;
        this.init();
        this.initWebSocket();
      }
    },
    changeFullScreen() {
      this.showFullScreen = !this.showFullScreen;
    },
    // 初始化查询页面数据
    init() {
      this.loading = true;
      getAssociate({ instanceId: this.instanceId }).then((res) => {
        this.loading = false;
        let data = res.data;
        if (data) {
          this.list = this.transData(data).arr2;
          this.electricity = this.transData(data).arr1;
        } else {
          this.list = [];
          this.suggestion = "无";
          return;
        }
      });
      this.getAssociateDiagramData();
    },
    transData(data) {
      let arr1 = [];
      let arr2 = [];
      data.forEach((ele) => {
        if (ele.fieldCode == "sg") {
          this.suggestion = ele.fieldValue;
        } else if (/^[A-Z]+/.test(ele.fieldCode)) {
          arr1.push({
            value: ele.fieldValue ? ele.fieldValue.slice(0,1) == "-" ? "0.00" :ele.fieldValue  : "",
            unit: ele.fieldName,
            ds: 0,
          });
        } else {
          arr2.push({
            value: ele.fieldValue ? ele.fieldValue.slice(0,1) == "-" ? "0.00" :ele.fieldValue  : "",
            unit: ele.fieldName,
            ds: 0,
          });
        }
      });
      return {
        arr1,
        arr2,
      };
    },
    // 获取曲线数据
    getAssociateDiagramData() {
      getAssociateDiagram({
        beginTime: moment(Date.now())
          .subtract(3, "hours")
          .format("YYYY-MM-DD HH:mm:ss"),
        endTime: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        instanceId: this.instanceId,
      }).then((res) => {
        // 将返回结果保存，以便websocket进行修改
        this.initialLineData = res.data;
        let obj = formatterCurveData(res.data);
        this.options = getOption(obj);
      });
    },
    //初始化weosocket
    initWebSocket() {
      let now = Date.now();
      this.path = `/assistant/websocket/1/4/${this.instanceId}/${now}`;
      if (this.websock) {
        this.websock.close();
      }
      const wsuri = ass_soc_url + this.path;
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
      this.initWebSocket(this.path);
    },
    //数据接收
    websocketonmessage(e) {
      let redata = JSON.parse(e.data);
      // 处理曲线数据
      let curveData = redata.curveData;
      let length = curveData.length;
      this.initialLineData = this.initialLineData.map((item) => {
        for (var i = 0; i < length; i++) {
          if (curveData[i].cnName == item.cnName) {
            item.dataList.shift();
            item.dataList.push(curveData[i].dataList[0]);
          } else {
            continue;
          }
        }
        return item;
      });
      let obj = formatterCurveData(this.initialLineData);
      this.options = getOption(obj);
      //处理参数数据
      let data = redata.currentInfo;
      if (data) {
        this.list = this.transData(data).arr2;
        this.electricity = this.transData(data).arr1;
      } else {
        this.list = [];
        this.suggestion = "无";
        return;
      }
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
    this.websock.close(); //离开路由之后断开websocket连接
  },
};
</script>
<style lang="scss" scoped>
.Associative {
  // font-family: PingFang-SC-Medium;
  height: 100%;
  background: url("../../assets/images/border.png") no-repeat center;
  background-size: 100% 100%;
  .Associative-head {
    height: 1.2rem;
  }
  .Associative-model {
    height: calc(100% - 1.2rem);
    background: url("../../assets/images/pulp.png") no-repeat center;
    background-size: 99% 98%;
    .div-box {
      // width: 25%;
      display: flex;
      flex-wrap: wrap;
      position: relative;
      left: 0.2rem;
      top: 0.2rem;
    }
    .div-elec {
      width: 6.05rem;
      display: flex;
      border: 0.01rem solid transparent;
      border-radius: 0.05rem;
      flex-direction: column;
      position: relative;
      left: 0.2rem;
      top: 0.2rem;
      padding: 0.2rem 0;
      background-color: rgba(0, 34, 70, 0.5);
      .div-elec-box {
        width: 4.7rem;
        display: flex;
        flex-wrap: wrap;
        margin: auto;
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
  }
  .Associative-diagram {
    width: 100%;
    height: calc(100% - 1.2rem);
    .div-box {
      display: flex;
      flex-wrap: wrap;
      position: relative;
      left: 0.2rem;
      top: 0.2rem;
    }
    .div-diagram {
      width: 100%;
    }
    .div-elec {
      width: fit-content;
      display: flex;
      align-items: center;
      border: 0.01rem solid transparent;
      border-radius: 0.05rem;
      position: relative;
      left: 0.2rem;
      top: 0.2rem;
      padding: 0.2rem 0.4rem;
      background-color: rgba(0, 34, 70, 0.5);
      margin-bottom: 0.5rem;
      .div-elec-box {
        display: flex;
        flex-wrap: wrap;
        margin-left: 0.4rem;
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
  }
}
.showFullScreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
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
  .suggest-title {
    color: rgba(168, 205, 212, 1);
  }
  .suggest-content {
    color: rgba(255, 54, 111, 1);
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