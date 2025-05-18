<template>
  <div>
    <el-tabs type="card" :tab-position="tabPosition">
      <el-tab-pane label="签到">
        <el-card class="first-card">
          <div>
            次数：<span>{{ clazzSignSummary.totalTimes }}</span>
          </div>
          <div>
            签到率：<span>{{ clazzSignSummary.totalRate }}</span>
          </div>
        </el-card>
        <!-- <img
          style="height:10px;transform:rotate(90deg)"
          src="@/assets/images/img_line.png"
        /> -->
        <el-card>
          <div class="table-btn">
            <el-button type="primary" @click="exportClazzSign" size="small"
              >导出</el-button
            >
            <el-button type="primary" @click="exportDetailSign" size="small"
              >导出明细</el-button
            >
          </div>
          <el-table
            border
            :header-cell-style="{
              'background-image':
                'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
              color: '#333333',
              height: '40px',
              padding: '0'
            }"
            :data="signTableData"
            style="width: 100%"
          >
            <el-table-column
              prop="name"
              align="center"
              label="标题"
              width="260"
            >
              <template slot-scope="scope"
                >{{ format(scope.row.createTime, "M月D") }}签到</template
              >
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="时间"
              align="center"
              width="260"
            >
              <template slot-scope="scope">{{
                format(scope.row.createTime, "MM-DD H:mm")
              }}</template>
            </el-table-column>
            <el-table-column prop="signedRate" align="center" label="签到率">
            </el-table-column>
            <el-table-column align="center" width="300" label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="signDetail(scope.row)"
                  >详情</el-button
                >
                <el-button type="text" @click="deleteSignRow(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div class="pager">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pagination.signCurrentPage"
              :page-sizes="[5, 10, 20]"
              :page-size="pagination.signPagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pagination.signTotal"
            >
            </el-pagination>
          </div>
        </el-card>
        <jdialog
          title="签到详情"
          :noFooter="true"
          :visible.sync="showDialog.signDetail"
          width="800px"
        >
          <template slot="body">
            <div class="dialogHeader">
              <div>
                <span style="color:#333;font-size:16px;">
                  {{ format(currentSign.createTime, "M月DD") }}签到</span
                >
                <span style="color:#666;font-size:14px;margin-left:17px;">
                  {{ format(currentSign.createTime, "MM-DD H:mm") }}
                </span>
              </div>
              <!-- @click="exportSign"
                :disabled="!signStuList.length" -->
              <el-button size="small" type="primary">导出</el-button>
            </div>
            <div class="dialogSummery">
              <span class="summary">签到率：{{ signSummary.signedRate }}</span>
              <span>已签到：{{ signSummary.signedStuQuantity }}</span>
              <span>迟到：{{ signSummary.lateStuQuantity }}</span>
              <span>病假：{{ signSummary.sickStuQuantity }}</span>
              <span>事假：{{ signSummary.personalStuQuantity }}</span>
              <span>缺勤：{{ signSummary.absenceStuQuantity }}</span>
            </div>
            <!-- :data="[]"
              v-el-table-infinite-scroll="loadSignStuList" -->
            <el-table
              class="dialogTable"
              :data="signStuList"
              v-el-table-infinite-scroll="loadSignStuList"
              height="300"
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
                label="学号"
                align="center"
                prop="stuNum"
              ></el-table-column>
              <el-table-column
                label="姓名"
                align="center"
                prop="stuName"
              ></el-table-column>
              <el-table-column label="签到时间" align="center" prop="signTime">
                <div slot-scope="scope">
                  {{
                    scope.row.signType == 2 || scope.row.signType == 0
                      ? "未签到"
                      : format(scope.row.signTime, "MM-DD HH:mm")
                  }}
                </div>
              </el-table-column>
              <el-table-column label="签到情况" align="center" prop="signType">
                <div slot-scope="scope">
                  {{ signType(scope.row.signType) }}
                </div>
              </el-table-column>
              <el-table-column label="签到距离" align="center" prop="distance">
                <div slot-scope="scope">
                  {{ scope.row.distance ? scope.row.distance + "米" : "" }}
                </div>
              </el-table-column>
            </el-table>
          </template>
        </jdialog>
      </el-tab-pane>
      <el-tab-pane label="应答">
        <el-card class="first-card">
          <div>次数：<span>5</span></div>
          <div>应答率：<span>12%</span></div>
        </el-card>
        <el-card>
          <div class="table-btn">
            <el-button type="primary" size="small">导出</el-button>
            <el-button type="primary" size="small">导出明细</el-button>
          </div>
          <el-table
            border
            :data="tableData"
            :header-cell-style="{
              'background-image':
                'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
              color: '#333333',
              height: '40px',
              padding: '0'
            }"
            style="width: 100%"
          >
            <el-table-column
              prop="date"
              align="center"
              label="标题"
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="name"
              label="时间"
              align="center"
              width="180"
            >
            </el-table-column>
            <el-table-column prop="address" align="center" label="提交率">
            </el-table-column>
            <el-table-column prop="address" align="center" label="正确率">
            </el-table-column>
            <el-table-column prop="address" align="center" label="操作">
            </el-table-column>
          </el-table>
          <div class="pager">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pagination.signCurrentPage"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="100"
              layout="total, sizes, prev, pager, next, jumper"
              :total="400"
            >
            </el-pagination>
          </div>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="作业">
        <el-card class="first-card">
          <div>次数：<span>5</span></div>
          <div>提交率：<span>12%</span></div>
        </el-card>
        <el-card>
          <div class="table-btn">
            <el-button type="primary" size="small">导出</el-button>
            <el-button type="primary" size="small">导出明细</el-button>
          </div>
          <el-table
            border
            :data="tableData"
            :header-cell-style="{
              'background-image':
                'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
              color: '#333333',
              height: '40px',
              padding: '0'
            }"
            style="width: 100%"
          >
            <el-table-column
              prop="date"
              align="center"
              label="作业"
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="name"
              label="时间"
              align="center"
              width="180"
            >
            </el-table-column>
            <el-table-column prop="address" align="center" label="提交率">
            </el-table-column>
            <el-table-column prop="address" align="center" label="平均分">
            </el-table-column>
            <el-table-column prop="address" align="center" label="操作">
            </el-table-column>
          </el-table>
          <div class="pager">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pagination.signCurrentPage"
              :page-sizes="[5, 10, 20, 30]"
              :page-size="100"
              layout="total, sizes, prev, pager, next, jumper"
              :total="400"
            >
            </el-pagination>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import common from "@/utils/common";
