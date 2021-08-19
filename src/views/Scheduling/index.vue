<template>
  <div class="scheduling">
    <div class="scheduling-base">
      <div class="scheduling-base-box">
        <div class="scheduling-base-box-child">
          <span>项目：</span>
          <el-select
            :popper-append-to-body="false"
            size="mini"
            v-model="plant"
            placeholder="请选择"
            style="width: 1.5rem; margin-bottom: 0.1rem"
          >
            <el-option
              v-for="(item, index) in plants"
              :key="index"
              :label="item.name"
              :value="item.deptCode"
            >
            </el-option>
          </el-select>
        </div>
        <div class="scheduling-base-box-child">
          <span>值运名称：</span>
          <el-input class="opName" size="small" v-model="opName"></el-input>
        </div>
        <div class="scheduling-base-box-child">
          <span>值班设置：</span>
          <el-input
            class="operator"
            type="number"
            size="small"
            @input="onOperatorInput"
            v-model.number="operator"
          ></el-input
          >值&nbsp;&nbsp;
          <el-input
            class="operator"
            type="number"
            size="small"
            @input="onClassesInput"
            v-model.number="classes"
          ></el-input
          >班&nbsp;&nbsp;
        </div>
        <!-- <el-button class="btn" type="primary" @click="getOpTimes" size="small">确认</el-button> -->
        <span v-if="operatorOutRange" class="warning"
          >值别设置范围在1~6次之间！</span
        >
        <span v-if="classesOutRange" class="warning"
          >班次设置范围在1~6次之间！</span
        >
      </div>
      <div class="scheduling-base-box">
        <span>运行时间：</span>
        <div class="scheduling-base-box-child">
          <div
            class="opClasses"
            v-for="(item, idx) in operatorOptions"
            :key="idx"
          >
            <el-input
              class="opTime"
              v-model="item.shiftName"
              size="small"
            ></el-input>
            <el-time-select
              v-model="item.sdt"
              size="small"
              :picker-options="{ start: '00:00', step: '00:05', end: '24:00' }"
              placeholder="开始时间"
            ></el-time-select>
            <el-time-select
              v-model="item.edt"
              size="small"
              :picker-options="{ start: '00:00', step: '00:05', end: '24:00' }"
              placeholder="结束时间"
            ></el-time-select>
          </div>
        </div>
      </div>
    </div>
    <div class="scheduling-wirte">
      <div class="scheduling-wirte-child">
        <span>倒班周期：</span>
        <el-input
          type="number"
          class="operator"
          @input="onCycleInputs"
          size="small"
          v-model.number="shiftCycle"
        ></el-input>
        <span>天</span>
        <span v-if="outShiftCycle" class="warning">倒班周期范围为1~10天！</span>
      </div>
      <div class="scheduling-wirte-child">
        <span>排班日期：</span>
        <el-date-picker
          v-model="schedulingDate"
          type="monthrange"
          range-separator="~"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
          size="small"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </div>
      <div class="scheduling-wirte-child">
        <span>值别颜色：</span>
        <div class="tags">
          <el-tag v-for="item in operator" :key="item" :color="colorList[item]"
            >{{ classesDict[item] }}值</el-tag
          >
        </div>
      </div>
      <!-- 排班表 -->
      <div class="scheduling-wirte-table">
        <el-table
          v-loading="opLoading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          :data="operatorOptions"
          style="width: 100%"
        >
          <el-table-column
            label="班次"
            align="center"
            prop="shiftName"
          ></el-table-column>
          <el-table-column
            :label="`第${itm}天`"
            v-for="itm in shiftCycle"
            :key="itm"
            align="center"
          >
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.turnOrder[itm - 1]"
                size="mini"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in options"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div style="display: flex; justify-content: center">
                <el-button
                  type="primary"
                  size="mini"
                  @click="moveToLeft(scope.row)"
                  >&lt;</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  @click="moveToRight(scope.row)"
                  >&gt;</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="scheduling-wirte-btn">
        <el-button type="primary" size="small" @click="getScheduleTable"
          >生成排班表</el-button
        >
      </div>
      <!-- 人员配置表 -->
      <div class="scheduling-wirte-table">
        <div>人员配置：</div>
        <el-table :data="options">
          <el-table-column
            label="班次"
            align="center"
            width="120"
            prop="label"
          ></el-table-column>
          <el-table-column label="成员" align="center">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.peopleIds"
                size="mini"
                filterable
                multiple
                placeholder="请选择成员"
              >
                <el-option
                  v-for="item in peopleOptions"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userId"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="scheduling-wirte-btn">
        <el-button type="primary" size="small" @click="savePeople"
          >保存人员信息</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import {
  getAllPeopleList,
  getReadyPeopleList,
  savePeopleList,
  getBaseData,
  saveSchedule,
} from "@/api/schedule.js";
import { getAllPlants } from "@/api/catalyzerConfigure.js";
import moment from "moment";
export default {
  data() {
    return {
      plants: [],
      plant: "G3XM",
      classesDict: ["", "一", "二", "三", "四", "五", "六"],
      opName: "五值三运",
      operator: 5,
      classes: 3,
      operatorOutRange: false,
      classesOutRange: false,
      operatorOptions: [],
      options: [],
      colorList: [
        "",
        "#f98976",
        "#28b6c1",
        "#ffef76",
        "#e6ab57",
        "#c47bcf",
        "#5d80d8",
      ],
      shiftCycle: 5,
      schedulingDate: "",
      outShiftCycle: false,
      peopleOptions: [],
      startMonth: "",
      endMonth: "",
      opLoading: false,
      pickerOptions: {
        disabledDate(time) {
          let now = Date.now();
          let nowYear = moment(now).year();
          let nowMonth = moment(now).month() + 1;
          let nextYear = nowYear + 1;
          let t1 = new Date(nowYear + "-" + nowMonth);
          let t2 = new Date(nextYear + "-" + nowMonth);
          return time.getTime() < t1 || time.getTime() > t2;
        },
      },
    };
  },
  computed: {},
  watch: {
    schedulingDate(value) {
      this.startMonth = moment(value[0]).format("YYYY-MM-DD");
      let y = moment(value[1]).year();
      let m = moment(value[1]).month() + 1;
      this.endMonth = moment(new Date(y, m, 0)).format("YYYY-MM-DD");
    },
    plant(value) {
      this.init();
      this.getAllPeople();
    },
  },
  created() {
    this.getAllPeople();
  },
  mounted() { 
     this.init();
    this.getAllPlantsInfo();
  },
  methods: {
    //   查询电厂
    getAllPlantsInfo() {
      getAllPlants().then((res) => {
        this.plants = res.data;
      });
    },
    // 初始化页面相关排班信息
    init() {
      this.opLoading = true;
      this.$nextTick(() => {
        this.getOpTimes();
      });
      getBaseData(this.plant).then((res) => {
        this.opLoading = false;
        let data = res.data;
        let { base, shift } = data;
        if (!base || !shift) {
          return;
        } else {
          this.opName = base.tsName;
          this.operator = base.tearmNum;
          this.classes = base.shiftNum;
          this.shiftCycle = base.turnCycleNum;
          this.startMonth = base.efcSdt;
          this.endMonth = base.efcEdt;
          this.schedulingDate = [new Date(base.efcSdt), new Date(base.efcEdt)];
          shift.forEach((ele) => {
            ele.turnOrder = ele.turnOrder
              .split(",")
              .map((item) => Number(item));
            delete ele.id;
          });
          this.operatorOptions = shift;
        }
      });
    },
    // 生成排班列表及默认options
    getOpTimes() {
      if (this.outShiftCycle) {
        return;
      }
      let operatorOptions = JSON.parse(JSON.stringify(this.operatorOptions));
      let options = JSON.parse(JSON.stringify(this.options));
      //循环出运行时间 -- 班次
      if (this.classes > 6 || this.classes < 1) {
        this.classesOutRange = true;
        return;
      } else {
        this.classesOutRange = false;
        let arr = [];
        for (let i = 0; i < this.classes; i++) {
          let turnOrder = [];
          for (let k = 1; k <= this.shiftCycle; k++) {
            turnOrder.push(
              k % this.operator == 0 ? this.operator : k % this.operator
            );
          }
          arr.push({
            shiftName: operatorOptions[i]
              ? operatorOptions[i].shiftName
              : "班次",
            sdt: operatorOptions[i] ? operatorOptions[i].sdt : "",
            edt: operatorOptions[i] ? operatorOptions[i].edt : "",
            turnOrder,
            shiftNum: i + 1,
          });
        }
        this.operatorOptions = arr;
      }
      // 循环出值别  -- 有几值
      if (this.operator > 6 || this.operator < 1) {
        this.classesOutRange = true;
        return;
      } else {
        this.classesOutRange = false;
        let arr = [];
        for (let j = 1; j <= this.operator; j++) {
          arr.push({
            value: j,
            label: this.classesDict[j] + "值",
            peopleIds: [],
          });
        }
        this.getReadyPeople(arr);
      }
    },
    // 值班人员初始化查询全部人员
    getAllPeople() {
      getAllPeopleList({
        orgCode: this.plant,
        teamNum: 0,
      }).then((res) => {
        let data = res.data.data;
        data.forEach((ele) => {
          ele.userId = ele.userId.toString();
        });
        this.peopleOptions = data;
      });
    },
    // 左移
    moveToLeft(data) {
      let { turnOrder } = data;
      let firstElement = turnOrder.shift();
      turnOrder.push(firstElement);
    },
    // 右移
    moveToRight(data) {
      let { turnOrder } = data;
      let lastElement = turnOrder.pop();
      turnOrder.unshift(lastElement);
    },
    // 限制排班周期输入范围1~10
    onCycleInputs(value) {
      if (value > 10 || value < 1) {
        this.shiftCycle = "";
        this.outShiftCycle = true;
      } else {
        this.outShiftCycle = false;
        this.shiftCycle = Number(value);
        this.getOpTimes();
      }
    },
    // 限制值输入范围1~6
    onOperatorInput(value) {
      if (value > 6 || value < 1) {
        this.operator = "";
        this.operatorOutRange = true;
      } else {
        this.operatorOutRange = false;
        this.operator = Number(value);
        this.getOpTimes();
      }
    },
    // 限制班输入范围1~6
    onClassesInput(value) {
      if (value > 6 || value < 1) {
        this.classes = "";
        this.classesOutRange = true;
      } else {
        this.classesOutRange = false;
        this.classes = Number(value);
        this.getOpTimes();
      }
    },
    // 生成排班表
    getScheduleTable() {
      let bool = true;
      let hdDutyConfig = {
        plantCode: this.plant,
        tsName: this.opName,
        tearmNum: this.operator,
        shiftNum: this.classes,
        turnCycleNum: this.shiftCycle,
        efcSdt: this.startMonth,
        efcEdt: this.endMonth,
      };
      Object.keys(hdDutyConfig).map((ele) => {
        if (!hdDutyConfig[ele]) {
          bool = false;
          return this.$message.error("请填写完整信息！");
        }
      });
      let hdDutyShiftConfigList = JSON.parse(
        JSON.stringify(this.operatorOptions)
      );
      let len = 0;
      hdDutyShiftConfigList.forEach((ele) => {
        len = ele.turnOrder.length;
        ele.turnOrder = ele.turnOrder.join(",");
        ele.plantCode = this.plant;
        if ((ele.sdt && !ele.edt) || (!ele.sdt && ele.edt)) {
          bool = false;
          return this.$message.error("同一个班次起止时间不能同时为空！");
        }
      });
      for (let i = 0; i < len; i++) {
        let arry = [];
        this.operatorOptions.forEach((item) => {
          arry.push(item.turnOrder[i]);
        });
        let arry1 = [...new Set(arry)];
        if (arry.length != arry1.length) {
          bool = false;
          return this.$message.error("同一天值别不能重复！");
        }
      }
      let colorList = this.colorList;
      let teamColorMapping = {};
      for (let i = 1; i <= this.operator; i++) {
        teamColorMapping["" + i + ""] = colorList[i];
      }
      if (!bool) {
        return;
      } else {
        saveSchedule({
          plantCode: this.plant,
          hdDutyConfig,
          hdDutyShiftConfigList,
          teamColorMapping,
        }).then((res) => {
          let code = res.code;
          if (code == 0) {
            this.$message.success("生成排班表成功！");
            this.init();
          } else {
            this.$message.error("生成排班表失败！");
          }
        });
      }
    },
    //值班人员初始化查询已排好班的人员
    getReadyPeople(arr) {
      getReadyPeopleList({
        orgCode: this.plant,
      }).then((res) => {
        let data = res.data.data;
        arr.forEach((item) => {
          data.forEach((ele) => {
            if (ele.teamName == item.label) {
              item.peopleIds = ele.ids.split(",");
              item.teamColor = ele.teamColor;
            }
          });
        });
        this.options = arr;
      });
    },
    // 保存人员信息
    savePeople() {
      let options = JSON.parse(JSON.stringify(this.options));
      let bool = true;
      let arr = [];
      options.forEach((ele) => {
        if (ele.peopleIds.length == 0) {
          bool = false;
        } else {
          arr.push({
            ids: ele.peopleIds.join(","),
            plantCode: this.plant,
            teamName: ele.label,
            teamNum: ele.value,
            teamColor: this.colorList[ele.value],
          });
        }
      });
      if (!bool) {
        return this.$message.error("人员配置不能为空！");
      } else {
        savePeopleList(arr).then((res) => {
          let code = res.data.code;
          if (code == 0) {
            this.$message.success("保存成功！");
          } else {
            this.$message.error("保存失败！");
          }
        });
      }
    },
  },
};
</script>
<style lang="scss">
.scheduling {
  height: 100%;
  background: url("../../assets/images/border.png") no-repeat center;
  background-size: 100% 100%;
  padding: 0.3rem 0;
  overflow: auto;
  .scheduling-base {
    margin-left: 0.2rem;
    display: flex;
    flex-direction: column;
    .scheduling-base-box {
      display: flex;
      align-items: center;
      & > span {
        display: inline-block;
        min-width: 1rem;
        text-align: center;
        margin-bottom: 0.1rem;
      }
      .scheduling-base-box-child {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        & > span {
          display: inline-block;
          min-width: 1rem;
          text-align: right;
          margin-bottom: 0.1rem;
          padding-right: 0.1rem;
        }
        .opClasses {
          .el-date-editor.el-input,
          .el-date-editor.el-input__inner {
            width: 1.3rem;
            margin-right: 0.1rem;
          }
        }
        .opName {
          max-width: 1.5rem;
          margin-right: 0.1rem;
          margin-bottom: 0.1rem;
        }
        .operator {
          max-width: 1rem;
          margin-right: 0.1rem;
          margin-bottom: 0.1rem;
        }
        .opTime {
          max-width: 0.62rem;
          margin-right: 0.1rem;
          margin-bottom: 0.1rem;
        }
        .opTimePick {
          width: 2.5rem;
          margin-right: 0.1rem;
          margin-bottom: 0.1rem;
        }
      }
      .btn {
        margin-top: -0.1rem;
        margin-left: 0.1rem;
      }
    }
  }
  .scheduling-wirte {
    margin-left: 0.2rem;
    display: flex;
    flex-direction: column;
    .scheduling-wirte-child {
      display: flex;
      align-items: center;
      margin-bottom: 0.1rem;
      & > span:first-child {
        display: inline-block;
        min-width: 1rem;
        text-align: center;
      }
      .operator {
        max-width: 1rem;
        margin-right: 0.1rem;
      }
      .tags {
        & > .el-tag {
          margin: 0 0.1rem;
          padding: 0 0.2rem;
          color: #000000;
        }
      }
    }
    .scheduling-wirte-table {
      padding: 0.1rem 0.3rem 0 0.1rem;
      .el-select {
        width: 100%;
      }
    }
    .scheduling-wirte-btn {
      margin: 0.2rem 0.1rem;
    }
  }
}
.warning {
  display: inline-block;
  margin-left: 0.2rem;
  color: red;
  font-size: 0.14rem;
}
</style>