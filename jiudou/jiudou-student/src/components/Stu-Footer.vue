<template>
  <div v-show="isShow" class="footer">
    <div class="footer-content">
      <div class="footer-msg">
        <div class="footer-logo">
          <img src="../assets/img/jiudouLogo.png" alt="" />
        </div>
        <span>{{ msg }}</span>
        <p>
          {{ pMsg }}
          <a
            target="_blank"
            style="color: #fff"
            href="https://beian.miit.gov.cn"
            >{{ alink }}</a
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "stu-footer",
  props: {
    // msg: String,
  },
  data() {
    return {
      isShow: false,
      msg: "九斗是专业提升的在线学习平台。",
      pMsg: "Copyright ©湖南三文在线教育科技集团有限公司 版权所有 All rights reserved",
      alink: "湘ICP备19015249号-4",
    };
  },
  mounted() {
    setTimeout(() => {
      this.isShow = true;
    }, 1500);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.footer {
  .footer-content {
    width: 100%;
    height: 280px;
    background-color: #414141;
    display: flex;
    align-items: center;
    .footer-msg {
      width: 1420px;
      margin: 0 auto;
      height: 200px;
      .footer-logo {
        visibility: hidden;
      }
      span {
        color: #ffffff;
        font-family: FZLTXHK--GBK1-0;
        font-size: 18px;
        margin-left: 20px;
      }
      p {
        margin-top: 30px;
        color: #999;
        margin-left: 20px;
      }
    }
  }
}
</style>
