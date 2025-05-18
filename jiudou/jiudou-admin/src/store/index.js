import Vue from "vue";
import vuex from "vuex";
import user from "./modules/user";
import access from "./modules/access";
import subjectType from "./modules/subjectType";
import importPreTem from "./modules/importPreTem";
import courseWare from "./modules/courseWare";
import classRoom from "./modules/classRoom";
import resource from "./modules/resouce";
import tiku from "./modules/tiku";

Vue.use(vuex);

const store = new vuex.Store({
  modules: {
    user,
    access,
    subjectType,
    importPreTem,
    courseWare,
    classRoom,
    resource,
    tiku
  }
});

export default store;
