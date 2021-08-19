<template>
  <div
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    class="EnergyConsum"
  >
    <div class="EnergyConsum-head">
      <!-- <el-button type="primary" size="small" @click="onDay">近一天</el-button>
      <el-button type="primary" size="small" @click="onWeek">近一周</el-button>
      <el-button type="primary" size="small" @click="onMonth">近一月</el-button> -->
      <div class="time-picker">
        <span class="demonstration">选择日期</span> &nbsp;
        <el-date-picker
          v-model="time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="small"
          :picker-options="pickerOptions"
          :disabled="isDisable"
        >
        </el-date-picker>
      </div>
      <el-button
        style="margin-left: 0.2rem"
        type="primary"
        size="small"
        :disabled="isDisable"
        @click="onSearch"
        >查询</el-button
      >
    </div>
    <div class="EnergyConsum-div">
      <div v-for="(item, idx) in datas" :key="idx">
        <MyGroup
          :list="item.children"
          :title="item.crName"
          :titleVal="item.value"
          :showTitleVal="item.children.length <= 0"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import MyGroup from "@/components/MyGroup/index";
import { getInstanceId, getEnergyConsum } from "@/api/energyConsum";

import moment from "moment";
export default {
  //还原剂耗用分析
  data() {
    return {
      time: [
        moment().subtract(1, "days").format("YYYY-MM-DD 00:00:00"),
        moment().format("YYYY-MM-DD 00:00:00"),
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      datas: [],
      loading: false,
      query: {
        beginTime: moment().subtract(1, "days").format("YYYY-MM-DD 00:00:00"),
        endTime: moment().format("YYYY-MM-DD 00:00:00"),
      },
      isDisable: false,
    };
  },
  computed: {
    ...mapState({
      msg: (state) => state.socket.message,
      plantCode: (state) => state.user.plantCode,
      unitList: (state) => state.dashboard.unitList,
      insList: (state) => state.user.instanceIdList,
      activeModel: (state) => state.app.activeModel,
      dictionary: (state) => state.dashboard.dictionary,
    }),
  },
  components: {
    MyGroup,
  },
  mounted() {
    this.init(this.plantCode);
  },
  watch: {
    plantCode(value) {
      this.init(value);
    },
    time(value) {
      if (!value) {
        return;
      } else {
        this.query.beginTime = moment(value[0]).format("YYYY-MM-DD HH:00:00");
        this.query.endTime = moment(value[1]).format("YYYY-MM-DD HH:00:00");
        this.init(this.plantCode);
      }
    },
  },
  methods: {
    onSearch() {
      this.init(this.plantCode);
    },
    onDay() {
      this.query.beginTime = moment()
        .subtract(1, "days")
        .format("YYYY-MM-DD 00:00:00");
      this.query.endTime = moment().format("YYYY-MM-DD 00:00:00");
      this.init(this.plantCode);
    },
    onWeek() {
      this.query.beginTime = moment()
        .subtract(7, "days")
        .format("YYYY-MM-DD 00:00:00");
      this.query.endTime = moment().format("YYYY-MM-DD 00:00:00");
      this.init(this.plantCode);
    },
    onMonth() {
      this.query.beginTime = moment()
        .subtract(7, "days")
        .format("YYYY-MM-DD 00:00:00");
      this.query.endTime = moment().format("YYYY-MM-DD 00:00:00");
      this.init(this.plantCode);
    },
    getEnergyConsum(value) {
      this.loading = true;
      getEnergyConsum({
        instanceId: value,
        ...this.query,
      })
        .then((res) => {
          this.loading = false;
          this.datas = res.data;
        })
        .catch((err) => {
          this.loading = false;
          this.$message({
            message: err,
            type: "error",
          });
        });
    },
    init(value) {
      getInstanceId({
        plantCode: value,
        modelCode: this.activeModel,
      }).then((res) => {
        let data = res.data;
        if (data.length > 0) {
          let instanceId = data[0].id;
          let enable = data[0].enable;
          if (enable == 0) {
            this.datas = [];
            this.isDisable = true;
            if (this.$route.path == "/model/ays/ReductantConsum") {
              return this.$message.error("该模型未启用");
            } else {
              return;
            }
          } else {
            this.isDisable = false;
            this.getEnergyConsum(instanceId);
          }
        } else {
          this.datas = [];
          this.isDisable = true;
          if (this.$route.path == "/model/ays/ReductantConsum") {
            return this.$message.error("当前电厂暂无此模型");
          } else {
            return;
          }
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.EnergyConsum {
  overflow: scroll;
  // font-family: PingFang-SC-Medium;
  height: -webkit-fill-available;
  background: url("../../assets/images/border.png") no-repeat center;
  background-size: 100% 100%;
  .EnergyConsum-head {
    // text-align: right;
    padding: 0.2rem 0.2rem 0;
    display: flex;
    .time-picker {
      margin-left: 0.2rem;
      color: #a8cdd4;
      font-size: 0.14rem;
      display: flex;
      align-items: center;
      .demonstration {
        min-width: 0.7rem;
      }
    }
  }
  .EnergyConsum-div {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    padding: 0.15rem;
    // background: #6582ad;
  }
}
.EnergyConsum::-webkit-scrollbar {
  display: none;
}
</style>