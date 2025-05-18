// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "babel-polyfill";
import "url-search-params-polyfill";

import Vue from "vue";
import store from "./store";
import echarts from "echarts";

import ElementUI from "element-ui";
import iView from "iview";

// import "./assets/less/index.less";
import "iview/dist/styles/iview.css"; // 使用 CSS
import "./assets/less/index.css";

// import echarts from "echarts";
import img from "./utils/img";
import utils from "./utils/utils";
import VueQrcode from "@chenfengyuan/vue-qrcode";
import global from "@/utils/global";
import "element-ui/lib/theme-chalk/index.css";
import router from "./router";
import App from "./App";
import VueTour from "vue-tour";
import Viewer from "v-viewer";
import "viewerjs/dist/viewer.css";
import md5 from "js-md5";
Vue.use(iView);

Vue.use(Viewer);
Viewer.setDefaults({
  Options: {
    inline: true,
    button: true,
    navbar: true,
    title: true,
    toolbar: true,
    tooltip: true,
    movable: true,
    zoomable: true,
    rotatable: true,
    scalable: true,
    transition: true,
    fullscreen: true,
    keyboard: true,
    url: "data-source"
  }
});
require("vue-tour/dist/vue-tour.css");
Vue.use(VueTour);

if (process.env.NODE_ENV === "local") {
  require("./mock");
}

Vue.use(ElementUI);
Vue.use(utils);

Vue.component(VueQrcode.name, VueQrcode);
// Vue.prototype.$ajax = axios
Vue.config.productionTip = false;
// Vue.prototype.$cookie = cookie
Vue.prototype.$echarts = function(el) {
  return echarts.init(el, null, { renderer: "svg" });
};
Vue.prototype.$images = img;
Vue.prototype.global = global;

var bus = new Vue();
Vue.prototype.bus = bus;
Vue.prototype.$md5 = md5;
// let echarts = Window.echarts;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});
