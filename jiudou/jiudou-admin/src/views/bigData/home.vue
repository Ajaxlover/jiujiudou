<template>
  <div style="height:100%;">
    <div class="header-big-data">
      <div class="selectRange">
        <!-- <Menu
          mode="horizontal"
          @on-select="name => $router.push(name)"
          :active-name="$route.name"
        >
          <MenuItem name="page1">
            监控平台
          </MenuItem>
          <MenuItem name="page2">
            数据详情
          </MenuItem>
          <MenuItem name="page3">
            page3
          </MenuItem>
        </Menu> -->
      </div>
      <div class="jd-top-title">
        九斗可视化平台
      </div>

      <div class="selectRange">
        <!-- <div class="dateTime">
          {{ dateTime }}
        </div> -->
        <Menu
          mode="horizontal"
          @on-select="handleSelect"
          :active-name="activeName"
        >
          <!-- <MenuItem name="day">
            昨日
          </MenuItem>
          <MenuItem name="week">
            近一周
          </MenuItem>
          <MenuItem name="month">
            近一月
          </MenuItem> -->
          <Submenu name="4">
            <template slot="title">
              <Icon type="ios-settings-outline" size="24" color="#60C2D4" />
            </template>
            <MenuItem name="filter">筛选</MenuItem>
          </Submenu>
          <MenuItem name="5">
            <Icon
              @click="changeFullScreen"
              type="ios-expand"
              size="24"
              color="#60C2D4"
            />
          </MenuItem>
        </Menu>
      </div>
    </div>
    <Modal
      v-model="modal"
      title="选择时间"
      :mask-closable="false"
      @on-ok="getMonthBetween(startTime, endTime)"
    >
      <!-- @on-change="pickStartDate" -->

      <DatePicker
        :options="optionStart"
        type="date"
        :clearable="false"
        v-model="startTime"
        placeholder="选择开始日期"
        style="width: 200px"
      ></DatePicker>
      <span style="padding:0 20px;color:#75deef">至</span>
      <!-- @on-change="pickEndDate" -->
      <DatePicker
        :options="optionEnd"
        type="date"
        :clearable="false"
        v-model="endTime"
        placeholder="选择结束日期"
        style="width: 200px"
      ></DatePicker>
    </Modal>
    <div class="page">
      <router-view
        v-if="flag"
        :startTime="startTime"
        :endTime="endTime"
        :dateList="dateList"
        :toUpdate="toUpdate"
        @recover="recover"
        :selectRangeDate="selectRangeDate"
      ></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      toUpdate: false,
      dateList: [],
      fullscreen: false,
      dateTime: "",
      timeTrim: null, //定时器
      activeName: "week", //
      modal: false,
      flag: false,
      selectRangeDate: [],
      startTime: "",
      endTime: "",
      optionStart: {
        disabledDate(date) {
          // 禁止选择今天之后的日期
          return date && date.valueOf() > Date.now() - 86400000;
        }
      },
      optionEnd: {},
      resizeFn: null
    };
  },
  created() {
    this.dateTime = this.getNowFormatDate(); //获取当前日期、时间
  },
  mounted() {
    window.addEventListener("resize", this.resizeFn);
    this.handleSelect(this.activeName); // 默认显示近一个月
    this.setYesToday();

    let arr = this.getDayAll(this.startTime, this.endTime);
    arr.forEach(item => {
      this.dateList.push({
        value: item,
        label: item
      });
    });
    this.timeTrim = setInterval(() => {
      //初始化定时器
      this.dateTime = this.getNowFormatDate();
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timeTrim); //销毁定时器
  },
  methods: {
    recover() {
      this.toUpdate = false;
    },
    // 切换全屏
    changeFullScreen() {
      const element = document.documentElement;
      // 如果是全屏状态
      if (this.fullscreen) {
        // 如果浏览器有这个Function
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        // 如果浏览器有这个Function
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        }
      }
      // 判断全屏状态的变量
      this.fullscreen = !this.fullscreen;
    },
    setYesToday() {
      let date = new Date();

      let year = String(date.getFullYear());
      let month = String(date.getMonth() + 1);
      let strDate = String(date.getDate() - 1);
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      this.startTime = `${year}-${month}-${strDate}`;

      this.endTime = `${year}-${month}-${strDate}`;
      // this.startTime = `${year}/${month}/${strDate} - ${year}/${month}/${strDate}`;
      // this.endTime = `${year}/${month}/${strDate} - ${year}/${month}/${strDate}`;
    },
    getNowFormatDate() {
      //获取当前日期、时间
      var date = new Date();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();

      var hours = date.getHours();
      var minutes = date.getMinutes();

      let seconds = date.getSeconds();

      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      if (hours >= 0 && hours <= 9) {
        hours = "0" + hours;
      }
      if (minutes >= 0 && minutes <= 9) {
        minutes = "0" + minutes;
      }
      if (seconds >= 0 && seconds <= 9) {
        seconds = "0" + seconds;
      }

      // eslint-disable-next-line no-array-constructor
      var a = new Array("日", "一", "二", "三", "四", "五", "六");
      var week = new Date().getDay();
      var weekDay = "星期" + a[week];

      //时间格式化
      // date.getSeconds() 获取秒数(0-59)
      let currentDate = `${date.getFullYear()}年${month}月${strDate}日 ${weekDay} ${hours}:${minutes}:${seconds}`;
      return currentDate;
    },
    pickStartDate(date) {
      console.log("start", date);
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
      console.log("end", date);

      // 选择结束时间的回调
      this.endTime = date;
    },
    getMonthBetween(start, end) {
      console.log("444", start, end);
      let arr1 = this.getDayAll(start, end);
      console.log(arr1);
      this.dateList = [];
      arr1.forEach(item => {
        this.dateList.push({
          value: item,
          label: item
        });
      });

      this.toUpdate = true;

      // this.$nextTick(() => {
      //   this.$refs.page1.getTotal();
      // });
      // this.dateList = this.getDayAll(start, end);

      // 获取开始时间和结束时间之内的所有月份
      // this.selectRangeDate = [];
      // let s = start.split("-"); // 字符串装换数组
      // let e = end.split("-");
      // console.log(s, e);
      // let date = new Date();
      // let min = date.setFullYear(s[0], s[1] - 1); // 设置最小时间
      // let max = date.setFullYear(e[0], e[1] - 1); // 设置最大时间
      // let curr = min;
      // // eslint-disable-next-line no-unmodified-loop-condition
      // while (curr <= max) {
      //   // 循环添加月份
      //   var month = curr.getMonth();
      //   var arr = [curr.getFullYear(), month + 1];
      //   this.selectRangeDate.push(arr);
      //   curr.setMonth(month + 1);
      // }
    },
    getDate(datestr) {
      var temp = String(datestr).split("-");

      if (temp[1] === "01") {
        temp[0] = parseInt(temp[0], 10) - 1;

        temp[1] = "12";
      } else {
        temp[1] = parseInt(temp[1], 10) - 1;
      }

      //new Date()的月份入参实际都是当前值-1

      var date = new Date(temp[0], temp[1], temp[2]);

      return date;
    },
    getDayAll(start, end) {
      console.log("222", start, end);
      let startTime = new Date(start);
      let endTime = new Date(end);
      // var startTime = this.getDate(start);

      // var endTime = this.getDate(end);

      var dateArr = [];

      while (endTime.getTime() - startTime.getTime() >= 0) {
        var year = startTime.getFullYear();

        var month =
          startTime.getMonth().toString().length === 1
            ? "0" + (parseInt(startTime.getMonth().toString(), 10) + 1)
            : startTime.getMonth() + 1;

        var day =
          startTime.getDate().toString().length === 1
            ? "0" + startTime.getDate()
            : startTime.getDate();

        dateArr.push(year + "-" + month + "-" + day);

        startTime.setDate(startTime.getDate() + 1);
      }

      return dateArr;
    },
    getDays(day) {
      // 获取天数
      let arr = [];
      for (let i = -day; i < 0; i++) {
        // 循环添加天数
        let today = new Date(); // 获取今天
        // eslint-disable-next-line camelcase
        let targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * i;
        today.setTime(targetday_milliseconds); //设置i天前的时间
        let tYear = today.getFullYear();
        let tMonth = today.getMonth();
        let tDate = today.getDate();
        let date = [tYear, tMonth + 1, tDate];
        arr.push(date);
      }
      return arr;
    },
    handleSelect(name) {
      switch (name) {
        case "day":
          break;
        case "week":
          this.selectRangeDate = this.getDays(7); // 获取近一周的天数
          this.flag = true;

          break;
        case "month":
          this.selectRangeDate = this.getDays(30); // 获取近一个月的天数
          this.flag = true;
          break;
        case "filter":
          this.modal = true;
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style lang="scss">
.ivu-modal {
  .ivu-modal-content {
    background: #071332;

    .ivu-modal-header {
      border-bottom: 1px solid #1a3c58;

      .ivu-modal-header-inner {
        color: #75deef;
      }
    }

    .ivu-modal-body {
      text-align: center;

      .ivu-icon {
        color: #75deef;
      }

      .ivu-modal-confirm-body {
        padding-left: 0;
        color: #75deef;
      }

      .ivu-input {
        background-color: rgba(0, 0, 0, 0);
        border: 1px solid #1a3c58;
        color: #75deef;

        &::-webkit-input-placeholder {
          /* WebKit, Blink, Edge */
          color: #75deef;
        }

        &::-moz-placeholder {
          /* Mozilla Firefox 4 to 18 */
          color: #75deef;
        }

        &::-moz-placeholder {
          /* Mozilla Firefox 19+ */
          color: #75deef;
        }

        &::-ms-input-placeholder {
          /* Internet Explorer 10-11 */
          color: #75deef;
        }
      }

      .ivu-picker-panel-body {
        background: #071332;

        .ivu-date-picker-header {
          color: #75deef;
          border-bottom: 1px solid #1a3c58;
        }

        .ivu-date-picker-cells-cell {
          color: #75deef;

          &:hover em {
            background: #1a3c58;
          }
        }

        .ivu-date-picker-cells-cell-disabled {
          background: rgba(0, 0, 0, 0);
          color: #eee;
        }

        .ivu-date-picker-cells-focused em {
          box-shadow: 0 0 0 1px #1a3c58 inset;

          &::after {
            background: #1a3c58;
          }
        }
      }
    }

    .ivu-modal-footer {
      border-top: 1px solid #1a3c58;

      .ivu-btn-primary {
        color: #75deef;
        background: #1a3c58;
      }

      .ivu-btn-text {
        color: #ddd;

        &:hover {
          color: #75deef;
          background: #1a3c58;
        }
      }
    }
  }
}

.header-big-data {
  height: 80px;
  background: #03044a;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .jd-top-title {
    color: #75deef;
    font-size: 30px;
    letter-spacing: 10px;
  }

  .selectRange {
    height: 100%;
    // display: flex;
    // align-items: center;
    .dateTime {
      text-align: center;
      font-size: 17px;
      letter-spacing: 3px;
      font-family: "LedFont";
      color: #75deef;
    }
    .ivu-menu-horizontal {
      background: rgba(255, 255, 255, 0);

      &::after {
        height: 0;
      }

      .ivu-menu-item-active {
        border-bottom: 2px solid #264e5e;
      }

      .ivu-menu-item,
      .ivu-menu-submenu {
        color: #75deef;

        &:hover {
          border-bottom: 2px solid #264e5e;
        }
      }

      .ivu-select-dropdown {
        background: #09102e;

        .ivu-menu-item {
          color: #75deef;

          &:hover {
            border-bottom: 2px solid #264e5e;
            background-color: rgba(255, 255, 255, 0);
          }
        }
      }

      .ivu-menu-submenu-title {
        i {
          margin-right: 0;
        }

        .ivu-icon-ios-arrow-down {
          display: none;
        }
      }
    }
  }
}

.page {
  height: calc(100% - 80px);
}
</style>
