<template>
  <div class="classReport">
    <div>
      <el-header height="50px">
        <span class="myClass" @click="backMyClass">我的班级</span
        ><i class="el-icon-arrow-right"></i><span>{{ cls.classname }}</span>
      </el-header>
      <div class="classReport-main">
        <div
          style="display: flex;align-items: center;justify-content: space-between"
        >
          <div class="className">{{ cls.classname }}</div>
          <el-dropdown
            class="editButton"
            trigger="click"
            :hide-on-click="false"
          >
            <i class="el-icon-more"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="editClassInfo"
                >班级设置
                <i
                  class="el-icon-arrow-right"
                  style="color:#0177D5;font-weight:bold;margin-left:143px;"
                ></i>
              </el-dropdown-item>
              <el-dropdown-item divided
                >锁定
                <el-switch
                  v-model="cls.isLock"
                  :active-value="1"
                  :inactive-value="0"
                  @change="lockClass"
                  active-color="#0177D5"
                  inactive-color="#F0F1F5"
                  style="margin-left:150px;"
                ></el-switch>
                <div style="color: #999;font-size: 12px;">
                  锁定后学生不能加入和退出班级
                </div>
              </el-dropdown-item>
              <el-dropdown-item
                >结课
                <el-switch
                  v-model="cls.status"
                  :active-value="1"
                  :inactive-value="0"
                  @change="closeClass"
                  active-color="#0177D5"
                  inactive-color="#F0F1F5"
                  style="margin-left:150px;"
                ></el-switch>
                <div style="color: #999;font-size: 12px;">
                  结课后数据归档，老师不能发起活动
                </div>
              </el-dropdown-item>
              <el-dropdown-item divided @click.native="deleteClass()"
                >删除
                <i
                  class="el-icon-delete"
                  style="color:#0177D5;margin-left:170px;"
                ></i>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div
          style="color:#666;font-size:14px;margin-top:20px;margin-bottom:37px;"
        >
          <span>课程：{{ cls.coursename }}</span>
          <span style="margin:0 38px">云课：{{ cls.cCourseName }}</span>
          <span>创建时间：{{ formatTime(cls.addTime) }}</span>
        </div>
        <el-tabs v-model="activeName" @tab-click="tabClick">
          <el-tab-pane label="班级课件" name="zero">
            <courseWare></courseWare>
          </el-tab-pane>
          <el-tab-pane label="教学活动" name="first">
            <!-- <tea-report v-if="activeName == 'first'"></tea-report> -->
            <stuActivitiesNew v-if="activeName == 'first'"></stuActivitiesNew>
          </el-tab-pane>
          <el-tab-pane label="教学统计" name="second">
            <stuActivities
              :className="cls.classname"
              v-if="activeName == 'second'"
            ></stuActivities>
          </el-tab-pane>
          <el-tab-pane label="讨论区" name="third">
            <classDiscuss v-if="activeName == 'third'"></classDiscuss>
          </el-tab-pane>
          <el-tab-pane label="云课进度" name="fourth">
            <cloud-progress></cloud-progress>
          </el-tab-pane>
          <el-tab-pane label="成绩管理" name="fifth">
            <score-report v-if="activeName == 'fifth'"></score-report>
          </el-tab-pane>
          <!-- <el-tab-pane label="教学活动新" name="fourth">
            <teaActivity v-if="activeName == 'fourth'"></teaActivity>
          </el-tab-pane> -->
          <!-- <el-tab-pane label="教学活动新" name="sixth">
            <stuActivitiesNew v-if="activeName == 'sixth'"></stuActivitiesNew>
          </el-tab-pane> -->
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.classReport {
  .el-header {
    background: #fff;
    line-height: 50px;
    padding: 0 43px;
    .myClass {
      cursor: pointer;
      color: #2d66a0;
    }
  }
  .classReport-main {
    margin: 20px;
    background: #ffffff;
    border-radius: 4px;
    min-height: 700px;
    padding: 32px;
    .className {
      color: #222;
      font-size: 20px;
      font-weight: bold;
    }
    .editButton {
      margin-right: 10px;
      font-size: 22px;
      color: #39bcf9;
      cursor: pointer;
    }
  }
}
</style>

