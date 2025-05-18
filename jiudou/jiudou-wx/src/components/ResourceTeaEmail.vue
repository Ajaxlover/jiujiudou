<template>
  <van-overlay :show="show" @click="show = false">
    <div class="wrapper" @click.stop>
      <div class="box">
        <div class="title-box">
          <van-button icon="cross" class="cancel" @click="show = false"></van-button>
          <span>资源将发送至</span>
        </div>
        <van-cell-group class="content-box" :border="false">
          <van-field v-model="email" class="email" label="邮箱:" label-width="40px" placeholder="请输入邮箱地址"></van-field>
          <van-cell>
            <van-checkbox v-model="save" icon-size="18px" checked-color="#10c4ee">保存邮箱地址至个人信息</van-checkbox>
          </van-cell>
        </van-cell-group>
        <div class="bottom-box">
          <van-button class="submit" size="large" round :disabled="email.length == 0" @click="buttonHandler">提交</van-button>
        </div>
      </div>
    </div>
  </van-overlay>
</template>

<script>
import { Toast } from 'vant'
import authUtils from '@/utils/auth.js'

export default {
  name: 'ResourceTeaEmail',
  // model: {
  //   prop: 'resourceTeaEmailShow',		// 指定 v-model 要绑定的参数叫什么名字，来自于 props 中定义的参数
  //   event: 'change'	// 指定要触发的事件名字，将被用于 $emit
  // },
  props: {
    bookId: {
      type: String,
      default: ''
    },
    resourceTeaEmailShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      email: '',
      save: false
    }
  },
  computed: {
    show: {
      get() {
        return this.resourceTeaEmailShow
      },
      set(val) {
        this.$emit('update:resourceTeaEmailShow', val)
        const user = authUtils.getUserInfo()
        const userInfo = JSON.parse(user)
        if (this.email === '' && userInfo) {
          this.email = userInfo.email
        }
        // console.log('show' + val)
        // this.$emit('change', val)	// 触发 v-model
        // this.$emit('this.resourceTeaEmailShow', val)
      }
    }
  },
  created() {
    const user = authUtils.getUserInfo()
    const userInfo = JSON.parse(user)
    if (this.email === '' && userInfo) {
      this.email = userInfo.email
    }
  },
  methods: {
    // cancelHandler() {
    //   this.show = false
    //   this.$emit('cancel')
    //   this.$destroy()
    // },
    buttonHandler() {
      const regExp = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/
      if (regExp.test(this.email)) {
        // if (this.save) {
        //   console.log('邮箱地址：' + this.email)
        // }
        // console.log('邮箱地址：' + this.email)
        this.$emit('sendEmail', this.save ? '1' : '0', this.email) // 触发 v-model
        if (this.save) {
          // 更新本地用户信息
          const user = authUtils.getUserInfo()
          const userInfo = JSON.parse(user)
          userInfo.email = this.email
          authUtils.updatedUserInfo(userInfo)
          this.show = false
        }
        this.show = false
      } else {
        Toast({
          message: '请输入有效邮箱地址',
          position: 'middle'
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  .box {
    position: fixed;
    right: 0px;
    bottom: 0px;
    height: 500px;
    width: 100%;
    background: #fff;
    .title-box {
      display: flex;
      .cancel {
        border: none;
      }
      > span {
        flex: 1;
        text-align: center;
        height: 46px;
        padding: 26px 46px 10px 0;
      }
    }
    .content-box {
      margin: 40px 80px;
      .email {
        padding: 10px 0;
        border-bottom: 1px solid #ebedf0;
        font-size: 30px;
      }
      .save {
        padding: 10px 0;
        font-size: 20px;
      }
      .van-cell__title {
        flex: 0;
      }
      .van-radio-group {
        padding-top: 5px;
        left: -10px;
        position: relative;
      }
      .van-cell__value {
        text-align: left;
        margin-left: 10px;
      }
      /deep/ .van-cell {
        padding: 20px 20px;
      }
      /deep/ .van-checkbox__label {
        color: #999;
      }
    }
    .bottom-box {
      margin: 50px 100px 100px 100px;
      .submit {
        background: #10c4ee;
        color: #fff;
        font-size: 24px;
        height: 70px;
      }
    }
  }
}
</style>
