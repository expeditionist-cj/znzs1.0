<template>
  <div class="instanceList-wrap">
    <BasicLayout>
      <div slot="header" style="text-align: left; color: #a0c7d0">
        <span>项目：</span>
        <el-input
          size="small"
          placeholder="请输入内容"
          v-model="plantName"
          clearable
        >
        </el-input>
        <span>模型名称：</span>
        <el-input
          size="small"
          placeholder="请输入内容"
          v-model="modelName"
          clearable
        >
        </el-input>
        <span>状态：</span>
        <el-select v-model="enable" clearable placeholder="请选择" size="small">
          <el-option
            v-for="item in statusOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button
          type="primary"
          :loading="loading"
          icon="el-icon-circle-check"
          @click="init"
          size="mini"
          >查询</el-button
        >
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-circle-plus"
          @click="toFirstStep"
          >新增</el-button
        >
      </div>
      <div slot="main">
        <!-- 模型列表 -->
        <el-table
          ref="singleTable"
          :data="tableData"
          highlight-current-row
          style="width: 100%"
          border
          size="small" 
          height="5.8rem"
        >
          <el-table-column
            type="index"
            width="50"
            label="序号"
            align="center"
          ></el-table-column>
          <el-table-column
            property="type_name"
            label="模型分类"
            sortable=""
            min-width="120"
            align="center"
          ></el-table-column>
          <el-table-column
            property="short_name"
            label="模型名称"
            sortable=""
            min-width="120"
            align="center"
          ></el-table-column>
          <el-table-column
            property="plant_cn"
            label="项目"
            sortable=""
            min-width="120"
            align="center"
          ></el-table-column>
          <el-table-column
            property="fix_cn"
            label="装置"
            sortable=""
            width="160"
            align="center"
          >
            <template slot-scope="scope">
              {{
                (scope.row.fix_cn || "") +
                (scope.row.sub_fix_code ? scope.row.sub_fix_code + "侧" : "")
              }}
            </template>
          </el-table-column>
          <el-table-column
            property="cplt_prc_cn"
            label="完成度"
            sortable
            align="center"
          ></el-table-column>
          <el-table-column
            property="cplt_prc"
            label="完成步骤"
            sortable
            align="center"
            min-width="100"
          ></el-table-column>
          <el-table-column
            property="enable"
            label="状态"
            sortable
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="!scope.row.enable">未启用</span>
              <span v-else>启用</span>
            </template>
          </el-table-column>
          <el-table-column
            property="address"
            label="操作"
            align="center"
            min-width="200"
          >
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="update(scope.row)"
                >修改</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="onStopAndRun(scope.row, scope.$index)"
                >{{ scope.row.enable ? "停用" : "启用" }}</el-button
              >
              <el-button type="text" size="small" @click="check(scope.row)"
                >查看</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="page">
          <el-pagination
            layout="prev, pager, next,total"
            @current-change="currentChange1"
            :current-page.sync="currentPage"
            :page-size="10"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </BasicLayout>
    <!-- 模型实例查看 -->
    <el-drawer
      :title="title"
      type="primary"
      :visible.sync="modelInstanceVisible"
      direction="rtl"
      size="60%"
      @close="showContent = false"
    >
      <el-divider content-position="left"
        ><span class="detail">详情</span></el-divider
      >
      <div v-if="showNormalModel">
        <div class="el-drawer-main" v-if="showContent">
          <!-- 基本信息 -->
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <i class="el-icon-info"></i><span>基本信息</span>
            </div>
            <div>
              <BasicInfo></BasicInfo>
            </div>
          </el-card>
          <!-- 专家经验参数 -->
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <i class="el-icon-s-custom"></i><span>基础设置</span>
            </div>
            <div>
              <PersonInfo></PersonInfo>
            </div>
          </el-card>
          <!-- 算法绑定网点设置 -->
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <i class="el-icon-s-tools"></i><span>详细设置</span>
            </div>
            <div>
              <MyTatable :tableData="tableData"></MyTatable>

              <!-- <div class="myTable-title">展示用点</div>
            <MyTatable :tableData="tableData"></MyTatable> -->
            </div>
          </el-card>
        </div>
      </div>
      <div v-else>
        <div class="el-drawer-main" v-if="showContent">
          <!-- 基本信息 -->
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <i class="el-icon-info"></i><span>基本信息</span>
            </div>
            <div>
              <BasicInfo :showNormalModel="showNormalModel"></BasicInfo>
            </div>
          </el-card>
          <!-- 选择参数 -->
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <i class="el-icon-s-custom"></i><span>参数信息</span>
            </div>
            <div>
              <csTable />
            </div>
          </el-card>
          <!-- 算法绑定网点设置 -->
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <i class="el-icon-s-tools"></i><span>公式信息</span>
            </div>
            <div>
              <gsTable :tableData="tableData"></gsTable>

              <!-- <div class="myTable-title">展示用点</div>
            <MyTatable :tableData="tableData"></MyTatable> -->
            </div>
          </el-card>
        </div>
      </div>
      <MyBackToTop target=".el-drawer"></MyBackToTop>
    </el-drawer>
  </div>
