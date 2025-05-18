<template>
  <div class="header-container wraper-container-drag">
    <div class="action-box_left wraper-container-no-drag">
      <!-- <img :src="isDark ? homeDark : home" />
      <img :src="isDark ? shuaxinDark : shuaxin" />
      <p class="time">2022/11/1 16:45:32</p> -->
      <img :src="logoUlr" />
      <p class="title">九斗考试系统（教师端）</p>
    </div>
    <div class="action-box_right wraper-container-no-drag">
      <!--     <img :src="isDark?topUtilsDark:topUtils"  class="action-img"/>-->
      <!-- <img :src="isDark ? topVoiceDark : topVoice" class="action-img" />
      <img :src="isDark ? topInfoDark : topInfo" class="action-img" />
      <img :src="isDark ? topThemeDark : topTheme" class="action-img" @click="handleChangeTheme" /> -->
      <div class="user">
        <img :src="userInfo.user.pic || avatar" class="user-head" />
        <span class="name">{{ userInfo.user.username || "教师" }}</span>
        <!-- <el-button type="danger" size="small" @click="startExam">{{
          isLogin ? "开始考试" : "结束考试"
        }}</el-button> -->
        <el-button type="primary" size="small" @click="loginDialogVisible = true">退出</el-button>
      </div>
      <img :src="topMiniDark" class="action-img" @click="handleChangeScreen('miniScreen')" />
      <img :src="topExpandDark" class="action-img" @click="handleChangeScreen('fullScreen')" />
      <img :src="topCloseDark" class="action-img no-margin" @click="centerDialogVisible = true" />

      <!-- <img :src="isDark ? topMiniDark : topMini" class="action-img" @click="handleChangeScreen('miniScreen')" />
      <img :src="isDark ? topExpandDark : topExpand" class="action-img" @click="handleChangeScreen('fullScreen')" />
      <img :src="isDark ? topCloseDark : topClose" class="action-img no-margin" @click="centerDialogVisible = true" /> -->
      <!--     <i-ep-SemiSelect class="mini-icon" @click="handleChangeScreen('miniScreen')"></i-ep-SemiSelect>-->
      <!--     <i-ep-FullScreen class="mini-icon" @click="handleChangeScreen('fullScreen')"></i-ep-FullScreen>-->
      <!--     <i-ep-CloseBold class="mini-icon no-margin" @click="handleChangeScreen('closeScreen')"></i-ep-CloseBold>-->
    </div>
    <el-dialog v-model="centerDialogVisible" title="退出考试" width="30%" align-center>
      <span>您确定要退出考试程序吗？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="closeScreen"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="loginDialogVisible" title="退出登录" width="30%" align-center>
      <span>您确定要退出登录吗？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="loginDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="loginout"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
// 引入本地图片方法
import { imgLocalUrl } from "@/render/utils/imgLocalUrl";
import { useAppStore } from "@/render/store/modules/app";
// const logoUlr = imgLocalUrl('@/assets/login/logo-login.png')
const logoUlr = new URL("./../../assets/login/logo-login.png", import.meta.url)
  .href;

const appStore = useAppStore();

const isDark = computed(() => {
  return appStore.isDark;
});

const userInfo = computed(() => {
  return appStore.user;
});
// 引入icon
const home = imgLocalUrl("@/assets/layout/home.png");
const shuaxin = imgLocalUrl("@/assets/layout/shuaxin.png");
const topClose = imgLocalUrl("@/assets/layout/top-close.png");
const topExpand = imgLocalUrl("@/assets/layout/top-expand.png");
const topMini = imgLocalUrl("@/assets/layout/top-mini.png");
const topVoice = imgLocalUrl("@/assets/layout/top-voice.png");
const topTheme = imgLocalUrl("@/assets/layout/top-theme.png");
// const topUtils=imgLocalUrl('@/assets/layout/top-utils.png')
const topInfo = imgLocalUrl("@/assets/layout/top-info.png");
// const avatar = imgLocalUrl('@/assets/layout/avatar.png')
const avatar = new URL("./../../assets/layout/avatar.png", import.meta.url)
  .href;

const homeDark = imgLocalUrl("@/assets/layout/top-home-dark.png");
const shuaxinDark = imgLocalUrl("@/assets/layout/top-refresh-dark.png");
// const topCloseDark = imgLocalUrl('@/assets/layout/top-close-dark.png')
// const topExpandDark = imgLocalUrl('@/assets/layout/top-expand-dark.png')
// const topMiniDark = imgLocalUrl('@/assets/layout/top-mini-dark.png')
import topCloseDark from './../../assets/layout/top-close-dark.png';
import topExpandDark from './../../assets/layout/top-expand-dark.png';
import topMiniDark from './../../assets/layout/top-mini-dark.png';

// const topCloseDark = new URL('./../../assets/layout/top-close-dark.png', import.meta.url).href
// const topExpandDark = new URL('./../../assets/layout/top-expand-dark.png', import.meta.url).href
// const topMiniDark = new URL('./../../assets/layout/top-mini-dark.png', import.meta.url).href

const topVoiceDark = imgLocalUrl("@/assets/layout/top-voice-dark.png");
const topThemeDark = imgLocalUrl("@/assets/layout/top-theme-dark.png");
// const topUtilsDark=imgLocalUrl('@/assets/layout/top-utils-dark.png')
const topInfoDark = imgLocalUrl("@/assets/layout/top-info-dark.png");

const centerDialogVisible = ref(false);
const closeScreen = () => {
  centerDialogVisible.value = false;
  handleChangeScreen("closeScreen");
};

const handleChangeScreen = (value: string) => {
  window.electronAPI.setScreen(value);
};
const handleChangeTheme = () => {
  appStore.setDark();
};

const loginDialogVisible = ref(false);
const loginout = () => {
  centerDialogVisible.value = false;
  handleChangeScreen("backLogin");
};

const isLogin = ref(true);
const startExam = () => {
  window.electronAPI.openRestPassword(isLogin.value);
  isLogin.value = !isLogin.value;
};
// const user = computed(() => {
//   return appStore.user.stu[0]
// })

</script>

<style lang="scss" scoped>
.header-container {
  width: 100%;
  // height: $topHeaderHeight;
  background: var(--top-header-back-color);
  box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 30px;
  padding-right: 24px;

  .action-box_left {
    display: flex;
    align-items: center;
    padding: 10px 0;

    .mini-icon {
      color: #191919;
      font-size: 16px;
      margin-right: 28px;
      cursor: pointer;
    }

    img {
      width: 142px;
      height: 60px;
      display: block;
      margin-right: 15px;
      cursor: pointer;
    }

    img:hover {
      opacity: 0.6;
    }

    .time {
      font-size: 16px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: var(--top-header-time-color);
    }

    .title {
      font-size: 16px;
      font-weight: 800;
    }
  }

  .action-box_right {
    display: flex;
    align-items: center;

    //.mini-icon{
    //  color: #191919;
    //  font-size: 16px;
    //  margin-right:30px;
    //  cursor: pointer;
    //}
    .action-img {
      width: 20px;
      height: 20px;
      display: block;
      margin-right: 30px;
      cursor: pointer;
    }

    .action-img:hover {
      opacity: 0.6;
    }

    .no-margin {
      margin-right: 0;
    }

    .user {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 50px;
      cursor: pointer;

      .user-head {
        width: 30px;
        height: 30px;
        margin-right: 7px;
      }

      .name {
        display: inline-block;
        margin-right: 7px;
      }
    }
  }
}
</style>
