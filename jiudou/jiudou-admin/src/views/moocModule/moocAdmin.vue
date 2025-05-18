<template>
  <el-container class="cloudCourse">
    <el-header style="height: 50px">
      我的慕课
      <!-- <div @click="cCourseHelp">云课帮助</div> -->
    </el-header>
    <el-main>
      <div class="top">
        <el-input
          size="small"
          v-model="keyWord"
          placeholder="搜索慕课"
          style="width: 200px"
          @keyup.enter.native="courseSerch"
        ></el-input>
        <!-- <div class="operateBtn">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-plus"
            @click="newCourse"
            >新建慕课</el-button
          >
        </div> -->
      </div>
      <div class="main">
        <el-table
          :data="courseListData"
          border
          :row-style="{ height: '120px' }"
          :show-header="false"
          v-loading="loading.tableLoading"
        >
          <el-table-column
            prop="tname"
            label="书名"
            align="center"
            min-width="900"
          >
            <div slot-scope="scope" class="info">
              <div class="left">
                <img
                  style="cursor: pointer;"
                  v-if="scope.row.cover"
                  :src="scope.row.cover"
                  class="userPic"
                  @click="bigImg(scope.row)"
                />
                <img v-else src="@/assets/images/mukeCover.png" />
              </div>
              <div class="middle">
                <div class="name">
                  <!-- <span>{{formatCourseType(scope.row.feeType)}}</span> -->
                  <span @click="editCourse(scope.row)">{{
                    scope.row.name
                  }}</span>
                </div>
                <div class="cloudId" v-if="scope.row.startTime">
                  有效时间: {{ dateFormat(scope.row.startTime) }} 至
                  {{ dateFormat(scope.row.endTime) }}
                </div>
                <div class="price">{{ moocStatus(scope.row.status) }}</div>
              </div>

              <!-- <div class="courseTime">{{dateFormat(scope.row.modifyTime)}}</div> -->
            </div>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="checkCourse(scope.row)"
                v-if="scope.row.status == 1"
                style="margin-left:0"
                >审核</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="downCourse(scope.row)"
                style="margin-left:0"
                >下架</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="tabelFooter">
          <div class="right-footer-first">
            从 {{ (this.page.currentPage - 1) * this.page.pagesize + 1 }} 到
            {{
              (this.page.currentPage - 1) * this.page.pagesize +
                this.courseListData.length
            }}
            记录，共 {{ page.total }} 条
          </div>
          <el-pagination
            layout="prev, pager, next, jumper"
            background
            :total="page.total"
            :current-page.sync="page.currentPage"
            :page-size="page.pagesize"
            @current-change="loadData"
          ></el-pagination>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import axios from "@/libs/api.request";
import common from "@/utils/common";
import { formatYMD } from "@/utils/datetime";
import Cookies from "js-cookie";
// import courseProtocol from './courseProtocol'

