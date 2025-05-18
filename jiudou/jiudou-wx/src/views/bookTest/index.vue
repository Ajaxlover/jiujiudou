<template>
  <div class="dt-test">
    <van-popup v-model="show" round position="bottom" :style="{ height: '600px' }">
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
          <!-- <div v-if="question.length > 0" class="contest-popup-danxuan">判断题</div> -->
          <div class="contest-popup-danxuan-list">
            <div v-for="(i, index) in question" :key="index" class="list-item">
              <div :class="!i.isUnAnswer ? 'answered-bgc' : ''" class="item" @click="changIdx(i)">{{ i.num }}</div>
            </div>
          </div>
        </div>
        <div class="commit">
          <van-button :loading="loading" loading-text="提交中..." class="commit-btn" size="large" round @click="submitPaper">提交</van-button>
        </div>
      </div>
    </van-popup>
    <Nav :is-show-right="true" :is-show-time="false" :title="title" @right-click="rightClick"></Nav>
    <div class="dt-test-subjects">
      <!-- <v-touch class="touch-wrap" @swipeleft="next" @swiperight="pre"> -->
      <div v-for="(item, index) in question" v-show="index === idx" :key="index" class="subject-item">
        <div class="subject-type">
          <span>第{{ index + 1 }}题</span>
          <span>丨</span>
          <span v-if="item.tSubject == 3" class="subject-type-item">多选题</span>
          <span v-if="item.tSubject == 2" class="subject-type-item">单选题</span>
          <span v-if="item.tSubject == 1" class="subject-type-item">判断题</span>
          <span v-if="item.tSubject == 5" class="subject-type-item">问答题</span>
          <span v-if="item.tSubject == 4" class="subject-type-item">填空题</span>
          <span v-if="item.tSubject == 11" class="subject-type-item">组合题</span>
        </div>
        <div class="subject-title">
          <JaxMath :data="item.title"></JaxMath>
        </div>
        <div v-if="item.tSubject === 5 || item.tSubject === 4" class="subject-options">
          <div class="zg">
            <div v-if="showUpload" class="jc-pic">
              <!-- :disabled="item.stuAnswer && item.stuAnswer.length > 0" -->
              <van-field v-model.trim="item.textAnswer" rows="4" label="" type="textarea" placeholder="请填写答案" @input="onTextAnswer" />
              <!-- <van-uploader disabled @click-upload="jjj"></van-uploader> -->
              <div class="jc-pic-upload">
                <img v-if="item.stuAnswer" :src="item.stuAnswer" class="avatar" @click.native="previewImg(item.stuAnswer)" />
                <van-icon v-else name="plus" size="2rem" @click="toUploadAnswer" />
                <van-icon v-show="item.stuAnswer" name="cross" class="avatar-close-icon" size="1.5rem" @click="removePic" />
              </div>
            </div>
          </div>
          <!-- <div class="upload-icon-pic" @click="handleUpload(item)"></div>
          <div v-if="item.stuAnswer" class="upload-icon-img">
            <img :src="item.stuAnswer" alt="" />
          </div> -->
        </div>
        <div v-if="item.tSubject === 11" class="subject-options">
          <div class="zh">
            <div v-for="(a, b) in item.sonSubList" :key="b">
              <div class="son-subject-title">
                {{ b + 1 }}、<span v-if="a.tSubject == 3">(多选题)</span><span v-if="a.tSubject == 2">(单选题)</span
                ><span v-if="a.tSubject == 1">(判断题)</span><span v-if="a.tSubject == 5">(问答题)</span><span v-if="a.tSubject == 4">(填空题)</span>
                <JaxMath :data="a.title"></JaxMath>
              </div>
              <div v-if="a.tSubject === 5 || a.tSubject === 4" class="subject-options">
                <div class="zg">
                  <div v-if="showUpload" class="jc-pic">
                    <!-- :disabled="a.stuAnswer && a.stuAnswer.length > 0" -->
                    <van-field v-model.trim="a.textAnswer" rows="4" label="" type="textarea" placeholder="请填写答案" @input="onSonTextAnswer" />
                    <div class="jc-pic-upload">
                      <img v-if="a.stuAnswer" :src="a.stuAnswer" class="avatar" @click.native="previewImg(a.stuAnswer)" />
                      <van-icon v-else name="plus" size="2rem" @click="toUploadSonAnswer(b)" />
                      <van-icon v-show="a.stuAnswer" name="cross" class="avatar-close-icon" size="1.5rem" @click="removeSonPic(b)" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="son-subject-options">
                <div v-for="(e, f) in a.answerList" :key="f" class="option-item" @click="handleSonClick(e, f, b)">
                  <span :class="e.checked ? 'hasCheck' : 'unCheck'"></span>
                  {{ e.aOption }}.<JaxMath :data="e.aText"></JaxMath>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- :class="i.checked ? 'bgc' : ''" -->
        <div class="subject-options">
          <div v-for="(i, j) in item.answerList" :key="j" class="option-item" @click="handleClick(i, j)">
            <span :class="i.checked ? 'hasCheck' : 'unCheck'"></span>
            {{ i.aOption }}.<JaxMath :data="i.aText"></JaxMath>
          </div>
        </div>
      </div>
      <!-- </v-touch> -->
    </div>
    <div class="footer van-hairline--top">
      <!-- <van-button v-if="isErrorBank == 0" class="join-btn" type="primary" size="large" round @click.native="next">下一题</van-button> -->
      <div class="btn-container">
        <!-- class="btn-container" -->
        <van-button class="next-btn" size="large" round @click.native="pre">上一题</van-button>
        <van-button class="next-btn" size="large" round @click.native="next">{{ idx === question.length - 1 ? '去提交' : '下一题' }}</van-button>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */

