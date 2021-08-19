<template>
  <div class="login-container">
    <div class="login-top">
      <div class="login-head">
        <img class="login-head-logo" src="../../assets/images/logo.png" alt />
      </div>
      <div class="login-body">
        <div class="login-body-content">
          <div class="login-body-img">
            <img class="login-body-gif" src="/images/logo.gif" alt />
          </div>
          <!-- 登录框表单 -->
          <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="login-body-content-form"
            auto-complete="on"
            label-position="left"
          >
            <div class="title">
              <span class="title-lg">登录</span>
              <span class="title-sm">/SIGN UP</span>
            </div>
            <div class="div-input-container">
              <el-form-item class="input-box" prop="loginName">
                <el-input
                  class="input"
                  ref="username"
                  v-model="loginForm.loginName"
                  placeholder="账号"
                  name="username"
                  type="text"
                  tabindex="1"
                  auto-complete="on"
                />
              </el-form-item>

              <el-form-item class="input-box" prop="pwd">
                <el-input
                  class="input"
                  :key="passwordType"
                  ref="password"
                  v-model="loginForm.pwd"
                  :type="passwordType"
                  placeholder="密码"
                  name="password"
                  tabindex="2"
                  auto-complete="on"
                  @keyup.enter.native="handleLogin"
                />
              </el-form-item>
              <!-- <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>-->
            </div>
            <div class="signin">
              <el-button
                :loading="loading"
                type="primary"
                class="btn"
                @click.native.prevent="handleLogin"
                >登录</el-button
              >
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <!-- 页脚 -->
    <div class="login-bottom">
      &reg; 重庆远达烟气治理特许经营有限公司 丨 重庆智慧思特大数据有限公司
    </div>
    <!-- 单点登录加载项 -->
    <div class="show-login" v-if="showLogin">
      <span>正在跳转中，请稍后。。。。。。。</span>
    </div>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import { encode, decode } from "js-base64";
import {Base64} from 'js-base64'
export default {
  name: "Login",
  data() {
    // 验证密码格式
    const validatePassword = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error("密码不能为空"));
      } else {
        callback();
      }
    };
    // 验证账号非空
    const validateUserName = (rule, value, callback) => {
      if (!value) {
        callback(new Error("账号不能为空"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        loginName: "",
        pwd: "",
      },
      loginRules: {
        loginName: [
          { required: true, trigger: "blur", validator: validateUserName },
        ],
        pwd: [{ required: true, trigger: "blur", validator: validatePassword }],
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
      // 单点登录
      showLogin: false,
      loginString: "",
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  mounted() {
    try {
      this.loginString = this.getQueryString("name");
      if (this.loginString) { 
        this.loginString = Base64.decode(this.loginString);
        this.showLogin = true;
        this.loginForm.loginName = this.loginString.split(",")[0];
        this.loginForm.pwd = this.loginString.split(",")[1];
        this.handleLogin();
      } else {
        this.showLogin = false;
      }
    } catch (error) {
      console.log(error);
      this.showLogin = false;
      this.$message.error("登录名和账号有误")
    }
  },
  methods: {
    // 显示密码
    // showPwd() {
    //   if (this.passwordType === "password") {
    //     this.passwordType = "";
    //   } else {
    //     this.passwordType = "password";
    //   }
    //   this.$nextTick(() => {
    //     this.$refs.password.focus();
    //   });
    // },
    //登录
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" });
              this.loading = false;
              this.showLogin = false;
              // 根据角色获取角色菜单json
            })
            .catch((e) => {
              this.loading = false;
              this.$message.error("账号或密码错误！");
              this.showLogin = false;
            });
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },
    getQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.hash.split("?")[1].match(reg); 
      if (r != null) return unescape(r[2]);
      return null;
    },
  },
};
</script>

<style lang="scss">
.login-container {
  width: 100%;
  height: 100%;
  text-align: center;
  background: url("/images/background.png") no-repeat center;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  .login-top {
    .login-head {
      margin-bottom: 0.5rem;
      .login-head-logo {
        width: 3.36rem;
        height: 0.76rem;
      }
    }
    .login-body {
      display: flex;
      position: relative;
      .login-body-content {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        width: 8.92rem;
        // height: 8.92rem;
        background: url("../../assets/images/outsideCircle.png") no-repeat
          center;
        background-size: 100%;
        // margin-left: -0.5rem;
        position: relative;
        left: -1.2rem;
        margin: 0 auto;
        .login-body-img {
          // width: 3.87rem;
          // height: 3.9rem;
          position: relative;
          left: 2.2rem;
          margin: 0 auto;
          .login-body-gif {
            width: 3.87rem;
            height: 3.9rem;
          }
        }
        .login-body-content-form {
          width: 4.3rem;
          height: 4.17rem;
          background-image: url("../../assets/images/loginForm.png");
          background-size: 100%;
          position: relative;
          left: 2.2rem;
          .title {
            text-align: left;
            padding: 0 0 0 0.46rem;
            color: #00fdf4;
            .title-lg {
              font-size: 0.32rem;
            }
            .title-sm {
              font-size: 0.16rem;
            }
          }
          .div-input-container {
            height: 2rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 0 0.5rem 0 0.5rem;
            .input-box {
              width: 3.3rem;
              display: flex;
              align-items: center;
              // .input {
              //   color: white;
              //   //
              //   width: 100%;
              //
              //   padding: 0 0.2rem;
              //   background: rgba(5, 24, 33, 0.83);
              //   border: 0.01rem solid rgba(0, 240, 232, 1);
              //   border-radius: 0.11rem;
              //   font-size: 0.16rem;
              // }
              .el-input__inner {
                // display: none;
                width: 3.3rem;
                background: transparent;
                border: 0.01rem solid rgba(0, 240, 232, 1);
                border-radius: 0.11rem;
                font-size: 0.16rem;
                height: 0.44rem;
                color: #ffffff;
              }
            }
            .div-input-box:first-child {
              margin-bottom: 0.3rem;
            }
          }
          .signin {
            padding: 0 0.5rem;
            .btn {
              display: block;
              width: 100%;
              height: 0.44rem;
              background: rgba(0, 253, 244, 1);
              border: 0.01rem solid rgba(0, 240, 232, 1);
              border-radius: 0.11rem;
              font-size: 0.2rem;
              // font-family: PingFang SC;
              // font-weight: 500;
              color: rgba(6, 43, 60, 1);
              line-height: 0.01rem;
            }
          }
        }
      }
    }
  }
  .login-bottom {
    font-size: 0.2rem;
    color: rgba(0, 253, 244, 0.6);
    margin-bottom: 0.2rem;
  }
}
//处理高度坍塌
.login-container:before {
  display: table;
  content: "";
  clear: both;
}
.show-login {
  position: fixed;
  color: #fff;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #3e3c3c;
  text-align: center;
  line-height: 100vh;
  z-index: 200001;
  font-size: 0.24rem;
}
</style>
