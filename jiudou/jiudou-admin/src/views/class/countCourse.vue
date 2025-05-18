<template>
  <div class="countCourse">
    <el-header height="50px">
      <span class="course" @click="toCourse">班级云课设计</span> <i class="el-icon-arrow-right"></i> <span>课程统计</span>
    </el-header>
    <el-main>
      <div class="countTitle">学习统计</div>
      <ul class="countTop">
        <li>
          <div>
            <span class="block"></span>
            <span class="text">今日学习人数</span>
          </div>
          <div>{{stuStaticData.todayStudyNum}}</div>
        </li>
        <li>
          <div>
            <span class="block"></span>
            <span class="text">整体学习进度</span>
          </div>
          <div>{{totalProcess}}</div>
        </li>
        <li>
          <div>
            <span class="block"></span>
            <span class="text">结课人数</span>
          </div>
          <div>{{stuStaticData.finishNum}}</div>
        </li>
      </ul>
      <div class="countTitle">学员名单</div>
      <el-table :data="stuListData" v-loading="loading.tableLoading" style="margin-top:15px;" border
      :header-cell-style="{'background-image':'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)','color':'#333333','height':'40px','padding':'0'}">
        <el-table-column label="学员" align="center">
          <div slot-scope="scope" class="userInfo">
            <div>
              <img v-if="scope.row.userPic" :src="scope.row.userPic">
              <img v-else src="@/assets/images/userPic.png">
            </div>
            <span>{{scope.row.userRealName}}</span>
          </div>
        </el-table-column>
        <el-table-column label="已学" align="center">
          <div slot-scope="scope" class="info">{{scope.row.doneNum}}/{{scope.row.totalNum}} 讲</div>
        </el-table-column>
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="viewProcess(scope.row)" style="margin-left:0">查看进度</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="tabelFooter">
        <div  class="right-footer-first">
          从 {{(this.page.page - 1) * this.page.pagesize + 1}} 到 {{(this.page.page - 1) * this.page.pagesize + this.stuListData.length}} 记录，共 {{page.total}} 条
        </div>
        <el-pagination layout="prev, pager, next, jumper" background :total="page.total" :current-page.sync="page.page" :page-size="page.pagesize" @current-change="loadStuList"></el-pagination>
      </div> -->
    </el-main>
    <!-- 查看进度 -->
    <el-dialog :visible.sync="isProcessShow" :modal-append-to-body="false" class="processTk">
      <template slot="title">
        <div><div></div><div>学习进度</div></div>
      </template>
      <div class="processTkContent">
        <img v-if="currentRow.userPic" :src="currentRow.userPic" style="width:50px;height:50px;">
        <img v-else src="@/assets/images/userPic.png" style="width:50px;height:50px;">
        <span>{{currentRow.userRealName}}</span>
        <span>已学：{{currentRow.doneNum}}/{{currentRow.totalNum}} 讲</span>
      </div>
      <div style="font-size:16px;margin:15px 0;margin-left:30px;">{{courseName}}</div>
      <el-tree :data="catalogList" :props="defaultProps" :expand-on-click-node="false" node-key="catalogId" highlight-current
        ref="vueChapterTree" icon-class='el-icon-arrow-right'>
        <span class="custom-tree-node" ref="popover" slot-scope="{node, data}">
          <span :title="node.label">{{ node.label }}</span>
          <span v-if="data.isStudy == 1"><i class="el-icon-circle-check" style="color:#2BA1F4;"></i></span>
        </span>
      </el-tree>
    </el-dialog>
  </div>
</template>

