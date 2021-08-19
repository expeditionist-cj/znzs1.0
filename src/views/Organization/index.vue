<template>
  <div class="organization">
    <div class="organization-left">
      <div class="div-btns">
        <button class="btn" @click="add">添加</button>
        <button class="btn" @click="onEdit">编辑</button>
        <button class="btn delete" @click="deletes">删除</button>
      </div>
      <div class="treeBar">
        <my-tree-nav-bar :treeData="treeData" @clickTree="clickTree"></my-tree-nav-bar>
      </div>
    </div>
    <div class="organization-line"></div>
    <div class="organization-right">
      <div class="title">{{title}}</div>
      <div class="content">
        <div class="upload-photo">
          <my-crom
            @cropSuccess="cropSuccess"
            :initAvatar="imgUrl"
            :imgStyle="imgStyle"
            :btnClass="btnClass"
            :showUploadBtn="showUploadBtn"
          ></my-crom>
        </div>
        <div class="introduce">
          <div class="list">
            <div class="div-name">
              <span>*</span>上级单位：
            </div>
            <el-input :readonly="readonly" size="small" v-model="deptData.parentName" clearable></el-input>
          </div>
          <div class="list">
            <div class="div-name">
              <span>*</span>部门名称：
            </div>
            <el-input :readonly="readonly" size="small" v-model="deptData.name" clearable></el-input>
          </div>
          <div class="list">
            <div class="div-name">
              <span>*</span>部门编码：
            </div>
            <el-input :readonly="readonly" size="small" v-model="deptData.deptCode" clearable></el-input>
          </div>
          <div class="list">
            <div class="div-name">
              <span>*</span>排序：
            </div>
            <el-input :readonly="readonly" size="small" v-model="deptData.sort" clearable></el-input>
          </div>
          <div class="list start">
            <div class="div-name">
              <span>*</span>部门简介：
            </div>
            <el-input
              :readonly="readonly"
              type="textarea"
              :autosize="{ minRows: 10, maxRows: 10}"
              size="small"
              v-model="deptData.remark"
            ></el-input>
          </div>
          <div class="btn-footer">
            <button class="btn" @click="onOk">确定</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import myTreeNavBar from "@/components/myTreeNavBar/index.vue";
