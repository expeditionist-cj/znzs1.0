<template>
  <div class="dialog">
    <div class="dialog-title">{{ title }}</div>
    <div class="close" @click="closeSettings">X</div>
    <slot name="content"></slot>

    <div class="dialog-footer">
      <div v-if="showCancel">
        <button class="btn btn-cancel" @click="closeSettings">取消</button>
        <button class="btn btn-save" @click="saveSettings">保存</button>
      </div>
      <div v-else>
        <button class="btn btn-save" @click="onConfirm">确定</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: () => {
        return "";
      },
    },
    showCancel: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    closeSettings() {
      this.$emit("closeSettings");
    },
    saveSettings() {
      this.$emit("saveSettings");
    },
    onConfirm() {
      this.$emit("onConfirm");
    },
  },
};
</script>
<style lang="scss">
.dialog {
  width: 60%;
  min-height: 60%;
  position: fixed;
  top: 0;
  left: 20%;
  z-index: 20000;
  margin-top: 10%;
  background: url("../../assets/images/dialogBackground.png") no-repeat center;
  background-size: 100% 100%;
  .dialog-title {
    text-align: center;
    padding: 0.05rem 0;
    font-size: 0.16rem;
    color: rgba(105, 255, 249, 1);
  }
  .close {
    color: rgba(105, 255, 249, 1);
    float: right;
    margin: -0.16rem 0.16rem 0 0;
    cursor: pointer;
  }
  .dialog-footer {
    text-align: right;
    padding: 0.1rem 0.4rem;
    .btn {
      border: 0;
      outline: none;
      border-radius: 0.05rem;
      padding: 0.1rem 0.8rem;
      margin-right: 0.1rem;
      cursor: pointer;
    }
    .btn-cancel {
      background-color: rgba(105, 255, 249, 0.5);
    }
    .btn-save {
      background-color: rgba(105, 255, 249, 1);
    }
  }
}
</style>