</template>

<script>
import BasicLayout from "@/commonLayout/basicLayout";
import BasicInfo from "../basicInfo/index";
import PersonInfo from "../personInfo/index";
import MyTatable from "../myTable/index";
import { selectByPage, updateStopAndRun } from "@/api/modelnstanceBasicInfo";
import MyBackToTop from "@/components/MyBackToTop/index";
import { selectInstanceId, selectImportantIndicator } from "@/api/dashboard";
import { mapState } from "vuex"; // 引入vuex state
import gsTable from "../gsTable/index";
import csTable from "../csTable/index";
export default {
  name: "InstanceList",
  props: {},
  data() {
    return {
      plantName: "",
      modelName: "",
      enable: "",
      tableData: [],
      modelInstanceVisible: false,
      showContent: false,
      showNormalModel: true,
      pageCount: 0,
      currentPage: 1,
      statusOption: [
        {
          label: "启用",
          value: 1,
        },
        {
          label: "停用",
          value: 0,
        },
      ],
      loading: false,
      title: "",
      total: 0,
      query: {},
    };
  },
  components: {
    BasicLayout,
    BasicInfo,
    PersonInfo,
    MyTatable,
    MyBackToTop,
    gsTable,
    csTable,
  },
  computed: {
    ...mapState({
      unitList: (state) => state.dashboard.unitList,
      plantCode: (state) => state.user.plantCode,
      statePlantName: (state) => state.backend.plantName,
      stateModelName: (state) => state.backend.modelName,
      stateEnable: (state) => state.backend.enable,
    }),
  },
  created() {
    this.$store.commit("backend/CHANGE_ADDFIRST", false);
    this.$store.commit("backend/CHANGE_ADDSECEND", false);
    this.$store.commit("backend/CHANGE_ADDTHIRD", false);
    this.$store.commit("backend/CHANGE_ADDINSTANCEID", false);
  },
  mounted() {
    this.plantName = this.statePlantName;
    this.modelName = this.stateModelName;
    this.enable = this.stateEnable;
    this.init();
    window.vue = this;
  },
  destroyed() {
    if (this.$route.path.indexOf("parame") < 0) {
      this.$store.commit("backend/CHANGE_PLANTNAME", "");
      this.$store.commit("backend/CHANGE_MODELNAME", "");
      this.$store.commit("backend/CHANGE_ENABLE", "");
    }
  },
  watch: {
    plantName(value) {
      this.$store.commit("backend/CHANGE_PLANTNAME", value);
    },
    modelName(value) {
      this.$store.commit("backend/CHANGE_MODELNAME", value);
    },
    enable(value) {
      this.$store.commit("backend/CHANGE_ENABLE", value);
    },
  },
  methods: {
    toFirstStep() {
      this.$store.commit("backend/CHANGE_SHOW", "FirstStep");
    },
    init() {
      this.query = {
        pn: this.currentPage,
        ps: 10,
        plantName: this.statePlantName,
        modelName: this.stateModelName,
        enable: this.stateEnable,
      };
      selectByPage(this.query)
        .then((res) => {
          let data = res.data;
          this.currentPage = data.current;
          this.tableData = data.records;
          this.total = data.total;
        })
        .catch((e) => {});
    },
    // 修改
    update(row) {
      let instanceId = row.id;
      let modelCode = row.model_code;
      let cpltPrc = row.cplt_prc;
      let { enable } = row;
      if (enable == 1) {
        this.$message({
          message: "请先停用该模型",
          type: "warning",
        });
        return false;
      }

      switch (cpltPrc) {
        case "1/3":
          this.$store.commit("backend/CHANGE_ADDFIRST", true);
          this.$store.commit("backend/CHANGE_ADDSECEND", false);
          this.$store.commit("backend/CHANGE_ADDTHIRD", false);
          break;
        case "2/3":
          this.$store.commit("backend/CHANGE_ADDFIRST", true);
          this.$store.commit("backend/CHANGE_ADDSECEND", true);
          this.$store.commit("backend/CHANGE_ADDTHIRD", false);
          break;
        case "3/3":
          this.$store.commit("backend/CHANGE_ADDFIRST", true);
          this.$store.commit("backend/CHANGE_ADDSECEND", true);
          this.$store.commit("backend/CHANGE_ADDTHIRD", true);
          break; 
        case "1/2":
          this.$store.commit("backend/CHANGE_ADDFIRST", true);
          this.$store.commit("backend/CHANGE_ADD_ENG_SUB_CONSUME", false);
          break;
        case "2/2":
          this.$store.commit("backend/CHANGE_ADDFIRST", true);
          this.$store.commit("backend/CHANGE_ADD_ENG_SUB_CONSUME", true);
          break;
        default:
          this.$store.commit("backend/CHANGE_ADDFIRST", false);
          this.$store.commit("backend/CHANGE_ADDSECEND", false);
          this.$store.commit("backend/CHANGE_ADDTHIRD", false);
          break;
      }
      this.$store.commit("backend/CHANGE_ADDINSTANCEID", instanceId);
      this.$store.commit("backend/CHANGE_MODELCODE", modelCode);
      this.$store.commit("backend/CHANGE_SHOW", "FirstStep");
    },
    check(row) {
      if (
        row.model_code == "water_csp" ||
        row.model_code == "steam_csp" ||
        row.model_code == "abs_csp" ||
        row.model_code == "red_csp" ||
        row.model_code == "power_csp"
      ) {
        this.showNormalModel = false;
      } else {
        this.showNormalModel = true;
      }
      this.modelInstanceVisible = !this.modelInstanceVisible;
      let instanceId = row.id;
      this.$store.commit("backend/CHANGE_ADDINSTANCEID", instanceId);
      this.$nextTick(() => {
        this.showContent = true;
      });
      this.title = `${row.type_name}-${row.short_name}-${row.plant_cn}${
        row.fix_cn ? "-" : ""
      }${row.fix_cn || ""}-完成${row.cplt_prc}
      `;
    },
    currentChange1(data) {
      this.init();
    },
    onStopAndRun(data, index) {
      let flag = data.enable;
      let query = {
        id: data.id,
        enable: "",
        modelCode: data.model_code,
      };
      if (flag == 0) {
        // 启用
        query.enable = 1;
      } else {
        // 停用
        query.enable = 0;
      }
      updateStopAndRun(query)
        .then((res) => {
          if (res.data == true && res.msg == "成功") {
            this.$message.success("操作成功");
            this.tableData[index].enable = query.enable;
            this.refreshUnitList();
          } else {
            this.$message.error(res.data);
          }
        })
        .catch((e) => {
          this.$message.error(e);
        });
    },
    refreshUnitList() {
      this.$store.dispatch("dashboard/getUnitList", this.plantCode);
      // 获取关键指标信息
      // selectImportantIndicator({ plant: this.plantCode }).then((res) => {
      //   let unitStatus = res.data.unitStatus[0];
      //   let copy = JSON.parse(JSON.stringify(this.unitList));
      //   copy.forEach((item) => {
      //     item.status = unitStatus[item.deviceName];
      //   });
      //   this.$store.commit("dashboard/SET_UNITLIST", copy);
        // 分页查询当前电厂的所有instanceId
        selectInstanceId({
          pn: 1,
          ps: 500,
        }).then((res) => {
          let data = res.data.records;
          this.$store.commit("user/SET_INSTANCEIDLIST", data);
        });
      // });
    },
  },
};
</script>