<script>
import axios from "@/libs/api.request";
import { format } from "@/utils/datetime";
import teaReport from "./teaReport";
import cloudProgress from "./cloudProgress";
import scoreReport from "./scoreReport";
import courseWare from "./courseWare_1";
import teaActivity from "./teaActivity.vue";
import classDiscuss from "./classDiscuss.vue";
import stuActivities from "./stuActivities.vue";
import stuActivitiesNew from "./stuActivitiesNew.vue";
export default {
  components: {
    "tea-report": teaReport,
    "cloud-progress": cloudProgress,
    "score-report": scoreReport,
    courseWare,
    teaActivity,
    classDiscuss,
    stuActivities,
    stuActivitiesNew
  },
  data() {
    return {
      // activeName: this.$store.state.classRoom.classTabName,
      activeName: sessionStorage.getItem("bjIndex")
        ? sessionStorage.getItem("bjIndex")
        : "zero",
      cls: {}
    };
  },
  mounted() {
    this.cls = JSON.parse(sessionStorage.getItem("currentClass"));
    this.bus.$on("classInfoChanged", () => {
      this.cls = JSON.parse(sessionStorage.getItem("currentClass"));
    });
    if (sessionStorage.getItem("isScore")) {
      this.activeName = "fifth";
      this.show = true;
      sessionStorage.removeItem("isScore");
    }
  },
  destroyed() {
    this.bus.$off("classInfoChanged");
  },
  methods: {
    backMyClass() {
      this.$router.push({
        path: "/class/myClass"
      });
    },
    editClassInfo() {
      this.$router.push({
        path: "/class/classInfo"
      });
    },
    tabClick(tab) {
      // this.$store.commit("setClassTabName", tab.name);
      sessionStorage.setItem("bjIndex", tab.name);
      if (tab.name == "third") {
        this.show = true;
      } else if (tab.name == "first") {
      }
    },
    // 锁定班级
    lockClass() {
      axios
        .request({
          method: "post",
          url: "/clazz/v4/clazz/lockClazz",
          data: {
            classId: this.cls.classId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.$message({
              type: "success",
              message: ret.msg
            });
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
            if (this.cls.isLock == 1) {
              this.cls.isLock = 0;
            } else {
              this.cls.isLock = 1;
            }
          }
        })
        .catch(error => {
          this.$message({
            type: "warning",
            message: error.message
          });
          if (this.cls.isLock == 1) {
            this.cls.isLock = 0;
          } else {
            this.cls.isLock = 1;
          }
        });
    },
    // 结课
    closeClass() {
      axios
        .request({
          method: "post",
          url: "/clazz/v4/clazz/doneClazz",
          data: {
            classId: this.cls.classId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.$message({
              type: "success",
              message: ret.msg
            });
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
            if (this.cls.status == 1) {
              this.cls.status = 0;
            } else {
              this.cls.status = 1;
            }
          }
        })
        .catch(error => {
          this.$message({
            type: "warning",
            message: error.message
          });
          if (this.cls.status == 1) {
            this.cls.status = 0;
          } else {
            this.cls.status = 1;
          }
        });
    },
    // 删除班级
    deleteClass() {
      this.$confirm(
        "你确定要删除班级" + this.cls.classname + "吗？删除后无法恢复",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/clazz/v4/clazz/deleteClazz",
              data: {
                classId: this.cls.classId
              }
            })
            .then(
              function(data) {
                let ret = data.data;
                if (ret.code === 200) {
                  this.$message({
                    type: "success",
                    message: ret.msg
                  });
                  this.$router.back();
                } else {
                  this.$message({
                    type: "error",
                    message: ret.msg
                  });
                }
              }.bind(this)
            );
        })
        .catch(() => {});
    },
    formatTime(time) {
      if (time) {
        return format(time);
      }
      return "";
    }
  }
};
</script>
