<template>
  <el-container class="bookInfo">
    <el-header height="50px">
      <!-- <span class="book" @click="toBook">数字教材</span> -->
      <!-- <i class="el-icon-arrow-right"></i>  -->
      <span>绑定资源</span>
    </el-header>
    <el-main>
      <book-resource :id="id"></book-resource>
    </el-main>
  </el-container>
</template>

<script>
import { format } from "@/utils/datetime";
import BasicInfo from "./ebasicInfo";
import BookResource from "./epubResource";
import recommend from "./recommend";
export default {
  components: {
    "basic-info": BasicInfo,
    "book-resource": BookResource,
    recommend: recommend
  },
  data() {
    return {
      activeName: "first",
      id: this.$route.query.id,
      alreadySave: ""
    };
  },
  methods: {
    dateFormat: function(row, column) {
      var date = row[column.property];
      return format(date);
    },
    toBook() {
      this.$router.push({
        path: "/publication/epubBookInfo",
        query: {
          id: this.id
        }
      });
    },
    addSuccess(bookId) {
      this.id = bookId;
      this.$router.push({
        path: "/publication/ebookInfo",
        query: {
          id: bookId
        }
      });
      this.activeName = "second";
    },
    saveSuccess(bookId) {
      this.alreadySave = bookId;
      this.activeName = "second";
    }
  },
  mounted() {
    this.activeName = "first";
    this.id = this.$route.query.id;
    if (this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName;
    }
    if (
      this.$route.query.returnType ||
      this.$route.query.returnImportType ||
      this.$route.query.belongId
    ) {
      this.activeName = "second";
    }
  }
};
</script>

<style lang="scss">
.bookInfo {
  .el-header {
    background: #fff;
    line-height: 50px;
    padding: 0 43px;
    .book {
      cursor: pointer;
      color: #2ba1f4;
    }
  }
  .el-tabs__item.is-active {
    color: #2ba1f4;
  }
  .el-main {
    margin: 5px 20px 20px;
    padding: 0;
    .main-tabs {
      .el-tabs__header {
        padding: 0 20px;
        .el-tabs__item {
          font-size: 16px;
        }
      }
      .el-tab-pane:nth-child(2) {
        .el-tabs__content {
          margin-top: 0px;
        }
      }
      .el-tabs__content {
        border-radius: 5px;
        min-height: 650px;
        .el-tabs__header {
          padding: 5px 20px;
          border-bottom: 1px solid #eaeaea;
        }
        .el-tabs__content {
          margin-top: 45px;
        }
        .el-tabs__item {
          font-size: 14px;
          color: #666666;
        }
        .el-tabs__active-bar {
          display: none;
        }
        .el-tabs__item.is-active {
          color: #2ba1f4;
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
        background: #e4e7ed;
      }
    }
  }
}
</style>
