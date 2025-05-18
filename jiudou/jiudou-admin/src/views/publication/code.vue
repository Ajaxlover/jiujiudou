<template>
  <el-container class="code">
    <el-header height="50px">
      <span>防伪码管理</span>
    </el-header>
    <el-main>
      <ul class="codeBtn">
        <li @click="toCodeSearch">
          <div>
            <img src="@/assets/menuIcon/codeSearch.png" alt="" />
            <span>查询</span>
          </div>
          <div>查询防伪码的使用情况</div>
        </li>
        <li @click="toCodeBind">
          <div>
            <img src="@/assets/menuIcon/codeBind.png" alt="" />
            <span>绑定</span>
          </div>
          <div>将教材与防伪码绑定</div>
        </li>
        <li @click="toCodeOperate">
          <div>
            <img src="@/assets/menuIcon/codeOperate.png" alt="" />
            <span>生成/导入/导出</span>
          </div>
          <div>批量生成防伪码、导入第三方生成的防伪码、导出防伪码内容</div>
        </li>
      </ul>
      <el-divider></el-divider>
      <div style="color:#2BA1F4;font-size:18px;">
        机构防伪码统计
        <span
          style="color:#999999;;font-size:14px;float:right;line-height: 24px;"
          >上次更新：{{ getDay(-1)
          }}<span style="margin-left:10px">00:00</span></span
        >
      </div>
      <el-table
        :data="dataList"
        :tree-props="{ children: 'books' }"
        row-key="id"
        v-loading="tableLoading"
        style="margin-top:15px;"
        :header-cell-style="{
          'background-image':
            'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
          color: '#333333',
          height: '40px',
          padding: '0'
        }"
      >
        <el-table-column label="批次" prop="pici"></el-table-column>
        <el-table-column
          label="防伪码数量"
          prop="totalAmount"
          align="center"
        ></el-table-column>
        <el-table-column
          label="未绑定"
          prop="freeCodeAmount"
          align="center"
        ></el-table-column>
        <el-table-column
          label="有效"
          prop="validCodeAmount"
          align="center"
        ></el-table-column>
        <el-table-column
          label="已失效"
          prop="invalidCodeAmount"
          align="center"
        ></el-table-column>
        <el-table-column
          label="已绑定书名"
          prop="bookName"
          align="center"
        ></el-table-column>
        <el-table-column
          label="已绑定书号"
          prop="bookNumber"
          align="center"
        ></el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
import axios from "@/libs/api.request";
export default {
  components: {},
  data() {
    return {
      dataList: [],
      tableLoading: false
    };
  },
  methods: {
    loadData() {
      this.tableLoading = true;
      axios
        .request({
          method: "post",
          url: "/v1/qrCode/selOrgCodeRecord"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.tableLoading = false;
            if (ret.data) {
              ret.data.data.forEach(element => {
                element.id = this.generateRandomBase64Id();
                element.books.forEach(v => {
                  v.id = this.generateRandomBase64Id();
                });
              });
              this.dataList = ret.data.data;
            } else {
              this.dataList = [];
            }
          }
        });
    },
    generateRandomBase64Id() {
      let randomId = "";
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

      for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomId += characters.charAt(randomIndex);
      }

      const base64Id = btoa(randomId);

      return base64Id;
    },
    //去防伪码查询
    toCodeSearch() {
      this.$router.push({
        name: "codeSearch"
      });
    },
    //点击查询按钮
    toCodeOperate() {
      this.$router.push({
        name: "codeOperate"
      });
    },
    //点击绑定按钮
    toCodeBind() {
      this.$router.push({
        name: "codeBind"
      });
    },
    getDay(num) {
      var today = new Date();
      var nowTime = today.getTime();
      var ms = 24 * 3600 * 1000 * num;
      today.setTime(parseInt(nowTime + ms));
      var oYear = today.getFullYear();
      var oMoth = (today.getMonth() + 1).toString();
      if (oMoth.length <= 1) oMoth = "0" + oMoth;
      var oDay = today.getDate().toString();
      if (oDay.length <= 1) oDay = "0" + oDay;
      return oYear + "-" + oMoth + "-" + oDay;
    }
  },
  mounted() {
    this.loadData();
  }
};
</script>

<style lang="scss">
.code {
  .el-header {
    background: #fff;
    line-height: 50px;
    padding: 0 43px;
  }
  .el-main {
    margin: 22px 20px;
    background: #ffffff;
    border-radius: 4px;
    min-height: 700px;
    padding: 12px 18px 70px;
    .el-divider--horizontal {
      margin: 10px 0 30px;
    }
    .codeBtn {
      border-radius: 4px;
      padding: 0;
      margin: 0;
      list-style: none;
      overflow: hidden;
      li {
        overflow: hidden;
        width: 270px;
        height: 126px;
        border-radius: 4px;
        float: left;
        margin-right: 11px;
        padding: 24px 35px;
        margin-bottom: 11px;
        cursor: pointer;
        div:first-child {
          font-size: 21px;
          font-weight: 600;
          color: rgba(13, 67, 118, 1);
          line-height: 38px;
        }
        div:nth-child(2) {
          margin-top: 10px;
          font-size: 12px;
          color: rgba(13, 67, 118, 1);
          line-height: 17px;
        }
        div {
          overflow: hidden;
          img {
            width: 38px;
            height: 38px;
            float: left;
          }
          span {
            margin-left: 15px;
            float: left;
          }
        }
      }
      li:nth-child(1) {
        background: rgba(105, 124, 203, 0.16);
      }
      li:nth-child(2) {
        background: rgba(91, 153, 253, 0.16);
      }
      li:nth-child(3) {
        background: rgba(57, 188, 249, 0.16);
      }
    }
  }
}
</style>
