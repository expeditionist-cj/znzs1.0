<template>
  <div class="my-table" >
    <el-table size="small"  :data="tableData" border style="width: 100%">
      <el-table-column
        align="center"
        prop="taskServiceTime"
        label="服役时间(d)"
        width="180"
      >
      </el-table-column>
      <el-table-column
        align="center"
        prop="smokeVolume"
        label="烟气量(Nm3/h)"
        width="180"
      >
      </el-table-column>
      <el-table-column
        align="center"
        prop="inNoxConcentration"
        label="入口Nox浓度(mg/Nm3)"
      >
      </el-table-column>
      <el-table-column
        align="center"
        prop="outNoxConcentration"
        label="出口Nox浓度(mg/Nm3)"
      >
      </el-table-column>
      <el-table-column align="center" prop="scrEfficiency" label="脱硝效率(%)">
      </el-table-column>
      <el-table-column align="center" prop="ammoniaInjection" label="喷氨量(kg/h)">
      </el-table-column>
      <el-table-column align="center" prop="ammoniaAir" label="氨空比">
      </el-table-column>
      <el-table-column align="center" prop="smokeTemperature" label="烟气温度(°C)">
      </el-table-column>
      <el-table-column align="center" prop="ammoniaNitrogen" label="氨氮比">
      </el-table-column>
      <el-table-column align="center" prop="active" label="活性">
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
