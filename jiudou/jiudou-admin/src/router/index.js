import Vue from "vue";
import Router from "vue-router";
import routes from "./routers";
import store from "@/store";

const LOGIN_PAGE_NAME = "login";
const CHOOSE_ROLE = "chooseRole";
const BIG_DATA = ["page1", "page2", "page3"];

Vue.use(Router);
const router = new Router({
  routes,
  mode: "history",
  base: "/admin/"
});

// NProgress.configure({ ease: 'ease', speed: 500 })

const toIndex = (to, roles, next) => {
  if (to.name !== CHOOSE_ROLE) {
    if (!localStorage.getItem("currentRole")) {
      if (roles.length === 1) {
        // 设置session
        store.commit("setCurrentRole", roles[0]);
        localStorage.setItem("currentRole", roles[0].mrId);
        next({
          name: "index"
        });
      } else if (to.name !== CHOOSE_ROLE) {
        next({
          name: "chooseRole" // 跳转到首页
        });
      } else {
        preNext(to, next);
      }
    } else {
      if (store.state.user.currentRole.roleId === undefined) {
        store
          .dispatch("setCurrentRoleById", {
            mrId: localStorage.getItem("currentRole")
          })
          .then(res => {
            preNext(to, next);
          })
          .catch(() => {
            next({
              name: "chooseRole" // 跳转到首页
            });
          });
      } else {
        preNext(to, next);
      }
    }
  } else {
    preNext(to, next);
  }
};

const preNext = (to, next) => {
  store.commit("setCurrentPath", to.fullPath);
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
};

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  const token = store.state.user.token;
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    if (BIG_DATA.includes(to.name)) {
      next();
    } else {
      // 未登录且要跳转的页面不是登录页
      sessionStorage.setItem("shareInfo", JSON.stringify(to.query));
      next({
        name: LOGIN_PAGE_NAME // 跳转到登录页
      });
    }
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    preNext(to, next); // 跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    toIndex(to, store.state.user.roles, next);
  } else {
    if (store.state.user.hasGetInfo) {
      toIndex(to, store.state.user.roles, next);
    } else {
      store
        .dispatch("getUserInfo")
        .then(user => {
          // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
          toIndex(to, user.roles, next);
        })
        .catch(() => {
          store.dispatch("logout").then(res => {
            next({
              name: "login"
            });
          });
        });
    }
  }
});

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

export default router;
