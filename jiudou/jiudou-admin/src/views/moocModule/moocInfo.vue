<template>
  <el-container class="courseInfo">
    <el-main>
      <el-tabs v-model="activeName" class="main-tabs" :before-leave='beforeLeave'>
        <el-tab-pane label="慕课介绍" name="first">
          <basic-info :ccourseId="ccourseId" v-on:addSuccess="addSuccess" v-on:saveSuccess="saveSuccess" ref='basicInfo'></basic-info>
        </el-tab-pane>
        <el-tab-pane label="慕课目录" name="second" v-if="ccourseId">
          <chapter-info :ccourseId="ccourseId" v-if="activeName == 'second'"></chapter-info>
        </el-tab-pane>
        <el-tab-pane label="课程团队" name="teacherList" v-if="ccourseId">
          <teacher-info ref="teacherListRef" :ccourseId="ccourseId"></teacher-info>
        </el-tab-pane>
        <el-tab-pane label="学习进度" name="studyList" v-if="ccourseId">
          <count-mooc ref="countMoocRef"></count-mooc>
        </el-tab-pane>
        <el-tab-pane label="讨论区" name="discussArea" v-if="ccourseId">
          <discuss-area ref="discussAreaRef"></discuss-area>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import { format } from '@/utils/datetime'
import BasicInfo from './basicInfo'
import ChapterInfo from './chapterInfo'
import teacherInfo from './teacherInfo'
import countMooc from './countMooc'
import discussArea from './discussArea'
export default {
  components: {
    'basic-info': BasicInfo,
    'chapter-info': ChapterInfo,
    'teacher-info': teacherInfo,
    'count-mooc': countMooc,
    'discuss-area': discussArea
  },
  data() {
    return {
      newCourseType: '', // 地址栏拿到是属于班课的新建还是云课的新建
      activeName: '',
      ccourseId: '',
      alreadyAdd: '',
      alreadySave: ''
    }
  },
  methods: {
    dateFormat: function(row, column) {
      var date = row[column.property]
      return format(date);
    },
    toCourse() {
      if(this.newCourseType == 1) { // 回到我的班课
        this.$router.push({
          name: "classCourse"
        })
      }else{
        this.$router.push({ // 回到我的云课
          name: "cloudCourse"
        })
      }
    },
    addSuccess(data) {
      this.alreadyAdd = data.id // 记录一下当tab切换时不要加载两次
      this.ccourseId = data.id
      // 新建成功之后记录一下地址栏id，防止新建刷新之后id消失
      if(this.newCourseType) {
        this.$router.push({
          path: "/moocModule/moocInfo",
          query: {
            ccourseId: data.id,
            newCourseType: 1
          }
        })
      }else{
        this.$router.push({
          path: "/moocModule/moocInfo",
          query: {
            ccourseId: data.id,
            coursename: data.name
          }
        })
      }
      this.activeName = 'second'
    },
    saveSuccess(ccourseId) {
      this.alreadySave = ccourseId
      this.activeName = 'second'
    },
    beforeLeave(activeName, oldActiveName) {
      if(oldActiveName == 'first') {
        if(this.alreadySave) {
          this.alreadySave = ''
        }else{
          if(!this.alreadyAdd) {
            // this.$nextTick(() => {
            //   this.$refs.basicInfo.saveBookInfo()
            // })
            setTimeout(() => {
              this.alreadySave = ''
            }, 500);
          }else{
            this.alreadyAdd = ''
          }
        }
      }
      if(activeName == 'teacherList') {
        this.$refs.teacherListRef.loadCourseDetail(this.ccourseId)
      }
      if(activeName == 'studyList') {
        this.$nextTick(() => {
          this.$refs.countMoocRef.loadStuList(this.ccourseId)
        })
      }
      if(activeName == 'discussArea') {
        this.$refs.discussAreaRef.loadDiscussLType(this.ccourseId)
      }
    }
  },
  mounted() {
    if(this.$route.query.ccourseId) {
      this.ccourseId = this.$route.query.ccourseId
      this.activeName = 'second'
    }else{
      this.activeName = 'first'
    }
    if(this.$route.query.activeName == 'first') {
      this.activeName = 'first'
    }
    if(this.$route.query.activeName == 'studyList') {
      this.activeName = 'studyList'
    }
    if(this.$route.query.newCourseType) {
      this.newCourseType = this.$route.query.newCourseType
    }
  }
};
</script>

<style lang="scss">
.courseInfo {
  .el-header{
    background: #fff;
    line-height: 50px;
    padding: 0 43px;
    .book{
      cursor: pointer;
      color: #2BA1F4;
    }
  }
  .el-tabs__item.is-active {
    color: #2BA1F4;
  }
  .el-main{
    margin: 5px 20px 20px;
    padding: 0;
    .main-tabs {
      .el-tabs__header{
        padding: 0 20px;
        .el-tabs__item {
          font-size: 16px;
        }
      }
      .el-tab-pane:nth-child(2) {
        .el-tabs__content{
          margin-top: 0px;
        }
      }
      .el-tabs__content{
        border-radius: 5px;
        min-height: 650px;
        .el-tabs__header{
          padding: 5px 20px;
          border-bottom: 1px solid #EAEAEA;
        }
        .el-tabs__content{
          margin-top: 45px;
        }
        .el-tabs__item {
          font-size: 14px;
          color: #666666;
        }
        .el-tabs__active-bar{
          display: none;
        }
        .el-tabs__item.is-active {
          color: #2BA1F4;
        }
        .el-tabs__nav-wrap::after {
          background: none;
        }
      }
      .el-tabs__nav-wrap::after {
        background: none;
      }
    }
    .sub-tabs {
      .el-tabs__nav-wrap::after {
        background: #E4E7ED;
      }
    }
  }
}
</style>