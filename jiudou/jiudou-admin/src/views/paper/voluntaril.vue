<template>
  <el-container class="voluntaril">
    <el-header style="height: 50px">
      <span @click="toPaper" style="cursor:pointer;color:#2BA1F4;"
        >试卷管理</span
      >
      <i class="el-icon-arrow-right"></i> <span>自动组卷</span>
    </el-header>
    <el-container>
      <el-aside width="310px">
        <el-form v-model="selectForm" size="small">
          <el-form-item label="题库">
            <el-select v-model="selectForm.libType" @change="handleChange">
              <el-option label="已购题库" value="0"></el-option>
              <el-option label="我的题库" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="selectForm.libType == 0" style="margin-left:40px">
            <el-select
              v-model="selectForm.comLib"
              @change="comTkSearch"
              size="small"
              clearable
            >
              <el-option
                v-for="item in comTKList"
                :key="item.id"
                :label="item.sblName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="selectForm.libType == 1" style="margin-left:40px">
            <el-cascader
              style="width:215px"
              v-model="selectForm.myLib"
              :options="myTKList"
              @change="myTkSearch"
              :props="myTkProps"
              clearable
            ></el-cascader>
            <!-- <el-select
              v-model="selectForm.myLib"
              @change="myTkSearch"
              size="small"
              clearable
            >
              <el-option
                v-for="item in myTKList"
                :key="item.sblId"
                :label="item.sblName"
                :value="item.id"
              ></el-option>
            </el-select> -->
          </el-form-item>
        </el-form>
        <div v-if="comTkTips.length > 0">
          <el-input
            size="small"
            placeholder="输入关键字进行过滤"
            v-model="filterText"
          ></el-input>
          <el-tree
            ref="tipTree"
            :data="comTkTips"
            show-checkbox
            node-key="tipId"
            @check-change="getChecked"
            :props="treeProps"
            default-expand-all
            :filter-node-method="filterNode"
            @check="handleClickNode"
          ></el-tree>
        </div>
        <div v-if="myTkTips.length > 0">
          <el-input
            size="small"
            placeholder="输入关键字进行过滤"
            v-model="myTipFilterText"
          ></el-input>
          <el-tree
            ref="myTipTree"
            :data="myTkTips"
            show-checkbox
            node-key="tipText"
            @check-change="myTipGetChecked"
            :props="myLibTreeProps"
            default-expand-all
            :filter-node-method="myTipfilterNode"
            @check="handleClickNode"
          ></el-tree>
        </div>
      </el-aside>
      <el-main>
        <div class="lisTitle">
          <span class="verLine"></span>
          <span>已选知识点</span>
          <el-button size="medium" type="text" @click="handleEmptyTips"
            >清空</el-button
          >
        </div>
        <div class="emptyTipTs" v-if="tipTags.length == 0">
          请从左侧选择题库和知识点
        </div>
        <el-tag
          v-for="(tag, index) in tipTags"
          @close="handleClose(tag)"
          :key="index"
          closable
        >
          {{ tag.name }}
        </el-tag>
        <div class="lisTitle" style="margin-top:20px">
          <span class="verLine"></span>
          <span>题量与分值设置</span>
          <span>(注：总题数不能超过50题)</span>
          <span
            >已选题数： {{ totalNum }} 题
            <span style="margin-left:15px"
              >总分： {{ totalSore }} 分</span
            ></span
          >
        </div>
        <el-table
          :data="tableData"
          stripe
          border
          v-if="tableData.length > 0"
          :header-cell-style="{
            'background-image':
              'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
            color: '#333333',
            height: '40px',
            padding: '0'
          }"
        >
          <el-table-column
            label="题型"
            align="center"
            prop="name"
            :formatter="formatType"
          ></el-table-column>
          <el-table-column
            label="可选题数"
            align="center"
            prop="number"
          ></el-table-column>
          <el-table-column label="选取题数" align="center">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.selectNum"
                :min="0"
                controls-position="right"
                size="mini"
                :max="scope.row.number"
                @change="handleSelectNum(scope.row)"
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="单题分值" align="center">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.score"
                :min="1"
                controls-position="right"
                size="mini"
                @change="handleSelectScore(scope.row)"
              ></el-input-number>
            </template>
          </el-table-column>
        </el-table>
        <div class="btmBtn">
          <div class="ts">
            先从左侧选择题库和知识点，再按题型设置知识点和分数，即可生成试卷
          </div>
          <el-button
            type="primary"
            @click="doCreatPaper"
            :disabled="totalNum > 0 ? false : true"
            :loading="creatLoading"
            >生成试卷</el-button
          >
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss">
.voluntaril {
  .el-header {
    background: #ffffff;
    line-height: 50px;
    padding-left: 52px;
    padding-right: 20px;
  }
  .el-container {
    padding: 20px 20px 0;
    max-height: 100%;
    overflow-y: auto;
    .el-aside {
      background: #ffffff;
      border-radius: 4px;
      margin-right: 15px;
      width: 100%;
      padding: 30px 25px 30px 25px;
      // max-height: 800px;
      // overflow-y: auto;
      .el-tree {
        background: #fbfbfb;
        padding: 10px 0;
      }
      .el-tree-node__label {
        display: inline-block;
        max-width: 180px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .el-main {
      background: #ffffff;
      border-radius: 4px;
      min-height: 638px;
      padding: 20px;
      position: relative;
      .lisTitle {
        overflow: hidden;
        height: 36px;
        line-height: 36px;
        margin-bottom: 10px;
        .verLine {
          float: left;
          width: 3px;
          height: 16px;
          background: #2ba1f4;
          margin-top: 10px;
          margin-right: 8px;
        }
        .el-button {
          float: right;
        }
        span:nth-child(3) {
          color: #999999;
          font-size: 12px;
        }
        span:nth-child(4) {
          color: #999999;
          float: right;
        }
      }
      .emptyTipTs {
        margin-top: 15px;
        margin-left: 12px;
        font-size: 16px;
        color: #999999;
      }
      .el-tag {
        margin-right: 10px;
        margin-bottom: 5px;
      }
      .el-tag + .el-tag {
        margin-right: 10px;
      }
      .btmBtn {
        text-align: center;
        margin-top: 30px;
        .ts {
          font-size: 12px;
          color: #999999;
          margin-bottom: 20px;
        }
      }
    }
  }
}
</style>

<script>
import axios from "@/libs/api.request";
import common from "@/utils/common";
import timu from "./timu";
import { format } from "@/utils/datetime";

export default {
  components: {
    timu: timu
  },
  data() {
    return {
      myTkProps: {
        checkStrictly: true,
        value: "id",
        label: "sblName",
        emitPath: false,
        expandTrigger: "hover"
      },
      paperId: this.$route.query.paperId,
      comTKList: [], // 公共库列表
      currentComTk: {}, // 选中的当前公共库  查找其courseId
      comTkTips: [], // 选中的当前公共库  查找其courseId
      myTKList: [], // 我的库列表
      myTkTips: [], //我的库知识点
      selectForm: {
        libType: "0",
        myLib: "",
        comLib: "",
        type: "",
        diff: "",
        keywords: "",
        tips: "",
        tipText: ""
      },
      treeProps: {
        children: "children",
        label: "name"
      },
      myLibTreeProps: {
        children: "children",
        label: "tipText"
      },
      filterText: "",
      myTipFilterText: "",
      tipTags: [],
      // table数据
      tableData: [],
      totalNum: 0,
      totalSore: 0,
      creatLoading: false
    };
  },
  mounted() {
    this.initComTkLib();
    this.initMyTkLib();
  },
  watch: {
    filterText(val) {
      this.$refs.tipTree.filter(val);
    },
    myTipFilterText(val) {
      this.$refs.myTipTree.filter(val);
    }
  },
  methods: {
    checkLib(id) {
      axios
        .request({
          method: "post",
          url: "/subject/personalSubjectBankLibrary/hasUnUseBank",
          data: { sblId: id }
        })
        .then(data => {
          let res = data.data;
          if (res.code == 200) {
            if (res.data.unUseBankFlag) {
              this.$alert(
                "该题库中有过期的收费题目，不可使用，已为您隐藏",
                "",
                {
                  confirmButtonText: "确定",
                  center: true,
                  callback: action => {}
                }
              );
            }
          }
        });
    },
    toPaper() {
      this.$router.push({
        path: "/paper/paper"
      });
    },
    handleChange() {
      this.selectForm.comLib = "";
      this.selectForm.myLib = "";
      this.comTkTips = [];
      this.myTkTips = [];
    },
    //点击公共库查询知识点
    comTkSearch() {
      if (this.selectForm.comLib) {
        this.checkLib(this.selectForm.comLib);
        this.currentComTk = this.comTKList.filter((item, i) => {
          return item.id == this.selectForm.comLib;
        });
        this.loadTips();
      } else {
        this.comTkTips = [];
      }
    },
    // 获取公共库知识点
    loadTips() {
      axios
        .request({
          method: "post",
          url: "/subject/chapterTip/treeList",
          data: { courseId: this.currentComTk[0].sblCourseId }
        })
        .then(
          function(data) {
            let res = data.data;
            if (res.code == 200) {
              this.comTkTips = res.data;
              this.$nextTick(() => {
                // 刷新数据时重新选中node
                if (this.$refs.tipTree) {
                  this.$refs.tipTree.setCheckedNodes(this.tipTags);
                }
              });
            }
          }.bind(this)
        );
    },
    //知识点筛选
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 我的知识点筛选
    myTipfilterNode(value, data) {
      if (!value) return true;
      return data.tipText.indexOf(value) !== -1;
    },
    //公共知识点节点选中状态发生变化时的回调
    getChecked(data, status) {
      this.totalSore = 0;
      this.totalNum = 0;
      if (data.parentId != 0) {
        if (status == true) {
          let flag = false;
          for (let index = 0; index < this.tipTags.length; index++) {
            const element = this.tipTags[index];
            if (element.tipId == data.tipId) {
              flag = true;
              break;
            }
          }
          if (!flag) {
            data.sblId = this.selectForm.comLib;
            data.type = 0;
            this.tipTags.push(data);
          }
        } else {
          this.tipTags.forEach((i, index) => {
            if (data.tipId == i.tipId) {
              this.tipTags.splice(index, 1);
            }
          });
        }
      } else {
        if (status == true) {
          data.sblId = this.selectForm.comLib;
          this.tipTags.push(data);
        } else {
          this.tipTags.forEach((i, index) => {
            if (data.tipId == i.tipId) {
              this.tipTags.splice(index, 1);
            }
          });
        }
      }
    },
    //我的知识点节点选中状态发生变化时的回调
    myTipGetChecked(data, status) {
      this.totalSore = 0;
      this.totalNum = 0;
      if (data.parentId != 0) {
        if (status == true) {
          let flag = false;
          for (let index = 0; index < this.tipTags.length; index++) {
            const element = this.tipTags[index];
            if (element.name == data.tipText) {
              flag = true;
              break;
            }
          }
          if (!flag) {
            data.sblId = this.selectForm.myLib;
            data.type = 1;
            data.name = data.tipText;
            this.tipTags.push(data);
          }
        } else {
          this.tipTags.forEach((i, index) => {
            if (i.name == data.tipText) {
              this.tipTags.splice(index, 1);
            }
          });
        }
      } else {
        if (status == true) {
          data.sblId = this.selectForm.myLib;
          this.tipTags.push(data);
        } else {
          this.tipTags.forEach((i, index) => {
            if (data.tipId == i.tipId) {
              this.tipTags.splice(index, 1);
            }
          });
        }
      }
    },
    //选中节点时去请求该知识点的题目
    handleClickNode() {
      let tipIdsArr = [];
      if (this.tipTags.length == 0) {
        this.tableData = [];
      }
      this.tipTags.forEach(element => {
        let obj = {};
        obj.tipId = element.tipId;
        obj.sblId = element.sblId;
        obj.tipName = element.name;
        tipIdsArr.push(obj);
      });
      let QuestionFiveNum = 0; // 所有问答题目数
      let tableDataArr = []; // 处理后的表格数据
      axios
        .request({
          method: "post",
          url: "/subject/subjectBankLibrary/tSubjectReport2",
          data: {
            tips: JSON.stringify(tipIdsArr)
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            ret.data.forEach(item => {
              if (Number(item.name) >= 5 && Number(item.name) < 11) {
                QuestionFiveNum = QuestionFiveNum + item.number;
              } else {
                tableDataArr.push(item);
              }
            });
            tableDataArr.push({
              name: "5",
              number: QuestionFiveNum
            });
            if (ret.data.length === 0) {
              this.tableData = [];
              return;
            }
            this.tableData = tableDataArr;
          } else {
            this.$message({
              type: "error",
              message: `${ret.msg}`
            });
          }
        });
    },
    //删掉右侧知识点
    handleClose(tag) {
      this.tipTags.splice(this.tipTags.indexOf(tag), 1);
      this.totalSore = 0;
      this.totalNum = 0;
      if (this.selectForm.libType == 0) {
        this.$refs.tipTree.setCheckedNodes(this.tipTags);
      } else {
        this.$refs.myTipTree.setCheckedNodes(this.tipTags);
      }
      this.handleClickNode();
    },
    //右上角清空知识点
    handleEmptyTips() {
      this.tipTags = [];
      if (this.selectForm.libType == 0) {
        this.$refs.tipTree.setCheckedNodes([]);
      } else {
        this.$refs.myTipTree.setCheckedNodes([]);
      }
      this.tableData = [];
    },
    myTkSearch() {
      this.checkLib(this.selectForm.myLib);
      this.loadMyLibTip();
    },
    // 加载我的库知识点
    loadMyLibTip() {
      axios
        .request({
          method: "post",
          url: "/subject/subjectBankLibrary/tips",
          data: { libId: this.selectForm.myLib }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.myTkTips = ret.data;
            this.$nextTick(() => {
              // 刷新数据时重新选中node
              if (this.$refs.myTipTree) {
                this.$refs.myTipTree.setCheckedNodes(this.tipTags);
              }
            });
          }
        });
    },
    // 选题的输入框变化事件
    handleSelectNum(row) {
      this.totalNum = 0;
      this.totalSore = 0;
      this.tableData.forEach(element => {
        if (element.selectNum) {
          this.totalNum += element.selectNum;
          if (element.score) {
            this.totalSore += element.selectNum * element.score;
          }
        }
      });
      if (this.totalNum > 50) {
        this.$message({
          message: "总题数不能超过50题",
          type: "warning"
        });
        row.selectNum = 50 - (this.totalNum - row.selectNum);
        this.totalNum = 50;
      }
    },
    // 设置分数的输入框变化事件
    handleSelectScore(row) {
      this.totalSore = 0;
      this.tableData.forEach(element => {
        if (element.selectNum > 0 && element.score) {
          this.totalSore += element.selectNum * element.score;
        }
      });
    },
    //生成试卷
    doCreatPaper() {
      if (this.totalNum <= 0) {
        this.$message({
          message: "请选取题数",
          type: "warning"
        });
        return;
      }
      this.creatLoading = true;
      let tipIdsArr = [];
      let setting = [];
      this.tipTags.forEach(element => {
        let obj = {};
        obj.sblId = element.sblId;
        obj.tipName = element.name;
        obj.tipIds = element.tipId;
        tipIdsArr.push(obj);
      });
      this.tableData.forEach(element => {
        let obj = {};
        if (element.selectNum) {
          obj.tSubject = element.name;
          obj.num = element.selectNum;
          if (element.score > 0) {
            obj.score = element.score;
          } else {
            obj.score = 0;
          }
          setting.push(obj);
        }
      });
      axios
        .request({
          method: "post",
          url: "/tiku/paperItem/autoGenerate", // 自动生成
          data: {
            paperId: this.paperId,
            setting: JSON.stringify(setting),
            tips: JSON.stringify(tipIdsArr)
          }
        })
        .then(res => {
          this.creatLoading = false;
          let ret = res.data;
          if (ret.code == 200) {
            var CountEvent = window.JAnalyticsInterface.Event.CountEvent;
            var cEvent = new CountEvent("auto_generate_paper");
            window.JAnalyticsInterface.onEvent(cEvent);
            this.$router.push({
              path: "/paper/handmade",
              query: {
                paperId: this.paperId
              }
            });
          } else {
            this.$message({
              message: ret.msg,
              type: "warning"
            });
          }
        });
    },
    //时间
    formatDate: function(row) {
      return format(row.createTime);
    },
    //题型
    formatType(row) {
      return common.typeFormat(row.name);
    },
    //小写转换为大写
    convert(num) {
      var nums = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
      var unit = [
        "",
        "十",
        "百",
        "千",
        "万",
        "十",
        "百",
        "千",
        "亿",
        "十",
        "百",
        "千",
        "万亿"
      ];
      var result = "";
      for (var i = 0; i < num.toString().length; i++) {
        var c = num.toString()[i];
        if (c != 0) {
          result += nums[c] + unit[num.toString().length - i - 1];
        } else {
          result += nums[c];
        }
      }
      return result;
    },
    // 加载公共题库列表
    initComTkLib() {
      axios
        .request({
          method: "post",
          url: "/subject/libraryMall/queryMyBuyList",
          data: {
            hideUnUseFlag: true
          }
        })
        .then(
          function(data) {
            let res = data.data;
            if (res.code == 200) {
              this.comTKList = res.data;
            }
          }.bind(this)
        );
    },
    // 加载我的题库
    initMyTkLib() {
      axios
        .request({
          method: "post",
          url: "/subject/personalSubjectBankLibrary/list"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.myTKList = this.removeEmptyChildren(ret.data);
          }
        });
    },
    removeEmptyChildren(data) {
      if (Array.isArray(data)) {
        // 判断是否是数组
        return data.map(item => {
          if (item.children && item.children.length > 0) {
            item.children = this.removeEmptyChildren(item.children); // 递归遍历
          } else {
            delete item.children; // 删除空的children字段
          }
          return item;
        });
      } else if (typeof data === "object") {
        // 判断是否是对象
        if (data.children && data.children.length > 0) {
          data.children = this.removeEmptyChildren(data.children); // 递归遍历
        } else {
          delete data.children; // 删除空的children字段
        }
        return data;
      }
    }
  }
};
</script>
