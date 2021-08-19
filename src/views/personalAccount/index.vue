<template>
  <div class="personalAccount clearfix">
    <div class="left fl">
      <MyCrom
        :initAvatar="avatar"
        @cropSuccess="cropSuccess"
        v-if="cromShow"
      ></MyCrom>
    </div>
    <div class="right fl">
      <el-form
        ref="elForm"
        :model="formData"
        :rules="rules"
        size="medium"
        label-width="100px"
      >
        <el-col :span="23">
          <el-form-item label-width="120px" label="人员姓名" prop="userName">
            <el-input
              v-model="formData.userName"
              placeholder="请输入人员姓名"
              clearable
              readonly
              :style="{ width: '100%' }"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="23">
          <el-form-item label-width="120px" label="人员编号" prop="userCode">
            <el-input
              v-model="formData.userCode"
              placeholder="请输入人员编号"
              clearable
              readonly
              :style="{ width: '100%' }"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="23">
          <el-form-item label-width="120px" label="所属单位" prop="comId">
            <el-cascader
              v-model="formData.comId"
              placeholder="请选择所属公司"
              clearable
              disabled
              :style="{ width: '100%' }"
              :options="comIdOptions"
              :props="comIdProps"
              filterable
            >
            </el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="23">
          <el-form-item label-width="120px" label="所属部门" prop="deptId">
            <el-cascader
              v-model="formData.deptId"
              placeholder="请选择所属部门"
              clearable
              disabled
              :style="{ width: '100%' }"
              :options="deptIdOptions"
              :props="deptIdProps"
              filterable
            >
            </el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="23">
          <el-form-item label-width="120px" label="岗位（角色）" prop="roleId">
            <el-select
              v-model="formData.roleId"
              placeholder="请选择岗位（角色）"
              clearable
              disabled
              :style="{ width: '100%' }"
            >
              <el-option
                v-for="(item, index) in roleIdOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="23">
          <el-form-item label-width="120px" label="原密码" prop="oldPwd">
            <el-input
              v-model="formData.oldPwd"
              placeholder="请输入原密码"
              clearable
              show-password
              :style="{ width: '100%' }"
            >
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="23">
          <el-form-item label-width="120px" label="新密码" prop="newPwd">
            <el-input
              v-model="formData.newPwd"
              placeholder="请输入新密码"
              clearable
              show-password
              :style="{ width: '100%' }"
            >
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="23">
          <el-form-item
            label-width="120px"
            label="再次输入新密码"
            prop="newPwdAgin"
          >
            <el-input
              v-model="formData.newPwdAgin"
              placeholder="请输入新密码"
              clearable
              show-password
              :style="{ width: '100%' }"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item size="large">
            <el-button size="small" type="primary" @click="submitForm"
              >修改密码</el-button
            >
          </el-form-item>
        </el-col>
      </el-form>
    </div>
  </div>
</template>

