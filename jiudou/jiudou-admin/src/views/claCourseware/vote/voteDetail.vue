<template>
  <div>
    <el-container class="vote">
      <el-header>
        <div>
          <span @click="back" class="returnBtn"
            ><i class="el-icon-back"></i>返回</span
          >
        </div>
        <div>{{ type == 1 ? "投票结束" : "投票中" }}</div>
        <div v-if="type == 0" class="answerBtn">
          <!-- <el-button plain class="cancelBtn">取消</el-button> -->
          <el-button @click="endVote" type="warning">结束</el-button>
        </div>
      </el-header>
      <el-main>
        <div class="votedetail-main">
          <div class="content">
            <div class="votedetail">
              <span class="votedetail-title">{{ voteTitle }}</span>
              <div class="votedetail-content">
                <ul>
                  <li v-for="(item, index) in voteList" :key="index">
                    <p>{{ item.content }}</p>
                    <div class="votedetail-item">
                      <div
                        style="width:500px
                      "
                      >
                        <el-progress
                          :stroke-width="12"
                          :percentage="item.votePercent"
                        ></el-progress>
                      </div>
                      <div style="margin-right:20px">{{ item.voteNum }}人</div>
                      <el-button @click="openDrawer(item)" type="text"
                        >查看</el-button
                      >
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <voteDrawer
          :title="voteItemContent"
          :drawer="drawer"
          :data="students"
          :direction="direction"
          @close="closeDrawer"
        ></voteDrawer>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import axios from "@/libs/api.request";
import voteDrawer from "./voteDrawer";

export default {
  components: {
    voteDrawer
  },
  data() {
    return {
      type: this.$route.query.type,
      isCryptonym: this.$route.query.isCryptonym,
      voteList: [],
      voteTitle: "", // 投票内容
      voteItemContent: "111111", //投票选项
      drawer: false,
      direction: "ltr",
      students: []
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    back() {
      this.$router.back();
    },
    openDrawer(item) {
      if (this.isCryptonym == 1) {
        this.$message({
          message: "当前投票是匿名投票！",
          type: "warning"
        });
        return;
      }
      if (item.voteNum === 0) {
        this.$message({
          message: "当前选项没人投票！",
          type: "warning"
        });
        return;
      }
      this.voteItemContent = item.content;
      this.drawer = true;
      axios
        .request({
          method: "post",
          url: "/clazz/vote/findVoteInfo",
          data: {
            classId: this.$route.query.classId,
            voteId: this.$route.query.voteId,
            itemId: item.itemId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.students = ret.data.students;
          }
        });
    },
    closeDrawer() {
      this.drawer = false;
    },
    loadData() {
      axios
        .request({
          method: "post",
          url: "/clazz/vote/getVoteStatus",
          data: {
            classId: this.$route.query.classId,
            type: this.type,
            id: this.$route.query.voteId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.voteTitle = ret.data.conent;
            this.voteList = ret.data.items;
          }
        });
    },
    // 结束投票
    endVote() {
      axios
        .request({
          method: "post",
          url: "/clazz/vote/endVote",
          data: {
            classId: this.$route.query.classId,
            id: this.$route.query.voteId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            console.log("投票结束");
            this.$message({
              message: "结束当前投票成功！",
              type: "success"
            });
            this.type = 1;
            this.loadData();
          }
        });
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
    .votedetail-main {
      .content {
        width: 1000px;
        height: 820px;
        margin: 0 auto;
        background-color: #fff;
        padding: 60px;
        .votedetail {
          // background-color: red;
          .votedetail-title {
            font-size: 26px;
          }
          .votedetail-content {
            overflow: hidden;
            li {
              list-style: none;
              margin-top: 40px;
            }
            .votedetail-item {
              display: flex;
              align-items: center;
            }
          }
        }
      }
    }
  }
}
</style>
