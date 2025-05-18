<template>
  <div class="bintu">
    <div ref="main" style="width: 600px;height:400px;"></div>
    <div class="footer">
      <div class="footer-item" v-for="(item, index) in footTabs" :key="index">
        <span class="footer-item-title">{{ item.title }}</span>
        <span>{{ item.percent }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: Array,
    footTabs: Array
  },
  data() {
    return {
      option: {
        tooltip: {
          trigger: "item"
        },
        series: [
          {
            type: "pie",
            radius: "50%",
            data: this.data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      }
    };
  },
  computed: {
    // bingTuData() {
    //   return this.$store.state.homeWork.bingTuData;
    // }
  },
  mounted() {
    this.init(this.option);
  },
  methods: {
    init(option) {
      let chartDom = this.$refs.main;
      // eslint-disable-next-line no-undef
      let myChart = echarts.init(chartDom);
      option && myChart.setOption(option);
    }
  }
};
</script>

<style lang="scss" scoped>
.bintu {
  .main {
  }
  .footer {
    height: 100px;
    // background-color: red;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: space-between;
    .footer-item {
      width: 50px;
      display: flex;
      flex-direction: column;
      .footer-item-title {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
