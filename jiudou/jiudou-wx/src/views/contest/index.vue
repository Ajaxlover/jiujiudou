<template>
  <div class="page-reward">
    <div class="reward">
      <div class="reward-content">
        <div class="reward-logo">
          <img src="../../assets/image/reward_logo.png" alt="" />
        </div>
        <div class="reward-content-box">
          <div class="reward-input">
            <div class="reward-input-item">
              <van-field v-model.trim="code" label-class="content-form-text" label-width="90" label="" placeholder="请输入领奖验证码" />
              <van-button
                class="join-btn"
                :disabled="code.length == 0"
                type="primary"
                size="large"
                :loading="loading"
                loading-text="领取中..."
                round
                @click="submitInfo"
                >确认</van-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getContestReward } from '@/api/credential'
import authUtils from '@/utils/auth.js'
import { Toast } from 'vant'

export default {
  name: 'Reward',
  data() {
    return {
      code: '',
      loading: false
    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    submitInfo() {
      // this.loading = true
      const openId = authUtils.getOpenId()
      getContestReward({
        openId,
        code: this.code
      })
        .then(res => {
          // this.loading = false
          if (res.code === 200) {
            Toast({
              message: '领取奖金成功',
              position: 'middle'
            })
            this.code = ''
          }
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-reward {
  // position: relative;
  height: 100%;
  width: 100%;
  .reward {
    height: 100vh;
    width: 100%;
    background: url('../../assets/image/reward_bg.png');
    position: relative;
    // background-size: cover;
    .reward-content {
      position: absolute;
      top: 200px;
      .reward-logo {
        padding: 0 100px;
        margin-bottom: -100px;
        img {
          width: 100%;
        }
      }

      .reward-content-box {
        height: 600px;
        padding: 0 40px;
        .reward-input {
          height: 100%;
          background-color: #fff;
          border-radius: 20px;
          padding-top: 160px;
          padding-bottom: 160px;
          .reward-input-item {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
            padding: 0 50px;
            .van-cell {
              background-color: #f2f2f2;
              border-radius: 50px;
              color: #999;
            }
            .join-btn {
              background: linear-gradient(-45deg, #0491fd, #03d3f2);
              border: none;
            }
          }
        }
      }
    }
  }
}
</style>
