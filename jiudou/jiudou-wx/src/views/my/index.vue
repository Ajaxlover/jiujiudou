<template>
  <div class="page-home">
    <div class="content">
      <!-- <div class="save-parent"><span class="save" @click="changeUserInfo">保存</span></div> -->
      <van-cell-group>
        <van-field v-model="number" label="头像" input-align="right" @click="selectPic">
          <template #input> <img :src="picUrl" class="picHead" /> </template
        ></van-field>
        <van-field v-model="nikeName" label="昵称" :placeholder="defaultHintText" input-align="right" />
        <van-field v-model="school" label="学校/机构" :placeholder="defaultHintText" input-align="right" />
        <van-field v-model="number" label="学号/工号" :placeholder="defaultHintText" input-align="right" />
        <van-field v-model="realName" label="姓名" :placeholder="defaultHintText" input-align="right" />
        <van-field v-model="email" label="邮箱" :placeholder="defaultHintText" input-align="right" />
        <van-field label="手机号" type="digit" input-align="right"
          ><template #input>
            <span> {{ phoneNumber }}</span>
          </template></van-field
        >
        <van-field v-show="showVerifyStatus" label="教师认证" input-align="right" @click="toVerify">
          <template #input>
            <span> {{ verifyStatus }}</span>
          </template></van-field
        >
      </van-cell-group>
      <div class="btn">
        <div><span class="btn-updated" @click="changeUserInfo">保存修改</span></div>
        <div style="margin-top: 42px"><span class="btn-logout" @click="logout">退出账号</span></div>
      </div>
    </div>
  </div>
</template>

<script>
import { changeUserInfo, queryTeacherVerifyStatus, unRegister } from '@/api/home'
import authUtils from '@/utils/auth.js'
import wx from 'jweixin-1.6.0'
import { Toast } from 'vant'
import store from '@/store'
import router from '@/router'
import { isEmail } from '@/utils/validate'

