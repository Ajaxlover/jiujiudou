<template>
  <el-container class="book">
    <el-header style="height: 50px">
      云端教材
      <!-- <div @click="bookHelp">教材管理帮助</div> -->
    </el-header>
    <el-main>
      <div class="top">
        <el-input size="small" v-model="searchForm.keyWord" placeholder="搜索书名、作者、书号" style="width: 320px" @keyup.enter.native="enterKeyUp"></el-input>
        <el-button size="small" type="primary" icon="el-icon-search" @click="loadData"></el-button>
        <!-- <div class="operateBtn">
          <el-button size="small" type="primary" icon="el-icon-plus" @click="newBook">新建</el-button>
        </div> -->
      </div>
      <div class="main">
        <el-table :data="textbookData" border :row-style="{height:'140px'}" v-loading="loading" 
          :header-cell-style="{'background-image':'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)','color':'#333333','height':'40px','padding':'0'}">
          <el-table-column prop="tname" label="书名" align="center" min-width="600">
            <div slot-scope="scope" class="info">
              <div class="left">
                <img style="cursor: pointer;" v-if="scope.row.cover" :src="scope.row.cover" class="userPic">
                <div v-else class="userPicPlachoder" style="cursor: pointer;">
                  <img src="@/assets/images/logoPlacehoder.png">
                </div>
              </div>
              <div class="right">
                <div class="name" @click="bookDetail(scope.row)">{{scope.row.textbookName}} <span v-if="scope.row.bookAdded === 0">上架</span></div>
                <div class="num">书号: {{scope.row.textbookNum}} {{scope.row.pubName}}</div>
                <div class="author">作者: {{scope.row.author}}</div>
                <div class="otherRes">
                  <span v-for="item in scope.row.label" :key="item">{{item}}</span>
                </div>
              </div>
            </div>
          </el-table-column>
          <el-table-column prop="uid" label="创建者" align="center" width="180">
            <div slot-scope="scope" v-if="scope.row.uid">
              {{scope.row.creatorName}}({{scope.row.creatorMobile}})
            </div>
          </el-table-column>
          <el-table-column prop="updated" label="更新时间" align="center" width="180" :formatter="dateFormat"></el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <!-- <el-button type="text" size="small" @click="bookDetail(scope.row)">详情</el-button> -->
              <el-button type="text" size="small" @click="editBook(scope.row)" v-if="scope.row.locked == 0" style="margin-left:0">编辑</el-button>
              <!-- <el-dropdown trigger="hover" :hide-on-click='false'> -->
              <el-dropdown trigger="click" :hide-on-click='true'>
                <span class="el-dropdown-link" style="color:#409EFF;font-size:12px;cursor: pointer;">
                  更多
                </span>
                <el-dropdown-menu slot="dropdown">
                  <!-- <el-dropdown-item>
                    锁定<el-switch :value="scope.row.locked == 1" style="margin-left:30px;" @change="changeLockBook(scope.row)"></el-switch>
                    <div class="inputTips" style="line-height:20px;">锁定后不能再编辑</div>
                  </el-dropdown-item> -->
                  <el-dropdown-item>
                    上架<el-switch :value="scope.row.bookAdded == 0" style="margin-left:30px;" @change="changeBookAdded(scope.row)"></el-switch>
                    <div class="inputTips" style="line-height:20px;">上架后在云端书架可见</div>
                  </el-dropdown-item>
                  <!-- <el-dropdown-item @click.native="handleTransfer(scope.row)">转让</el-dropdown-item>
                  <el-dropdown-item @click.native="deleteBook(scope.row)" v-if="scope.row.uid == uid">删除</el-dropdown-item> -->
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <div class="tabelFooter">
          <div  class="right-footer-first">
            从 {{(this.page.currentPage - 1) * this.page.pagesize + 1}} 到 {{(this.page.currentPage - 1) * this.page.pagesize + this.textbookData.length}} 记录，共 {{page.total}} 条
          </div>
          <el-pagination layout="prev, pager, next, jumper" background :total="page.total" :current-page.sync="page.currentPage" :page-size="page.pagesize" @current-change="loadData"></el-pagination>
        </div>
      </div>
    </el-main>
    <!-- 转让 -->
    <el-dialog :visible.sync="isTransferShow" :modal-append-to-body="false" :close-on-click-modal=false>
      <template slot="title">
        <div><div></div><div>转让</div></div>
      </template>
      <span style="padding-left:75px">选择成员：</span>
      <div style="margin-top: 20px">
        <el-radio-group size="small" v-model="selectedMember" style="text-align:center;display: inherit;">
          <el-radio border :label="item.uid" v-for="item in member" :key="item.uid"
            style="margin-right:10px;margin-left:0;margin-bottom:15px;text-align:left;min-width:400px;">
          {{item.username}}({{item.mobile}})</el-radio>
        </el-radio-group>
      </div>
      <span slot="footer">
        <el-button size="small" type="primary" @click="doTransfer">确定</el-button>
        <el-button size="small" @click="isTransferShow=false">取消</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import axios from "@/libs/api.request"
