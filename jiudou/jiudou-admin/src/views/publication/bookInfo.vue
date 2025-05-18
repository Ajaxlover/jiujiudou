<template>
  <el-container class="bookInfo">
    <el-header height="50px">
      <span class="book" @click="toBook">教材管理</span> <i class="el-icon-arrow-right"></i> <span>编辑教材</span>
    </el-header>
    <el-main>
      <el-tabs v-model="activeName" class="main-tabs">
        <el-tab-pane label="教材信息" name="first">
          <basic-info :textbookId="textbookId" v-on:addSuccess="addSuccess" v-on:saveSuccess="saveSuccess"></basic-info>
        </el-tab-pane>
        <el-tab-pane label="教材资源" name="second" v-if="textbookId">
          <book-resource :textbookId="textbookId"></book-resource>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import { format } from '@/utils/datetime'
import BasicInfo from './basicInfo'
import BookResource from './bookResource'
export default {
  components: {
    'basic-info': BasicInfo,
    'book-resource': BookResource
  },
  data() {
    return {
      activeName: 'first',
      textbookId: '',
      alreadySave: ''
    }
  },
  methods: {
    dateFormat: function(row, column) {
      var date = row[column.property]
      return format(date);
    },
    toBook() {
      this.$router.push({
        name: "book"
      })
    },
    addSuccess(bookId) {
      this.textbookId = bookId
      this.$router.push({
        path: "/publication/bookInfo",
        query: {
          textbookId: bookId
        }
      })
      this.activeName = 'second'
    },
    saveSuccess(bookId) {
      this.alreadySave = bookId
      this.activeName = 'second'
    },
  },
  mounted() {
    this.textbookId = this.$route.query.textbookId
    if(this.$route.query.returnType || this.$route.query.returnImportType || this.$route.query.belongId) {
      this.activeName = 'second'
    }
  }
};
</script>

<style lang="scss">
.bookInfo {
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