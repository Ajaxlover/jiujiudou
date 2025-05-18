/* eslint-disable vue/html-self-closing */
<template>
  <van-tabbar
    v-show="$route.name == 'Home' || $route.name == 'BookStore' || $route.name == 'AR' || $route.name == 'My'"
    v-model="active"
    inactive-color="#666666"
    active-color="#10c4ee"
    fixed
    placeholder
  >
    <van-tabbar-item v-for="(item, index) in tabbarList" :key="index" replace :to="item.path">
      <span>{{ item.title }}</span>
      <img slot="icon" slot-scope="props" :src="props.active ? item.active : item.normal" />
    </van-tabbar-item>
  </van-tabbar>
</template>

<script>
export default {
  name: 'TabBar',
  data() {
    return {
      active: 0,
      tabbarList: [
        {
          // path: '/bookStore',
          path: '/',
          title: '书城',
          normal: require('../assets/image/home.png'),
          active: require('../assets/image/home_active.png')
        },
        {
          path: '/home',
          title: '我的教材',
          normal: require('../assets/image/book.png'),
          active: require('../assets/image/book_active.png')
        },
        {
          path: '/ar',
          title: 'AR示例',
          normal: require('../assets/image/ar.png'),
          active: require('../assets/image/ar_active.png')
        },
        {
          path: '/my',
          title: '我的',
          normal: require('../assets/image/my.png'),
          active: require('../assets/image/my_active.png')
        }
      ]
    }
  },

  // 监听路由变化
  watch: {
    $route(to) {
      this.activeTab(to.path)
    }
  },

  methods: {
    activeTab(path) {
      var index = this.tabbarList.map(item => item.path).indexOf(path)
      if (index !== -1) {
        this.active = index
      }
    }
  }
}
</script>
