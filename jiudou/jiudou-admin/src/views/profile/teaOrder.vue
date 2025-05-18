<template>
  <div>
    <el-tabs class="message" @tab-click="handleClick" v-model="current">
      <el-tab-pane class="system container" label="我的订单" name="first">
        <!-- <div class="top">
          <el-input
            size="small"
            v-model="sysPhone"
            placeholder="请输入手机号"
            style="width: 300px"
            @keyup.enter.native="handleSearch"
          ></el-input>
          <el-button
            type="primary"
            @click="handleSearch"
            class="el-icon-search"
            size="small"
          ></el-button>
          <div class="operateBtn">
           
          </div>
        </div> -->
        <el-table
          :data="applyList"
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
            label="订单编号"
            align="center"
            width="300px"
            prop="orderCode"
          ></el-table-column>
          <el-table-column
            label="业务"
            prop="returnTypeName"
            align="center"
          ></el-table-column>
          <el-table-column
            label="名称"
            prop="goodName"
            align="center"
          ></el-table-column>
          <el-table-column label="订单金额（元）" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.orderPrice / 100 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="付款时间"
            width="160px"
            prop="payTime"
            align="center"
          ></el-table-column>
          <el-table-column label="操作" align="center" width="200px">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                v-if="scope.row.invoiceFlag === false"
                @click="toApplyTicket(scope.row)"
                >申请开票</el-button
              >
              <el-tag v-if="scope.row.invoiceFlag === true" type="success"
                >已申请</el-tag
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="tabelFooter">
          <div v-if="applyList.length > 0" class="right-footer-first">
            从{{ (sysPage.page - 1) * sysPage.pageSize + 1 }}到{{
              (sysPage.page - 1) * sysPage.pageSize + applyList.length
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
      <el-tab-pane class="system container" label="发票申请" name="second">
        <div class="top">
          <!-- <el-input
            size="small"
            v-model="teaPhone"
            placeholder="请输入手机号"
            @keyup.enter.native="handleTeaSearch"
            style="width: 300px"
          ></el-input>
          <el-button
            type="primary"
            class="el-icon-search"
            size="small"
            @click="handleTeaSearch"
          ></el-button> -->
          <div class="operateBtn">
            <!-- <el-button
              v-if="teaPage.total != -1"
              size="small"
              @click="toAddTea"
              type="primary"
              icon="el-icon-plus"
              >新增下属</el-button
            > -->
          </div>
        </div>
        <el-table
          :data="teaList"
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
            label="申请订单号"
            prop="orderCode"
            align="center"
            width="300px"
          ></el-table-column>
          <el-table-column
            label="业务"
            prop="returnTypeName"
            align="center"
          ></el-table-column>
          <el-table-column
            label="名称"
            prop="goodName"
            align="center"
          ></el-table-column>
          <el-table-column label="订单金额（元）" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.payPrice / 100 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="申请时间" align="center">
            <template slot-scope="scope">
              <span>{{ formatTime(scope.row.applyTime) }}</span>
            </template></el-table-column
          >
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.handleStatus == false" type="warning"
                >待处理</el-tag
              >
              <el-tag v-if="scope.row.handleStatus == true" type="success"
                >已开票</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column
            label="开票信息"
            prop="createTime"
            align="center"
            width="200px"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="refuseAttestation(scope.row)"
                >查看</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="tabelFooter">
          <div v-if="teaList.length > 0" class="right-footer-first">
            从{{ (teaPage.page - 1) * teaPage.pageSize + 1 }}到{{
              (teaPage.page - 1) * teaPage.pageSize + teaList.length
            }}记录，共{{ teaPage.total }}条
          </div>
          <div v-else class="right-footer-first" ref="footerCount">
            从0到0条记录，共0条
          </div>
          <el-pagination
            layout="prev, pager, next, jumper"
            :total="teaPage.total"
            :page-size="teaPage.pageSize"
            :current-page.sync="teaPage.page"
            background
            @current-change="loadTeaList"
          ></el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 发票申请 -->
    <el-dialog
      v-if="isTicketDetailShow"
      :visible.sync="isTicketDetailShow"
      :modal-append-to-body="false"
      width="500px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>申请发票</div>
        </div>
      </template>
      <el-form
        :model="ticketDetailForm"
        label-width="90px"
        ref="ticketDetailForm"
        :rules="ticketDetailFormRule"
        @submit.native.prevent
      >
        <el-form-item label="抬头类型" prop="type">
          <el-radio-group v-model="ticketDetailForm.type">
            <el-radio :label="1">企业单位</el-radio>
            <el-radio :label="2">个人/非企业</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发票抬头" prop="title">
          <el-input
            style="width:300px"
            placeholder="请填写发票抬头信息"
            v-model.trim="ticketDetailForm.title"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="ticketDetailForm.type == 1"
          label="税号"
          prop="taxNo"
        >
          <el-input
            placeholder="请填写税号"
            style="width:300px"
            v-model.trim="ticketDetailForm.taxNo"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="发票内容" prop="taxContent">
          <span>{{ currentOrder.returnTypeName }}</span>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            placeholder="请填写备注..."
            type="textarea"
            :rows="3"
            resize="none"
            style="width:300px"
            v-model.trim="ticketDetailForm.remark"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            placeholder="请填写正确的邮箱"
            style="width:300px"
            v-model.trim="ticketDetailForm.email"
            size="small"
          ></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button
          @click="doApply"
          :loading="loading.applyLoading"
          style="width:300px;border-radius:10px"
          type="primary"
          >申请电子发票</el-button
        >
      </div>
    </el-dialog>

    <!-- 开票信息 -->
    <el-dialog
      v-if="isTicketInfoShow"
      :visible.sync="isTicketInfoShow"
      :modal-append-to-body="false"
      width="500px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>开票信息</div>
        </div>
      </template>
      <el-form
        :model="ticketInfoForm"
        label-width="90px"
        @submit.native.prevent
      >
        <el-form-item label="抬头类型" prop="type">
          <el-radio-group disabled v-model="ticketInfoForm.type">
            <el-radio :label="1">企业单位</el-radio>
            <el-radio :label="2">个人/非企业</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发票抬头" prop="title">
          <el-input
            style="width:300px"
            placeholder="请填写发票抬头信息"
            v-model.trim="ticketInfoForm.title"
            size="small"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item v-if="ticketInfoForm.type == 1" label="税号" prop="taxNo">
          <el-input
            placeholder="请填写税号"
            style="width:300px"
            v-model.trim="ticketInfoForm.taxNo"
            size="small"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="发票内容">
          <span>{{ currentTicket.returnTypeName }}</span>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            disabled
            placeholder="请填写备注..."
            type="textarea"
            :rows="3"
            resize="none"
            style="width:300px"
            v-model.trim="ticketInfoForm.remark"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="发票金额" prop="remark">
          <span>￥{{ currentTicket.payPrice / 100 }}元</span>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            disabled
            placeholder="请填写正确的邮箱"
            style="width:300px"
            v-model.trim="ticketInfoForm.email"
            size="small"
          ></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button
          v-if="ticketInfoForm.handleStatus"
          @click="readUrl"
          style="width:300px;border-radius:10px"
          type="primary"
          >预览发票</el-button
        >
      </div>
    </el-dialog>
  </div>
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
    .top {
      overflow: hidden;
      margin-bottom: 20px;
      .operateBtn {
        float: right;
      }
    }
  }
}
</style>

