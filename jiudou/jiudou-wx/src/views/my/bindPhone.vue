<template>
  <div class="page-bind-phone">
    <div class="content">
      <div class="title">
        <span>登录</span>
      </div>
      <div class="form">
        <van-cell-group>
          <van-field v-model="phoneNumber" type="digit" clearable placeholder="手机号" />
          <van-field v-model="smsCode" type="digit" clearable placeholder="验证码">
            <template #button>
              <span ref="sendSms" class="send-sms" @click="sendSms"> {{ sendSmsButtonStatus }} </span>
            </template>
          </van-field>
          <!-- <van-field v-model="password" type="password" clearable placeholder="设置密码，要求8-15位"></van-field>
          <div class="password-tip">
            <span>* 密码长度8-15位，包含数字、大小写字母、特殊字符两种。</span>
          </div> -->
        </van-cell-group>
      </div>
      <div class="button-commit">
        <van-button type="primary" size="normal" round color="#10c4ee" @click="comfirmSave">登录</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { isMobile } from '@/utils/validate'
import { getBindPhoneSmsCodePre, getBindPhoneSmsCode, thirdBindPhone } from '@/api/home'
import authUtils from '@/utils/auth.js'
import md5 from 'js-md5'
import store from '../../store'

export default {
  data() {
    return {
      phoneNumber: '',
      smsCode: '',
      password: '',
      sendSmsButtonStatus: '获取验证码',
      sendSmsIng: false
    }
  },
  methods: {
    comfirmSave() {
      if (this.phoneNumber.trim().length === 0) {
        Toast({
          message: '手机号不能为空',
          position: 'middle'
        })
        return
      }
      if (this.smsCode.trim().length === 0) {
        Toast({
          message: '验证码不能为空',
          position: 'middle'
        })
        return
      }
      // if (this.password.trim().length === 0) {
      //   Toast({
      //     message: '密码不能为空',
      //     position: 'middle'
      //   })
      //   return
      // }
      if (!isMobile(this.phoneNumber)) {
        Toast({
          message: '请填写有效的手机号',
          position: 'middle'
        })
        return
      }
      // if (
      //   this.password.trim().length < 8 ||
      //   Validate.isDigits(this.password) ||
      //   Validate.isLetter(this.password) ||
      //   Validate.isCharacter(this.password)
      // ) {
      //   this.password = ''
      //   Toast({
      //     message: '密码长度8-15位，包含数字、大小写字母、特殊字符两种',
      //     position: 'middle'
      //   })
      //   return
      // }
      const user = authUtils.getUserInfo()
      const userObject = JSON.parse(user)
      thirdBindPhone({
        code: this.smsCode,
        mobile: this.phoneNumber,
        openid: userObject.openid,
        appid: userObject.appid,
        nickname: userObject.nickname,
        avatar: userObject.headImgUrl,
        // password: this.password,
        unionId: userObject.unionId
      })
        .then(res => {
          if (res.code == 200) {
            Toast({
              message: '登录成功',
              position: 'middle'
            })
            res.data.teaVerifyStatus = userObject.teaVerifyStatus
            authUtils.updatedUserInfo(res.data)
            store.dispatch('user/setToken', res.data.token)
            store.dispatch('user/setUserInfo', res.data)
            store.dispatch('user/setUserId', res.data.uid)
            this.$router.replace('/')
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    sendSms() {
      if (this.sendSmsIng) {
        return
      }
      if (this.phoneNumber.trim().length === 0) {
        Toast({
          message: '手机号不能为空',
          position: 'middle'
        })
        return
      }
      if (!isMobile(this.phoneNumber)) {
        Toast({
          message: '请填写有效的手机号',
          position: 'middle'
        })
        return
      }
      getBindPhoneSmsCodePre()
        .then(res => {
          if (res.code === 200) {
            const message = res.data
            const user = authUtils.getUserInfo()
            const userObject = JSON.parse(user)
            const encryptedMessage = md5(message.substring(4, 22))
            getBindPhoneSmsCode({
              type: '0', //0是微信
              mobile: this.phoneNumber,
              preMsg: message,
              smsCode: encryptedMessage,
              openId: userObject.openid
            })
              .then(res => {
                if (res.code == 200) {
                  this.startCountDown()
                }
              })
              .catch(err => {
                console.error(err)
              })
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    startCountDown() {
      let seconds = 60 // 初始倒计时秒数
      // 更新发送按钮文字内容的函数
      const updateSendButtonText = () => {
        if (seconds <= 0) {
          this.sendSmsIng = false
          clearInterval(intervalId) // 倒计时结束时清除计时器
          this.sendSmsButtonStatus = '获取验证码' // 恢复发送按钮文字
        } else {
          this.sendSmsIng = true
          this.sendSmsButtonStatus = `${seconds}s` // 更新发送按钮文字
          seconds-- // 每秒减一
        }
      }
      // 初始调用一次更新函数，避免延迟一秒才显示倒计时
      updateSendButtonText()
      // 每秒调用一次更新函数，实现倒计时效果
      const intervalId = setInterval(updateSendButtonText, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.page-bind-phone {
  width: 100%;
  height: 100vh;
  background-color: white;
  overflow: auto;
  -webkit-overflow-scrolling: touch;

  .content {
    padding: 60px 42px 0 42px;
    .title {
      font-size: 42px;
      font-weight: bold;
    }

    .form {
      margin-top: 60px;

      .send-sms {
        font-size: 26px;
      }
    }

    .password-tip {
      font-size: 20px;
      color: #c0c4cc;
      margin-top: 24px;
      margin-left: 24px;
      padding-bottom: 24px;
    }

    .button-commit {
      margin-top: 200px;
      text-align: center;

      .van-button {
        font-size: 28px;
        width: 600px;
      }
    }
  }
}
</style>
