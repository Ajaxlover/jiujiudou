<template>
  <el-container>
    <el-aside width="170px" v-if="!isIframe">
      <menuBar :menu="menu"></menuBar>
    </el-aside>
    <el-container :class="['admin-container', isIframe ? 'iframeBox' : '']">
      <el-header v-if="!isIframe">
        <span v-if="roleId == 24" class="cloud-link" @click="linkCourse"
          >云课</span
        >
        <div v-else class="pubName">
          {{ pubName }}
        </div>
        <el-dropdown class="topDropdowm">
          <span class="el-dropdown-link">
            欢迎<span>{{ userName }}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="changeRole"
              ><i class="el-icon-sort"></i>切换身份</el-dropdown-item
            >
            <el-dropdown-item @click.native="loginOut"
              ><i class="el-icon-error"></i>退出登录</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
        <router-link :to="{ name: 'person' }" tag="div" style="cursor: pointer">
          <img v-if="userPic" :src="userPic" alt="" class="userPic" />
          <img
            v-else
            src="@/assets/images/userPic.png"
            alt=""
            class="userPic"
          />
        </router-link>
        <!-- <el-badge :value="0" :max="10" class="item info">
          <img src="@/assets/images/infoIcon.png" alt="" class="">
        </el-badge> -->

        <span class="currentRoleName">{{ currentRoleName }}</span>
        <!-- <span v-if="roleId == 24" style="display:none" @click="linkCourse"
          >云课</span
        > -->
      </el-header>
      <el-main style="padding: 0">
        <div class="contentBox"><router-view /></div>
      </el-main>
      <!-- <el-footer>Footer</el-footer> -->
    </el-container>
  </el-container>
</template>
<script>
import menuBar from "./menuBar/menuBar";
import axios from "@/libs/api.request";
import store from "@/store";
import { devStuIndex, tfStuIndex, proStuIndex } from "@/router/config";

export default {
  data() {
    return {
      isIframe: false,
      menu: [],
      button: new Map(),
      userName: this.$store.state.user.userName,
      userPic: this.$store.state.user.avatarImgPath,
      currentRoleName: store.state.user.currentRole.roleName,
      roleId: store.state.user.currentRole.roleId,
      pubName: this.$store.state.user.currentRole.pubName
    };
  },
  components: {
    menuBar
  },
  methods: {
    // 跳转学生PC端首页
    linkCourse() {
      if (process.env.NODE_ENV == "alpha") {
        if (window.location.href.startsWith("https")) {
          // window.location.replace(tfStuIndex);
          window.location.replace(tfStuIndex);
        } else {
          window.location.replace(devStuIndex);
        }
      } else if (process.env.NODE_ENV == "production") {
        window.location.replace(proStuIndex);
      }
    },
    loginOut() {
      sessionStorage.removeItem("iframeSrc");
      this.$store.dispatch("logout").then(res => {
        this.$router.push({
          name: "login"
        });
      });
    },
    changeRole() {
      this.$router.push({
        name: "chooseRole"
      });
    },
    processButton(data, map) {
      for (let i = 0; i < data.length; i++) {
        map.set(data[i].perCode, data[i]);
        if (data[i].children.length > 0) {
          this.processButton(data[i].children, map);
        }
      }
    },
    proceeMenu(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].perType === 2) {
          // 目录
          this.proceeMenu(data[i].children);
        } else if (data[i].perType === 1) {
          // 页面
          if (data[i].children.length > 0) {
            let map = new Map();
            this.processButton(data[i].children, map);
            this.button.set(data[i].perUrl, map);
            // data[i].children = []
          }
        }
      }
    }
  },
  mounted() {
    axios
      .request({
        method: "post",
        url: "/v1/role/menu",
        data: {
          mrId: store.state.user.currentRole.mrId,
          roleId: store.state.user.currentRole.roleId
        }
      })
      .then(res => {
        let data = res.data.data;
        this.$store.commit("setFullMenu", data);
        this.proceeMenu(data);
        this.menu = data;
        this.$store.commit("setButton", this.button);
        setTimeout(() => {
          const isIframe = sessionStorage.getItem("iframeSrc") || false;
          this.isIframe = isIframe;
          if (isIframe) {
            this.$router.push("/exam/examManage");
          }
        }, 300);
      });
  }
};
</script>
<style lang="scss">
.admin-container {
  position: fixed;
  top: 0;
  left: 170px;
  right: 0;
  bottom: 0;
}

.admin-container > .el-header {
  line-height: 60px;
  color: #ffffff;
  background: #0d4376;
  padding: 0 30px 0 15px;

  .pubName {
    float: left;
  }

  .currentRoleName {
    float: right;
    color: #25d6fa;
    font-size: 17px;
    margin-right: 20px;
  }

  .cloud-link {
    float: left;
    color: #fff;
    font-size: 17px;
    margin-right: 20px;
    cursor: pointer;
  }

  .info {
    float: right;
    margin-right: 15px;

    img {
      width: 22px;
      height: 24px;
      margin-top: 18px;
    }

    .el-badge__content.is-fixed {
      position: absolute;
      top: 20px;
    }
  }

  .userPic {
    float: right;
    width: 38px;
    height: 38px;
    margin-top: 11px;
    margin-right: 10px;
    border-radius: 50%;
  }

  .topDropdowm {
    float: right;
    height: 40px;

    .el-dropdown-link {
      cursor: pointer;
      color: #ffffff;
    }

    .el-icon-arrow-down {
      font-size: 12px;
    }
  }
}

.admin-container > .el-main {
  height: 100%;
}

.admin-container .contentBox {
  // background-color: #ffffff;
  border-radius: 5px;
  height: 100%;
  // padding: 15px;
  height: 100%;
  padding-bottom: 20px;
}

.iframeBox {
  position: static;

  .contentBox {
    .el-header {
      display: none;
    }

    .el-container {
      position: static;
    }
  }
}
</style>
