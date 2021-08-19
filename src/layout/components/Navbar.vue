<template>
  <div class="navbar clearfix">
    <div class="logo fl">
      <img class="logo-img" src="@/assets/images/logo.gif" alt="logo" />
    </div>
    <div class="menu fl clearfix" v-if="showMenu">
      <Menu
        v-for="item in menuData"
        :key="item.mname"
        :text="item.mname"
        :list="item.children"
        :path="item.path"
      />
    </div>
    <div v-else class="menu fl clearfix">
      <div class="houtai">
        <span> 后台管理 </span>
      </div>
    </div>
    <div class="tool fr">
      <el-select
        style="width: 1rem"
        v-model="selPlantCode"
        placeholder="请选择"
        @change="changePlant"
        size="mini"
        v-show="showPlants"
      >
        <el-option
          v-for="item in plants"
          :key="item.deptCode"
          :label="item.deptName"
          :value="item.deptCode"
        ></el-option>
      </el-select>
      <div class="timeOclock">
        <div class="left">
          {{ time.split(":")[0] }}<span style="margin: 0 0.06rem">:</span
          >{{ time.split(":")[1] }}<span style="margin: 0 0.06rem">:</span
          >{{ time.split(":")[2] }}
        </div>
        <div class="right">
          {{ day }}
        </div>
      </div>
      <div class="person" @click="onPerson">
        <svg-icon icon-class="person" class-name="custom-class" />
        <span style="font-size: 0.14rem; margin-right: 0.2rem"
          >{{ name }}，您好！</span
        >
      </div>
      <span v-if="showMenu" title="后台管理" class-name="custom-mail">
        <svg-icon icon-class="houtai" @click="toManager" style="cursor: pointer;"/>
      </span>
      <span title="主页" v-else class-name="custom-mail">
        <svg-icon icon-class="goback" @click="goBack" style="cursor: pointer;"/>
      </span>
      <span title="帮助" class-name="custom-mail">
        <svg-icon icon-class="help" @click="onHelp" style="cursor: pointer;"/>
      </span>
      <span title="退出系统" class-name="custom-mail">
        <svg-icon icon-class="exit" @click="logout" style="cursor: pointer;"/>
      </span>
      <!-- <div class="sys">
        <svg-icon icon-class="sys" @click="logout" class-name="custom-sys" />
      </div> -->
    </div>
    <!-- 软件帮助 弹窗 -->
    <el-dialog
      title
      :visible.sync="dialogTableVisible"
      :show-close="false"
      width="40%"
    >
      <div class="content">
        <div class="header">
          <img class="logo" src="../../assets/zhst.png" alt />
          <img class="exit" @click="onExit" src="../../assets/qute.png" alt />
        </div>
        <h1 class="title">火电环保智能助手</h1>
        <div class="text">
          <div>
            版本信息：火电环保智能系统Ver{{ version }}({{ versionTime }})
          </div>
          <div>
            官网：
            <a href="http://www.cqwisest.com" target="_blank"
              >http://www.cqwisest.com</a
            >
          </div>
        </div>
        <div class="footer">
          <el-button type="primary" size="small">使用说明书下载</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Menu from "./AppMenu/index";
import { menu } from "@/global/index";
import { mapState } from "vuex";
import { version, versionTime } from "../../version.js";
import moment from "moment";
export default {
  components: { Menu },
  computed: {
    ...mapState({
      name: (state) => state.user.name,
      plantCn: (state) => state.user.plantCn,
      plantCode: (state) => state.user.plantCode,
      uid: (state) => state.user.uid,
      menu: (state) => state.user.menu,
      plants: (state) => state.user.plants,
      showPlants: (state) => state.user.showPlants,
    }),
  },
  data() {
    return {
      showMenu: true,
      version,
      versionTime,
      selPlantCode: "",
      menuData: [], // 功能菜单
      sysMenuData: [], // 后台管理菜单
      dialogTableVisible: false, // 软件帮助弹窗
      time: "",
      day: "",
    };
  },
  mounted() {
    if (this.$route.path.indexOf("sys") > -1) {
      this.showMenu = false;
      this.$store.commit("user/SET_SHOWPLANTS", false);
    } else {
      this.showMenu = true;
      this.$store.commit("user/SET_SHOWPLANTS", true);
    }
    // 分解菜单
    this.getMenu();
    this.selPlantCode = this.plantCode;
    this.getTime();
    this.timer = setInterval(() => {
      this.getTime();
    }, 1000);
  },
  methods: {
    getTime() {
      let day = moment().format("YYYY-MM-DD");
      this.time = moment().format("HH:mm:ss");
      this.day = day;
    },
    toManager() {
      this.showMenu = false;
      this.$store.commit("user/SET_SHOWPLANTS", false);
      this.$router.push({
        path: this.sysMenuData.children[0].children[0].path,
      });
      this.$store.commit(
        "app/SET_ACTIVESYSETTING",
        this.sysMenuData.children[0].children[0].mname
      );
    },
    goBack() {
      this.showMenu = true;
      this.$store.commit("user/SET_SHOWPLANTS", true);
      this.$router.push({
        path: "/",
      });
    },
    changePlant(value) {
      this.$store.commit("user/SET_PLANTCODE", value);
      this.plants.forEach((ele) => {
        if (ele.deptCode == value) {
          this.$store.commit("user/SET_PLANTCN", ele.deptName);
        }
      });
      // this.$router.replace({path:'/refresh'});
    },
    onCheck(ele) {},
    logout() {
      this.$store.dispatch("user/logout", { uid: this.uid }).then((res) => {
        if (res.data && res.msg == "成功") {
          this.$store.commit("app/CHANGE_ACTIVEMENU", "首页");
          this.$store.commit("app/SET_ACTIVEMODEL", "");
          this.$router.push(`/login`);
        }
      });
    },
    // 分离功能菜单和后台菜单
    getMenu() {
      this.menuData = this.menu.filter((item) => {
        return item.mname != "后台";
      });
      let sysMenuData = this.menu.filter((item) => {
        return item.mname == "后台";
      });
      this.sysMenuData = sysMenuData[0];
    },
    onPerson() {
      this.$router.push({ path: "/person/index" });
    },
    onHelp() {
      this.dialogTableVisible = true;
    },
    onAsyn(item) {
      if (item.children && item.children.length) {
        // 有二级菜单
        return false;
      } else {
        // 无二级菜单
        this.$router.push({ path: item.path });
        this.$store.commit("app/SET_ACTIVESYSETTING", item.mname);
      }
    },
    onExit() {
      this.dialogTableVisible = false;
    },
  },
  destroyed() {
    clearInterval(this.timer);
    this.timer = null;
  },
};
</script>

