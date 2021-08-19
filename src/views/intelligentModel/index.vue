<template>
  <div class="IntelligentModel">
    <div class="IntelligentModel-left">
      <!-- 左侧纵向导航栏 -->
      <ul class="ul-outside">
        <li v-for="item in menuData" :key="item.type_code" class="li-outside">
          <span>{{ item.mname }}</span>
          <ul class="ul-inside">
            <li
              v-for="itm in item.children"
              :key="itm.refCode"
              class="li-inside"
            >
              <div
                class="li-inside-div"
                :class="{ active: itm.refCode == activeModel }"
                :style="{
                  color: itm.online ? 'rgba(176, 213, 220, 1)' : '',
                }"
                @click="onCheck(itm)"
              >
                <svg-icon :icon-class="itm.icon" class-name="custom-class" />
                {{ itm.mname }}
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!-- 模型页面 -->
    <div class="IntelligentModel-right">
      <transition name="fade-transform" mode="out-in">
        <router-view />
      </transition>
    </div>
  </div>
</template>

<script>
import { menu } from '@/global/index'
import { mapState } from 'vuex'
import $ from 'jquery'
export default {
  name: 'IntelligentModel',
  data() {
    return {
      menuData: [],
      key() {
        return this.$route.path
      }
    }
  },
  computed: {
    ...mapState({
      activeModel: (state) => state.app.activeModel,
      menu: (state) => state.user.menu
    })
  },
  created() {
    window.$ = $
    this.menu.forEach((ele) => {
      if (ele['mname'] == '智能模型') {
        this.menuData = ele['children']
      }
    })
  },
  mounted() {
    $('.li-outside span').click(function(e) {
      e.stopPropagation() //  阻止事件冒泡
      e.preventDefault()
      if (
        $(this).next('.ul-inside').children('.li-inside').css('display') ==
        'list-item'
      ) {
        $(this).next('.ul-inside').children('.li-inside').hide(200)
      } else {
        $(this).next('.ul-inside').children('.li-inside').show(200)
      }
    })
  },
  methods: {
    onCheck(item) {
      console.log(item, 122)
      this.$router.push({ path: item.path })
      this.$store.commit('app/SET_ACTIVEMODEL', item.refCode)
    }
  }
}
</script>
<style lang="scss" scoped>
.IntelligentModel {
  height: 100%;
  display: flex;
  flex-wrap: nowrap;
  font-size: 0.16rem;
  .IntelligentModel-left {
    width: 17%;
    height: 100%;
    overflow: scroll;
    background-color: rgba(255, 255, 255, 0.05);
    margin: 0 0.1rem 0 0;
    .ul-outside {
      padding: 0;
      height: 100%;

      .hide-li {
        height: 0;
        overflow: hidden;
        transition: 0.2s;
      }
      .li-outside span {
        display: block;
        // font-family: PingFang-SC-Heavy;
        font-weight: 800;
        background: linear-gradient(
          90deg,
          rgba(249, 249, 249, 0.1) 0%,
          rgba(241, 241, 241, 0.03) 100%
        );
        color: #b0d5dc;
        padding: 0.1rem;
        cursor: pointer;
      }
    }
    .ul-inside {
      padding: 0;
      transition: 0.2s;
      .li-inside {
        .li-inside-div {
          margin: 0.1rem 0;
          display: block;
          color: rgba(176, 213, 220, 0.4);
          padding: 0.1rem;
          cursor: pointer;
          // font-family: PingFang-SC-Medium;
          // border: 0.01rem solid transparent;
          // border-top: transparent !important;
          // border-bottom: transparent !important;
          .custom-class {
            width: 0.15rem;
            height: 0.14rem;
            margin-right: 0.08rem;
          }
        }
      }
      .active {
        // border: 0.04rem solid rgba(105, 255, 249, 1) !important;
        color: rgba(31, 45, 77, 1) !important;
        background: linear-gradient(
          270deg,
          rgba(87, 255, 255, 0.33) 0%,
          rgba(87, 255, 255, 1) 100%
        );
      }
    }
  }
  .IntelligentModel-left::-webkit-scrollbar {
    display: none;
  }
  .IntelligentModel-right {
    width: 83%;
  }
}
ul {
  list-style: none;
  margin-block-start: 0;
}
</style>
