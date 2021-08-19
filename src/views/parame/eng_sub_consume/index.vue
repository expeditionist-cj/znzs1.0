<template>
  <div class="eng_sub_consume" v-loading="loading">
    <div class="part">
      <div class="title">
        <span>选择参数</span>
      </div>
      <div class="tool">
        <el-select
          @change="changeSel"
          size="small"
          collapse-tags
          multiple
          v-model="points"
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in points_options"
            :key="item.an"
            :label="item.sdt_name"
            :value="item.an"
          >
          </el-option>
        </el-select>
        <!-- <el-button
          @click="onCheckPoint"
          :disabled="!hasSelPoint"
          size="small"
          type="primary"
          >测点有效性批量监测</el-button
        > -->
        <span
          :style="{
            'font-size': '0.16rem',
            color: checkPointResult ? '#69FFF9' : '#E13C3D',
          }"
          >{{ checkPointResultText }}</span
        >
      </div>
      <div class="content">
        <el-table
          max-height="50vh"
          :data="tableData"
          border
          style="width: 100%; overflow: auto"
        >
          <el-table-column
            align="center"
            prop="name"
            label="参数名称"
            min-width="180"
          >
            <template slot-scope="scope">
              <span style="cursor: pointer"
                >{{ scope.row.name
                }}{{ scope.row.name && scope.row.dimension }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="aliasName"
            label="别名"
            min-width="180"
          >
            <template slot-scope="scope">
              <span
                style="cursor: pointer"
                @click="onSelAlias(scope.row.aliasName)"
                >{{ scope.row.aliasName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="name1"
            label="参数名称"
            min-width="180"
          >
            <template slot-scope="scope">
              <span style="cursor: pointer"
                >{{ scope.row.name1
                }}{{ scope.row.name1 && scope.row.dimension }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="aliasName1"
            label="别名"
            min-width="180"
          >
            <template slot-scope="scope">
              <span
                style="cursor: pointer"
                @click="onSelAlias(scope.row.aliasName1)"
                >{{ scope.row.aliasName1 }}</span
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="part alg" style="margin-top: 0.2rem">
      <div class="title">
        <span>公式配置</span>
      </div>
      <div class="content" style="margin-top: 0.3rem">
        <div class="header clearfix">
          <div class="fl" style="width: 10%">
            <span> 序号</span>
          </div>
          <div class="fl" style="width: 20%">
            <span> 公式名称</span>
          </div>
          <div class="fl" style="width: 50%">
            <span>公式配置 </span>
          </div>
          <div class="fl" style="width: 10%">
            <span>区间统计方法 </span>
          </div>
          <!-- <div class="fl" style="width: 10%">
            <span>计算维度 </span>
          </div> -->
          <div class="fl" style="width: 10%">
            <span>删除</span>
          </div>
        </div>
        <div class="alg-content">
          <div
            class="alg-content-row"
            v-for="(item, idx) in algData"
            :key="idx"
          >
            <!-- 添加分组 -->
            <div class="group clearfix">
              <div
                class="fl"
                style="width: 10%; display: flex; align-items: center"
              >
                <el-input
                  style="width: 80%"
                  size="small"
                  v-model="item.parent.showOrder"
                  placeholder="请输入序号"
                ></el-input>
              </div>
              <!-- 公式名称 -->
              <div class="fl" style="width: 20%; text-align: right">
                <el-input
                  style="width: 95%"
                  size="small"
                  v-model="item.parent.crName"
                  placeholder="请输入公式名称"
                ></el-input>
              </div>

              <!-- 公式配置 -->
              <div class="fl" style="width: 50%; text-align: left">
                <span
                  v-if="item.parent.cptExpress != null"
                  style="display: inline-block; width: 50px; text-align: right"
                  >{{ item.parent.crCode }}=</span
                >
                <el-input
                  :id="item.parent.crCode"
                  v-if="item.parent.cptExpress != null"
                  style="width: 75%"
                  size="small"
                  v-model="item.parent.cptExpress"
                  placeholder="请输入"
                  @focus="onParentFocusIpt(idx)"
                  @blur="
                    onParentBlurIpt(
                      item.parent.cptExpress,
                      item.parent.crCode,
                      item.parent
                    )
                  "
                  @input="
                    onParentIptExp(
                      item.parent.cptExpress,
                      algData,
                      idx,
                      item.parent.crCode
                    )
                  "
                ></el-input>
                <el-button
                  @click="onAddGroupChildAlg(item.children, idx, item)"
                  size="small"
                  type="primary"
                  icon="el-icon-plus"
                ></el-button>
              </div>

              <!-- 区间统计计算 -->
              <div class="fl" style="width: 10%; padding-top: 25px">
                <el-select
                  v-if="item.parent.cptType"
                  v-model="item.parent.cptType"
                  style="margin-top: -10px"
                  size="small"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="itm in staticOpt"
                    :key="itm.value"
                    :label="itm.label"
                    :value="itm.value"
                  >
                  </el-option>
                </el-select>
              </div>

              <!-- 计算维度 -->
              <!-- <div class="fl" style="width: 10%; padding-top: 25px">
                <el-select
                  v-if="item.parent.cptType"
                  v-model="item.parent.cptMethod"
                  style="margin-top: -10px"
                  size="small"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="itm in mathOpt"
                    :key="itm.value"
                    :label="itm.label"
                    :value="itm.value"
                  >
                  </el-option>
                </el-select>
              </div> -->

              <!-- 删除 -->
              <div class="fl" style="width: 5%">
                <el-button
                  style="background-color: #e23d3d80; border-color: #e23d3d"
                  size="mini"
                  type="primary"
                  icon="el-icon-close"
                  @click="onDelGroup(idx, item)"
                ></el-button>
              </div>
            </div>

            <!-- 添加公式 -->
            <div
              class="child-group clearfix"
              v-for="(obj, index) in item.children"
              :key="index"
            >
              <div
                class="fl"
                style="width: 10%; display: flex; align-items: center"
              >
                <!-- <el-input
                  style="width: 80%"
                  size="small"
                  v-model="obj.showOrder"
                  placeholder="序号"
                ></el-input> -->
              </div>
              <div class="fl" style="width: 20%; text-align: right">
                <el-input
                  style="width: 80%"
                  size="small"
                  v-model="obj.crName"
                  placeholder="请输入"
                ></el-input>
              </div>

              <!-- 公式配置 -->
              <div class="fl" style="width: 50%; text-align: left">
                <span
                  style="
                    display: inline-block;
                    width: 50px;
                    text-align: right;
                    vertical-align: top;
                    position: relative;
                    top: 12px;
                  "
                  >{{ obj.crCode }}=</span
                >
                <el-input
                  :id="obj.crCode"
                  style="width: 75%"
                  size="small"
                  v-model="obj.cptExpress"
                  placeholder="请输入"
                  @focus="onFocusIpt(idx, index)"
                  @blur="onBlurIpt(obj.cptExpress, obj.crCode, obj)"
                  @input="
                    onIptExp(obj.cptExpress, item.children, index, obj.crCode)
                  "
                ></el-input>
                <!-- v-if="!item.parent.cptExpress" -->
                <!-- <el-button
                  @click="onAddGroupChildAlg(item.children, idx, item)"
                  size="small"
                  type="primary"
                  icon="el-icon-plus"
                ></el-button> -->
              </div>

              <!-- 区间统计计算 -->
              <div class="fl" style="width: 10%; padding-top: 25px">
                <el-select
                  v-if="obj.cptType"
                  v-model="obj.cptType"
                  style="margin-top: -10px"
                  size="small"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in staticOpt"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>

              <!-- 计算维度 -->
              <!-- <div class="fl" style="width: 10%; padding-top: 25px">
                <el-select
                  v-if="obj.cptType"
                  v-model="obj.cptMethod"
                  style="margin-top: -10px"
                  size="small"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in mathOpt"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div> -->

              <!-- 删除 -->
              <div class="fl" style="width: 5%">
                <el-button
                  style="background-color: #e23d3d80; border-color: #e23d3d"
                  size="mini"
                  type="primary"
                  icon="el-icon-close"
                  @click="onDelAlg(item.children, index, idx, item, obj)"
                ></el-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="tool" style="margin-top: 0.2rem">
        <el-button
          icon="el-icon-plus"
          @click="onAddGroup('addGroup')"
          size="small"
          type="primary"
          >分组</el-button
        >
        <el-button
          icon="el-icon-plus"
          @click="onAddAlg('addAlg')"
          size="small"
          type="primary"
          >公式</el-button
        >
        <el-button @click="onSummit" size="small" type="primary"
          >提交</el-button
        >
        <el-button
          @click="$store.commit('backend/CHANGE_SHOW', 'FirstStep')"
          size="small"
          type="primary"
          >返回</el-button
        >
        <el-button
          size="small"
          icon="el-icon-s-order"
          type="primary"
          @click="$store.commit('backend/CHANGE_SHOW', 'InstanceList')"
          >返回列表</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import _ from "lodash";
import {
  getSdtPoints,
  getSelSdtPoints,
  epsSave,
  epsMdf,
  getIstEps,
} from "@/api/alg";
import { mapState } from "vuex"; // 引入vuex state
import $ from "jquery";
let paramArray = [];

let RSArray = [];

export default {
  data() {
    return {
      loading: false,
      showCptMethod: true,
      points: [],
      points_options: [],
      hasSelPoint: false, // 是否选择测点
      checkPointResult: true,
      checkPointResultText: "",
      tableData: [],
      algData: [],
      addType: undefined,
      content: undefined,
      // 区间统计计算
      staticOpt: [
        {
          label: "和值",
          value: "sum",
        },
        {
          label: "均值",
          value: "avg",
        },
      ],
      // 计算维度
      mathOpt: [
        {
          label: "整体",
          value: "tm_over",
        },
        {
          label: "小时",
          value: "tm_hr",
        },
      ],
    };
  },
  computed: {
    ...mapState({
      addInstanceId: (state) => state.backend.addInstanceId,
      modelCode: (state) => state.backend.modelCode,
      addSecend: (state) => state.backend.addSecend,
      addThird: (state) => state.backend.addThird,
      plantCode: (state) => state.backend.plantCode,
      unitCode: (state) => state.backend.unitCode,
      add_eng_sub_consume: (state) => state.backend.add_eng_sub_consume,
    }),
  },
  async mounted() {
    window._ = _;
    window.vue = this;
    window.$ = $;
    for (let i = 0; i < 1000; i++) {
      paramArray.push(i);
    }
    for (let i = 0; i < 1000; i++) {
      RSArray.push(i);
    }
    await this.init();
    // 查询
    if (this.add_eng_sub_consume) {
      // 查询使用到的点
      getSelSdtPoints(this.addInstanceId)
        .then((res) => {
          let { msg, data } = res;
          data = data.data;
          let arry = [];
          data.forEach((item) => {
            arry.push(item.an);
          });
          this.points = [...new Set(arry)];
          this.$nextTick(() => {
            setTimeout(() => {
              this.changeSel(this.points);
              // console.log(this.tableData, "asdf");
            }, 300);
          });
        })
        .catch((e) => {
          this.$message.error(e);
        });
      // 查询公式
      getIstEps(this.addInstanceId).then((res) => {
        let data = res.data.data || [];
        let arry = [];
        data.forEach((item) => {
          let obj = {
            // cpLv: item.cpLv,
            cptExpress: item.cptExpress,
            cptMethod: item.cptMethod,
            cptType: item.cptType,
            crCode: item.crCode,
            crName: item.crName,
            id: item.id,
            istId: item.istId,
            pcode: item.pcode,
            refSdtPoints: item.refSdtPoints,
          };
          // 找出RSXX的位置
          let indexRS = RSArray.indexOf(Number(item.crCode.replace("RS", "")));
          RSArray.splice(indexRS, 1);
          item.children = item.children || [];
          item.children.forEach((obj) => {
            // 找出CPXX位置
            let indexCP = paramArray.indexOf(
              Number(obj.crCode.replace("CP", ""))
            );
            paramArray.splice(indexCP, 1);
          });
          arry.push({
            parent: obj,
            children: item.children,
          });
        });
        this.algData = arry;
      });
    }
  },

  methods: {
    // 初始化
    init() {
      // 标准点查询
      let query = {};
      if (this.plantCode) {
        query.plant = this.plantCode;
      }
      if (this.unitCode) {
        query.unitCode = this.unitCode;
      }
      getSdtPoints(query)
        .then((res) => {
          let { code, data, msg } = res;
          if (code == 0 && msg == "成功") {
            this.points_options = data.data; // 下拉框总共存在的点
          }
        })
        .catch((e) => {
          this.$message.error("标准点查询失败");
        });
    },
    changeSel(value) {
      this.points.length
        ? (this.hasSelPoint = true)
        : (this.hasSelPoint = false);
      let tableData = [];
      this.tableData = [];
      this.checkPointResultText = "";
      // 筛选出选择项
      let selData = [];
      value.forEach((item, idx) => {
        this.points_options.forEach((obj) => {
          if (item == obj.an) {
            selData.push(obj);
          }
        });
      });
      selData = _.chunk(selData, 2);

      selData.forEach((item) => {
        let obj = {};
        if (item.length == 1) {
          obj.name = item[0].sdt_name;
          obj.aliasName = item[0].an;
        } else {
          obj.name = item[0].sdt_name;
          obj.aliasName = item[0].an;
          obj.name1 = item[1].sdt_name;
          obj.aliasName1 = item[1].an;
        }
        tableData.push(obj);
      });
      this.tableData = tableData;
    },
    // 监测测点
    onCheckPoint() {
      this.checkPointResult = false;
      this.checkPointResultText = "校验成功";
    },
    // // 添加分组
    onAddGroup(type) {
      let obj = {
        parent: {
          istId: this.addInstanceId,
          pcode: "",
          crCode: `RS${RSArray[0]}`,
          crName: "",
          cptExpress: null,
          // cpLv: undefined,
          cptMethod: null,
          cptType: null,
        },
        children: [],
      };
      RSArray.splice(0, 1);
      let algData = JSON.parse(JSON.stringify(this.algData));
      algData.push(obj);
      this.algData = algData;
    },
    // 添加公式
    onAddAlg(type) {
      this.addType = type;
      let obj = {
        parent: {
          istId: this.addInstanceId,
          pcode: "",
          crCode: `RS${RSArray[0]}`,
          crName: "",
          cptExpress: "",
          // cpLv: undefined,
          cptMethod: "tm_hr",
          cptType: "sum",
        },
        children: [
          //   {
          //     istId: this.addInstanceId,
          //     pcode: `RS${RSArray[0]}`,
          //     crCode: `CP${paramArray[0]}`,
          //     crName: "",
          //     cptExpress: "",
          //     cpLv: undefined,
          //     cptMethod: "tm_hr",
          //     cptType: "sum",
          //     // cptShow: true,
          //   },
        ],
      };
      RSArray.splice(0, 1);
      // paramArray.splice(0, 1);
      let algData = JSON.parse(JSON.stringify(this.algData));
      algData.push(obj);
      this.algData = algData;
    },
    // 提交
    onCheckAlg() {},
    // 删除分组
    onDelGroup(idx, item) {
      this.algData.splice(idx, 1);
      let RS = Number(item.parent.crCode.replace("RS", ""));
      RSArray.unshift(RS);
      item.children.forEach((obj) => {
        paramArray.unshift(Number(obj.crCode.replace("CP", "")));
      });
      RSArray.sort((a, b) => a - b);
      paramArray.sort((a, b) => a - b);
    },
    // 删除子公式
    onDelAlg(data, index, idx, item, obj) {
      paramArray.unshift(Number(obj.crCode.replace("CP", "")));
      data.splice(index, 1);
      if (!data.length && !item.parent.cptExpress) {
        let RS = Number(item.parent.crCode.replace("RS", ""));
        RSArray.unshift(RS);
        this.algData.splice(idx, 1);
      }
      RSArray.sort((a, b) => a - b);
      paramArray.sort((a, b) => a - b);
    },
    // 添加子公式
    onAddGroupChildAlg(data, idx, item) {
      data = JSON.parse(JSON.stringify(data));
      let algData = JSON.parse(JSON.stringify(this.algData));
      let child = {
        istId: this.addInstanceId,
        pcode: item.parent.crCode,
        crCode: `CP${paramArray[0]}`,
        crName: "",
        cptExpress: "",
        // cpLv: undefined,
        cptMethod: "tm_hr",
        cptType: "sum",
        // cptShow: true,
      };
      data.push(child);
      // RSArray.splice(0, 1);
      paramArray.splice(0, 1);
      algData[idx].children = data;
      // console.log(algData, 111);
      this.algData = algData;
    },

    // 父公式框获取焦点触发
    onParentFocusIpt(idx) {
      this.parentIdx = idx; // 外层的序号
    },
    // 子公式框获取焦点触发
    onFocusIpt(idx, index) {
      this.idx = idx; // 外层的序号
      this.index = index; // children序号
    },
    // 父公式框失去焦点时触发
    onParentBlurIpt(cptExpress, crCode, obj) {
      this.getCPnames(cptExpress, crCode, obj);
      this.crCode = crCode;
    },
    // 子公式框失去焦点时触发
    onBlurIpt(cptExpress, crCode, obj) {
      this.getCPnames(cptExpress, crCode, obj);
      this.crCode = crCode;
    },
    onSelAlias(alias) {
      if (this.idx == undefined) {
        return false;
      }
      let exp = this.algData[this.idx].children[this.index].cptExpress;
      this.algData[this.idx].children[this.index].cptExpress = exp + alias;
      if (this.crCode != undefined) {
        $(`.${this.crCode}`).remove();
      }
      this.crCode = undefined;
    },
    // 找出exp中的别名和参数名
    findAliasAndParam(str) {
      // return (/[A-Z]+\d+/g).exec(str)
      return str.match(/[0-9]*[A-Za-z]+[0-9]*/g);
    },
    // 监听父公式框输入
    onParentIptExp(exp, children, idx, crCode) {
      $(`.${crCode}`).remove();
      // children[idx].parent.cpLv = undefined;
      if (exp.indexOf("CP") >= 0) {
        children[idx].parent.cptMethod = null;
        children[idx].parent.cptType = null;
      } else {
        children[idx].parent.cptMethod = "tm_hr";
        children[idx].parent.cptType = "sum";
      }
    },
    // 监听子公式框输入
    onIptExp(exp, children, idx, crCode) {
      $(`.${crCode}`).remove();
      // children[idx].cpLv = undefined;
      if (exp.indexOf("CP") >= 0) {
        children[idx].cptMethod = null;
        children[idx].cptType = null;
      } else {
        children[idx].cptMethod = "tm_hr";
        children[idx].cptType = "sum";
      }
    },
    // 验证参数名和别名是否在存在
    getCPnames(str, crCode, obj) {
      let tip = $(
        `<p class='${crCode} param-tips' style=color:red;font-size:12px;float:left;>请输入公式</p>`
      );
      if (!str) {
        if (!$(`.${crCode}`).length) {
          $(`#${crCode}`).after(tip);
        } else {
          $(`.${crCode}`).html("请输入公式");
        }
        return false;
      }
      let aliasAllStr = "";
      let paramsStr = "";
      // console.log(this.tableData, this.algData, 555);
      // 找出所有的别名
      this.tableData.forEach((item) => {
        let str = item.aliasName + item.aliasName1;
        aliasAllStr += str;
      });
      // 找出所有的参数名
      this.algData.forEach((item) => {
        item.children.forEach((obj) => {
          paramsStr += obj.crCode;
        });
        paramsStr += item.parent.crCode;
      });
      //验证公式中是否有特殊字符
      let pattern1 = /[`~!@#$^&=|{}':;',\\\[\]\<>?~！@#￥……&（）——|{}【】'；：""'。，、？\s]/g;
      if (pattern1.test(str)) {
        let dom = document.getElementById(crCode);
        dom.focus();
        if (!$(`.${crCode}`).length) {
          $(`#${crCode}`).after(tip);
          $(`.${crCode}`).html("输入的公式中有特殊字符");
        } else {
          $(`.${crCode}`).html("输入的公式中有特殊字符");
        }
        return false;
      }
      // 检查中文
      let pattern2 = /^[\u4E00-\u9FA5]{1,5}$/;
      if (pattern2.test(str)) {
        let dom = document.getElementById(crCode);
        dom.focus();
        if (!$(`.${crCode}`).length) {
          $(`#${crCode}`).after(tip);
          $(`.${crCode}`).html("输入的公式中不允许有中文");
        } else {
          $(`.${crCode}`).html("输入的公式中不允许有中文");
        }
        return false;
      }
      // 取出所有别名
      let ownAlias = ("+" + str).match(/[^A-Z][A-Z]\d+/g);
      // 取出所有公式名
      let ownParame = ("+" + str).match(/[C][P]\d+/g);

      // 不能同时拥有别名和参数
      if (ownAlias && ownParame) {
        let dom = document.getElementById(crCode);
        dom.focus();
        if (!$(`.${crCode}`).length) {
          $(`#${crCode}`).after(tip);
          $(`.${crCode}`).html("输入的公式中不允许别名和公式名同时存在");
        } else {
          $(`.${crCode}`).html("输入的公式中不允许别名和公式名同时存在");
        }
        return false;
      }

      // 提取公式中的参数和别名
      let reg_arry = this.findAliasAndParam(str) || [];
      // console.log(reg_arry,aliasAllStr,paramsStr,888);
      // 检查别名是否在选择的table中
      reg_arry.forEach((item) => {
        if (aliasAllStr.indexOf(item) < 0 && paramsStr.indexOf(item) < 0) {
          let dom = document.getElementById(crCode);
          dom.focus();
          if (!$(`.${crCode}`).length) {
            $(`#${crCode}`).after(tip);
            $(`.${crCode}`).html("输入的别名或参数名不存在");
          } else {
            $(`.${crCode}`).html("输入的别名或参数名不存在");
          }
          return false;
        }
      });
    },
    //提交
    onSummit() {
      if ($(".param-tips").length) {
        return this.$message.error("公式输入不正确");
      }
      if (!this.algData.length) {
        return this.$message.error("请输入公式");
      }
      // this.mathLv();
      // 组装结构
      let req = [];
      this.algData.forEach((item) => {
        req.push(item.parent);
        item.children.forEach((obj) => {
          // let i = 0;
          // if (obj.cpLv > i) {
          //   i = obj.cpLv + 1;
          // }
          // item.parent.cpLv = i;
          req.push(obj);
        });
      });
      // this.loading = true;
      console.log(req, 12345);
      let num = 0;
      req.forEach((ele) => {
        if (ele.cptExpress === "" || ele.crName === "") {
          num++;
        }
      });
      if (num > 0) {
        return this.$message.error("请输入完整公式名称及公式");
      } else {
        // return;
        if (this.add_eng_sub_consume) {
          // 更新
          epsMdf(req)
            .then((res) => {
              let code = res.data.code;
              let msg = res.data.msg;
              if (!code) {
                this.$message.success("更新成功");
                this.$store.commit("backend/CHANGE_ADD_ENG_SUB_CONSUME", true);
              } else {
                this.$message.error(msg);
              }
            })
            .catch((e) => {})
            .finally((e) => {
              this.loading = false;
            });
        } else {
          // 新增
          epsSave(req)
            .then((res) => {
              let code = res.data.code;
              let msg = res.data.msg;
              if (!code) {
                this.$message.success("更新成功");
                this.$store.commit("backend/CHANGE_ADD_ENG_SUB_CONSUME", true);
              } else {
                this.$message.error(msg);
              }
            })
            .catch((e) => {
              this.loading = false;
            })
            .finally((e) => {
              this.loading = false;
            });
        }
      }
    },
    // 计算层级
    mathLv() {
      let flag = false;
      // 判断是否相互依赖
      this.algData.forEach((item) => {
        item.children.forEach((obj) => {
          let str = " " + obj.cptExpress;
          // console.log(str.match(/[^A-Z][A-Z]{1}\d+/g), 123);
          // 公式不能循环依赖
          // if (!str.match(/[^A-Z][A-Z]{1}\d+/g)) {
          //   return (flag = true);
          // }
          // let matchArry = obj.cptExpress.match(/([C][P]\d+)*\d+/g);
        });
      });
      if (flag) {
        return this.$message({
          showClose: true,
          message: "公式之间不能相互依赖",
          type: "error",
        });
      }
      let undefinedArry = [];
      console.log(this.algData, 333);
      // 判断是否计算了层级
      this.algData.forEach((item) => {
        item.children.forEach((obj) => {
          if (!obj.cpLv) {
            undefinedArry.push(1);
          }
        });
      });
      // if (!undefinedArry.length) {
      //   return false;
      // }
      let len = 0;
      let lev1Arry = [];
      let algData = JSON.parse(JSON.stringify(this.algData));
      console.log(algData, 666);
      // 找出层级为1的
      algData.forEach((item) => {
        item.children.forEach((obj, idx) => {
          if (!obj.cptExpress.match(/[C][P]\d+/g)) {
            obj.cpLv = 1;
            lev1Arry.push({
              name: obj.crCode,
              lev: 1,
            });
          } else {
            len++;
          }
        });
      });
      console.log(len);
      // 循环找出层级
      // while (len > 0) {
      //   algData.forEach((item) => {
      //     let children = item.children;
      //     for (let i = 0; i < children.length; i++) {
      //       if (children[i].cpLv) {
      //         continue;
      //       } else {
      //         let CParry = children[i].cptExpress.match(/[C][P]\d+/g);
      //         for (let index = 0; index < CParry.length; index++) {
      //           let cp = _.find(lev1Arry, (o) => {
      //             return o.name == CParry[index];
      //           });
      //           if (!cp) {
      //             children[i].cpLv = undefined;
      //           } else {
      //             if (children[i].cpLv && children[i].cpLv <= cp.lev) {
      //               children[i].cpLv = cp.lev + 1;
      //             } else if (!children[i].cpLv) {
      //               children[i].cpLv = cp.lev + 1;
      //             }
      //           }
      //           if (index == CParry.length - 1) {
      //             lev1Arry.push({
      //               name: children[i].crCode,
      //               lev: children[i].cpLv,
      //             });
      //             len--;
      //           }
      //         }
      //       }
      //     }
      //   });
      // }
      this.algData = algData;
      console.log(this.algData, 123);
    },
  },
  destroyed() {
    paramArray = [];
    RSArray = [];
  },
};
</script>
<style lang="scss" scoped>
.eng_sub_consume {
  height: 100%;
  padding: 0.2rem;
  .part {
    .title {
      font-size: 0.24rem;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #69fff9;
    }
    .tool {
      margin-top: -0.42rem;
    }
    .content {
      margin-top: 0.1rem;
    }
  }
  .alg {
    font-size: 0.14rem;
    .header {
      & > div {
        background: #263e61;
        text-align: center;
        height: 0.5rem;
        line-height: 0.5rem;
        color: #ffffff;
        border-right: 1px solid #ebeef5;
      }
    }
    .alg-content-row {
      border-bottom: 1px solid rgba(255, 255, 255, 0.4);
      .group > div {
        padding: 0.2rem;
        padding-right: 0;
        text-align: center;
      }
      .child-group > div {
        padding: 0.2rem;
        padding-right: 0;
        text-align: center;
      }
    }
  }
}
</style>
<style lang="scss">
.eng_sub_consume {
  .tool {
    .el-select {
      width: 3rem !important;
    }
  }
  .el-checkbox {
    background: #69fff9;
  }
  .el-icon-close {
    font-size: 0.2rem;
    color: #e23d3d;
  }
}
// .el-button--mini,
// .el-button--mini.is-round {
//   padding: 0.01rem;
// }
</style>
