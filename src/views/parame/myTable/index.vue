<template>
  <div class="myTable-index-wrap">
    <AlgDisplay :tableData="routinePoints" :key="'routinePoints'"></AlgDisplay>
    <el-collapse :value="0" v-for="(item,index) in listPoints" :key="index">
      <el-collapse-item :title="item.pointTitle" :name="index">
          <AlgDisplay :tableData="item.list" :key="item.param_cn+index"></AlgDisplay>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import AlgDisplay from "./algDisplay";
import { queryByInstanceId } from "@/api/alg";
import { mapState } from "vuex"; // 引入vuex state
export default {
  props: {},
  data() {
    return {
      routinePoints: [],
      listPoints: []
    };
  },
  components: { AlgDisplay },
  computed: {
    ...mapState({
      addInstanceId: state => state.backend.addInstanceId
    })
  },
  created() {
    this.init();
  },
  mounted() {},
  watch: {},
  methods: {
    init() {
      queryByInstanceId({ instanceId: this.addInstanceId }).then(res => {
        let data = res.data;
        console.log(data);
        // 常规计算点
        let routinePoints = [];
        let listPoints = [];
        data.forEach((item, index) => {
          if (item.type == "list") {
            let catchObj = {
              pointTitle:"",
              list:[]
            };
            catchObj.pointTitle = item.param_cn;
            // 构造 list点数据结构
            item.list.forEach((ele, idx) => {

              ele.dynamicValidateForm = {
                domains: [],
                formula: ""
              };
              if (!ele.is_bind) {
                ele.dynamicValidateForm.formula = ele.cpt_exp;
                ele.dynamicValidateForm.domains = JSON.parse(ele.mtp_points);
                let arry = [];
                ele.dynamicValidateForm.domains.forEach((o, idx) => {
                  let obj = {};
                  obj.cn = o.name;
                  obj.en = o["P" + idx];
                  arry.push(obj);
                });
                ele.dynamicValidateForm.domains = arry;
              }
              ele.point_type == this.type;
              catchObj.list.push(ele);
            });
            listPoints.push(catchObj);
          } else {
            item.dynamicValidateForm = {
              domains: [],
              formula: ""
            };
            // 构造常规点数据结构
            if (!item.is_bind) {
              item.dynamicValidateForm.formula = item.cpt_exp;
              item.dynamicValidateForm.domains = JSON.parse(item.mtp_points);
              let arry = [];
              item.dynamicValidateForm.domains.forEach((ele, idx) => {
                let obj = {};
                obj.cn = ele.name;
                obj.en = ele["P" + idx];
                arry.push(obj);
              });
              item.dynamicValidateForm.domains = arry;
            }
            item.point_type == this.type;
            routinePoints.push(item);
          }
        });
        this.routinePoints = routinePoints;
        this.listPoints = listPoints;
        console.log(this.routinePoints, this.listPoints);
      });
    }
  }
};
</script>

<style scoped lang="scss">
.myTable-index-wrap {
}
</style>
