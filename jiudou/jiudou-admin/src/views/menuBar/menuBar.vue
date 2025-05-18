<template>
  <div class="menu-bar-container">
    <div class="logo menu-bar-width">
      <img src="@/assets/images/jdlogonew.png" />
    </div>
    <el-scrollbar style="height:94%">
      <!-- 导航菜单 -->
      <el-menu
        ref="navmenu"
        :unique-opened="true"
        :default-active="$route.path"
        :default-openeds="defaultOpen"
        :collapse="false"
      >
        <!-- background-color="#282b33"  text-color="rgba(221,221,221,0.8)" -->
        <!-- 导航菜单树组件，动态加载菜单 -->
        <menu-tree
          v-for="item in menu"
          :key="item.perId"
          :menu="item"
        ></menu-tree>
      </el-menu>
    </el-scrollbar>
  </div>
</template>
<script>
import MenuTree from "@/components/MenuTree";
export default {
  components: {
    MenuTree
  },
  props: {
    menu: {
      type: Array,
      default() {
        return [];
      }
    },
    theme: {
      type: String,
      default: "dark"
    }
  },
  data() {
    return {
      defaultOpen: []
    };
  }
};
</script>

<style scoped lang="scss">
.menu-bar-container {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 0;
  min-height: 100%;
  background-color: #282b33;
  .logo {
    height: 60px;
    background: #0d4376;
    padding: 0 15px;
    img {
      width: 124px;
      height: 30px;
      margin-top: 15px;
    }
  }
  .menu-bar-width {
    width: 170px;
  }
  .el-submenu__title {
    height: 50px !important;
    line-height: 50px !important;
    background-color: red !important;
  }
  .menu-bar-collapse-width {
    width: 65px;
  }
}
</style>
