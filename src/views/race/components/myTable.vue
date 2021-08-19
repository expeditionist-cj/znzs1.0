<template>
  <div class="my-table">
    <el-table size="small" :data="tableData" border style="width: 100%">
      <el-table-column
        align="center"
        prop="useHour"
        label="服役时间(d)"
        width="180"
      >
      </el-table-column>
      <el-table-column
        align="center"
        prop="outSmkFlow"
        label="烟气量(Nm3/h)"
        width="180"
      >
      </el-table-column>
      <el-table-column
        align="center"
        prop="inNoxCv"
        label="入口Nox浓度(mg/Nm3)"
      >
      </el-table-column>
      <el-table-column
        align="center"
        prop="outNOxCv"
        label="出口Nox浓度(mg/Nm3)"
      >
      </el-table-column>
      <el-table-column align="center" prop="noxRate" label="脱硝效率(%)">
      </el-table-column>
      <el-table-column align="center" prop="nh3Amount" label="喷氨量(kg/h)">
      </el-table-column>
      <el-table-column align="center" prop="naRate" label="氨空比">
      </el-table-column>
      <el-table-column align="center" prop="smkTmpr" label="烟气温度(°C)">
      </el-table-column>
      <el-table-column align="center" prop="nnRate" label="氨氮比">
      </el-table-column>
      <el-table-column align="center" prop="act" label="活性">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "table",
  props:{
    tableData:{
      type: Array,
      default:()=>[]
    }
  },
  data() {
    return {
    };
  },
};
</script>

<style lang="scss">
.my-table {
  height: 100%;
}
</style>
