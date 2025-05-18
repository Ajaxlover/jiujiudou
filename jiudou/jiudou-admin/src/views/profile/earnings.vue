<template>
  <div class="earnings">
    <div class="title">收益总览</div>
    <div style="display:flex; margin-bottom:38px;">
      <div class="remainContainer">
        <div style="display:flex;margin-top: 26px;align-items: center;padding-left: 35px;">
          <div style="color: #222;font-size: 17px;">收益余额</div>
          <div style="color: #222;font-size: 34px;font-weight: bold;margin-left: 115px;">￥{{remainMoney/100.0}}</div>
        </div>
        <div style="padding-left: 25px; margin-top:24px;">（可申请结算金额：{{useableMoney/100.0}}）</div>
      </div>
      <div style="margin-left:25px;">
        <el-button :disabled="hasIngState==1 || useableMoney<50000" size="small" type="primary" @click="settleClick">申请结算</el-button>
        <div class="description">
          1、当日0点时收益余额达到￥500及以上且无处理中的结算单才能申请结算；<br/>
          2、实际申请结算的金额为申请结算当日的0点时的收益余额；<br/>
          3、结算会在提交申请自然月结束后20个工作日内到账；<br/>
          4、详细收益说明请查看<span @click="isAgreeShow = true">《九斗云课服务协议》</span>
        </div>
      </div>
    </div>
    <div style="margin-bottom:38px;">
      <div class="title">收益月统计</div>
      <el-date-picker
        style="margin-bottom:10px;width:158px"
        size="small"
        v-model="year"
        type="year"
        placeholder="选择年"
        @change="yearChange">
      </el-date-picker>
      <el-row>
        <el-col :span="24"><div v-loading="loading.mouthSummery" id="lineChart"></div></el-col>
      </el-row>
    </div>
    <div class="title">收益明细</div>
    <div style="margin-bottom:20px;"><span style="border-bottom:2px solid #409EFF;padding-bottom:5px">云课</span></div>
    <el-table :data="earningList" v-loading="loading.earningList" stripe border :header-cell-style="{'background-image':'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)','color':'#333333','height':'40px','padding':'0'}">
      <el-table-column label="云课ID" align="center">
        <template slot-scope="scope">{{scope.row.ccourseUuid}}</template>
      </el-table-column>
      <el-table-column label="云课标题" align="center">
        <template slot-scope="scope">{{scope.row.ccourseName}}</template>
      </el-table-column>
      <el-table-column label="本月收益" prop="thisMonthEarn" align="center">
        <template slot-scope="scope">{{formatMoney(scope.row.monInc)}}</template>
      </el-table-column>
      <el-table-column label="上月收益" prop="lastMonthEarn" align="center">
        <template slot-scope="scope">{{formatMoney(scope.row.lastMonInc)}}</template>
      </el-table-column>
      <el-table-column label="总收益" prop="totalEarn" align="center">
        <template slot-scope="scope">{{formatMoney(scope.row.totalInc)}}</template>
      </el-table-column>
    </el-table>
    <div class="tabelFooter">
      <div v-if="earningList && earningList.length" class="right-footer-first">
        从{{(page-1)*pageSize+1}}到{{(page-1)*pageSize+earningList.length}}记录，共{{total}}条
      </div>
      <div v-else class="right-footer-first"  ref="footerCount">从0到0条记录，共0条</div>
      <el-pagination
      layout="prev, pager, next, jumper"
      :total="total"
      :page-size="pageSize"
      :current-page.sync="page"
      background
      @current-change="loadEarningList"></el-pagination>
    </div>
    <jd-dialog title="申请结算" :noFooter="true" :visible.sync="dialogShow.settle" :close_on_click_modal="false">
      <template slot="body">
        <el-form :model="settleForm" :rules="settleFormRules" ref="ruleForm" size="small" label-position="left" label-width="120px" style="padding-left:10px;padding-right: 50px;">
          <el-form-item label="结算金额">
            <span>{{settleForm.stateApplyAmount/100.0}}</span>
          </el-form-item>
          <el-form-item label="收款人姓名" prop="statePayeeName">
            <el-input v-model="settleForm.statePayeeName"></el-input>
            <div>请输入真实姓名</div>
          </el-form-item>
          <el-form-item label="手机号" prop="stateApplyMobile">
            <el-input v-model="settleForm.stateApplyMobile"></el-input>
            <div>请输入最近可使用的手机号</div>
          </el-form-item>
          <el-form-item label="电子邮箱">
            <el-input v-model="settleForm.stateApplyEmail"></el-input>
          </el-form-item>
          <el-form-item label="收款银行" prop="stateBankName">
            <el-input v-model="settleForm.stateBankName"></el-input>
          </el-form-item>
          <el-form-item label="收款银行卡号" prop="stateBankAccount">
            <el-input v-model="settleForm.stateBankAccount"></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align:center">
          <el-button :loading="loading.settleSure" @click="settleSure" type="primary" size="small">提交申请</el-button>
          <el-button @click="dialogShow.settle=false" type="primary" size="small">取消</el-button>
        </div>
      </template>
    </jd-dialog>
    <!-- 云课服务协议 -->
    <el-dialog :visible.sync="isAgreeShow" :modal-append-to-body="false" width="800px">
      <template slot="title">
        <div><div></div><div>九斗云课服务协议</div></div>
      </template>
      <div style="height:500px;overflow-y:auto">
        <courseProtocol></courseProtocol>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.earnings {
  background: white;
  margin: 22px 23px;
  padding: 10px 20px;
  .el-button--primary.is-disabled {
    background: #ccc;
    border-color: #ccc;
  }
  .title {
    color: #333;
    font-size: 16px;
    margin-bottom: 20px;
  }
  .remainContainer {
    width: 500px;
    height: 158px;
    background: url('../../assets/images/img_earning_bg.png') no-repeat;
  }
  .description {
    font-size: 14px;
    color: #999;
    margin-top: 13px;
    span {
      cursor: pointer;
      color: #2BA1F4;
    }
  }
  #lineChart {
    max-width: 1044px;
    height:321px;
    background:rgba(246,246,252,1);
    border-radius:4px;
  }
}
</style>

