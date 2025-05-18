<template>
  <div ref="page1" class="page1">
    <Modal
      :width="1200"
      v-model="modal1"
      title="班级创建记录"
      :mask-closable="true"
    >
      <!-- @on-ok="getMonthBetween(startTime, endTime)" -->
      <div class="modal1-selTime">
        <Date-picker
          v-model="value2"
          type="daterange"
          placeholder="选择日期"
          format="yyyyMMdd"
          split-panels
          @on-change="searchClassByTime"
          style="width: 200px"
        ></Date-picker>
        <Select
          v-model="province"
          clearable
          placeholder="选择省份"
          @on-change="searchClass"
          style="width:100px;margin-left:8px"
        >
          <Option
            v-for="(item, idx) in provinceList"
            :value="item.value"
            :key="idx"
            >{{ item.label }}</Option
          >
        </Select>
      </div>
      <div class="modal1-table">
        <Table :columns="columns1" :data="classData"></Table>
      </div>
      <div style="margin-top:15px">
        <Page
          class-name="modal1-pager"
          :total="page.total"
          :current.sync="page.pageNo"
          :page-size="page.pageSize"
          @on-change="getClassData"
          show-elevator
        ></Page>
      </div>
      <!-- @on-change="pickStartDate" -->
      <div slot="footer"></div>
    </Modal>
    <!-- <Row class="search">
      <DatePicker
        @on-change="pickStartDate"
        :options="optionStart"
        type="date"
        placeholder="选择开始日期"
        style="width: 200px"
      ></DatePicker>
      <span style="padding:0 20px;color:#75deef">至</span>
      <DatePicker
        @on-change="pickEndDate"
        :options="optionEnd"
        type="date"
        placeholder="选择结束日期"
        style="width: 200px"
      ></DatePicker>
      <Button
        class="ios-search-btn"
        type="primary"
        shape="circle"
        icon="ios-search"
      ></Button>
    </Row> -->
    <Row class="listTop">
      <Col span="6">
        <div class="leftTop">
          <!-- <span class="title"><span class="title-6">用户增长走势</span></span> -->
          <span class="angle1"></span>
          <span class="angle2"></span>
          <span class="angle3"></span>
          <span class="angle4"></span>
          <div class="left1-data">
            <div class="data-content">
              <div class="data-content-t">
                <span class="data-text">新增用户</span>
                <span class="data-num">{{ info.userNewNum }}</span>
              </div>
            </div>
            <div class="data-content">
              <div class="data-content-t">
                <span class="data-text">新增教师</span>
                <span class="data-num">{{ info.teacherNewNum }}</span>
              </div>
            </div>
            <div class="data-content">
              <div class="data-content-t">
                <span class="data-text">新增班级</span>
                <span class="data-num">{{ info.classNewNum }}</span>
              </div>
            </div>
            <div class="data-content">
              <div class="data-content-t">
                <span class="data-text">新增验证</span>
                <span class="data-num">{{ info.codeBookNewNum }}</span>
              </div>
            </div>
          </div>
          <div class="left1">
            <!-- <area-chart
              ref="chart1"
              id="left_1"
              :select-range-date="selectRangeDate"
              :config="cnfigData1"
            ></area-chart> -->
            <!-- <lines ref="chart1"></lines> -->
            <single-area-chart
              ref="chart1"
              :selectRangeDate="selectRangeDate"
              :dataY="dataY"
              id="right_4"
            ></single-area-chart>
            <!-- <double-area
              :selectRangeDate="selectRangeDate"
              ref="chart1"
            ></double-area> -->
            <!-- <radar-chart
              ref="chart1"
              id="right_1"
              :data="friendRadarData"
            ></radar-chart> -->
          </div>
          <div class="left2">
            <!-- <ring ref="chart2" :data="data5"></ring> -->
            <single-area-chart2
              ref="chart2"
              @search="getTimeUser"
              :dateList="dateList"
              :dataY="dataH"
              :selectRangeDate="selectRangeDate"
              id="right_4"
            ></single-area-chart2>
            <!-- <web-bar ref="chart2" :data="data1"></web-bar> -->
            <!-- <div style="width: 40%;float: left;height: 100%;">
              <pie ref="chart3" id="left_2_2" :data="data2"></pie>
            </div> -->
          </div>
          <!-- <div class="left3">
            <web-bar ref="chart4" :data="data3"></web-bar>
            <div style="width: 40%;float: left;height: 100%;">
              <pie ref="chart5" id="left_3_2" :data="data4"></pie>
            </div>
          </div> -->
        </div>
      </Col>
      <Col span="11">
        <!-- <radar-part ref="chart6"></radar-part> -->
        <div class="topMiddle">
          <!-- <china-map ref="chinaMap"></china-map> -->
          <div class="topMiddle-1">
            <!-- <span class="angle1"></span>
            <span class="angle2"></span> -->
            <!-- <span class="angle3"></span>
            <span class="angle4"></span> -->
            <div class="data-container">
              <div class="data-content">
                <div class="data-content-t">
                  <span class="data-text">用户</span>
                  <span class="data-num">{{ info.userTotalNum }}</span>
                </div>
                <!-- <div class="data-content-b">
                  <span class="data-text">新增用户</span>
                  <span>9999</span>
                </div> -->
              </div>
              <div class="data-content">
                <div class="data-content-t">
                  <span class="data-text">教师</span>
                  <span class="data-num">{{ info.teacherTotalNum }}</span>
                </div>
                <!-- <div class="data-content-b">
                  <span class="data-text">新增教师</span>
                  <span>596</span>
                </div> -->
              </div>
              <div class="data-content">
                <div class="data-content-t">
                  <span class="data-text">资源</span>
                  <span class="data-num">{{ info.resourceTotalNum }}</span>
                </div>
                <!-- <div class="data-content-b">
                  <span class="data-text">教材</span>
                  <span>530</span>
                </div> -->
              </div>
              <div class="data-content">
                <div class="data-content-t">
                  <span class="data-text">教材</span>
                  <span class="data-num">{{ info.bookTotalNum }}</span>
                </div>
                <!-- <div class="data-content-b">
                  <span class="data-text">教材</span>
                  <span>530</span>
                </div> -->
              </div>
              <div class="data-content">
                <div class="data-content-t">
                  <span class="data-text">总验证教材</span>
                  <span class="data-num">{{ info.codeBookTotalNum }}</span>
                </div>
                <!-- <div class="data-content-b">
                  <span class="data-text">新验证教材数</span>
                  <span>530</span>
                </div> -->
              </div>
              <div class="data-content">
                <div class="data-content-t">
                  <span class="data-text">班级</span>
                  <span class="data-num">{{ info.classTotalNum }}</span>
                </div>
                <!-- <div class="data-content-b">
                  <span class="data-text">新增班级</span>
                  <span>299</span>
                </div> -->
              </div>
            </div>
          </div>
          <div class="topMiddle-2">
            <!-- <span class="title"><span class="title-8"></span></span>
            <span class="angle1"></span>
            <span class="angle2"></span>
            <span class="angle3"></span>
            <span class="angle4"></span> -->
            <china-map :mapData="mapData" ref="chinaMap"></china-map>
          </div>
        </div>
      </Col>
      <Col span="7">
        <div class="rightTop-1">
          <span class="title-big-data"
            ><span class="title-8">验证教材</span></span
          >
          <span class="angle1"></span>
          <span class="angle2"></span>
          <span class="angle3"></span>
          <span class="angle4"></span>
          <!-- <ring2 ref="chart4" :data="data5"></ring2> -->
          <webcasts-risk
            ref="webcastsRisk"
            :data1="codeBooksData1"
            :data2="codeBooksData2"
            :data3="codeBooksData3"
          ></webcasts-risk>

          <!-- <world-map ref="chart4"></world-map> -->
        </div>
        <div class="rightTop-2">
          <span class="title-big-data"
            ><span class="title-6">云课购买情况</span></span
          >
          <span class="angle1"></span>
          <span class="angle2"></span>
          <span class="angle3"></span>
          <span class="angle4"></span>
          <device-safe-risk
            ref="deviceSafeRisk"
            :data1="courseData1"
            :data2="courseData2"
            :data3="courseData3"
          ></device-safe-risk>

          <!-- <div class="rightTop-list">
            <div class="list">
              <popular-bar ref="chart5"></popular-bar>
            </div>
            <div class="list">
              <ring ref="chart9" :data="data5"></ring>
            </div>
            <div class="list">
              <ring ref="chart10" :data="data6"></ring>
            </div>
          </div> -->
        </div>
      </Col>
    </Row>
    <Row class="listBottom">
      <Col span="3">
        <div class="content">
          <span class="title-big-data"
            ><span class="title-6">用户机型</span></span
          >
          <span class="angle1"></span>
          <span class="angle2"></span>
          <span class="angle3"></span>
          <span class="angle4"></span>
          <ring ref="chart6" :data="data5"></ring>

          <!-- <Row class="topLine">
            <Col span="24">
              <lines ref="chart11"></lines>
            </Col>
          </Row>
          <Row class="bottomPie">
            <Col span="12">
              <pie-ring ref="chart12" :data="data7"></pie-ring>
            </Col>
            <Col span="12">
              <pie-ring ref="chart13" :data="data8"></pie-ring>
            </Col>
          </Row> -->
        </div>
      </Col>
      <Col span="14">
        <div class="content">
          <!-- <span class="title"><span class="title-6"></span></span> -->
          <span class="angle1"></span>
          <span class="angle2"></span>
          <span class="angle3"></span>
          <span class="angle4"></span>
          <Row class="bottom-radars">
            <Col span="8">
              <!-- 新增班级和用户 -->
              <radar
                :data="data10"
                ref="chart10"
                @clickDataIndex1="clickDataIndex1"
              ></radar>
            </Col>
            <Col span="8">
              <!-- 云课开课情况 -->
              <radar :data="data11" ref="chart11"></radar>
            </Col>
            <Col span="8">
              <!-- 课件排名 -->
              <radar :data="data12" ref="chart12"></radar>
            </Col>
          </Row>
          <Row class="bottom-bars">
            <Col span="8">
              <!-- <radar :data="data10" ref="chart10"></radar> -->
              <!-- <barChart ref="chart12"></barChart> -->
              <double-bar :data="data13" ref="chart8"></double-bar>
            </Col>
            <Col span="8">
              <!-- <radar :data="data10" ref="chart10"></radar> -->
              <double-bar :data="data14" ref="chart7"></double-bar>
            </Col>
            <Col span="8">
              <double-bar :data="data15" ref="chart9"></double-bar>

              <!-- <radar :data="data10" ref="chart10"></radar> -->
            </Col>
          </Row>
        </div>
      </Col>
      <!-- <Col span="5">
        <div class="content">
          <span class="angle1"></span>
          <span class="angle2"></span>
          <span class="angle3"></span>
          <span class="angle4"></span>
          <span class="title"><span class="title-6">云课购买情况</span></span>
        </div>
      </Col>
      <Col span="5">
        <div class="content">
          <span class="title"
            ><span class="title-6">课程名称开课情况</span></span
          >
          <span class="angle1"></span>
          <span class="angle2"></span>
          <span class="angle3"></span>
          <span class="angle4"></span>
          <div class="appUse">
          </div>
        </div>
      </Col> -->
      <Col span="7">
        <div class="content">
          <span class="title-big-data"
            ><span class="title-6">云课热搜</span></span
          >
          <span class="angle1"></span>
          <span class="angle2"></span>
          <span class="angle3"></span>
          <span class="angle4"></span>

          <div class="appUse">
            <!-- <line-bar ref="chart17"></line-bar> -->
            <hot-words
              :data1="hotWords1"
              :data2="hotWords2"
              ref="hotWords"
            ></hot-words>
          </div>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