export default {
  components: {
    // courseProtocol
  },
  data() {
    return {
      uid: this.$store.state.user.userId,
      isBigImageShow: false,
      isAgreeShow: false,
      lockBook: false,
      bookAdded: false,
      keyWord: "",
      courseListData: [],
      loading: {
        tableLoading: false,
        loadingChangePrice: false
      },
      page: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      },
      isChangePriceShow: false,
      priceForm: {
        oldPrice: "",
        newPrice: ""
        // effectiveTime: '',
      },
      // pickerOptions: { // 时间不让选择今天以前的
      //   disabledDate(time) {
      //     return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
      //   }
      // },
      // historyPrice: [],
      currentCourse: {}
    };
  },
  methods: {
    loadData() {
      this.loading.tableLoading = true;
      let data = {};
      data.pageNo = this.page.currentPage;
      data.pageSize = this.page.pagesize;
      if (this.keyWord) {
        data.keyword = this.keyWord;
      }
      axios
        .request({
          method: "post",
          url: "/openccourse/openCcourse/listAll",
          data: data
        })
        .then(res => {
          this.loading.tableLoading = false;
          let ret = res.data;
          if (ret.code === 200) {
            this.courseListData = ret.data.records;
            this.page.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    courseSerch() {
      this.page.currentPage = 1;
      this.loadData();
    },
    cCourseHelp() {
      this.$router.push({
        path: "/cloudCourse/help"
      });
    },
    bigImg(row) {
      this.isBigImageShow = true;
      this.currentCourse = row;
    },
    //新建云课
    newCourse(row) {
      this.$router.push({
        name: "moocInfo"
      });
    },
    //云课同意协议
    agreeSure() {
      let inFifteenMinutes = new Date(
        new Date().getTime() + 7 * 60 * 60 * 60 * 1000
      );
      Cookies.set("isNewCoure", 11, { expires: inFifteenMinutes });
      this.isAgreeShow = false;
      this.$router.push({
        name: "courseInfo"
      });
    },
    // 云课类型
    formatCourseType(ccourseType) {
      return common.mathCourseType(ccourseType);
    },
    //慕课状态
    moocStatus(status) {
      let title = "";
      switch (status) {
        case 0:
          title = "未开课";
          break;
        case 1:
          title = "待审核";
          break;
        case 2:
          title = "已结课";
          break;
        case 3:
          title = "重新开课";
          break;
        case 4:
          title = "开课中";
          break;
      }
      return title;
    },
    //慕课操作
    moocStatusWay(status) {
      let title = "";
      switch (status) {
        case 0:
          title = "未开课";
          break;
        case 1:
          title = "开课";
          break;
        case 2:
          title = "结课";
          break;
        case 3:
          title = "重新开课";
          break;
      }
      return title;
    },
    //云课价格类型
    formatPrice(row) {
      if (row) {
        if (row.price == 0) {
          return "免费";
        } else {
          return "￥" + row.price / 100;
        }
      }
    },
    //更新时间
    dateFormat: function(row) {
      return formatYMD(row);
    },
    //云课详情
    courseDetail(row) {
      this.$router.push({
        path: "/cloudCourse/courseDetail",
        query: {
          ccourseId: row.ccourseId,
          type: 1
        }
      });
    },
    //云课状态
    courseStatus(row) {
      if (row.ccourseStatus == 2) {
        if (row.ccourseIsOn == 0) {
          return "已通过";
        }
        if (row.ccourseIsOn == 1) {
          return "已上架";
        }
        if (row.ccourseIsOn == 2) {
          return "已下架";
        }
      } else {
        return common.mathCourseStatus(row.ccourseStatus);
      }
    },
    //上下架显示
    isCourseOn(row) {
      if (row.ccourseIsOn == 1) {
        return "下架";
      } else {
        return "上架";
      }
    },
    //编辑
    editCourse(row) {
      this.$router.push({
        path: "/moocModule/moocInfo",
        query: {
          ccourseId: row.id
        }
      });
    },
    //重新编辑
    refreshEditCourse(row) {
      axios
        .request({
          method: "post",
          url: "v1/cCourse/needProduceCCReplica",
          data: {
            ccId: row.ccourseId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.$router.push({
              path: "/cloudCourse/courseInfo",
              query: {
                ccourseId: ret.data
              }
            });
          }
        });
    },
    //撤回审核
    returnCourse(row) {
      this.$confirm(
        "<div>是否确定撤回云课：《" +
          row.ccourseName +
          "》？</div>撤回后，云课将不会被审核，您可以重新编辑后再提交审核。",
        "提示",
        {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          dangerouslyUseHTMLString: true,
          type: "warning"
        }
      )
        .then(() => {
          axios
            .request({
              method: "post",
              url: "v1/cCourse/updateCC/cCIntro",
              data: {
                cCId: row.ccourseId,
                ccStatus: 0
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.loadData();
                this.$message({
                  type: "success",
                  message: "撤回成功!"
                });
              }
            });
        })
        .catch(() => {});
    },
    //上下架云课
    courseIsOn(row) {
      let returnInfo = "";
      let isOn = 0;
      if (row.ccourseIsOn == 1) {
        isOn = 2;
        returnInfo =
          "<div>是否确定下架云课：《" +
          row.ccourseName +
          "》？</div>云课下架后，未购买用户将不能查询、购买云课，已购买用户可以正常学习";
      } else {
        isOn = 1;
        returnInfo =
          "<div>是否确定上架云课：《" +
          row.ccourseName +
          "》？</div>云课上架后，用户可查询、试看、购买、学习云课";
      }
      this.$confirm("" + returnInfo + "", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "v1/cCourse/updateCC/cCIntro",
              data: {
                cCId: row.ccourseId,
                isOn: isOn
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.loadData();
                this.$message({
                  type: "success",
                  message: ret.msg
                });
              }
            });
        })
        .catch(() => {});
    },
    // 慕课状态改变
    moocEditStatus(row) {
      let title = this.moocStatusWay(row.status + 1);
      this.$confirm(
        "<div>是否申请" + title + "《" + row.name + "》？</div>",
        "提示",
        {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          dangerouslyUseHTMLString: true,
          type: "warning"
        }
      )
        .then(() => {
          axios
            .request({
              method: "post",
              url: "openccourse/openCcourse/auditStatus",
              data: {
                id: row.id,
                status: row.status + 1
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                if (
                  this.page.currentPage != 1 &&
                  this.courseListData.length == 1
                ) {
                  this.page.currentPage--;
                }
                this.loadData();
                this.$message({
                  type: "success",
                  message: "操作成功!"
                });
                if (title == "重新开课") {
                  this.$router.push({
                    path: "/moocModule/moocInfo",
                    query: {
                      ccourseId: ret.data,
                      activeName: "first"
                    }
                  });
                }
              } else if (ret.code == 202) {
                this.$message({
                  type: "info",
                  message: ret.msg
                });
              }
            });
        })
        .catch(() => {});
    },
    downCourse(row) {
      this.$confirm(
        "<div>是否确定下架慕课：《" + row.name + "》？</div>",
        "提示",
        {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          dangerouslyUseHTMLString: true,
          type: "warning"
        }
      )
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/openccourse/openCcourse/unload",
              data: {
                id: row.id
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.loadData();
                this.$message({
                  type: "success",
                  message: "下架成功!"
                });
              } else {
                this.$message({
                  type: "info",
                  message: ret.msg
                });
              }
            });
        })
        .catch(() => {});
    },
    //审核
    checkCourse(row) {
      axios
        .request({
          method: "post",
          url: "/openccourse/openCcourse/audit",
          data: {
            id: row.id
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.loadData();
            this.$message({
              type: "success",
              message: "审核通过!"
            });
          } else {
            this.$message({
              type: "info",
              message: ret.msg
            });
          }
        });
    },
    //删除
    deleteCourse(row) {
      this.$confirm(
        "<div>是否确定删除慕课：《" +
          row.name +
          "》？</div>删除后慕课将无法恢复",
        "提示",
        {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          dangerouslyUseHTMLString: true,
          type: "warning"
        }
      )
        .then(() => {
          axios
            .request({
              method: "post",
              url: "openccourse/openCcourse/delete",
              data: {
                id: row.id
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                if (
                  this.page.currentPage != 1 &&
                  this.courseListData.length == 1
                ) {
                  this.page.currentPage--;
                }
                this.loadData();
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              } else if (ret.code == 202) {
                this.$message({
                  type: "info",
                  message: ret.msg
                });
              }
            });
        })
        .catch(() => {});
    },
    //返回上一版本
    rebackCourse(row) {
      this.$confirm(
        "<div>是否返回上一版本？</div>返回后，新修改内容将不被保存。",
        "提示",
        {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          dangerouslyUseHTMLString: true,
          type: "warning"
        }
      )
        .then(() => {
          axios
            .request({
              method: "post",
              url: "v1/cCourse/backToLastVersion",
              data: { ccId: row.ccourseId }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.loadData();
                this.$message({
                  type: "success",
                  message: "撤回成功!"
                });
              }
            });
        })
        .catch(() => {});
    },
    //调价弹窗
    changePrice(row) {
      this.isChangePriceShow = true;
      this.priceForm.oldPrice = row.ccoursePrice / 100;
      this.priceForm.newPrice = "";
      this.priceForm.time = "";
      this.currentCourse = row;
    },
    //调价校验
    checkPrice() {
      var price = "" + this.priceForm.newPrice;
      price = price
        .replace(/[^\d.]/g, "") // 清除“数字”和“.”以外的字符
        .replace(/\.{2,}/g, ".") // 只保留第一个. 清除多余的
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".")
        .replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 只能输入两个小数
      if (price.indexOf(".") < 0 && price != "") {
        // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        price = parseFloat(price);
      }
      this.priceForm.newPrice = price;
    },
    //确定调价事件
    sureChangePrice() {
      if (this.priceForm.newPrice == 0) {
        this.$message({
          type: "warning",
          message: "调价时，价格不能为0"
        });
        return;
      }
      this.loading.loadingChangePrice = true;
      axios
        .request({
          method: "post",
          url: "v1/cCHPrice/updCCPrice",
          data: {
            cCId: this.currentCourse.ccourseId,
            cCPrice: Math.round(this.priceForm.newPrice * 100)
          }
        })
        .then(res => {
          let ret = res.data;
          this.loading.loadingChangePrice = false;
          if (ret.code == 200) {
            this.loadData();
            this.isChangePriceShow = false;
            this.$message({
              type: "success",
              message: ret.msg
            });
          }
        });
    },
    //统计
    countCourse(row) {
      this.$router.push({
        path: "/cloudCourse/countCourse",
        query: {
          ccourseId: row.ccourseId,
          courseName: row.ccourseName,
          ccourseUuid: row.ccourseUuid,
          type: 1
        }
      });
    }
  },
  mounted() {
    this.loadData();
  }
};
</script>

