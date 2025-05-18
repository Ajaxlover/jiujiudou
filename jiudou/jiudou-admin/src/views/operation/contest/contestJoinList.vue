<template>
  <el-container class="cloudCourse">
    <el-header style="height: 50px">
      <span @click="toExamManage" style="cursor:pointer;color:#2BA1F4;"
        >竞赛列表</span
      >
      <i class="el-icon-arrow-right"></i>
      <span>报名列表</span>
    </el-header>
    <el-main>
      <div class="top">
        <div class="left-form">
          <el-form
            :inline="true"
            class="demo-form-inline"
            @submit.native.prevent
          >
            <el-form-item>
              <el-input
                v-model.trim="searchForm.examName"
                placeholder="请输入学生姓名/学校/学号/手机号"
                style="width: 240px"
                size="small"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item>
              <el-date-picker
                size="small"
                v-model="searchForm.startTime"
                placeholder="选择开始时间"
                type="datetime"
                clearabletype="date"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="timestamp"
                :style="{ width: '100%' }"
              >
                >
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-date-picker
                size="small"
                v-model="searchForm.endTime"
                placeholder="选择结束时间"
                type="datetime"
                clearabletype="date"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="timestamp"
                :style="{ width: '100%' }"
              >
                >
              </el-date-picker>
            </el-form-item> -->
            <!-- popper-class="popper-select" -->
            <el-form-item label="">
              <el-select
                :popper-append-to-body="false"
                style="width: 120px"
                size="small"
                v-model="searchForm.status"
                placeholder="请选择状态"
                @change="searchExam"
              >
                <el-option label="全部" value=""></el-option>
                <el-option label="待缴费" value="1"></el-option>
                <el-option label="已缴费" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="报名方式">
              <el-select
                :popper-append-to-body="false"
                style="width: 120px"
                size="small"
                v-model="searchForm.inType"
                placeholder="请选择状态"
                @change="searchExam"
              >
                <el-option label="全部" value=""></el-option>
                <el-option label="个人" value="0"></el-option>
                <el-option label="集体" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="searchExam"
                size="small"
              ></el-button>
            </el-form-item>
          </el-form>
        </div>

        <div class="operateBtn">
          <el-button size="small" type="primary" @click="toPartIn"
            >集体报名</el-button
          >
          <el-button size="small" type="primary" @click="showOrderList"
            >集体订单</el-button
          >
          <el-button
            @click="exportJoinList"
            :disabled="isAbleExport"
            size="small"
            type="primary"
            >导出</el-button
          >
        </div>
      </div>
      <div class="main">
        <el-table
          :data="examList"
          border
          :header-cell-style="{
            'background-image':
              'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
            color: '#333333',
            height: '40px',
            padding: '0'
          }"
          :row-style="{ height: '60px' }"
          v-loading="loading.tableLoading"
        >
          <!-- <el-table-column align="center" label="" width="38">
            <template slot-scope="scope">
              <el-radio
                class="exam-radio"
                :label="scope.row.examId"
                v-model="radioSelect"
                @change.native="getRow(scope.$index, scope.row)"
              >
                <span>&nbsp</span>
              </el-radio>
            </template>
          </el-table-column> -->
          <el-table-column
            prop="name"
            label="学生姓名"
            align="center"
            min-width="100"
          >
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="手机号"
            align="center"
            min-width="80"
          >
          </el-table-column>
          <el-table-column
            prop="school"
            label="学校"
            align="center"
            min-width="60"
          >
          </el-table-column>
          <el-table-column
            prop="department"
            label="学院"
            align="center"
            min-width="120"
          >
          </el-table-column>
          <el-table-column
            prop="profession"
            label="专业"
            align="center"
            min-width="120"
          >
          </el-table-column>
          <el-table-column
            prop="number"
            label="学号"
            align="center"
            min-width="120"
          >
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱"
            align="center"
            min-width="120"
          >
          </el-table-column>
          <el-table-column
            prop="appointTeacher"
            label="指导老师"
            align="center"
            min-width="120"
          >
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="报名时间"
            align="center"
            min-width="100"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.createTime">{{
                dateFormat1(scope.row.createTime)
              }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="registerType"
            label="报名途径"
            align="center"
            min-width="60"
          >
            <template slot-scope="scope">
              <span>{{
                scope.row.registerType == 0 ? "个人报名" : "集体报名"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="是否缴费"
            align="center"
            min-width="60"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status == 1" type="warning"
                >待缴费</el-tag
              >
              <el-tag v-if="scope.row.status == 2" type="success"
                >已缴费</el-tag
              >
              <span v-if="scope.row.status == 0">-</span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="score"
            label="成绩"
            align="center"
            min-width="120"
          >
          </el-table-column> -->
          <!-- <el-table-column
            prop="status"
            label="是否缴费"
            align="center"
            min-width="60"
          >
            <template slot-scope="scope">
              {{ statusFormat(scope.row) }}
            </template>
          </el-table-column> -->
        </el-table>
        <div class="tabelFooter">
          <div class="right-footer-first">
            从 {{ (this.page.currentPage - 1) * this.page.pagesize + 1 }} 到
            {{
              (this.page.currentPage - 1) * this.page.pagesize +
                this.examList.length
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

    <!-- 导入 -->
    <jd-dialog
      title="导入名单"
      top="15vh"
      :visible.sync="showImport"
      @sure="doImportSure"
    >
      <template slot="body">
        <div style="padding: 0 100px">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="70px"
          >
            <el-form-item label="学校" prop="partInSchool">
              <el-autocomplete
                size="small"
                v-model.trim="ruleForm.partInSchool"
                :fetch-suggestions="querySearch"
                placeholder="请选择学校"
                @select="handleSelectSchool"
                style="width:290px"
              ></el-autocomplete>
              <!-- <el-cascader
                size="small"
                v-model="partInSchool"
                placeholder="试试搜索：指南"
                :options="options"
                filterable
              ></el-cascader> -->
            </el-form-item>
            <el-form-item label="选择文件">
              <fileModal
                ref="subjectsFile"
                @fileChange="handleFileChange"
              ></fileModal>
              <div class="el-upload__tip" style="line-height:17px">
                当前仅支持后缀名为.xls的Excel文档;
              </div>
            </el-form-item>
          </el-form>
          <span>集体报名导入模板点击下载：</span
          ><el-button
            type="primary"
            size="mini"
            style="background:#11BCE4;border:none"
            @click="downloadFormwork"
            >竞赛集体报名导入模板.xls</el-button
          >
        </div>
      </template>
    </jd-dialog>

    <!-- 预览名单 -->
    <el-dialog
      top="6vh"
      v-if="isNameListShow"
      :visible.sync="isNameListShow"
      :lock-scroll="false"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="1000px"
      center
      class="name-list"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>名单预览</div>
        </div>
      </template>

      <!-- <div class="top">
        <el-input
          size="small"
          v-model.trim="keyWord"
          placeholder="请输入试卷名称"
          style="width: 300px"
          @keyup.enter.native="searchPaper"
        ></el-input>
        <el-button
          type="primary"
          @click="searchPaper"
          class="el-icon-search"
          size="small"
        ></el-button>
      </div> -->
      <div>注：<span style="color:red">红色</span>标记为竞赛已有重复名单</div>
      <el-table
        v-loading="loading.nameListLoading"
        :data="nameList"
        border
        style="margin-top:15px"
        :header-cell-style="{
          'background-image':
            'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
          color: '#333333',
          height: '40px',
          padding: '0'
        }"
      >
        <el-table-column label="学校" prop="school" align="center">
          <template slot-scope="scope">
            <!-- style="color:#2BA1F4;" -->
            <span :style="scope.row.duplicateFlag == true ? 'color:red' : ''">{{
              scope.row.school
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="学院" prop="department" align="center">
          <template slot-scope="scope">
            <span :style="scope.row.duplicateFlag == true ? 'color:red' : ''">{{
              scope.row.department
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="学号" prop="number" align="center">
          <template slot-scope="scope">
            <!-- style="color:#2BA1F4;" -->
            <span :style="scope.row.duplicateFlag == true ? 'color:red' : ''">{{
              scope.row.number
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="name" align="center">
          <template slot-scope="scope">
            <!-- style="color:#2BA1F4;" -->
            <span :style="scope.row.duplicateFlag == true ? 'color:red' : ''">{{
              scope.row.name
            }}</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- <div class="tabelFooter">
        <div class="right-footer-first">
          从
          {{ (this.paperPage.currentPage - 1) * this.paperPage.pagesize + 1 }}
          到
          {{
            (this.paperPage.currentPage - 1) * this.paperPage.pagesize +
              this.nameList.length
          }}
          记录，共 {{ paperPage.total }} 条
        </div>
        <el-pagination
          layout="prev, pager, next, jumper"
          background
          :page-sizes="[10, 30, 50]"
          :total="paperPage.total"
          :current-page.sync="paperPage.currentPage"
          :page-size="paperPage.pagesize"
          @current-change="getNameList"
        >
        </el-pagination>
      </div> -->

      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          :disabled="duplicateFlag"
          type="primary"
          :loading="isBtnLoading"
          @click="showNamePay"
          >确定</el-button
        >

        <el-button size="small" @click="isNameListShow = false">取消</el-button>
      </span>
      <!-- <el-scrollbar height="300px"> </el-scrollbar> -->
    </el-dialog>

    <!-- 支付弹窗 -->
    <el-dialog
      title=""
      :visible.sync="isPayShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :before-close="handleClose"
      width="45%"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>竞赛支付(集体报名)</div>
        </div>
      </template>
      <div>
        <el-row>
          <div class="course-name">竞赛名称:{{ mhName }}</div>
        </el-row>
        <el-row
          ><div class="course-name">
            价格:
            <span style="color: #f0742b">￥{{ partInPrice }}</span>
          </div></el-row
        >
        <el-row>
          <div class="course-name">支付方式:</div>
        </el-row>
        <section class="pay-type">
          <ul>
            <li :class="payType == 2 ? 'active' : ''" @click="payType = 2">
              <span class="pay-type-icon2"></span>微信支付
            </li>
            <li :class="payType == 1 ? 'active' : ''" @click="payType = 1">
              <span class="pay-type-icon1"></span>支付宝
            </li>
          </ul>
        </section>
        <section>
          <div style="display:flex">
            <el-button @click="goPay" class="but-pay">去付款</el-button>
            <el-button @click="delayPay" class="but-pay">延迟付费</el-button>
          </div>
        </section>
      </div>
    </el-dialog>

    <!-- 考试扫码支付 -->
    <el-dialog
      :title="`竞赛名称：${mhName}`"
      :visible.sync="isQRcode"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :before-close="handleCode"
      width="40%"
    >
      <section style="width: 150px; margin: 0 auto">
        <section style="text-align: center; margin-bottom: 6px">
          扫一扫付款
        </section>
        <section class="money-pay-num">￥{{ partInPrice }}元</section>
        <section class="qrcode">
          <vue-qr
            :text="qrcode"
            colorDark="#000"
            colorLight="#fff"
            :margin="5"
            :size="100"
          ></vue-qr>
          <img
            src="../../../assets/img/zfb1.png"
            class="zfb-img"
            width="100%"
          />
          <section class="money-pay-text">
            <img src="../../../assets/img/qrcode.png" width="100%" />
            <div class="pay-text">
              <p>打开手机支付</p>
              <p>扫一扫付款</p>
            </div>
          </section>
        </section>
        <section v-if="payType == 2" class="qrcode-t">微信扫码支付</section>
        <section v-if="payType == 1" class="qrcode-t">支付宝扫码支付</section>
      </section>
      <section style="text-align: center; margin: 20px 0">
        <span slot="footer" class="dialog-footer">
          <!-- <el-button class="but-pay" @click="handleCode">取消</el-button> -->
        </span>
      </section>
    </el-dialog>

    <!-- 集体订单 -->
    <el-dialog
      top="6vh"
      v-if="isOrderListShow"
      :visible.sync="isOrderListShow"
      :lock-scroll="false"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="1000px"
      center
      class="name-list"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>集体订单</div>
        </div>
      </template>

      <!-- <div class="top">
        <el-input
          size="small"
          v-model.trim="keyWord"
          placeholder="请输入试卷名称"
          style="width: 300px"
          @keyup.enter.native="searchPaper"
        ></el-input>
        <el-button
          type="primary"
          @click="searchPaper"
          class="el-icon-search"
          size="small"
        ></el-button>
      </div> -->
      <el-table
        v-loading="loading.orderListLoading"
        :data="orderList"
        border
        style="margin-top:15px"
        :header-cell-style="{
          'background-image':
            'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
          color: '#333333',
          height: '40px',
          padding: '0'
        }"
      >
        <el-table-column label="学校" prop="school" align="center">
          <template slot-scope="scope">
            <!-- style="color:#2BA1F4;" -->
            <span>{{ scope.row.school }}</span>
          </template>
        </el-table-column>
        <el-table-column label="人数" prop="stuNum" align="center">
        </el-table-column>
        <el-table-column label="金额（元）" prop="price" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.price == 0 ? "-" : scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="totalScore" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status == 0"
              size="mini"
              type="text"
              style="margin-left:0"
              @click="payBatch(scope.row)"
              >待付款</el-button
            >
            <el-button
              v-if="scope.row.status == 1"
              size="mini"
              type="text"
              style="margin-left:0"
              @click="payBatch(scope.row)"
              >延迟付款</el-button
            >
            <el-button
              v-if="scope.row.status == 2"
              size="mini"
              type="text"
              style="margin-left:0"
              >已付款</el-button
            >
            <el-button
              size="mini"
              type="text"
              style="margin-left:0"
              @click="toShowDetail(scope.row)"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="tabelFooter">
        <div class="right-footer-first">
          从
          {{ (this.orderPage.currentPage - 1) * this.orderPage.pagesize + 1 }}
          到
          {{
            (this.orderPage.currentPage - 1) * this.orderPage.pagesize +
              this.orderList.length
          }}
          记录，共 {{ orderPage.total }} 条
        </div>
        <el-pagination
          layout="prev, pager, next, jumper"
          background
          :page-sizes="[10, 30, 50]"
          :total="orderPage.total"
          :current-page.sync="orderPage.currentPage"
          :page-size="orderPage.pagesize"
          @current-change="getOrderList"
        >
        </el-pagination>
      </div>

      <!-- <el-scrollbar height="300px"> </el-scrollbar> -->
    </el-dialog>

    <!-- 集体订单查看 -->
    <el-dialog
      top="6vh"
      v-if="isBatchListShow"
      :visible.sync="isBatchListShow"
      :lock-scroll="false"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="800px"
      center
      class="name-list"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>批次名单查看</div>
        </div>
      </template>

      <!-- <div class="top">
        <el-input
          size="small"
          v-model.trim="keyWord"
          placeholder="请输入试卷名称"
          style="width: 300px"
          @keyup.enter.native="searchPaper"
        ></el-input>
        <el-button
          type="primary"
          @click="searchPaper"
          class="el-icon-search"
          size="small"
        ></el-button>
      </div> -->
      <el-table
        v-loading="loading.batchListLoading"
        :data="batchList"
        border
        style="margin-top:15px"
        :header-cell-style="{
          'background-image':
            'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
          color: '#333333',
          height: '40px',
          padding: '0'
        }"
      >
        <el-table-column label="学校" prop="school" align="center">
          <template slot-scope="scope">
            <!-- style="color:#2BA1F4;" -->
            <span>{{ scope.row.school }}</span>
          </template>
        </el-table-column>
        <el-table-column label="院系" prop="department" align="center">
        </el-table-column>
        <el-table-column label="学号" prop="number" align="center">
        </el-table-column>
        <el-table-column label="姓名" prop="name" align="center">
        </el-table-column>
        <el-table-column label="是否报名" prop="number" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 0" type="warning">未报名</el-tag>
            <el-tag v-if="scope.row.status == 1" type="success">已报名</el-tag>
          </template>
        </el-table-column>
      </el-table>

      <div class="tabelFooter">
        <div class="right-footer-first">
          从
          {{ (this.batchPage.currentPage - 1) * this.batchPage.pagesize + 1 }}
          到
          {{
            (this.batchPage.currentPage - 1) * this.batchPage.pagesize +
              this.batchList.length
          }}
          记录，共 {{ batchPage.total }} 条
        </div>
        <el-pagination
          layout="prev, pager, next, jumper"
          background
          :page-sizes="[10, 30, 50]"
          :total="batchPage.total"
          :current-page.sync="batchPage.currentPage"
          :page-size="batchPage.pagesize"
          @current-change="getBatchList"
        >
        </el-pagination>
      </div>

      <!-- <el-scrollbar height="300px"> </el-scrollbar> -->
    </el-dialog>
  </el-container>
</template>

<script>
import axios from "@/libs/api.request";
import { formatSS } from "@/utils/datetime";
import jdialog from "@/components/jdialog";
import fileModal from "@/components/fileModal";
import vueQr from "vue-qr";

export default {
  components: {
    "jd-dialog": jdialog,
    fileModal,
    vueQr
    // courseProtocol
  },
  data() {
    return {
      currentBatchId: "",
      isBatchListShow: false, // 批次名单查看
      isImportLoading: false,
      isBtnLoading: false,
      batchId: "",
      mhName: "",
      partInPrice: "",
      school: "",
      duplicateFlag: false, // 是否有重复名单
      isOrderListShow: false,
      orderList: [],
      batchList: [],
      qrcode: "",
      orderCode: "",
      timerId: "",
      isPayShow: false,
      isQRcode: false,
      payType: 2,
      isNameListShow: false,
      nameList: [], // 预览名单
      schoolList: [],
      ruleForm: {
        partInSchool: ""
      },
      rules: {
        partInSchool: [
          { required: true, message: "请选择学校", trigger: "change" }
        ]
      },
      orderPage: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      },
      batchPage: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      },
      paperPage: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      },
      uploadFile: null,
      showImport: false,
      id: this.$route.query.competeId,
      shareModal2: false,
      isShareShow: false,
      isTransPaperShow: false, // 转发
      shareLink: "",
      radioSelect: "",
      radioCheck: {},
      searchForm: {
        examName: "",
        startTime: null,
        endTime: null,
        status: "",
        inType: ""
      },
      examList: [],
      isBigImageShow: false,
      isAgreeShow: false,
      lockBook: false,
      bookAdded: false,
      keyWord: "",
      loading: {
        tableLoading: false,
        loadingChangePrice: false,
        nameListLoading: false,
        orderListLoading: false,
        batchListLoading: false
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
      pickerOptions: {
        // 时间不让选择今天以前的
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        }
      },
      // historyPrice: [],
      currentCourse: {},
      classList: [],
      classPage: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      },
      selectedClass: [],
      classKeyWord: "" // 班级名称
    };
  },
  computed: {
    isAbleTrans() {
      return this.selectedClass.length === 0;
    },
    isAbleExport() {
      return this.examList.length == 0;
    }
  },
  methods: {
    getBatchList() {
      this.loading.batchListLoading = true;
      axios
        .request({
          method: "post",
          url: `/exam/importStu/findStuPage`,
          data: {
            batchId: this.currentBatchId,
            pageNo: this.batchPage.currentPage,
            pageSize: this.batchPage.pagesize
          }
        })
        .then(res => {
          let ret = res.data;
          this.loading.batchListLoading = false;
          if (ret.code === 200) {
            this.batchList = ret.data.records;
            this.batchPage.total = ret.data.total;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        });
    },
    toShowDetail(row) {
      let { batchId } = row;
      this.currentBatchId = batchId;
      this.isBatchListShow = true;
      this.loading.batchListLoading = true;
      axios
        .request({
          method: "post",
          url: `/exam/importStu/findStuPage`,
          data: {
            batchId,
            pageNo: this.batchPage.currentPage,
            pageSize: this.batchPage.pagesize
          }
        })
        .then(res => {
          let ret = res.data;
          this.loading.batchListLoading = false;
          if (ret.code === 200) {
            this.batchList = ret.data.records;
            this.batchPage.total = ret.data.total;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        });
    },
    payBatch(row) {
      let { batchId } = row;
      axios
        .request({
          method: "post",
          url: `/exam/importStu/findBatchOrderInfo`,
          data: {
            batchId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.showImport = false;
            this.isNameListShow = false;
            this.mhName = ret.data.mhName;
            this.partInPrice = ret.data.price;
            this.isPayShow = true;
            this.batchId = ret.data.batchId;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        });
    },
    showOrderList() {
      this.isOrderListShow = true;
      this.getOrderList();
    },
    // 集体报名订单
    getOrderList() {
      axios
        .request({
          method: "post",
          url: `/exam/importStu/findBatchPage`,
          data: {
            mhId: this.id,
            pageNo: this.orderPage.currentPage,
            pageSize: this.orderPage.pagesize
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.orderList = ret.data.records;
            this.orderPage.total = ret.data.total;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        });
    },
    showNamePay() {
      this.isBtnLoading = true;
      axios
        .request({
          method: "post",
          url: `/exam/importStu/batchSave`,
          data: {
            mhId: this.id,
            school: this.school,
            dataListJson: JSON.stringify(this.nameList)
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            if (ret.data.status == -1) {
              // 免费
              this.$message({
                message: "导入成功",
                type: "success"
              });
              this.showImport = false;
              this.isNameListShow = false;
              this.isBtnLoading = false;
            } else {
              this.showImport = false;
              this.isNameListShow = false;
              this.mhName = ret.data.mhName;
              this.partInPrice = ret.data.price;
              this.isPayShow = true;
              this.batchId = ret.data.batchId;
              this.isBtnLoading = false;
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        });
    },
    goPay() {
      axios
        .request({
          method: "post",
          url: `/exam/importStu/codePay`,
          data: {
            batchId: this.batchId,
            chargeType: this.payType
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.qrcode = ret.data.codeUrl;
            this.orderCode = ret.data.orderCode;
            this.isPayShow = false;
            this.isQRcode = true;
            setTimeout(() => {
              this.queryPayStatus();
            }, 1500);
          } else {
            this.$message({
              type: "error",
              message: `${ret.msg}`
            });
          }
        });
    },
    delayPay() {
      axios
        .request({
          method: "post",
          url: `/exam/importStu/delayPay`,
          data: {
            batchId: this.batchId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.isPayShow = false;
            this.payType = 2;
            this.$message({
              type: "success",
              message: `操作成功`
            });
            if (this.isOrderListShow) {
              //刷新集体订单
              // this.orderPage.currentPage = 1;
              this.getOrderList();
            }
          } else {
            this.$message({
              type: "warning",
              message: `${ret.msg}`
            });
          }
        });
    },
    handleClose() {
      this.isPayShow = false;
      this.payType = 2;
    },
    handleCode() {
      this.payType = 2;
      this.isQRcode = false;
      clearTimeout(this.timerId);
    },
    queryPayStatus() {
      axios
        .request({
          method: "post",
          url: `/order/queryOrderPayStatus`,
          data: {
            orderCode: this.orderCode
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            // this.$message({
            //   title: "提示",
            //   message: "支付成功",
            //   type: "success",
            //   offset: 80
            // });
            this.isQRcode = false;
            if (this.isOrderListShow) {
              //刷新集体订单
              // this.orderPage.currentPage = 1;
              this.getOrderList();
            }
          } else {
            this.timerId = setTimeout(() => {
              this.queryPayStatus();
            }, 1500);
          }
        });
    },
    querySearch(queryString, cb) {
      var schools = this.schoolList;
      var results = queryString
        ? this.createFilter(queryString, schools)
        : schools;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString, schoolList) {
      let arr = [];
      schoolList.forEach(item => {
        if (item.value.includes(queryString)) {
          arr.push({
            value: item.value
          });
        }
      });
      return arr;
    },
    handleSelectSchool(item) {
      this.ruleForm.partInSchool = item.value;
    },
    getSchoolList() {
      axios
        .request({
          method: "post",
          url: `${process.env.BASE_URL_V3}/ebook/school/list`,
          data: {
            pageNo: 1,
            pageSize: 9999
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            let school = [];
            ret.data.records.forEach(element => {
              school.push({
                value: element.name
              });
            });
            this.schoolList = school;
          }
        });
    },
    // 获取预览名单
    getNameList() {
      this.loading.nameListLoading = true;
      axios
        .request({
          method: "post",
          url: ``,
          data: {
            pageNo: 1,
            pageSize: 9999
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.loading.nameListLoading = false;
          }
        });
    },
    handleFileChange(file) {
      this.uploadFile = file;
    },
    toPartIn() {
      this.showImport = true;
      this.$nextTick(function() {
        this.$refs["ruleForm"].resetFields();
        this.$refs.subjectsFile.clearFile();
      });
    },
    downloadFormwork() {
      // 导出模板
      let url =
        "https://find-1253402545.cos.ap-beijing.myqcloud.com/%E7%AB%9E%E8%B5%9B%E9%9B%86%E4%BD%93%E6%8A%A5%E5%90%8D%E6%A8%A1%E6%9D%BF.xls";
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    doImportSure() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          console.log(this.uploadFile);
          if (!this.uploadFile) {
            this.$message({
              message: "请导入名单",
              type: "warning"
            });
          }
          if (this.uploadFile.type != "application/vnd.ms-excel") {
            this.$message({
              message: "名单文件不是Excel格式，请检查",
              type: "warning"
            });
          }
          this.isNameListShow = true;
          let fd = new FormData();
          fd.append("file", this.uploadFile);
          fd.append("mhId", this.id);
          fd.append("school", this.ruleForm.partInSchool);
          this.loading.nameListLoading = true;
          axios
            .request({
              method: "post",
              url: "/exam/importStu/parseExcelData",
              data: fd
            })
            .then(
              function(data) {
                let res = data.data;
                this.loading.nameListLoading = false;

                if (res.code == 200) {
                  this.nameList = res.data.dataList;
                  this.duplicateFlag = res.data.duplicateFlag;
                  this.school = res.data.school;
                  this.isNameListShow = true;
                } else {
                  this.$message({
                    message: res.msg,
                    type: "warning"
                  });
                }
              }.bind(this)
            )
            .catch(() => {
              this.$message({
                message: "服务器异常",
                type: "warning"
              });
            });
        } else {
          return false;
        }
      });
    },
    // 导出报名列表
    exportJoinList() {
      let url =
        process.env.BASE_URL +
        "/exam/masterHeadStu/exportListXls?masterheadId=" +
        this.id +
        "&token=" +
        this.$store.state.user.token;
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    toExamManage() {
      this.$router.push({
        path: "/operation/contestManage"
      });
    },
    // 转发试卷
    handleCloseTransPaper() {
      this.classKeyWord = "";
      this.classPage.currentPage = 1;
      this.selectedClass = [];
      this.isTransPaperShow = false;
    },
    transExam() {
      if (!this.radioSelect) {
        this.$message({
          type: "warning",
          message: "请先选择考试"
        });
        return;
      }
      this.getClassList();
    },
    handleSelectionChange(val) {
      this.selectedClass = val;
    },
    // 单行点击
    // handleRowClick(row, column, event) {
    //   this.radioSelect = row.examId;
    //   this.radioCheck = row;
    // },
    getRow(i, row) {
      this.radioCheck = row;
    },

    loadData() {
      this.loading.tableLoading = true;
      let data = {
        masterheadId: this.id
      };
      // data.uid = 661605;
      data.pageNo = this.page.currentPage;
      data.pageSize = this.page.pagesize;
      if (this.searchForm.examName) {
        data.keyWord = this.searchForm.examName;
      }
      if (this.searchForm.inType) {
        data.registerType = this.searchForm.inType;
      }
      // if (this.searchForm.startTime) {
      //   data.createExamBeginTime = this.searchForm.startTime;
      // }
      // if (this.searchForm.endTime) {
      //   data.createExamEndTime = this.searchForm.endTime;
      // }
      if (this.searchForm.status) {
        data.status = this.searchForm.status;
      }
      axios
        .request({
          method: "post",
          url: "/exam/masterHeadStu/list",
          data: data
        })
        .then(res => {
          this.loading.tableLoading = false;
          let ret = res.data;
          if (ret.code === 200) {
            this.examList = ret.data.records;
            this.page.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    searchClass() {
      this.classPage.currentPage = 1;
      this.getClassList();
    },
    getClassList() {
      let data = {};
      data.pageNo = this.classPage.currentPage;
      data.pageSize = this.classPage.pagesize;
      if (this.classKeyWord) {
        data.className = this.classKeyWord;
      }
      axios
        .request({
          method: "post",
          url: "/clazz/clazz/myAllClassPage",
          data: data
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.isTransPaperShow = true;
            this.classList = ret.data.data;
            this.classPage.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    searchExam() {
      this.page.currentPage = 1;
      this.loadData();
    },
    toCreateExam() {
      this.$router.push({
        path: "/operation/createContest"
      });
    },
    toExamAnalysis(row) {
      this.$router.push({
        path: "/exam/examAnalysis",
        query: {
          examId: row.examId,
          isAdmin: 1
        }
      });
    },
    dateFormat(row) {
      return formatSS(row);
    },
    dateFormat1(row) {
      let d = new Date(row);
      return formatSS(d.getTime());
    },
    statusFormat(row) {
      let statusText = "";
      switch (row.status) {
        case 0:
          statusText = "未发布";
          break;
        case 1:
          statusText = "已发布";

          break;
        case 2:
          statusText = "进行中";

          break;
        default:
          statusText = "已结束";

          break;
      }
      return statusText;
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

    //删除
    deleteExam(row) {
      this.$confirm("是否删除该考试?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/exam/exam/delete",
              data: {
                examId: row.examId
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.loadData();
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
    // 去发布考试
    toPublishExam(row) {
      this.$router.push({
        path: "/exam/examPublish",
        query: {
          examId: row.examId
        }
      });
    },
    toViewSetting(row) {
      this.$router.push({
        path: "/exam/viewExamSetting",
        query: {
          examId: row.examId,
          isAdmin: 1
        }
      });
    },
    // 去成绩批改
    toExamCheck(row) {
      this.$router.push({
        path: "/exam/examCheck",
        query: {
          examId: row.examId
        }
      });
    }
  },
  mounted() {
    this.loadData();
    this.getSchoolList();
  }
};
</script>

<style lang="scss" scoped>
.course-name {
  font-size: 18px;
  margin-bottom: 20px;
}
.but-pay {
  background-color: #409eff;
  border-color: #409eff;
  // width: 50%;
  width: 30%;
  display: block;
  margin: 0 auto;
  margin-top: 40px;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  padding: 14px 0;
}
.pay-type {
  ul li {
    width: 180px;
    height: 60px;
    line-height: 60px;
    border-radius: 6px;
    text-align: center;
    font-size: 18px;
    border: 1px solid #d8dae2;
    display: inline-block;
    margin-right: 20px;
    cursor: pointer;
    //   transition: .1s;
    span {
      width: 26px;
      height: 26px;
      display: inline-block;
      vertical-align: middle;
      margin-right: 5px;
    }
    .pay-type-icon1 {
      background: url("../../../assets/img/zfb.png") no-repeat #fff;
      background-size: 100%;
    }
    .pay-type-icon2 {
      background: url("../../../assets/img/wx.png") no-repeat #fff;
      background-size: 100%;
    }
  }
  .active {
    border: 2px solid #409eff;
  }
}
.money-pay-num {
  color: #f0742b;
  text-align: center;
  font-weight: bold;
  font-size: 18px;
}
.money-pay-text {
  color: #666;
  font-size: 12px;
  // margin-top: 10px;
  text-align: center;
  .pay-text {
    display: inline-block;
    text-align: left;
    vertical-align: middle;
  }
  img {
    width: 36px;
    height: 36px;
    vertical-align: middle;
  }
}
.but-pay {
  background-color: #409eff;
  border-color: #409eff;
  width: 30%;
  display: block;
  margin: 0 auto;
  margin-top: 40px;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  padding: 14px 0;
}
.qrcode {
  display: flex;
  flex-direction: column;
  border: 1px #d1d1d1 solid;
  padding-bottom: 10px;
  margin-top: 5px;
  position: relative;
  .zfb-img {
    position: absolute;
    right: -161px;
    top: -70px;
  }
}
.qrcode-t {
  color: #333;
  font-size: 16px;
  text-align: center;
  margin-top: 10px;
}

/deep/ .popper-select {
  position: absolute !important;
  top: 25px !important;
  left: 0px !important;
}
.cloudCourse {
  .name-list {
    /deep/ .el-dialog__body {
      height: 75vh;
      overflow: hidden;
      overflow-y: auto;
    }
  }

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
      .left-form {
        float: left;
      }
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
    }
  }
  .el-date-editor .el-range-separator {
    width: auto;
  }
}
</style>
