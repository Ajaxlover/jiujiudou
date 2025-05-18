<template>
  <el-tabs class="message" v-model="current" @tab-click="handleClick">
    <el-tab-pane class="system container" label="通知" name="first">
      <el-table
        :data="sysMessageList"
        v-loading="loading.sysMessage"
        stripe
        border
        :header-cell-style="{
          'background-image':
            'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
          color: '#333333',
          height: '40px',
          padding: '0'
        }"
      >
        <el-table-column
          label="类型"
          align="center"
          width="100px"
          :formatter="formatType"
        ></el-table-column>
        <el-table-column
          label="内容"
          prop="msgContent"
          align="center"
        ></el-table-column>
        <el-table-column
          label="时间"
          prop="createTime"
          align="center"
          width="200px"
        >
          <template slot-scope="scope">{{
            formatTime(scope.row.msgTime)
          }}</template>
        </el-table-column>
      </el-table>
      <div class="tabelFooter">
        <div v-if="sysMessageList.length" class="right-footer-first">
          从{{ (sysPage.page - 1) * sysPage.pageSize + 1 }}到{{
            (sysPage.page - 1) * sysPage.pageSize + sysMessageList.length
          }}记录，共{{ sysPage.total }}条
        </div>
        <div v-else class="right-footer-first" ref="footerCount">
          从0到0条记录，共0条
        </div>
        <el-pagination
          layout="prev, pager, next, jumper"
          :total="sysPage.total"
          :page-size="sysPage.pageSize"
          :current-page.sync="sysPage.page"
          background
          @current-change="loadSysMessages"
        ></el-pagination>
      </div>
    </el-tab-pane>
    <el-tab-pane class="system container" label="批阅任务" name="second">
      <el-table
        :data="taskList"
        v-loading="loading.taskLoading"
        row-key="id"
        :tree-props="{ children: 'bankList' }"
        stripe
        border
        :header-cell-style="{
          'background-image':
            'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
          color: '#333333',
          height: '40px',
          padding: '0'
        }"
      >
        <el-table-column
          show-overflow-tooltip
          label="考试名称与题目"
          prop="name"
        ></el-table-column>
        <el-table-column label="考试时间" align="center">
          <template slot-scope="scope"
            >{{ formatTime(scope.row.startTime) }}-{{
              formatTime(scope.row.endTime)
            }}</template
          >
        </el-table-column>
        <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.bankId && scope.row.status == 0"
              @click="toCheck(scope.row)"
              type="text"
              size="small"
              style="margin-left:0;"
              >去批阅</el-button
            >
            <el-button
              v-else-if="scope.row.bankId && scope.row.status == 1"
              @click="toCheck(scope.row)"
              type="text"
              size="small"
              style="margin-left:0;color:green"
              >已批阅</el-button
            >
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="tabelFooter">
        <div v-if="taskList.length" class="right-footer-first">
          从{{ (taskPage.page - 1) * taskPage.pageSize + 1 }}到{{
            (taskPage.page - 1) * taskPage.pageSize + taskList.length
          }}记录，共{{ taskPage.total }}条
        </div>
        <div v-else class="right-footer-first" ref="footerCount">
          从0到0条记录，共0条
        </div>
        <el-pagination
          layout="prev, pager, next, jumper"
          :total="taskPage.total"
          :page-size="taskPage.pageSize"
          :current-page.sync="taskPage.page"
          background
          @current-change="loadTask"
        ></el-pagination>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<style lang="scss">
.message {
  .el-tabs__header {
    background: white;
    padding: 0 52px;
    height: 50px;
    line-height: 50px;
    margin: 0;
  }
  .el-tabs__nav-wrap::after {
    background: none;
  }
  .el-tabs__item {
    font-size: 16px;
    font-weight: 400;
  }
  .container {
    background: white;
    margin: 22px 23px;
    padding: 10px 20px;
  }
}
</style>

<script>
import axios from "@/libs/api.request";
import { format } from "@/utils/datetime";
export default {
  data() {
    return {
      current: this.$store.state.classRoom.checkTaskTab,
      sysMessageList: [],
      taskList: [],
      sysPage: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      taskPage: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      loading: {
        sysMessage: false,
        taskLoading: false
      }
    };
  },
  mounted() {
    if (this.current == "second") {
      this.loadTask();
    } else {
      this.loadSysMessages();
    }
  },
  methods: {
    toCheck(row) {
      let { examId, bankId } = row;
      this.$router.push({
        path: "/profile/checkTask",
        query: {
          examId,
          bankId
        }
      });
    },
    handleClick(tab, event) {
      if (tab.name == "first") {
        this.loadSysMessages();
      }
      if (tab.name == "second") {
        this.$store.commit("setCheckTaskTabName", tab.name);
        this.loadTask();
      }
    },
    // 获取批阅任务
    loadTask() {
      this.loading.taskLoading = true;
      axios
        .request({
          method: "post",
          url: "/exam/exam/readOver/findPage",
          data: {
            pageNo: this.taskPage.page,
            pageSize: this.taskPage.pageSize
          }
        })
        .then(res => {
          this.loading.taskLoading = false;
          let ret = res.data;
          if (ret.code == 200) {
            this.taskList = ret.data.records;
            this.taskPage.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: "服务器错误"
            });
          }
        })
        .catch(() => {
          this.loading.taskLoading = false;
        });
    },
    loadSysMessages() {
      this.loading.sysMessage = true;
      axios
        .request({
          method: "post",
          url: "v1/user/systemMessage",
          data: {
            page: this.sysPage.page,
            pagesize: this.sysPage.pageSize
          }
        })
        .then(res => {
          this.loading.sysMessage = false;
          let ret = res.data;
          if (ret.code == 200) {
            this.sysMessageList = ret.data.data;
            this.sysPage.total = ret.data.total;
          }
        })
        .catch(() => {
          this.loading.sysMessage = false;
        });
    },
    // 类型
    formatType(row) {
      if (row.msgType == 12) {
        return "云课";
      } else {
        return "系统通知";
      }
    },
    // 时间
    formatTime(time) {
      if (time) {
        return format(time);
      }
      return "";
    }
  }
};
</script>
