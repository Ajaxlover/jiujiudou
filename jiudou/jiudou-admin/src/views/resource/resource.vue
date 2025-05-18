<template>
  <el-tabs
    v-model="activeName"
    @tab-click="handleClick"
    class="resource"
    ref="tabs"
  >
    <el-tab-pane
      label="机构资源"
      v-if="roleId != 19 && isOfficial === 1"
      name="first"
      ><officialRes></officialRes
    ></el-tab-pane>
    <el-tab-pane label="公共资源" v-if="roleId == 19" name="second"
      ><commonRes></commonRes
    ></el-tab-pane>
    <el-tab-pane
      label="我的资源"
      v-if="roleId != 19 && isOfficial !== 1"
      name="second"
      ><myRes v-on:changeTab="changeTab"></myRes
    ></el-tab-pane>
    <!-- 以前的找资源 -->
    <el-tab-pane label="公共资源" v-if="roleId != 19" name="third"
      ><selectRes></selectRes
    ></el-tab-pane>
    <el-tab-pane label="教材资源" v-if="roleId != 19" name="fourth">
      <officialTextBookRes
        v-if="roleId === 26 || roleId === 25"
      ></officialTextBookRes>
      <textBookRes v-else></textBookRes
    ></el-tab-pane>
  </el-tabs>
</template>
<script>
import myRes from "./rModule/myRes";
import selectRes from "./rModule/selectRes";
import officialRes from "./rModule/officialRes";
import commonRes from "./rModule/commonRes";
import textBookRes from "./rModule/textBookRes";
import officialTextBookRes from "./rModule/officialTextBookRes.vue";
export default {
  data() {
    return {
      roleId: this.$store.state.user.currentRole.roleId,
      isOfficial: this.$store.state.user.currentRole.roleType
    };
  },
  components: {
    myRes,
    selectRes,
    officialRes,
    commonRes,
    textBookRes,
    officialTextBookRes
  },
  computed: {
    activeName: {
      get: function() {
        let activeName = sessionStorage.getItem("resSelectedTabs");
        if (!activeName) {
          if (this.isOfficial === 1) {
            return "first";
          } else {
            return "second";
          }
        } else {
          return activeName;
        }
      },
      set: function() {}
    }
  },
  methods: {
    handleClick(tab, event) {
      sessionStorage.setItem("resSelectedTabs", tab.name);
    },
    changeTab() {
      this.$refs.tabs.setCurrentName("third");
    }
  },
  beforeDestroy() {
    sessionStorage.removeItem("resSelectedTabs");
  }
};
</script>
<style lang="scss">
.resource {
  padding-top: 50px;
  height: 100%;
}
.resource > .el-tabs__header {
  background-color: #ffffff;
  padding-left: 52px;
  padding-right: 52px;
  width: 100%;
  position: fixed;
  top: 60px;
}
.resource > .el-tabs__content {
  padding: 20px 20px 0;
  max-height: 100%;
  overflow-y: auto;
}
.resource > .el-tabs__header .el-tabs__item {
  padding: 0 20px;
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  font-weight: 400;
  // color: #222222;
  position: relative;
}
.el-tabs__item.is-active {
  color: #2ba1f4;
}
.el-tabs__active-bar {
  background-color: #2ba1f4;
}
.resource .el-tabs__nav-wrap::after {
  background: none;
}
.el-tabs__item:hover {
  color: #2ba1f4;
  cursor: pointer;
}
</style>
