<template>
  <div class="side">
    <div class="side-ad">
      <ul>
        <li>
          <div>
            <!-- <i
              style="
                font-size: 30px;
                background-image: url('../assets/img/xiazaiapp.png');
              "
            ></i> -->
            <!-- <img
              style="width: 21px; height: 33px"
              src="../assets/img/xiazaiapp.png"
              alt=""
            /> -->
            <!-- <i style="font-size: 30px;background-image:url('../assets/img/xiazaiapp.png')" class="el-icon-mobile"></i> -->
          </div>
          <div class="app-qr">
            <div>扫码下载</div>
            <div>
              <img src="../assets/img/jiudoudownload.png" alt="" />
            </div>
          </div>
        </li>
        <li>
          <span>
            <!-- <i style="font-size: 30px" class="el-icon-chat-line-square"></i> -->
            <!-- <img
              style="width: 32px; height: 24px"
              src="../assets/img/lianxikefu.png"
              alt=""
            /> -->
          </span>
          <div class="app-qr2">
            <div>客服QQ</div>
            <div>
              <img src="../assets/img/qq-qrcode.png" alt="" />
            </div>
          </div>
        </li>
        <li @click="goTop" v-if="scrollTop > 200">
          <i class="back-top el-icon-upload2"></i>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "stu-side-ad",
  props: {
    // msg: String,
  },
  data() {
    return {
      scrollTop: 0,
      timer: null,
    };
  },
  methods: {
    getHeight() {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      this.scrollTop = scrollTop;
    },
    goTop() {
      // document.documentElement.scrollTop = document.body.scrollTop = 0;
      if (!this.timer) {
        let step = 0;
        this.timer = setInterval(() => {
          if (this.scrollTop <= 0) {
            clearInterval(this.timer);
            this.timer = null;
            return;
          }
          step += 10;
          document.documentElement.scrollTop -= step;
        }, 20);
      }
    },
  },
  mounted() {
    window.addEventListener("scroll", this.getHeight);
  },
  destroyed() {
    window.removeEventListener("scroll", this.getHeight);
    clearInterval(this.timer);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.side {
  .side-ad {
    width: 60px;
    // height: 200px;
    position: fixed;
    top: 65%;
    right: 5px;
    border: 1px solid #ddd;

    border-radius: 10px;
    // transform: translate(0, -50%);
    background-color: #f7f7f8;
    ul {
      // height: 100%;
      position: relative;

      li {
        padding: 12px;
        height: 60px;
        list-style: none;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        border-radius: 10px;
        border-bottom: 1px solid #ddd;
        img {
          // background-color: #10c4ee;
        }
        .back-top {
          font-size: 30px;
        }
        .app-qr {
          font-size: 14px;
          text-align: center;
          position: absolute;
          background: #fff;
          width: 92px;
          top: -20%;
          left: 0;
          z-index: 999;
          display: none;
          border: 1px solid #ddd;
          transform: translate(-100px);
          img {
            width: 90px;
          }
        }
        .app-qr2 {
          font-size: 14px;
          text-align: center;
          position: absolute;
          background: #fff;
          width: 92px;
          top: 20%;
          left: 0;
          z-index: 999;
          display: none;
          border: 1px solid #ddd;
          transform: translate(-100px);
          img {
            width: 90px;
          }
        }
        &:nth-child(1) {
          // background-color: #10c4ee;
          background-image: url("../assets/img/xiazaiapp_b.png");
          background-size: 21px 33px;
          background-repeat: no-repeat;
          background-position: center;
          color: #fff;
          .app-qr {
            color: #2c3e50;
            display: none;
          }
        }
        &:nth-child(1):hover {
          background-color: #10c4ee;
          background-image: url("../assets/img/xiazaiapp.png");
          color: #fff;
          .app-qr {
            color: #2c3e50;
            display: block;
          }
        }
        &:nth-child(2) {
          background-image: url("../assets/img/lianxikefu.png");
          background-size: 32px 24px;
          background-repeat: no-repeat;
          background-position: center;
          color: #fff;
          .app-qr2 {
            color: #2c3e50;
            display: none;
          }
        }
        &:nth-child(2):hover {
          background-color: #10c4ee;
          background-image: url("../assets/img/lianxikefu_w.png");
          color: #fff;
          .app-qr2 {
            color: #2c3e50;
            display: block;
          }
        }
        &:nth-child(3) {
          color: #10c4ee;
        }
        &:nth-child(3):hover {
          background-color: #10c4ee;
          color: #fff;
        }
      }
    }
  }
}
</style>
