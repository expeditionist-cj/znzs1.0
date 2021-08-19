<template>
  <!-- 单位转换 -->
  <div class="unit-convert">
    <el-radio-group style="width: 100%" v-model="radio">
      <el-radio-button label="gl">功率</el-radio-button>
      <el-radio-button label="mj">面积</el-radio-button>
      <el-radio-button label="cd">长度</el-radio-button>
      <el-radio-button label="ll">流量（工况标态）</el-radio-button>
    </el-radio-group>
    <div class="unit-content">
      <component v-bind:is="which_to_show"></component>
    </div>
  </div>
</template>

<script>
import cd from "./components/cd.vue";
import gl from "./components/gl.vue";
import ll from "./components/ll.vue";
import mj from "./components/mj.vue";
export default {
  data() {
    return {
      radio: "gl",
      which_to_show: "gl",
      activeName: "second",
    };
  },
  watch: {
    radio(value) {
      this.which_to_show = value;
    },
  },
  components: {
    cd,
    gl,
    ll,
    mj,
  },
  methods: {},
};
</script>

<style>
.el-tabs__item {
  color: #ffffff;
}
.el-tabs__item:hover {
  color: #db0f0f;
}
.el-radio-button {
  width: inherit;
}
.el-radio-button__inner,
.el-radio-group {
  display: flex;
  justify-content: center;
  line-height: 1;
  vertical-align: middle;
  background: rgb(18 35 68);
  color: #69fff9;
 border-color: #69fff9;
}
.el-radio-button__inner:hover {
  color: #69fff9;
}
.el-radio-button__orig-radio:checked + .el-radio-button__inner {
  background-color: #69fff9;
  border-color: #69fff9;
  color: #243251;
  -webkit-box-shadow: -1px 0 0 0 #69fff9;
  box-shadow: -1px 0 0 0 #69fff9;
}
.unit-convert {
  padding: 0 .5rem; 
   
}
</style>
