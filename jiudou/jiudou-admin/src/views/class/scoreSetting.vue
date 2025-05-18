<template>
  <div class="scoreSetting">
    <!-- 选择班级考试 -->
    <el-dialog
      :visible.sync="isSelectClassShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      v-if="isSelectClassShow"
      width="680px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>
            班级考试
          </div>
        </div>
      </template>
      <!-- style="height:200px;overflow-y: auto;margin:0 auto" -->
      <div style="" class="sel-exam">
        <div
          style="height:240px;overflow-y: auto;display: flex;flex-direction:column;justify-content:center;align-items: center;"
          v-if="examList.length == 0"
        >
          暂无考试
        </div>
        <el-checkbox-group v-else class="el-checkbox-group" v-model="checkList">
          <div
            style="height:240px;overflow-y: auto;display: flex;flex-direction:column"
          >
            <el-checkbox
              v-for="(item, index) in examList"
              :key="index"
              :label="item.examId"
              :disabled="!item.isRead"
            >
              <div>
                <span>{{ item.examName }}</span
                ><span
                  :style="{
                    color: item.isRead ? 'green' : 'red',
                    'margin-left': '10px'
                  }"
                  >{{ item.isRead ? "(已批阅)" : "(待批阅)" }}</span
                >
              </div>
            </el-checkbox>
          </div>
        </el-checkbox-group>
      </div>
      <span slot="footer">
        <el-button size="small" type="primary" @click="doAdd">确定</el-button>
        <el-button size="small" @click="isSelectClassShow = false"
          >取消</el-button
        >
      </span>
    </el-dialog>
    <el-header height="50px">
      <span class="myClass" @click="backMyClass">我的班级</span
      ><i class="el-icon-arrow-right"></i>
      <span class="myClass" @click="backClassReport">成绩管理</span
      ><i class="el-icon-arrow-right"></i>
      <span>成绩规则</span>
    </el-header>
    <div class="main">
      <div class="header">
        <div>
          总成绩（{{ usual + final }}分）=平时成绩（{{ usual }}分）+考试成绩（{{
            final
          }}分）
        </div>
        <el-button size="mini" @click="backClassReport">返回</el-button>
      </div>
      <div class="body">
        <div class="title">
          平时成绩（{{
            usual
          }}分）：根据“九斗”APP教学活动数据生成，采用等级赋分制，可选择计分成绩项或修改成绩项的各等级分值。
        </div>
        <el-table
          ref="usual"
          :data="carClassRule"
          style="margin-bottom:45px;"
          @selection-change="usualScoreChange"
        >
          <el-table-column
            width="110px"
            align="center"
            type="selection"
          ></el-table-column>
          <el-table-column
            width="110px"
            label="成绩项"
            align="center"
            prop="name"
          ></el-table-column>
          <el-table-column width="110px" label="满分" align="center" prop="">
            <el-input
              slot-scope="scope"
              v-model="scope.row.total"
              @blur="usualScoreChange"
              @keyup.enter.native="$event.target.blur"
            ></el-input>
          </el-table-column>
          <el-table-column width="110px" align="center" prop="">
            <template slot="header">
              优
              <el-tooltip
                class="item"
                effect="dark"
                content="将进度100%分为优：76%-100%；良：51%-75%；中：26%-50%；差：0-25%共4个等级"
                placement="bottom"
              >
                <img style="width:15px;" src="@/assets/images/icon_help.png" />
              </el-tooltip>
            </template>
            <el-input
              slot-scope="scope"
              v-model="scope.row.excellent"
              @keyup.enter.native="$event.target.blur"
            ></el-input>
          </el-table-column>
          <el-table-column width="110px" label="良" align="center" prop="">
            <el-input
              slot-scope="scope"
              v-model="scope.row.good"
              @keyup.enter.native="$event.target.blur"
            ></el-input>
          </el-table-column>
          <el-table-column width="110px" label="中" align="center" prop="">
            <el-input
              slot-scope="scope"
              v-model="scope.row.medium"
              @keyup.enter.native="$event.target.blur"
            ></el-input>
          </el-table-column>
          <el-table-column width="110px" label="差" align="center" prop="">
            <el-input
              slot-scope="scope"
              v-model="scope.row.bad"
              @keyup.enter.native="$event.target.blur"
            ></el-input>
          </el-table-column>
        </el-table>
        <div class="title">
          考试成绩（{{
            final
          }}分）：由老师根据模板上传各次考试成绩，采用权重比例赋值，可设置计分成绩项的权重分值。
        </div>
        <el-table :data="carPaperRule">
          <el-table-column align="center" width="110px">
            <template slot-scope="scope">
              <el-button
                style="font-size:18px;color:rgb(253,99,104)"
                type="text"
                icon="el-icon-remove-outline"
                @click="removeOption(scope.row)"
              ></el-button>
            </template>
          </el-table-column>
          <el-table-column
            width="300px"
            label="考试名称"
            align="center"
            prop="name"
          >
            <el-input
              slot-scope="scope"
              v-model.trim="scope.row.name"
              @keyup.enter.native="$event.target.blur"
            ></el-input>
          </el-table-column>
          <el-table-column
            width="110px"
            label="卷面满分"
            align="center"
            prop="paper"
          >
            <!-- <el-input
              slot-scope="scope"
              v-model="scope.row.paper"
              @keyup.enter.native="$event.target.blur"
            ></el-input> -->
          </el-table-column>
          <el-table-column
            width="110px"
            label="满分"
            align="center"
            prop="total"
          >
            <el-input
              slot-scope="scope"
              v-model="scope.row.total"
              @blur="finalScoreChange"
              @keyup.enter.native="$event.target.blur"
            ></el-input>
          </el-table-column>
        </el-table>
        <el-button
          class="addOption"
          size="small"
          @click="addOption"
          icon="el-icon-plus"
          >新增成绩项</el-button
        >
      </div>
      <div style="padding-left:32px;">
        <el-button size="small" type="primary" @click="reset"
          >恢复默认</el-button
        >
        <el-button :loading="loading" size="small" type="primary" @click="save"
          >保存</el-button
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.scoreSetting {
  .sel-exam {
    width: 600px;
    margin: 0 auto;
    border: 1px solid #becbd9;
    padding: 10px 0 10px 10px;
    /deep/ .el-checkbox-group .el-checkbox__label.is-checked {
      color: inherit; /* 使用继承的颜色，保持与未选中状态一致 */
    }
  }
  .el-header {
    background: #fff;
    line-height: 50px;
    padding: 0 43px;
    .myClass {
      cursor: pointer;
      color: #2d66a0;
    }
  }
  .main {
    margin: 20px;
    background: #ffffff;
    border-radius: 4px;
    padding-bottom: 20px;
    padding-left: 32px;
    min-width: 865px;
    .header {
      height: 74px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #eaeaea;
      color: #222;
      font-size: 20px;
      font-weight: bold;
      padding-right: 32px;
      .el-button {
        color: #2ba1f4;
        border-color: #2ba1f4;
      }
    }
    .body {
      border-radius: 4px;
      border: 1px solid rgba(190, 203, 217, 1);
      min-width: 833px;
      max-width: 833px;
      padding: 33px 16px 47px 26px;
      margin-bottom: 45px;
      margin-top: 18px;
      .title {
        color: #333;
        font-size: 14px;
        margin-bottom: 10px;
      }
      .el-table--enable-row-hover .el-table__body tr:hover > td {
        background: transparent !important;
      }
      .addOption {
        margin-top: 16px;
        color: #2ba1f4;
        border-color: #2ba1f4;
      }
      input {
        text-align: center;
      }
    }
  }
}
</style>