<style lang="scss">
.cloudCourse {
  .el-header {
    background: #ffffff;
    line-height: 50px;
    padding-left: 52px;
    padding-right: 20px;
    div {
      float: right;
      font-size: 14px;
      color: #666666;
      cursor: pointer;
    }
  }
  .el-main {
    margin: 20px;
    background: #ffffff;
    border-radius: 4px;
    min-height: 700px;
    padding-top: 12px;
    padding-left: 18px;
    padding-right: 18px;
    padding-bottom: 12px;
    .top {
      overflow: hidden;
      .operateBtn {
        float: right;
      }
    }
    .main {
      margin-top: 13px;
      .info {
        padding: 0px 10px;
        overflow: hidden;
        text-align: left;
        .left {
          float: left;
          img {
            width: 157.4px;
            height: 86px;
            display: block;
          }
        }
        .middle {
          margin-left: 18px;
          float: left;
          .name {
            font-weight: bold;
            font-size: 14px;
            color: #333333;
            span:first-child {
              // border:1px solid #2BA1F4;
              // color:#2BA1F4;
              // font-weight:normal;
              // padding: 2px 5px;
              // font-size: 12px;
              // border-radius: 10px;
              // margin-right: 10px;
              cursor: pointer;
            }
            // span:nth-child(2){
            //   cursor: pointer;
            // }
          }
          .cloudId {
            margin-top: 5px;
            font-size: 14px;
            color: #666666;
          }
          .price {
            color: #ff783d;
            margin-top: 6px;
            font-weight: 600;
          }
        }
        .courseTime {
          float: right;
          font-size: 14px;
          margin-right: 20px;
          color: #999999;
          line-height: 86px;
        }
        .right {
          float: right;
          line-height: 86px;
          margin-right: 50px;
          color: #2ba1f4;
        }
      }
      tbody tr td:nth-child(3) {
        font-size: 12px;
        color: #999999;
      }
      tbody tr td:nth-child(2) {
        color: #666666;
      }
    }
  }
  .el-date-editor .el-range-separator {
    width: auto;
  }
}
</style>