import axios from "@/libs/api.request";
const doubleBar = () => import("../../components/page1/doubleBar");

const webcastsRisk = () => import("../../components/page1/webcastsRisk");

const deviceSafeRisk = () => import("../../components/page1/deviceSafeRisk");

const chinaMap = () => import("../../components/page1/chinaMap");

const barChart = () => import("../../components/page1/barChart");

const singleAreaChart = () => import("../../components/page1/singleAreaChart");
const singleAreaChart2 = () =>
  import("../../components/page1/singleAreaChart_2");

const radarPart = () => import("../../components/page1/radarPart");
const doubleArea = () => import("../../components/page1/doubleArea");
const webBar = () => import("../../components/page1/webBar");
const pie = () => import("../../components/pie");
const worldMap = () => import("../../components/page1/worldMap");
const ring = () => import("../../components/page1/ring");
const ring2 = () => import("../../components/page1/ring_2");
const popularBar = () => import("../../components/page1/popularBar");
const lines = () => import("../../components/page1/lines");
const pieRing = () => import("../../components/page1/pieRing");
const colorsBar = () => import("../../components/page1/colorsBar");
const funnel = () => import("../../components/page1/funnel");
const lineBar = () => import("../../components/page1/lineBar");
const areaChart = () => import("../../components/areaChart");
const radarChart = () => import("../../components/radar");
const hotWords = () => import("../../components/page1/hotWords");