import { Dialog } from 'vant'
import { Toast } from 'vant'
import { ImagePreview } from 'vant'
import { getQuestionList, submitQuestion } from '@/api/bookTest'
import JaxMath from '@/components/JaxMath'
import Nav from '@/components/Nav'
import wx from 'jweixin-1.6.0'
import { uploadImage } from '@/api/exam'

export default {
  components: {
    Nav,
    JaxMath
  },
  data() {
    return {
      showUpload: true,
      show: false, // 提交弹窗
      uid: this.$route.query.uid,
      dtBookId: this.$route.query.dtBookId,
      chapterNodeId: this.$route.query.chapterNodeId,
      pointId: this.$route.query.pointId,
      versionCode: this.$route.query.versionCode,
      question: [],
      unAnswerQuestion: [],
      title: '',
      isShow: -1,
      idx: 0,
      sonTextFocus: 0, // 小题输入框聚焦index
      loading: false
    }
  },
  mounted() {
    this.loadSubjects()
  },
  methods: {
    previewImg(url) {
      console.log(url)
      ImagePreview({
        images: [url],
        showIndex: false
      })
    },
    removePic() {
      this.question[this.idx].stuAnswer = ''
      this.showUpload = false
      this.$nextTick(() => {
        this.showUpload = true
      })
    },
    removeSonPic(b) {
      this.question[this.idx].sonSubList[b].stuAnswer = ''
      this.showUpload = false
      this.$nextTick(() => {
        this.showUpload = true
      })
    },
    onSonTextFocus(val) {
      this.sonTextFocus = val
    },
    onSonTextAnswer(val) {
      this.question[this.idx].sonSubList[this.sonTextFocus].stuAnswer = ''
      this.question[this.idx].sonSubList[this.sonTextFocus].textAnswer = val
    },
    onTextAnswer(val) {
      this.question[this.idx].stuAnswer = ''
      this.question[this.idx].textAnswer = val
    },
    toUploadSonAnswer(b) {
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
              // that.picUrl = localIds
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
                  const picFile = that.$base64toFile(base64Data)
                  const fd = new FormData()
                  fd.append('cosPath', 'gfkd/masterhead')
                  fd.append('file', picFile)
                  uploadImage(fd).then(result => {
                    if (result.code === 200) {
                      Toast({
                        message: '上传成功',
                        position: 'middle'
                      })
                      that.question[that.idx].sonSubList[b].stuAnswer = result.data.accessUrl
                      that.question[that.idx].sonSubList[b].textAnswer = ''
                      that.showUpload = false
                      that.$nextTick(() => {
                        that.showUpload = true
                      })
                    }
                  })
                }
              })
            }
          })
        }, 200)
      })
    },
    toUploadAnswer() {
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
              // that.picUrl = localIds
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
                  const picFile = that.$base64toFile(base64Data)
                  const fd = new FormData()
                  fd.append('cosPath', 'gfkd/masterhead')
                  fd.append('file', picFile)
                  uploadImage(fd).then(result => {
                    if (result.code === 200) {
                      Toast({
                        message: '上传成功',
                        position: 'middle'
                      })
                      that.question[that.idx].stuAnswer = result.data.accessUrl
                      that.question[that.idx].textAnswer = ''
                      that.showUpload = false
                      that.$nextTick(() => {
                        that.showUpload = true
                      })
                      // that.$set(that.question, that.idx, that.question[that.idx])
                    }
                  })
                }
              })
            }
          })
        }, 200)
      })
    },
    submitPaper() {
      const flag = this.question.some(i => {
        return i.isUnAnswer
      })
      if (flag) {
        // 存在未答题目
        Dialog.confirm({
          title: '提示',
          message: '您还有题目未答，是否全部提交?',
          confirmButtonText: '提交',
          confirmButtonColor: '#10c4ee',
          beforeClose: (action, done) => {
            if (action === 'confirm') {
              done()
              // 提交
              this.doSubmit()
            } else {
              done()
            }
          }
        })
      } else {
        // 提交
        this.doSubmit()
      }
    },
    doSubmit() {
      const data = {}
      // data.dtbookId = 107
      // data.chapterId = 1157
      // data.pointId = '3c0feede-9387-e982-cd46-55041af87568'
      // data.versionCode = 8
      // data.uid = 439829
      data.dtbookId = this.dtBookId
      data.chapterId = this.chapterNodeId
      data.pointId = this.pointId
      data.versionCode = this.versionCode
      let stuBankAnswerListJson = []
      this.question.forEach(item => {
        if (item.sonSubList.length == 0) {
          let stuAnswer = ''
          if (item.stuAnswer) {
            stuAnswer = item.stuAnswer
          } else if (item.textAnswer) {
            stuAnswer = item.textAnswer
          } else {
            stuAnswer = ''
          }
          stuBankAnswerListJson.push({
            bankId: item.bankId,
            tSubject: item.tSubject,
            stuAnswer
          })
        } else {
          // 组合题
          const sonListJson = []
          item.sonSubList.forEach((i, j) => {
            let sonStuAnswer = ''
            if (i.stuAnswer) {
              sonStuAnswer = i.stuAnswer
            } else if (i.textAnswer) {
              sonStuAnswer = i.textAnswer
            } else {
              sonStuAnswer = ''
            }
            sonListJson.push({
              bankId: i.bankId,
              tSubject: i.tSubject,
              stuAnswer: sonStuAnswer
            })
          })
          stuBankAnswerListJson.push({
            bankId: item.bankId,
            tSubject: item.tSubject,
            sonListJson: sonListJson
          })
        }
      })
      data.stuBankAnswerListJson = JSON.stringify(stuBankAnswerListJson)
      data.stuId = this.uid
      data.isShow = this.isShow
      this.loading = true
      submitQuestion(data).then(res => {
        this.loading = false
        if (res.code == 200) {
          Toast({
            message: '提交成功',
            position: 'middle'
          })
          this.$router.replace({
            path: '/dtData',
            query: {
              subjectUserId: res.data.subjectUserId,
              title: this.title,
              dtBookId: this.dtBookId,
              chapterNodeId: this.chapterNodeId,
              pointId: this.pointId,
              versionCode: this.versionCode,
              // token: this.token,
              uid: this.uid
            }
          })
        }
      })
    },
    // 切换到指定题目
    changIdx(i) {
      this.idx = i.num - 1
      this.show = false
    },
    rightClick() {
      this.question.forEach(item => {
        item.isUnAnswer = false
        if (item.tSubject !== 11) {
          if (!item.stuAnswer && !item.textAnswer) {
            item.isUnAnswer = true
          }
        }
        if (item.tSubject === 11) {
          const flag = item.sonSubList.some(i => !i.stuAnswer && !i.textAnswer)
          if (flag) {
            item.isUnAnswer = true
          }
        }
      })
      this.show = true
    },
    pre() {
      if (this.idx == 0) {
        Toast({
          message: '已经是第一题',
          position: 'middle'
        })
        return
      }
      this.idx--
    },
    next() {
      if (this.idx === this.question.length - 1) {
        // 去提交
        this.question.forEach(item => {
          item.isUnAnswer = false
          if (item.tSubject !== 11) {
            if (!item.stuAnswer && !item.textAnswer) {
              item.isUnAnswer = true
            }
          }
          if (item.tSubject === 11) {
            const flag = item.sonSubList.some(i => !i.stuAnswer && !i.textAnswer)
            if (flag) {
              item.isUnAnswer = true
            }
          }
        })
        this.show = true
        return
      }
      this.idx++
    },
    handleSonClick(info, idx, b) {
      const question = this.question[this.idx].sonSubList[b] // 每题选项
      const option = this.question[this.idx].sonSubList[b].answerList // 每一题题目的选项
      console.log(option)
      // 选中添加样式
      option.forEach((item, ix) => {
        if (ix === idx) {
          // 如果选中的与数据里面的相等就改变他的样式
          item.checked = !item.checked // 是否选中，取反
        } else if (question.tSubject !== 3) {
          // 如果不是多选 只能选中一个 其他的都为false
          item.checked = false
        }
      })

      let isAnswer = '' // 选中的答案
      if (info.checked) {
        isAnswer = info.aOption // 选中的答案
      }

      // 如果是多选
      if (question.tSubject === 3) {
        this.ismultipleAnswer = []
        option.forEach(item => {
          if (item.checked) {
            // 将选中的push到 ismultipleAnswer 数组中
            this.ismultipleAnswer.push(item.aOption)
          }
        })
        isAnswer = this.ismultipleAnswer.join(',')
      }

      // console.log("选中的答案", isAnswer);
      // console.log('题目的答案', answer)

      this.question[this.idx].sonSubList[b].stuAnswer = isAnswer
    },
    handleClick(info, idx) {
      const question = this.question[this.idx] // 每题选项
      const option = this.question[this.idx].answerList // 每一题题目的选项

      // 选中添加样式
      option.forEach((item, ix) => {
        if (ix === idx) {
          // 如果选中的与数据里面的相等就改变他的样式
          item.checked = !item.checked // 是否选中，取反
        } else if (question.tSubject !== 3) {
          // 如果不是多选 只能选中一个 其他的都为false
          item.checked = false
        }
      })

      let isAnswer = '' // 选中的答案
      if (info.checked) {
        isAnswer = info.aOption // 选中的答案
      }

      // 如果是多选
      if (question.tSubject === 3) {
        this.ismultipleAnswer = []
        option.forEach(item => {
          if (item.checked) {
            // 将选中的push到 ismultipleAnswer 数组中
            this.ismultipleAnswer.push(item.aOption)
          }
        })
        isAnswer = this.ismultipleAnswer.join(',')
      }

      console.log('选中的答案', isAnswer)
      // console.log('题目的答案', answer)
      this.question[this.idx].stuAnswer = isAnswer // 记录学生答案
      // 缓存作答记录
      // Storage.setExamRecord(`contest-${this.examId}`, this.question)
    },
    // 加载题目列表
    loadSubjects() {
      const data = {}
      // data.dtbookId = 96
      // data.chapterId = 1007
      // data.pointId = '3c0feede-9387-e982-cd46-55041af87568'
      // data.versionCode = 24
      data.dtbookId = this.dtBookId
      data.chapterId = this.chapterNodeId
      data.pointId = this.pointId
      data.versionCode = this.versionCode
      // data.uid = 439829
      getQuestionList(data).then(res => {
        if (res.code === 200) {
          res.data.bankList.forEach((i, index) => {
            i.num = index + 1
            if (i.tSubject === 4 || i.tSubject === 5) {
              i.textAnswer = ''
            }
            if (i.sonSubList.length > 0) {
              i.sonSubList.forEach((j, k) => {
                if (j.tSubject === 4 || j.tSubject === 5) {
                  j.textAnswer = ''
                }
              })
            }
          })
          this.question = res.data.bankList
          this.title = res.data.title
          this.isShow = res.data.isShow
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
  /deep/ .van-popup--bottom {
    padding-top: 30px;
  }
  .contest-popup {
    .contest-popup-toolBar {
      color: #666;
      height: 60px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      // margin-bottom: 20px;
      .text-l {
        color: #333;
      }

      .text-r {
        // float: right;
        display: flex;
        align-items: center;
        .answered {
          // float: right;
        }

        .unAnswer {
          // float: right;
        }
      }
    }
    .option-container {
      height: 870px;
      overflow-y: scroll;
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
            text-align: center;
            line-height: 90px;
          }

          .answered-bgc {
            color: #00a400;
            border: 1px solid #00a400;
            background: rgba(0, 164, 0, 0.17);
          }
        }
      }
    }
    .commit {
      // bottom: 0;
      padding: 0 20px;
      .commit-btn {
        height: 85px;
        background-color: #10c4ee;
        color: white;
      }
    }
  }
  .dt-test-subjects {
    width: 100%;
    // height: calc(100% - 180px);
    min-height: 1200px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 20px 28px 100px 28px;
    .touch-wrap {
      touch-action: pan-y !important;
      // height: 200%;
      // overflow-y: auto;
      // overflow-x: hidden;
      min-height: 1200px;
    }
    .subject-type {
      margin-bottom: 25px;
      .subject-type-item {
        border: 1px solid #2ba1f4;
        color: #2ba1f4;
        font-weight: normal;
        padding: 2px 5px;
        // font-size: 14px;
        border-radius: 10px;
      }
    }
    .subject-title {
      margin-bottom: 60px;
      white-space: wrap;
      .mymath {
        display: block;
        .mjx-chtml {
          white-space: wrap;
          word-wrap: break-word;
          word-break: break-all;
        }
      }
    }
    .subject-options {
      .option-item {
        display: flex;
        align-items: center;
        margin-bottom: 40px;
        min-height: 90px;
        .unCheck {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1px solid #ccc;
          margin-right: 10px;
        }
        .hasCheck {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1px solid #49cb10;
          margin-right: 10px;
          background-color: #49cb10;
        }
      }
      .zg {
        .jc-pic {
          border: 1px solid #d9d9d9;
          border-radius: 6px;
          padding-left: 2px;
          margin-top: 10px;
          position: relative;
          .jc-pic-upload {
            width: 200px;
            height: 200px;
            margin-top: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #ccc;
            position: relative;
            .avatar-add-icon {
              position: absolute;
              right: -25px;
              top: 0;
            }
            .avatar-close-icon {
              position: absolute;
              right: -40px;
              top: -15px;
              color: #ccc;
            }
          }
          // /deep/ .el-textarea__inner {
          //   border: none;
          // }
          // /deep/ .avatar-uploader .el-upload {
          //   border: 1px dashed #d9d9d9;
          //   border-radius: 6px;
          //   cursor: pointer;
          //   position: relative;
          //   overflow: hidden;
          // }
          // /deep/ .avatar-uploader .el-upload:hover {
          //   border-color: #409eff;
          // }
          // /deep/ .avatar-uploader-icon {
          //   font-size: 28px;
          //   color: #8c939d;
          //   width: 100px;
          //   height: 100px;
          //   line-height: 100px;
          //   text-align: center;
          // }
          // .avatar-close-icon {
          //   position: absolute;
          //   left: 102px;
          //   bottom: 98px;
          // }
          .avatar {
            width: 200px;
            height: 200px;
            display: block;
          }
        }
      }
      .zh {
        // 组合题
        height: 400px;
        // border: 1px solid #000;
        overflow-y: auto;
        overflow-x: auto;
        padding-left: 20px;
        .son-subject-title {
          margin-bottom: 15px;
        }

        .son-subject-options {
          .option-item {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            min-height: 60px;
            .unCheck {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              border: 1px solid #ccc;
              margin-right: 5px;
            }
            .hasCheck {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              border: 1px solid #49cb10;
              margin-right: 5px;
              background-color: #49cb10;
            }
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