export default {
  name: 'My',
  data() {
    return {
      defaultHintText: '未设置',
      picUrl: '',
      nikeName: '',
      school: '',
      number: '',
      realName: '',
      email: '',
      phoneNumber: '',
      picFile: null,
      verifyStatus: '',
      showVerifyStatus: 'false',
      teaVerifyStatus: ''
    }
  },
  computed: {},
  created() {},
  mounted() {
    Toast.setDefaultOptions({ duration: 1000 })
    this.getUserInfo()
    this.queryTeacherVerifyStatus()
  },
  methods: {
    getUserInfo() {
      const user = authUtils.getUserInfo()
      const userObject = JSON.parse(user)
      this.nikeName = userObject.username
      this.school = userObject.school
      this.number = userObject.number
      this.realName = userObject.realName
      this.email = userObject.email
      let tempPhoneNumber = userObject.mobile
      this.phoneNumber = tempPhoneNumber.replace(tempPhoneNumber.substring(3, 7), '****')
      this.picUrl = userObject.pic
      this.teaVerifyStatus = userObject.teaVerifyStatus
      this.handleteaVerifyStatus()
    },
    handleteaVerifyStatus() {
      if (this.teaVerifyStatus == -1) {
        this.showVerifyStatus = true
        this.verifyStatus = '未认证'
      } else if (this.teaVerifyStatus == 0) {
        this.showVerifyStatus = true
        this.verifyStatus = '审核中'
      } else if (this.teaVerifyStatus == 1) {
        this.verifyStatus = '已认证'
      } else if (this.teaVerifyStatus == 2) {
        this.showVerifyStatus = true
        this.verifyStatus = '未通过'
      }
    },
    queryTeacherVerifyStatus() {
      queryTeacherVerifyStatus()
        .then(res => {
          if (res.code === 200) {
            this.teaVerifyStatus = res.data.teaVerifyStatus
            this.handleteaVerifyStatus()
            const user = authUtils.getUserInfo()
            const userObject = JSON.parse(user)
            userObject.teaVerifyStatus = this.teaVerifyStatus
            authUtils.updatedUserInfo(userObject)
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    selectPic() {
      const that = this
      wx.ready(() => {
        setTimeout(() => {
          // eslint-disable-next-line no-undef
          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['camera', 'album'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
              const localIds = res.localIds // 返回选定照片的本地 ID 列表，localId可以作为 img 标签的 src 属性显示图片
              that.picUrl = localIds
              wx.getLocalImgData({
                localId: localIds[0], // 图片的localID
                success: function (res) {
                  let base64Data = ''
                  if (res.localData.indexOf(';base64,') === -1) {
                    // 兼容处理，安卓获取的图片base64码没有前缀，而苹果有,base64前缀并不固定
                    base64Data = 'data:image/jpeg;base64,' + res.localData
                  }
                  if (res.localData.indexOf('data:image/jpg;base64,') !== -1) {
                    // 兼容处理，若是苹果手机，将前缀中的jgp替换成jpeg
                    base64Data = res.localData.replace('data:image/jpg;base64,', 'data:image/jpeg;base64,')
                  }
                  that.picFile = that.$base64toFile(base64Data)
                }
              })
            }
          })
        }, 200)
      })
    },
    changeUserInfo() {
      if (this.email && this.email.length != 0) {
        if (!isEmail(this.email)) {
          Toast({
            message: '请填写正确的邮箱地址',
            position: 'middle'
          })
          return
        }
      }
      const fd = new FormData()
      fd.append('username', this.nikeName)
      if (this.number && this.number.length != 0) {
        fd.append('number', this.number)
      }
      if (this.email && this.email.length != 0) {
        fd.append('email', this.email)
      }
      fd.append('realName', this.realName)
      fd.append('school', this.school)
      if (this.picFile != null) {
        fd.append('file', this.picFile)
      }
      changeUserInfo(fd)
        .then(res => {
          if (res.code === 200) {
            this.picUrl = res.data.pic
            const user = authUtils.getUserInfo()
            const userObject = JSON.parse(user)
            userObject.pic = res.data.pic
            userObject.username = res.data.username
            userObject.school = res.data.school
            userObject.number = res.data.number
            userObject.realName = res.data.realName
            userObject.email = res.data.email
            userObject.mobile = res.data.mobile
            authUtils.updatedUserInfo(userObject)
            Toast({
              message: '修改成功',
              position: 'middle'
            })
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    logout() {
      const user = authUtils.getUserInfo()
      const userObject = JSON.parse(user)
      const fd = new FormData()
      fd.append('openid', userObject.openid)
      unRegister(fd)
        .then(res => {
          if (res.code === 200) {
            Toast({
              message: '退出成功',
              position: 'middle'
            })
            store.dispatch('user/logout').then(() => {
              router.replace({
                path: '/bindPhone'
              })
            })
          }
        })
        .catch(err => {
          Toast({
            message: '退出失败，请重试',
            position: 'middle'
          })
        })
    },
    toVerify() {
      if (this.teaVerifyStatus == 0) {
        Toast({
          message: '审核中',
          position: 'middle'
        })
      } else if (this.teaVerifyStatus == 1) {
        Toast({
          message: '已认证',
          position: 'middle'
        })
      } else {
        this.$router.push('/teaAuthenticationPre')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-home {
  height: 100vh;
  width: 100%;
  background-color: #fff;
  .content {
    .save-parent {
      text-align: right;
      padding: 24px 24px 24px 0;
    }
    .picHead {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      object-fit: cover;
    }
    .btn {
      margin-top: 120px;
      text-align: center;
      .btn-updated {
        color: white;
        font-size: 28px;
        text-align: center;
        padding: 16px 68px;
        background-color: #10c4ee;
        border-radius: 8px;
      }
      .btn-logout {
        text-align: center;
        font-size: 28px;
        padding: 16px 68px;
        color: #bd3124;
        background-color: #eceff4;
        border-radius: 8px;
      }
    }
  }
}
</style>
