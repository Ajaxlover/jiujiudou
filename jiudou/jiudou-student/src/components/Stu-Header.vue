<template>
  <div class="jd_header">
    <el-header height="70px">
      <div class="nav-left">
        <div @click="goHome" class="nav-left-text">
          <img src="../assets/img/jiudouLogo.png" alt="" />
        </div>
        <div class="nav-left-mid">
          <div>
            <span v-if="isShow" @click="scrollToTarget(1)">云课</span>
            <span v-if="isShow" @click="scrollToTarget(2)">慕课</span>
            <span v-if="isShow" @click="scrollToTarget(3)">书城</span>
            <span v-if="isShow" @click="scrollToTarget(4)">数字教材</span>
            <span v-if="isTeacher" @click="toJiuDou">教学管理后台</span>
          </div>
        </div>
        <div class="search-box" v-if="isVisible">
          <el-input
            placeholder="课程搜索"
            v-model="keywords"
            class="input-with-select"
          >
          </el-input>
          <el-button @click="goSearch" icon="el-icon-search"></el-button>
        </div>
      </div>

      <div class="nav-right">
        <div v-if="userId" @click="goMyStudy" class="nav-study">我的学习</div>

        <el-menu
          v-if="userId"
          :default-active="activeIndex2"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          background-color="#fff"
          text-color="#333"
          active-text-color="#333"
        >
          <el-submenu index="1">
            <template slot="title">
              <el-avatar
                :size="30"
                :src="
                  userPic != ''
                    ? userPic
                    : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
                "
              ></el-avatar>
              <span style="margin-left: 6px">{{ userName }}</span>
            </template>
            <el-menu-item @click="toMyDigitalBook" index="2-1">
              <div class="my-menu">
                <img src="../assets/img/jiaocai_b.png" alt="" />
                <span>我的数字教材</span>
              </div>
            </el-menu-item>
            <el-menu-item @click="toMyBook" index="2-2">
              <div class="my-menu">
                <img src="../assets/img/jiaocai_b.png" alt="" />
                <span>我的教材</span>
              </div>
            </el-menu-item>
            <el-menu-item @click="toMyCourse" index="2-3"
              ><div class="my-menu">
                <img
                  style="width: 18px; height: 17px"
                  src="../assets/img/yunketang_b.png"
                  alt=""
                />
                <span>我的云课</span>
              </div></el-menu-item
            >
            <el-menu-item @click="goSetting" index="2-4">
              <div class="my-menu">
                <img src="../assets/img/gerenshezhi_b.png" alt="" />
                <span>个人设置</span>
              </div>
            </el-menu-item>
            <el-menu-item @click="logOut" index="2-5">
              <div class="my-menu">
                <img src="../assets/img/tuichudenglu_b.png" alt="" />
                <span>退出登录</span>
              </div>
            </el-menu-item>
          </el-submenu>
        </el-menu>
        <div v-else style="width: 80px; margin-left: 20px">
          <span style="cursor: pointer" @click="toLogin">登录</span>
          <span>丨</span>
          <span style="cursor: pointer" @click="toRegister">注册</span>
        </div>
      </div>
    </el-header>
  </div>
</template>

<script>
/* eslint-disable */
// @ is an alias to /src
// import axios from "@/libs/api.request";
import { getStuInfo } from "@/libs/cookieUtil"

