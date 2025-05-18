<template>
  <div class="singleAreaChart">
    <div class="dateChange">
      <Select
        size="small"
        v-model="model1"
        @on-change="search"
        style="width:120px;text-align:center"
      >
        <Option
          v-for="(item, idx) in dateList"
          :value="item.value"
          :key="idx"
          >{{ item.label }}</Option
        >
      </Select>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    selectRangeDate: Array,
    dateList: Array,
    dataY: Array
    // currDate: String
  },
  data() {
    return {
      // dateList: [
      //   {
      //     value: "beijing",
      //     label: "北京市"
      //   },
      //   {
      //     value: "shanghai",
      //     label: "上海市"
      //   },
      //   {
      //     value: "shenzhen",
      //     label: "深圳市"
      //   },
      //   {
      //     value: "hangzhou",
      //     label: "杭州市"
      //   },
      //   {
      //     value: "nanjing",
      //     label: "南京市"
      //   },
      //   {
      //     value: "chongqing",
      //     label: "重庆市"
      //   }
      // ],
      model1: this.dateList[0].value
    };
  },
  methods: {
    search() {
      this.$emit("search", this.model1);
    },
    setData(type) {
      let arr = [];
      switch (type) {
        case "x":
          let arr1 = [];
          for (let i = 0; i < 24; i++) {
            arr1.push(i);
          }
          // for (let i = 0; i < this.selectRangeDate.length; i++) {
          //   arr.push(
          //     this.selectRangeDate[i][1] + "." + this.selectRangeDate[i][2]
          //   );
          // }

          for (let i = 0; i < arr1.length; i++) {
            arr.push(arr1[i]);
          }
          break;
        case "s":
          arr = this.dataY;

          // for (let i = 0; i < 24; i++) {
          //   arr.push((Math.random() * 250).toFixed(0));
          // }
          break;

        default:
          break;
      }

      return arr;
    },
    setChart() {
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "line" // 默认为直线，可选为：'line' | 'shadow'
          },
          backgroundColor: "#11367a",
          textStyle: {
            color: "#6dd0e3",
            fontSize: 10
          }
        },
        grid: {
          top: "12%",
          bottom: "12%",
          left: "6%",
          right: "5%"
        },
        // legend: {
        //   right: "5%",
        //   top: "10%",
        //   itemWidth: 7,
        //   itemHeight: 7,
        //   textStyle: {
        //     color: "#5CB1C1"
        //   }
        // },
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisLabel: {
            color: "#61B9C8",
            fontSize: 10
          },
          axisLine: {
            symbol: ["none", "arrow"],
            symbolSize: [6, 6],
            symbolOffset: [0, 5],
            lineStyle: {
              color: "#122C49"
            }
          },
          axisTick: {
            color: "#122C49",
            inside: true
          },
          z: 2,
          data: this.setData("x")
        },
        yAxis: {
          type: "value",
          interval: 150,
          min: 0,
          max: 800,
          splitNumber: 7,
          axisLine: {
            symbol: ["none", "arrow"],
            symbolSize: [6, 6],
            lineStyle: {
              color: "#122C49"
            }
          },
          axisLabel: {
            color: "#61B9C8",
            showMaxLabel: false,
            fontSize: 10
          },
          splitLine: {
            show: false
          },
          name: "",
          nameGap: -10,
          nameTextStyle: {
            color: "#61B9C8",
            fontSize: 9,
            align: "right",
            padding: [0, 6, 0, 0]
          }
        },

        series: [
          {
            name: "用户增长数",
            type: "line",
            // symbol: "none",
            symbolSize: 8, //设置折线上圆点大小
            smooth: true,
            data: this.setData("s"),
            lineStyle: {
              width: 1,
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    // color: "#B21356" // 0% 处的颜色
                    color: "#48cefd" // 0% 处的颜色
                  },
                  {
                    offset: 0.4,
                    color: "#48cefd" // 40% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#5356f1" // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              } //背景渐变色
            },
            itemStyle: {
              // color: "rgb(212,37,43)"
              color: "#5356f1",
              normal: {
                label: {
                  show: true,
                  textStyle: {
                    color: "#75deef"
                  },
                  color: "#1F824E", //改变折线点的颜色
                  lineStyle: {
                    color: "#1F824E" //改变折线颜色
                  }
                }
              }
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "#48cefd" // 0% 处的颜色
                  },
                  {
                    offset: 0.4,
                    color: "#48cefd" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#5356f1" // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }, //背景渐变色
              origin: "start"
            }
          }
        ]
      };
      let myChart = this.$echarts(this.$el);

      myChart.clear();
      myChart.resize();

      myChart.setOption(option);
    }
  },
  mounted() {
    this.setChart();
  }
};
</script>

<style lang="scss" scoped>
.singleAreaChart {
  width: 100%;
  height: 100%;
  // position: relative;
  // overflow: hidden;
  .dateChange {
    float: right;
    // position: absolute;
    // right: 0;
    /deep/ .ivu-select-selection {
      background-color: rgba(0, 0, 0, 0);
      border: 1px solid #75deef;
      color: #75deef;
      .ivu-select-arrow {
        color: #75deef;
      }
    }
  }
}
</style>
