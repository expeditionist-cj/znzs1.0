<template>
  <div class="viewSchedule" v-loading="loading">
    <div class="tool">
      <span class="title">选择项目</span>
      <el-select
        style="margin-right:0.2rem"
        v-model="selPlantCode"
        placeholder="请选择"
        @change="changePlant"
        size="small"
      >
        <el-option
          v-for="item in plants"
          :key="item.deptCode"
          :label="item.deptName"
          :value="item.deptCode"
        ></el-option>
      </el-select>
      <span class="title">选择月份</span>
      <el-date-picker
        v-model="month"
        type="month"
        format="yyyy-MM"
        size="small"
        placeholder="选择月"
      >
      </el-date-picker>
      <el-button
        type="primary"
        size="small"
        :disabled="!tableData"
        @click="onExport"
        >导出</el-button
      >
    </div>
    <div class="content">
      <div v-if="!tableData" style="fontSize:0.2rem;text-align:center;heigth:2rem;line-height:2rem">
        暂无排班表
      </div>
      <table
        v-else
        style="width:100%;font-size:9px;text-align:center;vertical-align:center;border-style:thin;font-family:SimSun"
      >
        <tr style="font-size: 16px;font-weight:bold">
          <td colspan="40">
            {{ tableData.name }}{{ moment(month).format("YYYY") }}年{{
              moment(month).format("MM")
            }}月 排班表
          </td>
        </tr>
        <tr style="font-size: 10px;font-weight:bold">
          <td colspan="40" style="text-align:left">
            <span v-for="(titleItem, index) in tableData.title" :key="index">
              {{ titleItem.ss }}
              <span v-if="titleItem.sdt">
                {{ titleItem.sdt }} - {{ titleItem.edt }} &nbsp;&nbsp;&nbsp;
              </span>
              
            </span>
          </td>
        </tr>

        <tr>
          <td rowspan="2">班次</td>
          <td v-for="(bodyItem, index) in tableData.bodyList" :key="index">
            {{ bodyItem.day }}
          </td>
        </tr>
        <tr>
          <td v-for="(bodyItem, index) in tableData.bodyList" :key="index">
            {{ bodyItem.weekDay }}
          </td>
        </tr>
        <tr
          v-for="(item, index) in tableData.bodyList
            ? tableData.bodyList[0].stArrange
            : []"
          :key="index"
        >
          <td>{{ tableData.bodyList[0].stArrange[index].ss }}</td>
          <td
            v-for="(obj, idx) in tableData.bodyList"
            :key="idx"
            :style="{
              'background-color': obj.stArrange[index].tc,
              color: 'black'
            }"
          >
            {{ obj.stArrange[index].ts }}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { getScheduleList } from "@/api/viewSchedule";
import moment from "moment";
import {excel} from "@/utils/commonUtil";
export default {
  computed: {
    ...mapState({
      plants: state => state.user.plants
    })
  },
  watch: {
    month(value) {
      let reqMonth = this.moment(value).format("YYYY-MM");
      this.getScheduleList({
        date: reqMonth,
        // orgCode:this.plants[0].deptCode
        orgCode: this.selPlantCode
      });
    }
  },
  data() {
    return {
      loading: false,
      month: new Date(),
      selPlantCode: "",
      name: "",
      year: "",
      tableData: null
    };
  },
  mounted() {
    this.init();
    this.selPlantCode = this.plants[0].deptCode;
  },
  methods: {
    init() {
      this.getScheduleList({
        date: this.moment(this.month).format("YYYY-MM"),
        orgCode: this.plants[0].deptCode
      });
    },
    changePlant(value) {

      this.getScheduleList({
        date: this.moment(this.month).format("YYYY-MM"),
        // orgCode:this.plants[0].deptCode
        orgCode: value
      });
    },
    // 获取排班list
    getScheduleList(query) {
      this.loading = true;
      getScheduleList(query)
        .then(res => {
          let data = res.data;
          this.tableData = null;
          if (data != null) {
            this.tableData = data;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onExport() {
      excel("/dutyRecord/export", {
        date: this.moment(this.month).format("YYYY-MM"),
        // orgCode:this.plants[0].deptCode
        orgCode: this.selPlantCode
      }).then(res => {
        let excelName = `${this.moment(this.month).format("YYYY")}年 ${this.moment(this.month).format("MM")}月 排班表.xlsx`;
        this.excel(res, excelName);
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.viewSchedule {
  height: 100%;
  .tool {
    margin-top: -0.6rem;
    .title {
      font-size: 0.14rem;
    }
  }
  .content {
    table {
      border-right: 1px solid #fff;
      border-bottom: 1px solid #fff;
    }

    td {
      height: 0.6rem;
      border-left: 1px solid #fff;
      border-top: 1px solid #fff;
    }
  }
}
</style>
