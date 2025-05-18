<template>
  <el-tabs class="ticketManage" v-model="current">
    <el-tab-pane label="发票申请" name="fourth" class="record container">
      <el-form :inline="true" size="small">
        <el-form-item>
          <el-input
            v-model="staticForm.phone"
            placeholder="请输入手机号"
            style="width:200px;"
            oninput="value=value.replace(/[^0-9]/g,'')"
            maxlength="11"
            @keyup.enter.native="onSearchStatic"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model.trim="staticForm.teacherName"
            placeholder="请输入教师姓名"
            style="width:200px;"
            @keyup.enter.native="onSearchStatic"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model.trim="staticForm.school"
            placeholder="请输入学校名称"
            style="width:200px;"
            @keyup.enter.native="onSearchStatic"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            @change="onSearchStatic"
            v-model="staticForm.status"
            style="width:100px;"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="未处理" value="0"></el-option>
            <el-option label="已处理" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            size="small"
            type="primary"
            @click="onSearchStatic"
            class="el-icon-search"
          ></el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <!-- <el-button size="small" type="primary" @click="exportStaticExcel"
            >导出</el-button
          > -->
        </el-form-item>
      </el-form>
      <el-table
        :data="staticList"
        v-loading="loading.staticList"
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
          label="教师姓名"
          prop="username"
          width="160"
          align="center"
        ></el-table-column>
        <el-table-column
          label="手机号"
          prop="mobile"
          width="160"
          align="center"
        ></el-table-column>
        <el-table-column
          label="学校"
          prop="school"
          width="160"
          align="center"
        ></el-table-column>
        <el-table-column
          label="订单号"
          prop="orderCode"
          align="center"
        ></el-table-column>
        <el-table-column label="申请时间" align="center" width="160">
          <template slot-scope="scope">
            <span>{{ formatTime(scope.row.applyTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="订单金额(元)"
          prop="payPrice"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.payPrice / 100 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="业务"
          prop="busTypeName"
          align="center"
          width="160"
        ></el-table-column>
        <el-table-column
          label="邮箱"
          prop="email"
          align="center"
          width="160"
        ></el-table-column>
        <el-table-column label="状态" align="center" width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.handleStatus == 0" type="warning"
              >待处理</el-tag
            >
            <el-tag v-if="scope.row.handleStatus == 1" type="success"
              >已处理</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              style="margin-left:0"
              @click="showTicketDetail(scope.row)"
              >开票详情</el-button
            >
            <el-button
              type="text"
              size="small"
              style="margin-left:0"
              @click="toSendTicket(scope.row)"
              >发送</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="tabelFooter">
        <div v-if="staticList.length" class="right-footer-first">
          从{{ (staticPage.page - 1) * staticPage.pagesize + 1 }}到{{
            (staticPage.page - 1) * staticPage.pagesize + staticList.length
          }}记录，共{{ staticPage.total }}条
        </div>
        <div v-else class="right-footer-first" ref="footerCount">
          从0到0条记录，共0条
        </div>
        <el-pagination
          layout="prev, pager, next, jumper"
          :total="staticPage.total"
          :page-size="staticPage.pagesize"
          :current-page.sync="staticPage.page"
          background
          @current-change="loadStaticList"
        ></el-pagination>
      </div>
      <!-- 发票详情 -->
      <el-dialog
        v-if="isTicketDetailShow"
        :visible.sync="isTicketDetailShow"
        :modal-append-to-body="false"
        width="500px"
      >
        <template slot="title">
          <div>
            <div></div>
            <div>开票详情</div>
          </div>
        </template>
        <el-form
          :model="ticketDetailForm"
          label-width="90px"
          @submit.native.prevent
        >
          <el-form-item label="抬头类型" prop="type">
            <el-radio-group v-model="ticketDetailForm.type" disabled>
              <el-radio :label="1">企业单位</el-radio>
              <el-radio :label="2">个人/非企业</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="发票抬头" prop="title">
            <el-input
              disabled
              style="width:300px"
              v-model.trim="ticketDetailForm.title"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="税号"
            v-if="ticketDetailForm.type == 1"
            prop="taxNo"
          >
            <el-input
              disabled
              style="width:300px"
              v-model.trim="ticketDetailForm.taxNo"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="发票内容">
            <span>{{ currentTicket.busTypeName }}</span>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              disabled
              type="textarea"
              :rows="3"
              resize="none"
              style="width:300px"
              v-model.trim="ticketDetailForm.remark"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="发票金额">
            <span>￥{{ currentTicket.payPrice / 100 }}元</span>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input
              disabled
              style="width:300px"
              v-model.trim="ticketDetailForm.email"
              size="small"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="电子发票" prop="email">
            <el-button type="text">预览</el-button>
          </el-form-item> -->
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button
            style="width:300px;border-radius:10px"
            type="primary"
            @click="copyInfo"
            >复制信息</el-button
          >
        </div>
      </el-dialog>
      <!-- 发送发票 -->
      <el-dialog
        v-if="isSendShow"
        :visible.sync="isSendShow"
        :modal-append-to-body="false"
        width="600px"
      >
        <template slot="title">
          <div>
            <div></div>
            <div>发送发票</div>
          </div>
        </template>
        <el-form
          :model="ticketForm"
          :rules="ticketFormRule"
          label-width="90px"
          ref="ticketForm"
          @submit.native.prevent
        >
          <el-form-item label="发票文件" prop="title" style="width:390px">
            <fileModal
              accept=".pdf"
              ref="ticketFile"
              @fileChange="handleFileChange"
            ></fileModal>
            <div class="el-upload__tip" style="line-height:17px">
              请选择上传pdf文件
            </div>
          </el-form-item>
          <el-form-item label="邮件主题" prop="mailTitle">
            <el-input
              disabled
              style="width:300px;"
              v-model.trim="ticketForm.mailTitle"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮件正文" prop="mailContent">
            <Ueditor
              v-model.trim="ticketForm.mailContent"
              :initialFrameHeight="initialFrameHeight"
              :toolbars="toolbars"
            />
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            :disabled="!uploadFile"
            size="small"
            @click="doSend"
            :loading="sendLoading || isUploading"
            >{{ isUploading ? "上传中" : "发送" }}</el-button
          >
          <el-button size="small" @click="isSendShow = false">取消</el-button>
        </div>
      </el-dialog>
    </el-tab-pane>
  </el-tabs>
</template>

<style lang="scss">
.tiku-edit {
  .el-form-item {
    margin-bottom: 10px;
  }
  .price-rule-list {
    .el-tag {
      margin-right: 20px;
      margin-bottom: 20px;
    }
  }
  .cover-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .cover-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 140px;
    height: 140px;
    line-height: 140px;
    text-align: center;
  }
  .tiku-cover {
    width: 140px;
    height: 140px;
    display: block;
  }
}
.ticketManage {
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
  .settleImage {
    width: 230px;
    height: 150px;
    margin-right: 3px;
  }
  .imageContainer {
    position: relative;
    .el-icon-circle-close {
      position: absolute;
      right: 6px;
      top: -10px;
      font-size: 25px;
      cursor: pointer;
    }
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }

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
        margin-bottom: 10px;
        span:first-child {
          cursor: pointer;
        }
        // span:nth-child(2){
        //   cursor: pointer;
        // }
      }
      .cloudId {
        margin-top: 40px;
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
}
</style>

<script>
import axios from "@/libs/api.request";
import { format, dateStr } from "@/utils/datetime";
import jdialog from "@/components/jdialog";
// import common from "@/utils/common";
import Ueditor from "@/components/ueditor";
import fileModal from "@/components/fileModal";

export default {
  components: {
    fileModal,
    "jd-dialog": jdialog,
    Ueditor
  },
  data() {
    return {
      // 发票详情
      isTicketDetailShow: false,
      ticketDetailForm: {
        type: 1,
        title: "抬头信息",
        taxNo: "",
        taxContent: "购买题库",
        remark: "备注备注",
        money: "",
        email: ""
      },
      // 发送发票
      isUploading: false,
      sendLoading: false,
      isSendShow: false,
      ticketForm: {
        pdfUrl: "",
        mailTitle: "",
        mailContent: ""
      },
      ticketFormRule: {
        mailTitle: [
          { required: true, message: "邮件主题不能为空", trigger: "blur" }
        ]
      },
      uploadFile: null,
      initialFrameHeight: 100,
      toolbars: [
        [
          "fullscreen",
          "source",
          "|",
          "undo",
          "redo",
          "|",
          "emotion",
          "rowspacingtop",
          "rowspacingbottom",
          "lineheight",
          "|",
          "directionalityltr",
          "directionalityrtl",
          "indent",
          "|",
          "justifyleft",
          "justifycenter",
          "justifyright",
          "justifyjustify"
        ]
      ],
      // -----------------------------
      current: "fourth",
      loading: {
        staticList: false
      },
      // 发票申请
      staticList: [],
      staticForm: {
        payType: "",
        searchType: "1",
        totalMoeny: "",
        phone: "",
        teacherName: "",
        school: "",
        status: ""
      },
      currentTicket: {},
      staticPage: {
        page: 1,
        pagesize: 10,
        total: 0
      }
    };
  },
  mounted() {
    this.loadStaticList(); // 发票申请
  },
  methods: {
    showTicketDetail(row) {
      this.currentTicket = row;
      this.isTicketDetailShow = true;
      this.getTicketDetail();
    },
    getTicketDetail() {
      axios
        .request({
          method: "post",
          url: "/order/orderInvoice/queryApplyInvoiceDetail",
          data: {
            orderInvoiceId: this.currentTicket.orderInvoiceId
          }
        })
        .then(data => {
          let res = data.data;
          if (res.code == 200) {
            let {
              titleType,
              title,
              dutyNo,
              busTypeName,
              remark,
              payPrice,
              email
            } = res.data;
            this.ticketDetailForm.type = titleType;
            this.ticketDetailForm.title = title;
            if (titleType == 1) {
              this.ticketDetailForm.taxNo = dutyNo;
            }
            this.ticketDetailForm.taxContent = busTypeName;
            this.ticketDetailForm.remark = remark;
            this.ticketDetailForm.money = payPrice;
            this.ticketDetailForm.email = email;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        });
    },
    toSendTicket(row) {
      this.currentTicket = row;
      this.isSendShow = true;
      this.ticketForm.pdfUrl = "";
      this.ticketForm.mailContent = "";
      this.ticketForm.mailTitle = `九斗发票（${row.busTypeName}）`;
      this.$nextTick(() => {
        this.$refs["ticketForm"].resetFields();
        this.$refs.ticketFile.clearFile();
      });
    },
    doSend() {
      // @todo  发送邮件
      this.$refs["ticketForm"].validate(valid => {
        if (valid) {
          this.sendLoading = true;
          axios
            .request({
              method: "post",
              url: "/order/orderInvoice/sendEmail",
              data: {
                orderInvoiceId: this.currentTicket.orderInvoiceId,
                picUrl: this.ticketForm.pdfUrl, // pdf链接
                emailTitle: this.ticketForm.mailTitle,
                emailContent: this.ticketForm.mailContent
              }
            })
            .then(data => {
              let res = data.data;
              this.sendLoading = false;
              if (res.code == 200) {
                this.isSendShow = false;
                this.loadStaticList(); // 发票申请
                this.$message({
                  message: "发送成功",
                  type: "success"
                });
              } else {
                this.$message({
                  message: res.msg,
                  type: "warning"
                });
              }
            });
        } else {
          return false;
        }
      });
    },
    handleFileChange(file) {
      if (file.type != "application/pdf") {
        this.$refs.ticketFile.clearFile();
        this.$message({
          type: "warning",
          message: "请选择pdf文件"
        });
        return;
      }

      this.uploadFile = file;
      if (!file) {
        this.ticketForm.pdfUrl = "";
        return;
      }
      // @todo  上传发票pdf
      let cosPath =
        "/omsOrderInvoice/" +
        dateStr("YYYYMMDD") +
        "/" +
        new Date().valueOf() +
        ".pdf";
      const form = new FormData();
      // 文件对象
      form.append("file", file);
      form.append("cosPath", cosPath);
      form.append("dev", "prod");
      this.isUploading = true;
      axios
        .request({
          method: "post",
          url: `${process.env.BASE_URL_V3}/common/feign/upload/uploadConven`,
          data: form
        })
        .then(res => {
          if (res.status === 200) {
            let { sourceUrl } = res.data;
            this.isUploading = false;
            this.ticketForm.pdfUrl = sourceUrl;
          } else {
            this.isUploading = false;

            this.$message({
              type: "warning",
              message: "上传失败"
            });
          }
        });
    },
    // 时间
    formatTime(time) {
      if (time) {
        return format(time);
      }
      return "";
    },
    // 金额
    formatMoney(money) {
      if (money) {
        return money / 100.0;
      }
      return 0;
    },
    copyInfo() {
      let type =
        this.ticketDetailForm.type == 1
          ? `抬头类型：企业\r\n`
          : `抬头类型：个人/非企业\r\n`;
      let title = `发票抬头：${this.ticketDetailForm.title}\r\n`;
      let taxNo = "税号：" + this.ticketDetailForm.taxNo + "\r\n";
      let taxContent = "发票内容：" + this.currentTicket.busTypeName + "\r\n";
      let remark = "备注：" + this.ticketDetailForm.remark + "\r\n";
      let money = "发票金额：" + `￥${this.currentTicket.payPrice}元` + "\r\n";
      let email = "邮箱：" + this.ticketDetailForm.email + "\r\n";
      let content = "";
      if (this.ticketDetailForm.type == 1) {
        content = type.concat(title, taxNo, taxContent, remark, money, email);
      } else {
        content = type.concat(title, taxContent, remark, money, email);
      }
      // 使用textarea支持换行，使用input不支持换行
      const textarea = document.createElement("textarea");
      textarea.value = content;
      document.body.appendChild(textarea);
      textarea.select();
      if (document.execCommand("copy")) {
        document.execCommand("copy");
        //alert(content);
        this.$message({
          message: "复制成功",
          type: "success"
        });
      }
      document.body.removeChild(textarea);
    },
    // 发票申请
    onSearchStatic() {
      this.staticPage.page = 1;
      this.loadStaticList();
    },
    loadStaticList() {
      this.loading.staticList = true;
      let data = {};
      data.pageNo = this.staticPage.page;
      data.pageSize = this.staticPage.pagesize;
      if (this.staticForm.phone) {
        data.mobile = this.staticForm.phone;
      }
      if (this.staticForm.teacherName) {
        data.username = this.staticForm.teacherName;
      }
      if (this.staticForm.school) {
        data.school = this.staticForm.school;
      }
      if (this.staticForm.status === "0" || this.staticForm.status === "1") {
        data.handleStatus = this.staticForm.status;
      }
      axios
        .request({
          method: "post",
          url: "/order/orderInvoice/queryApplyInvoicePage",
          data: data
        })
        .then(res => {
          this.loading.staticList = false;
          let ret = res.data;
          if (ret.code == 200) {
            this.staticList = ret.data.records;
            this.staticPage.total = ret.data.total;
          }
        })
        .catch(() => {
          this.loading.staticList = false;
        });
    }
  }
};
</script>
