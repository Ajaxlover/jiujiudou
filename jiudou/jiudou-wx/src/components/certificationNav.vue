/* eslint-disable vue/html-self-closing */
<template>
  <div class="cer-nav">
    <div class="top-nav">
      <div class="logo-l">
        <img src="../assets/image/gyicon.png" alt="" />
        <div style="display: flex; flex-direction: column">
          <span>九斗App</span>
          <span>让教学更简单</span>
        </div>
      </div>
      <div class="logo-r">
        <!-- <img src="../assets/image/cloud.png" alt="" />
        <span>下载九斗App</span> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LogoNav',
  props: {},
  data() {
    return {
      textColor: '#323232'
    }
  },
  computed: {},
  methods: {
    toDownload() {
      window.location.href = 'http://www.guangyiedu.com/app'
    }
  }
}
</script>

<style lang="scss" scoped>
.cer-nav {
  // position: relative;
  width: 100%;
  .top-nav {
    // position: fixed;
    height: 100px;
    // background-color: #3f9fc9;
    background: linear-gradient(to right, #10c4e1, #03d3f2);
    // top: 0;
    padding: 10px;
    .logo-l {
      float: left;
      display: flex;
      align-items: center;
      img {
        width: 90px;
      }
      span {
        color: #fff;
      }
    }
    .logo-r {
      float: right;
      display: flex;
      flex-direction: column;
      align-items: center;
      img {
        width: 60px;
      }
      span {
        font-size: 18px;
        color: #fff;
        margin-top: 10px;
      }
    }
  }
}
</style>
