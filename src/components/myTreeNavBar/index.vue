<template>
  <div class="myTreeNavBar">
    <!-- 树形导航栏 -->
    <el-tree
      :data="treeData"
      default-expand-all
      node-key="deptId"
      ref="tree"
      :props="defaultProps"
      @node-click="clickTree"
      highlight-current
      :show-checkbox="showCheckBox"
    ></el-tree>
  </div>
</template>

<script>
export default {
  name: "myTreeNavBar",
  props: {
    treeData: {
      type: Array,
      default: () => {
        return {};
      }
    },
    showCheckBox: {
      type: Boolean,
      default: false
    },
    defaultLabel: {
      type: String,
      default: "name"
    }
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.defaultProps.label = this.defaultLabel;
  },
  updated() {
    // this.defaultProps.label = this.defaultLabel
  },
  methods: {
    clickTree(data) {
      this.$emit("clickTree", data);
    },
    getCheckedNodes() {
      let nodes = this.$refs.tree.getCheckedNodes();
      this.$emit("getCheckedNodes", nodes);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
