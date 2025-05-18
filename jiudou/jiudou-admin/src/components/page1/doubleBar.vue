<template>
  <div class="chart"></div>
</template>

<style lang="scss" scoped>
.chart {
  height: 100%;
}
</style>

<script>
export default {
  name: "",
  props: {
    data: Object
  },
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
          }
        },
        title: {
          text: this.data.title,
          top: "5%",
          left: "5%",
          textStyle: {
            color: "#fff",
            fontSize: 12
          }
        },
        legend: {
          data: [
            { name: this.data.data[0].name, icon: "circle" },
            { name: this.data.data[1].name, icon: "circle" }
          ],
          left: "center",
          top: "17%",
          orient: "horizontal",
          itemWidth: 7,
          itemHeight: 7,
          itemGap: 10,
          textStyle: {
            color: "#67C3D6",
            fontSize: 10
          }
        },
        grid: {
          left: "5%",
          top: "35%",
          right: "5%",
          bottom: "15%"
        },
        xAxis: {
          axisLine: {
            lineStyle: {
              color: "#2B427F"
            }
          },
          axisLabel: {
            color: "#0DF5F8",
            fontSize: 10,
            interval: 0,
            formatter: function(value) {
              if (value.length > 3) {
                return `${value.slice(0, 3)}...`;
              }
              return value;
            }
          },
          axisTick: {
            inside: true,
            alignWithLabel: true,
            interval: 0,
            color: "#2B427F"
          },
          data: this.data.xData
        },

        yAxis: {
          type: "value",
          axisLine: {
            show: false
          },
          axisLabel: { show: false },
          axisTick: { show: false },
          splitLine: {
            lineStyle: {
              color: "#2B427F"
            }
          }
        },
        series: [
          {
            type: "bar",
            label: {
              normal: {
                show: true,
                position: "top",
                textStyle: {
                  color: "#75deef"
                }
              }
            },
            name: this.data.data[0].name,
            barWidth: 8,
            barGap: 0,
            itemStyle: {
              barBorderRadius: 2,
              color: this.data.data[0].color
            },
            data: this.data.data[0].value
          },
          {
            type: "bar",
            label: {
              normal: {
                show: true,
                position: "top",
                textStyle: {
                  color: "#75deef"
                }
              }
            },
            name: this.data.data[1].name,
            barWidth: 8,
            barGap: 0,
            itemStyle: {
              barBorderRadius: 2,
              color: this.data.data[1].color
            },
            data: this.data.data[1].value
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
