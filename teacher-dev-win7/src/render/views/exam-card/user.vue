<template>
  <div class="exam-user">
    <div class="title">考试信息</div>
    <img :src="avatar" class="user-head" />
    <div class="time">
      <!-- 剩余时间 <span class="red">00:00:22</span> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { imgLocalUrl } from "@/render/utils/imgLocalUrl";
const avatar = imgLocalUrl("@/assets/layout/avatar.png");
</script>

<style lang="scss" scoped>
.exam-user {
  width: 352px;
  background: #ffffff;
  border-radius: 5px;
  padding-bottom: 5px;

  .title {
    width: 100%;
    padding: 12px 10px;
    background: #3678ca;
    border-radius: 5px;
    color: #ffffff;
    font-size: 13px;
  }

  .user-head {
    display: block;
    width: 114px;
    height: 114px;
    margin: 20px auto;
  }

  .time {
    text-align: center;
    margin-bottom: 10px;
    font-weight: 700;

    .red {
      color: red;
      font-size: 16px;
    }
  }
}
</style>
