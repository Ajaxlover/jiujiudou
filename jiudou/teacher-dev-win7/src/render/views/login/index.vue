<template>
  <div class="login-container wraper-container-no-drag">
    <div class="nav">
      <div class="logo">
        <img :src="logoUlr" />
      </div>
      <div class="title-box">
        <p>九斗考试系统</p>
        <p>更智能的考试体验</p>
      </div>
    </div>
    <!-- <div class="logo-box">
      <div class="logo">
        <img :src="logoUlr" />
      </div>
      <div class="title-box">
        <p>新闻信息终端</p>
        <p>丰富 · 实时 · 高效 · 智能</p>
      </div>
    </div> -->
    <div class="login-wrapper">

      <div class="login-method">
        <div class="login-method_left">
          <LoginPassword v-if="currentIndex === 0" />
          <LoginMessage v-if="currentIndex === 1" />
        </div>
        <!-- <div class="divide"></div>
      <div class="login-method_right">
        <p class="method-title">切换登录方式</p>
          <div class="action-box">
            <div :class="[index===currentIndex?'action-item-active':'','action-item']" v-for="(item,index) in actionList" :key="index" @click="handleChangeMethod(index)">
                <img :src="item.icon">
              <div class="action-item_right">
                <p>{{item.title}}</p>
                <p v-if="item.subTitle">{{item.subTitle}}</p>
              </div>
            </div>
          </div>
      </div> -->
      </div>
      <div class="close-icon-box" @click="closeSystem">
        <img :src="closeIcon" />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

// 组件引入
import LoginPassword from './login-password.vue'
import LoginMessage from './login-message.vue'
// import {useCache} from '@/render/hooks/useCache'
// const {wsCache}=useCache('localStorage')
// const count = ref('登录界面')
// const showDark=ref(false)

// 引入本地图片方法
import { imgLocalUrl } from '@/render/utils/imgLocalUrl'

// 引入logo
// const logoUlr = imgLocalUrl('@/assets/login/logo-login.png')
const logoUlr = new URL('./../../assets/login/logo-login.png', import.meta.url).href

// 引入关闭icon
// const closeIcon = imgLocalUrl('@/assets/layout/top-close-dark.png')
const closeIcon = new URL('./../../assets/layout/top-close-dark.png', import.meta.url).href

// 登录操作栏
const actionList = reactive([
  { title: '密码登录', icon: imgLocalUrl('@/assets/login/diannao_1@2x.png') },
  { title: '短信登录', icon: imgLocalUrl('@/assets/login/duanxin@2x.png') },
  { title: '服务QQ', subTitle: '9209987687', icon: imgLocalUrl('@/assets/login/_fuwu@2x.png') },
  { title: '申请注册用户', icon: imgLocalUrl('@/assets/login/zhuce@2x.png') },
])
const currentIndex = ref<Number>(0)
// 切换登录方式
const handleChangeMethod = (index: Number) => {
  if (index === 2) {
    return;
  }
  if (index === 3) {
    window.electronAPI.openRegister()
    return;
  }
  currentIndex.value = index
}
const closeSystem = () => {
  window.electronAPI.setClose('closeScreen')
}
// const handleToLogin=()=>{
//   wsCache.set('login',true,{exp : 100})
//   window.electronAPI.setLogin('登陆成功')
// }
// const handleChange=(e:boolean)=>{
//   if(e){
//     document.body.className = 'dark';
//     // document.documentElement.style.setProperty('--dark-bg-color','red')
//   }else{
//     document.body.className = '';
//     // document.documentElement.style.setProperty('--dark-bg-color','red')
//   }
// }
</script>

<style lang="scss" scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  // background-color: #f1f8fe;
  // background: #F44311;
  box-shadow: 0px 4px 14px 0px rgba(0, 0, 0, 0.3);
  border-radius: 6px 6px 6px 6px;

  // padding-left: 77px;
  // padding-top: 60px;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;


  .logo-box,
  .nav {
    display: flex;
    align-items: center;

    .logo {
      // width: 64px;
      // height: 64px;
      width: 142px;
      height: 60px;
      margin-right: 16px;

      img {
        width: 142px;
        height: 60px;
        display: block;
        margin-top: 5px;
      }
    }

    .title-box {
      p:nth-child(1) {
        font-size: 30px;
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #000000;
        // margin-bottom: 3px;
      }

      p:nth-child(2) {
        font-size: 15px;
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(25, 24, 24, 0.9);
      }
    }
  }

  .nav {
    display: flex;
    height: 100%;
    align-items: flex-start;
    padding: 50px 150px 0 50px;
    background: url("./../../assets/login/login-bg.png") no-repeat;
    background-size: 100% 100%;
  }

  .login-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background-color: #FFFFFF;
  }

  .login-method {
    display: flex;
    //align-items: center;
    // margin-top: 54px;
    padding: 0 80px;

    .login-method_left {}

    .divide {
      width: 1px;
      height: 248px;
      background: rgba(255, 255, 255, 0.5);
      margin-left: 57px;
      margin-right: 52px;
    }

    .login-method_right {
      position: relative;

      .method-title {
        font-size: 14px;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        position: absolute;
        top: -43px;
        left: 9px;
      }

      .action-box {
        height: 248px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .action-item {
          width: 130px;
          height: 48px;
          border-radius: 2px 2px 2px 2px;
          border: 1px solid #FF5656;
          display: flex;
          align-items: center;
          padding-left: 10px;
          cursor: pointer;

          img {
            width: 16px;
            height: 16px;
            display: block;
            margin-right: 7px;
          }

          .action-item_right {
            p {
              font-size: 14px;
              font-family: PingFang SC-Regular, PingFang SC;
              font-weight: 400;
              color: #FFFFFF;
              line-height: 22px;
            }

            p:nth-child(2) {
              font-size: 11px;
            }
          }

        }

        .action-item:hover {
          opacity: .8;
        }

        .action-item-active {
          background: #D83025;
        }
      }
    }
  }

  .close-icon-box {
    width: 20px;
    height: 20px;
    position: absolute;
    z-index: 10;
    right: 14px;
    top: 13px;
    cursor: pointer;

    img {
      width: 20px;
      height: 20px;
    }
  }

  .close-icon-box:hover {
    opacity: .8;
  }
}
</style>