<style lang="scss" scoped>
.houtai {
  width: 1.16rem;
  height: 0.72rem;
  line-height: 0.72rem;
  position: relative;
  font-weight: bold;
  color: rgba(168, 205, 212, 1);
  text-align: center;
  cursor: pointer;
  transition: 0.2s;
  background: linear-gradient(
    180deg,
    rgba(105, 255, 249, 0.15) 0%,
    rgba(162, 255, 253, 0) 100%
  );
  border-top: 0.02rem solid rgba(105, 255, 249, 1);
}
.navbar {
  height: 0.72rem;
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  font-size: 0.2rem;
  color: rgba(168, 205, 212, 1);
  padding-left: 0.14rem;
  .logo {
    height: 100%;
    width: 2.4rem;
    display: flex;
    align-items: center;
    img {
      height: 0.5rem;
    }
  }
  .Menu {
    float: left;
  }
  .tool {
    display: flex;
    height: 0.72rem;
    align-items: center;
    & > span {
      margin-right: 0.28rem;
      font-size: 0.24rem;
      font-weight: 500;
      color: rgba(171, 208, 215, 1);
    }
    .jj {
      display: inline-block;
      width: 0.02rem;
      height: 0.2rem;
      background: rgba(255, 255, 255, 0.2);
    }
    .custom-mail {
      display: inline-block;
      width: 0.25rem;
      height: 0.2rem;
      margin-right: 0.2rem;
      cursor: pointer; 
    }
    .person {
      display: flex;
      height: 100%;
      align-items: center;
      font-size: 0.18rem;
      color: rgba(171, 208, 214, 0.5);
      position: relative;
      cursor: pointer;
      .custom-class {
        width: 0.24rem;
        height: 0.22rem;
        margin-right: 0.06rem;
      }
      ul,
      li {
        margin: 0;
        padding: 0;
        list-style: none;
      }
      &:hover .down-menu {
        display: block;
      }
      .down-menu {
        display: none;
        // width: 1.32rem;
        // height: 2.1rem;
        // min-height: 2.1rem;
        padding: 0.1rem;
        padding-bottom: 0;
        position: fixed;
        // left: 0.25rem;
        right: 0.15rem;
        top: 0.72rem;
        background: rgba(16, 32, 66, 0.9);
        z-index: 20000;
        & > li {
          position: relative;
        }
        .hov {
          .down-menu-child {
            display: none;
            padding: 0.1rem;
            padding-bottom: 0;
            position: absolute;
            left: -1.4rem;
            top: -0.1rem;
            background: rgba(16, 32, 66, 0.9);
            z-index: 2000;
            &:hover {
              display: block;
            }
          }
        }
        .hov:hover .down-menu-child {
          display: block;
        }
        &:hover {
          display: block;
        }
        li {
          min-width: 1rem;
          text-align: center;
          font-size: 0.18rem;
          font-weight: 500;
          color: rgba(168, 205, 212, 1);
          margin-bottom: 0.2rem;
          &:hover {
            color: #69fff9;
          }
        }
      }
    }
    .sys {
      width: 0.72rem;
      height: 0.72rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.07);
      .custom-sys {
        width: 0.32rem;
        height: 0.22rem;
        cursor: pointer;
      }
    }
  }
  .timeOclock {
    display: flex;
    padding: 0 0.1rem;
    align-items: center;
    justify-content: space-between;
    .left {
      // width: 3.65rem;
      font-size: 0.16rem;
      // font-weight: 800;
      color: rgba(44, 255, 155, 1);
      margin-right: 0.2rem;
    }
    .right {
      font-size: 0.16rem;
      // font-weight: 500;
      color: rgba(128, 158, 172, 1);
    }
  }
  .content {
    color: rgba(0, 0, 0, 0.8);
    border-radius: 0.1rem;
    background: linear-gradient(0deg, #dce9ff, #6d9ff1);
    .header {
      display: flex;
      justify-content: space-between;
      padding: 0.2rem;
      .logo {
        width: 1.8rem;
        height: 100%;
      }
      .exit {
        width: 0.3rem;
        height: 0.3rem;
        cursor: pointer;
        opacity: 0.5;
      }
    }
    .title {
      font-size: 0.32rem;
      text-align: center;
      margin-bottom: 0.5rem;
    }
    .text {
      font-size: 0.2rem;
      text-align: center;
    }
    .footer {
      text-align: right;
      padding: 0.3rem;
    }
  }
}
</style>
