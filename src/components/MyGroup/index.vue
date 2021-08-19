<template>
  <div class="myGroup">
    <div class="myGroup-box">
      <div class="myGroup-box-title">
        <div class="myGroup-box-title-text">
          <span class="left"> {{ title == null ? "--" : title }}</span>
          &nbsp;&nbsp;
          <span class="right" v-if="titleVal != null && list.length > 0">{{
            titleVal
          }}</span>
        </div>
        <div v-if="showTitleVal" class="myGroup-box-title-val">
          <MyBox :value="titleVal" />
        </div>
      </div>
      <div v-if="!showTitleVal" class="myGroup-box-content">
        <div v-for="(item, index) in list" :key="index">
          <MyBox :value="item.value" :unit="item.crName" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MyBox from "@/components/MyBox/index";
export default {
  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
    title: {
      type: String,
      default: () => {
        return "";
      },
    },
    showTitleVal: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    titleVal: "",
  },
  components: {
    MyBox,
  },
};
</script>
<style lang="scss" scoped>
.myGroup {
  .myGroup-box {
    //   border: 0.01rem solid #ff0000;
    border-radius: 0.05rem;
    background: rgba(75, 94, 119, 0.5);
    margin: 0 0.15rem 0.15rem 0;
    .myGroup-box-title {
      text-align: center;
      font-size: 0.16rem;
      color: #a8cdd4;
      padding: 0.15rem 0.15rem 0 0.15rem;
      .myGroup-box-title-text {
        display: flex;
        justify-content: center;
        align-items: center;
        .left {
          font-size: 0.18rem;
          font-weight: 400;
        }
        .right {
          color: #2cff76;
          font-size: 0.24rem;
          font-weight: bold;
          
        }
      }
      .myGroup-box-title-val {
        margin-top: 0.15rem;
        padding-bottom: 0.15rem;
      }
    }
    .myGroup-box-content {
      display: flex;
      padding: 0.15rem;
      flex-wrap: wrap;
    }
  }
}
</style>