<script>
import MyCrom from "@/components/MyCrom";
import {
  getTree,
  getProject,
  getRole,
  getUserData,
  uploadImg,
  updateUserPass
} from "@/api/account";
import { mapState } from "vuex";
export default {
  props: {},
  data() {
    return {
      avatar: "",
      cromShow: false,
      formData: {
        userName: undefined,
        userCode: undefined,
        comId: undefined,
        deptId: undefined,
        roleId: undefined,
        oldPwd: undefined,
        newPwd: undefined,
        newPwdAgin: undefined
      },

      rules: {
        userName: [
          {
            required: true,
            message: "请输入人员姓名",
            trigger: "blur"
          }
        ],
        userCode: [
          {
            required: true,
            message: "请输入人员编号",
            trigger: "blur"
          }
        ],
        comId: [
          {
            required: true,
            message: "请选择所属单位",
            trigger: "change"
          }
        ],
        deptId: [
          {
            required: true,
            message: "请选择所属部门",
            trigger: "change"
          }
        ],
        roleId: [
          {
            required: true,
            message: "请选择岗位（角色）",
            trigger: "change"
          }
        ],
        oldPwd: [
          {
            required: true,
            message: "原密码不能为空",
            trigger: "blur"
          }
        ],
        newPwd: [
          {
            required: true,
            message: "新密码不能为空",
            trigger: "blur"
          }
        ],
        newPwdAgin: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          }
        ]
      },
      comIdOptions: [],
      deptIdOptions: [],
      roleIdOptions: [],
      comIdProps: {
        multiple: false,
        label: "name",
        value: "deptId",
        children: "children",
        expandTrigger: "hover",
        checkStrictly: true
      },
      deptIdProps: {
        multiple: false,
        label: "name",
        value: "deptId",
        children: "children",
        expandTrigger: "hover",
        checkStrictly: true
      }
    };
  },
  components: { MyCrom },
  computed: {
    ...mapState({
      userId: state => state.user.uid,
      uid: state => state.user.uid
    })
  },
  created() {},
  mounted() {
    this.init();
  },
  watch: {
    "formData.comId"(val) {
      getProject({
        parentId: Array.isArray(val) ? val[val.length - 1] : val
      }).then(res => {
        let data = res.data;
        this.deptIdOptions = data;
      });
    }
  },
  methods: {
    init() {
      getTree().then(res => {
        let data = res.data;
        this.comIdOptions = [data];
      });
      getRole().then(res => {
        let data = res.data;
        data.forEach(item => {
          item.value = item.roleId;
          item.label = item.roleName;
        });
        this.roleIdOptions = data;
      });
      // 查询用户基本信息
      getUserData({ userId: this.userId, current: 1, size: 10 }).then(res => {
        let data = res.data;
        let { records } = data;
        records = records[0];
        this.formData.userName = records.userName;
        this.formData.userCode = records.userCode;
        this.formData.deptId = records.deptId;
        this.formData.roleId = records.roleId;
        this.formData.comId = records.fDeptId;
        this.avatar = records.avatar;
        this.cromShow = true;
      });
    },
    cropSuccess(formData, file) {
      let size = file.size / 1024;
      if (size >= 2048) {
        return this.$message.error("图片大小不能大于2M");
      }
      uploadImg(formData)
        .then(res => {
          let data = res.data;
          if (data.fileDownloadUri) {
            // 保存上传图片地址
            this.personUrl = data.fileDownloadUri;
            this.$message.success("成功上传头像");
          } else {
            this.$message.error("上传头像失败");
          }
        })
        .catch(e => {});
    },
    submitForm() {
      this.$refs["elForm"].validate(valid => {
        if (!valid) return;
        if (this.formData.newPwd != this.formData.newPwdAgin) {
          return this.$message.error("新密码两次输入不一致");
        }
        // TODO 提交表单
        updateUserPass({
          userId: this.userId,
          password: this.formData.oldPwd,
          newPassword: this.formData.newPwd,
          avatar: this.personUrl
        }).then(res => {
          let data = res.data;
          if (res.code == 0 && res.msg == "成功" && !res.data) {
            this.$message.success("密码修改成功");
            // 密码修改成功之后，退出到登录页面
            this.$store.dispatch("user/logout", { uid: this.uid }).then(res => {
              if (res.data && res.msg == "成功") {
                this.$store.commit("app/CHANGE_ACTIVEMENU", "首页");
                this.$store.commit("app/SET_ACTIVEMODEL", "");
                this.$router.push(`/login`);
              }
            });
          } else {
            this.$message.error(res.data);
          }
        });
      });
    },
    resetForm() {
      this.$refs["elForm"].resetFields();
    }
  }
};
</script>

<style scoped lang="scss">
.personalAccount {
  height: 100%;
  padding: 0.4rem;
  .left {
    width: 40%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .right {
    width: 60%;
    height: 100%;
  }
}
</style>
<style lang="scss">
.personalAccount {
  .MyCrom {
    .img-box {
      width: 4rem !important;
      height: 4rem !important;
    }
    .btn-box {
      margin-top: 0;
      button {
        position: relative;
        top: -0.4rem;
      }
    }
  }
}
</style>
