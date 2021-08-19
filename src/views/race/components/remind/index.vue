<template>
  <div class="remind">
    <Block>
      <div slot="title">重要事项提醒</div>
      <div slot="content" class="remind-content">
        <img src="../../../../assets/dashboard/importantThing.png" alt="" />
      </div>
    </Block>
  </div>
</template>

<script>
import Block from "../Block";
export default {
  props: {},
  data() {
    return {};
  },
  components: { Block },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {},
};
</script>

<style scoped lang="scss">
.remind {
  width: 100%;
  height: 1.74rem;
  // height: 18%;
  margin-top: 0.1rem;
  .block {
    height: 100%;
  }
  .remind-content {
    height: 1.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 0.2rem;
    img {
      height: 100%;
    }
  }
}
</style>
