<template>
  <div class="AppMenu Menu" :class="{ on: text == activeMenu }">
    <div @click="resolvePath1(path)">{{ text }}</div>
    <ul class="secend" ref="secend" v-if="list.length">
      <li
        class="clearfix"
        :class="{ noModelList: text != '智能模型' }"
        v-for="(item, index) in list"
        :key="index"
      >
        <!-- 渲染智能模型的二级菜单 -->
        <div v-if="text == '智能模型'">
          <div class="title" @click="resolvePath2(item)">
            <span class="title-content">{{ item.mname }}</span>
            <span class="line"></span>
          </div>
          <div class="content clearfix">
            <div
              class="fl"
              v-for="(ele, idx) in item.children"
              :key="idx"
              @click="resolvePath3(ele)"
              :style="{
                color: ele.online == 1 ? '#69FFF9' : 'rgb(176, 213, 220,0.4)',
              }"
            >
              <svg-icon :icon-class="ele.icon" class-name="custom-class" />
              {{ ele.mname }}
            </div>
          </div>
        </div>

        <!-- 渲染其它的二级菜单 -->
        <div
          v-else
          class="other-secend-conent"
          :style="{
            color: item.online == 1 ? '#69FFF9' : 'rgb(176, 213, 220,0.4)',
          }"
          @click="resolvePath2(item)"
        >
          <span class="bar"></span> {{ item.mname }}
        </div>
      </li>
    </ul>

    <el-drawer
      :title="title"
      :visible.sync="showDrawer"
      size="65%"
      :modal="true" 
      :before-close="handleClose"
    > 
      <div class="drawer-content">
        <component v-bind:is="which_to_show"></component>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Unit from "@/views/tools/unitConvert";
import Volume from "@/views/tools/volume";
import Consume from "@/views/tools/consume";
export default {
  props: {
    text: {
      type: String,
      default: "首页",
    },
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
    path: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      showSecend: false,
      title: "小工具",  
    };
  },
  components: { Unit, Volume, Consume },
  computed: {
    ...mapState({
      activeMenu: (state) => state.app.activeMenu,
      showDrawer: (state) => state.dashboard.showDrawer, 
      which_to_show: (state) => state.dashboard.which_to_show, 
    }),
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    onSelect(data) {
      this.$store.commit("app/CHANGE_ACTIVEMENU", this.text);
    },
    resolvePath1(path) {
      if (!this.list.length) {
        this.$router.push({ path: this.path });
        this.onSelect();
      }
    },
    resolvePath2(item) {
      let showWay = item.refCode;

      if (showWay === "popup") {
        let name = item.mname;
        let component = item.component;
        this.title = name;
        this.$store.commit('dashboard/SET_SHOWDRAWER',true);
        this.$store.commit('dashboard/SET_WHICHTOSHOW',component); 
        return false;
      }
      if (item.children && item.children.length) {
        return false;
      } else {
        this.$router.push({ path: item.path });
        this.onSelect();
      }
    },
    resolvePath3(item) {
      this.$router.push({ path: item.path });
      this.onSelect();
      this.$store.commit("app/SET_ACTIVEMODEL", item.refCode);
    },
    handleClose(done) {
      this.$store.commit('dashboard/SET_SHOWDRAWER',false);
      // this.$confirm("确认关闭？")
      //   .then((_) => {
      //     done();
      //   })
      //   .catch((_) => {});
    },
  },
};
</script>

<style scoped lang="scss">
.AppMenu {
  width: 1.16rem;
  height: 0.72rem;
  line-height: 0.72rem;
  position: relative;
  font-weight: bold;
  color: rgba(168, 205, 212, 1);
  text-align: center;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background: linear-gradient(
      180deg,
      rgba(105, 255, 249, 0.15) 0%,
      rgba(162, 255, 253, 0) 100%
    );
    transition: 0.2s;
    border-top: 0.02rem solid rgba(105, 255, 249, 1);
  }
  ul,
  li {
    background: rgba(16, 32, 66, 0.9);
    list-style: none;
    cursor: pointer;
    padding: 0;
    margin: 0;
    text-align: left;
  }
  & > div:hover ~ .secend {
    display: block;
    transition: 0.6s;
    overflow: auto;
  }
  .secend {
    width: 5.84rem;
    display: none;
    position: absolute;
    top: 0.7rem;
    z-index: 2020;
    color: #69fff9;
    font-size: 0.18rem;
    padding: 0.2rem 0.3rem;
    &:hover {
      display: block;
    }
    .noModelList {
      float: left;
      width: 50%;
    }
    .title {
      height: 0.4rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 800;
      color: rgba(176, 213, 220, 1);
      .title-content {
        width: 1rem;
        display: inline-block;
        text-align: left;
      }
      .line {
        display: inline-block;
        width: calc(100% - 1rem);
        height: 1px;
        background: rgba(241, 241, 241, 0.4);
        opacity: 0.25;
      }
    }
    .content {
      padding-left: 1rem;
      min-height: 0.4rem;
      & > div {
        width: 50%;
        height: 0.4rem;
        display: flex;
        align-items: center;
        color: rgba(176, 213, 220, 0.4);
        .custom-class {
          width: 0.15rem;
          height: 0.14rem;
          margin-right: 0.08rem;
        }
      }
      .online {
        color: "#69FFF9";
      }
    }
    .other-secend-conent {
      display: flex;
      align-items: center;
      color: rgba(176, 213, 220, 0.4);
      .bar {
        display: inline-block;
        width: 0.04rem;
        height: 0.18rem;
        background: rgba(176, 213, 220, 0.4);
        margin-right: 0.14rem;
      }
    }
  }
}
.on {
  background: linear-gradient(
    180deg,
    rgba(105, 255, 249, 0.15) 0%,
    rgba(162, 255, 253, 0) 100%
  );
  border-top: 0.02rem solid rgba(105, 255, 249, 1);
  transition: 0.2s;
}
</style>
<style >
.el-drawer.rtl {
  overflow: auto;
}
.el-drawer.rtl::-webkit-scrollbar {
  display: none;
}
</style>
