<template>
  <div class="settlement">
    <div style="margin-bottom:20px;">
      <div class="title">结算总览</div>
      <div style="display:flex">
        <div class="settled container">
          <span style="color: #222;font-size: 17px;">累积已结算</span>
          <span style="color: #222;font-size: 34px;font-weight: bold">￥{{formatMoney(totSettledMoney)}}</span>
        </div>
        <div class="settling container">
          <span style="color: #222;font-size: 17px;">结算中</span>
          <span style="color: #222;font-size: 34px;font-weight: bold">￥{{formatMoney(settlingMoney)}}</span>
        </div>
      </div>
    </div>
    <div style="margin-bottom:20px;">
      <div class="title">结算详情</div>
      <div class="description">服务费计算规则见<span @click="isAgreeShow = true">《九斗云课服务协议》</span></div>
    </div>
    <el-table :data="settleList" v-loading="loading" stripe border :header-cell-style="{'background-image':'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)','color':'#333333','height':'40px','padding':'0'}">
      <el-table-column label="结算单号" prop="stateId" align="center"></el-table-column>
      <el-table-column label="用户" align="center">
        <template slot-scope="scope">
          <div>{{scope.row.statePayeeName}}</div>
          <div>{{'（' + scope.row.applicantPhone + '）'}}</div>
        </template>
      </el-table-column>
      <el-table-column label="申请结算金额（元）" align="center">
        <template slot-scope="scope">{{formatMoney(scope.row.stateApplyAmount)}}</template>
      </el-table-column>
      <el-table-column label="服务费（元）" align="center">
        <template slot-scope="scope">{{scope.row.stateStatus==2?formatMoney(scope.row.stateServiceAmount):'核算中'}}</template>
      </el-table-column>
      <el-table-column label="实际支付金额（元）" align="center">
        <template slot-scope="scope">{{scope.row.stateStatus==2?formatMoney(scope.row.statePaymentAmount):'核算中'}}</template>
      </el-table-column>
      <el-table-column label="申请时间" align="center">
        <template slot-scope="scope">{{formatTime(scope.row.stateApplyTime)}}</template>
      </el-table-column>
      <el-table-column label="结算状态" align="center">
        <template slot-scope="scope">{{scope.row.stateStatus==2?'已结算':'处理中'}}</template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="showDetail(scope.row)" type="text" size="small">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="tabelFooter">
      <div v-if="settleList && settleList.length" class="right-footer-first">
        从{{(page-1)*pageSize+1}}到{{(page-1)*pageSize+settleList.length}}记录，共{{total}}条
      </div>
      <div v-else class="right-footer-first"  ref="footerCount">从0到0条记录，共0条</div>
      <el-pagination
      layout="prev, pager, next, jumper"
      :total="total"
      :page-size="pageSize"
      :current-page.sync="page"
      background
      @current-change="loadSettleList"></el-pagination>
    </div>
    <!-- 云课服务协议 -->
    <el-dialog :visible.sync="isAgreeShow" :modal-append-to-body="false" width="800px">
      <template slot="title">
        <div><div></div><div>九斗云课服务协议</div></div>
      </template>
      <div style="height:500px;overflow-y:auto">
        <courseProtocol></courseProtocol>
      </div>
    </el-dialog>
    <!-- 结算详情 -->
    <jd-dialog title="结算详情" :visible.sync="isDetailShow" :noFooter="true">
      <template slot="body">
        <div>申请结算</div>
        <el-form label-width="100px" label-position="left" style="margin: 0 80px;">
          <el-form-item label="结算单号">
            <div>{{currentRow.stateId}}</div>
          </el-form-item>
          <el-form-item label="结算金额">
            <div>{{currentRow.stateApplyAmount / 100}}</div>
          </el-form-item>
          <el-form-item label="收款人姓名">
            <div>{{currentRow.statePayeeName}}</div>
          </el-form-item>
          <el-form-item label="手机号">
            <div>{{currentRow.applicantPhone}}</div>
          </el-form-item>
          <el-form-item label="收款银行">
            <div>{{currentRow.stateBankName}}</div>
          </el-form-item>
          <el-form-item label="收款银行卡号">
            <div>{{currentRow.stateBankAccount}}</div>
          </el-form-item>
        </el-form>
        <div>
          <span style="padding-right: 20px;">结算结果</span>
          <span>{{currentRow.stateStatus==2?'已结算':'处理中'}}</span>
        </div>
        <div v-if="currentRow.stateStatus==2 && currentRow.pPicUrlList && currentRow.pPicUrlList.length" style="margin-top: 22px;margin-bottom: 22px;overflow:hidden">
          <div style="padding-right:20px;float:left">结算凭证</div>
          <div style="width:480px;float:left">
            <img class="settleImage" v-for="(item, index) in currentRow.pPicUrlList" :key="index" :value="index" :src="item"/>
          </div>
        </div>
      </template>
    </jd-dialog>
  </div>
