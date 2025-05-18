<template>
  <el-container class="codeBind">
    <el-header height="50px">
      <span></span>
      <span class="code" @click="toCode">防伪码管理</span>
      <i class="el-icon-arrow-right"></i> <span>绑定</span>
    </el-header>
    <el-main>
      <el-form size="small" :inline="true">
        <el-form-item label="批次">
          <el-select
            v-model="bindForm.pici"
            placeholder="请选择批次"
            clearable
            @change="piciChangeSearch($event)"
            style="width: 150px;"
          >
            <el-option
              v-for="item in piciData"
              :label="`第${item.pici}批次`"
              :value="item.pici"
              :key="item.pici"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="序号">
          <el-input-number
            v-model="bindForm.beginNum"
            :min="1"
            controls-position="right"
            style="width: 120px;"
          ></el-input-number>
          -
          <el-input-number
            v-model="bindForm.endNum"
            :min="1"
            controls-position="right"
            style="width: 120px;"
          ></el-input-number>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="search"
            size="small"
          ></el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button @click="toCode" size="small">返回</el-button>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <el-table
        :data="dataList"
        v-loading="tableLoading"
        style="margin-top:15px;"
        border
        :header-cell-style="{
          'background-image':
            'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
          color: '#333333',
          height: '40px',
          padding: '0'
        }"
      >
        <el-table-column label="状态" prop="pici" align="center">
          <div slot-scope="scope">
            <span v-if="scope.row.codeStatus == 0">可占用</span>
            <span v-else-if="scope.row.codeStatus == 1">已占用</span>
            <span v-else-if="scope.row.codeStatus == 2">已失效</span>
          </div>
        </el-table-column>
        <el-table-column
          label="防伪码数量"
          prop="codeAmount"
          align="center"
        ></el-table-column>
        <el-table-column
          label="书名"
          prop="textbookName"
          align="center"
        ></el-table-column>
        <el-table-column
          label="作者"
          prop="textbookauthorName"
          align="center"
        ></el-table-column>
        <el-table-column
          label="书号"
          prop="textbookNum"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="150px">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.codeStatus == 0"
              size="mini"
              type="text"
              @click="handleBindBook(scope.row)"
              >绑定教材</el-button
            >
            <el-button
              v-if="scope.row.codeStatus == 1"
              size="mini"
              type="text"
              @click="handleReplaceBook(scope.row)"
              >替换教材</el-button
            >
            <span v-if="scope.row.codeStatus == 2">已失效，不能操作</span>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <!-- 绑定弹框 -->
    <el-dialog
      :visible.sync="isBindShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>{{ dialogTitle }}</div>
        </div>
      </template>
      <el-form @submit.native.prevent style="margin:0 60px">
        <el-form-item>
          <el-input
            v-model.trim="textbookNum"
            size="small"
            placeholder="请输入书号"
            style="width: 350px;"
          ></el-input>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="handleSearchBook"
            size="small"
          ></el-button>
        </el-form-item>
      </el-form>
      <div v-if="showTsInfo">
        <div v-if="bookInfo.textbookId" style="margin-left:60px">
          <span>{{ bookInfo.textbookName }}</span>
          <span style="margin-left:30px">{{
            bookInfo.textbookAuthorName
          }}</span>
          <span style="margin-left:30px">{{ bookInfo.textbookNum }}</span>
        </div>
        <div v-else style="text-align: center">该书号不存在，请重新输入</div>
      </div>
      <span slot="footer" v-if="bookInfo.textbookId">
        <el-button size="small" type="primary" @click="doBindBook"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import axios from "@/libs/api.request";
