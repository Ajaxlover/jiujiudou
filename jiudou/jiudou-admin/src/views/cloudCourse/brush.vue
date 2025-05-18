<template>
  <el-container class="brush">
    <el-header style="height: 50px">
      刷题练习
      <!-- <div @click="cCourseHelp">云课帮助</div> -->
    </el-header>
    <el-main>
      <div class="top">
        <span>类型</span>
        <el-select
          v-model="type"
          size="small"
          @change="courseSerch"
          style="width:100px;"
        >
          <el-option label="全部" value=""></el-option>
          <el-option label="巩固训练" value="1"></el-option>
          <el-option label="四六级" value="2"></el-option>
          <el-option label="考研类" value="3"></el-option>
        </el-select>
        <!-- <span>是否免费</span> -->
        <el-select
          v-model="feeType"
          size="small"
          @change="courseSerch"
          style="width:100px;"
        >
          <el-option label="全部" value=""></el-option>
          <el-option label="免费" value="0"></el-option>
          <el-option label="付费" value="1"></el-option>
        </el-select>
        <span>上架状态</span>
        <el-select
          v-model="isOn"
          size="small"
          @change="courseSerch"
          style="width:100px;"
        >
          <el-option label="全部" value=""></el-option>
          <el-option label="未上架" value="0"></el-option>
          <el-option label="已上架" value="1"></el-option>
          <el-option label="已下架" value="2"></el-option>
        </el-select>
        <el-input
          size="small"
          v-model.trim="keyWord"
          placeholder="请输入搜索关键字"
          style="width: 200px"
          @keyup.enter.native="courseSerch"
        ></el-input>
        <el-button
          size="small"
          type="primary"
          @click="courseSerch"
          class="el-icon-search"
        ></el-button>
        <div class="operateBtn">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-plus"
            @click="newCourse"
            >新建刷题</el-button
          >
        </div>
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
                  @click="courseDetail(scope.row)"
                />
                <img v-else src="@/assets/images/cloudCourseCover.png" />
              </div>
              <div class="middle">
                <div class="name">
                  <span>{{ formatCourseType(scope.row.type) }}</span>
                  <span
                    v-if="scope.row.tagList && scope.row.tagList.length > 0"
                  >
                    <span
                      v-for="(item, index) in scope.row.tagList"
                      :key="index"
                      style="border: 1px solid #2ba1f4;color: #2ba1f4;font-weight: normal;padding: 2px 5px;font-size: 12px;border-radius: 10px;margin-right: 8px;"
                      >{{ item }}</span
                    >
                  </span>

                  <span @click="courseDetail(scope.row)">{{
                    scope.row.name
                  }}</span>
                </div>
                <div class="cloudId">创建人: {{ scope.row.teacherName }}</div>
                <div class="price">{{ formatPrice(scope.row) }}</div>
              </div>
              <div class="courseTime">
                {{
                  scope.row.modifyTime
                    ? dateFormat(scope.row.modifyTime)
                    : dateFormat(scope.row.createTime)
                }}
              </div>
              <div class="right">
                <span
                  :style="scope.row.isOn == 1 ? 'color:red' : 'color:#2BA1F4'"
                  >{{ courseStatus(scope.row) }}</span
                >
                <el-tooltip
                  class="item"
                  effect="dark"
                  placement="top"
                  style="color:#333333;font-size:16px;cursor:pointer"
                  v-if="scope.row.ccourseStatus == 3"
                >
                  <div slot="content">{{ scope.row.ccourseRefuseDesc }}</div>
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </div>
            </div>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <!-- <el-button type="text" size="small" @click="bookDetail(scope.row)">详情</el-button> -->
              <el-button
                type="text"
                size="small"
                v-if="scope.row.isOn != 1"
                @click="toIsOn(scope.row)"
                style="margin-left:0"
                >上架</el-button
              >
              <el-button
                type="text"
                size="small"
                v-if="scope.row.isOn == 1"
                @click="toIsOn(scope.row)"
                style="margin-left:0"
                >下架</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="editCourse(scope.row)"
                style="margin-left:0"
                v-if="scope.row.isOn != 1"
                >编辑</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="deleteCourse(scope.row)"
                style="margin-left:0"
                v-if="scope.row.isOn != 1"
                >删除</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="returnCourse(scope.row)"
                v-if="scope.row.ccourseStatus == 1"
                style="margin-left:0"
                >撤回</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="rebackCourse(scope.row)"
                v-if="scope.row.ccourseIsMain == 0"
                style="margin-left:0"
                >返回上一版本</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="changePrice(scope.row)"
                v-if="
                  scope.row.ccourseStatus == 2 && scope.row.ccourseIsOn != 0
                "
                style="margin-left:0"
                >调价</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="refreshEditCourse(scope.row)"
                v-if="
                  scope.row.ccourseIsOn == 2 && scope.row.ccourseStatus == 2
                "
                style="margin-left:0"
                >重新编辑</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="courseIsOn(scope.row)"
                v-if="scope.row.ccourseStatus == 2"
                style="margin-left:0"
                >{{ isCourseOn(scope.row) }}</el-button
              >
              <!-- <el-button
                type="text"
                size="small"
                @click="countCourse(scope.row)"
                style="margin-left:0"
                >统计</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="toSetCourseSort(scope.row)"
                style="margin-left:0"
                >设置</el-button
              > -->
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
            :page-sizes="[10, 30, 50]"
            :total="page.total"
            :current-page.sync="page.currentPage"
            :page-size="page.pagesize"
            @current-change="loadData"
          ></el-pagination>
        </div>
      </div>
    </el-main>
    <!-- 调价 -->
    <el-dialog
      :visible.sync="isChangePriceShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>调价</div>
        </div>
      </template>
      <el-form
        :model="priceForm"
        ref="priceForm"
        label-width="90px"
        class="demo-ruleForm"
        style="margin:0 90px;"
        @submit.native.prevent
        size="small"
      >
        <el-form-item label="课程原价">
          ￥<el-input
            size="small"
            v-model="priceForm.oldPrice"
            autocomplete="off"
            style="width:250px"
            :disabled="true"
          ></el-input>
          <div class="inputTips">平台当前只提供人民币交易，价格单位为：元</div>
        </el-form-item>
        <el-form-item label="调整后价格">
          ￥<el-input
            size="small"
            v-model="priceForm.newPrice"
            :change="checkPrice()"
            maxlength="8"
            show-word-limit
            style="width:250px"
            autocomplete="off"
          ></el-input>
          <div class="inputTips">平台当前只提供人民币交易，价格单位为：元</div>
        </el-form-item>
      </el-form>
      <!-- <el-form-item label="有效时间" class="courseTag">
        <el-radio-group v-model="priceForm.effectiveTime">
          <el-radio :label="0">永久有效</el-radio>
          <el-radio :label="2">自定义</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <!-- <el-form-item label="" v-if="priceForm.effectiveTime == 2">
        <el-date-picker
          v-model="priceForm.time"
          type="datetimerange" 
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :minTime='startTime'
          @change="datesChange">
        </el-date-picker>
        <div class="inputTips">有效时间过后将恢复原价</div>
      </el-form-item>-->
      <span slot="footer">
        <el-button
          size="small"
          type="primary"
          :loading="loading.loadingChangePrice"
          @click="sureChangePrice"
          >确定</el-button
        >
        <el-button size="small" @click="isChangePriceShow = false"
          >取消</el-button
        >
      </span>
    </el-dialog>
    <!-- 云课封面大图 -->
    <el-dialog
      :visible.sync="isBigImageShow"
      :modal-append-to-body="false"
      width="600px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>封面</div>
        </div>
      </template>
      <img :src="currentCourse.ccourseCover" alt="" style="width:560px;" />
    </el-dialog>
    <!-- 云课服务协议 -->
    <el-dialog
      :visible.sync="isAgreeShow"
      :modal-append-to-body="false"
      width="800px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>云课服务协议</div>
        </div>
      </template>
      <div style="height:500px;overflow-y:auto">
        <courseProtocol></courseProtocol>
      </div>
      <span slot="footer">
        <el-button size="small" type="primary" @click="agreeSure"
          >同意</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="设置"
      :visible.sync="isSetShow"
      :modal-append-to-body="false"
      width="600px"
    >
      <el-form :model="setForm" ref="setForm" @submit.native.prevent>
        <el-form-item label="类型" prop="courseSort" style="margin:0 20%;">
          <el-select
            size="small"
            v-model="setForm.courseSort"
            placeholder="请选择类型"
          >
            <el-option label="云课" value="1"></el-option>
            <el-option label="习题全解" value="2"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item prop="mobile" style="margin:0 20%;">
         
        </el-form-item> -->
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setCourseSort">确定</el-button>
        <el-button @click="isSetShow = false">取消</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import axios from "@/libs/api.request";