import axios from "@/libs/api.request";
import moment from "moment";
import jdialog from "@/components/jdialog";
import jmath from "@/components/jmath";
import elTableInfiniteScroll from "el-table-infinite-scroll";

// import printJS from "print-js";

export default {
  directives: {
    "el-table-infinite-scroll": elTableInfiniteScroll
  },
  components: {
    jdialog,
    jmath
  },
  data() {
    return {
      pagination: {
        signCurrentPage: 1,
        signTotal: 0,
        signPagesize: 5
      },
      signSummary: {
        signedRate: "0%",
        signedStuQuantity: 0,
        lateStuQuantity: 0,
        sickStuQuantity: 0,
        personalStuQuantity: 0,
        absenceStuQuantity: 0
      },
      page: {
        signList: 1,
        replyList: 1,
        taskList: 1,
        signDetail: 1,
        replyDetail: 1,
        homeworkDetail: 1
      },
      showDialog: {
        signDetail: false
        // replyDetail: false,
        // homeworkDetail: false,
        // stuCount: false,
        // subjectDetail: false,
        // printHomewok: false
      },
      currentSign: {},
      pagesize: 10,
      tabPosition: "left",
      tableData: [],
      signTableData: [],
      signStuList: [],
      alSwer: 0, // 已提交人数
      unSwer: 0, // 未提交人数
      cls: {},
      // 签到汇总数据
      clazzSignSummary: {
        totalTimes: 0,
        totalRate: "0%"
      }
    };
  },
  mounted() {
    this.cls = JSON.parse(sessionStorage.getItem("currentClass"));
    this.loadSignList();
    this.loadClazzSignSummary();
  },
  computed: {},
  methods: {
    // 签到列表
    loadSignList() {
      axios
        .request({
          method: "post",
          url: "/v1/clazz/selSigns",
          data: {
            clazzId: this.cls.classId,
            pageNum: this.pagination.signCurrentPage,
            pagesize: this.pagination.signPagesize
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            if (ret.data.data.length) {
              this.signTableData = ret.data.data;
            }
            this.pagination.signTotal = ret.data.total;
          }
        });
    },
    // 签到汇总数据
    loadClazzSignSummary() {
      axios
        .request({
          method: "post",
          url: "/v1/clazz/selSignsSummary",
          data: {
            clazzId: this.cls.classId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.clazzSignSummary = ret.data;
          }
        });
    },
    // 签到详情
    signDetail(row) {
      this.currentSign = row;
      this.page.signDetail = 1;
      this.signStuList = [];
      this.showDialog.signDetail = true;
      this.loadSignSummary();
    },
    // 单次签到汇总
    loadSignSummary() {
      axios
        .request({
          method: "post",
          url: "/v1/clazz/selSignDetailSummary",
          data: {
            signNo: this.currentSign.signNo
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.signSummary = ret.data;
          }
        });
    },
    loadSignStuList() {
      axios
        .request({
          method: "post",
          url: "v1/clazz/selSignDetail",
          data: {
            signNo: this.currentSign.signNo,
            pageNum: this.page.signDetail,
            pagesize: 10
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            if (ret.data.length) {
              this.page.signDetail++;
              this.signStuList.push(...ret.data);
            } else {
            }
          } else {
          }
        })
        .catch(() => {});
    },
    // 删除签到
    deleteSignRow(row) {
      this.$confirm(
        "你是否确定要删除本次签到？删除签到数据后不可恢复",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/v1/clazz/delSign",
              data: {
                signNo: row.signNo
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                this.$message({
                  type: "success",
                  message: ret.msg
                });
                this.loadClazzSignSummary();
                this.loadSignList();
              } else {
                this.$message({
                  type: "warning",
                  message: ret.msg
                });
              }
            });
        })
        .catch(() => {});
    },
    // 导出班级签到
    exportClazzSign() {
      let url =
        process.env.BASE_URL +
        "/v1/clazz/exportSignXlsx?clazzId=" +
        this.cls.classId +
        "&clazzName=" +
        this.cls.classname +
        "&token=" +
        this.$store.state.user.token;
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    // 导出班级签到明细
    exportDetailSign() {
      let url =
        process.env.BASE_URL +
        "/clazz/teacher/exportDetailSign?classId=" +
        this.cls.classId +
        "&uid=" +
        this.$store.state.user.userId +
        "&token=" +
        this.$store.state.user.token;
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    // 签到分页器
    handleSizeChange(val) {
      this.pagination.signPagesize = val;
      this.pagination.signCurrentPage = 1;
      this.loadSignList();
    },
    handleCurrentChange(val) {
      this.pagination.signCurrentPage = val;
      this.loadSignList();
    },
    // 时间格式化
    format(time, format) {
      if (time) {
        let iDate = parseInt(time);
        return moment(iDate).format(format);
      }
      return "";
    },
    formatType(type) {
      return common.typeFormat(type);
    }
  }
};
</script>

<style lang="scss">
.dialogHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.dialogSummery {
  margin-top: 26px;
  background: #fbf8eb;
  color: #ac7427;
  font-size: 16px;
  border: 1px solid #e6d3b7;
  border-radius: 4px;
  .summary {
    background: #fbe265;
    padding-left: 31px;
    padding-right: 21px;
  }
}
.dialogSummery > span {
  padding: 13px 9px 18px 28px;
  display: inline-block;
}
.dialogTable {
  border-radius: 4px;
  border: 1px solid rgba(13, 67, 118, 0.2);
  margin-top: 22px;
}

.first-card {
  margin-bottom: 10px;
}
.table-btn {
  margin-bottom: 18px;
  display: flex;
  justify-content: flex-end;
}
.pager {
  margin-top: 10px;
}
</style>
