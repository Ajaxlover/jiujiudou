<template>
   <div class="footer-container">
      <span class="solgan">
         九斗考试系统，客户的共同选择
      </span>
      <span class="copyright">
         版权所有 ©2023 湖南三文在线教育科技集团有限公司 保留所有权利
      </span>
   </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

</script>

<style lang="scss" scoped>
.footer-container {
   width: 100vw;
   text-align: center;
   position: absolute;
   bottom: 60px;

   span {
      display: block;
      margin-top: 7px;
      font-weight: 400;
      color: #9e9e9e;
      font-size: 12px;
   }
}
</style>