<script>
import axios from "@/libs/api.request";
export default {
  name: "ScoreSetting",
  data() {
    return {
      classId: "",
      // 成绩
      usual: 0,
      final: 0,
      // 备份，用于重置
      rules: {},
      // 平时成绩
      carClassRule: [],
      // 考试成绩
      carPaperRule: [],
      loading: false,
      checkList: [],
      isSelectClassShow: false,
      examList: [],
      examIds: []
    };
  },
  mounted() {
    let cls = JSON.parse(sessionStorage.getItem("currentClass"));
    this.classId = cls.classId;
    this.loadScoreRules();
    this.getClassExamList();
  },
  methods: {
    getClassExamList() {
      axios
        .request({
          method: "post",
          url: "/exam/feign/exam/queryClassExamList",
          data: {
            classId: this.classId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.examList = ret.data;
          } else {
            this.$message({
              type: "success",
              message: ret.msg
            });
          }
        });
    },
    backMyClass() {
      this.$router.go(-2);
    },
    backClassReport() {
      this.$router.back();
      sessionStorage.setItem("isScore", true);
    },
    // 加载成绩规则
    loadScoreRules() {
      axios
        .request({
          method: "post",
          // url: "clazz/v4/achievement/rule",
          url: "/clazz/v4/achievement/queryRule",
          data: {
            classId: this.classId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            // 平时成绩
            let carClassRule = JSON.parse(ret.data.carClassRule);
            var array = [];
            array.push(Object.assign({ name: "签到" }, carClassRule.sign));
            array.push(Object.assign({ name: "应答" }, carClassRule.answer));
            array.push(Object.assign({ name: "作业" }, carClassRule.exercise));
            array.push(Object.assign({ name: "云课" }, carClassRule.ccourse));

            this.carClassRule = array;
            // 考试成绩
            this.carPaperRule = JSON.parse(ret.data.carPaperRule);
            // 备份
            this.rules.carClassRule = JSON.parse(JSON.stringify(array));
            this.rules.carPaperRule = JSON.parse(ret.data.carPaperRule);
            this.$nextTick(() => {
              this.carClassRule.forEach(element => {
                this.$refs.usual.toggleRowSelection(
                  element,
                  element.total !== undefined && element.total > 0
                );
              });
            });
            // 汇总
            this.usual = 0;
            this.carClassRule.forEach(element => {
              this.usual += parseInt(element.total);
            });
            this.final = 0;
            this.carPaperRule.forEach(element => {
              this.final += parseInt(element.total);
            });
          }
        });
    },
    // 平时成绩改变
    usualScoreChange() {
      this.usual = 0;
      this.$refs.usual.selection.forEach(element => {
        this.usual += parseInt(element.total);
      });
    },
    // 考试成绩改变
    finalScoreChange() {
      this.final = 0;
      this.carPaperRule.forEach(element => {
        this.final += parseInt(element.total);
      });
    },
    // 移除选项
    removeOption(row) {
      this.final -= parseInt(row.total);
      this.carPaperRule.splice(this.carPaperRule.indexOf(row), 1);
    },
    // 添加选项
    addOption() {
      this.isSelectClassShow = true;
      this.checkList = [];
      this.carPaperRule.forEach(i => {
        if (i.examId) {
          this.checkList.push(i.examId);
        }
      });
    },
    doAdd() {
      this.carPaperRule = [];
      this.checkList.forEach(i => {
        this.examList.forEach(k => {
          if (k.examId == i) {
            this.carPaperRule.push({
              name: k.examName,
              total: 10,
              paper: k.score,
              examId: k.examId
            });
          }
        });
      });
      this.carPaperRule = Array.from(
        new Map(this.carPaperRule.map(item => [item.examId, item]))
      ).map(([examId, item]) => item);
      this.isSelectClassShow = false;
    },
    // 重置
    reset() {
      this.$confirm("重置规则后，学生成绩将重新计算, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        axios
          .request({
            method: "post",
            url: "/clazz/v4/achievement/resetDefaultRule",
            data: {
              classId: this.classId
            }
          })
          .then(res => {
            let ret = res.data;
            if (ret.code == 200) {
              this.$message({
                type: "success",
                message: ret.msg
              });
              this.loadScoreRules();
            } else {
              this.$message({
                type: "warning",
                message: ret.msg
              });
            }
          });
      });
    },
    // 保存
    save() {
      let classRule = {};
      this.$refs.usual.selection.forEach(element => {
        if (element.name == "签到") {
          classRule.sign = element;
        }
        if (element.name == "应答") {
          classRule.answer = element;
        }
        if (element.name == "作业") {
          classRule.exercise = element;
        }
        if (element.name == "云课") {
          classRule.ccourse = element;
        }
      });

      for (let i = 0; i < this.carPaperRule.length; i++) {
        if (this.carPaperRule[i].name.length == 0) {
          this.$message({
            type: "warning",
            message: "考试名称不能为空，请检查"
          });
          return;
        }
      }
      this.loading = true;
      axios
        .request({
          method: "post",
          url: "/clazz/v4/achievement/resetRuleV2",
          data: {
            classId: this.classId,
            classRule: JSON.stringify(classRule),
            paperRule: JSON.stringify(this.carPaperRule)
          }
        })
        .then(res => {
          this.loading = false;
          let ret = res.data;
          if (ret.code == 200) {
            this.$message({
              type: "success",
              message: ret.msg
            });
            this.backClassReport();
            sessionStorage.setItem("isSaveScore", true);
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        })
        .catch(() => {
          this.loading = false;
          this.$message({
            type: "warning",
            message: "服务异常，请稍后重试"
          });
        });
    }
  }
};
</script>