<style scoped lang="scss">
.instanceList-wrap {
  height: 100%; 
  
  .page {
    height: 30px;
    margin-top: 20px;
    text-align: center;
  }
  .el-input {
    display: inline-block;
    width: 200px;
  }
  .el-drawer {
    padding: 0 0.1rem;
    overflow: auto;
    .el-drawer__header {
      margin-bottom: 0 !important;
    }
    .el-drawer-title {
      text-align: center;
    }
    .el-drawer-main {
      padding: 0 0.2rem;
      margin-bottom: 0.3rem;
      .box-card {
        i {
          font-size: 0.2rem;
          color: red;
        }
        span {
          font-size: 0.2rem;
          color: #69fff9;
        }
        .myTable-title {
          font-weight: 400;
          color: #69fff9;
          font-size: 0.14rem;
          margin: 0.1rem 0;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.instanceList-wrap {
  overflow: auto;
  .el-drawer {
    padding: 0 10px;
    overflow: auto;
    .el-drawer__header {
      margin-bottom: 0 !important;
    }
    .el-card {
      border: 1px solid rgba(255, 255, 255, 0.2) !important;
      line-height: 0;
    }
  }
  .el-divider {
    .detail {
      font-weight: 400;
      color: rgba(0, 0, 0, 0.45);
    }
  }
  .el-loading-mask {
    background-color: rgba(185, 178, 178, 0.5) !important;
  }
}
</style>
