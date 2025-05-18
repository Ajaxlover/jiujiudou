<template>
  <div class="order">
    <div class="header">
      <el-date-picker
        size="small"
        v-model="dates"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="dateChange">
      </el-date-picker>
      <div style="display:flex;width:300px">
        <el-input v-model="orderForm.keyWord" size="small" placeholder="订单号、商品名称、用户名" @keyup.enter.native="onSearch"></el-input>
        <el-button size="small" type="primary" @click="onSearch" class="el-icon-search" style="margin-left: 5px;"></el-button>
        <!-- <el-button size="small" type="primary" @click="onSearch">导出</el-button> -->
      </div>
    </div>
    <el-table :data="orderList" v-loading="loading.orderList" stripe border :header-cell-style="{'background-image':'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)','color':'#333333','height':'40px','padding':'0'}">
      <el-table-column label="订单号" prop="orderNum" align="center" width="300"></el-table-column>
      <el-table-column label="订单时间" align="center" width="170">
        <template slot-scope="scope">{{formatTime(scope.row.orderCreateT)}}</template>
      </el-table-column>
      <el-table-column label="商品名称" prop="goodsName" align="center" min-width="250"></el-table-column>
      <el-table-column label="用户" prop="customerUName" align="center" width="250"></el-table-column>
      <el-table-column label="订单金额（元）" prop="orderLabelPrice" align="center" width="120">
        <template slot-scope="scope">{{formatMoney(scope.row.orderLabelPrice)}}</template>
      </el-table-column>
      <el-table-column label="实付金额（元）" prop="paidMoney" align="center" width="120">
        <template slot-scope="scope">{{formatMoney(scope.row.paidMoney)}}</template>
      </el-table-column>
    </el-table>
    <div class="tabelFooter">
      <div v-if="orderList.length" class="right-footer-first">
        从{{(page-1)*pageSize+1}}到{{(page-1)*pageSize+orderList.length}}记录，共{{total}}条
      </div>
      <div v-else class="right-footer-first"  ref="footerCount">从0到0条记录，共0条</div>
      <el-pagination
      layout="prev, pager, next, jumper"
      :total="total"
      :page-size="pageSize"
      :current-page.sync="page"
      background
      @current-change="loadOrderList"></el-pagination>
    </div>
  </div>
</template>

<style lang="scss">
.order {
  background: white;
  margin: 22px 23px;
  padding: 10px 20px;
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
}
</style>


<script>
import axios from '@/libs/api.request'
import { format } from '@/utils/datetime'
export default {
  name: 'Order',
  data() {
    return {
      dates: [],
      orderList: [],
      page: 1,
      pageSize: 10,
      total: 0,
      loading: {
        orderList: false
      },
      orderForm: {
        beginT: 0,
        endT: 0,
        keyWord: ''
      },
    }
  },
  mounted() {
    this.loadOrderList()
  },
  methods: {
    loadOrderList() {
      this.loading.orderList = true
      let data = {}
      data.startTime = this.orderForm.beginT
      data.endTime = this.orderForm.endT
      if(this.orderForm.keyWord) {
        data.keyWord = this.orderForm.keyWord
      }
      data.page = this.page
      data.pageSize = this.pageSize
      axios.request({
        method: 'post',
        url: 'v1/order/myListWithCount',
        data: data
      }).then(res => {
        this.loading.orderList = false
        let ret = res.data
        if(ret.code == 200) {
          this.total = ret.data.total
          this.orderList = ret.data.data
        }
      }).catch(() => {
        this.loading.orderList = false
      })
    },
    dateChange() {
      this.page = 1
      if(this.dates) {
        this.orderForm.beginT = this.dates[0].getTime()
        this.orderForm.endT = this.dates[1].getTime()
      } else {
        this.orderForm.beginT = 0
        this.orderForm.endT = 0
      }
      this.loadOrderList()
    },
    onSearch() {
      this.page = 1
      this.loadOrderList()
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