import MyCrom from "@/components/MyCrom/index.vue";
import { service } from "@/utils/request.js";
import {
  uploadPhoto,
  getTree,
  addTree,
  deleteTree,
  updateTree,
} from "@/api/organization.js";
import { compare } from "@/js/organization.js";
export default {
  name: "organization",
  data() {
    return {
      title: "查看机构",
      readonly: true,
      deptData: {},
      submitLoading: false,
      btnClass: "text-align: right",
      imgStyle: "width:4.8rem;height:3.6rem;",
      imgUrl: "",
      formData: new FormData(),
      treeData: [],
      currentName: "",
      showUploadBtn: false,
    };
  },
  mounted() {
    this.getTreeData();
  },
  watch: {
    title(value) {
      if (value == "查看机构") {
        this.readonly = true;
        this.showUploadBtn = false;
      } else {
        this.readonly = false;
        this.showUploadBtn = true;
      }
    },
  },
  components: {
    myTreeNavBar,
    MyCrom,
  },
  methods: {
    // 上传图片
    cropSuccess(formData, file) {
      let size = file.size / 1024;
      if (size >= 2048) {
        return this.$message.error("图片大小不能大于2M");
      }
      uploadPhoto(formData).then((res) => {
        let data = res.data;
        if (data.fileDownloadUri) {
          this.imgUrl = data.fileDownloadUri;
        }
      });
    },
    //添加按钮
    add() {
      this.title = "添加机构";
      let { name, children, deptId } = this.deptData;
      let data = {
        children,
        deptId,
        parentId: deptId,
        name: "",
        remark: "",
        deptCode: "",
        sort: children.length + 1,
        parentName: name,
      };
      this.deptData = data;
    },
    //编辑按钮
    onEdit() {
      this.title = "编辑机构";
    },
    //删除
    deletes() {
      if (this.deptData.children.length > 0) {
        return this.$message.error("请先删除子级部门");
      }
      let deptId = this.deptData.deptId;
      deleteTree(deptId).then((res) => {
        if (!!res.data) {
          this.$message.success("删除成功");
        }
        this.getTreeData();
        this.deptData = {};
        this.imgUrl = "";
      });
    },
    // 点击确定
    onOk() {
      if (!this.deptData.deptId) {
        return this.$message.error("请选择要操作的部门");
      }
      //添加机构
      if (this.title == "添加机构") {
        let { name, deptCode, sort, parentId, remark } = this.deptData;
        let query = { name, deptCode, sort, parentId, remark };
        for (var key in query) {
          if (!query[key]) {
            return this.$message.error("带*的为必填项，请补充完整");
          }
        } 
          addTree({ ...query, img: this.imgUrl })
            .then((res) => {
              if (!!res.data) {
                this.$message.success("添加成功");
              } else {
                this.$message.error("添加机构失败");
              }
              this.getTreeData();
            })
            .catch((err) => {
              this.$message.error("添加机构失败");
              console.log(err);
            }); 
      } else if (this.title == "编辑机构") {
        // 编辑机构
        let { name, deptCode, deptId, sort, remark, parentId } = this.deptData;
        let query = {
          name,
          parentId,
          remark,
          deptCode,
          sort,
          deptId,
        };
        updateTree({ ...query, img: this.imgUrl }).then((res) => {
          if (res.code != 0) {
            return this.$message.error("修改失败");
          } else if (!!res.data) {
            this.$message.success("修改成功");
          } else {
            this.$message.error("修改失败");
          }
          this.getTreeData();
        });
      }
    },
    // 获取树形导航内容
    getTreeData() {
      getTree().then((res) => {
        let data = res.data;
        this.treeData = [{ ...data }];
      });
    },
    // 点击树形导航
    clickTree(data) {
      this.title = "查看机构";
      let {
        name,
        remark,
        deptCode,
        sort,
        parentId,
        children,
        deptId,
        img,
      } = data;
      this.currentName = name;
      this.deptData = {
        name,
        remark,
        deptCode,
        sort,
        children,
        deptId,
        parentId,
      };
      this.deptData.parentName = compare(this.treeData[0], data.parentId);
      this.imgUrl = img;
    },
  },
};
</script>
<style lang="scss" >
.organization {
  height: 100%;
  background: url("../../assets/images/border.png") no-repeat center;
  background-size: 100% 100%;
  display: flex;
  padding: 0.3rem 0;
  .organization-left {
    width: 20%;
    padding: 0 0.4rem;
    overflow: hidden;
    .treeBar {
      height: 90%;
      overflow: scroll;
    }
    .treeBar::-webkit-scrollbar {
      display: none;
    }
    .div-btns {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.2rem;
      .btn {
        font-size: 0.14rem;
        color: rgba(36, 50, 81, 1);
        padding: 0.06rem 0.15rem;
        text-align: center;
        border: 0;
        border-radius: 0.05rem;
        cursor: pointer;
        position: relative;
        outline: none;
        background-color: rgba(105, 255, 249, 1);
      }
      .delete {
        background-color: rgba(247, 88, 88, 1);
      }
    }
  }

  .organization-line {
    height: 100%;
    border-width: 0 0.01rem 0 0;
    border-style: solid;
    border-color: rgba(255, 255, 255, 0.4);
  }
  .organization-right {
    .title {
      padding: 0.05rem 0.4rem;
      font-size: 0.2rem;
      color: rgba(105, 255, 249, 1);
    }
    .content {
      display: flex;
      .upload-photo {
        margin: 0.2rem 0.4rem;
        .photo {
          width: 4.82rem;
          height: 3.62rem;
          border: 0.01rem solid rgba(255, 255, 255, 0.4);
          margin-bottom: 0.2rem;
          // overflow: hidden;
          .image {
            width: 4.8rem;
            height: 3.6rem;
          }
        }
        .upload-file {
          text-align: right;
          .btn {
            color: rgba(36, 50, 81, 1);
            padding: 0.08rem 0.15rem;
            text-align: center;
            border: 0;
            border-radius: 0.05rem;
            cursor: pointer;
            position: relative;
            outline: none;
            background-color: rgba(105, 255, 249, 1);
          }
        }
      }
      .introduce {
        width: 6rem;
        display: flex;
        flex-direction: column;
        margin-top: 0.2rem;
        .list {
          display: flex;
          align-items: center;
          text-align: right;
          margin-bottom: 0.2rem;
          color: rgba(176, 213, 220, 1);
          .div-name {
            display: inline-block;
            min-width: 1.5rem;
            span {
              color: #f75858;
            }
          }
        }
        .start {
          align-items: flex-start !important;
        }
        .btn-footer {
          text-align: right;
          .btn {
            color: rgba(36, 50, 81, 1);
            padding: 0.1rem 0.2rem;
            text-align: center;
            border: 0;
            border-radius: 0.05rem;
            cursor: pointer;
            position: relative;
            outline: none;
            background-color: rgba(105, 255, 249, 1);
            margin-right: 0.2rem;
          }
        }
      }
    }
  }
}
</style>