import common from "@/utils/common";
import { format } from "@/utils/datetime";
import Cookies from "js-cookie";
import courseProtocol from "./courseProtocol";

export default {
  components: {
    courseProtocol
  },
  data() {
    return {
      isSetShow: false,
      setForm: {
        courseSort: "1"
      },
      uid: this.$store.state.user.userId,
      isBigImageShow: false,
      isAgreeShow: false,
      lockBook: false,
      bookAdded: false,
      type: "", // 类型
      isOn: "", // 上架状态
      feeType: "", // 付费类型
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
    setCourseSort() {
      let { ccourseId } = this.currentCourse;
      let { courseSort } = this.setForm;
      axios
        .request({
          method: "post",
          url: "/v1/cCourse/updateCC/cCSort",
          data: {
            cCId: ccourseId,
            cCourseSort: courseSort
          }
        })
        .then(res => {
          console.log(res);
          let ret = res.data;
          if (ret.code === 200) {
            this.isSetShow = false;
            this.$message({
              type: "success",
              message: "设置成功"
            });
            this.loadData();
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    toSetCourseSort(row) {
      this.isSetShow = true;
      this.currentCourse = row;
      this.setForm.courseSort = String(row.ccourseSort);
    },
    loadData() {
      this.loading.tableLoading = true;
      let data = {};
      data.page = this.page.currentPage;
      data.pageSize = this.page.pagesize;
      // data.managerNLP = 1;
      if (this.keyWord) {
        data.keyWord = this.keyWord;
      }
      if (this.type) {
        data.type = this.type;
      }
      if (this.isOn) {
        data.isOn = this.isOn;
      }
      if (this.feeType) {
        data.feeType = this.feeType;
      }
      axios
        .request({
          method: "post",
          url: "/subject/exerciseSubject/queryByAll",
          data: data
        })
        .then(res => {
          this.loading.tableLoading = false;
          let ret = res.data;
          if (ret.code === 200) {
            ret.data.records.forEach(item => {
              if (item.tags && item.tags.length > 0) {
                item.tagList = item.tags.split(",");
              }
            });
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
        name: "brushInfo"
      });
      // let isNewCoure = Cookies.get("isNewCoure");
      // if (isNewCoure) {
      //   this.$router.push({
      //     name: "courseInfo"
      //   });
      // } else {
      //   this.isAgreeShow = true;
      // }
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
      return common.mathBrushType(ccourseType);
    },
    //云课价格类型
    formatPrice(row) {
      if (row) {
        if (row.feeType == 0) {
          return "免费";
        } else {
          return "￥" + row.price / 100;
        }
      }
    },
    //更新时间
    dateFormat: function(row) {
      return format(row);
    },
    //云课详情
    courseDetail(row) {
      this.$router.push({
        path: "/cloudCourse/brushInfo",
        query: {
          ccourseId: row.id,
          libId: row.sblIdId
        }
      });
    },
    //云课状态
    courseStatus(row) {
      if (row.isOn == 0) {
        return "未上架";
      }
      if (row.isOn == 1) {
        return "已上架";
      }
      if (row.isOn == 2) {
        return "已下架";
      }
      // if (row.ccourseStatus == 2) {
      //   if (row.ccourseIsOn == 0) {
      //     return "已通过";
      //   }
      //   if (row.ccourseIsOn == 1) {
      //     return "已上架";
      //   }
      //   if (row.ccourseIsOn == 2) {
      //     return "已下架";
      //   }
      // } else {
      //   return common.mathCourseStatus(row.ccourseStatus);
      // }
    },
    //上下架显示
    isCourseOn(row) {
      if (row.isOn == 1) {
        return "下架";
      } else {
        return "上架";
      }
    },
    toIsOn(row) {
      axios
        .request({
          method: "post",
          url: "/subject/exerciseSubject/updateById",
          data: {
            id: row.id,
            isOn: row.isOn == 1 ? 2 : 1
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.$message({
              type: "success",
              message: row.isOn == 1 ? "下架成功" : "上架成功"
            });
            this.courseListData.forEach(item => {
              if (item.id == row.id) {
                item.isOn = row.isOn == 1 ? 2 : 1;
              }
            });
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    //编辑
    editCourse(row) {
      this.$router.push({
        path: "/cloudCourse/brushInfo",
        query: {
          ccourseId: row.id,
          libId: row.sblIdId
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
    //删除
    deleteCourse(row) {
      this.$confirm(
        "<div>是否确定删除刷题练习：《" +
          row.name +
          "》？</div>删除后将无法恢复",
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
              url: "/subject/exerciseSubject/deleteById",
              data: {
                exerciseId: row.id
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
.brush {
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
              border: 1px solid #2ba1f4;
              color: #2ba1f4;
              font-weight: normal;
              padding: 2px 5px;
              font-size: 12px;
              border-radius: 10px;
              margin-right: 10px;
            }
            span:nth-child(2) {
              cursor: pointer;
            }
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
          font-size: 12px;
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
