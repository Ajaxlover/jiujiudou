<template>
  <div class="page-home">
    <!-- <Nav :title="info.tname" @go-back="goBack"></Nav> -->
    <div class="tp">
      <van-image class="book" :src="info.bookCover">
        <template v-slot:loading>
          <img src="../../assets/image/img_book_ph.png" />
        </template>
        <template v-slot:error>
          <img src="../../assets/image/img_book_ph.png" />
        </template>
      </van-image>
      <div class="tpContent">
        <p class="tname">{{ info.tname }}</p>
        <p class="author">作者：{{ info.author }}</p>
        <p class="publisher">出版社：{{ info.publishName }}</p>
      </div>
    </div>
    <div class="function-list">
      <div class="function-tip-name">配套资源</div>
      <div class="function-box">
        <div v-for="(item, index) in functionList" :key="index" class="function-item" @click="selectFunction(item)">
          <img class="function-icon" :src="item.image" alt="" />
          <div class="function-name">
            <div class="name">{{ item.title }}</div>
            <div class="subname">{{ item.subtitle }}</div>
          </div>
          <div v-if="index + 1 != functionList.length" class="function-line"></div>
        </div>
      </div>
    </div>
    <div class="list-box">
      <div class="left-list">
        <van-list finished>
          <van-cell>
            <span class="list-tip-name">目录</span>
          </van-cell>
          <van-cell v-for="(item, index) in catalogInfo" :key="index" @click="selectSubject(item)">
            <span v-if="selectedSubject == item" class="left-list-item-block"> </span>
            <span class="left-list-item-name">{{ item.catelogContent }}</span>
          </van-cell>
        </van-list>
      </div>
      <div class="right-list">
        <!-- <van-pull-refresh v-model="refreshing" @refresh="onRefresh"> -->
        <van-list finished>
          <van-cell class="list-tip-name">
            <!-- <div class="list-tip-name"> -->
              教材资源
              <!-- <span class="list-tip-name">教材资源</span> -->
            <!-- </div> -->
          </van-cell>
          <van-cell v-for="(item, index) in list" :key="index" class="right-item" @click="resourceHandler(item)">
            <!-- <div v-for="(item, index) in list" :key="index" class="right-item" @click="resourceHandler(item)"> -->
            <span class="right-item-icon" :style="getResourceStyle(item)">{{ getResourceName(item) }}</span>
            <span class="right-item-title">{{ item.res_name }}</span>
            <span v-if="item.res_page" class="right-item-num">第{{ item.res_page }}页</span>
            <!-- </div> -->
          </van-cell>
        </van-list>
        <!-- </van-pull-refresh> -->
      </div>
    </div>
    <!-- <div class="bottom">
      <van-button class="buttom-default">去购买</van-button>
    </div> -->
    <resource-tea-email :resource-tea-email-show.sync="resourceTeaEmailShow" @sendEmail="sendEmailHandler"></resource-tea-email>
    <!-- <resource-tea-email v-model="resourceTeaEmailShow"></resource-tea-email> -->
  </div>
</template>

<script>
// import { getBanner, getContestList } from '@/api/home'
// import Nav from '@/components/Nav'
import ResourceTeaEmail from '@/components/ResourceTeaEmail'
import { Toast } from 'vant'
import {
  book_catalog_catalogList,
  tiku_catSb_queryBankCount,
  book_textbook_findCodeVerify,
  resource_tbMatchPic_tbResStatistic,
  resource_resource_resourcesV2
} from '@/api/home'
import { book_lucene_bookDetail, resource_tbMatchPic_getResEmail } from '@/api/bookStore'
// import store from '@/store'

