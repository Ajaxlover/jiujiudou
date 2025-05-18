<template>
  <div class="load-container">
    <!-- <img :src="close" class="close-btn" /> -->
    <div class="load-main">
      <img :src="logo" class="logo-img" />
      <div class="title">
        <p>九斗考试系统</p>
        <!-- <p>丰富 · 实时 · 高效 · 智能</p> -->
      </div>
    </div>
    <div class="load-process-box">
      <span>开始启动...</span>
      <span>66%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useCache } from "@/render/hooks/useCache";
// 引入本地图片方法
// import { imgLocalUrl } from '@/render/utils/imgLocalUrl'

const { wsCache } = useCache("localStorage");

onMounted(() => {
  if (!wsCache.get("login")) {
    window.electronAPI.isShowLogin(true);
  } else {
    window.electronAPI.isShowLogin(false);
  }
});
// 引入icon
const logo = new URL("./../../assets/login/logo-login.png", import.meta.url)
  .href;
// const logo=imgLocalUrl('@/assets/load/logo.png')
// const close = imgLocalUrl('@/assets/load/close.png')
// const close = new URL("./../../assets/login/close.png", import.meta.url).href;
</script>

<style lang="scss" scoped>
.load-container {
  width: 480px;
  height: 320px;
  background: #f1f8fe;
  box-shadow: 0px 4px 14px 0px rgba(0, 0, 0, 0.15);
  border-radius: 2px 2px 2px 2px;
  position: relative;

  .close-btn {
    width: 20px;
    height: 20px;
    position: absolute;
    right: 12px;
    top: 12px;
    cursor: pointer;
  }

  .close-btn:hover {
    opacity: 0.8;
  }

  .load-main {
    display: flex;
    align-items: center;
    position: absolute;
    left: 110px;
    top: 98px;

    .logo-img {
      width: 142px;
      height: 60px;
      margin-right: 16px;
      // display: flex;
    }

    .title {
      width: 180px;

      p:nth-child(1) {
        font-size: 16px;
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        // color: #FFFFFF;
      }

      p:nth-child(2) {
        font-size: 15px;
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);
      }
    }
  }

  .load-process-box {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 14px;
    padding: 0 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    span {
      font-size: 14px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #000000;
    }
  }
}
</style>
