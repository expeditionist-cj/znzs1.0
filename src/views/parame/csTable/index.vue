<template>
  <div>
    <div class="content">
      <el-table
        max-height="50vh"
        height="400"
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
            <span style="cursor: pointer">{{ scope.row.sdt_name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="aliasName"
          label="别名"
          min-width="180"
        >
          <template slot-scope="scope">
            <span style="cursor: pointer">{{ scope.row.an }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import {
  getSdtPoints,
  getSelSdtPoints, 
} from "@/api/alg";
import { mapState } from "vuex"; // 引入vuex state

export default {
  data() {
    return {
      tableData: [],
      points_options: [],
      points: [],
    };
  },
  computed: {
    ...mapState({
      addInstanceId: (state) => state.backend.addInstanceId,
      plantCode: (state) => state.backend.plantCode,
      unitCode: (state) => state.backend.unitCode,
    }),
  },
  mounted() {
    this.init();
  },
  methods: {
    // init() {
    //   getSelSdtPoints(this.addInstanceId).then((res) => {
    //     this.tableData = res.data.data;
    //   });
    // },
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
            this.check()
          }
        })
        .catch((e) => {
          this.$message({
            type: "error",
            message: e,
          });
        });
    },
    check() {
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
    },
    changeSel(value) {
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
      this.tableData = selData;
    },
  },
};
</script>