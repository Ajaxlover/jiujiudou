<template>
  <el-container class="analyse">
    <el-main>
      <div class="topBtn">
        <span class="title">数据总览</span>
        <el-select v-model="dataType1" size="small" style="width:200px;" @change="search1">
          <el-option label="购买" value="1"></el-option>
          <el-option label="感兴趣" value="2"></el-option>
          <el-option label="转化率(购买/感兴趣%)" value="3"></el-option>
        </el-select>
      </div>
      <el-row style="max-width:1300px;margin-top: 20px;margin-bottom: 20px;">
        <el-col :span="24" style="max-width:1300px;overflow: auto;"><div v-loading="loading.mouthSummery" id="lineChart"></div></el-col>
      </el-row>
      <!-- <div id="lineChart"></div> -->
      <div class="topBtn" style="margin-bottom:20px;">
        <span class="title">云课排名</span>
        <el-select v-model="dataType2" size="small" style="width:200px;" @change="search2">
          <el-option label="购买" value="1"></el-option>
          <el-option label="感兴趣" value="2"></el-option>
          <el-option label="转化率(购买/感兴趣%)" value="3"></el-option>
        </el-select>
      </div>
      <el-row class="totalNum">
        <el-col :span="24">
          <span>{{totalTime}}</span>
          <span>{{totalTitle}}</span>
          <span>{{totalNum}}</span>
        </el-col>
      </el-row>
      <el-table :data="tableData" v-loading="loading.tableLoading" stripe border
      :header-cell-style="{'background-image':'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)','color':'#333333','height':'40px','padding':'0'}">
        <el-table-column label="" align="center" prop="rankData"></el-table-column>
        <el-table-column label="云课Id" align="center" prop="cCUuid" min-width="200"></el-table-column>
        <el-table-column label="云课标题" align="center" prop="cCName"></el-table-column>
        <el-table-column label="价格" align="center">
          <template slot-scope="scope">{{scope.row.cCPrice / 100}}</template>
        </el-table-column>
        <el-table-column label="云课类型" align="center" prop="cCType" :formatter="formatCourseType"></el-table-column>
        <el-table-column label="推荐标签" align="center" prop="cCRecoType" :formatter="formatRecCourseType"></el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="courseDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="tabelFooter"> 
        <div v-if="tableData.length" class="right-footer-first">
          从{{(page-1)*pageSize+1}}到{{(page-1)*pageSize+tableData.length}}记录，共{{total}}条
        </div>
        <div v-else class="right-footer-first"  ref="footerCount">从0到0条记录，共0条</div>
        <el-pagination
        layout="prev, pager, next, jumper"
        :total="total"
        :page-size="pageSize"
        :current-page.sync="page"
        background
        @current-change="loadData2"></el-pagination>
      </div>
    </el-main>
    <!-- 查看 -->
    <el-dialog :visible.sync="isviewShow" :modal-append-to-body="false" width="600px">
      <template slot="title">
        <div><div></div><div>封面</div></div>
      </template>
    </el-dialog>
  </el-container>
</template>

<script>
import axios from "@/libs/api.request"
// import echarts from 'echarts'
import common from '@/utils/common'
import { formatYMD } from '@/utils/datetime'
let echarts = require("echarts/lib/echarts");
// 按需引入需要的组件模块
require("echarts/lib/chart/line");
require("echarts/lib/chart/pie");