export default {
  name: "stu-header",
  components: {},

  data() {
    return {
      keywords: "",
      activeIndex: "1",
      activeIndex2: "1",
      isVisible: true,
      // userInfo: null,
    }
  },
  computed: {
    userId() {
      return this.$store.state.user.userId
    },
    userName() {
      return this.$store.state.user.userName
    },
    userPic() {
      return this.$store.state.user.avatarImgPath
    },
    isShow() {
      return this.$route.name == "home"
    },
    isTeacher() {
      let userInfo = getStuInfo()
      let userInfoObj = JSON.parse(userInfo)
      if (userInfoObj) {
        if (userInfoObj.type == 1) {
          return false
        } else {
          return true
        }
      } else {
        return false
      }
    },
  },
  methods: {
    toJiuDou() {
      if (process.env.NODE_ENV == "development") {
        if (window.location.href.startsWith("https")) {
          window.location.href = "https://tfwww.jiudou123.com/class/myClass"
          // window.location.href = proLoginLink
        } else {
          window.location.href = "https://tfwww.jiudou123.com/class/myClass"
        }
      } else {
        window.location.href = "https://www.jiudou123.com/class/myClass"
      }
    },
    toLogin() {
      this.$store.commit("setLoginShow", true)
      this.$store.commit("setRegisterShow", false)
    },
    toRegister() {
      this.$store.commit("setRegisterShow", true)
      this.$store.commit("setLoginShow", false)
    },
    scrollToTarget(type) {
      this.$emit("scrollToTarget", type)
    },
    goMyStudy() {
      this.$router.push("/my-study")
    },
    goHome() {
      window.scrollTo(0, 0)
      this.$router.push("/")
    },
    // eslint-disable-next-line no-unused-vars
    handleSelect(key, keyPath) {
      // console.log(key, keyPath);
    },
    toMyBook() {
      this.$router.push("/my-book")
    },
    toMyDigitalBook() {
      this.$router.push("/my-digitalbook")
    },
    toMyCourse() {
      this.$router.push("/my-course")
    },
    logOut() {
      this.$confirm("您确定要退出登录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store.dispatch("logout").then(() => {})
        })
        .catch(() => {})
    },
    goSearch() {
      this.$store.commit("setKeywords", this.keywords.trim())
      this.$router.push({
        path: "/search",
      })
    },
    goSetting() {
      this.$router.push("/personal")
    },
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    $route(to, from) {
      if (["search"].includes(to.name)) {
        this.isVisible = false
      } else {
        this.isVisible = true
      }
    },
  },
  mounted() {},
}
</script>
<style lang="less" scoped>
.my-menu {
  img {
    width: 16px;
    height: 17px;
  }
  span {
    margin-left: 10px;
  }
}
/deep/.el-menu .el-menu-item:hover {
  outline: 0 !important;
  color: #2e95fb !important;
  background: linear-gradient(270deg, #f2f7fc 0%, #fefefe 100%) !important;
}
/deep/.el-menu .el-menu-item {
  color: #2e95fb !important;
  background: linear-gradient(270deg, #f2f7fc 0%, #fefefe 100%) !important;
}
/deep/.el-menu .el-menu-item.is-active {
  color: #2e95fb !important;
  background: linear-gradient(270deg, #f2f7fc 0%, #fefefe 100%) !important;
}
.el-submenu /deep/.el-submenu__title:hover {
  color: #2e95fb !important;
  background: #fff !important;
}

/deep/.el-menu.el-menu--horizontal {
  border-bottom: none;
}
/deep/.el-menu--horizontal > .el-submenu.is-active .el-submenu__title {
  border-bottom: none;
}

.el-menu-demo {
  /deep/.el-submenu__title {
    height: 70px;
    display: flex;
    align-items: center;
    min-width: 200px;
    background-color: transparent;
  }
}

.jd_header {
  background-color: #fff;
  box-shadow: 0 2px 4px #00000014;

  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .nav-left {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .nav-left-text {
        color: #fff;
        cursor: pointer;
      }
      .nav-left-mid {
        padding-left: 20px;
        flex: 1;
        span {
          margin-left: 70px;
          font-size: 20px;
          &:hover {
            cursor: pointer;
            color: #03d3f2;
          }
        }
      }
      .search-box {
        position: relative;
        border-radius: 30px;
        border: 1px solid #03d3f2;

        .input-with-select {
          width: 320px;
          /deep/.el-input__inner {
            border-radius: 30px;
            border: none;
            width: 264px;
          }
        }
        .el-button {
          position: absolute;
          right: 0;
          border-radius: 30px;
          background: linear-gradient(-45deg, #03d3f2, #0491fd);
          color: #fff;
        }
      }
    }
    .nav-right {
      display: flex;
      align-items: center;
      .nav-study {
        width: 100px;
        color: #333;
        cursor: pointer;
        text-align: center;
      }
    }
  }
}
</style>
