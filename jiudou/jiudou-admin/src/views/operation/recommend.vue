<template>
  <el-container class="recommend">
    <el-aside width="375px">
      <img src="@/assets/images/cRecommend.png" />
      <div class="area1" @click="showArea1"></div>
      <div class="area2" @click="showArea2"></div>
      <div class="area3" @click="showArea3"></div>
    </el-aside>
    <el-main>
      <div class="recommendList1" v-if="recommendType == 1">
        <div class="title">
          最新好课：{{ dataList.length }}/5<el-button
            size="mini"
            type="primary"
            @click="addCourse"
            >添加</el-button
          >
        </div>
        <div class="inputTips">
          选择的课程将作为最新好课展示。APP端排序同下表中排序
        </div>
        <el-table
          :data="dataList"
          v-loading="loading.tableLoading"
          :header-cell-style="{
            'background-image':
              'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
            color: '#333333',
            height: '40px',
            padding: '0'
          }"
        >
          <el-table-column
            label="云课ID"
            prop="ccourseUuid"
            align="center"
            min-width="200px"
          ></el-table-column>
          <el-table-column
            label="云课标题"
            prop="ccourseName"
            align="center"
            min-width="300px"
            show-overflow-tooltip=""
          ></el-table-column>
          <el-table-column
            label="老师"
            prop="ccourseTeacherName"
            align="center"
          ></el-table-column>
          <el-table-column
            label="价格"
            prop="ccoursePrice"
            align="center"
            :formatter="formatPrice"
          ></el-table-column>
          <el-table-column
            label="云课分类"
            prop="ccourseType"
            align="center"
            :formatter="formatCourseType"
          ></el-table-column>
          <!-- <el-table-column label="开课用户" align="center" width="300">
            <div slot-scope="scope" class="info">{{scope.row.creatorName}}({{scope.row.mobile}})</div>
          </el-table-column> -->
          <el-table-column label="置顶级别" align="center" width="80">
            <div slot-scope="scope">{{ scope.row.sort }}</div>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <div slot-scope="scope">
              <el-button size="mini" type="text" @click="setTop(scope.row)"
                >置顶级别</el-button
              >
              <el-button size="mini" type="text" @click="handleEdit(scope.row)"
                >删除</el-button
              >
            </div>
          </el-table-column>
        </el-table>
      </div>
      <div class="recommendList2" v-if="recommendType == 2">
        <div class="title">
          精选课程：{{ dataList.length
          }}<el-button size="mini" type="primary" @click="addCourse"
            >添加</el-button
          >
        </div>
        <div class="inputTips">
          选择的课程将设为精选课程，其中将随机展示5个在推荐页
        </div>
        <el-table
          :data="dataList"
          v-loading="loading.tableLoading"
          :header-cell-style="{
            'background-image':
              'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
            color: '#333333',
            height: '40px',
            padding: '0'
          }"
        >
          <el-table-column
            label="云课ID"
            prop="ccourseUuid"
            align="center"
            min-width="200px"
          ></el-table-column>
          <el-table-column
            label="云课标题"
            prop="ccourseName"
            align="center"
            min-width="300px"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="老师"
            prop="ccourseTeacherName"
            align="center"
          ></el-table-column>
          <el-table-column
            label="价格"
            prop="ccoursePrice"
            align="center"
            :formatter="formatPrice"
          ></el-table-column>
          <el-table-column
            label="云课分类"
            prop="ccourseType"
            align="center"
            :formatter="formatCourseType"
          ></el-table-column>
          <!-- <el-table-column label="开课用户" align="center" width="300">
            <div slot-scope="scope" class="info">{{scope.row.creatorName}}({{scope.row.mobile}})</div>
          </el-table-column> -->
          <el-table-column label="置顶级别" align="center" width="80">
            <div slot-scope="scope">{{ scope.row.sort }}</div>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <div slot-scope="scope">
              <el-button size="mini" type="text" @click="setTop(scope.row)"
                >置顶级别</el-button
              >
              <el-button size="mini" type="text" @click="handleEdit(scope.row)"
                >删除</el-button
              >
            </div>
          </el-table-column>
        </el-table>
      </div>
      <div class="recommendList3" v-if="recommendType == 3">
        <div class="title">
          免费课程：{{ dataList.length }}/20<el-button
            size="mini"
            type="primary"
            @click="addCourse"
            >添加</el-button
          >
        </div>
        <div class="inputTips">选择的课程将展示在推荐页</div>
        <el-table
          :data="dataList"
          v-loading="loading.tableLoading"
          :header-cell-style="{
            'background-image':
              'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
            color: '#333333',
            height: '40px',
            padding: '0'
          }"
        >
          <el-table-column
            label="云课ID"
            prop="ccourseUuid"
            align="center"
            min-width="200px"
          ></el-table-column>
          <el-table-column
            label="云课标题"
            prop="ccourseName"
            align="center"
            min-width="300px"
            show-overflow-tooltip=""
          ></el-table-column>
          <el-table-column
            label="老师"
            prop="ccourseTeacherName"
            align="center"
          ></el-table-column>
          <el-table-column
            label="价格"
            prop="ccoursePrice"
            align="center"
            :formatter="formatPrice"
          ></el-table-column>
          <el-table-column
            label="云课分类"
            prop="ccourseType"
            align="center"
            :formatter="formatCourseType"
          ></el-table-column>
          <!-- <el-table-column label="开课用户" align="center" width="300">
            <div slot-scope="scope" class="info">{{scope.row.creatorName}}({{scope.row.mobile}})</div>
          </el-table-column> -->
          <el-table-column label="置顶级别" align="center" width="80">
            <div slot-scope="scope">{{ scope.row.sort }}</div>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <div slot-scope="scope">
              <el-button size="mini" type="text" @click="setTop(scope.row)"
                >置顶级别</el-button
              >
              <el-button size="mini" type="text" @click="handleEdit(scope.row)"
                >删除</el-button
              >
            </div>
          </el-table-column>
        </el-table>
      </div>
    </el-main>
    <el-dialog
      :visible.sync="isSelectShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="1000px"
      class="selectModal"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>选择云课</div>
        </div>
      </template>
      <el-input
        size="small"
        v-model="keyWord"
        placeholder="云课ID、云课标题、老师"
        style="width: 200px"
        @keyup.enter.native="courseSerch"
      ></el-input>
      <el-button
        size="small"
        type="primary"
        icon="el-icon-search"
        @click="courseSerch"
      ></el-button>
      <el-table
        :data="addDataList"
        v-loading="loading.selectTableLoading"
        style="margin-top:15px;"
        height="400"
        @selection-change="selectChange"
        :header-cell-style="{
          'background-image':
            'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
          color: '#333333',
          height: '40px',
          padding: '0'
        }"
      >
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column
          label="云课ID"
          prop="ccourseUuid"
          align="center"
          min-width="200px"
        ></el-table-column>
        <el-table-column
          label="云课标题"
          prop="ccourseName"
          align="center"
          min-width="200px"
        ></el-table-column>
        <el-table-column
          label="老师"
          prop="ccourseTeacherName"
          align="center"
        ></el-table-column>
        <el-table-column
          label="价格"
          prop="ccoursePrice"
          align="center"
          :formatter="formatPrice"
        ></el-table-column>
        <el-table-column
          label="云课分类"
          prop="ccourseType"
          align="center"
          :formatter="formatCourseType"
        ></el-table-column>
        <el-table-column label="开课用户" align="center" width="200">
          <div slot-scope="scope" class="info">
            {{ scope.row.creatorName }}({{ scope.row.mobile }})
          </div>
        </el-table-column>
      </el-table>
      <span slot="footer">
        <el-button
          size="small"
          type="primary"
          :loading="loading.selectLoadingSure"
          @click="sureAdd"
          >确定</el-button
        >
        <el-button size="small" @click="isSelectShow = false">取消</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import axios from "@/libs/api.request";
