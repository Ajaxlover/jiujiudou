<template>
  <div class="barChart"></div>
</template>

<script>
export default {
  name: "",
  data() {
    return {};
  },
  methods: {
    setChart() {
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          },
          backgroundColor: "#11367a",
          textStyle: {
            color: "#6dd0e3",
            fontSize: 14
          }
        },
        legend: {
          left: "11%",
          top: "15%",
          itemWidth: 7,
          itemHeight: 7,
          textStyle: {
            color: "#5CB1C1"
          }
        },
        grid: {
          top: "12%",
          bottom: "12%",
          left: "10%",
          right: "10%",
          containLabel: false
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: true,
            axisLine: {
              symbol: ["none", "arrow"],
              symbolSize: [6, 6],
              symbolOffset: [0, 10],
              lineStyle: {
                color: "#122C49"
              }
            },
            axisTick: { show: false },
            axisLabel: {
              color: "#61B9C8",
              fontSize: 10,
              interval: 0
            },
            data: [
              "湖南",
              "河南",
              "广东",
              "安徽",
              "浙江",
              "山东",
              "湖北",
              "福建",
              "山西",
              "江西"
            ]
          }
        ],
        yAxis: [
          {
            type: "value",
            scale: true,
            max: 90000,
            min: 0,
            interval: 10000,
            axisLine: {
              show: false
            },
            // axisLine: {
            //   symbol: ["none", "arrow"],
            //   symbolSize: [6, 6],
            //   lineStyle: {
            //     color: "#122C49"
            //   }
            // },
            axisLabel: {
              show: false
              // color: "#61B9C8",
              // showMaxLabel: false,
              // fontSize: 10
            },
            splitLine: {
              show: false
            },
            axisTick: { show: false }

            // name: "",
            // nameGap: -5,
            // nameTextStyle: {
            //   color: "#61B9C8",
            //   fontSize: 9,
            //   align: "right",
            //   padding: [0, 4, 0, 0]
            // }
          }
        ],
        series: [
          {
            name: "用户数",
            type: "bar",
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "#50A2F6" // 0% 处的颜色
                  },
                  {
                    offset: 0.4,
                    color: "#9490F9" // 40% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#DF7DFD" // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              } //背景渐变色
            },
            barWidth: 4,
            barCategoryGap: 0,
            data: [
              71094,
              69489,
              63960,
              63280,
              58222,
              50564,
              48034,
              45541,
              40744,
              29822
            ]
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
.barChart {
  width: 100%;
  height: 100%;
}
</style>
