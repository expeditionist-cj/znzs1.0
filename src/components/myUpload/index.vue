<template>
<div class="myUpload-wrap">
  <el-dialog
    :before-close="beforeClose"
    
    title="导入excel"
    :visible.sync="importExcelDialogVisible"
    width="600px!important"
  >
    <!-- <div style="width:50%;margin-bottom:20px">
      <el-date-picker
        v-model.number="importExcelTime"
        align="right"
        type="month"
        placeholder="选择上传日期"
        size="small"
        :clearable="false"
        :editable="false"
        :picker-options="importExcelDataPickerOptions"
      ></el-date-picker>
    </div> -->
    <el-upload
      class="upload-demo"
      ref="upload"
      :limit="limit"
      action="https://jsonplaceholder.typicode.com/posts/"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :auto-upload="false"
    >
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <div slot="tip" class="el-upload__tip">
        Excel文件，且不超过500kb
      </div>
    </el-upload>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="small" @click="onCloseDialog">取 消</el-button>
      <el-button
        size="small"
        type="primary"
        :loading="submitLoading"
        @click="submitUpload"
        >上传文件</el-button
      >
    </span>
  </el-dialog>
</div>
</template>

<script>
import moment from "moment";
export default {
  props: {
    tip: "请上传Excel文件",
    limit: 1,
    submitLoading: false,
    importExcelDialogVisible: true
  },
  data() {
    return {
      importExcelTime: Date.now(),
      importExcelDataPickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      formData: new FormData()
    };
  },
  components: {},
  computed: {},
  created() {},
  mounted() {
  },
  watch: {
  },
  methods: {
    // 删除文件
    handleRemove(file) {
      this.$emit("handleRemove", file);
    },
    // 文件改变时触发
    changeFile(file) {
      this.formData.delete("file");
      this.formData.append("file", file.raw);
    },
    // 上传文件
    submitUpload() {
      if (!this.$refs.upload.uploadFiles.length) {
        this.$message.info("请选择要上传的文件");
        return false;
      }
      this.$emit("submitUpload", this.formData);
    },
    beforeClose(done) {
      this.$emit("changeImportExcelDialogVisible", false);
    },
    onCloseDialog() {
      this.$emit("changeImportExcelDialogVisible", false);
    },
    // 清空已上传文件
    clearFils(){
       this.$refs.upload.clearFiles()
    }
  }
};
</script>

<style lang="scss">
.myUpload-wrap {
  .el-dialog, .el-pager li{
    background-color: #263553!important;
  }
  .el-dialog__title{
    color: rgba(255,255,255,0.9);
  }
  .el-upload__tip{
    color: rgba(255,255,255,0.9);
  }
  .el-upload-list__item-name{
    color: rgba(255,255,255,0.9);
  }
  .el-upload-list__item:hover{
    background-color: rgba(255,255,255,0.4);
  }
}
</style>
