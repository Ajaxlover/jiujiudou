<template>
  <div class="page-tea-authentication">
    <!-- <Nav isShowRight="true" rightText="下次再说" @go-back="goBack" @right-click="rightClick">
        </Nav> -->
    <div class="content">
      <div class="title">
        <span>教师身份认证</span>
      </div>
      <div class="title-tip">
        <span>信息仅用于教师身份审核</span>
      </div>
      <van-cell-group>
        <van-field v-model="teacherName" placeholder="真实姓名" />
        <van-field v-model.trim="attr.value" :readonly="isDisable" label-class="content-form-text" placeholder="学校名称" error-message="">
          <template #input>
            <smart-input id="service" :code.sync="attr.value" :props="attr" @sync="syncService"></smart-input>
          </template>
        </van-field>
      </van-cell-group>
      <div class="upload-parent" @click="onFileUploadClick" v-show="picFile == null">
        <div class="add-pic"></div>
        <div class="add-pic-desc">上传教师资格证/教职工证明</div>
      </div>
      <div class="teacher-card" v-show="picFile != null" @click="onFileUploadClick">
        <img class="teacher-card-img" ref="teacherCardImg" :src="imageSrc" />
      </div>
      <div class="add-pic-tip">请勿上传身份证、银行卡、个人照片<br /><br />等无法认定教师身份的图片！</div>
      <div class="view"></div>
      <div class="button-commit">
        <van-button type="primary" size="normal" round color="#10c4ee" @click="commitAuth"
          >提交</van-button
        >
      </div>
      <div class="agreement">
        <van-checkbox v-model="checked"></van-checkbox>
        <span
          >将教师资格证/教职工作证提交给九斗客服进行教师身份审核，且代表你已阅读并同意<span class="user-agreement" @click="userAgreement"
            >《用户使用服务协议》</span
          >和<span class="privacy-agreement" @click="privacyAgreement">《隐私政策》</span>
        </span>
      </div>
      <div class="view-footer"></div>
    </div>
  </div>
</template>

<script>
import Nav from '@/components/Nav'
import { Toast } from 'vant'
import smartInput from '@/components/smart-input'
import { uploadTeacherCard } from '@/api/home'
import wx from 'jweixin-1.6.0'

export default {
  components: {
    Nav,
    smartInput
  },
  data() {
    return {
      teacherName: '',
      school: '',
      attr: {
        attrName: '学校：',
        value: ''
      },
      imageSrc: '',
      picFile: null,
      checked: false
    }
  },
  methods: {
    goBack() {
      this.$router.replace({
        path: '/teaAuthenticationPre'
      })
    },
    rightClick() {
      Toast({
        message: '下次再说',
        position: 'middle'
      })
    },
    syncService(data) {
      this.school = data.name
    },
    onFileUploadClick() {
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
              that.imageSrc = localIds
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
    userAgreement() {
      window.location.href = 'https://static.guangyiedu.com/xieyi/JDUserxieyi/index.html'
    },
    privacyAgreement() {
      window.location.href = 'https://static.guangyiedu.com/xieyi/JDxieyi/index.html'
    },
    commitAuth() {
      if (this.teacherName.trim().length === 0) {
        Toast({
          message: '姓名不能为空',
          position: 'middle'
        })
        return
      }
      if (this.school.trim().length === 0) {
        Toast({
          message: '学校不能为空',
          position: 'middle'
        })
        return
      }
      if (this.picFile == null) {
        Toast({
          message: '请上传教师资格证/教职工证明',
          position: 'middle'
        })
        return
      }
      if (this.checked == false) {
        Toast({
          message: '您还未同意\n《用户使用服务协议》\n《隐私政策》',
          position: 'middle'
        })
        return
      }
      uploadTeacherCard({
        teacherName: this.teacherName,
        school: this.school,
        picFile: this.picFile
      })
        .then(res => {
          if (res.code === 200) {
            Toast({
              message: res.msg,
              position: 'middle'
            })
            this.$router.replace('/my')
          }
        })
        .catch(err => {
          console.error(err)
          this.$router.replace('/my')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-tea-authentication {
  height: 100vh;
  background-color: white;

  .content {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 60px 42px 0 42px;

    .title {
      font-size: 42px;
      font-weight: bold;
    }

    .title-tip {
      margin-top: 12px;
      font-size: 26px;
      color: #666666;
    }

    .van-cell-group {
      margin-top: 68px;
      .van-field {
        overflow: visible;
      }
    }

    .teacher-card {
      width: 100%;
      height: 380px;
      margin-top: 32px;
      .teacher-card-img {
        width: 100%;
        height: 100%;
      }
    }

    .upload-parent {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 100%;
      height: 380px;
      border-style: dashed;
      border-width: 2px;
      border-color: #10c4ee;
      border-radius: 14px;
      background-color: rgba(69, 185, 223, 0.2);
      margin-top: 32px;

      .add-pic {
        width: 120px;
        height: 120px;
        text-align: center;
        background-size: 100%;
        background-repeat: no-repeat;
        background-image: url(../../assets/image/add_attestation.png);
      }

      .add-pic-desc {
        color: #45b9df;
        margin-top: 10px;
        margin-top: 24px;
        font-size: 24px;
      }
    }

    .add-pic-tip {
      margin-top: 32px;
      color: #999999;
      text-align: center;
      font-size: 24px;
    }

    .view {
      flex: 1;
    }

    .button-commit {
      height: 100px;
      text-align: center;

      .van-button {
        font-size: 28px;
        width: 600px;
      }
    }

    .agreement {
      display: flex;
      margin-top: 32px;
      font-size: 24px;
      color: #999999;

      .van-checkbox {
        width: 100px;
      }

      .user-agreement {
        color: #45b9df;
        text-decoration: underline;
      }

      .privacy-agreement {
        color: #45b9df;
        text-decoration: underline;
      }
    }

    .view-footer {
      height: 76px;
    }
  }
}
</style>
