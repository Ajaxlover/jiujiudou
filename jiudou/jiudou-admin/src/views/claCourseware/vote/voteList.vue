<template>
  <div>
    <el-container class="vote">
      <el-header>
        <div v-if="isShowList">
          <span class="returnBtn" @click="goBack"
            ><i class="el-icon-back"></i>返回</span
          >
        </div>
        <div v-else>
          <span class="returnBtn" @click="isShowList = true"
            ><i class="el-icon-back"></i>上一步</span
          >
        </div>
        <div>投票</div>
      </el-header>
      <el-main v-if="isShowList" v-loading="loading">
        <el-card style="height:820px">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="时间">
              <el-select
                v-model="formInline.timecode"
                clearable
                @change="timecodeChange"
                placeholder="按时间"
              >
                <el-option label="近一个月" value="1"></el-option>
                <el-option label="近6个月" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-select
                @change="statuscodeChange"
                v-model="formInline.statuscode"
                clearable
                placeholder="按状态"
              >
                <el-option label="投票中" value="0"></el-option>
                <el-option label="已结束" value="1"></el-option>
                <el-option label="未发布" value="2"></el-option>
                <el-option label="已撤销" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div class="votelist-main">
            <el-table
              @row-click="goVoteDetail"
              :data="voteList"
              style="width: 100%"
            >
              <!-- <el-table-column prop="date" label="图片" width="180">
              </el-table-column> -->
              <el-table-column prop="content" label="" width="180">
              </el-table-column>
              <el-table-column label="">
                <template slot-scope="scope">
                  <el-tag
                    v-if="scope.row.status == 0"
                    type="success"
                    disable-transitions
                    >投票中</el-tag
                  >
                  <el-tag
                    v-if="scope.row.status == 1"
                    type="success"
                    disable-transitions
                    >已结束</el-tag
                  >
                  <el-tag
                    v-if="scope.row.status == 2"
                    type="success"
                    disable-transitions
                    >未发布</el-tag
                  >
                  <el-tag
                    v-if="scope.row.status == 3"
                    type="success"
                    disable-transitions
                    >已撤销</el-tag
                  >
                </template>
              </el-table-column>
              <el-table-column label="">
                <template slot-scope="scope">
                  <el-button type="text">编辑</el-button>
                  <el-button @click="goVoteDetail(scope.row)" type="text"
                    >详情</el-button
                  >
                  <el-button type="text" :disabled="scope.row.status != 2"
                    >发布</el-button
                  >
                  <el-button @click="deleteVote(scope.row)" type="text"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              style="margin:15px 0"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 15, 20]"
              :page-size="pagesize"
              layout="total, sizes, prev, pager, next"
              :total="total"
            >
            </el-pagination>
            <!-- <el-row class="answerListBody">
              <el-col
                v-for="(item, index) in voteList"
                :key="index"
                @click.native="goVoteDetail(item)"
              >
                <div class="big-container">
                  <div class="left">
                    <img src="@/assets/images/answer.png" alt="" />
                  </div>
                  <div class="middle" style="cursor:pointer;">
                    {{ item.content }}
                  </div>
                  <el-button
                    @click.stop="deleteVote(item)"
                    class="right"
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    circle
                  ></el-button>
                  <el-button
                    class="right"
                    size="mini"
                    type="primary"
                    v-if="item.status == 0"
                    >投票中</el-button
                  >
                  <el-button
                    class="right"
                    size="mini"
                    type="primary"
                    v-if="item.status == 1"
                    >已结束</el-button
                  >
                  <el-button
                    class="right"
                    size="mini"
                    type="primary"
                    v-if="item.status == 2"
                    >未发布</el-button
                  >
                  <el-button
                    class="right"
                    size="mini"
                    type="primary"
                    v-if="item.status == 3"
                    >已撤销</el-button
                  >
                </div>
              </el-col>
            </el-row> -->
          </div>
          <div class="addVote-btn">
            <!-- <el-button type="primary" @click="createVote">新建投票</el-button> -->
            <el-button type="primary" @click="buildVote">创建投票</el-button>
          </div>
        </el-card>
      </el-main>
      <el-main v-else v-loading="loading">
        <el-card style="height:820px">
          <div style="height:100%;overflow:auto">
            <Add-vote></Add-vote>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import axios from "@/libs/api.request";