const radar = () => import("../../components/radar");

export default {
  name: "page1",
  props: {
    selectRangeDate: Array,
    dateList: Array,
    startTime: Date,
    endTime: Date,
    toUpdate: Boolean
  },
  components: {
    doubleBar,
    radar, // 雷达图
    deviceSafeRisk,
    hotWords,
    singleAreaChart2,
    webcastsRisk,
    chinaMap,
    barChart, // 柱状图
    singleAreaChart, // 单面积图
    radarChart,
    radarPart, // 中心
    doubleArea, // 面积图
    webBar, // 柱图
    pie, // 饼图
    worldMap, // 世界地图
    ring, // 圆环
    ring2,
    popularBar, // 柱图
    lines, //折线图
    pieRing, // 饼环图
    colorsBar, // 柱图
    funnel, // 漏斗图
    lineBar, //柱图
    areaChart
    // BarChart // 面积图
  },
  data() {
    return {
      value2: [],
      provinceList: [
        {
          label: "北京",
          value: "北京"
        },
        {
          label: "天津",
          value: "天津"
        },
        {
          label: "上海",
          value: "上海"
        },
        {
          label: "重庆",
          value: "重庆"
        },
        {
          label: "河北",
          value: "河北"
        },
        {
          label: "河南",
          value: "河南"
        },
        {
          label: "云南",
          value: "云南"
        },
        {
          label: "辽宁",
          value: "辽宁"
        },
        {
          label: "黑龙江",
          value: "黑龙江"
        },
        {
          label: "湖南",
          value: "湖南"
        },
        {
          label: "安徽",
          value: "安徽"
        },
        {
          label: "山东",
          value: "山东"
        },
        {
          label: "新疆",
          value: "新疆"
        },
        {
          label: "江苏",
          value: "江苏"
        },
        {
          label: "浙江",
          value: "浙江"
        },
        {
          label: "江西",
          value: "江西"
        },
        {
          label: "湖北",
          value: "湖北"
        },
        {
          label: "广西",
          value: "广西"
        },
        {
          label: "甘肃",
          value: "甘肃"
        },
        {
          label: "山西",
          value: "山西"
        },
        {
          label: "内蒙古",
          value: "内蒙古"
        },
        {
          label: "陕西",
          value: "陕西"
        },
        {
          label: "吉林",
          value: "吉林"
        },
        {
          label: "福建",
          value: "福建"
        },
        {
          label: "贵州",
          value: "贵州"
        },
        {
          label: "广东",
          value: "广东"
        },
        {
          label: "青海",
          value: "青海"
        },
        {
          label: "西藏",
          value: "西藏"
        },
        {
          label: "四川",
          value: "四川"
        },
        {
          label: "宁夏",
          value: "宁夏"
        },
        {
          label: "海南",
          value: "海南"
        },
        {
          label: "台湾",
          value: "台湾"
        },
        {
          label: "香港",
          value: "香港"
        },
        {
          label: "澳门",
          value: "澳门"
        }
      ],
      province: "",
      classData: [],
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      columns1: [
        {
          title: "教师姓名",
          key: "teacherName"
        },
        {
          title: "手机",
          key: "mobile"
        },
        {
          title: "班级名称",
          key: "className"
        },
        {
          title: "学校",
          key: "school"
        },
        {
          title: "省份",
          key: "province"
        }
      ],
      modal1: false, // 弹窗
      hotWords1: [],
      hotWords2: [],
      data13: {
        title: "",
        xData: [],
        data: [
          {
            name: "新增用户",
            color: "#FDC673",
            value: []
          },
          {
            name: "新增班级",
            color: "#B370FD",
            // color: "#52B8FF",
            value: []
          }
        ]
      },
      data14: {
        title: "",
        xData: [],
        data: [
          {
            name: "",
            color: "#05467D",
            value: []
          },
          {
            name: "",
            color: "#52B8FF",
            value: []
          }
        ]
      },
      data15: {
        title: "",
        xData: [],

        data: [
          {
            name: "",
            color: "#05467D",
            value: []
          },
          {
            name: "",
            color: "#52B8FF",
            value: []
          }
        ]
      },
      hotKeys: [],
      mapData: [], // 地图数据
      dataY: [], // 用户增长趋势
      dataH: [], // 用户增长趋势
      codeBooksData1: [], // 教材验证
      codeBooksData2: [],
      codeBooksData3: [],
      courseData1: [], // 云课购买
      courseData2: [],
      courseData3: [],
      // startTime: "",
      // endTime: "",
      // optionStart: {
      //   disabledDate(date) {
      //     // 禁止选择今天之后的日期
      //     return date && date.valueOf() > Date.now() - 86400000;
      //   }
      // },
      // optionEnd: {},
      data1: {
        // 柱图数据1
        name: "柱图数据1",
        number: "100次",
        data: ["排行1", "排行2", "排行3", "排行4", "排行5"],
        color: "192,35,42",
        value: [60, 50, 40, 30, 20]
      },
      data2: {
        // 饼图数据1
        title: "饼图数据1分类占比",
        color: "#BE232A",

        data: [
          {
            value: 60,
            name: "分类1",
            itemStyle: {
              color: "#a262f2"
            }
          },
          {
            value: 20,
            name: "分类2",
            itemStyle: {
              color: "#2ca8fe"
            }
          },
          {
            value: 80,
            name: "分类3",
            itemStyle: {
              color: "#feac2c"
            }
          },
          {
            value: 40,
            name: "分类4",
            itemStyle: {
              color: "#c0232a"
            }
          },
          {
            value: 40,
            name: "分类5",
            itemStyle: {
              color: "#2cd9fe"
            }
          },
          {
            value: 40,
            name: "分类6",
            itemStyle: {
              color: "#ff787e"
            }
          },
          {
            value: 30,
            name: "其他",
            itemStyle: {
              color: "#252448"
            }
          }
        ]
      },
      data3: {
        // 柱图数据2
        name: "柱图数据2",
        number: "100次",
        data: ["排行1", "排行2", "排行3", "排行4", "排行5"],
        color: "40,112,232",
        value: [6, 5, 4, 3, 2]
      },
      // 饼图数据2
      data4: {
        title: "饼图数据2分类占比",
        color: "#2C7BFE",
        data: [
          {
            value: 20,
            name: "分类1",
            itemStyle: {
              color: "#feed2c"
            }
          },
          {
            value: 20,
            name: "分类2",
            itemStyle: {
              color: "#2ca8fe"
            }
          },
          {
            value: 40,
            name: "分类3",
            itemStyle: {
              color: "#feac2c"
            }
          },
          {
            value: 40,
            name: "分类4",
            itemStyle: {
              color: "#2c7bfe"
            }
          },
          {
            value: 100,
            name: "其他",
            itemStyle: {
              color: "#252448"
            }
          }
        ]
      },
      // 用户机型数据
      data5: {
        title: "用户机型分布",
        data: []
      },
      // 环形数据2
      data6: {
        title: "热词传播次数",
        data: [
          {
            value: 335,
            name: "模拟1",
            itemStyle: {
              color: "#69f262"
            }
          },
          {
            value: 310,
            name: "模拟2",
            itemStyle: {
              color: "#c0232a"
            }
          },
          {
            value: 234,
            name: "模拟3",
            itemStyle: {
              color: "#2cfcfe"
            }
          },
          {
            value: 135,
            name: "其他",
            itemStyle: {
              color: "#252448"
            }
          },
          {
            value: 200,
            name: "模拟4",
            itemStyle: {
              color: "#a262f2"
            }
          }
        ]
      },
      data7: {
        title: "收支笔数及占比",
        data: [
          {
            value: 70,
            name: "收入",
            itemStyle: {
              color: "#c0232a"
            }
          },
          {
            value: 60,
            name: "支出",
            itemStyle: {
              color: "#2870e8"
            }
          }
        ],
        data1: [
          {
            value: 40,
            name: "红包",
            itemStyle: {
              color: "#c0232a"
            }
          },
          {
            value: 60,
            name: "转账",
            itemStyle: {
              color: "#2870e8"
            }
          }
        ]
      },
      data8: {
        title: "收支金额及占比",
        data: [
          {
            value: 80,
            name: "收入",
            itemStyle: {
              color: "#c0232a"
            }
          },
          {
            value: 60,
            name: "支出",
            itemStyle: {
              color: "#2870e8"
            }
          }
        ],
        data1: [
          {
            value: 40,
            name: "红包",
            itemStyle: {
              color: "#c2232a"
            }
          },
          {
            value: 60,
            name: "购物",
            itemStyle: {
              color: "#fe672c"
            }
          },
          {
            value: 40,
            name: "旅游",
            itemStyle: {
              color: "#a262f2"
            }
          },
          {
            value: 20,
            name: "其他",
            itemStyle: {
              color: "#2870e8"
            }
          },
          {
            value: 80,
            name: "交通",
            itemStyle: {
              color: "#feed2c"
            }
          }
        ]
      },
      // 交友分析面积图
      configData9: {
        title: "【交友分析】",
        color: "#75deef",
        name: ["（人）", "（人）"],
        data: [
          {
            name: "新增好友数",
            color: ["#feed2c", "#353103"],
            data: [240, 132, 101, 134, 90, 170, 110]
          },
          {
            name: "好友总数",
            color: ["#2871ea", "#0a1b41"],
            data: [20, 102, 101, 134, 190, 150, 120]
          },
          {
            name: "新增群数",
            color: ["#935adf", "#230f3e"],
            data: [100, 32, 101, 134, 150, 110, 180]
          },
          {
            name: "群总数",
            color: ["#e65f2d", "#551f0b"],
            data: [120, 122, 141, 144, 60, 220, 120]
          }
        ]
      },
      // 交友方式柱图
      colorsData: [
        {
          itemStyle: {
            color: "#2c7bfe"
          },
          name: "漂流瓶",
          value: 255
        },
        {
          itemStyle: {
            color: "#c2232a"
          },
          name: "附近的人",
          value: 212
        },
        {
          itemStyle: {
            color: "#feed2c"
          },
          name: "雷达",
          value: 155
        },
        {
          itemStyle: {
            color: "#a262f2"
          },
          name: "摇一摇",
          value: 55
        },
        {
          itemStyle: {
            color: "#62d5f2"
          },
          name: "搜索",
          value: 80
        },
        {
          itemStyle: {
            color: "#fe672c"
          },
          name: "群聊",
          value: 160
        },
        {
          itemStyle: {
            color: "#69f262"
          },
          name: "扫一扫",
          value: 114
        },
        {
          itemStyle: {
            color: "#2ca8fe"
          },
          name: "其他",
          value: 20
        }
      ],
      data10: {
        title: "省份新增Top10",
        position: ["5%", "14%"],
        center: ["50%", "60%"],
        indicator: [
          // { text: "湖南" },
          // { text: "湖北" },
          // { text: "海南" },
          // { text: "广东" },
          // { text: "广西" },
          // { text: "四川" },
          // { text: "安徽" },
          // { text: "河南" },
          // { text: "河北" },
          // { text: "山东" }
        ],
        data: [
          {
            name: "新增用户",
            color: "#FDC673",
            value: []
          },
          {
            name: "新增班级",
            color: "#B370FD",
            value: []
          }
        ]
      },
      data11: {
        title: "课程名开课情况",
        position: ["5%", "14%"],
        center: ["50%", "60%"],
        indicator: [],
        data: [
          {
            name: "课程开课",
            color: "#FD9800",
            value: []
          },
          {
            name: "",
            color: "#FDC673",
            value: []
          }
        ]
      },
      data12: {
        title: "课件排名",
        position: ["5%", "14%"],
        center: ["50%", "60%"],
        indicator: [],
        data: [
          {
            name: "课件",
            color: "#FD9800",
            value: []
          },
          {
            name: "",
            color: "#FDC673",
            value: []
          }
        ]
      },
      resizeFn: null,
      info: {
        codeBookNewNum: 0,
        classNewNum: 0,
        codeBookTotalNum: 0,
        bookTotalNum: 0,
        resourceNewNum: 0,
        teacherTotalNum: 0,
        teacherNewNum: 0,
        resourceTotalNum: 0,
        classTotalNum: 0,
        bookNewNum: 0,
        userTotalNum: 0,
        userNewNum: 0
      }
    };
  },
  methods: {
    searchClassByTime(value) {
      this.value2 = value;
      this.page.pageNo = 1;
      this.getClassData();
    },
    searchClass() {
      this.page.pageNo = 1;
      this.getClassData();
    },
    getClassData() {
      let data = {
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize
      };
      if (this.province) {
        data.province = this.province;
      }
      if (this.value2.length > 0) {
        data.startDate = this.value2[0];
        data.endDate = this.value2[1];
      }
      axios
        .request({
          method: "post",
          url: `${process.env.BASE_URL_V3}/platform/summary/class/openCoursePage`,
          data
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.classData = ret.data.data;
            this.page.total = ret.data.total;
          } else {
            this.$message({
              type: "error",
              message: `${ret.msg}`
            });
          }
        });
    },
    clickDataIndex1() {
      this.modal1 = true;
    },
    getCourseWareRank1(s, e) {
      axios
        .request({
          method: "post",
          url: `${process.env.BASE_URL_V3}/platform/summary/class/coursewareRank`,
          data: {
            startDate: s,
            endDate: e
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            let data1 = [];
            let data2 = [];
            let data4 = [];
            ret.data.listChart.forEach(item => {
              data1.push({
                text: item.name
              });
              data2.push(item.num);
              data4.push(item.name);
            });
            this.data12.indicator = data1;
            this.data12.data[0].value = data2;
            this.data15.data[1].value = data2;
            this.data15.xData = data4;
            this.$nextTick(() => {
              this.$refs.chart12.setChart();
              this.$refs.chart9.setChart();
            });
          } else {
            this.$message({
              type: "error",
              message: `${ret.msg}`
            });
          }
        });
    },
    // 课件排行
    getCourseWareRank() {
      axios
        .request({
          method: "post",
          url: `${process.env.BASE_URL_V3}/platform/summary/class/coursewareRank`,
          data: {}
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            let data1 = [];
            let data2 = [];
            let data4 = [];
            ret.data.listChart.forEach(item => {
              data1.push({
                text: item.name
              });
              data2.push(item.num);
              data4.push(item.name);
            });
            this.data12.indicator = data1;
            this.data12.data[0].value = data2;
            this.data15.data[1].value = data2;
            this.data15.xData = data4;
            this.$nextTick(() => {
              this.$refs.chart12.setChart();
              this.$refs.chart9.setChart();
            });
          } else {
            this.$message({
              type: "error",
              message: `${ret.msg}`
            });
          }
        });
    },
    getOpenCourse1(s, e) {
      axios
        .request({
          method: "post",
          url: `${process.env.BASE_URL_V3}/platform/summary/class/openCourseRank`,
          data: {
            startDate: s,
            endDate: e
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            let data1 = [];
            let data2 = [];
            let data4 = [];
            ret.data.listChart.forEach(item => {
              data1.push({
                text: item.courseName
              });
              data2.push(item.clazzNum);
              data4.push(item.courseName);
            });
            this.data11.indicator = data1;
            this.data11.data[0].value = data2;
            this.data14.data[1].value = data2;
            this.data14.xData = data4;
            // ??????
            this.$nextTick(() => {
              this.$refs.chart11.setChart();
              this.$refs.chart7.setChart();
            });
          } else {
            this.$message({
              type: "error",
              message: `${ret.msg}`
            });
          }
        });
    },
    // 开课情况
    getOpenCourse() {
      axios
        .request({
          method: "post",
          url: `${process.env.BASE_URL_V3}/platform/summary/class/openCourseRank`,
          data: {}
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            let data1 = [];
            let data2 = [];
            let data4 = [];
            ret.data.listChart.forEach(item => {
              data1.push({
                text: item.courseName
              });
              data2.push(item.clazzNum);
              data4.push(item.courseName);
            });
            this.data11.indicator = data1;
            this.data11.data[0].value = data2;
            this.data14.data[1].value = data2;
            this.data14.xData = data4;
            // ??????
            this.$nextTick(() => {
              this.$refs.chart11.setChart();
              this.$refs.chart7.setChart();
            });
          } else {
            this.$message({
              type: "error",
              message: `${ret.msg}`
            });
          }
        });
    },
    getProvinceTop1(s, e) {
      axios
        .request({
          method: "post",
          url: `${process.env.BASE_URL_V3}/platform/summary/provinceTop`,
          data: {
            startDate: s,
            endDate: e
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            let data1 = [];
            let data2 = [];
            let data3 = [];
            let data4 = [];
            ret.data.listChart.forEach(item => {
              data1.push({
                text: item.name
              });
              data2.push(item.userNum);
              data3.push(item.classNum);
              data4.push(item.name);
            });
            this.data10.indicator = data1;
            this.data10.data[0].value = data2;
            this.data10.data[1].value = data3;
            this.data13.data[0].value = data2;
            this.data13.data[1].value = data3;
            this.data13.xData = data4;
            // ??????
            this.$nextTick(() => {
              this.$refs.chart10.setChart();
              this.$refs.chart8.setChart();
            });
          } else {
            this.$message({
              type: "error",
              message: `${ret.msg}`
            });
          }
        });
    },
    // 省份新增top10
    getProvinceTop() {
      axios
        .request({
          method: "post",
          url: `${process.env.BASE_URL_V3}/platform/summary/provinceTop`,
          data: {}
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            let data1 = [];
            let data2 = [];
            let data3 = [];
            let data4 = [];
            ret.data.listChart.forEach(item => {
              data1.push({
                text: item.name
              });
              data2.push(item.userNum);
              data3.push(item.classNum);
              data4.push(item.name);
            });
            this.data10.indicator = data1;
            this.data10.data[0].value = data2;
            this.data10.data[1].value = data3;
            this.data13.data[0].value = data2;
            this.data13.data[1].value = data3;
            this.data13.xData = data4;
            // ??????
            this.$nextTick(() => {
              this.$refs.chart10.setChart();
              this.$refs.chart8.setChart();
            });
          } else {
            this.$message({
              type: "error",
              message: `${ret.msg}`
            });
          }
        });
    },
    getCourseData1(s, e) {
      axios
        .request({
          method: "post",
          url: `${process.env.BASE_URL_V3}/platform/summary/cloudCourse/buyRank`,
          data: {
            startDate: s,
            endDate: e
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            let data1 = [];
            let data2 = [];
            let data3 = [];
            ret.data.listChart.forEach((item, idx) => {
              data1.push(item.name);
              data2.push(item.buyNum);
              data3.push(item.price);
            });
            this.courseData1 = data1;
            this.courseData2 = data2;
            this.courseData3 = data3;
            this.$nextTick(() => {
              this.$refs.deviceSafeRisk.setDeviceSafe();
            });
          } else {
            this.$message({
              type: "error",
              message: `${ret.msg}`
            });
          }
        });
    },
    // 云课购买
    getCourseData() {
      axios
        .request({
          method: "post",
          url: `${process.env.BASE_URL_V3}/platform/summary/cloudCourse/buyRank`,
          data: {}
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            let data1 = [];
            let data2 = [];
            let data3 = [];
            ret.data.listChart.forEach((item, idx) => {
              data1.push(item.name);
              data2.push(item.buyNum);
              data3.push(item.price);
            });
            this.courseData1 = data1;
            this.courseData2 = data2;
            this.courseData3 = data3;
            this.$nextTick(() => {
              this.$refs.deviceSafeRisk.setDeviceSafe();
            });
          } else {
            this.$message({
              type: "error",
              message: `${ret.msg}`
            });
          }
        });
    },
    // 教材验证
    getCodeBookData() {
      axios
        .request({
          method: "post",
          url: `${process.env.BASE_URL_V3}/platform/summary/book/codeRank`,
          data: {}
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            let data1 = [];
            let data2 = [];
            let data3 = [];
            ret.data.listChart.forEach((item, idx) => {
              data1.push(item.name);
              data2.push(item.num);
              data3.push({
                name: item.name,
                value: item.num
              });
            });
            this.codeBooksData1 = data1;
            this.codeBooksData2 = data2;
            this.codeBooksData3 = data3;
            this.$nextTick(() => {
              this.$refs.webcastsRisk.setWebcasts();
            });
          } else {
            this.$message({
              type: "error",
              message: `${ret.msg}`
            });
          }
        });
    },
    getCodeBookData1(s, e) {
      axios
        .request({
          method: "post",
          url: `${process.env.BASE_URL_V3}/platform/summary/book/codeRank`,
          data: {
            startDate: s,
            endDate: e
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            let data1 = [];
            let data2 = [];
            let data3 = [];
            ret.data.listChart.forEach((item, idx) => {
              data1.push(item.name);
              data2.push(item.num);
              data3.push({
                name: item.name,
                value: item.num
              });
            });
            this.codeBooksData1 = data1;
            this.codeBooksData2 = data2;
            this.codeBooksData3 = data3;
            this.$nextTick(() => {
              this.$refs.webcastsRisk.setWebcasts();
            });
          } else {
            this.$message({
              type: "error",
              message: `${ret.msg}`
            });
          }
        });
    },
    getTotal1(s, e) {
      axios
        .request({
          method: "post",
          url: `${process.env.BASE_URL_V3}/platform/summary/total`,
          data: {
            startDate: s,
            endDate: e
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            let {
              codeBookNewNum,
              classNewNum,
              codeBookTotalNum,
              bookTotalNum,
              resourceNewNum,
              teacherTotalNum,
              teacherNewNum,
              resourceTotalNum,
              classTotalNum,
              bookNewNum,
              userTotalNum,
              userNewNum
            } = ret.data;
            this.info.codeBookNewNum = codeBookNewNum;
            this.info.classNewNum = classNewNum;
            this.info.codeBookTotalNum = codeBookTotalNum;
            this.info.bookTotalNum = bookTotalNum;
            this.info.resourceNewNum = resourceNewNum;
            this.info.teacherTotalNum = teacherTotalNum;
            this.info.teacherNewNum = teacherNewNum;
            this.info.resourceTotalNum = resourceTotalNum;
            this.info.classTotalNum = classTotalNum;
            this.info.bookNewNum = bookNewNum;
            this.info.userTotalNum = userTotalNum;
            this.info.userNewNum = userNewNum;
          } else {
            this.$message({
              type: "error",
              message: `${ret.msg}`
            });
          }
        });
    },
    getTotal() {
      axios
        .request({
          method: "post",
          url: `${process.env.BASE_URL_V3}/platform/summary/total`,
          data: {}
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            let {
              codeBookNewNum,
              classNewNum,
              codeBookTotalNum,
              bookTotalNum,
              resourceNewNum,
              teacherTotalNum,
              teacherNewNum,
              resourceTotalNum,
              classTotalNum,
              bookNewNum,
              userTotalNum,
              userNewNum
            } = ret.data;
            this.info.codeBookNewNum = codeBookNewNum;
            this.info.classNewNum = classNewNum;
            this.info.codeBookTotalNum = codeBookTotalNum;
            this.info.bookTotalNum = bookTotalNum;
            this.info.resourceNewNum = resourceNewNum;
            this.info.teacherTotalNum = teacherTotalNum;
            this.info.teacherNewNum = teacherNewNum;
            this.info.resourceTotalNum = resourceTotalNum;
            this.info.classTotalNum = classTotalNum;
            this.info.bookNewNum = bookNewNum;
            this.info.userTotalNum = userTotalNum;
            this.info.userNewNum = userNewNum;
          } else {
            this.$message({
              type: "error",
              message: `${ret.msg}`
            });
          }
        });
    },
    getCourseHotkeys() {
      axios
        .request({
          method: "post",
          url: `${process.env.BASE_URL_V3}/platform/summary/cloudCourse/hotSearchRank`,
          data: {}
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            let data1 = [];
            let data2 = [];
            ret.data.listChart.forEach((item, idx) => {
              data1.push({
                name: item.keyword,
                value: item.searchNum
              });
              data2.push(idx + 1);
            });
            this.hotWords1 = data1;
            this.hotWords2 = data2;
            this.$nextTick(() => {
              this.$refs.hotWords.setChart();
            });
          } else {
            this.$message({
              type: "error",
              message: `${ret.msg}`
            });
          }
        });
    },
    getTimeUser(data) {
      let str = String(data)
        .split("-")
        .join("");
      axios
        .request({
          method: "post",
          url: `${process.env.BASE_URL_V3}/platform/summary/user/hour/growTrend`,
          data: {
            startDate: str
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            let dataArr = [];
            for (let i = 0; i < ret.data.listChart.length; i++) {
              dataArr.push(ret.data.listChart[i].num);
            }

            this.dataH = dataArr;
            this.$nextTick(() => {
              this.$refs.chart2.setChart();
            });
          } else {
            this.$message({
              type: "error",
              message: `${ret.msg}`
            });
          }
        });
    },
    getHourUser() {
      axios
        .request({
          method: "post",
          url: `${process.env.BASE_URL_V3}/platform/summary/user/hour/growTrend`,
          data: {}
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            let dataArr = [];
            for (let i = 0; i < ret.data.listChart.length; i++) {
              dataArr.push(ret.data.listChart[i].num);
            }

            this.dataH = dataArr;
            this.$nextTick(() => {
              this.$refs.chart2.setChart();
            });
          } else {
            this.$message({
              type: "error",
              message: `${ret.msg}`
            });
          }
        });
    },
    getMapData() {
      axios
        .request({
          method: "post",
          url: `${process.env.BASE_URL_V3}/platform/summary/user/provinceRank`,
          data: {}
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            let dataArr = [];
            ret.data.listChart.forEach(item => {
              dataArr.push({
                name: item.name,
                value: item.num
              });
            });
            this.mapData = dataArr;
            // this.$refs.chinaMap.setMap();
            this.$nextTick(() => {
              this.$refs.chinaMap.setMap();
            });
          } else {
            this.$message({
              type: "error",
              message: `${ret.msg}`
            });
          }
        });
    },
    // 获取用户增长趋势
    getUserTrend() {
      // eslint-disable-next-line no-return-await
      axios
        .request({
          method: "post",
          url: `${process.env.BASE_URL_V3}/platform/summary/user/sevenDay/growTrend`,
          data: {}
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            let dataArr = [];
            for (let i = 0; i < ret.data.listChart.length; i++) {
              dataArr.push(ret.data.listChart[i].num);
            }

            this.dataY = dataArr;

            this.$nextTick(() => {
              this.$refs.chart1.setChart();
            });
          } else {
            this.$message({
              type: "error",
              message: `${ret.msg}`
            });
          }
        });
    },
    // 获取用户机型数据
    getMobileType() {
      axios
        .request({
          method: "post",
          url: `${process.env.BASE_URL_V3}/platform/summary/user/mobileRank`,
          data: {}
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            let dataArr = [];
            ret.data.listChart.forEach((element, idx) => {
              if (idx === 0) {
                dataArr.push({
                  value: element.num,
                  name: element.name,
                  itemStyle: {
                    color: "#252448"
                  }
                });
              } else if (idx === 1) {
                dataArr.push({
                  value: element.num,
                  name: element.name,
                  itemStyle: {
                    color: "#2ca8fe"
                  }
                });
              } else if (idx === 2) {
                dataArr.push({
                  value: element.num,
                  name: element.name,
                  itemStyle: {
                    color: "#feed2c"
                  }
                });
              } else if (idx === 3) {
                dataArr.push({
                  value: element.num,
                  name: element.name,
                  itemStyle: {
                    color: "#2871ea"
                  }
                });
              } else if (idx === 4) {
                dataArr.push({
                  value: element.num,
                  name: element.name,
                  itemStyle: {
                    color: "#fe672c"
                  }
                });
              } else {
                dataArr.push({
                  value: element.num,
                  name: element.name,
                  itemStyle: {
                    color: "#a262f2"
                  }
                });
              }
            });
            this.data5.data = dataArr;
            this.$nextTick(() => {
              this.$refs.chart6.setChart();
            });
          } else {
            this.$message({
              type: "error",
              message: `${ret.msg}`
            });
          }
        });
    },
    pickStartDate(date) {
      // 选择开始时间的回调
      this.startTime = date;
      this.optionEnd = {
        disabledDate(d) {
          // 禁止选择开始时间之前的日期
          return d && d.valueOf() < new Date(date).valueOf() - 86400000;
        }
      };
    },
    pickEndDate(date) {
      // 选择结束时间的回调
      this.endTime = date;
    }
  },
  watch: {
    toUpdate(newValue, oldValue) {
      let sdate = new Date(this.startTime);
      let syear = String(sdate.getFullYear());
      let smonth = String(sdate.getMonth() + 1);
      let sstrDate = String(sdate.getDate());
      if (smonth >= 1 && smonth <= 9) {
        smonth = "0" + smonth;
      }
      if (sstrDate >= 0 && sstrDate <= 9) {
        sstrDate = "0" + sstrDate;
      }

      let edate = new Date(this.endTime);
      let eyear = String(edate.getFullYear());
      let emonth = String(edate.getMonth() + 1);
      let estrDate = String(edate.getDate());
      if (emonth >= 1 && emonth <= 9) {
        emonth = "0" + emonth;
      }
      if (estrDate >= 0 && estrDate <= 9) {
        estrDate = "0" + estrDate;
      }
      let s = `${syear}${smonth}${sstrDate}`;
      let e = `${eyear}${emonth}${estrDate}`;
      this.getTotal1(s, e); // 顶部数据
      this.getCourseData1(s, e); // 云课购买
      this.getCodeBookData1(s, e); // 教材验证
      this.getCourseWareRank1(s, e); // 课件排行
      this.getOpenCourse1(s, e); // 开课名称
      this.getProvinceTop1(s, e); // 省份新增top10
      this.$emit("recover");
    },
    selectRangeDate: function() {
      // for (let i = 1; i < 18; i++) {
      //   this.$refs["chart" + i].setChart();
      // }
    }
  },
  created() {},
  mounted() {
    // this.$refs["chart1"].setChart();
    this.getClassData();
    this.getMapData();
    this.getHourUser();
    this.getTotal();
    this.getMobileType();
    this.getUserTrend();
    this.getCourseData(); // 云课购买
    this.getCodeBookData(); // 教材验证

    this.getCourseHotkeys();
    this.getProvinceTop(); // 按省份新增用户和班级top10
    this.getOpenCourse(); // 课程开课
    this.getCourseWareRank(); // 课件排行

    // let that = this;
    this.resizeFn = this.$debounce(() => {
      this.$refs.chinaMap.setMap(); // 地图
      this.$refs.chart6.setChart(); // 机型
      this.$refs.chart10.setChart();
      this.$refs.chart8.setChart();
      this.$refs.chart11.setChart();
      this.$refs.chart7.setChart();
      this.$refs.chart12.setChart();
      this.$refs.chart9.setChart();
      this.$refs.chart1.setChart();
      this.$refs.chart2.setChart();
      this.$refs.hotWords.setChart();
      this.$refs.webcastsRisk.setWebcasts();
      this.$refs.deviceSafeRisk.setDeviceSafe();
      // 通过捕获系统的onresize事件触发我们需要执行的事件
      // for (let i = 1; i < 18; i++) {
      //   this.$refs["chart" + i].setChart();
      // }
    }, 500);
    window.addEventListener("resize", this.resizeFn);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeFn);
    console.log("销毁1");
  }
};
</script>