import { format } from '@/utils/datetime'
export default {
  data() {
    return {
      uid: this.$store.state.user.userId,
      isTransferShow: false,
      lockBook: false,
      bookAdded: false,
      searchForm: {
        keyWord: ''
      },
      loading: false,
      textbookData: [],
      page: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      },
      member: [],
      selectedMember: 0,
      currentTextbookId: ''
    }
  },
  methods: {
    dateFormat: function(row, column) {
      var date = row[column.property]
      return format(date);
    },
    loadData() {
      this.loading = true
      let params = {}
      params.page = this.page.currentPage
      params.pagesize = this.page.pagesize
      if (this.searchForm.keyWord) {
        params.keyWord = this.searchForm.keyWord
      }
      axios.request({
        method: 'post',
        url: '/v1/textbook/listIssueCount',
        data: params
      }).then(res => {
        this.loading = false
        let ret = res.data
        if (ret.code === 200) {
          this.textbookData = ret.data.data
          this.page.total = ret.data.total
        } else {
          this.$message({
            type: 'warning',
            center: true,
            message: ret.msg
          })
        }
      })
    },
    bookHelp() {
      this.$router.push({
        path: "/publication/bookHelp"
      })
    },
    bookDetail(row) {
      this.$router.push({
        path: "/publication/detail",
        query: {
          textbookId: row.textbookId
        }
      })
    },
    editBook(row) {
      this.$router.push({
        path: "/publication/cloudbookInfo",
        query: {
          textbookId: row.textbookId
        }
      })
    },
    newBook(row) {
      this.$router.push({
        name: "bookInfo"
      })
    },
    changeLockBook(row) {
      let locked = ''
      if(row.locked === 0) {
        locked = 1
      }else{
        locked = 0
      }
      axios.request({
        method: 'post',
        url: '/v1/textbook/updateTextbook3SpecialProperty',
        data: {
          tbIds: row.textbookId,
          locked: locked,
        }
      }).then(data => {
        let res = data.data
        if (res.code === 200) {
          if(row.locked === 1) {
            row.locked = 0
          }else{
            row.locked = 1
          }
          this.$message({
            type: 'success',
            message: res.msg
          });
        }
      })
    },
    changeBookAdded(row) {
      let bookAdded = ''
      if(row.bookAdded === 1) {
        bookAdded = 0
      }else{
        bookAdded = 1
      }
      axios.request({
        method: 'post',
        url: '/v1/textbook/updateIssueTextbook3SpecialProperty',
        data: {
          tbIds: row.textbookId,
          bookAdded: bookAdded,
        }
      }).then(data => {
        let res = data.data
        if (res.code === 200) {
          if(row.bookAdded === 1) {
            row.bookAdded = 0
          }else{
            row.bookAdded = 1
          }
          this.$message({
            type: 'success',
            message: res.msg
          });
        }
      })
    },
    deleteBook(row) {
      this.$confirm('图书将会被删除,不会在APP上展示,是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.request({
          method: 'post',
          url: '/v1/textbook/updateTextbook3SpecialProperty',
          data: {
            tbIds: row.textbookId,
            delFlag: 1
          }
        }).then(data => {
          let ret = data.data
          if (ret.code === 200) {
            if(this.page.currentPage != 1 && this.resList.length == 1) {
              this.page.currentPage--
            }
            this.loadData()
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
        })
      }).catch(() => {})
    },
    enterKeyUp() {
      this.loadData()
    },
    //转让
    handleTransfer(row) {
      this.selectedMember = 0
      this.currentTextbookId = row.textbookId
      axios.request({
        method: 'post',
        url: '/v1/pubMember/listWithCount',
        data: {
          page: 1,
          pagesize: 30
        }
      }).then(res => {
        let ret = res.data
        if (ret.code === 200) {
          this.member = ret.data.data
          this.isTransferShow = true
        } else {
          this.$message({
            type: 'warning',
            message: ret.msg
          })
        }
      })
    },
    //确定转让
    doTransfer() {
      if(this.selectedMember > 0) {
        axios.request({
          method: 'post',
          url: '/v1/textbook/transferEditPermission',
          data: {
            textbookIds: this.currentTextbookId,
            userId: this.selectedMember
          }
        }).then(res => {
          let ret = res.data
          if (ret.code === 200) {
            this.isTransferShow = false
            this.loadData()
            this.$message({
              type: 'success',
              message: ret.msg
            })
          } else {
            this.$message({
              type: 'warning',
              message: ret.msg
            })
          }
        })
      }else{
        this.$message({
          type: 'warning',
          message: '请选择转让成员'
        })
      }
    }
  },
  mounted() {
    this.loadData()
  }
};
</script>

