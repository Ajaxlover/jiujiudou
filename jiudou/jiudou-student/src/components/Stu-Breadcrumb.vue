<template>
  <el-breadcrumb class="app-breadcrumb" separator-class="el-icon-arrow-right">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item
        v-for="item in levelList"
        :key="item.path"
        :to="{ path: item.path }"
      >
        <span>{{ item.meta.title }}</span>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
export default {
  name: "stu-breadcrumb",
  data() {
    return {
      levelList: null,
    };
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    },
  },
  created() {
    this.getBreadcrumb();
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(
        (item) => item.meta && item.meta.title
      );
      const first = matched[0];
      if (!this.isIndex(first)) {
        matched = [{ path: "/", meta: { title: "首页" } }].concat(matched);
        this.levelList = matched;
      } else {
        this.levelList = [{ path: "/", meta: { title: "首页" } }];
      }
    },
    isIndex(route) {
      const redirect = route && route.redirect;
      if (!redirect) {
        return false;
      }
      return redirect === "/";
    },
  },
};
</script>

<style lang="less" scoped>
/* breadcrumb transition */
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all 0.5s;
}

.breadcrumb-enter,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-move {
  transition: all 0.5s;
}

.breadcrumb-leave-active {
  position: absolute;
}

.app-breadcrumb.el-breadcrumb {
  margin-left: 8px;
}
</style>