<style lang="scss" scoped>
.modal1-selTime {
  display: flex;
  margin-bottom: 10px;
  .ivu-select {
    color: #75deef;
    /deep/ .ivu-select-placeholder {
      color: #75deef;
    }
  }
}
.modal1-table {
  background-color: rgba(0, 0, 0, 0);
  // border: 1px solid #1a3c58;
  color: #75deef;
  border-right: 1px solid #1a3c58;
  /deep/ .ivu-table-wrapper {
    // border: 1px solid #1a3c58;
    .ivu-table-default {
      background-color: rgba(0, 0, 0, 0);
      color: #75deef;
      font-size: 14px;
    }
    /deep/ .ivu-table {
      color: #75deef;
    }
  }
}
.modal1-pager {
  color: #75deef;

  /deep/ li {
    background-color: rgba(0, 0, 0, 0);
    border: 1px solid #1a3c58;
    color: #75deef;
    a {
      background-color: rgba(0, 0, 0, 0);
      color: #75deef;
    }
  }
  /deep/ .ivu-page-options {
    .ivu-page-options-elevator {
      color: #75deef;
      input {
        background-color: rgba(0, 0, 0, 0);
        border: 1px solid #1a3c58;
        color: #75deef;
      }
    }
  }
}
.page1 {
  height: 100%;
  width: 100%;
  padding: 14px 20px 20px;
  background: #03044a;
  overflow: hidden;

  .listTop {
    height: 62%;

    .ivu-col {
      height: 100%;

      .leftTop {
        width: 100%;
        height: 100%;
        border: 1px solid #0d2451;
        position: relative;
        .left1-data {
          width: 100%;
          height: 20%;
          position: absolute;
          top: 0;
          // background-color: red;
          // background-color: #151456;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .data-content {
            width: 18%;
            // background-color: red;
            .data-content-t {
              width: 100%;
              height: 50%;
              text-align: center;
              display: flex;
              flex-direction: column;
              color: #75deef;
              font-size: 16px;
              .data-text {
                font-size: 16px;
              }
              .data-num {
                font-size: 24px;
                font-weight: bold;
              }
            }
            .data-content-b {
              width: 100%;
              height: 50%;
              text-align: center;
              display: flex;
              flex-direction: column;
              // color: #fff;
              color: #75deef;
              font-size: 16px;
              .data-text {
                font-size: 16px;
              }
            }
          }
        }
        .left1 {
          width: 100%;
          height: 57%;
          padding-top: 18%;
        }

        .left2 {
          width: 100%;
          height: 40%;
          // padding: 10px 0;
        }
      }

      .topMiddle {
        width: 100%;
        height: 100%;
        // border: 1px solid #0d2451;
        position: relative;
        .topMiddle-1 {
          width: 100%;
          height: 20%;
          // border: 1px solid #0d2451;
          // background-color: #151456;
          position: relative;
          .data-container {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .data-content {
              width: 18%;
              // background-color: red;
              .data-content-t {
                width: 100%;
                height: 50%;
                text-align: center;
                display: flex;
                flex-direction: column;
                color: #75deef;
                font-size: 16px;
                .data-text {
                  font-size: 16px;
                }
                .data-num {
                  font-size: 24px;
                  font-weight: bold;
                }
              }
              .data-content-b {
                width: 100%;
                height: 50%;
                text-align: center;
                display: flex;
                flex-direction: column;
                // color: #fff;
                color: #75deef;
                font-size: 16px;
                .data-text {
                  font-size: 16px;
                }
              }
            }
          }
        }
        .topMiddle-2 {
          width: 100%;
          height: 80%;
          // border: 1px solid #0d2451;
          position: relative;
          .data-tip {
            // color: #fff;
            color: #75deef;
            position: absolute;
            right: 20px;
            top: 15px;
          }
        }
      }

      .rightTop-1 {
        width: 100%;
        height: 55%;
        border: 1px solid #0d2451;
        position: relative;
      }

      .rightTop-2 {
        width: 100%;
        margin-top: 4%;
        height: 40%;
        border: 1px solid #0d2451;
        position: relative;

        .rightTop-list {
          width: 100%;
          height: 100%;

          .list {
            width: 30%;
            height: 100%;
            float: left;

            &:first-child {
              width: 40%;
            }
          }
        }
      }
    }
  }

  .listBottom {
    height: 40%;

    .ivu-col-span-9 {
      width: 33.5%;
      margin-right: 0.6667%;
    }

    .ivu-col-span-4 {
      width: 17.66667%;
      margin-right: 0.6667%;
    }

    .ivu-col {
      height: 100%;

      .content {
        margin-top: 30px;
        height: calc(100% - 30px);
        border: 1px solid #0d2451;
        position: relative;

        .ivu-row {
          &.topLine {
            height: 55%;
          }

          &.bottomPie {
            height: 45%;
          }

          .ivu-col {
            height: 100%;

            .charts-list {
              height: 100%;
              width: 100%;
            }
          }
        }

        .bottom-part {
          width: 100%;
          height: 100%;
        }
        .bottom-radars {
          height: 55%;
        }

        .bottom-bars {
          height: 45%;
        }
        .behavior {
          width: 100%;
          height: 100%;
        }

        .appUse {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