<script>
import axios from '@/libs/api.request'
import JDialog from '@/components/jdialog'
// import echarts from 'echarts'
import courseProtocol from '../cloudCourse/courseProtocol'
let echarts = require("echarts/lib/echarts");
// 按需引入需要的组件模块
require("echarts/lib/chart/line");
require("echarts/lib/chart/pie");
export default {
  name: 'Earnings',
  components: {
    'jd-dialog': JDialog,
    courseProtocol
  },
  data() {
    return {
      remainMoney: 0,
      useableMoney: 0,
      hasIngState: 0,
      year: '',
      lineChart: '',
      earningList: [],
      dialogShow: {
        settle: false,
      },
      page: 1,
      pageSize: 20,
      total: 0,
      settleForm: {
        stateApplyAmount: 0,
        statePayeeName: '',
        stateApplyMobile: '',
        stateApplyEmail: '',
        stateBankAccount: '',
        stateBankName: ''
      },
      settleFormRules: {
        statePayeeName: [
          { required: true, message: '请填写真实姓名', trigger: 'blur' }
        ],
        stateApplyMobile: [
          { required: true, message: '请输入最近可使用的手机号', trigger: 'blur' }
        ],
        stateBankName: [
          { required: true, message: '请填写收款银行', trigger: 'blur' }
        ],
        stateBankAccount: [
          { required: true, message: '请填写收款银行卡号', trigger: 'blur' }
        ]
      },
      loading: {
        earningList: false,
        monthSummery: false,
        settleSure: false,
      },
      isAgreeShow: false
    }
  },
  mounted() {
    this.year = new Date()
    this.lineChart = echarts.init(document.getElementById('lineChart'))
    this.loadOverview()
    this.loadMonthSummery()
    this.loadEarningList()
  },
  methods: {
    // 收益总览
    loadOverview() {
      axios.request({
        method: 'post',
        url: 'v1/memberExtra/selCCTAAndRSTA'
      }).then(res => {
        let ret = res.data
        if(ret.code == 200) {
          if(ret.data) {
            this.remainMoney = ret.data.extraCCTotalAmount
            this.useableMoney = ret.data.extraCCRemainStateTotalAmount
            this.hasIngState = ret.data.hasIngState
            this.settleForm.stateApplyAmount = this.useableMoney
          }
        }
      })
    },
    // 收益明细
    loadEarningList() {
      this.loading.earningList = true
      axios.request({
        method: 'post',
        url: 'v1/orderBook/selIncsOf2MonForCCs',
      }).then(res => {
        this.loading.earningList = false
        let ret = res.data
        if(ret.code == 200) {
          this.earningList = ret.data
        }
      }).catch(() => {
        this.loading.earningList = false
      })
    },
    yearChange() {
      this.loadMonthSummery()
    },
    // 月统计
    loadMonthSummery() {
      this.loading.monthSummery = true
      axios.request({
        method: 'post',
        url: 'v1/statisCtl/allCCIncMonStatis',
        data: {
          year: this.year.getFullYear()
        }
      }).then(res => {
        this.loading.monthSummery = false
        let ret = res.data
        if(ret.code == 200) {
          let x = ['', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
          let y = []
          if(ret.data && ret.data.length) {
            y.push({
              symbol: 'none',
              value: 0,
            })
            for (let i = 0; i < ret.data.length; i++) {
              let index = ret.data[i].month
              y[index] = ret.data[i].income
            }
          }
          this.drawLine(x, y)
        }
      }).catch(() => {
        this.loading.monthSummery = false
      })
    },
    drawLine(x, y) {
      this.lineChart.setOption({
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: x,
          // 刻度样式
          axisLabel: {
            color: '#333'
          },
          // 坐标轴样式
          axisLine: {
            lineStyle: {
              color: '#5178CC',
              width: 2,
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#333'
          },
          axisLine: {
            lineStyle: {
              color: '#5178CC',
              width: 2,
            }
          },
          // 网格线样式
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#C3D6F0'],
              width: 1,
              type: 'solid'
            }
          }
        },
        series: [{
          data: y,
          type: 'line',
          hoverAnimation: false,
          symbol: '',
          symbolSize: 14,
          label: {
            show: true,
            color: '#666',
            fontSize: 12,
          },
          lineStyle: {
            color: '#AAC4E7',
            width: 6,
            shadowColor: 'rgba(43, 95, 208, 0.4)',
            shadowOffsetY: 8,
            shadowBlur: 14
          },
          // 折线拐点标志的样式
          itemStyle: {
            color: '#F29680'
          }
        }]
      })
    },
    // 申请结算
    settleClick() {
      this.loading.settleSure = false
      this.settleForm.stateApplyAmount = this.useableMoney
      this.settleForm.statePayeeName = ''
      this.settleForm.stateApplyMobile = ''
      this.settleForm.stateApplyEmail = ''
      this.settleForm.stateBankAccount = ''
      this.settleForm.stateBankName = ''
      this.dialogShow.settle = true
    },
    settleSure() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.loading.settleSure = true
          axios.request({
            method: 'post',
            url: 'v1/memberExtra/udpCCRemainSAAndInsCCState',
            data: this.settleForm
          }).then(res => {
            this.loading.settleSure = false
            let ret = res.data
            if(ret.code == 200) {
              this.dialogShow = false
              this.remainMoney = this.remainMoney - this.useableMoney
              this.useableMoney = 0
              this.hasIngState = 1
              this.$message({
                type: 'success',
                message: ret.msg
              })
              this.bus.$emit('askForSettleSuccess')
            } else {
              this.$message({
                type: 'warning',
                message: ret.msg
              })
            }
          }).catch(() => {
            this.loading.settleSure = false
            this.$message({
              type: 'warning',
              message: '服务异常，请稍后重试'
            })
          })
        } else {
          return false;
        }
      });
    },
    // 金额
    formatMoney(money) {
      if(money) {
        return money / 100
      }
      return 0
    }
  }
}
</script>