</template>

<style lang="scss">
.settlement {
  background: white;
  margin: 22px 23px;
  padding: 10px 20px;
  .title {
    color: #333;
    font-size: 16px;
    margin-bottom: 20px;
  }
  .container {
    width: 428px;
    height: 87px;
    padding-left: 35px;
    padding-right: 94px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .settled {
    background: url('../../assets/images/img_settled_bg.png') no-repeat;
  }
  .settling {
    margin-left: 53px;
    background: url('../../assets/images/img_settling_bg.png') no-repeat;
  }
  .description {
    font-size: 14px;
    color: #999;
    span {
      cursor: pointer;
      color: #2BA1F4;
    }
  }
  .settleImage {
    width: 230px;
    height: 150px;
    margin-right: 3px;
  }
}
</style>

<script>
import axios from '@/libs/api.request'
import { format } from '@/utils/datetime'
import courseProtocol from '../cloudCourse/courseProtocol'
import JDialog from '@/components/jdialog'
export default {
  name: 'Settlement',
  components: {
    courseProtocol,
    'jd-dialog': JDialog,
  },
  data() {
    return {
      totSettledMoney: 0,
      settlingMoney: 0,
      settleList: [],
      page: 1,
      pageSize: 20,
      total: 0,
      isAgreeShow: false,
      loading: false,
      isDetailShow: false,
      currentRow: {},
    }
  },
  mounted() {
    this.loadOverview()
    this.loadSettleList()
    this.bus.$on('askForSettleSuccess', function(sblId) {
      this.loadSettleList()
    }.bind(this))
  },
  beforeDestroy() {
    this.bus.$off('askForSettleSuccess')
  },
  methods: {
    // 结算总览
    loadOverview() {
      axios.request({
        method: 'post',
        url: 'v1/ccStatement/sel2StaAccount'
      }).then(res => {
        let ret = res.data
        if(ret.code == 200) {
          this.totSettledMoney = ret.data.edTotalAcco
          this.settlingMoney = ret.data.ingTotalAcco
        }
      })
    },
    // 结算明细
    loadSettleList() {
      this.loading = true
      axios.request({
        method: 'post',
        url: 'v1/ccStatement/selStates',
        data: {
          pageNum: this.page,
          pagesize: this.pageSize,
          selPer: 1
        }
      }).then(res => {
        this.loading = false
        let ret = res.data
        if(ret.code == 200) {
          this.settleList = ret.data.data
          this.total = ret.data.total
        }
      }).catch(() => {
        this.loading = false
      })
    },
    // 结算详情
    showDetail(row) {
      this.currentRow = row
      this.isDetailShow = true
    },
    // 时间
    formatTime(time) {
      if(time) {
        return format(time)
      }
      return ''
    },
    // 金额
    formatMoney(money) {
      if(money) {
        return money / 100.0
      }
      return 0
    }
  }
}
</script>
