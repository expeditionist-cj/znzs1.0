<template>
  <div class="remind">
    <Block>
      <div slot="title">重要事项提醒</div> 
      <div class="block" slot="content">
        <el-carousel height="1.5rem" :interval="5000" arrow="always">
          <el-carousel-item v-for="(item, index) in imgList" :key="index">
            <div class="img-box">
              <img :src="item.src" alt="" />
            </div> 
          </el-carousel-item>
        </el-carousel>
      </div>
    </Block>
  </div>
</template>

<script>
import Block from "../Block";

export default {
  props: {},
  data() {
    return {
      imgList: [
        {
          src: '/images/importantThing.png',
        },
        {
          src: '/images/fctx.png',
        },
      ],
    };
  },
  components: { Block },
  computed: {
    
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {},
};
</script>

<style scoped lang="scss">
.remind {
  width: 100%;
  height: 2rem;
  display: flex;
  align-items: center;
  margin-bottom: 0.2rem;
  .block {
    height: 100%;
    margin-top: 0.2rem;
    .img-box {
      height: 100%;
      padding-bottom: 0.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  } 
}
</style>