<script>
import axios from '@/libs/api.request'
import { format } from '@/utils/datetime'
export default {
  data() {
    return {
      classId: this.$route.query.classId,
      courseName: this.$route.query.courseName,
      ccourseId: this.$route.query.ccourseId,
      stuStaticData: {},
      stuListData: [],
      loading: {
        tableLoading: false,
      },
      isProcessShow: false,
      currentRow: {},
      catalogList: [],
      defaultProps: {
        children: 'catalog',
        label: 'catalogName'
      },
      page: {
        total: 0,
        page: 1,
        pagesize: 10
      },
      totalProcess: ''
    }
  },
  mounted() {
    this.loadStuStatic()
    this.loadStuList()
  },
  methods: {
    toCourse() {
      this.$router.push({
        name: "classCourse"
      })
    },
    //加载学习统计
    loadStuStatic() {
      axios.request({
        method: 'post',
        url: '/v1/bCourse/progress',
        data: {
          classId: this.classId
        }
      }).then(res => {
        let ret = res.data
        if (ret.code === 200) {
          this.stuStaticData = ret.data
          if(this.stuStaticData.singleTotalNum * this.stuStaticData.stuNum == 0) {
            this.totalProcess = 0 + '%'
          }else {
            let p = Math.round(this.stuStaticData.totalDoneNum / (this.stuStaticData.singleTotalNum * this.stuStaticData.stuNum) * 100)
            this.totalProcess = parseFloat(p) + '%'
          }
          this.page.total = ret.data.stuNum
        } else {
          this.$message({
            type: 'warning',
            message: ret.msg
          })
        }
      })
    },
    //加载学员名单
    loadStuList() {
      axios.request({
        method: 'post',
        url: 'v1/bCourse/stuProgressList',
        data: {
          classId: this.classId,
          // page: this.page.page,
          // pageSize: this.page.pagesize,
        }
      }).then(res => {
        let ret = res.data
        if (ret.code === 200) {
          this.stuListData = ret.data
        } else {
          this.$message({
            type: 'warning',
            message: ret.msg
          })
        }
      })
    },
    // 时间
    formatDate(row) {
      return format(row.cuserCreateTime)
    },
    viewProcess(row) {
      this.currentRow = row
      axios.request({
        method: 'post',
        url: 'v1/ccCat/catWithProgress',
        data: {
          cuserId: row.userId,
          cCourseId: this.ccourseId
        }
      }).then(res => {
        let ret = res.data
        if (ret.code === 200) {
          this.catalogList = ret.data
        } else {
          this.$message({
            type: 'warning',
            message: ret.msg
          })
        }
      })
      this.isProcessShow = true
    }
  }
}
</script>
<style lang="scss">
  .countCourse {
    .el-header{
      background: #fff;
      line-height: 50px;
      padding: 0 43px;
      .course{
        cursor: pointer;
        color: #2d66a0;
      }
    }
    .el-main{
      margin: 20px;
      background: #ffffff;
      border-radius: 4px;
      min-height: 700px;
      padding-top: 12px;
      padding-left: 40px; 
      padding-right: 40px;
      padding-bottom: 12px;
      .countTitle{
        margin: 15px 0;
      }
      .countTop{
        border-radius: 4px;
        padding: 10px 0;
        list-style: none;
        overflow: hidden;
        li{
          overflow: hidden;
          width: 256px;
          height: 117px;
          border-radius:4px;
          float: left;
          margin-right: 10px;
          margin-bottom: 20px;
          padding: 28px 47px;
          div:first-child{
            overflow: hidden;
            .block{
              float: left;
              width:15px;
              height:15px;
              margin-top: 3px;
            }
            .text{
              font-size: 14px;
              float: left;
              margin-left: 4px;
              margin-right: 4px;
            }
          }
          div:nth-child(2){
            color: #0D4376;
            margin-top: 10px;
            font-size: 30px;
          }
        }
        li:first-child{
          div .block{
            background:rgba(105,124,203,1);
          }
          background:rgba(105,124,203,0.1);
        }
        li:nth-child(2){
          div .block{
            background:rgba(91,153,253,1);
          }
          background:rgba(91,153,253,0.1);
        }
        li:nth-child(3){
          div .block{
            background:rgba(57,188,249,1);
          }
          background:rgba(57,188,249,0.1);
        }
      }
      .userInfo{
        text-align: center;
        div{
          float: left;
          width: 50px;
          height: 50px;
          img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            margin-left: 30px;
            border: 1px solid rgba(0,0,0,0.2);
          }
        }
        span{
          float: left;
          height: 50px;
          line-height: 50px;
          margin-left: 60px;
        }
      }
    }
    .processTk .processTkContent{
      height: 50px;
      line-height: 50px;
      overflow: hidden;
      img{
        float: left;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-left: 30px;
      }
      span{
        float: left;
        height: 50px;
        line-height: 50px;
        margin-right: 60px;
      }
      span:nth-child(2){
        margin-left: 20px;
      }
    }
    .el-tree{
      font-size: 16px;
      border:1px solid rgba(13,67,118,0.2);
      padding: 21px;
      border-radius:4px;
    }
    .el-tree>.el-tree-node>.el-tree-node__content>.custom-tree-node>span:first-child{
      display: inline-block;
      max-width: 420px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .el-tree>.el-tree-node>.el-tree-node__children>.el-tree-node>.el-tree-node__content>.custom-tree-node>span:first-child{
      display: inline-block;
      max-width: 400px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .el-tree>.el-tree-node>.el-tree-node__children>.el-tree-node>.el-tree-node__children>.el-tree-node>.el-tree-node__content>.custom-tree-node>span:first-child{
      display: inline-block;
      max-width: 380px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .el-tree-node__content{
      height: 46px;
      border-bottom: 1px solid #EAEAEA;
      .el-tree-node__expand-icon{
        margin-left: 12px;
      }
      cursor: inherit;
    }
    .el-tree-node__children{
      .el-tree-node__content{
        border-bottom: none;
      }
    }
    .el-tree-node__content:hover {
      background-color: transparent;
    }
    .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
      background-color: transparent;
    }
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
    }
  }
</style>