import common from "@/utils/common";
// import { format } from '@/utils/datetime'

export default {
  data() {
    return {
      keyWord: "",
      recommendType: 1,
      isSelectShow: false,
      dataList: [],
      addDataList: [],
      selectedList: [],
      loading: {
        tableLoading: false,
        selectTableLoading: false,
        selectLoadingSure: false
      }
    };
  },
  beforeDestroy() {
    this.recommendType = 1;
  },
  methods: {
    loadData() {
      this.loading.tableLoading = true;
      axios
        .request({
          method: "post",
          url: "v1/ccOfReco/selCCListOfReco",
          data: {
            recoType: this.recommendType
          }
        })
        .then(res => {
          this.loading.tableLoading = false;
          let ret = res.data;
          if (ret.code === 200) {
            this.dataList = ret.data;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    //删除
    handleEdit(row) {
      this.$confirm("<div>是否确定删除推荐课程？", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "v1/ccOfReco/batchDelCCsOfReco",
              data: {
                selectedIdsStr: row.selectedId,
                recoType: this.recommendType
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.loadData();
                this.$message({
                  type: "success",
                  message: ret.msg
                });
              }
            });
        })
        .catch(() => {});
    },
    // 云课类型
    formatCourseType(row) {
      return common.mathCourseType(row.ccourseType);
    },
    //云课价格类型
    formatPrice(row) {
      if (row) {
        if (row.ccoursePrice == 0) {
          return "免费";
        } else {
          return row.ccoursePrice / 100;
        }
      }
    },
    //云课状态
    courseStatus(row) {
      return common.mathCourseStatus(row.cCStatus);
    },
    showArea1() {
      this.recommendType = 1;
      this.loadData();
    },
    showArea2() {
      this.recommendType = 2;
      this.loadData();
    },
    showArea3() {
      this.recommendType = 3;
      this.loadData();
    },
    //加载添加分类列表data
    loadAddData() {
      this.loading.selectTableLoading = true;
      axios
        .request({
          method: "post",
          url: "v1/cCourse/selCCListNotInThisReco",
          data: {
            recoType: this.recommendType,
            searchWords: this.keyWord
          }
        })
        .then(res => {
          this.loading.selectTableLoading = false;
          let ret = res.data;
          if (ret.code === 200) {
            this.addDataList = ret.data;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    addCourse() {
      this.loadAddData();
      this.isSelectShow = true;
    },
    courseSerch() {
      this.loadAddData();
    },
    selectChange(select) {
      this.selectedList = select;
    },
    sureAdd() {
      let arr = [];
      this.selectedList.forEach(element => {
        arr.push(element.ccourseId);
      });
      this.loading.selectLoadingSure = true;
      axios
        .request({
          method: "post",
          url: "/v1/ccOfReco/batchInsCCToAReco",
          data: {
            ccIds: arr.join(","),
            recoType: this.recommendType
          }
        })
        .then(res => {
          this.loading.selectLoadingSure = false;
          let ret = res.data;
          if (ret.code === 200) {
            this.isSelectShow = false;
            this.loadData();
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    // 置顶级别
    setTop(row) {
      this.$prompt("", "置顶级别", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: row.sort,
        inputPattern: /^[+]{0,1}(\d+)$/,
        inputErrorMessage: "请输入非负整数"
      })
        .then(({ value }) => {
          axios
            .request({
              method: "post",
              url: "v1/ccOfReco/sortCCToAReco",
              data: {
                selectedId: row.selectedId,
                recoType: this.recommendType,
                sort: value
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                this.$message({
                  type: "success",
                  message: "置顶更新成功"
                });
                this.loadData();
              } else {
                this.$message({
                  type: "warning",
                  message: ret.msg
                });
              }
            });
        })
        .catch(() => {});
    }
  },
  mounted() {
    this.loadData();
  }
};
</script>

<style lang="scss">
.recommend {
  margin: 22px 20px;
  .el-aside {
    overflow: hidden;
    height: 961px;
    img {
      width: 375px;
      position: absolute;
      z-index: -1;
    }
    .area1 {
      width: 375px;
      height: 225px;
      cursor: pointer;
    }
    .area2 {
      width: 375px;
      height: 277px;
      margin-top: 8px;
      cursor: pointer;
    }
    .area3 {
      width: 375px;
      height: 444px;
      margin-top: 7px;
      cursor: pointer;
    }
    .area1:hover,
    .area2:hover,
    .area3:hover {
      opacity: 1;
      color: transparent;
      border-color: transparent;
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
  .el-main {
    margin: 0;
    padding-right: 0;
    .recommendList1,
    .recommendList2,
    .recommendList3 {
      background: #ffffff;
      margin-left: 0px;
      padding: 15px;
      .title {
        overflow: hidden;
        .el-button {
          float: right;
        }
      }
      .el-table {
        margin-top: 15px;
      }
      .el-table::before {
        height: 0;
      }
    }
    .recommendList2 {
      margin-top: 233px;
    }
    .recommendList3 {
      margin-top: 517px;
    }
  }
  .selectModal .el-table::before {
    height: 0;
  }
}
</style>
