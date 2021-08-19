<template>
  <div style="height: 100%">
    <div
      v-if="hasModel"
      class="PulpSupply"
      :class="{ showFullScreen: showFullScreen }"
    >
      <div class="PulpSupply-head">
        <!-- 头部组件 -->
        <ModelHeader :units="units" @checkUnit="checkUnit">
          <!-- 插槽： 优化建议 -->
          <div class="suggest" slot="suggestion">
            <span class="suggest-title">优化建议：</span>
            <span class="suggest-content">{{ suggestion }}</span>
          </div>

          <!-- 插槽：单选框、设置及全屏按钮 -->
          <div slot="ModelHeaderRight">
            <div class="ModelHeader-head-right">
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
              <!-- 设置按钮 -->
              <div class="settings">
                <img
                  class="settings-img"
                  src="@/assets/images/settings.png"
                  @click="openSettings"
                  alt
                />
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
            <div style="font-size: 0.12rem; color: #a8cdd4; margin-top: 0.2rem">
              刷新时间：
              <span>{{ sysTime }}</span>
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
        class="PulpSupply-model"
      >
        <div class="div-box" v-if="list1.length > 0">
          <MyBox
            v-for="(item, index) in list1"
            :key="index"
            :value="item.val"
            :unit="item.cn"
            :width="divBoxWidth"
            :ds="item.ds"
          />
        </div>
        <div class="div-elec" v-for="(itm, idx) in electricity" :key="idx">
          <div class="div-elec-txt">{{ itm.cn }}</div>
          <div class="div-elec-box">
            <MyBox
              v-for="(item, index) in itm.list"
              :key="index"
              :value="item.val"
              :unit="item.cn"
              :width="elecBoxWidth"
              :ds="item.ds"
            />
          </div>
        </div>
        <div class="scene-table">
          <el-table size="mini" border :data="tableData" height="45vh">
            <el-table-column
              type="index"
              align="center"
              label="序号"
            ></el-table-column>
            <el-table-column
              prop="date"
              align="center"
              label="时间"
              sortable 
            ></el-table-column>
            <el-table-column
              prop="weight"
              align="center"
              sortable
              label="负荷"
            ></el-table-column>
            <el-table-column
              prop="rawSo2Obv"
              align="center"
              sortable
              label="原烟气SO₂"
            ></el-table-column>
            <el-table-column
              prop="ph"
              align="center"
              sortable
              label="PH值"
            ></el-table-column>
            <el-table-column
              prop="rawFlow"
              align="center"
              sortable
              label="烟气流量"
            ></el-table-column>
            <el-table-column
              prop="disSo2"
              align="center" 
              sortable
              label="出口SO₂瞬时值"
            ></el-table-column>
            <el-table-column
              prop="disSo2Obv"
              align="center"
              sortable
              label="出口SO₂小时均值"
            ></el-table-column>
            <el-table-column
              prop="difference"
              align="center"
              sortable
              label="距离"
            ></el-table-column> 
            <el-table-column
              prop="runPumps"
              align="center"
              sortable
              label="泵组合"
            >
            <template slot-scope="scope">
              <div>{{scope.row.runPumps.replace(/pump/g,'')}}</div>
            </template>
            </el-table-column>
            <el-table-column
              prop="time"
              sortable
              align="center"
              label="切泵时长"
            ></el-table-column>
          </el-table>
        </div>
      </div>
      <!-- 组件内容-曲线图 -->
      <div
        v-show="!showModel"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        class="PulpSupply-diagram"
      >
        <div ref="div_boxs">
          <div class="div-box">
            <MyBox
              v-for="(item, index) in list1"
              :key="index"
              :value="item.val"
              :unit="item.cn"
              :width="divBoxWidth"
              :ds="item.ds"
            />
          </div>
          <div class="div-elec" v-for="(itm, idx) in electricity" :key="idx">
            <div class="div-elec-txt">{{ itm.cn }}</div>
            <div class="div-elec-box">
              <MyBox
                v-for="(item, index) in itm.list"
                :key="index"
                :value="item.val"
                :unit="item.cn"
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
      <!-- 弹框 -->
      <MyDialog
        v-show="showSettings"
        :title="title"
        @closeSettings="closeSettings"
        @saveSettings="saveSettings"
      >
        <div class="dialog-content" slot="content">
          <div class="table-title">浆液循环泵挂起设置</div>
          <table class="table" border="1" cellspacing="0" cellpadding="1">
            <tr class="table-tr">
              <td class="table-td">泵编号</td>
              <td class="table-td">操作</td>
            </tr>
            <tr class="table-tr" v-for="item in pumps" :key="item.label">
              <td class="table-td">{{ item.idx + item.sd_name }}</td>
              <td
                class="table-td"
                style="display: flex; justify-content: space-around"
              >
                <span>{{ item.param_cn }}</span>
                <label :for="'radio' + item.idx + '1'" class="table-td-label">
                  <input
                    type="radio"
                    :id="'radio' + item.idx + '1'"
                    value="1"
                    v-model="item.val"
                  />
                  {{ item.remark ? item.remark.split("|")[0].slice(0, 1) : "" }}
                </label>
                <label :for="'radio' + item.idx + '2'" class="table-td-label">
                  <input
                    type="radio"
                    :id="'radio' + item.idx + '2'"
                    value="0"
                    v-model="item.val"
                  />
                  {{ item.remark ? item.remark.split("|")[1].slice(0, 1) : "" }}
                </label>
              </td>
            </tr>
          </table>
          <div class="remark">备注：设置为挂起的泵将不会被推荐执行操作。</div>
        </div>
      </MyDialog>
      <!-- 遮罩层 -->
      <div class="mask" v-if="showSettings"></div>
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
import MyBox from "@/components/MyBox/index.vue";
import ModelHeader from "@/components/ModelHeader/index.vue";
import MyDialog from "@/components/MyDialog/index";
import {
  getOption,
  formatterCurveData,
  getCustomData,
  addNewSockData,
} from "@/js/pulpSupply.js";
import {
  getPulpData,
  getDiagram,
  getSettings,
  postSettings,
  getPumpModelInitData,
} from "@/api/pulpSupply.js";
import { selectIndicators } from "@/api/dashboard.js";
import { mapState } from "vuex";
import { socketUrl } from "@/global";
import moment from "moment";
export default {
  data() {
    return {
      tableData: [],
      websock: null,
      path: "",
      hasModel: true,
      sysTime: "",
      title: "参数设置",
      loading: false,
      divBoxWidth: "2.5rem",
      elecBoxWidth: "1.5rem",
      showSettings: false,
      pumps: [],
      isHu: "",
      list1: [],
      electricity: [], //循环泵电流
      units: [],
      radio: "scene",
      suggestion: "", //优化建议
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
      diagramDataObj: {},
      deviceCode: "",
      hasInstanceId: false,
      enable: 0,
    };
  },
  computed: {
    ...mapState({
      msg: (state) => state.socket.message,
      plantCode: (state) => state.user.plantCode,
      unitList: (state) => state.dashboard.unitList,
      initalData: (state) => state.dashboard.initalData,
      insList: (state) => state.user.instanceIdList,
      activeModel: (state) => state.app.activeModel,
      dict: (state) => state.dashboard.dictionary,
    }),
  },
  created() {},
  mounted() {
      console.log(this.unitList,1001);
    if (this.insList.length <= 0) {
      this.suggestion = "无";
      this.list1 = [];
      this.electricity = [];
      this.options = {};
      this.hasModel = false;
      if (this.$route.path == "/model/pot/slu") {
        return this.$message.error("该电厂暂无此模型！");
      } else {
        return;
      }
    } else {
      this.hasModel = true;
      this.units = this.getUnitList(
        this.activeModel,
        this.insList,
        this.unitList
      );
      this.deviceCode = this.units[0].deviceCode;
      this.instanceId = this.units[0].instanceId;
      this.enable = this.units[0].enable;
      if (this.units[0].status <= 0) {
        this.suggestion = "无";
        this.list1 = [];
        this.electricity = [];
        this.options = {};
        if (this.websock) {
          this.websock.close();
        }
        if (this.$route.path == "/model/pot/slu") {
          return this.$message.error("当前机组运行状态：停机！");
        } else {
          return;
        }
      } else if (!this.instanceId) {
        this.suggestion = "无";
        this.list1 = [];
        this.electricity = [];
        this.options = {};
        if (this.$route.path == "/model/pot/slu") {
          return this.$message.error("该机组暂无此模型！");
        } else {
          return;
        }
      } else if (!this.enable) {
        this.suggestion = "无";
        this.list1 = [];
        this.electricity = [];
        this.options = {};
        if (this.$route.path == "/model/pot/slu") {
          return this.$message.error("该机组此模型未启用！");
        } else {
          return;
        }
      } else {
        //否则如果#1机组有instanceId，那么则进行页面初始化
        this.init();
        this.initWebSocket();
      }
    }
  },
  updated() {
    try {
      this.canvasHeight =
        "calc(100% - " +
        (this.$refs.div_boxs.offsetHeight / 100 + 0.9) +
        "rem)";
    } catch (err) {}
  },
  watch: {
    // 监听websocket
    msg(value) {
      if (value) {
        let val = JSON.parse(value);
        // 更新机组状态
        if (
          val.type == "pumpOptimizationConsum" &&
          val.unitType == this.deviceCode
        ) {
          let data = val.data;
          let key = Object.keys(data)[0];
          this.sysTime = data[key].date;
          let optimi = data[key].optimi ? JSON.parse(data[key].optimi) : '';
          this.suggestion = optimi.sg.suggest; 
          this.tableData = optimi.sg.data;
        }
      }
    },
    // 切换场景图和曲线图
    radio(value) {
      if (value == "scene") {
        this.showModel = true;
      } else {
        this.showModel = false;
        // 获取曲线图数据
        this.getDiagramData();
      }
    },
    // 切换机组
    units(value) {
      if (value.length) {
        this.deviceCode = value[0].deviceCode;
      }
    },
    // 切换项目
    insList(value) {
        console.log(this.unitList,1000);
      if (value.length <= 0) {
        this.suggestion = "无";
        this.list1 = [];
        this.electricity = [];
        this.options = {};
        this.hasModel = false;
        if (this.$route.path == "/model/pot/slu") {
          return this.$message.error("该电厂暂无此模型！");
        } else {
          return;
        }
      } else {
        this.hasModel = true;
        this.units = this.getUnitList(this.activeModel, value, this.unitList);
        this.instanceId = this.units[0].instanceId;
        this.deviceCode = this.units[0].deviceCode;
        this.enable = this.units[0].enable;
        if (this.units[0].status <= 0) {
          this.suggestion = "无";
          this.list1 = [];
          this.electricity = [];
          this.options = {};
          if (this.websock) {
            this.websock.close();
          }
          if (this.$route.path == "/model/pot/slu") {
            return this.$message.error("当前机组运行状态：停机！");
          } else {
            return;
          }
        } else if (!this.instanceId) {
          this.suggestion = "无";
          this.list1 = [];
          this.electricity = [];
          this.options = {};
          if (this.$route.path == "/model/pot/slu") {
            return this.$message.error("该机组暂无此模型！");
          } else {
            return;
          }
        } else if (!this.enable) {
          this.suggestion = "无";
          this.list1 = [];
          this.electricity = [];
          this.options = {};
          if (this.$route.path == "/model/pot/slu") {
            return this.$message.error("该机组此模型未启用！");
          } else {
            return;
          }
        } else {
          //否则如果#1机组有instanceId，那么则进行页面初始化
          this.init();
          this.initWebSocket();
        }
      }
    },
  },
  components: {
    MyBox,
    ModelHeader,
    MyDialog,
  },
  methods: {
    // 初始化页面数据
    init() {
      this.loading = true;
      getPumpModelInitData({
        instanceId: this.instanceId,
      }).then((res) => {
        if (res.code == 0) {
          let data = res.data;
          this.sysTime = data.tm;  

          let optimi = data.optimi ? JSON.parse(data.optimi) : '';

          this.suggestion = optimi.sg.suggest; 
          this.tableData = optimi.sg.data;
        }
      });
      //  获取基本数据
      this.getIndiData();
       
    },
    getIndiData() {
      // 初始化关键指标数据

      selectIndicators({
        ssCode: `model_${this.activeModel}`,
        plant: this.plantCode,
        unit: this.deviceCode,
      }).then((res) => {
        this.loading = false;
        let data = res.data.data;
        let list1 = [];
        let list2 = [];
        if (data) {
          data.forEach((ele) => {
            if (ele.list) {
              let arry = ele.list;
              arry.forEach((k) => {
                k.val = "---";
                k.ds = 0;
              });
              list2.push(ele);
            } else {
              ele.val = "---";
              ele.ds = 0;
              list1.push(ele);
            }
          });
        }
        // this.bfData = data;
        this.list1 = list1;
        this.electricity = list2;
        // this.unitData = data;
      });
    },
    // 切换全屏
    changeFullScreen() {
      this.showFullScreen = !this.showFullScreen;
    },
    openSettings() {
      this.showSettings = true;
      getSettings({ instanceId: this.instanceId }).then((res) => {
        this.pumps = res.data;
      });
    },
    // 关闭弹框
    closeSettings() {
      this.showSettings = false;
    },
    // 保存
    saveSettings() {
      let list = this.pumps;
      let arry = [];
      list.map((item) => {
        let { instance_id, param_code, val } = item;
        arry.push({
          instance_id,
          param_code,
          val,
        });
      });
      postSettings(arry).then((res) => {
        if (res.code == "0") {
          this.$message.success("操作成功");
          this.$nextTick(() => {
            this.showSettings = false;
          });
        } else {
          this.$message.success("操作失败");
        }
      });
    },
    //获取曲线数据
    getDiagramData() {
      getDiagram({ instanceId: this.instanceId, ...this.query }).then((res) => {
        let diagramDataObj = formatterCurveData(res.data, this.dict);
        this.diagramDataObj = diagramDataObj;
        this.options = getOption(this.diagramDataObj);
      });
    },
    // 获取含instanceId的机组list
    getUnitList(activeModel, list, units) {
      units.forEach((ele) => {
        delete ele.instanceId;
      });
      //循环对比出当前模型实例下所有机组和instanceId
      list.forEach((ele) => {
        if (ele.model_code == activeModel) {
          units.forEach((item) => {
            if (
              ele.fix_code == item.deviceCode &&
              ele.plant_code == item.orgCode
            ) {
              // 对应放入机组信息中
              item.instanceId = ele.id;
              item.enable = ele.enable;
            }
          });
        }
      });
      return units;
    },

    //切换机组
    checkUnit(value) {
      this.query.stime = moment().format("YYYY-MM-DD HH:00:00");
      this.query.etime = moment().format("YYYY-MM-DD HH:59:59");
      this.instanceId = value.instanceId;
      this.enable = value.enable;
      this.deviceCode = value.deviceCode;
      if (value.status <= 0) {
        this.suggestion = "无";
        this.list1 = [];
        this.electricity = [];
        this.options = {};
        if (this.websock) {
          this.websock.close();
        }
        if (this.$route.path == "/model/pot/slu") {
          return this.$message.error("当前机组运行状态：停机！");
        } else {
          return;
        }
      } else if (!this.instanceId) {
        this.list1 = [];
        this.electricity = [];
        this.options = {};
        if (this.websock) {
          this.websock.close();
        }
        if (this.$route.path == "/model/pot/slu") {
          return this.$message.error("该机组暂无此模型！");
        } else {
          return;
        }
      } else if (!this.enable) {
        this.list1 = [];
        this.electricity = [];
        this.options = {};
        if (this.websock) {
          this.websock.close();
        }
        if (this.$route.path == "/model/pot/slu") {
          return this.$message.error("该机组此模型未启用！");
        } else {
          return;
        }
      } else {
        this.init();
        this.getDiagramData();
        this.initWebSocket();
      }
    },
    //初始化模型实时数据weosocket
    initWebSocket() {
      let now = Date.now();
      this.path = `/assistant/real_time_data_websocket/model_${
        this.activeModel
      }/${this.plantCode}/${this.deviceCode || ""}//${now}`;
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
      this.initWebSocket(this.path);
    },
    //数据接收
    websocketonmessage(e) {
      let data = JSON.parse(e.data);
      let unitState = data.unitStatus;
      this.units.forEach((ele) => {
        Object.keys(unitState).map((k) => {
          if (ele.deviceCode == k) {
            ele.status = unitState[k];
          }
        });
      });
      let bfList1 = JSON.parse(JSON.stringify(this.list1));
      let bfElectricity = JSON.parse(JSON.stringify(this.electricity));
      let redata = data.points;
      bfList1.forEach((ele) => {
        redata.forEach((k) => {
          if (ele.an == k.an) {
            ele.val = k.value;
            ele.ds = k.ds || 0;
          }
        });
      });
      bfElectricity.forEach((item) => {
        item.list.forEach((ele) => {
          redata.forEach((k) => {
            if (ele.an == k.an) {
              ele.val = k.value;
              ele.ds = k.ds || 0;
            }
          });
        });
      });
      this.list1 = bfList1;
      this.electricity = bfElectricity;
      // let list = [];
      // let electricity = [];
      // redata.forEach((ele) => {
      //   if (ele.cn.indexOf("电流") > -1) {
      //     electricity.push({
      //       ds: ele.ds,
      //       params: ele.gn,
      //       unit: ele.cn,
      //       value: ele.value.toFixed(2),
      //     });
      //   } else {
      //     list.push({
      //       ds: ele.ds,
      //       params: ele.gn,
      //       unit: ele.cn,
      //       value: ele.value.toFixed(2),
      //     });
      //   }
      // });
      // let arr = JSON.parse(JSON.stringify(this.list1));
      // arr.forEach((ele) => {
      //   if (ele.params == "CaCo3SlryDst") {
      //     list.push(ele);
      //   }
      // });
      // this.list1 = list;
      // this.electricity = electricity;
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
<style lang="scss" scoped>
.PulpSupply {
  // font-family: PingFang-SC-Medium;
  height: 100%;
  background: url("../../assets/images/border.png") no-repeat center;
  background-size: 100% 100%;
  .PulpSupply-head {
    height: 1.2rem;
  }
  .PulpSupply-model {
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
      // width: fit-content;
      display: flex;
      align-items: center;
      border: 0.01rem solid transparent;
      border-radius: 0.05rem;
      position: relative;
      left: 0.2rem;
      top: 0.2rem;
      padding: 0.1rem 0.4rem;
      background-color: rgba(0, 34, 70, 0.5);
      margin-bottom: 0.1rem;
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
    .scene-table {
      // height: 40vh;
      // min-width: 60%;
      // float: right;
      // margin-top: -1.65rem;
      padding: 0.2rem;
    }
  }
  .PulpSupply-diagram {
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
      margin-top: 0.2rem;
    }
    .div-elec {
      // width: fit-content;
      display: flex;
      align-items: center;
      border: 0.01rem solid transparent;
      border-radius: 0.05rem;
      position: relative;
      left: 0.2rem;
      top: 0.2rem;
      padding: 0.1rem 0.4rem;
      background-color: rgba(0, 34, 70, 0.5);
      margin-bottom: 0.1rem;
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
  z-index: 9999;
  background-color: #253553;
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
  .settings {
    width: 0.3rem;
    height: 0.3rem;
    background: rgba(241, 241, 241, 0.1);
    border-radius: 0.05rem;
    display: flex;
    align-items: center;
    margin-right: 0.1rem;
    .settings-img {
      width: 0.18rem;
      margin: 0 auto;
      cursor: pointer;
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

.dialog-content {
  margin-top: 0.8rem;
  color: rgba(168, 205, 212, 1);
  .table-title {
    font-size: 0.2rem;
    padding: 0.2rem;
    margin-left: 10%;
  }
  .table {
    width: 80%;
    text-align: center;
    margin: 0 auto;
    .table-tr {
      .table-td {
        padding: 0.1rem;
        .table-td-label {
          cursor: pointer;
          font-size: 0.16rem;
          font-weight: 400;
        }
      }
    }
  }
  .remark {
    color: rgba(248, 188, 28, 1);
    font-size: 0.14rem;
    padding: 0.2rem;
    margin-left: 10%;
  }
}
.dialog-footer {
  text-align: right;
  padding: 0.2rem 0.5rem;
  .btn {
    border: 0;
    outline: none;
    border-radius: 0.05rem;
    padding: 0.1rem 0.8rem;
    margin-right: 0.1rem;
    cursor: pointer;
  }
  .btn-cancel {
    background-color: rgba(105, 255, 249, 0.5);
  }
  .btn-save {
    background-color: rgba(105, 255, 249, 1);
  }
}

.mask {
  position: fixed;
  z-index: 10000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(2, 7, 50, 0.7);
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