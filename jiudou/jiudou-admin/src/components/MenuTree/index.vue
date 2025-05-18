<template>
  <el-submenu v-if="menu.perType === 2" :index="'' + menu.perId">
    <template slot="title">
      <i :class="menu.perIcon"></i>
      <span slot="title">{{ menu.perName }}</span>
    </template>
    <MenuTree
      v-for="item in menu.children"
      :key="item.perId"
      :menu="item"
    ></MenuTree>
  </el-submenu>
  <el-menu-item
    v-else-if="menu.perType === 1"
    :index="'' + menu.perUrl"
    @click="handleRoute(menu)"
  >
    <i :class="menu.perIcon"></i>
    <span slot="title">{{ menu.perName }}</span>
  </el-menu-item>
</template>

<script>
export default {
  name: "MenuTree",
  props: {
    menu: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleRoute(menu) {
      this.$router.push(menu.perUrl);
      // // 如果是嵌套页面，转换成iframe的path
      // let path = getIFramePath(menu.url)
      // if(!path) {
      //   path = menu.url
      // }
      // // 通过菜单URL跳转至指定路由
      // this.$router.push("/" + path)
    }
  }
};
</script>

<style lang="scss">
.menu-bar-container {
  /* 一级菜单 */
  .el-menu {
    border-right: none;
    background-color: #282b33;
  }
  .el-menu-item,
  .el-submenu__title {
    height: 50px !important;
    line-height: 50px !important;
  }
  .el-menu-item:focus,
  .el-submenu__title:focus {
    background-color: #282b33 !important;
  }
  .el-submenu__title:hover,
  .el-menu-item:hover {
    background-color: #2ba1f4 !important;
    color: #ffffff !important;
  }
  .el-menu-item.is-active {
    background-color: #2ba1f4 !important;
    color: #ffffff !important;
  }
  .el-menu-item {
    color: rgba(221, 221, 221, 0.8);
  }
  .el-submenu__title {
    padding-left: 10px !important;
    height: 50px !important;
    line-height: 50px !important;
    background-color: #282b33;
    color: rgba(221, 221, 221, 0.8);
  }
  .is-opened > div {
    // background-color: #2BA1F4 !important;
    color: #ffffff;
  }

  /* 二级菜单 */
  .el-menu .el-menu {
    background-color: #1b1e23;
  }
  .el-menu .el-menu .el-menu-item {
    color: rgba(255, 255, 255, 0.7);
  }
  .el-menu .el-menu .el-menu-item:focus,
  .el-menu .el-menu .el-menu-item:hover {
    background-color: transparent !important;
    color: #2ba1f4 !important;
  }
  .el-menu .el-menu .el-menu-item.is-active {
    background-color: transparent !important;
    color: #2ba1f4 !important;
  }
  .el-menu-item {
    padding: 0 10px !important;
  }
  .el-menu-item i {
    display: inline-block;
    min-width: 30px;
    height: 24px;
  }
  .el-submenu .el-menu-item {
    min-width: 170px;
  }
  .el-submenu__title i {
    color: #ffffff;
  }

  .el-submenu__title > i:first-child {
    display: inline-block;
    min-width: 30px;
    height: 24px;
  }
  .ziYuanIcon {
    background: url("~@/assets/menuIcon/ziYuanIcon.png") no-repeat;
    background-position: center;
    opacity: 0.8;
  }
  .el-menu-item:hover .ziYuanIcon {
    opacity: 1;
  }
  .classIcon {
    background: url("~@/assets/menuIcon/classIcon.png") no-repeat;
    background-position: center;
    opacity: 0.8;
  }
  .el-menu-item:hover .classIcon {
    opacity: 1;
  }
  .tiKuIcon {
    background: url("~@/assets/menuIcon/tiKuIcon.png") no-repeat;
    background-position: center;
    opacity: 0.8;
  }
  .el-menu-item:hover .tiKuIcon {
    opacity: 1;
  }
  .cloudCourseIcon {
    background: url("~@/assets/menuIcon/yunKeIcon.png") no-repeat;
    background-position: center;
    opacity: 0.8;
  }
  .el-menu-item:hover .cloudCourseIcon {
    opacity: 1;
  }
  .bookIcon {
    background: url("~@/assets/menuIcon/bookIcon.png") no-repeat;
    background-position: center;
    opacity: 0.8;
  }
  .el-menu-item:hover .bookIcon {
    opacity: 1;
  }
  .systemIcon {
    background: url("~@/assets/menuIcon/systemIcon.png") no-repeat;
    background-position: center;
    opacity: 0.8;
  }
  .el-menu-item:hover .systemIcon {
    opacity: 1;
  }
  .profileIcon {
    background: url("~@/assets/menuIcon/profileIcon.png") no-repeat;
    background-position: center;
    opacity: 0.8;
  }
  .el-menu-item:hover .profileIcon {
    opacity: 1;
  }
  .codeIcon {
    background: url("~@/assets/menuIcon/codeIcon.png") no-repeat;
    background-position: center;
    opacity: 0.8;
  }
  .el-menu-item:hover .codeIcon {
    opacity: 1;
  }
  .memberIcon {
    background: url("~@/assets/menuIcon/memberIcon.png") no-repeat;
    background-position: center;
    opacity: 0.8;
  }
  .el-menu-item:hover .memberIcon {
    opacity: 1;
  }
  .operationIcon {
    background: url("~@/assets/menuIcon/operationIcon.png") no-repeat;
    background-position: center;
    opacity: 0.8;
  }
  .el-menu-item:hover .operationIcon {
    opacity: 1;
  }
  .coursewareLibIcon {
    background: url("~@/assets/menuIcon/coursewareLibIcon.png") no-repeat;
    background-position: center;
    opacity: 0.8;
  }
  .el-menu-item:hover .coursewareLibIcon {
    opacity: 1;
  }
  .classCourseIcon {
    background: url("~@/assets/menuIcon/yunKeIcon.png") no-repeat;
    background-position: center;
    opacity: 0.8;
  }
  .el-menu-item:hover .classCourseIcon {
    opacity: 1;
  }
  .paperIcon {
    background: url("~@/assets/menuIcon/paperIcon.png") no-repeat;
    background-position: center;
    opacity: 0.8;
  }
  .el-menu-item:hover .paperIcon {
    opacity: 1;
  }
  .examIcon {
    background: url("~@/assets/menuIcon/examIcon.png") no-repeat;
    background-position: center;
    opacity: 0.8;
  }
  .el-menu-item:hover .examIcon {
    opacity: 1;
  }
  .el-menu-item:hover .dotIcon {
    background: url("~@/assets/menuIcon/dotIcon.png") no-repeat;
    background-position: center;
  }
  .el-menu .el-menu .el-menu-item.is-active .dotIcon {
    background: url("~@/assets/menuIcon/dotIcon.png") no-repeat;
    background-position: center;
  }
}
</style>