import AddVote from "./addVote.vue";

export default {
  components: {
    AddVote
  },
  data() {
    return {
      isShowList: true,
      voteList: [],
      loading: true,
      total: 0,
      currentPage: 1,
      pagesize: 10,
      statuscode: "",
      timecode: "",
      formInline: {
        statuscode: "",
        timecode: ""
      }
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      axios
        .request({
          method: "post",
          url: "/clazz/vote/list",
          data: {
            classId: String(this.$route.query.classId),
            timecode: this.timecode,
            statuscode: this.statuscode,
            page: this.currentPage,
            pagesize: this.pagesize
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.voteList = ret.data.data;
            this.total = ret.data.total;
            this.loading = false;
          }
        });
    },
    buildVote() {
      console.log("创建vote");
      this.isShowList = false;
    },
    // 新建投票
    createVote() {
      this.$router.push({
        path: "/vote/addVote",
        query: {
          classId: this.$route.query.classId
        }
      });
      this.$emit("close");
    },
    deleteVote(item) {
      this.$confirm("此操作将永久删除该条投票, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        axios
          .request({
            method: "post",
            url: "/clazz/vote/deleteVote",
            data: {
              voteId: item.id
            }
          })
          .then(res => {
            let ret = res.data;
            if (ret.code === 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.loadData();
            }
          });
      });
    },
    goBack() {
      // this.$router.back();
      this.$emit("close");
    },
    // 跳转投票详情
    goVoteDetail(item) {
      this.$router.push({
        path: "/vote/voteDetail",
        query: {
          voteId: item.id,
          type: item.status,
          classId: this.$route.query.classId,
          isCryptonym: item.isCryptonym
        }
      });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.currentPage = 1;
      this.loadData();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.loadData();
    },
    timecodeChange(val) {
      this.timecode = val;
      this.loadData();
    },
    statuscodeChange(val) {
      this.statuscode = val;
      this.loadData();
    }
  }
};
</script>

<style lang="scss">
.vote {
  height: 100%;
  .el-header {
    background: rgba(13, 67, 118, 1);
    text-align: center;
    color: #fff;
    overflow: hidden;
    font-size: 15px;
    line-height: 60px;
    padding: 0 45px;
    width: 100%;
    box-sizing: border-box;
    position: fixed;
    top: 0;
    div:first-child {
      float: left;
      .returnBtn {
        color: #fff;
        border: 1px solid #979797;
        padding-top: 7px;
        padding-bottom: 7px;
        padding-left: 23px;
        padding-right: 23px;
        font-size: 14px;
        border-radius: 17px;
        margin-right: 12px;
        cursor: pointer;
        i {
          margin-right: 8px;
        }
      }
    }
    div:nth-child(2) {
      box-sizing: border-box;
      z-index: 0;
      position: absolute;
      left: 300px;
      right: 300px;
      font-size: 20px;
    }
    div:last-child {
      i {
        margin-right: 5px;
      }
      cursor: pointer;
      float: right;
    }
  }
  .el-main {
    margin-top: 60px;
    .votelist-main {
      // background-color: red;
      // width: 1100px;
      // margin: 0 auto;
      .answerListBody {
        padding: 44px 200px;
        // height: 100%;
        height: -webkit-calc(100% - 60px);
        height: -moz-calc(100% - 60px);
        height: calc(100% - 60px);
        overflow-y: auto;
        .el-col {
          margin-bottom: 15px;
          box-shadow: 0px 1px 7px 0px rgba(0, 0, 0, 0.1);
          padding: 21px;
          background: #fff;
          border-radius: 5px;
          .big-container {
            // display: flex;
            .left {
              float: left;
              cursor: pointer;
              img {
                width: 100px;
                height: 60px;
              }
            }
            .middle {
              float: left;
              margin: 0;
              padding: 0;
              margin-left: 30px;
              text-align: left;
              max-width: 58%;
            }
            .right {
              float: right;
              margin-left: 10px;
            }
          }
        }
      }
      .card-item {
        margin-bottom: 45px;
      }
    }
    .addVote-btn {
      width: 100px;
    }
  }
}
.el-card__body {
  display: flex;
  flex-direction: column;
}
</style>