<style lang="scss">
.book{
  .el-header{
    background: #ffffff;
    line-height: 50px;
    padding-left: 52px;
    padding-right: 20px;
    div{
      float:right;
      font-size: 14px;
      color: #666666;
      cursor: pointer;
    }
  }
  .el-main{
    margin: 20px;
    background: #ffffff;
    border-radius: 4px;
    min-height: 700px;
    padding-top: 12px;
    padding-left: 18px; 
    padding-right: 18px;
    padding-bottom: 12px;
    .top{
      overflow: hidden;
      .operateBtn{
        float: right;
      }
    }
    .main{
      margin-top: 13px;
      .info{
        padding: 5px 10px;
        overflow: hidden;
        text-align: left;
        .left{
          float: left;
          img{
            width: 75px;
            height: 106px;
          }
          .userPicPlachoder{
            width: 75px;
            height: 106px;
            background: #F0F1F5;
            border-radius: 4px;
            text-align: center;
            img{
              width: 24px;
              height: 36px;
              margin-top: 29px;
            }
          }
        }
        .right{
          margin-left: 18px;
          float: left;
          .name{
            font-weight: bold;
            font-size: 14px;
            color: #333333;
            cursor: pointer;
            span{
              border:1px solid #2BA1F4;
              color:#2BA1F4;
              font-weight:normal;
              padding: 2px 5px;
              font-size: 12px;
              border-radius: 10px;
              margin-left: 10px;
            }
          }
          .num{
            margin-top: 5px;
            font-size: 14px;
            color: #666666;
          }
          .author{
            margin-top: 5px;
            font-size: 12px;
            color: #999999;
          }
          .otherRes{
            margin-top: 5px;
            span{
              margin-right: 2px;
              display: inline-block;
              padding: 0 12px;
              background: #EDF1F7;
              border-radius: 12px;
              color: #0D4376;
              font-size: 12px;
              height: 24px;
              line-height: 24px;
              opacity: 0.7;
            }
          }
        }
      }
      tbody tr td:nth-child(3){
        font-size: 12px;
        color: #999999;
      }
      tbody tr td:nth-child(2){
        color: #666666;
      }
    }
  }
}
</style>