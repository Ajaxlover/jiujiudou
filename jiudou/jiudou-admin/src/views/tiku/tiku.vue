<template>
  <el-tabs
    class="tiku"
    v-model="activeName"
    @tab-click="handleClick"
    ref="tabs"
  >
    <el-tab-pane
      label="机构题库"
      v-if="roleId != 19 && isOfficial === 1 && roleId !== 65"
      name="first"
      ><official-pane></official-pane
    ></el-tab-pane>
    <el-tab-pane
      label="公共题库"
      v-if="roleId == 19 || roleId == 65"
      name="second"
      ><commonPane></commonPane
    ></el-tab-pane>
    <!-- <el-tab-pane label="题库商城" v-if="roleId == 24" name="second"
      ><commonPane></commonPane
    ></el-tab-pane> -->
    <el-tab-pane
      label="我的题库"
      v-if="roleId != 19 && isOfficial !== 1 && roleId !== 65"
      name="second"
      ><my-pane v-on:changeTab="changeTab"></my-pane
    ></el-tab-pane>
    <!-- 以前的找题 -->
    <el-tab-pane
      label="公共题库"
      v-if="roleId != 19 && roleId !== 65 && roleId !== 24"
      name="third"
      ><selectTimu></selectTimu
    ></el-tab-pane>
    <el-tab-pane label="题库商城" v-if="roleId == 24" name="third"
      ><subjectMarket></subjectMarket
    ></el-tab-pane>
    <el-tab-pane
      label="教材题库"
      v-if="roleId != 19 && roleId !== 65"
      name="fourth"
      ><text-book></text-book
    ></el-tab-pane>
  </el-tabs>
</template>

<style>
.tiku .el-tabs__header {
  background: white;
  padding: 0 52px;
  height: 50px;
  line-height: 50px;
  margin: 0;
}
.tiku .el-tabs__nav-wrap::after {
  background: none;
}
.tiku .el-tabs__item {
  font-size: 16px;
  font-weight: 400;
}
</style>

<script>
import OfficialBank from "./officialPane";
import MyBank from "./myPane";
import selectTimu from "./selectTimu";
import subjectMarket from "./subjectMarket";
import commonPane from "./commonPane";
import TextBook from "./textBook.vue";
export default {
  components: {
    "official-pane": OfficialBank,
    "my-pane": MyBank,
    selectTimu,
    commonPane,
    TextBook,
    subjectMarket
  },
  computed: {
    activeName: {
      get: function() {
        let activeName = sessionStorage.getItem("paneSelectedTabs");
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
  data() {
    return {
      isOfficial: this.$store.state.user.currentRole.roleType,
      roleId: this.$store.state.user.currentRole.roleId
    };
  },
  methods: {
    handleClick(tab, event) {
      sessionStorage.setItem("paneSelectedTabs", tab.name);
    },
    changeTab() {
      this.$refs.tabs.setCurrentName("third");
    }
  },
  beforeDestroy() {
    sessionStorage.removeItem("paneSelectedTabs");
  }
};
</script>
