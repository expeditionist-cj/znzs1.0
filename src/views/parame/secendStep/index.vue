<template>
  <div class="secendStep-wrap">
    <BasicLayout>
      <div slot="header">
        <el-steps :active="1" finish-status="success" simple>
          <el-step title="基本信息" icon="el-icon-edit"></el-step>
          <el-step title="基础设置" icon="el-icon-s-custom"></el-step>
          <el-step title="详细设置" icon="el-icon-s-tools"></el-step>
        </el-steps>
      </div>
      <div slot="main" style="margin-bottom: 117px">
        <ExpertSetting
          v-for="(item, index) in paramList"
          :key="index"
          :label="item.param_cn"
          elForm="elForm"
          ref="elForm"
          :formData="item.formData"
          :dimension="item.dimension"
        />
        <el-card class="secendStep-tool-wrap">
          <el-button
            size="small"
            icon="el-icon-circle-check"
            type="primary"
            @click="submitForm"
            :loading="loading"
            >提交</el-button
          >
          <el-button
            v-if="!addSecend"
            size="small"
            icon="el-icon-circle-close"
            type="primary"
            @click="resetForm"
            >重置</el-button
          >
          <el-button
            size="small"
            icon="el-icon-s-order"
            type="primary"
            @click="$store.commit('backend/CHANGE_SHOW', 'InstanceList')"
            >返回列表</el-button
          >
          <el-button
            size="small"
            icon="el-icon-back"
            type="primary"
            @click="goback"
            >上一步</el-button
          >
          <el-button
            size="small"
            icon="el-icon-right"
            type="primary"
            v-if="addSecend"
            @click="$store.commit('backend/CHANGE_SHOW', 'ThirdStep')"
            >下一步</el-button
          >
        </el-card>
      </div>
    </BasicLayout>
  </div>
</template>
<script>
import BasicLayout from "@/commonLayout/basicLayout";
import { mapState } from "vuex"; // 引入vuex state
import {
  selectModelParamDicList,
  validateConstParamCode,
  batchSave,
  queryByInstanceId,
  update,
} from "@/api/modelnstanceBasicInfo";
import ExpertSetting from "./expertSetting/index";
let _this = "";
export default {
  name: "SecendStep",
  components: { BasicLayout, ExpertSetting },
  props: [],
  data() {
    return {
      paramList: [],
      loading: false,
    };
  },
  computed: {
    ...mapState({
      addInstanceId: (state) => state.backend.addInstanceId,
      modelCode: (state) => state.backend.modelCode,
      addSecend: (state) => state.backend.addSecend,
      addThird: (state) => state.backend.addThird,
    }),
  },
  watch: {},
  created() {},
  mounted() {
    this.init();
    _this = this;
  },
  methods: {
    init() {
      if (this.addSecend) {
        // 更新
        queryByInstanceId({ instanceId: this.addInstanceId }).then((res) => {
          let data = res.data;
          data.forEach((item) => {
            let formData = {};
            formData.instanceId = this.addInstanceId;
            formData.paramCode = item.param_code;
            formData.paramVal = item.param_val;
            formData.isShow = item.is_show;
            formData.changeable = item.changeable;
            formData.refExp = item.ref_exp;
            formData.param_type = item.param_type;
            formData.remark = item.remark;
            formData.showOrder = item.show_order;
            item.formData = formData;
          });
          this.paramList = data;
        });
      } else {
        // 新增
        // 查询对应的模型参数列表
        selectModelParamDicList({
          modelCode: this.modelCode,
          step: "base",
        }).then((res) => {
          let data = res.data;
          console.log(data);
          data.forEach((item) => {
            let formData = {};
            formData.instanceId = this.addInstanceId;
            formData.paramCode = item.param_code;
            formData.paramVal = "";
            formData.isShow = 1;
            formData.showOrder = 1;
            formData.changeable = 0;
            formData.param_type = item.param_type;
            formData.remark = item.remark;
            formData.refExp = "";
            item.formData = formData;
          });
          this.paramList = data;
        });
      }
    },
    submitForm() {
      // TODO 提交表单
      let elFormArray = this.$refs["elForm"];
      let arry = [];
      let flag = false;
      for (let index = 0; index < elFormArray.length; index++) {
        const element = elFormArray[index];
        element.$children[0].validate((valid) => {
          if (!valid) {
            flag = true;
            return;
          }
        });
      }
      if (flag == true) {
        return false;
      }
      this.paramList.forEach((item) => {
        arry.push(item.formData);
      });
      
      this.num = 0;
      arry.forEach((ele) => {
        if (!ele.showOrder) {
          this.num++;
        }
      });
      if (this.num > 0) { 
        return this.$message.error("排序不能为空");
      } else {
        if (this.addSecend) {
          this.loading = true;
          // 更新
          update(arry)
            .then((res) => {
              let code = res.code;
              this.loading = false;
              if (code == 0) {
                this.$alert("进入详细设置", "更新成功", {
                  confirmButtonText: "确定",
                  type: "success",
                  showClose: false,
                  callback(action) {
                    _this.$store.commit("backend/CHANGE_SHOW", "ThirdStep");
                  },
                });
              }
            })
            .catch((e) => {
              this.loading = false;
              console.log(e);
            });
        } else {
          // 增加
          Promise.all([validateConstParamCode(arry), batchSave(arry)])
            .then((resArray) => {
              this.loading = false;
              let c0 = resArray[0].code;
              let c1 = resArray[1].code;
              if (c0 == 0 && c1 == 0) {
                this.$alert("进入详细设置", "新增成功", {
                  confirmButtonText: "确定",
                  type: "success",
                  showClose: false,
                  callback(action) {
                    _this.$store.commit("backend/CHANGE_SHOW", "ThirdStep");
                  },
                });
                this.$store.commit("backend/CHANGE_ADDSECEND", true);
              }
            })
            .catch((e) => {
              this.loading = false;
              console.log(e);
            });
        }
      }
    },
    resetForm() {
      let elFormArray = this.$refs["elForm"];
      for (let index = 0; index < elFormArray.length; index++) {
        const element = elFormArray[index];
        element.resetForm();
      }
    },
    goback() {
      this.$store.commit("backend/CHANGE_SHOW", "FirstStep");
    },
  },
};
</script>
<style lang="scss" scope>
.secendStep-wrap {
  .secendStep-tool-wrap {
    text-align: right;
    position: fixed;
    bottom: 20px;
    right: 0;
  }
}
</style>