export default {
  data() {
    return {
      isviewShow: false,
      lineChart: '',
      dataType1: '1',
      dataType2: '1',
      loading: {
        tableLoading: false
      },
      page: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      chartData: [],
      totalTitle: '总购买人数',
      totalNum: '0',
      totalNum1: '0',
      totalNum2: '0',
      totalTime: ''
    }
  },
  methods: {
    loadData1() {
      axios.request({
        method: 'post',
        url: 'v1/rankData/selRecent30DaysData'
      }).then(res => {
        let ret = res.data
        if (ret.code === 200) {
          this.chartData = ret.data
          this.drawLine()
        }
      })
    },
    loadData2() {
      axios.request({
        method: 'post',
        url: '/v1/cCourse/selCCWithYesterdayRankData',
        data: {
          dataColumnCode: this.dataType2,
          pageNum: this.page,
          pagesize: this.pageSize
        }
      }).then(res => {
        let ret = res.data
        if (ret.code === 200) {
          if(ret.data) {
            this.tableData = ret.data
          }
        }
      })
    },
    loadData3() {
      axios.request({
        method: 'post',
        url: 'v1/cCourse/selyesterday3TotalData'
      }).then(res => {
        let ret = res.data
        if (ret.code === 200) {
          if(ret.data) {
            this.totalTime = this.formatTotalTime(ret.data.dataDate)
            this.totalNum = ret.data.buyAmountSum + '人'
            this.totalNum1 = ret.data.buyAmountSum
            this.totalNum2 = ret.data.interestAmountSum
            this.total = ret.data.totalCount
          }
        }
      })
    },
    drawLine() {
      let x = []
      let y = []
      let interval = 4
      if(this.chartData.length < 10) {
        interval = 0
      }
      for (let i = 0; i < this.chartData.length; i++) {
        x.push(formatYMD(this.chartData[i].dataDate))
        if(this.dataType1 == 1) {
          y.push(this.chartData[i].buyAmountSum)
        }
        if(this.dataType1 == 2) {
          y.push(this.chartData[i].interestAmountSum)
        }
        if(this.dataType1 == 3) {
          if(this.chartData[i].interestAmountSum == 0) {
            y.push(0)
          }else {
            y.push(parseFloat(this.chartData[i].buyAmountSum / this.chartData[i].interestAmountSum * 100).toFixed(2))
          }
        }
      }
      let zhuanhualv = "购买：{c}</br>{b}"
      if(this.dataType1 == 2) {
        zhuanhualv = "感兴趣：{c}</br>{b}"
      }
      if(this.dataType1 == 3) {
        zhuanhualv = "转化率：{c}%</br>{b}"
      }
      var option = {
        tooltip: {
          trigger: 'item',
          formatter: zhuanhualv
        },
        xAxis: {
          data: x,
          type: 'category',
          boundaryGap: false,
          // 刻度样式
          axisLabel: {
            color: '#333',
            interval: interval
          },
          // 坐标轴样式
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
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#333',
          },
          axisLine: {
            lineStyle: {
              color: '#5178CC',
              width: 2,
            }
          },
          // 网格线样式
          splitLine: {
            show: false
          },
        },
        series: [{
          data: y,
          type: 'line',
          hoverAnimation: false,
          symbolSize: 8,
          label: {
            show: false,
            color: '#666',
            fontSize: 12,
          },
          lineStyle: {
            color: '#AAC4E7',
            width: 2,
            shadowColor: 'rgba(43, 95, 208, 0.4)',
            shadowOffsetY: 8,
            shadowBlur: 14
          },
          // 折线拐点标志的样式
          itemStyle: {
            color: '#F29680'
          }
        }]
      }
      this.lineChart.setOption(option)
    },
    search1() {
      this.drawLine()
    },
    search2() {
      if(this.dataType2 == 1) {
        this.totalTitle = '总购买人数'
        this.totalNum = this.totalNum1 + '人'
      }else if(this.dataType2 == 2) {
        this.totalTitle = '总感兴趣人数'
        this.totalNum = this.totalNum2 + '人'
      }else{
        this.totalTitle = '总转化率'
        if(this.totalNum2 == 0) {
          this.totalNum = 0 + '%'
        }else{
          this.totalNum = parseFloat(this.totalNum1 / this.totalNum2 * 100).toFixed(2) + '%'
        }
      }
      this.page = 1
      this.loadData2()
    },
    // 云课类型
    formatCourseType(row) {
      return common.mathCourseType(row.cCType)
    },
    // 云课推荐类型
    formatRecCourseType(row) {
      let str = row.cCRecoType
      if(row.cCRecoType) {
        str = str.replace("1", "最新好课").replace("2", "精选课程").replace("3", "免费课程")
        return str
      }else{
        return '暂未设置'
      }
    },
    //云课详情
    courseDetail(row) {
      this.$router.push({
        path: "/cloudCourse/courseDetail",
        query: {
          ccourseId: row.cCId,
          type: 5
        }
      })
    },
    formatTotalTime(row) {
      return formatYMD(row);
    }
  },
  mounted() {
    this.loadData1()
    this.loadData3()
    this.loadData2()
    this.lineChart = echarts.init(document.getElementById('lineChart'))
  }
};
</script>

<style lang="scss">
.analyse{
  .el-main{
    margin: 22px 20px;
    background: #ffffff;
    border-radius: 4px;
    min-height: 700px;
    padding-top: 12px;
    padding-left: 18px; 
    padding-right: 18px;
    padding-bottom: 12px;
    .topBtn{
      .title{
        font-size: 18px;
        color: #333333;
        margin-right: 40px;
      }
      .el-button{
        margin-left: 15px;
      }
    }
    .totalNum{
      margin-bottom: 20px;
      background-color: #EDF1F7;
      border: 1px solid #BECBD9;
      height: 50px;
      padding-left: 20px;
      .el-col{
        span{
          font-size: 16px;
          color: #333; 
          line-height: 50px;
          margin-right: 20px;
        }
        span:last-child{
          color: #2BA1F4;
          font-weight: 600;
        }
      }
    }
    #lineChart{
      width: 1300px;
      height: 500px;
      background:rgba(246,246,252,1);
      border-radius:4px;
    }
  }
}
</style>