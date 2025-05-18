import { createApp } from "vue";
import App from "./App.vue";
// 引入全局样式
import "@/render/styles/index.scss";
// 引入状态管理
import { setupStore } from "@/render/store";
// 引入路由
import { setupRouter } from "@/render/router";

// 引入数学公式渲染
// import MathJax from '@/render/utils/math'
// import MathJax, { initMathJax, renderByMathjax } from 'mathjax-vue'
// function onMathJaxReady() {
//   const el = document.getElementById('elementId')
//   renderByMathjax(el)
// }
if (import.meta.env.VITE_APP_ENV === "development") {
  console.log("开发环境")
  sessionStorage.setItem("env", 'development')
} else if (import.meta.env.VITE_APP_ENV === "production") {
  console.log("线上环境")
  sessionStorage.setItem("env", 'production')
}
// initMathJax({}, onMathJaxReady)
// 创建实例
const setupAll = async () => {
  const app = createApp(App);
  // app.use(MathJax)
  // app.config.globalProperties.MathJax = MathJax
  setupStore(app);
  setupRouter(app);
  app.mount("#app");
};

setupAll();