export default {
  components: {},
  data() {
    return {
      dataList: [],
      tableLoading: false,
      piciData: [], //批次的List
      bindForm: {
        pici: "",
        beginNum: "1",
        endNum: "1"
      },
      isBindShow: false,
      dialogTitle: "",
      textbookNum: "",
      bookInfo: {
        textbookId: ""
      },
      showTsInfo: false,
      expectAmount: "", //记录绑定教材的个数
      bindPici: "", //记录绑定教材的批次
      oldBookId: "", //记录已绑教材的ID
      bindBeginNum: "",
      bindEndNum: ""
    };
  },
  methods: {
    toCode() {
      this.$router.push({
        name: "code"
      });
    },
    //加载table列表
    loadData() {
      if (this.bindForm.beginNum > this.bindForm.endNum) {
        this.$message({
          type: "warning",
          message: "范围起始不能大于截止"
        });
        return;
      }
      if (!this.bindForm.pici) {
        this.$message({
          type: "warning",
          message: "请选择批次"
        });
        return;
      }
      this.tableLoading = true;
      axios
        .request({
          method: "post",
          url: "/v1/qrCode/selCodesStatusInfoByPiciAndNum",
          data: {
            pici: this.bindForm.pici,
            beginNum: this.bindForm.beginNum,
            endNum: this.bindForm.endNum
          }
        })
        .then(res => {
          this.tableLoading = false;
          let ret = res.data;
          if (ret.code == 200) {
            if (ret.data) {
              this.dataList = ret.data;
              this.bindBeginNum = ret.data[ret.data.length - 2];
              this.bindEndNum = ret.data[ret.data.length - 1];
              this.dataList = this.dataList.slice(0, ret.data.length - 2);
            } else {
              this.dataList = [];
            }
          }
        });
    },
    //批次变化时查询数据
    piciChangeSearch(pici) {
      if (pici) {
        let currentObj = {};
        currentObj = this.piciData.find(item => {
          //这里的userRoleList就是上面遍历的数据源
          return item.pici === pici; //筛选出匹配数据
        });
        this.bindForm.beginNum = currentObj.minNum;
        this.bindForm.endNum = currentObj.maxNum;
        this.search();
      } else {
        this.bindForm.beginNum = "1";
        this.bindForm.endNum = "1";
        this.dataList = [];
      }
    },
    // 查询btn
    search() {
      this.loadData();
    },
    // 加载 批次列表
    loadPici() {
      axios
        .request({
          method: "post",
          url: "/v1/qrCode/selPicisByOrgId"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.piciData = ret.data;
          }
        });
    },
    handleBindBook(row) {
      this.oldBookId = "";
      this.expectAmount = row.codeAmount;
      this.bindPici = row.pici;
      this.textbookNum = "";
      this.showTsInfo = false;
      this.bookInfo = {};
      this.dialogTitle = "绑定教材";
      this.isBindShow = true;
    },
    handleReplaceBook(row) {
      this.oldBookId = row.textbookId;
      this.textbookNum = "";
      this.showTsInfo = false;
      this.bookInfo = {};
      this.dialogTitle = "替换教材";
      this.isBindShow = true;
    },
    handleSearchBook() {
      this.showTsInfo = false;
      this.bookInfo = {};
      axios
        .request({
          method: "post",
          url: "/v1/textbook/selTextbookInforByTbNum",
          data: {
            textbookNum: this.textbookNum
          }
        })
        .then(res => {
          let ret = res.data;
          this.showTsInfo = true;
          if (ret.code == 200) {
            if (ret.data) {
              this.bookInfo = ret.data;
            } else {
              this.bookInfo = {};
            }
          }
        });
    },
    doBindBook() {
      let url = "";
      let data = {};
      if (this.oldBookId) {
        url = "v1/qrCode/validCodesRebindTextbook";
        data.newTextbookId = this.bookInfo.textbookId;
        data.oldTextbookId = this.oldBookId;
        data.type = this.bookInfo.type;
      } else {
        url = "v1/qrCode/codesBindTextbookWithExpectAmount";
        data.pici = this.bindPici;
        data.textbookId = this.bookInfo.textbookId;
        data.expectAmount = this.expectAmount;
        data.type = this.bookInfo.type;
      }
      data.beginNum = this.bindBeginNum;
      data.endNum = this.bindEndNum;
      axios
        .request({
          method: "post",
          url: url,
          data: data
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.loadData();
            this.isBindShow = false;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    }
  },
  mounted() {
    this.loadPici();
  }
};
</script>

<style lang="scss">
.codeBind {
  .el-header {
    background: #fff;
    line-height: 50px;
    padding: 0 43px;
    .code {
      cursor: pointer;
      color: #2ba1f4;
    }
  }
  .el-main {
    margin: 22px 20px;
    background: #ffffff;
    border-radius: 4px;
    min-height: 700px;
    padding: 18px 18px 70px;
    .el-divider--horizontal {
      margin: 0px 0 30px;
    }
    .input-with-select .el-input-group__prepend {
      background-color: #fff;
    }
  }
}
</style>
