<template>
  <div class="webcastsRisk"></div>
</template>

<script>
export default {
  name: "webcastsRisk",
  props: {
    data1: Array,
    data2: Array,
    data3: Array
  },
  data() {
    return {};
  },
  methods: {
    // 网播风险分析
    setWebcasts() {
      let option = {
        title: {
          text: "教材验证TOP10",
          textStyle: {
            color: "#75deef",
            fontSize: 12
          },
          top: "4%",
          left: "4%"
        },
        // tooltip: {
        //   trigger: "axis",
        //   axisPointer: {
        //     // 坐标轴指示器，坐标轴触发有效
        //     type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
        //   }
        // },
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c}",
          backgroundColor: "#11367a",
          textStyle: {
            color: "#6dd0e3",
            fontSize: 12
          }
        },
        // legend: {
        //   data: [
        //     { name: "抖音", icon: "circle" },
        //     { name: "快手", icon: "circle" },
        //     { name: "花椒", icon: "circle" },
        //     { name: "其他", icon: "circle" }
        //   ],
        //   gridIndex: 3,
        //   right: "5%",
        //   top: "6%",
        //   itemWidth: 7,
        //   itemHeight: 7,
        //   textStyle: {
        //     color: "#00CCFF",
        //     fontSize: 10
        //   }
        // },
        grid: {
          top: "15%",
          left: "3%",
          right: "50%",
          bottom: "5%",
          containLabel: true
        },
        xAxis: {
          type: "value",
          axisLabel: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLine: { show: false }
        },
        yAxis: {
          type: "category",
          axisTick: { show: false },
          splitLine: { show: false },
          axisLine: { show: false },
          axisLabel: {
            color: "#75deef",
            backgroundColor: "#4A7AFF",
            borderRadius: 3,
            margin: 0,
            padding: [1, 3, 1, 3],
            formatter: function(value) {
              if (value.length > 4) {
                return `${value.slice(0, 4)}...`;
              }
              return value;
            }
          },
          inverse: true,
          data: this.data1
          // data: [
          //   "大学物理",
          //   "高等数学",
          //   "线性代数",
          //   "4",
          //   "5",
          //   "6",
          //   "7",
          //   "8",
          //   "9",
          //   "10"
          // ]
        },
        series: [
          {
            name: "抖音",
            type: "bar",
            stack: "总量",
            barWidth: 8,
            itemStyle: {
              color: "#142AFE",
              barBorderRadius: [0, 8, 8, 0]
            },
            label: {
              normal: {
                show: true,
                position: "right",
                textStyle: {
                  color: "#75deef"
                }
              }
            },
            // data: [100, 90, 80, 70, 60, 50, 40, 30, 20, 15]
            data: this.data2
          },
          // {
          //   name: "快手",
          //   type: "bar",
          //   stack: "总量",
          //   barWidth: 8,
          //   itemStyle: {
          //     color: "#1456FE",
          //     barBorderRadius: [0, 8, 8, 0]
          //   },
          //   label: {
          //     normal: {
          //       show: false,
          //       position: "insideRight"
          //     }
          //   },
          //   data: [100, 90, 80, 70, 60, 50, 40, 30, 20, 15]
          // },
          // {
          //   name: "花椒",
          //   type: "bar",
          //   stack: "总量",
          //   barWidth: 8,
          //   itemStyle: {
          //     color: "#1493FE",
          //     barBorderRadius: [0, 8, 8, 0]
          //   },
          //   label: {
          //     normal: {
          //       show: false,
          //       position: "insideRight"
          //     }
          //   },
          //   data: [100, 90, 80, 70, 60, 50, 40, 30, 20, 15]
          // },
          // {
          //   name: "其他",
          //   type: "bar",
          //   barWidth: 8,
          //   stack: "总量",
          //   itemStyle: {
          //     color: "#00CCFF",
          //     barBorderRadius: [0, 8, 8, 0]
          //   },
          //   label: {
          //     normal: {
          //       show: false,
          //       position: "insideRight"
          //     }
          //   },
          //   data: [100, 90, 80, 70, 60, 50, 40, 30, 20, 15]
          // },
          {
            type: "pie",
            radius: ["20%", "21%"],
            center: ["72%", "60%"],
            data: [{ value: "1" }],
            label: { show: false },
            itemStyle: {
              color: "#7D7DA2"
            }
          },
          {
            type: "pie",
            radius: ["40%", "65%"],
            roseType: "area",
            center: ["72%", "60%"],
            avoidLabelOverlap: true,
            startAngle: 180,
            label: {
              normal: {
                show: false,
                padding: [0, -30],
                formatter: "{b} \n\n",
                position: "outside",
                color: "#fff"
              },
              emphasis: {
                show: false,
                textStyle: {
                  fontSize: "20",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              show: true,
              length2: 30,
              lineStyle: {
                //color:["#408BE8",'#FE405C',"#3E3E7F","#FFC740"]
              }
            },
            itemStyle: {
              color: function(params) {
                let corList = [
                  "#142AFE",
                  "#3FA0FF",
                  "#00CCFF",
                  "#1456FE",
                  "b26bff",
                  "#408BE8",
                  "#FE405C",
                  "#3E3E7F",
                  "#FFC740",
                  "#fff"
                ];
                return corList[params.dataIndex];
              }
            },
            data: this.data3
            // data: [
            //   {
            //     value: 535,
            //     name: "大学物理"
            //   },
            //   { value: 310, name: "高数" },
            //   { value: 135, name: "线性代数" },
            //   { value: 254, name: "数理统计" }
            // ]
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
    this.setWebcasts();
  }
};
</script>

<style lang="scss" scoped>
.webcastsRisk {
  height: 100%;
}
</style>
