<template>
  <div class="dt-test">
    <!-- <van-popup v-model="show" round position="bottom" :style="{ height: '580px' }">
      <div class="contest-popup">
        <div class="contest-popup-toolBar van-hairline--bottom">
          <div class="text-l">题目列表</div>
          <div class="text-r">
            <div style="width: 10px; height: 10px; border-radius: 50%; background-color: #00a400"></div>
            <span class="answered">已答</span>
            <div style="width: 10px; height: 10px; border-radius: 50%; background-color: #aaa; margin-left: 10px"></div>
            <span class="unAnswer">未答</span>
          </div>
        </div>
        <div class="option-container">
          <div class="contest-popup-danxuan-list">
            <div v-for="(i, index) in question" :key="index" class="list-item">
              <div :class="!i.isUnAnswer ? 'answered-bgc' : ''" class="item">{{ index + 1 }}</div>
            </div>
          </div>
        </div>
        <div class="commit">
          <van-button class="commit-btn" size="large" round>提交</van-button>
        </div>
      </div>
    </van-popup> -->
    <Nav :is-show-right="false" :is-show-time="false" :title="title" @right-click="rightClick"></Nav>
    <div class="dt-test-subjects">
      <div id="main" ref="mainBox" style="height: 290px; width: 100%"></div>
      <div style="text-align: center; font-size: 18px; margin-bottom: 10px">
        本次练习共{{ question.length }}题，答对<span style="color: #49cb10">{{ correct }}</span
        >题，答错<span style="color: red">{{ wrong }}</span
        >题，未判{{ unJudge }}题，未答{{ unAnswer }}题(主观题系统无法判断对错，请自行判定)
      </div>
      <div class="option-container">
        <div class="contest-popup-danxuan-list">
          <div v-for="(i, index) in question" :key="index" class="list-item">
            <div v-if="i.status == 0" class="item">
              {{ index + 1 }}
            </div>
            <div v-if="i.status == 1" class="item unJudge-bgc">
              {{ index + 1 }}
            </div>
            <div v-if="i.status == 2" class="item right-bgc">
              {{ index + 1 }}
            </div>
            <div v-if="i.status == 3" class="item wrong-bgc">
              {{ index + 1 }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer van-hairline--top">
      <!-- <van-button v-if="isErrorBank == 0" class="join-btn" type="primary" size="large" round @click.native="next">下一题</van-button> -->
      <div class="btn-container">
        <!-- class="btn-container" -->
        <van-button class="next-btn" size="large" round @click.native="toAnalyse">答案解析</van-button>
        <van-button class="next-btn" size="large" round @click.native="toAnswer">重新答题</van-button>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */

// import { Dialog } from 'vant'
// import { Toast } from 'vant'
import { queryData } from '@/api/bookTest'
import JaxMath from '@/components/JaxMath'
import Nav from '@/components/Nav'
// import echarts from '@/components/echarts'
import echarts from 'echarts'

// import wx from 'jweixin-1.6.0'
// import { uploadImage } from '@/api/exam'

export default {
  components: {
    Nav,
    JaxMath
  },
  data() {
    return {
      uid: this.$route.query.uid,
      unAnswer: 0,
      unJudge: 0,
      correct: 0,
      wrong: 0,
      subjectUserId: this.$route.query.subjectUserId,
      title: this.$route.query.title,
      showUpload: true,
      show: false, // 提交弹窗
      dtBookId: this.$route.query.dtBookId,
      chapterNodeId: this.$route.query.chapterNodeId,
      pointId: this.$route.query.pointId,
      versionCode: this.$route.query.versionCode,
      question: [],
      unAnswerQuestion: [],
      isShow: -1,
      idx: 0,
      option: {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        color: ['#ccc', '#03aef9', '#49cb10', '#ff3f13'],
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: false,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 0, name: '未答' },
              { value: 0, name: '未判' },
              { value: 0, name: '正确' },
              { value: 0, name: '错误' }
            ]
          }
        ]
      }
    }
  },
  created() {
    this.loadSubjects()
  },
  mounted() {
    // this.init()
  },
  methods: {
    toAnalyse() {
      this.$router.replace({
        path: '/dtAnswer',
        query: {
          dtBookId: this.dtBookId,
          chapterNodeId: this.chapterNodeId,
          pointId: this.pointId,
          versionCode: this.versionCode,
          title: this.title,
          subjectUserId: this.subjectUserId,
          // token: this.token,
          uid: this.uid
        }
      })
    },
    toAnswer() {
      this.$router.replace({
        path: '/dtTest',
        query: {
          dtBookId: this.dtBookId,
          chapterNodeId: this.chapterNodeId,
          pointId: this.pointId,
          versionCode: this.versionCode,
          // token: this.token,
          uid: this.uid
        }
      })
    },
    rightClick() {
      // this.question.forEach(item => {
      //   item.isUnAnswer = false
      //   if (item.tSubject !== 11) {
      //     if (!item.stuAnswer && !item.textAnswer) {
      //       item.isUnAnswer = true
      //     }
      //   }
      //   if (item.tSubject === 11) {
      //     const flag = item.sonSubList.some(i => !i.stuAnswer && !i.textAnswer)
      //     if (flag) {
      //       item.isUnAnswer = true
      //     }
      //   }
      // })
      this.show = true
    },
    init() {
      var chartDom = this.$refs.mainBox
      // eslint-disable-next-line no-undef
      // var myChart = this.$echarts.init(chartDom);
      var myChart = echarts.init(chartDom)
      myChart.setOption(this.option)
    },
    // 加载题目列表
    loadSubjects() {
      const data = {}
      // data.dtbookId = 94
      // data.chapterId = 947
      // data.pointId = '8db025b7-f3f7-d6f1-bd20-9efa1b8ce12f'
      // data.versionCode = 1
      // data.uid = 439829
      data.subjectUserId = this.subjectUserId
      // data.subjectUserId = 218

      queryData(data).then(res => {
        if (res.code === 200) {
          let arr = []
          res.data.totalNumList.forEach(element => {
            if (element.status == 0) {
              this.unAnswer = element.num
              arr.push({
                name: '未答',
                value: element.num
              })
            }
            if (element.status == 1) {
              this.unJudge = element.num
              arr.push({
                name: '未判',
                value: element.num
              })
            }
            if (element.status == 2) {
              this.correct = element.num

              arr.push({
                name: '正确',
                value: element.num
              })
            }
            if (element.status == 3) {
              this.wrong = element.num
              arr.push({
                name: '错误',
                value: element.num
              })
            }
          })
          this.option.series[0].data = arr
          this.init()
          this.question = res.data.bankStatusList
        } else {
          // this.isShow = ret.data.isShow
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dt-test {
  user-select: none;
  -moz-user-select: none; /* Firefox私有属性 */
  -webkit-user-select: none; /* WebKit内核私有属性 */
  -ms-user-select: none; /* IE私有属性(IE10及以后) */
  -khtml-user-select: none; /* Khtml内核私有属性 */
  -o-user-select: none; /* Opera私有属性 */
  // height: 100%;
  width: 100%;
  position: relative;
  background-color: #fff;
  // /deep/ .van-popup--bottom {
  //   padding-top: 30px;
  // }
  // .contest-popup {
  //   .contest-popup-toolBar {
  //     color: #666;
  //     height: 60px;
  //     overflow: hidden;
  //     display: flex;
  //     align-items: center;
  //     justify-content: space-between;
  //     padding: 0 20px;
  //     .text-l {
  //       color: #333;
  //     }

  //     .text-r {
  //       display: flex;
  //       align-items: center;
  //       .answered {
  //       }

  //       .unAnswer {
  //       }
  //     }
  //   }
  //   .option-container {
  //     height: 900px;
  //     overflow-y: scroll;
  //     padding-bottom: 10px;
  //     .contest-popup-danxuan {
  //       height: 60px;
  //       padding: 0 20px;
  //       display: flex;
  //       align-items: center;
  //     }
  //     .contest-popup-danxuan-list {
  //       padding: 0 20px;
  //       width: 100%;
  //       display: flex;
  //       flex-wrap: wrap;
  //       .list-item {
  //         width: 20%;
  //         height: 100px;
  //         margin-bottom: 10px;
  //         display: flex;
  //         justify-content: center;
  //         align-items: center;
  //         .item {
  //           width: 90px;
  //           height: 90px;
  //           border: 1px solid #aaa;
  //           color: #333;
  //           border-radius: 50%;
  //           text-align: center;
  //           line-height: 90px;
  //         }

  //         .answered-bgc {
  //           color: #00a400;
  //           border: 1px solid #00a400;
  //           background: rgba(0, 164, 0, 0.17);
  //         }
  //       }
  //     }
  //   }
  //   .commit {
  //     padding: 0 20px;
  //     .commit-btn {
  //       height: 85px;
  //       background-color: #10c4ee;
  //       color: white;
  //     }
  //   }
  // }
  .dt-test-subjects {
    width: 100%;
    // height: calc(100% - 180px);
    min-height: 1200px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 20px 28px 100px 28px;
    .option-container {
      // max-height: 600px;
      // overflow-y: scroll;
      padding-bottom: 10px;
      .contest-popup-danxuan {
        height: 60px;
        padding: 0 20px;
        display: flex;
        align-items: center;
      }
      .contest-popup-danxuan-list {
        padding: 0 20px;
        width: 100%;
        // background-color: ;
        display: flex;
        // justify-content: space-between;
        flex-wrap: wrap;
        .list-item {
          width: 20%;
          height: 100px;
          margin-bottom: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          .item {
            width: 90px;
            height: 90px;
            border: 1px solid #aaa;
            color: #333;
            border-radius: 50%;
            background: #ccc;
            text-align: center;
            line-height: 90px;
          }

          .answered-bgc {
            color: #00a400;
            border: 1px solid #00a400;
            background: rgba(0, 164, 0, 0.17);
          }
          .right-bgc {
            color: #00a400;
            border: 1px solid #49cb10;
            // background: rgba(0, 164, 0, 0.17);
            background: #49cb10;
          }
          .wrong-bgc {
            color: #fff;
            border: 1px solid #ff3f13;
            background: #ff3f13;
          }
          .unJudge-bgc {
            color: #000;
            border: 1px solid #03aef9;
            background: #03aef9;
          }
        }
      }
    }
  }
  .footer {
    width: 100%;
    position: fixed;
    height: 100px;
    bottom: 0;
    background-color: #fff;
    z-index: 999;
    padding: 0 28px;
    // .join-btn {
    //   height: 90px;
    //   background-color: #2cad69;
    // }
    .btn-container {
      display: flex;
      justify-content: space-between;
      .next-btn {
        width: 49%;
        height: 90px;
        background-color: #10c4ee;
        color: white;
      }
    }
  }
}
</style>