<script>
import axios from "@/libs/api.request";
import { format } from "@/utils/datetime";
export default {
  data() {
    var checkTaxNo = (rule, value, callback) => {
      if (this.ticketDetailForm.type == 1 && !value) {
        return callback(new Error("税号不能为空"));
      }

      callback();
    };
    var checkMail = (rule, value, callback) => {
      const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (reg.test(value) != true) {
        return callback(new Error("请填写正确的邮箱"));
      }
      callback();
    };
    return {
      // 开票详情
      currentOrder: {},
      isTicketDetailShow: false,
      ticketDetailForm: {
        type: 1,
        title: "",
        taxNo: "",
        taxContent: "-",
        remark: "",
        money: "",
        email: ""
      },
      ticketDetailFormRule: {
        title: [{ required: true, message: "请输入发票抬头", trigger: "blur" }],
        taxNo: [{ validator: checkTaxNo, trigger: "blur", required: true }],
        email: [{ required: true, validator: checkMail, trigger: "blur" }]
      },
      // 开票信息
      currentTicket: {},
      isTicketInfoShow: false,
      ticketInfoForm: {
        type: 1,
        title: "",
        taxNo: "",
        taxContent: "-",
        remark: "",
        money: "",
        email: "",
        handleStatus: false,
        picUrl: ""
      },
      isApplyShow: false,
      isAddShow: false,
      current: "first",
      sysMessageList: [],
      applyList: [],
      teaList: [],
      teaPhone: "",
      sysPhone: "",
      teaForm: {
        phone: ""
      },
      applyForm: {
        name: "",
        phone: "",
        id: "",
        college: "",
        school: "",
        number: ""
      },
      sysPage: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      teaPage: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      loading: {
        sysMessage: false,
        applyLoading: false
      }
    };
  },
  mounted() {
    this.loadSysMessages();
  },
  methods: {
    readUrl() {
      window.open(this.ticketInfoForm.picUrl);
    },
    getTicketDetail(row) {
      axios
        .request({
          method: "post",
          url: "/order/orderInvoice/queryApplyInvoiceDetail",
          data: {
            orderInvoiceId: row.orderInvoiceId
          }
        })
        .then(data => {
          let res = data.data;
          if (res.code == 200) {
            let { titleType, title, dutyNo, remark, email, picUrl } = res.data;
            this.ticketInfoForm.type = titleType;
            this.ticketInfoForm.title = title;
            if (titleType == 1) {
              this.ticketInfoForm.taxNo = dutyNo;
            }
            this.ticketInfoForm.remark = remark;
            this.ticketInfoForm.email = email;
            this.ticketInfoForm.handleStatus = row.handleStatus;
            this.ticketInfoForm.picUrl = picUrl;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        });
    },
    toApplyTicket(row) {
      this.currentOrder = row;
      this.isTicketDetailShow = true;
      this.ticketDetailForm.type = 1;
      this.$nextTick(function() {
        this.$refs["ticketDetailForm"].resetFields();
      });
    },
    handleClick(tab, event) {
      if (tab.name == "second") {
        this.loadTeaList();
      } else if (tab.name == "first") {
        this.loadSysMessages();
      }
    },
    handleSearch() {
      // 手机号搜索
      this.loadSysMessages();
    },
    handleTeaSearch() {
      this.loadTeaList();
    },
    toApplyAdmin() {
      this.applyForm.college = "";
      this.applyForm.school = "";
      this.applyForm.number = "";
      this.isApplyShow = true;
    },
    doApply() {
      this.$refs["ticketDetailForm"].validate(valid => {
        if (valid) {
          let data = {
            orderId: this.currentOrder.orderId,
            titleType: this.ticketDetailForm.type,
            title: this.ticketDetailForm.title,
            invoiceContent: this.currentOrder.returnTypeName,
            remark: this.ticketDetailForm.remark,
            email: this.ticketDetailForm.email
          };
          if (this.ticketDetailForm.type == 1) {
            data.dutyNo = this.ticketDetailForm.taxNo;
          }
          // 确定申请
          this.loading.applyLoading = true;
          axios
            .request({
              method: "post",
              url: "/order/orderInvoice/applyInvoice",
              data
            })
            .then(res => {
              let ret = res.data;
              this.loading.applyLoading = false;
              if (ret.code == 200) {
                var CountEvent = window.JAnalyticsInterface.Event.CountEvent;
                var cEvent = new CountEvent("apply_ticket");
                window.JAnalyticsInterface.onEvent(cEvent);
                this.$message({
                  type: "success",
                  message: `申请成功`
                });
                this.isTicketDetailShow = false;
                this.loadSysMessages();
              } else {
                this.$message({
                  type: "warning",
                  message: `${ret.msg}`
                });
              }
            });
        } else {
          return false;
        }
      });
    },
    toAddTea() {
      this.$prompt("请输入下属教师手机号", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/,
        inputErrorMessage: "手机号格式不正确"
      })
        .then(({ value }) => {
          axios
            .request({
              method: "post",
              url: "clazz/clazzManager/addsubordinate",
              data: {
                phone: value,
                type: 1,
                managerUid: this.$store.state.user.userId
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.loadTeaList();
                this.$message({
                  type: "success",
                  message: "已成功发送邀请，等待对方授权！"
                });
              } else {
                this.$message({
                  type: "error",
                  message: `${ret.msg}`
                });
              }
            });
        })
        .catch(() => {});
      // this.teaForm.phone = "";
      // this.isAddShow = true;
    },
    doAdd() {
      // 新增下属
    },
    loadTeaList() {
      axios
        .request({
          method: "post",
          url: "/order/orderInvoice/queryMyApplyInvoicePage",
          data: {
            pageNo: this.teaPage.page,
            pageSize: this.teaPage.pageSize
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.teaList = ret.data.records;
            this.teaPage.total = ret.data.total;
          }
        })
        .catch(() => {});
    },
    loadSysMessages() {
      this.loading.sysMessage = true;
      axios
        .request({
          method: "post",
          url: "/order/orderInvoice/queryOrderInvoicePage",
          data: {
            pageNo: this.sysPage.page,
            pageSize: this.sysPage.pageSize
          }
        })
        .then(res => {
          this.loading.sysMessage = false;
          let ret = res.data;
          if (ret.code == 200) {
            this.applyList = ret.data.records;
            this.sysPage.total = ret.data.total;
          }
        })
        .catch(() => {
          this.loading.sysMessage = false;
        });
    },
    passMsg(row) {
      axios
        .request({
          method: "post",
          url: "/clazz/clazzManager/update",
          data: {
            id: row.uid
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.loadSysMessages();
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          } else {
            this.$message({
              type: "error",
              message: `${ret.msg}`
            });
          }
        });
    },
    refuseMsg(row) {
      axios
        .request({
          method: "post",
          url: "/clazz/clazzManager/delete",
          data: {
            id: row.uid
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.loadSysMessages();
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          } else {
            this.$message({
              type: "error",
              message: `${ret.msg}`
            });
          }
        });
    },
    refuseAttestation(row) {
      this.currentTicket = row;
      this.isTicketInfoShow = true;
      this.getTicketDetail(row);
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
