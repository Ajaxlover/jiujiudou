<template>
  <div class="startSign">
    <div class="header">
      <span class="returnBtn" @click="goBack"
        ><i class="el-icon-back"></i>返回</span
      >
      <span style="color:#fff;font-size:14px">点击头像可修改学生签到情况</span>
      <div class="setSignContent" v-if="finishVisible">
        <!-- <span style="color:#fff;font-size:14px">点击头像可修改学生签到情况</span> -->
        <span class="cancelSign" @click="cancelSign">取消</span>
        <span class="finishSign" @click="finishSign">结束</span>
      </div>
    </div>
    <div class="main">
      <div v-if="visible">
        <div class="sendText">发起签到</div>
        <div class="setTime">
          <div
            style="width:407px;height:78px;border:1px solid #1c272e;border-radius:4px;padding-top:20px;margin:0 auto"
          >
            <span style="color:#1c272e;font-size:24px;">签到时长</span>
            <el-select
              v-model="selectTime"
              size="small"
              style="width:100px;margin-left:30px;"
            >
              <el-option label="3分钟" value="180"></el-option>
              <el-option label="5分钟" value="300"></el-option>
              <el-option label="10分钟" value="600"></el-option>
            </el-select>
          </div>
          <div
            style="margin:107px;padding:16px;width:221px; height:221px;border-radius:50%;border:1px solid #2ba1f4;margin:91px auto"
          >
            <el-button
              class="startButton"
              type="primary"
              @click="creatSign"
              circle
              >开始</el-button
            >
          </div>
        </div>
      </div>
      <div class="signRecord" v-if="!visible">
        <div style="color:#1c272e;font-size:50px;text-align:center;with:100%">
          {{ minutes }} : {{ seconds }}
        </div>
        <el-radio-group
          v-model="signStatus"
          size="medium"
          style="margin-top:20px"
          @change="changeSignList"
        >
          <el-radio-button label="2">已签到{{ signedNum }}人</el-radio-button>
          <el-radio-button label="1">未签到{{ noSignNum }}人</el-radio-button>
        </el-radio-group>
        <div class="stuListContent">
          <div v-for="(item, index) in stuList" :key="index">
            <el-dropdown
              class="editHead"
              trigger="click"
              @command="handleCommand"
            >
              <div style="with: 70px; height: 60px">
                <img
                  v-if="item.stuPic"
                  :src="item.stuPic"
                  alt=""
                  class="stuPic"
                  style="border-radius:50%;with: 60px; height: 60px;border:2px solid #fff;"
                />
                <img
                  v-else
                  src="@/assets/images/userPic.png"
                  alt=""
                  class="stuPic"
                  style="border-radius:50%;with: 60px; height: 60px;border:2px solid #fff;"
                />
                <span
                  class="signType"
                  v-if="
                    item.status != 0 && item.status != 1 && item.status != 2
                  "
                  v-html="setSignTypeContent(item.status)"
                ></span>
              </div>
              <!-- 0未签到 1已签到 2缺勤 3 病假 4 事假5迟到 -->
              <el-dropdown-menu slot="dropdown" style="margin:0 auto">
                <el-dropdown-item :command="changeSignStatu(item.stuId, '1')"
                  >设置为已签到</el-dropdown-item
                >
                <el-dropdown-item :command="changeSignStatu(item.stuId, '2')"
                  >缺勤</el-dropdown-item
                >
                <el-dropdown-item :command="changeSignStatu(item.stuId, '3')"
                  >病假</el-dropdown-item
                >
                <el-dropdown-item :command="changeSignStatu(item.stuId, '4')"
                  >事假</el-dropdown-item
                >
                <el-dropdown-item :command="changeSignStatu(item.stuId, '5')"
                  >迟到</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
            <div class="stuName">{{ item.stuName }}</div>
            <div class="stuNumber">{{ item.stuNumber }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.startSign {
  height: 100%;
  background: #f0f1f5;
  padding-top: 60px;
  .header {
    background: #1c272e;
    height: 60px;
    padding-left: 52px;
    padding-right: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    top: 0;
    width: 100%;
    .cancelSign {
      color: #fff;
      border: 1px solid #979797;
      font-size: 18px;
      border-radius: 4px;
      padding-top: 7px;
      padding-bottom: 7px;
      padding-left: 27px;
      padding-right: 27px;
      margin-left: 57px;
      cursor: pointer;
    }
    .finishSign {
      color: #fff;
      border: 1px solid #f59868;
      font-size: 18px;
      border-radius: 4px;
      padding-top: 7px;
      padding-bottom: 7px;
      padding-left: 27px;
      padding-right: 27px;
      margin-left: 20px;
      background: #f59868;
      cursor: pointer;
    }
    .setSignContent {
      float: right;
      margin-right: 62px;
    }
    .returnBtn {
      display: inline-block;
      width: 100px;
      height: 34px;
      border-radius: 50px;
      border: 1px solid #fff;
      line-height: 34px;
      text-align: center;
      font-size: 14px;
      color: #fff;
      cursor: pointer;
      i {
        margin-right: 5px;
      }
    }
  }
  .main {
    padding-top: 120px;
    height: 100%;
    overflow-y: auto;
    // background: #1c272e;
    .setTime {
      font-size: 24px;
      color: #1c272e;
      text-align: center;
      margin: 61px auto;
    }
    .sendText {
      color: #1c272e;
      font-weight: bold;
      font-size: 34px;
      text-align: center;
      width: 100%;
    }
    .signRecord {
      text-align: center;
    }
    .startButton {
      width: 189px;
      height: 189px;
      font-size: 40px;
    }
    .stuListContent {
      margin: 50px auto;
      text-align: center;
      margin-left: 200px;
      margin-right: 100px;
      max-width: 80%;
      .stuNumber {
        font-size: 16px;
        color: #1c272e;
        margin-top: 6px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .stuName {
        font-size: 20px;
        color: #1c272e;
        margin-top: 6px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .stuListContent > div {
      width: 110px;
      height: 125px;
      overflow: hidden;
      display: inline-block;
      margin-bottom: 40px;
      margin-right: 75px;
    }
    .stuListContent > div img {
      width: 60px;
      cursor: pointer;
    }
  }
}
</style>

<script>
import axios from "@/libs/api.request";
// import AMap from "AMap";

export default {
  name: "startClaSign",
  props: {
    data: Object
  },
  data() {
    return {
      cls: {},
      signInfo: {},
      selectTime: "300",
      visible: true, //true展示发起界面   false展示记录界面
      finishVisible: false, //是否展示取消签到按钮
      signStatus: "2",
      signedNum: "0",
      noSignNum: "0",
      minutes: 3,
      seconds: 0,
      stuList: [],
      type: 2,
      time2: null,
      time1: null,
      stuId: 0,
      countDown: 0,
      latitude: 0,
      longitude: 0
    };
  },
  mounted() {
    this.cls = JSON.parse(sessionStorage.getItem("currentClass"));
    this.loadSignStatus();
    this.getLocation();
    if (this.countDown === 0) {
      // 该次签到已经结束
      this.visible = true;
    }
  },
  watch: {
    minutes(val) {
      if (isNaN(val)) {
        this.minutes = "签到率";
      }
    }
  },
  methods: {
    goBack() {
      clearInterval(this.time2);
      clearInterval(this.time1);
      this.$emit("close");
    },
    //切换已签到未签到
    changeSignList() {
      this.lodaStuList();
    },
    //获取签到状态
    loadSignStatus() {
      if (this.data.signNo && this.data.signNo > 0) {
        //有存在的签到
        this.visible = false;
        axios
          .request({
            method: "post",
            url: "/clazz/signV2/signInfoTea",
            data: {
              classId: this.cls.classId,
              signNo: this.data.signNo
            }
          })
          .then(res => {
            let ret = res.data;
            if (ret.code === 200) {
              this.lodaStuList();
              if (ret.data.signStatus == 0) {
                //已结束
                this.finishVisible = false;
                this.minutes = "签到率";
                this.seconds =
                  Math.ceil((this.signedNum / this.cls.stuNum) * 100) + "%";
              } else {
                //进行中
                this.finishVisible = true;
                this.countDown = ret.data.countDown;
                if (this.countDown > 0) {
                  this.visible = false;
                }
                this.timer();
              }
            } else {
              this.$message({
                type: "warning",
                message: ret.msg
              });
            }
          });
      } else {
        this.visible = true;
      }
    },
    lodaStuList() {
      axios
        .request({
          method: "post",
          url: "/clazz/signV2/signedInfo",
          data: {
            classId: this.cls.classId,
            signNo: this.data.signNo,
            type: this.signStatus,
            page: 1,
            pagesize: 500
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.stuList = ret.data.signedList;
            if (this.signStatus == 1) {
              this.noSignNum = this.stuList.length;
              this.signedNum = this.cls.stuNum - this.noSignNum;
            } else {
              this.signedNum = this.stuList.length;
              this.noSignNum = this.cls.stuNum - this.signedNum;
            }
            if (ret.data.signStatus == 0) {
              clearInterval(this.time2);
              clearInterval(this.time1);
              this.finishVisible = false;
              this.minutes = "签到率";
              this.seconds =
                Math.ceil((this.signedNum / this.cls.stuNum) * 100) + "%";
            }
          }
        });
    },
    //开始签到
    creatSign() {
      let data = {
        classId: this.cls.classId,
        signDuration: this.selectTime,
        x: this.latitude,
        y: this.longitude
      };
      if (this.data.coursewareId) {
        data.coursewareId = this.data.coursewareId;
      }
      axios
        .request({
          method: "post",
          url: "/v1/courseware/addSign",
          data
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.visible = false;
            this.finishVisible = true;
            this.data.signNo = ret.data.signNo;
            this.countDown = ret.data.countDown;
            this.timer();
            this.lodaStuList();
            this.$message({
              type: "success",
              message: ret.msg
            });
            var CountEvent = window.JAnalyticsInterface.Event.CountEvent;
            var cEvent = new CountEvent("create_sign");
            window.JAnalyticsInterface.onEvent(cEvent);
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    //取消签到
    cancelSign() {
      let data = {
        classId: this.cls.classId,
        signNo: this.data.signNo
      };
      if (this.data.coursewareId) {
        data.coursewareId = this.data.coursewareId;
      }
      axios
        .request({
          method: "post",
          url: "/v1/courseware/removeSign",
          data
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.finishVisible = false;
            this.visible = true;
            clearInterval(this.time1);
            clearInterval(this.time2);
            this.$message({
              type: "success",
              message: ret.msg
            });
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    //结束签到
    finishSign() {
      axios
        .request({
          method: "post",
          url: "/clazz/signV2/finishSign",
          data: {
            classId: this.cls.classId,
            signNo: this.data.signNo
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.finishVisible = false;
            this.minutes = "签到率";
            this.seconds =
              Math.ceil((this.signedNum / this.cls.stuNum) * 100) + "%";
            clearInterval(this.time1);
            clearInterval(this.time2);
            this.$message({
              type: "success",
              message: ret.msg
            });
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    //获取地理位置np
    getLocation() {
      // 检查浏览器是否支持Geolocation API
      if ("geolocation" in navigator) {
        // 获取当前位置的经纬度
        navigator.geolocation.getCurrentPosition(
          position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            this.latitude = latitude || 0;
            this.longitude = longitude || 0;

            console.log(`经度：${longitude}`);
            console.log(`纬度：${latitude}`);
          },
          error => {
            // 处理获取位置失败的情况
            switch (error.code) {
              case error.PERMISSION_DENIED:
                console.error("用户拒绝了位置请求");
                break;
              case error.POSITION_UNAVAILABLE:
                console.error("位置信息不可用");
                break;
              case error.TIMEOUT:
                console.error("获取位置超时");
                break;
              case error.UNKNOWN_ERROR:
                console.error("发生未知错误");
                break;
            }
          }
        );
      } else {
        console.error("浏览器不支持Geolocation API");
      }

      //天地图
      // eslint-disable-next-line no-undef
      // var lo = new T.Geolocation();
      // eslint-disable-next-line no-undef
      // lo.getCurrentPosition(e => {
      //   this.latitude = e.lnglat.lat;
      //   this.longitude = e.lnglat.lng;
      // });
    },
    //轮询 更新列表
    num(n) {
      return n < 10 ? "0" + n : "" + n;
    },
    timer() {
      this.minutes = this.num(parseInt(this.countDown / 60));
      this.seconds = this.num(this.countDown % 60);
      this.timered();
      this.time1 = setInterval(() => {
        if (this.seconds == 0 && this.minutes != 0) {
          this.seconds = 59;
          this.minutes -= 1;
        } else if (this.minutes == 0 && this.seconds == 0) {
          this.seconds = 0;
          clearInterval(this.time2);
          clearInterval(this.time1);
          this.finishVisible = false;
          this.minutes = "签到率";
          this.seconds =
            Math.ceil((this.signedNum / this.cls.stuNum) * 100) + "%";
        } else {
          this.seconds -= 1;
        }
        this.seconds = this.num(parseInt(this.seconds));
        this.minutes = this.num(parseInt(this.minutes));
      }, 1000);
    },
    timered() {
      this.time2 = setInterval(() => {
        this.lodaStuList();
      }, 5000);
    },
    // <!-- 0未签到 1已签到 2缺勤 3 病假 4 事假5迟到 -->
    setSignTypeContent(status) {
      let signType;
      switch (status) {
        case 0:
          signType = "未签到";
          break;
        case 1:
          signType = "已签到";
          break;
        case 2:
          signType = "缺勤";
          break;
        case 3:
          signType =
            '<span style="background:#7ad595;position: absolute;bottom:0;left:0;right:0;color:#fff;border: 1px solid #7ad595;font-size:12px border-radius:15px">病假</span>';
          break;
        case 4:
          signType =
            '<span style="background:#80a7e6;position: absolute;bottom:0;left:0;right:0;color:#fff;border: 1px solid #80a7e6;font-size:12px border-radius:15px">事假</span>';
          break;
        case 5:
          signType =
            '<span style="background:#f5ba68;position: absolute;bottom:0;left:0;right:0;color:#fff;border: 1px solid #f5ba68;font-size:12px border-radius:15px">迟到</span>';
          break;
        default:
          break;
      }
      return signType;
    },
    changeSignStatu(stuId, row) {
      return {
        stuId: stuId,
        row: row
      };
    },
    handleCommand(command) {
      axios
        .request({
          method: "post",
          url: "/clazz/signV2/updateSignTea",
          data: {
            classId: this.cls.classId,
            signNo: this.data.signNo,
            stuId: command.stuId,
            status: command.row
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.lodaStuList();
            this.$message({
              type: "success",
              message: "设置成功"
            });
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    }
  }
};
</script>