export default {
  name: 'ActivatedBook',
  components: {
    // Nav,
    ResourceTeaEmail
  },
  data() {
    return {
      id: this.$route.query.id,
      info: {},
      catalogInfo: [],
      functionList: [],
      selectedSubject: '',
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      resourceTeaEmailShow: false,
      resourceType: ''
    }
  },
  computed: {},
  created() {},
  mounted() {
    this.getBookInfo()
    this.getBookCatalogInfo()
    this.gettiku()
    this.getceping()
    this.getziyuan()
  },
  methods: {
    getBookInfo() {
      book_lucene_bookDetail({ bookId: this.id })
        .then(res => {
          this.info = res.data
        })
        .catch(err => {
          console.error(err)
        })
    },
    getBookCatalogInfo() {
      book_catalog_catalogList({ textbookId: this.id })
        .then(res => {
          this.catalogInfo = res.data
          if (this.catalogInfo.length > 0 && this.selectedSubject === '') {
            this.selectedSubject = this.catalogInfo[0]
            this.getResource()
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    gettiku() {
      tiku_catSb_queryBankCount({ textbookId: this.id, type: 0 })
        .then(res => {
          if (res.data) {
            const img = require('@/assets/image/icon_resource_func_bookBank.png')
            this.functionList.push({ type: 11, image: img, title: '教材题库', subtitle: '' })
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    getceping() {
      book_textbook_findCodeVerify({ qrCode: this.id, page: 1, pagesize: 1, type: 2 })
        .then(res => {
          if (res.data) {
            const img = require('@/assets/image/icon_resource_func_zct.png')
            this.functionList.push({ type: 1, image: img, title: '测评系统', subtitle: '' })
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    getziyuan() {
      resource_tbMatchPic_tbResStatistic({ textbookId: this.id })
        .then(res => {
          if (res.data.teacherResNum) {
            const img = require('@/assets/image/icon_resource_func_ls.png')
            this.functionList.push({ type: 4, image: img, title: '课件包', subtitle: '教师专用' })
          }
          if (res.data.studentResNum) {
            const img = require('@/assets/image/icon_resource_func_jc.png')
            this.functionList.push({ type: 3, image: img, title: '素材包', subtitle: '教学&学习' })
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    getResource() {
      // this.list = [
      //   { res_name: '文字没有上下居中文字', res_type: 2, res_page: 2 },
      //   { res_name: '文字没有上下居中文字', res_type: 1 },
      //   { res_name: '文字没有上下居中文字没有上下居中文字没有上下居中文字没有上下居中', res_type: 2, res_page: 2 },
      //   { res_name: '文字没有上下居中文字没有上下居中文字没有上下居中文字没有上下居中', res_type: 1 }
      // ]
      resource_resource_resourcesV2({ textbookId: this.id, c_id: this.selectedSubject.catalogId, pagesize: 999999, page: 1, sysModel: 2 })
        .then(res => {
          this.list = res.data
        })
        .catch(err => {
          console.error(err)
        })
    },
    // getResourceClass(item) {
    getResourceStyle(item) {
      const type = Number(item.res_type)
      // let typeClass = 'type_0'
      let typeStyle = 'background: #C4C400;'
      switch (type) {
        case 1:
          // typeClass = 'type_1'
          typeStyle = 'background: #DD9A8E;'
          break
        case 2:
          // typeClass = 'type_2'
          typeStyle = 'background: #EEC77D;'
          break
        case 3:
          // typeClass = 'type_3'
          typeStyle = 'background: #7EC1A5;'
          break
        case 4:
          // typeClass = 'type_4'
          typeStyle = 'background: #C492CE;'
          break
        case 5:
          // typeClass = 'type_5'
          typeStyle = 'background: #8D9BDA;'
          break
        case 6:
          // typeClass = 'type_6'
          typeStyle = 'background: #E3975B;'
          break
        case 7:
          // typeClass = 'type_7'
          typeStyle = 'background: #7AD9C6;'
          break
        case 9:
          // typeClass = 'type_9'
          typeStyle = 'background: #7CC6E0;'
          break
        case 10:
          // typeClass = 'type_10'
          typeStyle = 'background: #B3C777;'
          break
        case 11:
          // typeClass = 'type_11'
          typeStyle = 'background: #EBBDD2;'
          break
        case 12:
          // typeClass = 'type_12'
          typeStyle = 'background: #7AD9D4;'
          break
        case 15:
          // typeClass = 'type_15'
          typeStyle = 'background: #8D9BDA;'
          break
        default:
          // typeClass = 'type_0'
          typeStyle = 'background: #C4C400;'
          break
      }
      // return typeClass
      return typeStyle
    },
    getResourceName(item) {
      const type = Number(item.res_type)
      let typeName = '其他'
      switch (type) {
        case 1:
          typeName = '音频'
          break
        case 2:
          typeName = '视频'
          break
        case 3:
          typeName = 'AR'
          break
        case 4:
          typeName = 'Excel'
          break
        case 5:
          typeName = 'H5'
          break
        case 6:
          typeName = 'PPT'
          break
        case 7:
          typeName = 'Word'
          break
        case 9:
          typeName = 'PDF'
          break
        case 10:
          typeName = '图片'
          break
        case 11:
          typeName = '文件夹'
          break
        case 12:
          typeName = '语音评测'
          break
        case 15:
          typeName = 'H5'
          break
        default:
          typeName = '其他'
          break
      }
      return typeName
    },
    sendEmailHandler(save, email) {
      const resourceType = Number(this.resourceType)
      let type = 4
      if (resourceType === 3) {
        type = 1
      } else if (resourceType === 4) {
        type = 0
      }
      resource_tbMatchPic_getResEmail({ isUpdateEmail: save, email: email, textbookId: this.id, type: type })
        .then(res => {
          if (res.code === 200) {
            Toast({
              message: '发送成功',
              position: 'middle'
            })
            this.resourceTeaEmailShow = false
          } else {
            Toast({
              message: res.msg,
              position: 'middle'
            })
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    goBack() {
      this.$router.goBack()
    },
    // onLoad() {
    //   setTimeout(() => {
    //     if (this.refreshing) {
    //       this.list = []
    //       this.refreshing = false
    //     }

    //     for (let i = 0; i < 10; i++) {
    //       this.list.push(this.list.length + 1)
    //     }
    //     this.loading = false

    //     if (this.list.length >= 40) {
    //       this.finished = true
    //     }
    //   }, 1000)
    // },
    // onRefresh() {
    //   // 清空列表数据
    // this.finished = false

    //   // 重新加载数据
    //   // 将 loading 设置为 true，表示处于加载状态
    //   this.loading = true
    //   this.onLoad()
    // },
    selectSubject(item) {
      this.selectedSubject = item
      this.getResource()
    },
    selectFunction(item) {
      const type = Number(item.type)
      if (type === 3 || type === 4) {
        this.resourceType = type
        this.resourceTeaEmailShow = true
      } else {
        this.gotoAppUrl()
      }
    },
    resourceHandler(item) {
      // 3 AR
      const type = Number(item.res_type)
      if (type === 3) {
        this.gotoAppUrl()
        return
      }
      const url = item.res_url
      if (url && url.length > 0) {
        window.location.href = url
      } else {
        this.gotoAppUrl()
      }
    },
    gotoAppUrl() {
      window.location.href = 'https://www.guangyiedu.com/app/'
    }
  }
}
</script>

<style lang="scss" scoped>
.page-home {
  height: 100%;
  width: 100%;
  background-color: #f4f4f4;

  .home-title {
    text-align: center;
    height: 90px;
    line-height: 90px;
    font-size: 34px;
    font-weight: 600;
    color: #333333;
  }

  .tp {
    // width: 100%;
    border-radius: 10px;
    margin: 20px;
    height: 280px;
    overflow: hidden;
    position: relative;
    // background: rgba(102, 102, 102, 0.65);
    background: white;
    padding: 30px 40px;
    .bookBg {
      position: absolute;
      width: 5000%;
      margin: -200px;
      filter: blur(10px);
      z-index: -1;
    }
    .book {
      width: 155px;
      height: 211px;
      float: left;
      box-shadow: 0 0 15px 4px rgba(81, 81, 81, 0.2);
    }

    .tpContent {
      margin: 10px 0 0 180px;
      .tname {
        color: #333;
        font-size: 30px;
      }

      .author {
        color: #666;
        font-size: 22px;
        margin-top: 30px;
      }
      .publisher {
        color: #666;
        font-size: 22px;
        margin-top: 10px;
      }
    }
  }

  .function-list {
    margin: 0 20px 20px 20px;
    border-radius: 10px;
    // height: 200px;
    background: white;
    .function-tip-name {
      color: #333;
      font-size: 28px;
      line-height: 70px;
      height: 70px;
      padding: 0 20px;
      border-bottom: 2px solid #f4f4f4;
    }
    .function-box {
      overflow-x: scroll;
      white-space: nowrap;
      height: 120px;
      padding: 10px;
      display: flex;
      .function-item {
        width: 260px;
        height: 100px;
        display: flex;
        .function-icon {
          width: 70px;
          height: 70px;
          margin: 15px 25px;
        }
        .function-name {
          // display: flex;
          margin: 15px 0;
          .name {
            width: 120px;
            font-size: 22px;
            color: #333;
          }
          .subname {
            margin-top: 15px;
            width: 120px;
            font-size: 20px;
            color: #999;
          }
        }
        .function-line {
          border-left: 2px solid #f4f4f4;
          // width: 4px;
          height: 50px;
          margin-top: 25px;
          // background: #f4f4f4;
        }
      }
    }
  }

  .list-box {
    display: flex;
    background: #f4f4f4;
    margin: 0px 20px 100px;
    // border-top: 5px solid #f4f4f4;
    .list-tip-name {
      font-size: 26px;
      color: #333333;
      // line-height: 50px;
      // padding: 20px 0 0 20px;
      // margin: 30px;
    }
    .left-list {
      width: 200px;
      background: white;
      .left-list-item-block {
        position: absolute;
        width: 5px;
        height: 50px;
        background: #10c4ee;
      }
      .left-list-item-name {
        margin-left: 20px;
        font-size: 26px;
        color: #333333;
      }
      /deep/ .van-cell {
        padding: 10px 20px;
      }
    }
    .right-list {
      margin: 0 0 0 10px;
      background: white;
      flex: 1;
      overflow: hidden;
      .right-item {
        // display: flex;
        // width: 100%;
        // padding: 10px 30px;
        .right-item-icon {
          display: inline-block;
          width: 80px;
          height: 50px;
          line-height: 50px;
          color: #fff;
          background: #10c4ee;
          border-radius: 5px;
          font-size: 24px;
          text-align: center;
        }

        .right-item-title {
          flex: 2;
          padding: 0 0 0 15px;
          font-size: 24px;
          // line-height: 1.1;
          // height: 60px;
          // line-height: 28px;
          // white-space: nowrap; /* 不换行 */
          // overflow: hidden; /* 隐藏溢出部分 */
          // text-overflow: ellipsis; /* 显示省略号 */
          // -webkit-line-clamp: 2;
          -webkit-line-clamp: 1;
          display: -webkit-box;
          word-break: break-all;
          -webkit-box-orient: vertical;
          overflow: hidden;
          color: #333;
        }

        .right-item-num {
          // flex: 2;
          font-size: 16px;
          color: #999;
          // display: contents;
          // position: absolute;
          position: relative;
          bottom: -20px;
          height: 20px;
        }
      }
      /deep/ .van-cell {
        padding: 10px 20px;
      }
      /deep/ .van-cell__value {
        display: flex;
      }
    }
  }
  .bottom {
    position: fixed;
    bottom: 0;
    height: 100px;
    width: 100%;
    display: flex;
    .buttom-default {
      flex: 1;
      color: #fff;
      background: #10c4ee;
      height: 100px;
    }
    .buttom-left {
      flex: 1;
      color: #fff;
      background: #81b337;
      border-right: 1px solid white;
      // line-height: 100px;
      height: 100%;
    }
    .buttom-right {
      flex: 1;
      color: #fff;
      background: #10c4ee;
      // line-height: 100px;
      height: 100%;
    }
  }
}
</style>
