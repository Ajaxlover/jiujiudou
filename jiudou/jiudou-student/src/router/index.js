/* eslint-disable prettier/prettier */
import Vue from "vue"
import VueRouter from "vue-router"
import store from "@/store"
import { getStuInfo, STU_TOKEN_KEY } from "@/libs/cookieUtil"
import Cookies from "js-cookie"
// eslint-disable-next-line no-unused-vars
import { tfLoginLink, proLoginLink, devLoginLink } from "./config"

Vue.use(VueRouter)

const routes = [
  // {
  //   path: "/test",
  //   meta: { title: "测试页面" },
  //   name: "test",
  //   component: () => import(/* webpackChunkName: "test" */ "../views/test.vue"),
  // },
  {
    path: "/",
    meta: { title: "首页" },
    name: "home",
    component: () => import("../views/home/HomeView.vue"),
  },
  {
    path: "/login",
    name: "login",
    meta: { title: "登录" },
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/login.vue"),
  },
  {
    path: "/search",
    meta: { title: "搜索" },
    name: "search",
    component: () =>
      import(
        /* webpackChunkName: "search" */ "../views/search/CourseSearch.vue"
      ),
  },
  {
    path: "/cloudBook-detail",
    meta: { title: "书城详情" },
    name: "cloudBookDetail",
    component: () =>
      import(
        /* webpackChunkName: "cloudBookDetail" */ "../views/bookshop/bookDetail.vue"
      ),
  },
  {
    path: "/digitalBook-detail",
    meta: { title: "数字教材" },
    name: "digitalBookDetail",
    component: () =>
      import(
        /* webpackChunkName: "cloudBookDetail" */ "../views/digitalbook/digitalBookDetail.vue"
      ),
  },
  {
    path: "/digital-staff",
    meta: { title: "数字教材习题" },
    name: "digitalStaff",
    component: () =>
      import(
        /* webpackChunkName: "cloudBookDetail" */ "../views/digitalbook/digitalStaff.vue"
      ),
  },
  {
    path: "/personal",
    meta: { title: "个人设置" },
    name: "personalSetting",
    component: () =>
      import(
        /* webpackChunkName: "personalSetting" */ "../views/setting/Setting.vue"
      ),
  },
  {
    path: "/my-course",
    meta: { title: "我的云课" },
    name: "myCourse",
    component: () =>
      import(
        /* webpackChunkName: "myCourse" */ "../views/setting/MyCourse.vue"
      ),
  },
  {
    path: "/my-study",
    meta: { title: "我的学习" },
    name: "myStudy",
    component: () =>
      import(/* webpackChunkName: "myStudy" */ "../views/setting/MyStudy.vue"),
  },
  {
    path: "/my-book",
    meta: { title: "我的教材" },
    name: "myBook",
    component: () =>
      import(/* webpackChunkName: "myBook" */ "../views/setting/MyBook.vue"),
  },
  {
    path: "/my-digitalbook",
    meta: { title: "我的数字教材" },
    name: "myDigitalBook",
    component: () =>
      import(
        /* webpackChunkName: "myBook" */ "../views/setting/MyDigitalBook.vue"
      ),
  },
  {
    path: "/my-book-detail/:textbookId",
    meta: { title: "教材详情" },
    name: "myBookDetail",
    component: () =>
      import(
        /* webpackChunkName: "myBookDetail" */ "../views/bookshop/MyBookDetail.vue"
      ),
  },
  {
    path: "/cloud-detail/:cCourseId?",
    meta: { title: "云课详情" },
    name: "cloudDetail",
    component: () =>
      import(
        /* webpackChunkName: "cloudDetail" */ "../views/coursedetail/CloudDetail.vue"
      ),
  },
  {
    path: "/cloud-play/:cCourseId",
    meta: { title: "云课播放" },
    name: "cloudPlay",
    component: () =>
      import(
        /* webpackChunkName: "cloudPlay" */ "../views/coursedetail/CloudPlay.vue"
      ),
  },
  {
    path: "/mooc-play/:moocId",
    meta: { title: "慕课播放" },
    name: "moocPlay",
    component: () =>
      import(
        /* webpackChunkName: "moocPlay" */ "../views/coursedetail/MoocPlay.vue"
      ),
  },
  {
    path: "/mooc-detail",
    meta: { title: "慕课详情" },
    name: "moocDetail",
    component: () =>
      import(
        /* webpackChunkName: "moocDetail" */ "../views/coursedetail/MoocDetail.vue"
      ),
  },
  {
    path: "/mooc-list",
    meta: { title: "慕课列表" },
    name: "moocList",
    component: () =>
      import(/* webpackChunkName: "moocList" */ "../views/mooc/MoocList.vue"),
  },
  {
    path: "*", // 访问页面路径不存在，重定向到首页
    redirect: "/",
  },
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
})

// eslint-disable-next-line no-unused-vars
router.beforeEach((to, from, next) => {
  if (to.path == "/login" || to.path == "/digital-staff") {
    next()
    return
  }
  /* 路由发生变化修改页面title */
  // const token = store.state.user.token

  let token = Cookies.get(STU_TOKEN_KEY)

  if (!token) {
    if (process.env.NODE_ENV == "development") {
      if (window.location.href.startsWith("https")) {
        window.location.href = tfLoginLink
        // window.location.href = proLoginLink
      } else {
        // window.location.href = devLoginLink
        window.location.href = tfLoginLink
      }
    } else {
      window.location.href = proLoginLink
    }
  } else {
    document.title = to.meta.title
    let userInfo = getStuInfo()
    let userInfoObj = JSON.parse(userInfo)
    if (userInfoObj) {
      store.commit("setHasGetInfo", true)
      store.commit("setAvatar", userInfoObj.pic)
      store.commit("setUserName", userInfoObj.username)
      store.commit("setUserId", userInfoObj.uid)
    }
    next()
  }
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

export default router
